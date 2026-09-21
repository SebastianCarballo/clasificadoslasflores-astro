import type { ImageMetadata } from 'astro';

export type PlanTier = 'gratis' | 'bronce' | 'plata' | 'oro';

export type CategorySlug =
  | 'gastronomia'
  | 'servicios'
  | 'comercios'
  | 'inmuebles'
  | 'vehiculos'
  | 'empleo'
  | 'salud'
  | 'educacion';

export interface Business {
  slug: string;
  name: string;
  category: CategorySlug; // slug de categoría
  description: string;
  shortDescription: string;
  address: string;
  phone: string; // formato internacional sin +
  whatsapp?: string;
  hasWhatsAppButton: boolean;
  hours: string;
  image: ImageMetadata | string;
  gallery: (ImageMetadata | string)[];
  verified: boolean;
  featured: boolean;
  /** Modelo de muestra: se rotula como tal y vende el lugar en vez del negocio. */
  demo?: boolean;
  plan: PlanTier;
  tags: string[];
  catalogo?: { nombre: string; precio: string }[];
  latitude?: number;
  longitude?: number;
  instagram?: string;
  facebook?: string;
  website?: string;
  createdAt: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string; // emoji o nombre de icono inline SVG key
  color: string; // clases tailwind
  count?: number;
}

export interface Plan {
  tier: PlanTier;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  features: string[];
  limitations?: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}
