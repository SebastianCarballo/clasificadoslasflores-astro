// Vendoriza las imágenes remotas del directorio a src/assets/negocios en alta calidad.
// - Descarga cada URL única como <slug>-<n>.jpg (fuente w=1600 para mejor webp final)
// - Reescribe los JSON (image + gallery) con el nombre de archivo local
// Uso: node scripts/vendor-images.mjs  (idempotente: salta archivos existentes)
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'src', 'content', 'businesses');
const OUT = join(ROOT, 'src', 'assets', 'negocios');

await mkdir(OUT, { recursive: true });

const hd = (url) => url.replace('w=800', 'w=1600').replace('q=80', 'q=90');

const files = (await readdir(DIR)).filter((f) => f.endsWith('.json'));
let descargadas = 0;
for (const f of files) {
  const slug = f.replace('.json', '');
  const path = join(DIR, f);
  const data = JSON.parse(await readFile(path, 'utf-8'));
  const urls = [data.image, ...data.gallery];
  const mapa = new Map();
  for (const url of urls) {
    if (!mapa.has(url)) {
      const file = `${slug}-${mapa.size}.jpg`;
      const dest = join(OUT, file);
      try {
        await readFile(dest);
        console.log(`=  ${file} (ya existe)`);
      } catch {
        const res = await fetch(hd(url));
        if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
        await writeFile(dest, Buffer.from(await res.arrayBuffer()));
        descargadas++;
        console.log(`↓  ${file} (${(await readFile(dest)).length} bytes)`);
      }
      mapa.set(url, file);
    }
  }
  data.image = mapa.get(data.image);
  data.gallery = data.gallery.map((u) => mapa.get(u));
  await writeFile(path, JSON.stringify(data, null, 2) + '\n');
}
console.log(`\nListo: ${descargadas} descargadas, ${files.length} JSON actualizados.`);
