/**
 * Verifies the raised Node cap: a 12 MB photo (≈16 MB base64 JSON body)
 * must now be accepted by the Node server (previously capped at 12 MB
 * decoded, which rejected every large photo sent as base64).
 */
import crypto from 'node:crypto';
import http from 'node:http';
import express from 'express';
import { createCmsMiddleware } from '../server/cms.mjs';

const app = express();
app.use(createCmsMiddleware());
const server = http.createServer(app);
await new Promise((r) => server.listen(3997, '127.0.0.1', r));
const base = 'http://127.0.0.1:3997';

const login = await fetch(`${base}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'RudraAdmin@2025' }),
});
const cookie = (login.headers.get('set-cookie') || '').split(';')[0];

// 12 MB of (compressible-ish) bytes, sent as base64 → ~16 MB body.
const SIZE = 12 * 1024 * 1024;
const buf = crypto.randomBytes(SIZE);
const data = `data:image/jpeg;base64,${buf.toString('base64')}`;
console.log('base64 body size:', (data.length / 1024 / 1024).toFixed(2), 'MB');

const up = await fetch(`${base}/api/admin/photos`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', cookie },
  body: JSON.stringify({ data, mime: 'image/jpeg', title: 'Big photo' }),
});
console.log('12 MB upload status:', up.status);
const body = await up.json();
if (up.status === 201) {
  console.log('PASS — saved at', body.photo.url);
  const img = await fetch(`${base}${body.photo.url}`);
  const bytes = Buffer.from(await img.arrayBuffer());
  console.log('PASS — re-fetched bytes match:', bytes.length === SIZE && bytes.equals(buf));
  // Clean up: remove the test photo again so the repo state stays pristine.
  await fetch(`${base}/api/admin/photos/${body.photo.id}`, { method: 'DELETE', headers: { cookie } });
} else {
  console.log('FAIL —', JSON.stringify(body));
  process.exitCode = 1;
}
server.close();
