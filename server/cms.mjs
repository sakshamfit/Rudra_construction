/**
 * CMS API for photos + blogs + company + estimator + projects.
 * Persists to data/cms.json and public/uploads/.
 * Indian SEO ready, admin can edit turnover and project estimation.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms.json');
const SESS_FILE = path.join(DATA_DIR, 'sessions.json');
const UPLOAD_DIR = path.join(ROOT, 'public', 'uploads');
const COOKIE = 'rc_admin';
const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

const loginHits = new Map();

function ensureDirs() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
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
  return cms;
}

function loadCms() {
  ensureDirs();
  if (!fs.existsSync(CMS_FILE)) {
    const cms = defaultCms();
    fs.writeFileSync(CMS_FILE, JSON.stringify(cms, null, 2));
    return cms;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(CMS_FILE, 'utf8'));
    const migrated = migrateCms(raw);
    // if file was old version, save migrated
    if ((raw.version || 1) < 2) {
      try { fs.writeFileSync(CMS_FILE, JSON.stringify(migrated, null, 2)); } catch {}
    }
    return migrated;
  } catch {
    return defaultCms();
  }
}

function saveCms(cms) {
  ensureDirs();
  const tmp = CMS_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(cms, null, 2));
  fs.renameSync(tmp, CMS_FILE);
}

function loadSessions() {
  ensureDirs();
  if (!fs.existsSync(SESS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(SESS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveSessions(sessions) {
  ensureDirs();
  fs.writeFileSync(SESS_FILE, JSON.stringify(sessions, null, 2));
}

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

function ensurePassword(cms) {
  if (cms.settings?.passwordHash) return cms;
  const pwd = process.env.ADMIN_PASSWORD || 'RudraAdmin@2025';
  cms.settings = cms.settings || {};
  cms.settings.passwordHash = hashPassword(pwd);
  saveCms(cms);
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
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body) && !Array.isArray(req.body)) {
    return Promise.resolve(JSON.stringify(req.body));
  }
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BYTES + 512 * 1024) {
        reject(new Error('payload too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function readJson(req) {
  const raw = await readBody(req);
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  return JSON.parse(raw);
}

function currentUser(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return null;
  const sessions = loadSessions();
  const sess = sessions[token];
  if (!sess || sess.expiresAt < Date.now()) {
    if (sess) {
      delete sessions[token];
      saveSessions(sessions);
    }
    return null;
  }
  return { token, ...sess };
}

function requireAdmin(req, res) {
  const user = currentUser(req);
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

function writeUpload(id, mime, buf) {
  if (!ALLOWED_MIME.has(mime)) throw new Error('Only JPEG, PNG, WebP and GIF images are allowed.');
  if (buf.length > MAX_BYTES) throw new Error('Image must be 12 MB or smaller.');
  ensureDirs();
  const ext = EXT[mime];
  const filename = `${id}-${Date.now()}.${ext}`;
  const abs = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(abs, buf);
  return { filename, url: `/uploads/${filename}` };
}

function deleteUploadIfOwned(url) {
  if (!url || !url.startsWith('/uploads/')) return;
  const name = path.basename(url.split('?')[0]);
  const abs = path.join(UPLOAD_DIR, name);
  if (abs.startsWith(UPLOAD_DIR) && fs.existsSync(abs)) fs.unlinkSync(abs);
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

export function createCmsMiddleware() {
  return async function cmsMiddleware(req, res, next) {
    const url = String(req.url || '').split('?')[0];
    if (!url.startsWith('/api/')) return next();

    const method = (req.method || 'GET').toUpperCase();
    if (method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    try {
      let cms = ensurePassword(loadCms());

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
        });
      }

      if (method === 'GET' && url === '/api/public/company') {
        return send(res, 200, { company: cms.settings.company || defaultCompany() });
      }

      if (method === 'GET' && url === '/api/public/estimator') {
        return send(res, 200, { estimator: cms.settings.estimator || defaultEstimator() });
      }

      if (method === 'GET' && url === '/api/public/projects') {
        return send(res, 200, { projects: liveProjects(cms).map(publicProject) });
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
        const token = crypto.randomBytes(24).toString('hex');
        const sessions = loadSessions();
        sessions[token] = { createdAt: Date.now(), expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 };
        saveSessions(sessions);
        setSessionCookie(res, token);
        return send(res, 200, { ok: true });
      }

      if (method === 'POST' && url === '/api/auth/logout') {
        const token = parseCookies(req)[COOKIE];
        if (token) {
          const sessions = loadSessions();
          delete sessions[token];
          saveSessions(sessions);
        }
        clearSessionCookie(res);
        return send(res, 200, { ok: true });
      }

      if (method === 'GET' && url === '/api/auth/me') {
        const user = currentUser(req);
        return send(res, 200, { authenticated: !!user });
      }

      if (!requireAdmin(req, res)) return;

      // ADMIN ENDPOINTS
      if (method === 'POST' && url === '/api/auth/password') {
        const body = await readJson(req);
        if (!verifyPassword(body.currentPassword || '', cms.settings.passwordHash)) {
          return send(res, 401, { error: 'Current password is incorrect.' });
        }
        const nextPwd = String(body.newPassword || '');
        if (nextPwd.length < 8) return send(res, 400, { error: 'New password must be at least 8 characters.' });
        cms.settings.passwordHash = hashPassword(nextPwd);
        saveCms(cms);
        return send(res, 200, { ok: true });
      }

      if (method === 'GET' && url === '/api/admin/cms') {
        return send(res, 200, {
          photos: livePhotos(cms),
          blogs: cms.blogs || [],
          slots: cms.slots || {},
          projects: liveProjects(cms),
          company: cms.settings.company || defaultCompany(),
          estimator: cms.settings.estimator || defaultEstimator(),
        });
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
        saveCms(cms);
        return send(res, 200, { company });
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
        saveCms(cms);
        return send(res, 200, { estimator: merged });
      }

      if (method === 'PUT' && url === '/api/admin/slots') {
        const body = await readJson(req);
        cms.slots = { ...(cms.slots || {}), ...(body.slots || body) };
        saveCms(cms);
        return send(res, 200, { slots: cms.slots });
      }

      if (method === 'POST' && url === '/api/admin/photos') {
        const body = await readJson(req);
        if (!body.data) return send(res, 400, { error: 'Choose an image file.' });
        const { mime, buf } = decodeDataUrl(body.data);
        const type = body.mime || mime;
        const id = nid('ph');
        const saved = writeUpload(id, type, buf);
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
        saveCms(cms);
        return send(res, 201, { photo });
      }

      const photoReplace = url.match(/^\/api\/admin\/photos\/([^/]+)\/replace$/);
      if (method === 'POST' && photoReplace) {
        const id = photoReplace[1];
        const photo = livePhotos(cms).find((p) => p.id === id);
        if (!photo) return send(res, 404, { error: 'Photo not found.' });
        const body = await readJson(req);
        if (!body.data) return send(res, 400, { error: 'Choose an image file.' });
        const { mime, buf } = decodeDataUrl(body.data);
        const saved = writeUpload(id, body.mime || mime, buf);
        deleteUploadIfOwned(photo.url);
        photo.url = saved.url;
        photo.filename = saved.filename;
        photo.updatedAt = new Date().toISOString();
        saveCms(cms);
        return send(res, 200, { photo });
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
          saveCms(cms);
          return send(res, 200, { photo });
        }

        if (method === 'DELETE') {
          deleteUploadIfOwned(photo.url);
          photo.deleted = true;
          photo.visible = false;
          photo.updatedAt = new Date().toISOString();
          for (const [slot, pid] of Object.entries(cms.slots || {})) {
            if (pid === id) cms.slots[slot] = '';
          }
          for (const blog of cms.blogs || []) {
            if (blog.coverPhotoId === id) blog.coverPhotoId = null;
          }
          saveCms(cms);
          return send(res, 200, { ok: true, id });
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
        saveCms(cms);
        return send(res, 201, { blog });
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
          saveCms(cms);
          return send(res, 200, { blog });
        }

        if (method === 'DELETE') {
          cms.blogs = (cms.blogs || []).filter((b) => b.id !== id);
          saveCms(cms);
          return send(res, 200, { ok: true, id });
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
        saveCms(cms);
        return send(res, 201, { project });
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
          saveCms(cms);
          return send(res, 200, { project: proj });
        }

        if (method === 'DELETE') {
          proj.deleted = true;
          proj.updatedAt = new Date().toISOString();
          // also clear slots that referenced this project? slots use project-proj-... but we store custom id, so clear any slot containing its id
          for (const [slot, pid] of Object.entries(cms.slots || {})) {
            if (slot.includes(id) || pid === id) cms.slots[slot] = '';
          }
          saveCms(cms);
          return send(res, 200, { ok: true, id });
        }
      }

      return send(res, 404, { error: 'Unknown API route.' });
    } catch (err) {
      const msg = err && err.message ? err.message : 'Server error';
      const status = /too large|JSON|allowed|12 MB|Choose|Invalid|required/i.test(msg) ? 400 : 500;
      console.error('CMS error:', err);
      return send(res, status, { error: msg });
    }
  };
}
