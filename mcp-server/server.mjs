// MCP server "clasificados-las-flores" (stdio).
// Expone el directorio como tools para que cualquier agente MCP pueda:
// buscar negocios, ver fichas, listar categorías y explicar los planes.
// Fuente de verdad: ../src/content/*.json (mismos datos que la web).

import { readFile, readdir } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content');

async function loadCollection(dir) {
  const files = (await readdir(join(ROOT, dir))).filter((f) => f.endsWith('.json'));
  const entries = [];
  for (const f of files) {
    const data = JSON.parse(await readFile(join(ROOT, dir, f), 'utf-8'));
    entries.push({ slug: basename(f, '.json'), ...data });
  }
  return entries;
}

const norm = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const PLAN_ORDER = { oro: 0, plata: 1, bronce: 2, gratis: 3 };
const rank = (list) =>
  [...list].sort((a, b) => PLAN_ORDER[a.plan] - PLAN_ORDER[b.plan] || String(a.name).localeCompare(String(b.name)));

const server = new McpServer({
  name: 'clasificados-las-flores',
  version: '1.0.0',
});

server.registerTool(
  'buscar_negocios',
  {
    title: 'Buscar negocios en el directorio',
    description:
      'Busca comercios, oficios y servicios de Las Flores por texto libre y/o categoría. Devuelve ordenados por plan (Oro primero).',
    inputSchema: {
      consulta: z.string().describe('Texto libre: ej "plomero", "pizza", "alquiler"').optional(),
      categoria: z
        .enum(['gastronomia', 'servicios', 'comercios', 'inmuebles', 'vehiculos', 'empleo', 'salud', 'educacion'])
        .describe('Filtra por categoría')
        .optional(),
    },
  },
  async ({ consulta = '', categoria }) => {
    const all = await loadCollection('businesses');
    const q = norm(consulta.trim());
    const words = q ? q.split(/\s+/) : [];
    const out = rank(
      all
        .filter((b) => !categoria || b.category === categoria)
        .filter((b) => {
          if (!words.length) return true;
          const hay = norm(`${b.name} ${b.shortDescription} ${b.description} ${b.tags.join(' ')} ${b.address}`);
          return words.every((w) => hay.includes(w));
        })
        .map((b) => ({
          slug: b.slug,
          nombre: b.name,
          categoria: b.category,
          resumen: b.shortDescription,
          direccion: b.address,
          horarios: b.hours,
          plan: b.plan,
          verificado: b.verified,
          whatsapp: b.hasWhatsAppButton ? b.whatsapp ?? null : null,
          ficha: `https://clasificadoslasflores.com.ar/comercio/${b.slug}`,
        })),
    );
    return { content: [{ type: 'text', text: JSON.stringify(out, null, 2) }] };
  },
);

server.registerTool(
  'ver_negocio',
  {
    title: 'Ver ficha completa de un negocio',
    description: 'Devuelve todos los datos de un negocio por su slug.',
    inputSchema: { slug: z.string().describe('Slug del negocio, ej "ficha-gratis-muestra"') },
  },
  async ({ slug }) => {
    const all = await loadCollection('businesses');
    const b = all.find((x) => x.slug === slug);
    if (!b) return { content: [{ type: 'text', text: `No existe el negocio "${slug}".` }], isError: true };
    return { content: [{ type: 'text', text: JSON.stringify(b, null, 2) }] };
  },
);

server.registerTool(
  'listar_categorias',
  {
    title: 'Listar categorías del directorio',
    description: 'Devuelve las 8 categorías con su descripción y cantidad de publicados.',
    inputSchema: {},
  },
  async () => {
    const [cats, biz] = await Promise.all([loadCollection('categories'), loadCollection('businesses')]);
    const out = cats.map((c) => ({
      ...c,
      publicados: biz.filter((b) => b.category === c.slug).length,
    }));
    return { content: [{ type: 'text', text: JSON.stringify(out, null, 2) }] };
  },
);

server.registerTool(
  'ver_planes',
  {
    title: 'Ver planes y precios',
    description:
      'Devuelve los 4 planes del modelo de negocio (Gratis, Bronce $5.000, Plata $12.000, Oro $25.000) con features. Úsalo cuando pregunten por publicar, precios o visibilidad.',
    inputSchema: {},
  },
  async () => {
    const plans = await loadCollection('plans');
    const order = ['gratis', 'bronce', 'plata', 'oro'];
    plans.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
    return { content: [{ type: 'text', text: JSON.stringify(plans, null, 2) }] };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
