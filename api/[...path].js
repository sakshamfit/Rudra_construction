/**
 * Vercel serverless function — exposes the same CMS API as server.js so the
 * admin console works on Vercel. A static-only deploy would 404 every /api/*
 * call, leaving the admin panel unable to log in or load data.
 *
 * Re-uses the framework-agnostic connect-style middleware in server/cms.mjs by
 * driving it with the Vercel Node request/response objects.
 */
import { createCmsMiddleware } from '../server/cms.mjs';

const middleware = createCmsMiddleware();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  // Ensure req.url begins with /api/ for the middleware's route matching.
  if (req.url && !req.url.startsWith('/api/') && !req.url.startsWith('/uploads/')) {
    req.url = `/api/${req.url.replace(/^\/+/, '')}`;
  }
  return middleware(req, res, () => {
    if (!res.writableEnded) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  });
}
