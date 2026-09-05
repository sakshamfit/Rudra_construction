/**
 * Reproduction: upload a photo via /api/admin/photos through the Express
 * production server path (raw streams, no body parser), like the browser does.
 */
import http from 'node:http';
import fs from 'node:fs';
import express from 'express';
import { createCmsMiddleware } from '../server/cms.mjs';

const app = express();
app.use(createCmsMiddleware());
app.use((req, res) => res.status(404).json({ error: 'fallthrough' }));

const server = http.createServer(app);
await new Promise((r) => server.listen(3999, '127.0.0.1', r));

const base = 'http://127.0.0.1:3999';

// 1. login
let login = await fetch(`${base}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'RudraAdmin@2025' }),
});
console.log('login:', login.status);
const cookie = (login.headers.get('set-cookie') || '').split(';')[0];
console.log('cookie:', cookie ? 'got' : 'MISSING');

// 2. build a tiny png data URL
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);
const data = `data:image/png;base64,${png.toString('base64')}`;

// 3. upload
const up = await fetch(`${base}/api/admin/photos`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', cookie },
  body: JSON.stringify({ data, mime: 'image/png', title: 'Repro test', section: 'gallery' }),
});
console.log('upload status:', up.status);
const upBody = await up.json();
console.log('upload body:', JSON.stringify(upBody).slice(0, 400));

if (upBody.photo?.url) {
  const img = await fetch(`${base}${upBody.photo.url}`);
  console.log('fetch uploaded image:', img.status, img.headers.get('content-type'));
  // Clean up: remove the test photo again so the repo state stays pristine.
  await fetch(`${base}/api/admin/photos/${upBody.photo.id}`, { method: 'DELETE', headers: { cookie } });
}

server.close();
