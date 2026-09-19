import { getCollection } from 'astro:content';
import type { Category } from '@/types';

export type CategoryWithSlug = Category & { slug: string };

export async function listCategories(): Promise<CategoryWithSlug[]> {
  const entries = await getCollection('categories');
  return entries.map((e) => ({
    slug: e.id,
    name: e.data.name,
    description: e.data.description,
    icon: e.data.icon,
    color: e.data.color,
  }));
}

export async function getCategory(slug: string): Promise<CategoryWithSlug | undefined> {
  const entries = await getCollection('categories');
  const found = entries.find((e) => e.id === slug);
  if (!found) return undefined;
  return {
    slug: found.id,
    name: found.data.name,
    description: found.data.description,
    icon: found.data.icon,
    color: found.data.color,
  };
}

export async function countByCategory(): Promise<Record<string, number>> {
  const businesses = await getCollection('businesses');
  const counts: Record<string, number> = {};
  for (const b of businesses) {
    const cat = b.data.category;
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  return counts;
}
