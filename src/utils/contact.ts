export const CONTACT_LIMITS = {
  name: 80,
  email: 254,
  subject: 120,
  message: 2000,
} as const;

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export interface ContactValidation {
  ok: boolean;
  errors: Partial<Record<keyof ContactInput, string>>;
  data?: Omit<ContactInput, 'website'>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_OR_TEXT_RE = /[\p{L}\p{N}]/u;

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') : '';
}

export function validateContactInput(input: unknown): ContactValidation {
  const raw = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
  const data = {
    name: clean(raw.name),
    email: clean(raw.email).toLowerCase(),
    subject: clean(raw.subject),
    message: clean(raw.message),
    website: clean(raw.website),
  };
  const errors: ContactValidation['errors'] = {};

  if (data.name.length < 2 || data.name.length > CONTACT_LIMITS.name || !PHONE_OR_TEXT_RE.test(data.name)) {
    errors.name = `El nombre debe tener entre 2 y ${CONTACT_LIMITS.name} caracteres.`;
  }
  if (data.email.length > CONTACT_LIMITS.email || !EMAIL_RE.test(data.email)) {
    errors.email = 'Ingresá un email válido.';
  }
  if (data.subject.length < 3 || data.subject.length > CONTACT_LIMITS.subject) {
    errors.subject = `El asunto debe tener entre 3 y ${CONTACT_LIMITS.subject} caracteres.`;
  }
  if (data.message.length < 10 || data.message.length > CONTACT_LIMITS.message) {
    errors.message = `El mensaje debe tener entre 10 y ${CONTACT_LIMITS.message} caracteres.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, errors, data: { name: data.name, email: data.email, subject: data.subject, message: data.message } };
}
