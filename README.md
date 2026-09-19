# Clasificados Las Flores — Astro

Directorio local de Las Flores (Buenos Aires). Astro 5 + Tailwind 4 + TypeScript strict.

## Arquitectura

```
src/
  types.ts              # Business, Category, Plan (+ CategorySlug, PlanTier)
  content.config.ts     # Schemas zod: businesses, categories, plans
  content/
    businesses/*.json   # 1 archivo = 1 ficha (agregar negocio = agregar archivo)
    categories/*.json
    plans/*.json
  data/                 # Capa de acceso async sobre getCollection()
  utils/site.ts         # SEO, Schema.org, WhatsApp, formato ARS, normalizeText
  layouts/BaseLayout.astro  # SEO, OG, fonts self-hosted, header/footer
  components/           # Header, Footer, CategoryGrid, BusinessCard (<Image>), PlanCard, SectionHeading
  pages/
    index.astro         # Home: hero + buscador, categorías, Oro, recientes, planes
    directorio.astro    # Búsqueda 100% cliente con índice + normalización de acentos
    comercio/[slug].astro   # Ficha SEO con LocalBusiness+geo+BreadcrumbList, mapa OSM, WhatsApp
    categoria/[slug].astro
    planes.astro / publicar.astro / contacto.astro / nosotros.astro / 404.astro
    sitemap.xml.ts      # Generado desde collections
scripts/smoke.mjs       # 24 smoke tests + budgets (cero dependencias)
public/robots.txt, favicon.svg, og-cover.svg
```

## Buenas prácticas aplicadas

- **Rendimiento:** SSG 100%, 0 JS por defecto, 1 script inline <1KB solo en directorio, imágenes lazy + async decode.
- **SEO local:** canonical, OG/Twitter, sitemap, robots, breadcrumb, JSON-LD `LocalBusiness` por ficha y `WebSite+SearchAction` en home.
- **Accesibilidad:** skip-link, landmarks, labels, `aria-current`, focos visibles, contraste.
- **Mobile-first + responsive**, cards con jerarquía Oro > Plata > Bronce > Gratis.
- **CRO WhatsApp:** mensaje prediseñado `wa.me` en cada ficha con plan habilitado.
- **TypeScript strict** con alias `@/*`.

## Comandos

```bash
pnpm install
pnpm dev         # http://localhost:4321
pnpm build       # dist/
pnpm preview
pnpm check       # tipos (0 errores exigido)
pnpm smoke       # build + preview + 24 asserts + budgets
pnpm verify      # check + smoke
```

## Siguiente paso

Conectar `src/data/*` a un CMS (Sanity/Strapi/Supabase) o a Content Collections y agregar `astro:assets` + View Transitions.
# clasificadoslasflores-astro
