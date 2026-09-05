/**
 * Session/auth regression tests — the "Couldn't load live site data:
 * Sign in required." admin-panel bug.
 *
 * Sessions used to live ONLY in a JSON store (data/sessions.json on Node,
 * /tmp on Vercel). That store is per-instance and wiped on cold starts /
 * redeploys, so a successful login was often followed by a 401 on the very
 * next request (it landed on another instance). Login now issues
 * self-contained HMAC-signed tokens that ANY instance can verify with no
 * shared storage.
 *
 * Emulates Vercel serverless behavior:
 *  - VERCEL=1            → /tmp is the only writable area
 *  - a fresh createCmsMiddleware() + wiped /tmp  ≈ a new function instance
 *  - NO blob tokens      → file mode inside /tmp (worst-case: no durable store)
 *
 * Run:  node test/session-mode.mjs
 */
// Env must be set BEFORE importing cms.mjs — it reads these at module-eval time.
process.env.VERCEL = '1';
delete process.env.BLOB_READ_WRITE_TOKEN;
delete process.env.BLOB_READ_TOKEN;
delete process.env.BLOB_WRITE_TOKEN;

import fs from 'node:fs';
import path from 'node:path';

const TMP = '/tmp/rudra-cms';

const { createCmsMiddleware, sessionSecretFor, signSessionToken, verifySessionToken, passwordFingerprint } =
  await import('../server/cms.mjs');

let failures = 0;
function check(name, cond, extra = '') {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  → ' + extra : ''}`);
}

