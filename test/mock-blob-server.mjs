/**
 * Standalone mock of the Vercel Blob API (for manual testing).
 * Stores blobs under /tmp/mock-blob-store and listens on 127.0.0.1:9877.
 *
 * Supports:
 *  - Old REST:  GET/POST/DELETE /{prefix}/{key}?token=...
 *  - New SDK:   POST /api/blob (put), POST /delete, GET https://<storeId>.public.blob.vercel-storage.com/<path>
 *               with Authorization: Bearer <token>
 *  - Simple file mock: direct file writes to /tmp/mock-blob-store (used by blob-mode.mjs)
 *
 * Usage: node test/mock-blob-server.mjs
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const BLOB_STORE = '/tmp/mock-blob-store';
const TOKEN = 'test-token';

fs.mkdirSync(BLOB_STORE, { recursive: true });

function getKeyFromUrl(urlPath) {
  // urlPath like /rudra-cms/abc123/cms.json or /rudra-cms/cms.json
  const parts = urlPath.split('/').filter(Boolean);
  // Remove first part if it's prefix? Keep full relative path for storage
  return parts.join('/');
}

function authOk(req, url) {
  const tokenQuery = url.searchParams.get('token');
  if (tokenQuery === TOKEN) return true;
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (auth && auth.startsWith('Bearer ')) {
    const bearer = auth.slice('Bearer '.length);
    if (bearer === TOKEN) return true;
  }
  return false;
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');

  // Handle SDK's put via Vercel API: POST https://vercel.com/api/blob
  // In our mock, BLOB_API_BASE is http://127.0.0.1:9877, so SDK would POST to /api/blob?
  // The real SDK's requestApi goes to https://vercel.com/api/blob by default,
  // but if VERCEL_BLOB_API_URL is set to our mock, it will POST to mock.
  // We handle a simplified version: if body contains pathname, store it.
  if (u.pathname === '/api/blob' || u.pathname === '/api/blob/') {
    if (!authOk(req, u)) {
      res.writeHead(401).end('unauthorized');
      return;
    }
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString('utf8');
        // SDK sends multipart or JSON? Simplified: look for pathname in JSON
        let pathname = 'unknown';
        try {
          const json = JSON.parse(body);
          pathname = json.pathname || json.path || 'unknown';
        } catch {
          // If not JSON, try to extract from header or use random
          pathname = u.searchParams.get('pathname') || `uploads-${Date.now()}.bin`;
        }
        const file = path.join(BLOB_STORE, pathname);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, Buffer.concat(chunks));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ url: `https://mock.public.blob.vercel-storage.com/${pathname}`, pathname }));
      } catch (e) {
        res.writeHead(500).end(String(e));
      }
    });
    return;
  }

  // SDK's del: POST /delete with { urls: [...] }
  if (u.pathname === '/delete') {
    if (!authOk(req, u)) {
      res.writeHead(401).end('unauthorized');
      return;
    }
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const json = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        const urls = json.urls || [];
        for (const url of urls) {
          try {
            const pathname = new URL(url).pathname.slice(1);
            const file = path.join(BLOB_STORE, pathname);
            if (fs.existsSync(file)) fs.unlinkSync(file);
          } catch {
            // url might be pathname directly
            const file = path.join(BLOB_STORE, url);
            if (fs.existsSync(file)) fs.unlinkSync(file);
          }
        }
        res.writeHead(200).end('ok');
      } catch {
        res.writeHead(200).end('ok');
      }
    });
    return;
  }

  // Old REST + direct blob serving: /{prefix}/{secret}/{key}
  const key = getKeyFromUrl(u.pathname);
  const file = path.join(BLOB_STORE, key);

  if (!authOk(req, u) && req.method !== 'GET') {
    // For GET of public blobs, allow without auth in mock (real public blobs are public)
    // But for simplicity require auth for all except GET
    // Check if it's a public get without token — allow for testing
  }

  if (req.method === 'GET') {
    if (!fs.existsSync(file)) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
    res.end(fs.readFileSync(file));
    return;
  }
  if (req.method === 'POST' || req.method === 'PUT') {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.concat(chunks));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ path: key, url: `mock:///${key}` }));
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

server.listen(9877, '127.0.0.1', () => console.log('mock blob on 9877, store:', BLOB_STORE, 'token:', TOKEN));
