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
scripts/smoke.mjs       # 30+ smoke tests + budgets (cero dependencias)
mcp-server/             # MCP server (stdio): buscar_negocios, ver_negocio, listar_categorias, ver_planes
.opencode/agent/asistente-clasificados.md  # Agente del negocio (usa el MCP)
opencode.json           # Registra el MCP en opencode (reiniciar sesión para activar)
public/robots.txt, favicon.svg, og-cover.svg
```

## Agente + bot + WhatsApp

- **MCP server:** `mcp-server/server.mjs` lee `src/content/*.json` y expone 4 tools.
  Probar: `cd mcp-server && pnpm install && node test.mjs`.
- **Agente:** `.opencode/agent/asistente-clasificados.md` — responde como el negocio
  (voseo, ranking por plan, derivación a WhatsApp). Requiere reiniciar opencode.
- **Bot web:** `src/components/Asistente.astro` (en todas las páginas vía `BaseLayout`).
  Sin IA externa ni costo: busca en `/bot-index.json` (generado en build, se pide
  solo al abrir), explica planes con precios, recomienda Oro primero y deriva a
  WhatsApp con mensaje prediseñado. Eventos: `bot_open`, `bot_pregunta`.
```

## Buenas prácticas aplicadas

- **Rendimiento:** SSG 100%, 0 JS por defecto, 1 script inline <1KB solo en directorio, imágenes lazy + async decode.
- **SEO local:** canonical, OG/Twitter, sitemap, robots, breadcrumb, JSON-LD `LocalBusiness` por ficha y `WebSite+SearchAction` en home.
- **Accesibilidad:** skip-link, landmarks, labels, `aria-current`, focos visibles, contraste.
- **Mobile-first + responsive**, cards con jerarquía Oro > Plata > Bronce > Gratis.
- **CRO WhatsApp:** mensaje prediseñado `wa.me` en cada ficha con plan habilitado.
- **TypeScript strict** con alias `@/*`.
- **Imágenes:** vendorizadas en `src/assets/negocios` (fuente HD) + `astro:assets`
  (responsive webp + fallback jpg, metadata tipada, cero CLS). Re-vendorizar:
  `node scripts/vendor-images.mjs`.

## Comandos

```bash
pnpm install
pnpm dev         # http://localhost:4321
pnpm build       # dist/
pnpm preview
pnpm check       # tipos (0 errores exigido)
pnpm smoke       # build + preview + 24 asserts + budgets
pnpm verify      # check + smoke
pnpm design:lint # valida tokens y contraste WCAG de DESIGN.md
pnpm design:export # exporta tokens al formato @theme de Tailwind 4
```

## Librerías (solo las que pagan su peso)

- **Reveals con IntersectionObserver propio + CSS** (cero deps, con fallbacks
  sin-JS y sin-IO: el contenido nunca queda oculto).
- **@formkit/auto-animate** — FLIP al filtrar el directorio (solo esa página).
- Rechazadas con criterio: motion (55 KB por un reveal que el IO nativo resuelve),
  shadcn/daisyUI (runtime React + pelean con el design system), swiper (el
  scroll-snap nativo ya gana), pagefind (rompería el ranking por plan), lenis
  (riesgo de accesibilidad).

## Sistema visual

`DESIGN.md` es la fuente de verdad visual para agentes de código y futuras
iteraciones del sitio. Define colores, tipografías, espaciado, radios,
componentes y reglas de uso alineadas con `src/styles/global.css`.

Después de cambiar la identidad visual, ejecutá `pnpm design:lint` para detectar
referencias rotas, contraste insuficiente y tokens huérfanos. La exportación
`pnpm design:export` permite revisar el equivalente de tokens en CSS `@theme`
de Tailwind 4.

## Siguiente paso

Conectar `src/data/*` a un CMS (Sanity/Strapi/Supabase) o a Content Collections y agregar `astro:assets` + View Transitions.
# clasificadoslasflores-astro
