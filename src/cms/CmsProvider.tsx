import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CmsBlog, CmsPayload, CmsPhoto, CmsProject, CompanySettings, EstimatorSettings } from './types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/companyData';
import { COMPANY_INFO as DEFAULT_COMPANY } from '../data/companyData';

function defaultCompany(): CompanySettings {
  return {
    name: DEFAULT_COMPANY.name,
    legalName: DEFAULT_COMPANY.legalName,
    turnover: DEFAULT_COMPANY.totalTurnover,
    turnoverShort: DEFAULT_COMPANY.stats[0]?.value || '₹14.65 Cr+',
    turnoverDetail: DEFAULT_COMPANY.stats[0]?.detail || 'Civil & Solar Works',
    turnoverTag: DEFAULT_COMPANY.stats[0]?.tag || 'FY 2024-25',
    stats: DEFAULT_COMPANY.stats.map(s => ({
      label: s.label,
      value: s.value,
      detail: s.change ? '' : s.label,
      // mapping: original stats had change field, we map to detail/tag
      ...('detail' in s ? {} : {}),
    })) as any || [],
  };
}

function defaultEstimator(): EstimatorSettings {
  return {
    civic: { standard: 1650, premium: 1950, high_spec: 2300, unit: 'sq.ft built-up', material: 'RCC M25 concrete, Fe 550D TMT, brick masonry, ramp railings, UPVC fixtures' },
    healthcare: { standard: 2200, premium: 2750, high_spec: 3400, unit: 'sq.ft ward area', material: 'Antimicrobial vinyl flooring, medical gas lines, acoustic ceiling, ICU electrical' },
    commercial: { standard: 2000, premium: 2500, high_spec: 3100, unit: 'sq.ft commercial space', material: 'Structural glazing, high-speed lift provisions, firefighting systems, vitrified tiles' },
    solar: { standard: 18000, premium: 23500, high_spec: 29000, unit: 'autonomous solar poles / kW', material: 'Mono PERC solar panels, LiFePO4 batteries, hot-dip GI octagonal poles, IoT sensors' },
    materials: { standard: 62000, premium: 62000, high_spec: 62000, unit: 'metric tonnes certified supply', material: 'Primary mill test certificates, weighbridge tickets, direct dispatch' },
  };
}

interface CmsContextValue {
  photos: CmsPhoto[];
  blogs: CmsBlog[];
  slots: Record<string, string>;
  projects: CmsProject[];
  company: CompanySettings;
  estimator: EstimatorSettings;
  loading: boolean;
  photoById: (id?: string | null) => CmsPhoto | undefined;
  slotPhoto: (slot: string) => CmsPhoto | undefined;
  resolveSlotUrl: (slot: string, fallback: string) => string;
  galleryPhotos: CmsPhoto[];
  publishedBlogs: CmsBlog[];
  allProjectsMerged: any[]; // merged default + custom
  refresh: () => Promise<void>;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CmsPayload>({
    photos: [],
    blogs: [],
    slots: {},
    projects: [],
    company: defaultCompany(),
    estimator: defaultEstimator(),
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/public/cms', { credentials: 'include' });
      if (!res.ok) return;
      const json = (await res.json()) as Partial<CmsPayload>;
      setData({
        photos: json.photos || [],
        blogs: json.blogs || [],
        slots: json.slots || {},
        projects: (json as any).projects || [],
        company: (json as any).company || defaultCompany(),
        estimator: (json as any).estimator || defaultEstimator(),
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
    // Merge projects: custom projects override or extend default
    const custom = data.projects || [];
    const merged = [
      ...DEFAULT_PROJECTS.map((def) => {
        const override = custom.find((c) => c.id === def.id);
        if (override) {
          return {
            ...def,
            title: override.title || def.title,
            category: (override.category as any) || def.category,
            categoryLabel: override.categoryLabel || def.categoryLabel,
            client: override.client || def.client,
            location: override.location || def.location,
            state: override.state || def.state,
            year: override.year || def.year,
            status: (override.status as any) || def.status,
            scope: override.scope || def.scope,
            description: override.description || def.description,
            highlights: override.highlights?.length ? override.highlights : def.highlights,
            metrics: override.metrics?.length ? override.metrics : def.metrics,
            image: override.image || def.image,
          };
        }
        return def;
      }),
      // add new custom projects that don't match default ids
      ...custom.filter((c) => !DEFAULT_PROJECTS.some((d) => d.id === c.id)).map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category as any,
        categoryLabel: c.categoryLabel,
        client: c.client,
        location: c.location,
        state: c.state,
        year: c.year,
        status: c.status as any,
        scope: c.scope,
        description: c.description,
        highlights: c.highlights,
        image: c.image || '',
        metrics: c.metrics,
      })),
    ];

    return {
      photos: data.photos,
      blogs: data.blogs,
      slots: data.slots,
      projects: data.projects,
      company: data.company,
      estimator: data.estimator,
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
      allProjectsMerged: merged,
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
      projects: [],
      company: defaultCompany(),
      estimator: defaultEstimator(),
      loading: false,
      photoById: () => undefined,
      slotPhoto: () => undefined,
      resolveSlotUrl: (_slot: string, fallback: string) => fallback,
      galleryPhotos: [],
      publishedBlogs: [],
      allProjectsMerged: DEFAULT_PROJECTS,
      refresh: async () => undefined,
    } as CmsContextValue;
  }
  return ctx;
}
