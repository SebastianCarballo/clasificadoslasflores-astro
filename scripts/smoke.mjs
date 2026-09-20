// Smoke tests de Clasificados Las Flores — sin dependencias (usa fetch global de Node 20+).
// Uso: pnpm smoke  (compila, levanta preview, verifica, apaga)
// Cubre: status, SEO crítico, schema, índice de búsqueda, mapa, budgets de peso.

import { spawn } from 'node:child_process';

const PORT = 4333;
const BASE = `http://127.0.0.1:${PORT}`;
const BUDGETS = { homeHtmlBytes: 88_000, cssBytes: 70_000 };
const packageManager = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

let failures = 0;
function check(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
}

async function get(path) {
  const res = await fetch(BASE + path);
  const ct = res.headers.get('content-type') ?? '';
  const text = /html|xml|text|svg|json/.test(ct) ? await res.text() : '';
  return { status: res.status, text, headers: res.headers };
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { shell: true, stdio: 'pipe' });
    p.on('error', reject);
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))));
  });
}

function startPreview() {
  return new Promise((resolve, reject) => {
    const p = spawn(packageManager, ['preview', '--port', String(PORT), '--host', '127.0.0.1'], {
      shell: true,
      stdio: 'inherit',
    });
    p.on('error', reject);
    const timer = setTimeout(() => reject(new Error('preview timeout')), 30_000);
    const poll = async () => {
      try {
        const r = await fetch(BASE + '/');
        if (r.ok) {
          clearTimeout(timer);
          resolve(p);
        } else setTimeout(poll, 300);
      } catch {
        setTimeout(poll, 300);
      }
    };
    poll();
  });
}

// 1. Build
console.log('> pnpm build');
await run(packageManager, ['build']);

// 2. Preview
console.log('> preview en', BASE);
const preview = await startPreview();

