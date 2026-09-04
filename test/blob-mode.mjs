/**
 * Self-contained end-to-end test for the Vercel Blob storage backend.
 *
 * Emulates Vercel serverless behavior:
 *  - VERCEL=1            → /tmp is the only writable area
 *  - a fresh createCmsMiddleware() + wiped /tmp  ≈ a new function instance
 *  - an in-process mock plays the role of Vercel Blob (persistent)
 *
 * Run:  node test/blob-mode.mjs
 */
// Env must be set BEFORE importing cms.mjs — it reads these at module-eval time.
process.env.VERCEL = '1';
process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
process.env.BLOB_API_BASE = 'http://127.0.0.1:9877';

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const BLOB_STORE = '/tmp/mock-blob-store';
const TMP = '/tmp/rudra-cms';
const TOKEN = 'test-token';

const { createCmsMiddleware } = await import('../server/cms.mjs');

let failures = 0;
function check(name, cond, extra = '') {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  → ' + extra : ''}`);
}

function mockBlobServer() {
  return http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    const token = u.searchParams.get('token');
    const parts = u.pathname.split('/').filter(Boolean); // [prefix, key]
    const key = parts.slice(1).join('/');
    const file = path.join(BLOB_STORE, key);
    if (token !== TOKEN) {
      res.writeHead(401).end('unauthorized');
      return;
    }
    if (req.method === 'GET') {
      if (!fs.existsSync(file)) return res.writeHead(404).end('not found');
      res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
      res.end(fs.readFileSync(file));
      return;
    }
    if (req.method === 'POST') {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, Buffer.concat(chunks));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ path: path.posix.join(parts[0], key), url: `mock:///${key}` }));
      });
      return;
    }
    if (req.method === 'DELETE') {
      if (fs.existsSync(file)) fs.unlinkSync(file);
      res.writeHead(200).end('ok');
      return;
    }
    res.writeHead(405).end();
  });
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

const blob = mockBlobServer();
await new Promise((r) => blob.listen(9877, '127.0.0.1', r));

// ---- clean slate -----------------------------------------------------------------
fs.rmSync(BLOB_STORE, { recursive: true, force: true });
fs.mkdirSync(BLOB_STORE, { recursive: true });
wipeTmp();

console.log('Blob mode test  (VERCEL=1, BLOB_API_BASE=mock)');
console.log('-------------------------------------------------');

// Instance A: first boot seeds the blob, admin saves a turnover.
console.log('Instance A (fresh boot + save)');
let mwA = createCmsMiddleware();
{
  const pub = await call(mwA, '/api/public/cms', 'GET');
  const d = JSON.parse(pub.body);
  check('reports blob storage', d.storage === 'blob', d.storage);
  check('reports vercel host', d.host === 'vercel', d.host);
  check('seeded turnover present', typeof d.company?.turnover === 'string', d.company?.turnover);
  check('blob now has cms.json', fs.existsSync(path.join(BLOB_STORE, 'cms.json')));
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
  check('photo bytes in blob', fs.existsSync(path.join(BLOB_STORE, 'uploads-' + path.basename(d.photo?.url || ''))));
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

blob.close();
console.log('-------------------------------------------------');
console.log(failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
