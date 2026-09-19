// Analítica liviana y privada por defecto.
// Cómo activar: definí ANALYTICS_DOMAIN con tu dominio de Plausible
// y agregá su script en BaseLayout. Sin dominio, track() es no-op (cero costo).
// Compatible con Plausible: si window.plausible existe, lo usa.

export const ANALYTICS_DOMAIN = '';

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
  }
}

export function track(event: string, props: Record<string, string> = {}): void {
  try {
    if (!ANALYTICS_DOMAIN) return;
    window.plausible?.(event, { props });
  } catch {
    // La analítica nunca debe romper la experiencia
  }
}
