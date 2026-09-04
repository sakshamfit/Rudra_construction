import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CmsBlog, CmsPayload, CmsPhoto } from './types';

interface CmsContextValue {
  photos: CmsPhoto[];
  blogs: CmsBlog[];
  slots: Record<string, string>;
  loading: boolean;
  photoById: (id?: string | null) => CmsPhoto | undefined;
  slotPhoto: (slot: string) => CmsPhoto | undefined;
  resolveSlotUrl: (slot: string, fallback: string) => string;
  galleryPhotos: CmsPhoto[];
  publishedBlogs: CmsBlog[];
  refresh: () => Promise<void>;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CmsPayload>({ photos: [], blogs: [], slots: {} });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/public/cms', { credentials: 'include' });
      if (!res.ok) return;
      const json = (await res.json()) as CmsPayload;
      setData({
        photos: json.photos || [],
        blogs: json.blogs || [],
        slots: json.slots || {},
      });
    } catch {
      /* public site still works on bundled images */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo<CmsContextValue>(() => {
    const photoById = (id?: string | null) => data.photos.find((p) => p.id === id && p.visible);
    const slotPhoto = (slot: string) => photoById(data.slots[slot]);
    return {
      photos: data.photos,
      blogs: data.blogs,
      slots: data.slots,
      loading,
      photoById,
      slotPhoto,
      resolveSlotUrl: (slot, fallback) => {
        const p = slotPhoto(slot);
        if (!p?.url) return fallback;
        const bust = p.updatedAt ? `?v=${encodeURIComponent(p.updatedAt)}` : '';
        return `${p.url}${bust}`;
      },
      galleryPhotos: data.photos.filter((p) => p.visible && p.showInGallery),
      publishedBlogs: [...data.blogs].filter((b) => b.published).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
      refresh,
    };
  }, [data, loading, refresh]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    return {
      photos: [],
      blogs: [],
      slots: {},
      loading: false,
      photoById: () => undefined,
      slotPhoto: () => undefined,
      resolveSlotUrl: (_slot: string, fallback: string) => fallback,
      galleryPhotos: [],
      publishedBlogs: [],
      refresh: async () => undefined,
    } as CmsContextValue;
  }
  return ctx;
}
