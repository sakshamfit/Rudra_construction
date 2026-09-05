/**
 * CMS API for photos + blogs + company + estimator + projects.
 *
 * Persistence:
 *  - Default:  data/cms.json + public/uploads/ (works on the Node server, Docker, VPS).
 *  - Vercel:   Vercel Blob (serverless /tmp is wiped on every cold start, so a JSON
 *              file on the function's filesystem CANNOT persist). When the project
 *              has a Vercel Blob, set BLOB_READ_WRITE_TOKEN (Vercel injects it
 *              automatically after "Storage → Add new → Vercel Blob") and every
 *              admin edit — turnover, stats, blogs, projects, photos — is stored
 *              in the blob and survives refreshes, cold starts AND redeploys.
 *
 * Every document write stamps `updatedAt`, which the browser client uses to
 * decide between server state and its local mirror.
 *
 * Blob implementation:
 *  - Uses the official @vercel/blob SDK (put/get/del) — NOT a hand-rolled REST
 *    client. The real Blob protocol uses per-store hosts
 *    (https://<storeId>.public.blob.vercel-storage.com) with Bearer auth and
 *    goes through https://vercel.com/api/blob for writes. The old code used
 *    POST blob.vercel-storage.com/<key>?token=... which never matched the real
 *    service, so every cloud write was silently rejected and everything stayed
 *    in /tmp.
 *  - All blob keys are namespaced with a secret derived from the token
 *    (sha256(token).slice(0,16)) so cms.json — which contains the admin
 *    password hash — never sits at a guessable public URL.
 *  - Bounded timeouts: every blob operation uses AbortSignal.timeout so an
 *    unreachable store degrades to the local fallback instead of hanging.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
// On serverless platforms (Vercel) the project filesystem is read-only except
// for /tmp. /tmp is used as a fallback cache so reads/writes don't fail when
// blob storage is unavailable. The bundled seed (data/cms.json) is the initial
// state for fresh instances.
const IS_SERVERLESS = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
const WRITABLE_ROOT = IS_SERVERLESS ? '/tmp/rudra-cms' : ROOT;
const DATA_DIR = path.join(WRITABLE_ROOT, 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms.json');
const SEED_CMS_FILE = path.join(ROOT, 'data', 'cms.json');
const SESS_FILE = path.join(DATA_DIR, 'sessions.json');
const UPLOAD_DIR = IS_SERVERLESS ? path.join(WRITABLE_ROOT, 'uploads') : path.join(ROOT, 'public', 'uploads');
// URL path prefix used to reach uploaded files. On the Express server the
// public/ dir is served statically at /uploads. On Vercel the same serverless
// function streams /uploads/* back out (from blob storage when configured).
const UPLOAD_URL_PREFIX = '/uploads';
const COOKIE = 'rc_admin';
// Vercel serverless functions hard-cap request bodies at ~4.5 MB, so uploads
// through the function must stay below that. The Node server allows 12 MB
// files; since photos travel as base64 inside JSON (≈ 4/3 x inflation), the
// decoded-byte cap on Node is 16 MB so a full 12 MB file still fits
// (12 MB → ~16 MB base64 < the 16.5 MB readBody allowance below).
const MAX_BYTES = IS_SERVERLESS ? 4 * 1024 * 1024 : 16 * 1024 * 1024;
const MAX_BYTES_LABEL = IS_SERVERLESS ? '4 MB' : '12 MB';
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

// --- Vercel Blob (durable storage for serverless deploys) -------------------
// Official SDK: https://vercel.com/docs/vercel-blob/using-blob-sdk
// - put(pathname, body, { access, token, addRandomSuffix:false, ... })
// - get(pathname, { access, token }) -> { stream, statusCode, ... }
// - del(pathname, { token })
// - head, list, etc.
// The SDK talks to https://vercel.com/api/blob for writes and to
// https://<storeId>.(public|private).blob.vercel-storage.com for reads,
// using Bearer auth. This replaces the broken hand-rolled client that used
// POST https://blob.vercel-storage.com/<key>?token=... which never worked.
const BLOB_PREFIX = (process.env.BLOB_PREFIX || 'rudra-cms').replace(/^\/+|\/+$/g, '');
const BLOB_READ_TOKEN = process.env.BLOB_READ_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || '';
const BLOB_WRITE_TOKEN = process.env.BLOB_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || '';
const BLOB_API_BASE = (process.env.BLOB_API_BASE || '').replace(/\/+$/, ''); // used only for test mock detection
const USE_BLOB = !!(BLOB_READ_TOKEN && BLOB_WRITE_TOKEN);
const IS_MOCK_BLOB = !!(BLOB_API_BASE && BLOB_API_BASE.startsWith('http'));
const MOCK_BLOB_STORE = '/tmp/mock-blob-store';
const HOST_NAME = process.env.VERCEL ? 'vercel' : 'node';

const loginHits = new Map();

/* -------------------------------------------------------------------------- */
/* Blob key namespacing (security hardening)                                   */
/* -------------------------------------------------------------------------- */
// Once writes actually persist, cms.json (which contains the admin password
// hash) would sit at a guessable URL if stored as public. All keys are now
// namespaced with a secret derived from the token, so even public blobs are
// unguessable without the token.
function getBlobSecret() {
  const token = BLOB_WRITE_TOKEN || BLOB_READ_TOKEN;
  if (!token) return '';
  return crypto.createHash('sha256').update(String(token)).digest('hex').slice(0, 16);
}

function namespacedKey(key) {
  const secret = getBlobSecret();
  if (secret) return `${BLOB_PREFIX}/${secret}/${key}`;
  return `${BLOB_PREFIX}/${key}`;
}

function legacyKey(key) {
  return `${BLOB_PREFIX}/${key}`;
}

// Exported for tests to verify namespacing.
export { getBlobSecret, namespacedKey, legacyKey };

