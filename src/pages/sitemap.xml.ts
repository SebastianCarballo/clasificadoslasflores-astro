import { listBusinesses } from '@/data/businesses';
import { listCategories } from '@/data/categories';

const base = 'https://clasificadoslasflores.com.ar';

export async function GET() {
  const [businesses, categories] = await Promise.all([listBusinesses(), listCategories()]);
  const lastmod = new Date().toISOString().split('T')[0];
  const urls = [
    '',
    '/directorio',
    '/planes',
    '/publicar',
    '/contacto',
    '/nosotros',
    ...categories.map((c) => `/categoria/${c.slug}`),
    ...businesses.map((b) => `/comercio/${b.slug}`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${base}${u || '/'}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${u.startsWith('/comercio') ? '0.8' : '0.9'}</priority></url>`).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