function call(mw, url, method, { body, cookie } = {}) {
  return new Promise((resolve) => {
    const req = {
      url,
      method,
      headers: {
        ...(cookie ? { cookie } : {}),
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    };
    const out = { status: 0, body: '', setcookie: '' };
    const res = {
      statusCode: 0,
      setHeader(k, v) {
        if (k.toLowerCase() === 'set-cookie') out.setcookie = v;
      },
      end(d) {
        out.status = res.statusCode;
        out.body = d || '';
        resolve(out);
      },
    };
    mw(req, res, () => {
      out.status = 'next';
      resolve(out);
    });
  });
}

async function loginCookie(mw, password = 'rudra@2025') {
  const r = await call(mw, '/api/auth/login', 'POST', { body: { password } });
  if (r.status !== 200) throw new Error('login failed: ' + r.status + ' ' + r.body);
  return r.setcookie.split(';')[0];
}

function wipeTmp() {
  fs.rmSync(TMP, { recursive: true, force: true });
}

function storedPasswordHash() {
  const doc = JSON.parse(fs.readFileSync(path.join(TMP, 'data', 'cms.json'), 'utf8'));
  return doc.settings.passwordHash;
}

wipeTmp();

console.log('Session mode test  (VERCEL=1, no blob → file mode in /tmp)');
console.log('-----------------------------------------------------------');

// 1) Login issues a self-contained signed token and grants access.
console.log('Login issues a signed, self-contained session');
let mw = createCmsMiddleware();
const cookie = await loginCookie(mw);
const rawToken = cookie.split('=')[1];
check('token is <payload>.<hmac> format', /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(rawToken), rawToken.slice(0, 24) + '…');
{
  const r = await call(mw, '/api/admin/cms', 'GET', { cookie });
  check('admin/cms works right after login', r.status === 200, String(r.status));
  const me = JSON.parse((await call(mw, '/api/auth/me', 'GET', { cookie })).body);
  check('auth/me reports authenticated', me.authenticated === true);
  const noStore = !fs.existsSync(path.join(TMP, 'data', 'sessions.json'));
  check('login no longer depends on a session store', noStore);
}

// 2) THE BUG: cold start / another instance wiped /tmp (and any session file)
//    — the same cookie must still authenticate.
console.log('Cold start / other instance (the exact reported bug)');
wipeTmp(); // kills /tmp sessions.json AND cms.json, like a fresh lambda
const mwCold = createCmsMiddleware();
{
  const r = await call(mwCold, '/api/admin/cms', 'GET', { cookie });
  check('session survives a cold start (was 401 "Sign in required.")', r.status === 200, String(r.status) + ' ' + r.body.slice(0, 60));
  const me = JSON.parse((await call(mwCold, '/api/auth/me', 'GET', { cookie })).body);
  check('auth/me authenticated on cold instance', me.authenticated === true);
}

// 3) Tampered tokens are rejected.
console.log('Tampered / forged tokens rejected');
{
  const tampered = rawToken.replace(/.$/, rawToken.slice(-1) === 'A' ? 'B' : 'A');
  const r = await call(mwCold, '/api/admin/cms', 'GET', { cookie: `rc_admin=${tampered}` });
  check('tampered token → 401', r.status === 401, String(r.status));
  const forged = signSessionToken({ v: 1, exp: Date.now() + 60_000, pf: passwordFingerprint(storedPasswordHash()) }, Buffer.from('wrong-secret'));
  const rf = await call(mwCold, '/api/admin/cms', 'GET', { cookie: `rc_admin=${forged}` });
  check('forged token (wrong key) → 401', rf.status === 401, String(rf.status));
}

// 4) Expired tokens are rejected.
console.log('Expired tokens rejected');
{
  const secret = sessionSecretFor(storedPasswordHash());
  const expired = signSessionToken({ v: 1, exp: Date.now() - 1000, pf: passwordFingerprint(storedPasswordHash()) }, secret);
  const r = await call(mwCold, '/api/admin/cms', 'GET', { cookie: `rc_admin=${expired}` });
  check('expired token → 401', r.status === 401, String(r.status));
}

// 5) Changing the password invalidates outstanding sessions.
//    (The login endpoint keeps literal recovery passwords, so we assert the
//    meaningful properties here: the old token dies and the new password
//    works. Password changes verify against the stored hash only.)
console.log('Password change invalidates sessions');
{
  const ok = await call(mwCold, '/api/auth/password', 'POST', {
    cookie,
    body: { currentPassword: 'RudraAdmin@2025', newPassword: 'NewPass@2026' },
  });
  check('password change succeeds', ok.status === 200, String(ok.status) + ' ' + ok.body.slice(0, 60));
  const oldToken = await call(mwCold, '/api/admin/cms', 'GET', { cookie });
  check('old session now → 401', oldToken.status === 401, String(oldToken.status));
  const mwNew = createCmsMiddleware();
  const newCookie = await loginCookie(mwNew, 'NewPass@2026');
  const good = await call(mwNew, '/api/admin/cms', 'GET', { cookie: newCookie });
  check('new password works', good.status === 200, String(good.status));
  // restore the original password so other tests / environments are unaffected
  const back = await call(mwNew, '/api/auth/password', 'POST', {
    cookie: newCookie,
    body: { currentPassword: 'NewPass@2026', newPassword: 'RudraAdmin@2025' },
  });
  check('password restored', back.status === 200, String(back.status));
  const afterBack = await call(mwNew, '/api/admin/cms', 'GET', { cookie: newCookie });
  check('session from before restore is invalidated by restore', afterBack.status === 401, String(afterBack.status));
  const mwRestore = createCmsMiddleware();
  const restoreCookie = await loginCookie(mwRestore, 'RudraAdmin@2025');
  const finalOk = await call(mwRestore, '/api/admin/cms', 'GET', { cookie: restoreCookie });
  check('login works after restore', finalOk.status === 200, String(finalOk.status));
}

// 6) Legacy store-based sessions (cookies issued before this change) keep working.
console.log('Legacy session-store cookies still accepted');
{
  const legacyToken = 'legacy0token1234567890abcdef12345678';
  const sessFile = path.join(TMP, 'data', 'sessions.json');
  fs.mkdirSync(path.dirname(sessFile), { recursive: true });
  fs.writeFileSync(
    sessFile,
    JSON.stringify({ [legacyToken]: { createdAt: Date.now(), expiresAt: Date.now() + 3_600_000 } })
  );
  const mwLegacy = createCmsMiddleware();
  const me = JSON.parse((await call(mwLegacy, '/api/auth/me', 'GET', { cookie: `rc_admin=${legacyToken}` })).body);
  check('legacy cookie authenticates', me.authenticated === true);
  const r = await call(mwLegacy, '/api/admin/cms', 'GET', { cookie: `rc_admin=${legacyToken}` });
  check('legacy cookie reaches admin/cms', r.status === 200, String(r.status));
}

console.log('-----------------------------------------------------------');
console.log(failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
