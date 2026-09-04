#!/usr/bin/env node
/**
 * Production static server — India (Asia/Kolkata) environment.
 * Timezone Asia/Kolkata, Content-Language en-IN,hi-IN, region asia-south1.
 * SPA fallback for /admin fixed — no redirect, serves index.html.
 */
process.env.TZ = process.env.TZ || 'Asia/Kolkata';
process.env.LANG = process.env.LANG || 'en_IN.UTF-8';

import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCmsMiddleware } from './server/cms.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DIST = fs.existsSync(path.join(ROOT, 'dist')) ? path.join(ROOT, 'dist') : path.join(ROOT, 'public');
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);

app.use(createCmsMiddleware());

app.use((req, res, next) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  res.locals.origin = origin;
  res.setHeader('Content-Language', 'en-IN, hi-IN');
  res.setHeader('X-Deploy-Region', 'asia-south1');
  res.setHeader('X-Deploy-Country', 'IN');
  res.setHeader('X-Timezone', 'Asia/Kolkata');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=(), camera=()');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Vary', 'Accept-Language');
  next();
});

function injectOrigin(html, origin) {
  return html.replaceAll('__SITE_ORIGIN__', origin);
}

// Early SPA handler for /admin and /blog — must be BEFORE static to avoid 301 redirect
app.get(['/admin', '/admin/', '/admin/*', '/blog', '/blog/*'], (req, res, next) => {
  // admin SPA: always serve index.html
  if (req.path === '/admin' || req.path === '/admin/' || req.path.startsWith('/admin/')) {
    const index = path.join(DIST, 'index.html');
    if (fs.existsSync(index)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.send(injectOrigin(fs.readFileSync(index, 'utf8'), res.locals.origin));
    }
  }
  return next();
});

app.get(['/sitemap.xml', '/sitemap-pages.xml', '/sitemap-pt-br.xml', '/sitemap-images.xml', '/sitemap-hi.xml', '/rss.xml', '/atom.xml', '/robots.txt', '/feed.json', '/llms.txt', '/llms-full.txt', '/seo-index.json', '/humans.txt'], (req, res, next) => {
  const file = path.join(DIST, req.path);
  if (!fs.existsSync(file)) return next();
  const body = injectOrigin(fs.readFileSync(file, 'utf8'), res.locals.origin);
  const type = req.path.endsWith('.xml')
    ? 'application/xml; charset=utf-8'
    : req.path.endsWith('.json')
      ? 'application/feed+json; charset=utf-8'
      : 'text/plain; charset=utf-8';
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.send(body);
});

app.use((req, res, next) => {
  // For other HTML pages: /about/ etc
  if (req.path.startsWith('/api/')) return next();
  if (req.path === '/admin' || req.path.startsWith('/admin/') || req.path === '/blog' || req.path.startsWith('/blog/')) {
    return next();
  }
  if (!req.path.endsWith('.html') && req.path !== '/' && !req.path.endsWith('/')) return next();
  const rel = req.path === '/' ? 'index.html' : req.path.endsWith('/') ? path.join(req.path, 'index.html') : req.path;
  const file = path.join(DIST, rel);
  if (!fs.existsSync(file) || !file.endsWith('.html')) return next();
  let html = fs.readFileSync(file, 'utf8');
  html = injectOrigin(html, res.locals.origin);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.send(html);
});

app.use(
  express.static(DIST, {
    extensions: ['html'],
    redirect: false,
    maxAge: '7d',
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'public, max-age=60');
    },
  })
);

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  const index = path.join(DIST, 'index.html');
  if (fs.existsSync(index)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(injectOrigin(fs.readFileSync(index, 'utf8'), res.locals.origin));
    return;
  }
  res.status(404).send('Not found');
});

app.listen(PORT, HOST, () => {
  console.log(`Rudra Constructions listening on http://${HOST}:${PORT}`);
  console.log(`TZ=${process.env.TZ} LANG=${process.env.LANG} region=asia-south1 country=IN Indian SEO — admin SPA fixed`);
});
