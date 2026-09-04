export const INDEXNOW_KEY = '7c4e9a2b8f1d46c0a93e5b7d2f8a1c6e';

export const BRAND = {
  name: 'Rudra Constructions & Suppliers',
  legalName: 'Rudra Constructions & Suppliers Pvt. Ltd.',
  tagline: 'Engineering Trust. Constructing Excellence',
  email: 'rudraconstructionsupplier14@gmail.com',
  phone: '+91 8099588978',
  phoneTel: '+918099588978',
  gstin: '10AALCR8492K1Z5',
  cin: 'U45200BR2025PTC049182',
  pan: 'AALCR8492K',
  msme: 'UDYAM-BR-38-0028491',
};

export function getSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  const env = ((import.meta as ImportMeta & {env?: Record<string, string | undefined>}).env || {}) as Record<string, string | undefined>;
  return String(env['VITE_SITE_URL'] || env['APP_URL'] || '').replace(/\/$/, '');
}

export function absUrl(path = '/'): string {
  const origin = getSiteOrigin();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return origin ? `${origin}${normalized}` : normalized;
}
