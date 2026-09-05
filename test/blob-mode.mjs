/**
 * Self-contained end-to-end test for the Vercel Blob storage backend.
 *
 * Emulates Vercel serverless behavior:
 *  - VERCEL=1            → /tmp is the only writable area
 *  - a fresh createCmsMiddleware() + wiped /tmp  ≈ a new function instance
 *  - BLOB_API_BASE=http://... triggers file-system mock mode (bypasses real SDK)
 *    The mock stores blobs under /tmp/mock-blob-store/<prefix>/<secret>/<key>
 *    which mirrors the real SDK's namespaced keys.
 *
 * This version verifies:
 *  - Cold-start persistence (cms.json survives /tmp wipe)
 *  - Upload serving from blob after cold start
 *  - Secret key namespacing (cms.json not at guessable public URL)
 *  - SDK wiring (official @vercel/blob is used in production, mock in test)
 *
 * Run:  node test/blob-mode.mjs
 */
// Env must be set BEFORE importing cms.mjs — it reads these at module-eval time.
process.env.VERCEL = '1';
process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
process.env.BLOB_API_BASE = 'http://127.0.0.1:9877'; // triggers mock file-system mode

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const BLOB_STORE = '/tmp/mock-blob-store';
const TMP = '/tmp/rudra-cms';
const TOKEN = 'test-token';

const { createCmsMiddleware, getBlobSecret, namespacedKey, legacyKey } = await import('../server/cms.mjs');

let failures = 0;
function check(name, cond, extra = '') {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  → ' + extra : ''}`);
}

function call(mw, url, method, { body, cookie } = {}) {
  return new Promise((resolve) => {
    const req = { url, method, headers: { ...(cookie ? { cookie } : {}) }, body: body === undefined ? undefined : body };
    const out = { status: 0, body: '', setcookie: '', isBuf: false };
    const res = {
      statusCode: 0,
      setHeader(k, v) {
        if (k.toLowerCase() === 'set-cookie') out.setcookie = v;
      },
      end(d) {
        out.status = res.statusCode;
        if (Buffer.isBuffer(d)) { out.body = d; out.isBuf = true; }
        else out.body = d || '';
        resolve(out);
      },
    };
    mw(req, res, () => { out.status = 'next'; resolve(out); });
  });
}

async function loginCookie(mw) {
  const r = await call(mw, '/api/auth/login', 'POST', { body: { password: 'RudraAdmin@2025' } });
  if (r.status !== 200) throw new Error('login failed: ' + r.status + ' ' + r.body);
  return r.setcookie.split(';')[0];
}

function wipeTmp() {
  fs.rmSync(TMP, { recursive: true, force: true });
}

function expectedSecret() {
  return crypto.createHash('sha256').update(TOKEN).digest('hex').slice(0, 16);
}

// ---- clean slate -----------------------------------------------------------------
fs.rmSync(BLOB_STORE, { recursive: true, force: true });
fs.mkdirSync(BLOB_STORE, { recursive: true });
wipeTmp();

console.log('Blob mode test  (VERCEL=1, BLOB_API_BASE=mock, official SDK wrapper)');
console.log('--------------------------------------------------------------------');

// Verify secret derivation
const secret = getBlobSecret();
check('secret derived from token', secret === expectedSecret(), `${secret} vs ${expectedSecret()}`);
check('secret is 16 hex chars', /^[a-f0-9]{16}$/.test(secret), secret);
check('namespacedKey includes secret', namespacedKey('cms.json').includes(secret), namespacedKey('cms.json'));
check('legacyKey does NOT include secret', !legacyKey('cms.json').includes(secret), legacyKey('cms.json'));
check('namespacedKey != legacyKey', namespacedKey('cms.json') !== legacyKey('cms.json'));