try {
  const home = await get('/');
  check('home 200', home.status === 200, String(home.status));
  check('home tiene 1 h1', (home.text.match(/<h1/g) ?? []).length === 1);
  check('home canonical', home.text.includes('rel="canonical"'));
  check('home OG propia', home.text.includes('/og-cover.svg'));
  check('home prueba social real', home.text.includes('promedio en') && home.text.includes('verificados'));
  check('home motion system', home.text.includes('data-reveal-group') && home.text.includes('float-soft'));
  check('home iconos SVG marca', home.text.includes('icon-whatsapp') || home.text.includes('icon-search'));
  check('asistente virtual presente', home.text.includes('id="asistente-panel"') && home.text.includes('data-rapido'));
  const botIdx = await get('/bot-index.json');
  check('bot-index.json con negocios', botIdx.status === 200 && botIdx.text.includes('plomero-juan-perez'));
  check('home microcopy anti-riesgo', home.text.includes('Sin tarjeta'));
  check('home copy honesto', home.text.includes('Comercios destacados') && !home.text.includes('de la semana'));
  check('home cómo funciona rediseñado', home.text.includes('De la búsqueda al WhatsApp') && home.text.includes('steps-line'));
  check('home Organization NAP', home.text.includes('"Organization"') && home.text.includes('areaServed'));
  check('home geo-metas', home.text.includes('geo.region') && home.text.includes('AR-B'));
  check('home mobile-first', home.text.includes('viewport-fit=cover') && home.text.includes('min-h-dvh'));
  check('home sin Google Fonts CDN', !home.text.includes('fonts.googleapis.com'));
  check(
    'home sin <img> externos',
    !home.text.includes('src="https://images.unsplash.com'),
    'todo pasa por /_astro',
  );
  check(
    'home HTML dentro de budget',
    Buffer.byteLength(home.text) <= BUDGETS.homeHtmlBytes,
    `${Buffer.byteLength(home.text)} bytes`,
  );

  const dir = await get('/directorio');
  check('directorio 200', dir.status === 200);
  check('directorio índice búsqueda', dir.text.includes('id="businesses-index"'));
  check('directorio 9 cards con data-slug', (dir.text.match(/data-business-card/g) ?? []).length >= 9);
  check('directorio leyenda de insignias (HMW1)', dir.text.includes('Qué significan las insignias'));
  check('directorio anuncia resultados (aria-live)', dir.text.includes('aria-live="polite"'));

  const ficha = await get('/comercio/rotiseria-el-buen-sabor/');
  check('ficha 200', ficha.status === 200);
  check('ficha LocalBusiness + geo', ficha.text.includes('"GeoCoordinates"'));
  check('ficha BreadcrumbList', ficha.text.includes('"BreadcrumbList"'));
  check('ficha mapa OSM', ficha.text.includes('id="mapa-negocio"'));
  check('ficha CTA sticky móvil', ficha.text.includes('Volver al directorio'));
  check('ficha compartir + reportar', ficha.text.includes('btn-compartir') && ficha.text.includes('Datos incorrectos'));
  check('ficha tracking whatsapp', ficha.text.includes('data-event="whatsapp_click"'));
  check('oro tiene catálogo del plan', ficha.text.includes('Catálogo') && ficha.text.includes('Menú del día'));

  const bronce = await get('/comercio/plomero-juan-perez/');
  check('bronce sin badge verificado (es de Plata+)', bronce.status === 200 && !bronce.text.includes('Verificado'));

  const gratis = await get('/comercio/taller-mecanico-el-rayo/');
  check(
    'gratis sin extras (sin CTA WhatsApp, mapa ni catálogo)',
    gratis.status === 200 &&
      !gratis.text.includes('whatsapp_click') &&
      !gratis.text.includes('id="mapa-negocio"') &&
      !gratis.text.includes('Catálogo'),
  );
  check('ficha info antes que imagen (h1 → img)', ficha.text.indexOf('<h1') !== -1 && ficha.text.indexOf('<h1') < ficha.text.indexOf('<img'));

  const alta = await get('/publicar');
  check('publicar expectativas + confirmación (HMW3)', alta.status === 200 && alta.text.includes('Qué pasa después de enviar') && alta.text.includes('form-exito'));
  const altaOro = await get('/publicar?plan=oro');
  check('funnel plan preseleccionado (hook cliente)', altaOro.status === 200 && altaOro.text.includes('planes-map') && altaOro.text.includes('data-plan-banner-cliente'));

  const cat = await get('/categoria/servicios/');
  check('categoría ItemList schema', cat.text.includes('"ItemList"'));

  for (const p of ['/categoria/servicios/', '/planes/', '/publicar/', '/contacto/', '/nosotros/']) {
    const r = await get(p);
    check(`${p} 200`, r.status === 200, String(r.status));
  }
  const planesPage = await get('/planes/');
  check('planes FAQPage AEO', planesPage.text.includes('"FAQPage"') && planesPage.text.includes('¿Cuánto cuesta publicar?'));

  const sm = await get('/sitemap.xml');
  check('sitemap 200 + fichas + lastmod', sm.status === 200 && sm.text.includes('/comercio/') && sm.text.includes('<lastmod>'));
  const robots = await get('/robots.txt');
  check('robots 200', robots.status === 200);
  const og = await get('/og-cover.svg');
  check('og-cover 200', og.status === 200);

  const notFound = await get('/comercio/no-existe-xyz/');
  check('slug inexistente no es 200', notFound.status !== 200, String(notFound.status));
} finally {
  // En Windows el preview corre bajo un shell: matar el árbol completo.
  try {
    if (process.platform === 'win32' && preview.pid) {
      await run('taskkill', ['/PID', String(preview.pid), '/T', '/F']).catch(() => {});
    } else {
      preview.kill('SIGKILL');
    }
  } catch {
    try {
      preview.kill();
    } catch {}
  }
}

if (failures > 0) {
  console.error(`\n${failures} smoke test(s) fallaron`);
  process.exit(1);
}
console.log('\nSmoke tests OK');