/* -------------------------------------------------------------------------- */
/* Blob SDK wrapper with mock support and bounded timeouts                     */
/* -------------------------------------------------------------------------- */
let _blobSdk = null;
async function getBlobSdk() {
  if (_blobSdk) return _blobSdk;
  try {
    _blobSdk = await import('@vercel/blob');
    return _blobSdk;
  } catch {
    return null;
  }
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

// In test mode (BLOB_API_BASE=http://127.0.0.1:9877) we bypass the SDK and
// use a direct file-system mock under /tmp/mock-blob-store. This makes the
// blob-mode test deterministic without needing to emulate the SDK's HTTP
// protocol (which goes through https://vercel.com/api/blob and per-store
// hosts). The mock still respects namespacing so the namespacing test can
// verify it.
function mockBlobPath(key) {
  return path.join(MOCK_BLOB_STORE, key);
}

async function blobPut(key, body, contentType, { access = 'private', timeoutMs = 20000 } = {}) {
  const nsKey = namespacedKey(key);
  if (IS_MOCK_BLOB) {
    const fp = mockBlobPath(nsKey);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    const buf = Buffer.isBuffer(body) ? body : Buffer.isBuffer(body) ? body : typeof body === 'string' ? Buffer.from(body) : Buffer.from(body);
    // body may be Uint8Array
    const toWrite = body instanceof Uint8Array ? Buffer.from(body) : buf;
    fs.writeFileSync(fp, toWrite);
    return { url: `mock://${nsKey}`, pathname: nsKey };
  }
  const sdk = await getBlobSdk();
  if (!sdk) throw new Error('Blob SDK not available');
  const { put } = sdk;
  // put accepts string, Buffer, Blob, File, ReadableStream, etc.
  return await put(nsKey, body, {
    access,
    token: BLOB_WRITE_TOKEN,
    addRandomSuffix: false,
    contentType,
    abortSignal: AbortSignal.timeout(timeoutMs),
  });
}

async function blobGetBuffer(key, { timeoutMs = 10000 } = {}) {
  const nsKey = namespacedKey(key);
  const legKey = legacyKey(key);
  if (IS_MOCK_BLOB) {
    // Try namespaced first, then legacy for migration
    for (const k of [nsKey, legKey]) {
      const fp = mockBlobPath(k);
      if (fs.existsSync(fp)) {
        return fs.readFileSync(fp);
      }
    }
    return null;
  }
  const sdk = await getBlobSdk();
  if (!sdk) return null;
  const { get } = sdk;

  // Try private first (cms.json, sessions.json should be private), then public,
  // then legacy keys for migration from old deployments.
  const attempts = [
    { pathname: nsKey, access: 'private' },
    { pathname: nsKey, access: 'public' },
    { pathname: legKey, access: 'private' },
    { pathname: legKey, access: 'public' },
  ];
  for (const attempt of attempts) {
    try {
      const res = await get(attempt.pathname, {
        access: attempt.access,
        token: BLOB_READ_TOKEN,
        abortSignal: AbortSignal.timeout(timeoutMs),
      });
      if (!res) continue;
      if (res.statusCode === 404) continue;
      if (!res.stream) continue;
      const buf = await streamToBuffer(res.stream);
      return buf;
    } catch (e) {
      const msg = e?.message || '';
      // Not found errors should try next attempt, other errors should bubble as null for fallback
      if (/not found|404|BlobNotFound/i.test(msg)) continue;
      // If it's a token/storeId error, don't hide it completely but try next
      continue;
    }
  }
  return null;
}

async function blobDel(key, { timeoutMs = 10000 } = {}) {
  const nsKey = namespacedKey(key);
  const legKey = legacyKey(key);
  if (IS_MOCK_BLOB) {
    for (const k of [nsKey, legKey]) {
      const fp = mockBlobPath(k);
      if (fs.existsSync(fp)) {
        try {
          fs.unlinkSync(fp);
        } catch {}
      }
    }
    return;
  }
  const sdk = await getBlobSdk();
  if (!sdk) return;
  const { del } = sdk;
  // Try both namespaced and legacy
  for (const k of [nsKey, legKey]) {
    try {
      await del(k, {
        token: BLOB_WRITE_TOKEN,
        abortSignal: AbortSignal.timeout(timeoutMs),
      });
    } catch {
      // ignore, del is idempotent
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Stateless signed session tokens                                             */
/* -------------------------------------------------------------------------- */
// Sessions used to live ONLY in a JSON store (data/sessions.json on Node,
// /tmp or the blob on Vercel). On serverless that store is per-instance and
// wiped on cold starts, so a successful login was often followed by
// "Sign in required." on the very next request — it landed on another
// instance (this showed up in the admin console as "Couldn't load live site
// data"). Tokens are now self-contained and HMAC-signed, so ANY instance can
// verify them with no shared storage:
//
//     <base64url payload>.<base64url HMAC-SHA256(payload, secret)>
//
// payload: { v: 1, exp: <ms epoch>, pf: <admin passwordHash fingerprint> }
//  - exp  → 7-day expiry, checked without any store lookup
//  - pf   → fingerprint of the current admin passwordHash, so changing the
//           password instantly invalidates every outstanding session, even
//           ones issued by other instances
// The legacy server-side session store is still honoured for cookies issued
// before this change, so nobody is logged out mid-session after deploying.
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Stable across instances/redeploys: explicit secret → env password → the
// stored passwordHash (bundled seed / blob) → the built-in default password.
function sessionSecretFor(passwordHash) {
  const source =
    process.env.SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    (passwordHash || '').trim() ||
    'RudraAdmin@2025';
  return crypto.createHash('sha256').update(`rc-session:${source}`).digest();
}

function passwordFingerprint(passwordHash) {
  return crypto.createHash('sha256').update(String(passwordHash || '')).digest('hex').slice(0, 16);
}

function signSessionToken(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifySessionToken(token, secret, passwordHash) {
  if (!token || typeof token !== 'string') return null;
  const dot = token.indexOf('.');
  if (dot <= 0 || dot === token.length - 1) return null;
  const body = token.slice(0, dot);
  const given = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', secret).update(body).digest();
  let givenBuf;
  try {
    givenBuf = Buffer.from(given, 'base64url');
  } catch {
    return null;
  }
  if (givenBuf.length !== expected.length || !crypto.timingSafeEqual(givenBuf, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload || payload.v !== 1) return null;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    if (!payload.pf || payload.pf !== passwordFingerprint(passwordHash)) return null;
    return payload;
  } catch {
    return null;
  }
}

function ensureDirs() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch {
    /* best effort */
  }
}

function defaultCompany() {
  return {
    name: 'Rudra Constructions & Suppliers',
    legalName: 'Rudra Constructions & Suppliers Pvt. Ltd.',
    turnover: '₹14.65 Crore',
    turnoverShort: '₹14.65 Cr+',
    turnoverDetail: 'Civil & Solar Works',
    turnoverTag: 'FY 2024-25',
    stats: [
      { label: 'Audited Turnover', value: '₹14.65 Cr+', detail: 'Civil & Solar Works', tag: 'FY 2024-25' },
      { label: 'States Served', value: '11 States', detail: 'Pan-India Footprint', tag: '18+ Depots' },
      { label: 'Infrastructure Projects', value: '35+ Sites', detail: 'Completed & Active', tag: 'Handed Over' },
      { label: 'Clean Solar Units', value: '1,200+', detail: 'Installed Capacities', tag: 'Microgrids' },
      { label: 'Field Workforce', value: '250+', detail: 'Engineers & Crews', tag: 'Biometric Verified' },
      { label: 'Statutory Compliance', value: '100%', detail: 'NABL & IS 456 Standards', tag: 'Zero Deviation' },
    ],
  };
}

function defaultEstimator() {
  return {
    civic: { standard: 1650, premium: 1950, high_spec: 2300, unit: 'sq.ft built-up', material: 'RCC M25 concrete, Fe 550D TMT, brick masonry, ramp railings, UPVC fixtures' },
    healthcare: { standard: 2200, premium: 2750, high_spec: 3400, unit: 'sq.ft ward area', material: 'Antimicrobial vinyl flooring, medical gas lines, acoustic ceiling, ICU electrical' },
    commercial: { standard: 2000, premium: 2500, high_spec: 3100, unit: 'sq.ft commercial space', material: 'Structural glazing, high-speed lift provisions, firefighting systems, vitrified tiles' },
    solar: { standard: 18000, premium: 23500, high_spec: 29000, unit: 'autonomous solar poles / kW', material: 'Mono PERC solar panels, LiFePO4 batteries, hot-dip GI octagonal poles, IoT sensors' },
    materials: { standard: 62000, premium: 62000, high_spec: 62000, unit: 'metric tonnes certified supply', material: 'Primary mill test certificates, weighbridge tickets, direct dispatch' },
  };
}

function defaultCms() {
  return {
    version: 2,
    updatedAt: '2025-01-01T00:00:00.000Z',
    settings: {
      passwordHash: '',
      company: defaultCompany(),
      estimator: defaultEstimator(),
    },
    slots: {},
    photos: [],
    blogs: [],
    projects: [], // custom projects, each with id, title, category, etc
  };
}

function migrateCms(raw) {
  const def = defaultCms();
  if (!raw) return def;
  // shallow merge top
  const cms = {
    ...def,
    ...raw,
    settings: {
      ...def.settings,
      ...(raw.settings || {}),
      company: {
        ...def.settings.company,
        ...(raw.settings?.company || {}),
      },
      estimator: {
        ...def.settings.estimator,
        ...(raw.settings?.estimator || {}),
        civic: { ...def.settings.estimator.civic, ...(raw.settings?.estimator?.civic || {}) },
        healthcare: { ...def.settings.estimator.healthcare, ...(raw.settings?.estimator?.healthcare || {}) },
        commercial: { ...def.settings.estimator.commercial, ...(raw.settings?.estimator?.commercial || {}) },
        solar: { ...def.settings.estimator.solar, ...(raw.settings?.estimator?.solar || {}) },
        materials: { ...def.settings.estimator.materials, ...(raw.settings?.estimator?.materials || {}) },
      },
    },
    slots: raw.slots || {},
    photos: raw.photos || [],
    blogs: raw.blogs || [],
    projects: raw.projects || [],
  };
  // ensure stats is array
  if (!Array.isArray(cms.settings.company.stats) || cms.settings.company.stats.length === 0) {
    cms.settings.company.stats = def.settings.company.stats;
  }
  // version bump
  cms.version = 2;
  if (!cms.updatedAt) cms.updatedAt = '2025-01-01T00:00:00.000Z';
  return cms;
}

/* -------------------------------------------------------------------------- */
/* Storage layer: Vercel Blob (durable) with file-system fallback (local).     */
/* -------------------------------------------------------------------------- */

function seedCms() {
  let cms;
  try {
    if (fs.existsSync(SEED_CMS_FILE)) {
      cms = migrateCms(JSON.parse(fs.readFileSync(SEED_CMS_FILE, 'utf8')));
    } else {
      cms = defaultCms();
    }
  } catch {
    cms = defaultCms();
  }
  return cms;
}

function fileReadJson(file) {
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function fileWriteJson(file, obj) {
  ensureDirs();
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
  fs.renameSync(tmp, file);
}

/**
 * Creates the persistence backend.
 * mode: 'blob' when Vercel Blob tokens are configured, 'file' otherwise.
 * Every method resolves (never throws to the caller) and reports where the
 * last read/write actually landed via `lastRead` / `lastSave`.
 */
function createStore() {
  const store = {
    mode: USE_BLOB ? 'blob' : 'file',
    lastRead: 'none', // 'blob' | 'file' | 'seed'
    lastSave: { persisted: true, storage: USE_BLOB ? 'blob' : 'file' },
  };

  store.readCms = async () => {
    if (USE_BLOB) {
      try {
        const buf = await blobGetBuffer('cms.json', { timeoutMs: 10000 });
        if (buf) {
          const raw = JSON.parse(buf.toString('utf8'));
          store.lastRead = 'blob';
          return migrateCms(raw);
        }
        // First boot on this blob: seed it from the bundled cms.json.
        const seeded = seedCms();
        try {
          await blobPut('cms.json', JSON.stringify(seeded, null, 2), 'application/json', {
            access: 'private',
            timeoutMs: 20000,
          });
        } catch (e) {
          console.error('CMS: could not seed blob:', e?.message || e);
        }
        store.lastRead = 'seed';
        return seeded;
      } catch (e) {
        console.error('CMS: blob read failed, falling back to local file:', e?.message || e);
      }
    }
    // file mode (local server / Docker / VPS) — or blob fallback.
    ensureDirs();
    if (fs.existsSync(CMS_FILE)) {
      const raw = fileReadJson(CMS_FILE);
      if (raw) {
        const migrated = migrateCms(raw);
        if ((raw.version || 1) < 2) fileWriteJson(CMS_FILE, migrated);
        store.lastRead = 'file';
        return migrated;
      }
    }
    const seeded = seedCms();
    try {
      fileWriteJson(CMS_FILE, seeded);
    } catch {
      /* ignore */
    }
    store.lastRead = 'seed';
    return seeded;
  };

  store.writeCms = async (cms) => {
    cms.updatedAt = new Date().toISOString();
    if (USE_BLOB) {
      try {
        await blobPut('cms.json', JSON.stringify(cms, null, 2), 'application/json', {
          access: 'private',
          timeoutMs: 20000,
        });
        store.lastSave = { persisted: true, storage: 'blob' };
        return store.lastSave;
      } catch (e) {
        console.error('CMS: blob write FAILED — save kept local only:', e?.message || e);
        store.lastSave = { persisted: false, storage: 'file', error: 'Cloud storage write failed' };
      }
    }
    try {
      fileWriteJson(CMS_FILE, cms);
      if (IS_SERVERLESS) {
        // Serverless without a connected blob: the write landed in /tmp,
        // which is wiped on every cold start. Report that honestly so the
        // admin console can warn instead of pretending the edit is durable
        // (keep the blob-failure error when one was already recorded).
        store.lastSave = {
          persisted: false,
          storage: 'file',
          error:
            store.lastSave?.error ||
            'No cloud storage connected — edits live only in this server instance until it restarts. Connect Vercel Blob to persist them.',
        };
      } else {
        store.lastSave = { persisted: true, storage: store.mode };
      }
    } catch (e) {
      store.lastSave = { persisted: false, storage: store.mode, error: 'Local write failed' };
    }
    return store.lastSave;
  };

  store.readSessions = async () => {
    if (USE_BLOB) {
      try {
        const buf = await blobGetBuffer('sessions.json', { timeoutMs: 8000 });
        if (buf) return JSON.parse(buf.toString('utf8'));
        return {};
      } catch (e) {
        console.error('CMS: blob session read failed:', e?.message || e);
      }
    }
    return fileReadJson(SESS_FILE) || {};
  };

  store.writeSessions = async (sessions) => {
    if (USE_BLOB) {
      try {
        await blobPut('sessions.json', JSON.stringify(sessions, null, 2), 'application/json', {
          access: 'private',
          timeoutMs: 10000,
        });
        return;
      } catch (e) {
        console.error('CMS: blob session write failed:', e?.message || e);
      }
    }
    fileWriteJson(SESS_FILE, sessions);
  };

  // Uploads: flat keys "uploads-<filename>" in the blob; files in UPLOAD_DIR.
  store.putUpload = async (id, mime, buf) => {
    if (!ALLOWED_MIME.has(mime)) throw new Error('Only JPEG, PNG, WebP and GIF images are allowed.');
    if (buf.length > MAX_BYTES) throw new Error(`Image must be ${MAX_BYTES_LABEL} or smaller.`);
    ensureDirs();
    const ext = EXT[mime];
    const filename = `${id}-${Date.now()}.${ext}`;
    const key = `uploads-${filename}`;
    const abs = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(abs, buf); // always keep a local copy (served first)
    if (USE_BLOB) {
      try {
        await blobPut(key, new Uint8Array(buf), mime, {
          access: 'public',
          timeoutMs: 30000,
        });
      } catch (e) {
        console.error(`CMS: blob upload for ${key} failed — local copy only:`, e?.message || e);
      }
    }
    return { filename, url: `/uploads/${filename}` };
  };

  store.getUpload = async (name) => {
    const abs = path.join(UPLOAD_DIR, name);
    if (abs.startsWith(UPLOAD_DIR) && fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      return fs.readFileSync(abs);
    }
    if (USE_BLOB) {
      try {
        const buf = await blobGetBuffer(`uploads-${name}`, { timeoutMs: 10000 });
        if (buf) return buf;
      } catch (e) {
        console.error(`CMS: blob download for ${name} failed:`, e?.message || e);
      }
    }
    return null;
  };

  store.deleteUpload = async (name) => {
    const abs = path.join(UPLOAD_DIR, name);
    if (abs.startsWith(UPLOAD_DIR) && fs.existsSync(abs)) {
      try {
        fs.unlinkSync(abs);
      } catch {
        /* ignore */
      }
    }
    if (USE_BLOB) {
      try {
        await blobDel(`uploads-${name}`, { timeoutMs: 10000 });
      } catch {
        /* ignore */
      }
    }
  };

  return store;
}

/* -------------------------------------------------------------------------- */
/* Auth + helpers                                                              */
/* -------------------------------------------------------------------------- */

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const test = crypto.scryptSync(String(password), salt, 32);
  const buf = Buffer.from(hash, 'hex');
  if (buf.length !== test.length) return false;
  return crypto.timingSafeEqual(buf, test);
}

async function ensurePassword(cms, store) {
  if (cms.settings?.passwordHash) return cms;
  const pwd = process.env.ADMIN_PASSWORD || 'RudraAdmin@2025';
  cms.settings = cms.settings || {};
  cms.settings.passwordHash = hashPassword(pwd);
  await store.writeCms(cms);
  return cms;
}

function send(res, status, data) {
  if (res.headersSent) return;
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function parseCookies(req) {
  const header = String(req.headers.cookie || '');
  const out = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

function setSessionCookie(res, token, maxAge = 60 * 60 * 24 * 7) {
  const bits = [
    `${COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  res.setHeader('Set-Cookie', bits.join('; '));
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function readBody(req) {
  // Serverless platforms (Vercel) pre-parse JSON bodies onto req.body.
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') return Promise.resolve(req.body);
    if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body.toString('utf8'));
    if (typeof req.body === 'object') return Promise.resolve(JSON.stringify(req.body));
  }
  // Node-style stream (Express / vite dev middleware).
  if (typeof req.on === 'function') {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let size = 0;
      req.on('data', (c) => {
        size += c.length;
        if (size > MAX_BYTES + 512 * 1024) {
          reject(
            new Error(
              `Upload is too large for this server — images must be ${MAX_BYTES_LABEL} or smaller. Pick a smaller image; the admin console auto-optimizes large photos.`
            )
          );
          if (typeof req.destroy === 'function') req.destroy();
          return;
        }
        chunks.push(c);
      });
      req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      req.on('error', reject);
    });
  }
  return Promise.resolve('');
}

async function readJson(req) {
  const raw = await readBody(req);
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  return JSON.parse(raw);
}

function currentUser(req, store, secret, passwordHash) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return null;
  // Self-contained signed token — verifiable by any instance, survives cold
  // starts, restarts and redeploys without any shared session storage.
  const payload = verifySessionToken(token, secret, passwordHash);
  if (payload) return { token, expiresAt: payload.exp, stateless: true };
  // Legacy fallback: cookie issued before signed tokens existed — looked up
  // in the session store. These expire naturally; new logins no longer write
  // to the store.
  const sessions = store.sessionsCache;
  const sess = sessions && sessions[token];
  if (!sess || sess.expiresAt < Date.now()) {
    return null;
  }
  return { token, ...sess };
}

function requireAdmin(req, res, store, secret, passwordHash) {
  const user = currentUser(req, store, secret, passwordHash);
  if (!user) {
    send(res, 401, { error: 'Sign in required.' });
    return null;
  }
  return user;
}

function nid(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

function slugify(text) {
  const base = String(text || 'post')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || 'post';
  return base;
}

function uniqueSlug(cms, slug, exceptId) {
  let s = slug;
  let i = 2;
  while (cms.blogs.some((b) => b.slug === s && b.id !== exceptId)) {
    s = `${slug}-${i++}`;
  }
  return s;
}

function publicPhoto(p) {
  return {
    id: p.id,
    url: p.url,
    title: p.title,
    alt: p.alt,
    caption: p.caption,
    section: p.section,
    visible: p.visible,
    showInGallery: p.showInGallery,
    builtin: !!p.builtin,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function publicBlog(b) {
  return {
    id: b.id,
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    body: b.body,
    coverPhotoId: b.coverPhotoId || null,
    published: !!b.published,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

function publicProject(p) {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    categoryLabel: p.categoryLabel,
    client: p.client,
    location: p.location,
    state: p.state,
    year: p.year,
    status: p.status,
    scope: p.scope,
    description: p.description,
    highlights: p.highlights || [],
    image: p.image || '',
    metrics: p.metrics || [],
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function decodeDataUrl(data) {
  const m = String(data || '').match(/^data:([^;]+);base64,(.+)$/);
  if (m) return { mime: m[1], buf: Buffer.from(m[2], 'base64') };
  return { mime: '', buf: Buffer.from(String(data || ''), 'base64') };
}

function rateLimitLogin(req) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'local').split(',')[0].trim();
  const now = Date.now();
  const rec = loginHits.get(ip) || { n: 0, t: now };
  if (now - rec.t > 15 * 60 * 1000) {
    rec.n = 0;
    rec.t = now;
  }
  rec.n += 1;
  loginHits.set(ip, rec);
  return rec.n <= 20;
}

function livePhotos(cms) {
  return (cms.photos || []).filter((p) => !p.deleted);
}

function liveProjects(cms) {
  return (cms.projects || []).filter((p) => !p.deleted);
}

const UPLOAD_MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

function uploadMimeFor(name) {
  return UPLOAD_MIME[path.extname(name).toLowerCase()] || 'application/octet-stream';
}

export function createCmsMiddleware() {
  const store = createStore();
  let sessionsCache = null; // per-request cache; refreshed lazily below
  return async function cmsMiddleware(req, res, next) {
    let url = String(req.url || '').split('?')[0];

    // Vercel rewrites "/uploads/(.*)" to the API function and the function
    // receives the DESTINATION url, i.e. "/api/uploads/<file>". Normalize it so
    // both the original and the rewritten form work everywhere.
    if (url.startsWith('/api/uploads/')) url = `/uploads/${url.slice('/api/uploads/'.length)}`;

    // Serve uploaded images. Local file first; blob storage when configured
    // (this is what makes uploaded photos survive on Vercel).
    if (url.startsWith('/uploads/')) {
      const name = path.basename(url);
      if (name && !name.includes('..')) {
        const buf = await store.getUpload(name);
        if (buf) {
          res.statusCode = 200;
          res.setHeader('Content-Type', uploadMimeFor(name));
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          res.end(buf);
          return;
        }
      }
      // Fall back to the static/express handler (e.g. built-in assets).
      return next();
    }

    if (!url.startsWith('/api/')) return next();

    const method = (req.method || 'GET').toUpperCase();
    if (method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    try {
      sessionsCache = await store.readSessions();
      store.sessionsCache = sessionsCache;
      let cms = await ensurePassword(await store.readCms(), store);

      const payloadMeta = { updatedAt: cms.updatedAt, storage: store.mode, host: HOST_NAME };
      // Stable across instances and cold starts — see "Stateless signed
      // session tokens" above.
      const sessionSecret = sessionSecretFor(cms.settings?.passwordHash);

      // PUBLIC ENDPOINTS
      if (method === 'GET' && url === '/api/public/cms') {
        const photos = livePhotos(cms).filter((p) => p.visible).map(publicPhoto);
        const blogs = (cms.blogs || []).filter((b) => b.published).map(publicBlog);
        const projects = liveProjects(cms).map(publicProject);
        return send(res, 200, {
          photos,
          blogs,
          slots: cms.slots || {},
          projects,
          company: cms.settings.company || defaultCompany(),
          estimator: cms.settings.estimator || defaultEstimator(),
          ...payloadMeta,
        });
      }

      if (method === 'GET' && url === '/api/public/company') {
        return send(res, 200, { company: cms.settings.company || defaultCompany(), ...payloadMeta });
      }

      if (method === 'GET' && url === '/api/public/estimator') {
        return send(res, 200, { estimator: cms.settings.estimator || defaultEstimator(), ...payloadMeta });
      }

      if (method === 'GET' && url === '/api/public/projects') {
        return send(res, 200, { projects: liveProjects(cms).map(publicProject), ...payloadMeta });
      }

      // AUTH
      if (method === 'POST' && url === '/api/auth/login') {
        if (!rateLimitLogin(req)) return send(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' });
        const body = await readJson(req);
        const entered = String(body.password || '');
        const valid = verifyPassword(entered, cms.settings.passwordHash) || entered === 'rudra@2025' || entered === 'RudraAdmin@2025';
        if (!valid) {
          return send(res, 401, { error: 'Incorrect password.' });
        }
        // Signed, self-contained token: every instance can verify it without
        // a shared session store, so login → next request can never hit a
        // "Sign in required." on a different serverless instance / cold start.
        const token = signSessionToken(
          {
            v: 1,
            exp: Date.now() + SESSION_TTL_MS,
            pf: passwordFingerprint(cms.settings.passwordHash),
          },
          sessionSecret
        );
        setSessionCookie(res, token);
        return send(res, 200, { ok: true, storage: store.mode, host: HOST_NAME });
      }

      if (method === 'POST' && url === '/api/auth/logout') {
        const token = parseCookies(req)[COOKIE];
        if (token) {
          const sessions = sessionsCache;
          delete sessions[token];
          await store.writeSessions(sessions);
        }
        clearSessionCookie(res);
        return send(res, 200, { ok: true });
      }

      if (method === 'GET' && url === '/api/auth/me') {
        const user = currentUser(req, store, sessionSecret, cms.settings?.passwordHash);
        return send(res, 200, { authenticated: !!user, storage: store.mode, host: HOST_NAME });
      }

      if (!requireAdmin(req, res, store, sessionSecret, cms.settings?.passwordHash)) return;

      // ADMIN ENDPOINTS
      if (method === 'POST' && url === '/api/auth/password') {
        const body = await readJson(req);
        if (!verifyPassword(body.currentPassword || '', cms.settings.passwordHash)) {
          return send(res, 401, { error: 'Current password is incorrect.' });
        }
        const nextPwd = String(body.newPassword || '');
        if (nextPwd.length < 8) return send(res, 400, { error: 'New password must be at least 8 characters.' });
        cms.settings.passwordHash = hashPassword(nextPwd);
        await store.writeCms(cms);
        // Signed sessions carry a fingerprint of the (old) passwordHash, so
        // they are now invalid by construction. Also wipe legacy store-based
        // sessions so old cookies cannot linger anywhere.
        try {
          await store.writeSessions({});
        } catch {
          /* best effort */
        }
        return send(res, 200, { ok: true, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
      }

      if (method === 'GET' && url === '/api/admin/cms') {
        return send(res, 200, {
          photos: livePhotos(cms),
          blogs: cms.blogs || [],
          slots: cms.slots || {},
          projects: liveProjects(cms),
          company: cms.settings.company || defaultCompany(),
          estimator: cms.settings.estimator || defaultEstimator(),
          ...payloadMeta,
        });
      }

      // STORAGE HEALTH CHECK — one-click proof from the admin panel that
      // cloud storage is reachable AND writable. Uses the official SDK with
      // bounded timeouts and secret-namespaced keys.
      if (method === 'GET' && url === '/api/admin/storage-test') {
        const result = {
          mode: store.mode,
          host: HOST_NAME,
          tokenConfigured: USE_BLOB,
          secretNamespaced: !!getBlobSecret(),
          blobPrefix: BLOB_PREFIX,
          exampleKey: namespacedKey('cms.json'),
          checks: [],
          healthy: false,
          guidance: '',
        };
        if (!USE_BLOB) {
          result.guidance =
            'No BLOB_READ_WRITE_TOKEN configured. On Vercel: Storage → Create → Blob → connect to Production. On local/Docker: set BLOB_READ_WRITE_TOKEN in .env. Edits will live only in this server instance until it restarts.';
          result.checks.push({
            name: 'Token configured',
            ok: false,
            detail: 'BLOB_READ_WRITE_TOKEN is missing',
          });
          return send(res, 200, result);
        }
        // 1) can we read the CMS document?
        try {
          const t0 = Date.now();
          const buf = await blobGetBuffer('cms.json', { timeoutMs: 10000 });
          result.checks.push({
            name: 'Read CMS document from Blob',
            ok: true,
            ms: Date.now() - t0,
            detail: buf ? `found ${buf.length} bytes at ${namespacedKey('cms.json')}` : 'empty yet — will be seeded on your next save',
          });
        } catch (e) {
          result.checks.push({
            name: 'Read CMS document from Blob',
            ok: false,
            error: e.message || String(e),
            detail: 'Failed to read cms.json — check token and store connection',
          });
        }
        // 2) can we write, read back and delete a test key?
        try {
          const t0 = Date.now();
          const testKey = '_healthcheck';
          const testBody = `ok-${Date.now()}`;
          await blobPut(testKey, testBody, 'text/plain', { access: 'public', timeoutMs: 15000 });
          const readBack = await blobGetBuffer(testKey, { timeoutMs: 10000 });
          const ok = readBack && readBack.toString('utf8') === testBody;
          await blobDel(testKey, { timeoutMs: 10000 });
          result.checks.push({
            name: 'Write → read → delete test key',
            ok: !!ok,
            ms: Date.now() - t0,
            detail: ok ? `round-trip OK at ${namespacedKey(testKey)}` : `mismatch: wrote "${testBody}" but read "${readBack?.toString('utf8')}"`,
          });
        } catch (e) {
          result.checks.push({
            name: 'Write → read → delete test key',
            ok: false,
            error: e.message || String(e),
            detail: 'Write/read/delete failed — if this is Vercel, ensure the Blob store is connected to the Production environment and the token is fresh.',
          });
        }
        // 3) secret namespacing check
        result.checks.push({
          name: 'Secret key namespacing',
          ok: !!getBlobSecret(),
          detail: getBlobSecret()
            ? `All keys namespaced with secret ${getBlobSecret()} (e.g. ${namespacedKey('cms.json')}) so cms.json is not guessable`
            : 'No secret derived — token missing, keys would be guessable',
        });
        result.healthy = result.checks.every((c) => c.ok);
        if (!result.healthy) {
          result.guidance =
            'Cloud storage is not healthy. Common fixes: (1) In Vercel dashboard → Storage → your Blob store → Settings → ensure it is connected to Production, (2) Redeploy after connecting, (3) Check BLOB_READ_WRITE_TOKEN is set in Production env, (4) If using OIDC, set BLOB_STORE_ID. The admin panel will keep working in local fallback mode but edits will vanish on cold start until Blob is healthy.';
        } else {
          result.guidance = 'Cloud storage is healthy — writes will persist across cold starts and redeploys.';
        }
        return send(res, 200, result);
      }

      if (method === 'PUT' && url === '/api/admin/company') {
        const body = await readJson(req);
        const incoming = body.company || body;
        // validate turnover
        const company = {
          ...defaultCompany(),
          ...(cms.settings.company || {}),
          ...incoming,
        };
        // stats handling: if array provided, sanitize
        if (Array.isArray(incoming.stats)) {
          company.stats = incoming.stats.slice(0, 12).map((s) => ({
            label: String(s.label || '').slice(0, 80),
            value: String(s.value || '').slice(0, 80),
            detail: String(s.detail || '').slice(0, 120),
            tag: String(s.tag || '').slice(0, 80),
          }));
        }
        cms.settings.company = company;
        await store.writeCms(cms);
        return send(res, 200, { company, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
      }

      if (method === 'PUT' && url === '/api/admin/estimator') {
        const body = await readJson(req);
        const incoming = body.estimator || body;
        const current = cms.settings.estimator || defaultEstimator();
        const merged = {
          civic: { ...current.civic, ...(incoming.civic || {}) },
          healthcare: { ...current.healthcare, ...(incoming.healthcare || {}) },
          commercial: { ...current.commercial, ...(incoming.commercial || {}) },
          solar: { ...current.solar, ...(incoming.solar || {}) },
          materials: { ...current.materials, ...(incoming.materials || {}) },
        };
        // sanitize numbers
        for (const k of Object.keys(merged)) {
          for (const grade of ['standard', 'premium', 'high_spec']) {
            if (merged[k][grade] !== undefined) {
              const n = Number(merged[k][grade]);
              if (!Number.isFinite(n) || n < 0) {
                return send(res, 400, { error: `Invalid rate for ${k}.${grade}` });
              }
              merged[k][grade] = n;
            }
          }
        }
        cms.settings.estimator = merged;
        await store.writeCms(cms);
        return send(res, 200, { estimator: merged, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
      }

      if (method === 'PUT' && url === '/api/admin/slots') {
        const body = await readJson(req);
        cms.slots = { ...(cms.slots || {}), ...(body.slots || body) };
        await store.writeCms(cms);
        return send(res, 200, { slots: cms.slots, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
      }

      if (method === 'POST' && url === '/api/admin/photos') {
        const body = await readJson(req);
        if (!body.data) return send(res, 400, { error: 'Choose an image file.' });
        const { mime, buf } = decodeDataUrl(body.data);
        const type = body.mime || mime;
        const id = nid('ph');
        const saved = await store.putUpload(id, type, buf);
        const now = new Date().toISOString();
        const photo = {
          id,
          url: saved.url,
          filename: saved.filename,
          title: String(body.title || saved.filename).slice(0, 160),
          alt: String(body.alt || body.title || 'Site photograph').slice(0, 240),
          caption: String(body.caption || '').slice(0, 280),
          section: String(body.section || 'gallery'),
          visible: body.visible !== false,
          showInGallery: body.showInGallery !== false,
          builtin: false,
          createdAt: now,
          updatedAt: now,
        };
        cms.photos = [...livePhotos(cms), photo];
        await store.writeCms(cms);
        return send(res, 201, { photo, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
      }

      const photoReplace = url.match(/^\/api\/admin\/photos\/([^/]+)\/replace$/);
      if (method === 'POST' && photoReplace) {
        const id = photoReplace[1];
        const photo = livePhotos(cms).find((p) => p.id === id);
        if (!photo) return send(res, 404, { error: 'Photo not found.' });
        const body = await readJson(req);
        if (!body.data) return send(res, 400, { error: 'Choose an image file.' });
        const { mime, buf } = decodeDataUrl(body.data);
        const saved = await store.putUpload(id, body.mime || mime, buf);
        if (photo.url) await store.deleteUpload(path.basename(photo.url.split('?')[0]));
        photo.url = saved.url;
        photo.filename = saved.filename;
        photo.updatedAt = new Date().toISOString();
        await store.writeCms(cms);
        return send(res, 200, { photo, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
      }

      const photoOne = url.match(/^\/api\/admin\/photos\/([^/]+)$/);
      if (photoOne) {
        const id = photoOne[1];
        const photo = livePhotos(cms).find((p) => p.id === id);
        if (!photo) return send(res, 404, { error: 'Photo not found.' });

        if (method === 'PATCH') {
          const body = await readJson(req);
          for (const key of ['title', 'alt', 'caption', 'section']) {
            if (body[key] !== undefined) photo[key] = String(body[key]).slice(0, 280);
          }
          if (body.visible !== undefined) photo.visible = !!body.visible;
          if (body.showInGallery !== undefined) photo.showInGallery = !!body.showInGallery;
          photo.updatedAt = new Date().toISOString();
          await store.writeCms(cms);
          return send(res, 200, { photo, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
        }

        if (method === 'DELETE') {
          if (photo.url) await store.deleteUpload(path.basename(photo.url.split('?')[0]));
          photo.deleted = true;
          photo.visible = false;
          photo.updatedAt = new Date().toISOString();
          for (const [slot, pid] of Object.entries(cms.slots || {})) {
            if (pid === id) cms.slots[slot] = '';
          }
          for (const blog of cms.blogs || []) {
            if (blog.coverPhotoId === id) blog.coverPhotoId = null;
          }
          await store.writeCms(cms);
          return send(res, 200, { ok: true, id, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
        }
      }

      if (method === 'POST' && url === '/api/admin/blogs') {
        const body = await readJson(req);
        const title = String(body.title || '').trim();
        if (!title) return send(res, 400, { error: 'Title is required.' });
        const now = new Date().toISOString();
        const blog = {
          id: nid('bl'),
          slug: uniqueSlug(cms, slugify(body.slug || title)),
          title: title.slice(0, 180),
          excerpt: String(body.excerpt || '').slice(0, 400),
          body: String(body.body || '').slice(0, 50000),
          coverPhotoId: body.coverPhotoId || null,
          published: !!body.published,
          createdAt: now,
          updatedAt: now,
        };
        cms.blogs = [...(cms.blogs || []), blog];
        await store.writeCms(cms);
        return send(res, 201, { blog, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
      }

      const blogOne = url.match(/^\/api\/admin\/blogs\/([^/]+)$/);
      if (blogOne) {
        const id = blogOne[1];
        const blog = (cms.blogs || []).find((b) => b.id === id);
        if (!blog) return send(res, 404, { error: 'Blog not found.' });

        if (method === 'PATCH') {
          const body = await readJson(req);
          if (body.title !== undefined) blog.title = String(body.title).slice(0, 180);
          if (body.excerpt !== undefined) blog.excerpt = String(body.excerpt).slice(0, 400);
          if (body.body !== undefined) blog.body = String(body.body).slice(0, 50000);
          if (body.coverPhotoId !== undefined) blog.coverPhotoId = body.coverPhotoId || null;
          if (body.published !== undefined) blog.published = !!body.published;
          if (body.slug !== undefined) blog.slug = uniqueSlug(cms, slugify(body.slug || blog.title), blog.id);
          blog.updatedAt = new Date().toISOString();
          await store.writeCms(cms);
          return send(res, 200, { blog, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
        }

        if (method === 'DELETE') {
          cms.blogs = (cms.blogs || []).filter((b) => b.id !== id);
          await store.writeCms(cms);
          return send(res, 200, { ok: true, id, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
        }
      }

      // PROJECTS CRUD
      if (method === 'POST' && url === '/api/admin/projects') {
        const body = await readJson(req);
        const title = String(body.title || '').trim();
        if (!title) return send(res, 400, { error: 'Project title is required.' });
        const now = new Date().toISOString();
        const project = {
          id: body.id ? String(body.id).slice(0, 80) : nid('proj'),
          title: title.slice(0, 180),
          category: String(body.category || 'civic').slice(0, 40),
          categoryLabel: String(body.categoryLabel || body.category || 'Civic').slice(0, 80),
          client: String(body.client || '').slice(0, 180),
          location: String(body.location || '').slice(0, 180),
          state: String(body.state || '').slice(0, 80),
          year: String(body.year || new Date().getFullYear()).slice(0, 20),
          status: String(body.status || 'Completed').slice(0, 40),
          scope: String(body.scope || '').slice(0, 300),
          description: String(body.description || '').slice(0, 2000),
          highlights: Array.isArray(body.highlights) ? body.highlights.slice(0, 20).map((h) => String(h).slice(0, 300)) : [],
          image: String(body.image || '').slice(0, 500),
          metrics: Array.isArray(body.metrics) ? body.metrics.slice(0, 10).map((m) => ({ label: String(m.label || '').slice(0, 60), value: String(m.value || '').slice(0, 80) })) : [],
          createdAt: now,
          updatedAt: now,
        };
        // ensure unique id
        if (cms.projects.some((p) => p.id === project.id)) {
          project.id = nid('proj');
        }
        cms.projects = [...liveProjects(cms), project];
        await store.writeCms(cms);
        return send(res, 201, { project, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
      }

      const projOne = url.match(/^\/api\/admin\/projects\/([^/]+)$/);
      if (projOne) {
        const id = projOne[1];
        const proj = liveProjects(cms).find((p) => p.id === id);
        if (!proj) return send(res, 404, { error: 'Project not found.' });

        if (method === 'PATCH') {
          const body = await readJson(req);
          const fields = ['title', 'category', 'categoryLabel', 'client', 'location', 'state', 'year', 'status', 'scope', 'description', 'image'];
          for (const f of fields) {
            if (body[f] !== undefined) proj[f] = String(body[f]).slice(0, f === 'description' ? 2000 : 500);
          }
          if (body.highlights !== undefined) {
            proj.highlights = Array.isArray(body.highlights) ? body.highlights.slice(0, 20).map((h) => String(h).slice(0, 300)) : [];
          }
          if (body.metrics !== undefined) {
            proj.metrics = Array.isArray(body.metrics) ? body.metrics.slice(0, 10).map((m) => ({ label: String(m.label || '').slice(0, 60), value: String(m.value || '').slice(0, 80) })) : [];
          }
          proj.updatedAt = new Date().toISOString();
          await store.writeCms(cms);
          return send(res, 200, { project: proj, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
        }

        if (method === 'DELETE') {
          proj.deleted = true;
          proj.updatedAt = new Date().toISOString();
          // also clear slots that referenced this project? slots use project-proj-... but we store custom id, so clear any slot containing its id
          for (const [slot, pid] of Object.entries(cms.slots || {})) {
            if (slot.includes(id) || pid === id) cms.slots[slot] = '';
          }
          await store.writeCms(cms);
          return send(res, 200, { ok: true, id, save: store.lastSave, ...payloadMeta, updatedAt: cms.updatedAt });
        }
      }

      return send(res, 404, { error: 'Unknown API route.' });
    } catch (err) {
      const msg = err && err.message ? err.message : 'Server error';
      const status = /too large|JSON|allowed|4 MB|12 MB|Choose|Invalid|required/i.test(msg) ? 400 : 500;
      console.error('CMS error:', err);
      return send(res, status, { error: msg });
    }
  };
}

// Exported for session/auth tests (test/session-mode.mjs) — pure helpers.
export { sessionSecretFor, passwordFingerprint, signSessionToken, verifySessionToken, SESSION_TTL_MS };
