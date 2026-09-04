/**
 * Browser-side mirror of the CMS state.
 *
 * Why this exists: on Vercel the API runs as stateless serverless functions.
 * Unless a Vercel Blob is connected (see README → "Persistence on Vercel"),
 * the function's /tmp filesystem is wiped on every cold start, so a freshly
 * booted instance would serve the shipped seed data and an admin's edits would
 * appear to "vanish" after a refresh.
 *
 * The admin console therefore mirrors every committed CMS state into
 * localStorage (same origin, survives refreshes and cold starts). Both the
 * public site and the admin panel merge: server state vs this mirror, keeping
 * whichever is NEWER. When the server is authoritative (persistent host or
 * Vercel Blob), its `updatedAt` wins; on a stateless cold start, the local
 * mirror wins — so edits never vanish, on any host.
 */
import type { CmsBlog, CmsPayload, CmsPhoto, CmsProject, CompanySettings, EstimatorSettings } from './types';

export interface LocalCmsPayload {
  photos: CmsPhoto[];
  blogs: CmsBlog[];
  slots: Record<string, string>;
  projects: CmsProject[];
  company: CompanySettings;
  estimator: EstimatorSettings;
}

interface LocalCmsState {
  savedAt: number;
  payload: LocalCmsPayload;
}

const KEY = 'rudra_cms_local_v1';

export function readLocalState(): LocalCmsState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocalCmsState;
    if (!parsed || typeof parsed.savedAt !== 'number' || !parsed.payload) return null;
    if (!parsed.payload.company || !parsed.payload.estimator) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Mirrors committed state so it survives stateless serverless cold starts. Returns false when storage is unavailable/full. */
export function writeLocalState(payload: LocalCmsPayload): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const state: LocalCmsState = { savedAt: Date.now(), payload };
    window.localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

function toLocalPayload(p: CmsPayload): LocalCmsPayload {
  return {
    photos: p.photos || [],
    blogs: p.blogs || [],
    slots: p.slots || {},
    projects: p.projects || [],
    company: p.company,
    estimator: p.estimator,
  };
}

/**
 * Merges the freshly fetched server payload with the local mirror.
 * The newer one wins (compared by server `updatedAt` vs local `savedAt`).
 */
export function mergeLocalOverlay(server: CmsPayload): { payload: CmsPayload; localApplied: boolean } {
  const local = readLocalState();
  if (!local) return { payload: server, localApplied: false };
  const serverUpdated = Date.parse(server.updatedAt || '') || 0;
  if (local.savedAt < serverUpdated) {
    return { payload: server, localApplied: false };
  }
  return {
    payload: {
      ...server,
      photos: local.payload.photos || server.photos,
      blogs: local.payload.blogs || server.blogs,
      slots: local.payload.slots || server.slots,
      projects: local.payload.projects || server.projects,
      company: local.payload.company || server.company,
      estimator: local.payload.estimator || server.estimator,
    },
    localApplied: true,
  };
}

/**
 * Cross-tab live sync: the browser fires `storage` in OTHER tabs whenever
 * localStorage changes, so an edit saved in the /admin tab instantly re-renders
 * the main site tab (and vice versa) without a manual refresh.
 */
export function onLocalStateChange(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

export { toLocalPayload };
