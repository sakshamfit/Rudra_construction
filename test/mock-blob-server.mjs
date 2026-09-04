/**
 * Standalone mock of the Vercel Blob REST API (for tests).
 * Stores blobs under /tmp/mock-blob-store and listens on 127.0.0.1:9877.
 * Usage: node test/mock-blob-server.mjs
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const BLOB_STORE = '/tmp/mock-blob-store';
const TOKEN = 'test-token';

fs.mkdirSync(BLOB_STORE, { recursive: true });

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  const token = u.searchParams.get('token');
  const parts = u.pathname.split('/').filter(Boolean);
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
}).listen(9877, '127.0.0.1', () => console.log('mock blob on 9877'));
