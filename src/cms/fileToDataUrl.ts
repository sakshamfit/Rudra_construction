/**
 * Admin photo upload pipeline — "preview at full quality, store tiny".
 *
 * Photos are sent to the CMS API as base64 data URLs inside a JSON body, so
 * two goals have to be met at once:
 *
 *  1. STORAGE MINIMIZATION — when the admin approves a photo it is
 *     re-encoded in the browser (canvas → JPEG/WebP, downscaled to web
 *     dimensions, quality-tuned) toward a tiny storage target
 *     (STORAGE_TARGET_BYTES ≈ 400 KB). Whichever ends up smaller — the
 *     original file or the re-encoded version — is the one that gets stored,
 *     so the library always holds the minimum-size copy.
 *  2. DEPLOYMENT BUDGET — Vercel serverless functions hard-cap request
 *     bodies at ~4.5 MB, so the final payload must also stay under the
 *     current host's byte budget (the storage target is far below it).
 *
 * Files already ≤ SKIP_COMPRESS_BYTES pass through untouched (they are small
 * enough), and GIFs are never re-encoded (canvas would drop their animation).
 */

const MB = 1024 * 1024;
const KB = 1024;

/** Hard cap on the RAW picked file; anything bigger is almost certainly a mistake. */
export const RAW_FILE_LIMIT = 25 * MB;

/** Approved photos are compressed toward this stored size (~400 KB). */
export const STORAGE_TARGET_BYTES = 400 * KB;

/** Files this small are already "minimum" and are stored as-is. */
const SKIP_COMPRESS_BYTES = 100 * KB;

/** Web dimensions: crisp on any screen, tiny in bytes. */
const STORE_MAX_LONG_EDGE = 2048;
/** Never shrink below this longest edge while compressing. */
const STORE_MIN_LONG_EDGE = 900;

export type UploadHost = 'vercel' | 'node';

let currentHost: UploadHost | undefined;

/** Called by the admin console once it knows which host serves the API (/api/admin/cms → host). */
export function setUploadHost(host: string | undefined) {
  currentHost = host === 'vercel' || host === 'node' ? host : undefined;
}

export function getUploadHost(): UploadHost | undefined {
  return currentHost;
}

/** Max DECODED image bytes the current deployment will accept inside the JSON body. */
export function uploadByteBudget(): number {
  // Node server cap is 16 MB decoded; keep the payload (base64 ≈ 4/3 x) under
  // the ~16.5 MB read limit with headroom → 11 MB decoded.
  if (currentHost === 'node') return 11 * MB;
  // Vercel (and unknown hosts — be safe): 4.5 MB platform body cap.
  // 2.5 MB decoded → ~3.34 MB base64 → ~3.4 MB JSON, comfortably under 4.5 MB.
  return 2.5 * MB;
}

