import { defineCollection, z } from 'astro:content';

// Fuente única de verdad del vocabulario del dominio.
// Agregar una categoría o plan = agregar un archivo JSON; el schema lo valida en build.
export const CATEGORY_SLUGS = [
  'gastronomia',
  'servicios',
  'comercios',
  'inmuebles',
  'vehiculos',
  'empleo',
  'salud',
  'educacion',
] as const;

export const PLAN_TIERS = ['gratis', 'bronce', 'plata', 'oro'] as const;

const businesses = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(3),
    category: z.enum(CATEGORY_SLUGS),
    description: z.string().min(20),
    shortDescription: z.string().min(10).max(120),
    address: z.string().min(3),
    phone: z.string().regex(/^\d{10,15}$/, 'Teléfono en formato internacional sin +'),
    whatsapp: z
      .string()
      .regex(/^\d{10,15}$/)
      .optional(),
    hasWhatsAppButton: z.boolean().default(false),
    hours: z.string().min(3),
    image: z.string().url(),
    gallery: z.array(z.string().url()).min(1),
    verified: z.boolean().default(false),
    featured: z.boolean().default(false),
    plan: z.enum(PLAN_TIERS),
    rating: z.number().min(0).max(5),
    reviewsCount: z.number().int().min(0),
    tags: z.array(z.string()).default([]),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    instagram: z.string().url().optional(),
    facebook: z.string().url().optional(),
    website: z.string().url().optional(),
    createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
  }),
});

const categories = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    icon: z.string().min(1),
    color: z.string().min(3),
  }),
});

const plans = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(2),
    price: z.number().int().min(0),
    priceLabel: z.string().min(2),
    description: z.string().min(10),
    features: z.array(z.string()).min(1),
    limitations: z.array(z.string()).optional(),
    cta: z.string().min(2),
    highlighted: z.boolean().default(false),
    badge: z.string().optional(),
  }),
});

export const collections = { businesses, categories, plans };
