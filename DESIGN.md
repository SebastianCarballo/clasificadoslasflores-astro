---
version: "0.4"
name: Clasificados Las Flores
description: Sistema visual local, claro y confiable para descubrir comercios y servicios de Las Flores.
colors:
  primary: "#155ddc"
  primary-hover: "#184eb4"
  primary-soft: "#eef7ff"
  secondary: "#0f172a"
  secondary-soft: "#f8fafc"
  accent: "#f59e0b"
  accent-strong: "#d97706"
  surface: "#ffffff"
  text: "#0f172a"
  text-muted: "#475569"
  on-primary: "#ffffff"
  on-secondary: "#ffffff"
  on-accent: "#0f172a"
typography:
  display:
    fontFamily: Sora
    fontSize: 3rem
    fontWeight: 800
    lineHeight: 1.05
  heading:
    fontFamily: Sora
    fontSize: 1.875rem
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.08em
rounded:
  sm: 0.75rem
  md: 1rem
  lg: 1.5rem
spacing:
  xs: 0.5rem
  sm: 0.75rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  section: 4rem
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.5rem"
    height: 3rem
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.5rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1rem"
  page-background:
    backgroundColor: "{colors.secondary-soft}"
    textColor: "{colors.text}"
  muted-content:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.text-muted}"
  featured-badge:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  featured-badge-strong:
    backgroundColor: "{colors.accent-strong}"
    textColor: "{colors.on-accent}"
  card-border:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
---

## Overview

Clasificados Las Flores is a local directory for people who need a useful answer quickly and for businesses that need trustworthy visibility. The interface should feel local, direct and dependable: strong information hierarchy, generous touch targets and clear paths to search or contact.

The visual language combines editorial confidence with practical utility. Sora gives headlines a distinctive local brand voice, while Inter keeps search, metadata and business details easy to scan.

## Colors

- **Primary:** Clasificados blue is used for links, primary actions and active states.
- **Secondary:** Deep ink anchors the header, hero sections and high-contrast content blocks.
- **Accent:** Amber signals featured Oro listings, highlights and important promotional emphasis.
- **Surface:** White surfaces sit on the soft slate background. Borders use the same cool neutral family and remain subtle.
- **Text:** Use deep ink for content and muted slate for supporting information. Do not use light gray text on white for essential content.

Keep primary blue as the main action color. Amber is an accent, not a second primary action color.

## Typography

Use Sora for display headings and section titles. Use Inter for body copy, controls, labels and business metadata. Headings should be short and scannable; avoid long all-caps text. Body copy should remain comfortable on mobile and preserve a line height near 1.6.

## Layout

Use a mobile-first layout with a centered content width of `max-w-7xl`. Sections should breathe with consistent vertical spacing and should not become nested cards. Search, category filters and contact actions must remain reachable with one hand on narrow screens.

Use responsive grids for repeated content: one column on small screens, two columns on medium screens and three or four columns only when the content remains legible. Keep the sticky header offset in anchor navigation.

## Elevation & Depth

Prefer borders and restrained shadows over large floating effects. Use a small shadow for interactive cards and menus, and stronger depth only for the hero search or mobile navigation. Gradients may create atmosphere in hero and CTA bands, but they must not reduce text contrast.

## Shapes

Use rounded corners consistently: `sm` for controls, `md` for compact panels and `lg` for cards or major surfaces. Pills are reserved for filters, tags and status badges. Do not use pills for large content containers.

## Components

- **Primary button:** Blue background, white text, strong weight and a minimum touch height of 48px.
- **Secondary button:** Deep ink background or an outlined neutral treatment when the primary action is already visible.
- **Business card:** White surface, subtle border, clear plan hierarchy, image with stable aspect ratio and a direct WhatsApp action when available.
- **Search:** A labeled input paired with a category control and a visible submit action. It must work with a normal GET request without JavaScript.
- **Navigation:** Desktop links expose the current page. Mobile navigation uses a native disclosure and closes on Escape or outside click.
- **Featured listing:** Use amber sparingly for Oro status; never rely on color alone to communicate plan or verification.

## Do's and Don'ts

- Do make the business name, category, location and contact action easy to scan.
- Do preserve visible focus states and a minimum 44px interactive target.
- Do use real content and local context before decorative elements.
- Do keep the design expressive through typography, hierarchy and restrained color contrast.
- Don't introduce a new font, purple palette or unrelated rounded-card style.
- Don't hide essential information behind hover-only interactions.
- Don't use amber as the default button color or combine several competing gradients.
- Don't sacrifice readability for dense dashboards or oversized hero text.
