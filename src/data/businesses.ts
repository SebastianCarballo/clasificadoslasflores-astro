import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import type { Business, CategorySlug, PlanTier } from '@/types';
import { normalizeText } from '@/utils/site';

// Capa de acceso a datos sobre Content Collections (validado con zod en build).
// Un negocio/categoría/plan nuevo = un archivo JSON en src/content. Sin tocar código.

// Assets locales: el JSON guarda el nombre de archivo, acá se resuelve a metadata
// (dimensiones reales → cero CLS, optimización con sharp en build).
const assetImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/negocios/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

function img(file: string): ImageMetadata | string {
  // Rutas públicas (/) van directo; archivos se resuelven a metadata local.
  if (file.startsWith('/')) return file;
  const mod = assetImages[`/src/assets/negocios/${file}`];
  if (!mod) throw new Error(`Falta imagen local en src/assets/negocios: ${file}`);
  return mod.default;
}

type BusinessRaw = Omit<Business, 'slug' | 'image' | 'gallery'> & { image: string; gallery: string[] };

function toBusiness(id: string, data: BusinessRaw): Business {
  return { ...data, slug: id, image: img(data.image), gallery: data.gallery.map(img) };
}

export async function listBusinesses(): Promise<Business[]> {
  const entries = await getCollection('businesses');
  return entries.map((e) => toBusiness(e.id, e.data as BusinessRaw));
}

export async function getBusiness(slug: string): Promise<Business | undefined> {
  const entries = await getCollection('businesses');
  const found = entries.find((e) => e.id === slug);
  return found ? toBusiness(found.id, found.data as BusinessRaw) : undefined;
}

export async function getRelated(businessSlug: string, limit = 3): Promise<Business[]> {
  const current = await getBusiness(businessSlug);
  if (!current) return [];
  const all = await listBusinesses();
  return all.filter((b) => b.slug !== businessSlug && b.category === current.category).slice(0, limit);
}

const PLAN_ORDER: Record<PlanTier, number> = { oro: 0, plata: 1, bronce: 2, gratis: 3 };

export function rankBusinesses(list: Business[]): Business[] {
  return [...list].sort((a, b) => PLAN_ORDER[a.plan] - PLAN_ORDER[b.plan] || a.name.localeCompare(b.name));
}

export async function searchBusinesses(query: string, category?: string): Promise<Business[]> {
  const q = normalizeText(query.trim());
  const all = await listBusinesses();
  return rankBusinesses(
    all.filter((b) => {
      const matchesCategory =
        !category || category === 'todas' || (b.category as string) === category;
      if (!q) return matchesCategory;
      const haystack = normalizeText(
        `${b.name} ${b.shortDescription} ${b.description} ${b.tags.join(' ')} ${b.address}`,
      );
      return matchesCategory && q.split(/\s+/).every((w) => haystack.includes(w));
    }),
  );
}

export type { CategorySlug };
