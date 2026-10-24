import { Router } from 'express';
import { config } from '../config.js';

export const seoRouter = Router();

seoRouter.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`,
  );
});

seoRouter.get('/sitemap.xml', (req, res) => {
  const lastmod = new Date().toISOString().slice(0, 10);
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${config.siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
  );
});