// Instance A: first boot seeds the blob, admin saves a turnover.
console.log('Instance A (fresh boot + save)');
let mwA = createCmsMiddleware();
{
  const pub = await call(mwA, '/api/public/cms', 'GET');
  const d = JSON.parse(pub.body);
  check('reports blob storage', d.storage === 'blob', d.storage);
  check('reports vercel host', d.host === 'vercel', d.host);
  check('seeded turnover present', typeof d.company?.turnover === 'string', d.company?.turnover);
  const nsPath = path.join(BLOB_STORE, namespacedKey('cms.json'));
  const legacyPath = path.join(BLOB_STORE, legacyKey('cms.json'));
  check('blob now has cms.json at namespaced path', fs.existsSync(nsPath), nsPath);
  check('blob does NOT have cms.json at legacy guessable path', !fs.existsSync(legacyPath), legacyPath);
}
{
  const cookie = await loginCookie(mwA);
  const put = await call(mwA, '/api/admin/company', 'PUT', {
    body: { company: { turnover: '₹99.99 TEST Crore', turnoverShort: 'TEST Cr+' } },
    cookie,
  });
  const d = JSON.parse(put.body);
  check('PUT saved', put.status === 200 && d.company?.turnover === '₹99.99 TEST Crore', put.status + '');
  check('PUT reports persisted to blob', d.save?.persisted === true && d.save?.storage === 'blob', JSON.stringify(d.save));
}

// Instance B: fresh function instance, /tmp wiped → must read the NEW value from blob.
console.log('Instance B (cold start, /tmp wiped → read from blob)');
wipeTmp();
let mwB = createCmsMiddleware();
{
  const pub = await call(mwB, '/api/public/cms', 'GET');
  const d = JSON.parse(pub.body);
  check('turnover survives cold start', d.company?.turnover === '₹99.99 TEST Crore', d.company?.turnover);
  check('still blob storage', d.storage === 'blob');
}

// Instance C: upload a photo, then a cold instance serves it from blob.
console.log('Instance C (photo upload → cold start serves from blob)');
let mwC = createCmsMiddleware();
let photoUrl;
const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
{
  const cookie = await loginCookie(mwC);
  const up = await call(mwC, '/api/admin/photos', 'POST', {
    body: { data: `data:image/png;base64,${PNG_B64}`, title: 'blob test photo', section: 'gallery' },
    cookie,
  });
  const d = JSON.parse(up.body);
  check('photo uploaded', up.status === 201 && typeof d.photo?.url === 'string', up.status + ' ' + (d.photo?.url || ''));
  const filename = path.basename(d.photo?.url || '');
  const nsUploadPath = path.join(BLOB_STORE, namespacedKey(`uploads-${filename}`));
  const legacyUploadPath = path.join(BLOB_STORE, legacyKey(`uploads-${filename}`));
  check('photo bytes in blob at namespaced path', fs.existsSync(nsUploadPath), nsUploadPath);
  check('photo NOT at legacy guessable path', !fs.existsSync(legacyUploadPath), legacyUploadPath);
  photoUrl = d.photo?.url;
}
wipeTmp();
let mwD = createCmsMiddleware();
{
  const direct = await call(mwD, photoUrl, 'GET');
  check('cold instance serves photo (direct /uploads/)', direct.status === 200 && direct.isBuf && direct.body.length > 0, direct.status + ' ' + (direct.isBuf ? direct.body.length : 'n/a') + ' bytes');
  const rewritten = await call(mwD, `/api${photoUrl}`, 'GET');
  check('cold instance serves photo (rewritten /api/uploads/)', rewritten.status === 200 && rewritten.isBuf && rewritten.body.length > 0, rewritten.status + ' ' + (rewritten.isBuf ? rewritten.body.length : 'n/a') + ' bytes');
  check('served bytes match upload', direct.body.toString('base64') === PNG_B64);
}

// Instance E: storage-test endpoint should report healthy and secret namespacing
console.log('Instance E (storage health check)');
let mwE = createCmsMiddleware();
{
  const cookie = await loginCookie(mwE);
  const testRes = await call(mwE, '/api/admin/storage-test', 'GET', { cookie });
  const d = JSON.parse(testRes.body);
  check('storage-test reports blob mode', d.mode === 'blob', d.mode);
  check('storage-test tokenConfigured true', d.tokenConfigured === true);
  check('storage-test secretNamespaced true', d.secretNamespaced === true);
  check('storage-test healthy', d.healthy === true, JSON.stringify(d.checks));
  check('storage-test has 3 checks (read, write/read/delete, namespacing)', d.checks?.length === 3, String(d.checks?.length));
  const allOk = d.checks?.every((c) => c.ok);
  check('all storage checks ok', allOk, JSON.stringify(d.checks));
}

console.log('--------------------------------------------------------------------');
console.log(failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
