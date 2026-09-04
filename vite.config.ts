import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import {createCmsMiddleware} from './server/cms.mjs';

const brazilHeaders = {
  'Content-Language': 'pt-BR, en',
  'X-Deploy-Region': 'southamerica-northeast1',
  'X-Deploy-Country': 'BR',
  'X-Timezone': 'America/Sao_Paulo',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function originFromReq(req: {headers: Record<string, unknown>; socket?: {encrypted?: boolean}}): string {
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000');
  const xfProto = String(req.headers['x-forwarded-proto'] || '');
  const proto = xfProto || (req.socket?.encrypted ? 'https' : 'http');
  return `${proto}://${host}`;
}

function injectOriginPlugin(): Plugin {
  const rewrite = (body: string, origin: string) => body.replaceAll('__SITE_ORIGIN__', origin);

  const attach = (server: {middlewares: {use: Function}}) => {
    server.middlewares.use((req: {url?: string; headers: Record<string, unknown>; socket?: {encrypted?: boolean}}, res: {end: Function; setHeader: Function}, next: Function) => {
      for (const [key, value] of Object.entries(brazilHeaders)) {
        res.setHeader(key, value);
      }
      const url = (req.url || '').split('?')[0];
      if (url.startsWith('/api/')) return next();
      const injectExt = ['.xml', '.txt', '.json', '.html', '.webmanifest'];
      const should = injectExt.some((ext) => url.endsWith(ext)) || url.endsWith('/') || url === '/robots.txt';
      if (!should) return next();

      const publicDir = path.resolve(__dirname, 'public');
      const rel = url === '/' ? '' : url;
      const candidates = [
        path.join(publicDir, rel),
        path.join(publicDir, rel, 'index.html'),
      ];
      const file = candidates.find((f) => f.startsWith(publicDir) && fs.existsSync(f) && fs.statSync(f).isFile());
      if (!file) return next();

      const origin = originFromReq(req);
      let body = rewrite(fs.readFileSync(file, 'utf8'), origin);
      const type = file.endsWith('.xml')
        ? 'application/xml; charset=utf-8'
        : file.endsWith('.json')
          ? 'application/json; charset=utf-8'
          : file.endsWith('.webmanifest')
            ? 'application/manifest+json; charset=utf-8'
            : file.endsWith('.html')
              ? 'text/html; charset=utf-8'
              : 'text/plain; charset=utf-8';
      res.setHeader('Content-Type', type);
      res.end(body);
    });
  };

  return {
    name: 'inject-site-origin',
    configureServer(server) {
      attach(server);
    },
    configurePreviewServer(server) {
      attach(server);
    },
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_ORIGIN__', '');
    },
  };
}

function cmsApiPlugin(): Plugin {
  return {
    name: 'cms-api',
    configureServer(server) {
      server.middlewares.use(createCmsMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(createCmsMiddleware());
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [cmsApiPlugin(), react(), tailwindcss(), injectOriginPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      headers: brazilHeaders,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      headers: brazilHeaders,
    },
  };
});