export function formatBytes(bytes: number): string {
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / KB))} KB`;
}

export interface PreparedImage {
  data: string;
  mime: string;
  name: string;
  /** True when the image was re-encoded/downscaled before upload. */
  optimized: boolean;
  /** Decoded size in bytes of what will actually be stored. */
  bytes: number;
}

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function fileToDataUrl(file: File): Promise<{ data: string; mime: string; name: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ data: String(reader.result || ''), mime: file.type, name: file.name });
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}

function dataUrlBytes(dataUrl: string): number {
  const idx = dataUrl.indexOf('base64,');
  if (idx === -1) return dataUrl.length;
  const b64 = dataUrl.length - (idx + 'base64,'.length);
  return Math.floor(b64 * 0.75);
}

function mimeOfDataUrl(dataUrl: string, fallback: string): string {
  const m = dataUrl.match(/^data:([^;,]+);base64,/);
  return m?.[1] || fallback;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That image could not be opened. The file may be damaged or in an unsupported format.'));
    };
    img.src = url;
  });
}

function drawToDataUrl(
  img: HTMLImageElement,
  scale: number,
  outMime: string,
  quality: number
): string {
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not process the image (canvas unavailable).');
  if (outMime === 'image/jpeg') {
    // JPEG has no alpha channel — flatten transparency onto white.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL(outMime, quality);
}

export interface PrepareOptions {
  /**
   * Override the storage target (bytes). Defaults to STORAGE_TARGET_BYTES.
   * The deployment's hard budget always wins if it is smaller.
   */
  maxBytes?: number;
}

/**
 * Read an image and compress it to the smallest practical size for storage.
 *
 * The admin panel previews the original photo for approval; when the user
 * approves, this produces the minimum-size stored copy: downscaled to web
 * dimensions, quality-tuned toward `maxBytes` (≈400 KB by default), and —
 * if the ORIGINAL happens to already be smaller than any re-encode — the
 * original is kept instead, so the result is never larger than necessary.
 */
export async function prepareImageUpload(file: File, opts?: PrepareOptions): Promise<PreparedImage> {
  if (!file || !file.type) {
    throw new Error(
      'That file type can’t be uploaded. Please choose a JPEG, PNG, WebP or GIF image — iPhone HEIC photos must be converted to JPEG first.'
    );
  }
  if (!ALLOWED.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP and GIF images are allowed.');
  }
  if (file.size > RAW_FILE_LIMIT) {
    throw new Error(`Image must be ${formatBytes(RAW_FILE_LIMIT)} or smaller — this file is ${formatBytes(file.size)}.`);
  }

  const budget = uploadByteBudget();
  const target = Math.min(budget, opts?.maxBytes ?? STORAGE_TARGET_BYTES);

  // GIFs: never re-encode (animation). Pass through when within budget.
  if (file.type === 'image/gif') {
    if (file.size <= budget) {
      const raw = await fileToDataUrl(file);
      return { ...raw, optimized: false, bytes: file.size };
    }
    throw new Error(
      `This GIF is ${formatBytes(file.size)}, but this deployment accepts images up to ${formatBytes(budget)}. ` +
        'GIFs cannot be compressed without losing their animation — please export a smaller copy and try again.'
    );
  }

  // Already tiny — nothing to gain from re-encoding.
  if (file.size <= Math.min(target, SKIP_COMPRESS_BYTES)) {
    const raw = await fileToDataUrl(file);
    return { ...raw, optimized: false, bytes: file.size };
  }

  const img = await loadImage(file);
  try {
    // Prefer JPEG for photos; WebP (alpha-capable) for PNG/WebP sources.
    const outMime = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';

    const longest = Math.max(img.naturalWidth, img.naturalHeight);
    let scale = longest > STORE_MAX_LONG_EDGE ? STORE_MAX_LONG_EDGE / longest : 1;

    // Quality ladder, then dimension ladder, until we hit the target.
    let best = drawToDataUrl(img, scale, outMime, 0.82);
    let bestBytes = dataUrlBytes(best);
    let quality = 0.82;
    let guard = 0;
    while (bestBytes > target && guard++ < 24) {
      if (quality > 0.52) {
        quality = Math.max(0.5, +(quality - 0.08).toFixed(2));
      } else {
        const nextLongest = longest * scale * 0.85;
        if (nextLongest < STORE_MIN_LONG_EDGE) break; // smaller would wreck the photo
        scale *= 0.85;
        quality = 0.72; // reset quality for the smaller canvas
      }
      const candidate = drawToDataUrl(img, scale, outMime, quality);
      const candidateBytes = dataUrlBytes(candidate);
      if (candidateBytes < bestBytes) {
        best = candidate;
        bestBytes = candidateBytes;
      }
    }

    // Deployment budget is a hard wall even if the storage target wasn't met.
    if (bestBytes > budget) {
      throw new Error(
        `Even after compression this image is larger than the ${formatBytes(budget)} upload limit of this deployment. ` +
          'Please choose a smaller photo.'
      );
    }

    // Minimum-size rule: if the ORIGINAL file is still smaller than our best
    // re-encode (can happen with tiny/already-optimized images), store it.
    if (file.size <= bestBytes && file.size <= budget) {
      const raw = await fileToDataUrl(file);
      return { ...raw, optimized: false, bytes: file.size };
    }

    // The browser may ignore our requested format (e.g. no WebP encoder) —
    // trust what it actually produced.
    return { data: best, mime: mimeOfDataUrl(best, outMime), name: file.name, optimized: true, bytes: bestBytes };
  } finally {
    URL.revokeObjectURL(img.src);
  }
}
