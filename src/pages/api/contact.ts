import type { APIRoute } from 'astro';
import { validateContactInput } from '@/utils/contact';

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_BODY_BYTES = 16_384;

function clientKey(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 });
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return new Response('Unsupported Media Type', { status: 415 });
  }
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) return new Response('Payload Too Large', { status: 413 });

  const key = clientKey(request);
  const now = Date.now();
  for (const [entryKey, entry] of attempts) {
    if (entry.resetAt <= now) attempts.delete(entryKey);
  }
  const previous = attempts.get(key);
  if (!previous || previous.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    previous.count += 1;
    if (previous.count > MAX_ATTEMPTS) {
      return new Response('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((previous.resetAt - now) / 1000)) },
      });
    }
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const result = validateContactInput(payload);
  const honeypot = payload && typeof payload === 'object' ? (payload as Record<string, unknown>).website : '';
  if (typeof honeypot === 'string' && honeypot.trim()) {
    return Response.json({ ok: true });
  }
  if (!result.ok) return Response.json({ ok: false, errors: result.errors }, { status: 422 });

  // The validated payload is ready for the configured mail/CRM provider.
  // The current frontend hands it to WhatsApp after this server check.
  return Response.json({ ok: true, data: result.data });
};

export const ALL: APIRoute = () => new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
