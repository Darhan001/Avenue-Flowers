import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { ordersRouter } from './routes/orders.js';
import { seoRouter } from './routes/seo.js';
import { escapeHtml } from '../public/js/utils/format.js';

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(rootDir, 'public');

// Внешние источники, которые использует страница: шрифты Google, Font Awesome, Google Maps.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
  "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "img-src 'self' data: https:",
  "frame-src https://www.google.com https://maps.google.com",
  "connect-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
].join('; ');

function securityHeaders(req, res, next) {
  res.set({
    'Content-Security-Policy': CONTENT_SECURITY_POLICY,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  });
  if (req.secure) {
    res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  // Хостинг (Render) стоит за прокси: без этого rate-limit видит один IP на всех клиентов.
  app.set('trust proxy', config.trustProxy);
  app.use(securityHeaders);
  app.use(express.json({ limit: '32kb' }));

  app.use(seoRouter);
  app.use('/api/orders', ordersRouter);
  app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

  // index.html читаем один раз и подставляем публичный адрес сайта (canonical, og:url, sitemap)
  // и, если задан, метатег подтверждения для Google Search Console.
  const verificationTag = config.googleSiteVerification
    ? `<meta name="google-site-verification" content="${escapeHtml(config.googleSiteVerification)}">`
    : '';
  const indexHtml = fs
    .readFileSync(path.join(publicDir, 'index.html'), 'utf8')
    .replaceAll('__SITE_URL__', config.siteUrl)
    .replace('<!-- __GOOGLE_SITE_VERIFICATION__ -->', verificationTag);
  app.get(['/', '/index.html'], (req, res) => res.type('html').send(indexHtml));

  app.use(express.static(publicDir, { index: false, maxAge: '1d' }));

  app.use((req, res) => res.status(404).type('text').send('Страница не найдена'));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Некорректный запрос' });
    }
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  });

  return app;
}
