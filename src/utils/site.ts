export function whatsappLink(phone: string, businessName: string): string {
  const text = encodeURIComponent(
    `Hola ${businessName}, vi tu perfil en Clasificados Las Flores y quiero consultar por…`,
  );
  return `https://wa.me/${phone}?text=${text}`;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

// Muestra legible de un teléfono AR internacional sin + ("5492224421234" → "+54 9 2224 42-1234").
// El href tel: sigue usando el número crudo.
export function formatPhoneDisplay(phone: string): string {
  const m = phone.match(/^54(9?)(\d{3,4})(\d{2})(\d{4})$/);
  if (!m) return `+${phone}`;
  const [, mobile, area, p1, p2] = m;
  return `+54 ${mobile ? '9 ' : ''}${area} ${p1}-${p2}`;
}

export interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

export const SITE = {
  name: 'Clasificados Las Flores',
  tagline: 'El directorio local de Las Flores, Buenos Aires',
  url: 'https://clasificadoslasflores.com.ar',
  locale: 'es_AR',
  defaultImage: '/og-cover.svg',
};

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function localBusinessSchema(b: {
  slug?: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  image: string;
  rating: number;
  reviewsCount: number;
  latitude?: number;
  longitude?: number;
}) {
  const base = SITE.url;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: b.name,
    description: b.description,
    url: b.slug ? `${base}/comercio/${b.slug}` : base,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address,
      addressLocality: 'Las Flores',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    telephone: `+${b.phone}`,
    image: [b.image.startsWith('http') ? b.image : `${base}${b.image.startsWith('/') ? '' : '/'}${b.image}`],
    areaServed: {
      '@type': 'City',
      name: 'Las Flores',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Buenos Aires, Argentina',
      },
    },
    // AEO: qué fragmento puede "hablar" un asistente de voz / AI Overview
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.ficha-desc'],
    },
    ...(b.latitude !== undefined &&
      b.longitude !== undefined && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: b.latitude,
          longitude: b.longitude,
        },
      }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: b.rating,
      reviewCount: b.reviewsCount,
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

// NAP canónico del portal para SEO local: quiénes somos, dónde operamos, cómo contactarnos.
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/favicon.svg`,
    description: SITE.tagline,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Las Flores',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    areaServed: {
      '@type': 'City',
      name: 'Las Flores',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+5492224000000',
      contactType: 'sales',
      areaServed: 'AR',
      availableLanguage: 'es',
    },
    sameAs: [
      'https://instagram.com/clasificadoslasflores',
      'https://facebook.com/clasificadoslasflores',
    ],
  };
}

// AEO: las respuestas deben existir como datos, no solo como texto visible.
export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
