/**
 * Admin photo upload pipeline.
 *
 * Photos are sent to the CMS API as base64 data URLs inside a JSON body.
 * That inflates the file by ~33%, and Vercel serverless functions hard-cap
 * the ENTIRE request body at 4.5 MB — so a camera photo of ~4 MB becomes a
 * ~5.4 MB payload and Vercel rejects it with a 413 before our API code even
 * runs. That is why uploads from the admin panel were failing on the live
 * site.
 *
 * Fix: before encoding, large photos are re-encoded in the browser
 * (canvas → JPEG/WebP) and downscaled/quality-tuned until the decoded image
 * fits the byte budget of the current deployment:
 *
 *   - Vercel (serverless): 2.5 MB decoded → ~3.4 MB JSON body < 4.5 MB cap
 *   - Node / Docker / VPS: 11 MB decoded → ~14.7 MB body < server cap
 *
 * Small files pass through untouched, so quality is never touched unless the
 * deployment actually requires it. GIFs are never re-encoded (canvas would
 * drop animation) — an oversized GIF is rejected with a clear message.
 */

const MB = 1024 * 1024;

/** Hard cap on the RAW picked file; anything bigger is almost certainly a mistake. */
export const RAW_FILE_LIMIT = 25 * MB;
/** Longest-edge cap for the first compression pass. */
const MAX_LONG_EDGE = 3200;
/** Never shrink below this longest edge while looping. */
const MIN_LONG_EDGE = 1200;

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
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export interface PreparedImage {
  data: string;
  mime: string;
  name: string;
  /** True when the image was re-encoded/downscaled before upload. */
  optimized: boolean;
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

/**
 * Read + (if needed) compress an image file so it fits the current
 * deployment's upload budget. Always resolves to something the CMS API will
 * accept — or throws with a human-readable explanation.
 */
export async function prepareImageUpload(file: File): Promise<PreparedImage> {
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

  // Small enough as-is: keep the original bytes (quality + GIF animation).
  if (file.size <= budget) {
    const raw = await fileToDataUrl(file);
    return { ...raw, optimized: false };
  }

  if (file.type === 'image/gif') {
    throw new Error(
      `This GIF is ${formatBytes(file.size)}, but this deployment accepts images up to ${formatBytes(budget)}. ` +
        'GIFs cannot be auto-optimized without losing their animation — please export a smaller copy and try again.'
    );
  }

  const img = await loadImage(file);
  try {
    // Prefer JPEG for photos; WebP (with alpha support) for PNG/WebP sources.
    const outMime = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';

    const longest = Math.max(img.naturalWidth, img.naturalHeight);
    let scale = longest > MAX_LONG_EDGE ? MAX_LONG_EDGE / longest : 1;

    let best = drawToDataUrl(img, scale, outMime, 0.88);
    let quality = 0.88;
    let guard = 0;
    while (dataUrlBytes(best) > budget && guard++ < 20) {
      if (quality > 0.52) {
        quality = Math.max(0.5, quality - 0.12);
      } else {
        const nextLongest = Math.max(img.naturalWidth, img.naturalHeight) * scale * 0.82;
        if (nextLongest < MIN_LONG_EDGE) break; // can't shrink further without wrecking the photo
        scale *= 0.82;
        quality = 0.82; // give the smaller canvas a quality reset
      }
      best = drawToDataUrl(img, scale, outMime, quality);
    }

    if (dataUrlBytes(best) > budget) {
      throw new Error(
        `Even after optimization this image is larger than the ${formatBytes(budget)} upload limit of this deployment. ` +
          'Please choose a smaller photo.'
      );
    }

    // The browser may ignore our requested format (e.g. no WebP encoder) —
    // trust what it actually produced.
    const mimeMatch = best.match(/^data:([^;,]+);base64,/);
    const mime = mimeMatch?.[1] || outMime;
    return { data: best, mime, name: file.name, optimized: true };
  } finally {
    URL.revokeObjectURL(img.src);
  }
}
