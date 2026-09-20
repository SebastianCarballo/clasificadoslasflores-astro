import { listBusinesses } from '@/data/businesses';
import { listCategories } from '@/data/categories';

// Índice compacto para el asistente virtual. Se genera en build desde las
// collections y se sirve como JSON estático; el widget lo pide solo al abrirse.
export async function GET() {
  const [businesses, categories] = await Promise.all([listBusinesses(), listCategories()]);
  const catName = new Map(categories.map((c) => [c.slug, c.name]));
  const negocios = businesses.map((b) => ({
    slug: b.slug,
    nombre: b.name,
    categoria: catName.get(b.category) ?? b.category,
    resumen: b.shortDescription,
    direccion: b.address,
    horarios: b.hours,
    plan: b.plan,
    rating: b.rating,
    verificado: b.verified,
    wa: b.hasWhatsAppButton ? (b.whatsapp ?? null) : null,
    telefono: b.phone,
    ...(b.catalogo && b.catalogo.length > 0 && { catalogo: b.catalogo }),
    haystack: `${b.name} ${b.shortDescription} ${b.description} ${b.tags.join(' ')} ${b.address}`,
  }));
  const body = JSON.stringify({
    negocios,
    categorias: categories.map((c) => ({ slug: c.slug, nombre: c.name })),
  });
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
