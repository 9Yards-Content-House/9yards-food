import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://food.9yards.co.ug';
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');

// Define your routes heere.
// In a more complex app, you might want to crawl your routes or import them.
const routes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/menu', priority: 0.9, changefreq: 'daily' },
  { path: '/deals', priority: 0.8, changefreq: 'weekly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/how-it-works', priority: 0.7, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.5, changefreq: 'yearly' },
  { path: '/terms', priority: 0.5, changefreq: 'yearly' },
];

const generateSitemap = () => {
  const date = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
    .map(
      (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log(`✅ Sitemap generated at ${SITEMAP_PATH}`);
};

generateSitemap();
