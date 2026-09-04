import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Camera,
  FileText,
  LayoutGrid,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Upload,
  Save,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Building2,
  Calculator,
  Briefcase,
  IndianRupee,
  Settings2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import type { CmsBlog, CmsPayload, CmsPhoto, CmsProject, CompanySettings, EstimatorSettings } from '../cms/types';
import { fileToDataUrl } from '../cms/fileToDataUrl';
import { mergeLocalOverlay, toLocalPayload, writeLocalState } from '../cms/localState';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/companyData';
import heroImg from '../assets/images/rudra_hero_construction_1788465374495.jpg';

const SECTIONS = [
  { id: 'gallery', label: 'Gallery' },
  { id: 'hero', label: 'Hero' },
  { id: 'civic', label: 'Civic' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'solar', label: 'Solar' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'materials', label: 'Materials' },
  { id: 'unassigned', label: 'Unassigned' },
];

async function api<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = {};
  }
  if (!res.ok) throw new Error((json as { error?: string }).error || `Request failed (${res.status})`);
  return json as T;
}

function cacheUrl(photo?: CmsPhoto | null) {
  if (!photo?.url) return '';
  return `${photo.url}${photo.updatedAt ? `?v=${encodeURIComponent(photo.updatedAt)}` : ''}`;
}

export function AdminApp() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [bootError, setBootError] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'placements' | 'photos' | 'projects' | 'blogs' | 'company' | 'estimator' | 'settings'>('placements');
  const [storeInfo, setStoreInfo] = useState<{ mode?: string; host?: string }>({});
  const [cms, setCms] = useState<CmsPayload>({
    photos: [],
    blogs: [],
    slots: {},
    projects: [],
    company: {
      name: 'Rudra Constructions & Suppliers',
      legalName: 'Rudra Constructions & Suppliers Pvt. Ltd.',
      turnover: '₹14.65 Crore',
      turnoverShort: '₹14.65 Cr+',
      turnoverDetail: 'Civil & Solar Works',
      turnoverTag: 'FY 2024-25',
      stats: [],
    },
    estimator: {
      civic: { standard: 1650, premium: 1950, high_spec: 2300, unit: 'sq.ft built-up', material: '' },
      healthcare: { standard: 2200, premium: 2750, high_spec: 3400, unit: 'sq.ft ward area', material: '' },
      commercial: { standard: 2000, premium: 2500, high_spec: 3100, unit: 'sq.ft commercial space', material: '' },
      solar: { standard: 18000, premium: 23500, high_spec: 29000, unit: 'autonomous solar poles / kW', material: '' },
      materials: { standard: 62000, premium: 62000, high_spec: 62000, unit: 'metric tonnes certified supply', material: '' },
    },
  });

  const load = useCallback(async () => {
    try {
      const data = await api<CmsPayload>('/api/admin/cms');
      // Merge with the browser mirror: on stateless hosts (Vercel serverless
      // without a Blob) a cold-started API would serve seed data and your
      // edits would look like they vanished after a refresh. Newer wins.
      const { payload: merged } = mergeLocalOverlay(data);
      setCms({
        photos: merged.photos || [],
        blogs: merged.blogs || [],
        slots: merged.slots || {},
        projects: (merged as any).projects || [],
        company: (merged as any).company || cms.company,
        estimator: (merged as any).estimator || cms.estimator,
      });
      // Mirror committed state so it survives serverless cold starts.
      writeLocalState(toLocalPayload(merged));
      if (merged.storage || merged.host) setStoreInfo({ mode: merged.storage, host: merged.host });
      setBootError('');
      return true;
    } catch (e) {
      console.error(e);
      setBootError(e instanceof Error ? e.message : 'Could not load admin data.');
      return false;
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const me = await api<{ authenticated: boolean }>('/api/auth/me');
        setAuthed(!!me.authenticated);
        if (me.authenticated) await load();
      } catch {
        // Auth probe failed (e.g. backend unreachable) — show the login screen;
        // the sign-in attempt will surface the real error.
        setAuthed(false);
      } finally {
        setReady(true);
      }
    })();
  }, [load]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ password }) });
      setPassword('');
      setAuthed(true);
      const ok = await load();
      if (!ok) setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  };

  const onLogout = async () => {
    await api('/api/auth/logout', { method: 'POST', body: '{}' });
    setAuthed(false);
    setCms({ photos: [], blogs: [], slots: {}, projects: [], company: cms.company, estimator: cms.estimator } as any);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center text-[#78716c] text-sm">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#292524]" />
          <span>Loading admin console…</span>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
        <form
          onSubmit={onLogin}
          className="w-full max-w-md bg-white border border-[#e7e5e4] rounded-[24px] p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#292524] text-white grid place-items-center font-serif text-base font-bold shadow-sm">
              RC
            </div>
            <div>
              <div className="text-lg font-medium text-[#0c0a09] tracking-tight">Admin Console</div>
              <div className="text-xs text-[#78716c]">Rudra Constructions & Suppliers</div>
            </div>
          </div>

          <p className="text-sm text-[#57534e] leading-relaxed">
            Enter your administrator credentials to manage website photos, projects, blogs, and turnover metrics.
          </p>

          <div className="space-y-1.5">
            <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#78716c]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-11 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] focus:outline-none focus:border-[#292524] focus:bg-white transition-all"
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#292524] p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-[12px] bg-[#fef2f2] border border-[#fecaca] text-sm text-[#dc2626] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy || !password.trim()}
            className="apple-btn-active w-full py-3 rounded-full bg-[#292524] hover:bg-[#0c0a09] text-white text-[14px] font-medium disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {busy ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Signing in…</span>
              </>
            ) : (
              <span>Enter Console</span>
            )}
          </button>

          <a
            href="/"
            className="block text-center text-xs text-[#78716c] hover:text-[#0c0a09] transition-colors pt-1"
          >
            ← Return to public website
          </a>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: 'placements' as const, label: 'Change Website Photos', icon: ImageIcon },
    { id: 'photos' as const, label: 'Photo Library', icon: Camera },
    { id: 'projects' as const, label: 'Projects', icon: Briefcase },
    { id: 'blogs' as const, label: 'Blogs & Journal', icon: FileText },
    { id: 'company' as const, label: 'Turnover & Metrics', icon: IndianRupee },
    { id: 'estimator' as const, label: 'Estimation Rates', icon: Calculator },
    { id: 'settings' as const, label: 'Settings', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#0c0a09]">
      <header className="sticky top-0 z-40 bg-[#f5f5f5]/95 backdrop-blur-md border-b border-[#e7e5e4]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#292524] text-white grid place-items-center font-serif text-sm font-bold">
              RC
            </div>
            <div>
              <div className="text-[15px] font-medium tracking-tight">Rudra Admin Console</div>
              <div className="text-[11px] text-[#78716c] hidden sm:block">
                Direct photo upload, projects, blogs & turnover management
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] px-3.5 py-1.5 rounded-full bg-white border border-[#e7e5e4] hover:border-[#292524] transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Website</span>
            </a>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-[13px] px-3.5 py-1.5 rounded-full text-[#57534e] hover:text-[#0c0a09] hover:bg-[#eae9e7] transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <nav className="lg:sticky lg:top-24 h-fit bg-white border border-[#e7e5e4] rounded-[18px] p-2 space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-[14px] text-left transition-all ${
                  on ? 'bg-[#292524] text-white font-medium shadow-sm' : 'text-[#57534e] hover:bg-[#fafafa]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
          <StorageStatusCard info={storeInfo} />
          <div className="mt-3 p-3 rounded-[12px] bg-[#fafafa] border border-[#e7e5e4] text-[11px] text-[#78716c] leading-relaxed">
            <span className="font-semibold text-[#292524]">Live Indian SEO</span>
            <br />
            Timezone: Asia/Kolkata
            <br />
            Geo: Bihar, Pan-India
            <br />
            Language: en-IN, hi-IN
          </div>
        </nav>

        <main>
          {bootError && (
            <div className="mb-6 p-4 rounded-[16px] bg-[#fef2f2] border border-[#fecaca] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-[#b91c1c]">Couldn't load live site data</div>
                <p className="text-xs text-[#7f1d1d] mt-1">
                  The admin API returned an error: {bootError}. Photo uploads and edits won't save until this is
                  resolved. If this persists, the backend API may be unavailable on this environment.
                </p>
                <button
                  onClick={load}
                  className="apple-btn-active mt-2 inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full bg-[#292524] text-white font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            </div>
          )}
          {tab === 'placements' && <PlacementsPanel cms={cms} onChange={load} />}
          {tab === 'photos' && <PhotosPanel cms={cms} onChange={load} />}
          {tab === 'projects' && <ProjectsPanel cms={cms} onChange={load} />}
          {tab === 'blogs' && <BlogsPanel cms={cms} onChange={load} />}
          {tab === 'company' && <CompanyPanel cms={cms} onChange={load} />}
          {tab === 'estimator' && <EstimatorPanel cms={cms} onChange={load} />}
          {tab === 'settings' && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}

/* =========================================================================
   1. PLACEMENTS PANEL — Change Website Photos (Desktop & Live Site)
   ========================================================================= */
function PlacementsPanel({ cms, onChange }: { cms: CmsPayload; onChange: () => Promise<void> }) {
  const [slots, setSlots] = useState(cms.slots);
  const [busySlot, setBusySlot] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setSlots(cms.slots), [cms.slots]);

  const uploadForSlot = async (slotKey: string, file: File) => {
    setBusySlot(slotKey);
    setMessage('');
    setError('');
    try {
      const { data, mime, name } = await fileToDataUrl(file);
      const cleanTitle = name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || `${slotKey} replacement photo`;

      // 1. Upload photo to library
      const created = await api<{ photo: CmsPhoto }>('/api/admin/photos', {
        method: 'POST',
        body: JSON.stringify({
          data,
          mime,
          title: cleanTitle,
          alt: cleanTitle,
          section: slotKey.startsWith('project-') ? 'projects' : 'hero',
          showInGallery: true,
          visible: true,
        }),
      });

      // 2. Assign to slot
      const nextSlots = { ...slots, [slotKey]: created.photo.id };
      setSlots(nextSlots);
      await api('/api/admin/slots', { method: 'PUT', body: JSON.stringify({ slots: nextSlots }) });
      await onChange();
      setMessage(`Photo updated directly from desktop for ${slotKey}! Live on website.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Photo upload failed.');
    } finally {
      setBusySlot(null);
    }
  };

  const selectPhotoForSlot = async (slotKey: string, photoId: string) => {
    const nextSlots = { ...slots, [slotKey]: photoId };
    setSlots(nextSlots);
    setBusySlot(slotKey);
    setMessage('');
    try {
      await api('/api/admin/slots', { method: 'PUT', body: JSON.stringify({ slots: nextSlots }) });
      await onChange();
      setMessage(`Slot updated!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setBusySlot(null);
    }
  };

  const resetSlot = async (slotKey: string) => {
    const nextSlots = { ...slots, [slotKey]: '' };
    setSlots(nextSlots);
    setBusySlot(slotKey);
    try {
      await api('/api/admin/slots', { method: 'PUT', body: JSON.stringify({ slots: nextSlots }) });
      await onChange();
      setMessage(`Reset to default photo.`);
    } finally {
      setBusySlot(null);
    }
  };

  const rows = [
    {
      slot: 'hero',
      label: 'Homepage Top Hero Banner',
      section: 'Homepage Hero',
      description: 'The main full-width desktop banner seen when visiting the homepage.',
      defaultImg: heroImg,
    },
    ...DEFAULT_PROJECTS.map((p) => ({
      slot: `project-${p.id}`,
      label: `${p.title} (${p.categoryLabel})`,
      section: 'Landmark Portfolio',
      description: `${p.location}, ${p.state} — ${p.client}`,
      defaultImg: p.image,
    })),
    ...(cms.projects || [])
      .filter((p) => !DEFAULT_PROJECTS.some((d) => d.id === p.id))
      .map((p) => ({
        slot: `project-${p.id}`,
        label: `${p.title} (Custom Project)`,
        section: 'Custom Projects',
        description: `${p.location || 'India'}, ${p.state || ''} — ${p.client || 'Client'}`,
        defaultImg: p.image || heroImg,
      })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-[#292524]" />
          <span>Change Website Photos (Desktop & Live Site)</span>
        </h1>
        <p className="text-sm text-[#57534e] mt-1">
          Owner image manager: Replace any photo on the live desktop website. Click <strong>Upload from Desktop</strong> to pick an image file directly from your computer, or choose from your uploaded photo library.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-[14px] bg-[#f0fdf4] border border-[#bbf7d0] text-sm text-[#15803d] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-[14px] bg-[#fef2f2] border border-[#fecaca] text-sm text-[#dc2626] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {rows.map((row) => {
          const selectedPhoto = cms.photos.find((p) => p.id === slots[row.slot] && !p.deleted);
          const activeSrc = selectedPhoto ? cacheUrl(selectedPhoto) : row.defaultImg;
          const isCustom = Boolean(selectedPhoto);
          const isBusy = busySlot === row.slot;

          return (
            <div
              key={row.slot}
              className="bg-white border border-[#e7e5e4] rounded-[20px] p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between transition-all hover:border-[#d6d3d1]"
            >
              {/* Photo Preview Thumbnail */}
              <div className="relative w-full md:w-56 h-36 rounded-[14px] overflow-hidden bg-[#f0efed] border border-[#e7e5e4] flex-shrink-0 group">
                <img
                  src={activeSrc}
                  alt={row.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md ${
                    isCustom
                      ? 'bg-[#16a34a]/90 text-white border border-white/20'
                      : 'bg-black/70 text-white border border-white/10'
                  }`}
                >
                  {isCustom ? 'Active Override' : 'Default Photo'}
                </span>
              </div>

              {/* Slot Details & Controls */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#78716c] bg-[#f5f5f5] px-2 py-0.5 rounded">
                    {row.section}
                  </span>
                  <span className="text-xs text-[#a8a29e] font-mono">slot: {row.slot}</span>
                </div>
                <h3 className="text-base font-medium text-[#0c0a09] truncate">{row.label}</h3>
                <p className="text-xs text-[#57534e] line-clamp-1">{row.description}</p>

                {/* Direct Upload / Select Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* Direct upload from desktop button */}
                  <label className="apple-btn-active inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#292524] text-white text-[12px] font-medium cursor-pointer shadow-sm hover:bg-[#0c0a09]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isBusy ? 'Uploading…' : 'Upload from Desktop'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={isBusy}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadForSlot(row.slot, file);
                        e.target.value = '';
                      }}
                    />
                  </label>

                  {/* Pick from library select */}
                  <select
                    value={slots[row.slot] || ''}
                    onChange={(e) => selectPhotoForSlot(row.slot, e.target.value)}
                    className="p-1.5 px-2.5 rounded-full border border-[#e7e5e4] bg-[#fafafa] text-[12px] text-[#44403c] focus:outline-none focus:border-[#292524]"
                  >
                    <option value="">— Or Choose from Library —</option>
                    {cms.photos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>

                  {/* Reset button if custom */}
                  {isCustom && (
                    <button
                      onClick={() => resetSlot(row.slot)}
                      className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1.5 rounded-full border border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2] transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset to Original</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   2. PHOTOS PANEL — Photo Library & Field Photography
   ========================================================================= */
function PhotosPanel({ cms, onChange }: { cms: CmsPayload; onChange: () => Promise<void> }) {
  const [editing, setEditing] = useState<CmsPhoto | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);

  const uploadFiles = async (files: FileList | File[]) => {
    setError('');
    setMessage('');
    setUploading(true);
    try {
      const list = Array.from(files);
      for (const file of list) {
        const { data, mime, name } = await fileToDataUrl(file);
        await api('/api/admin/photos', {
          method: 'POST',
          body: JSON.stringify({
            data,
            mime,
            title: name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
            alt: name,
            section: 'gallery',
            showInGallery: true,
            visible: true,
          }),
        });
      }
      await onChange();
      setMessage(list.length === 1 ? 'Photo added to library and website.' : `${list.length} photos added.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const replacePhotoFile = async (photoId: string, file: File) => {
    setUploading(true);
    setError('');
    setMessage('');
    try {
      const { data, mime } = await fileToDataUrl(file);
      await api(`/api/admin/photos/${photoId}/replace`, {
        method: 'POST',
        body: JSON.stringify({ data, mime }),
      });
      await onChange();
      setMessage('Photo file replaced successfully with new desktop upload!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Replace failed.');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (photo: CmsPhoto) => {
    if (!confirm(`Delete “${photo.title}” from the website? This will remove it from all sections.`)) return;
    await api(`/api/admin/photos/${photo.id}`, { method: 'DELETE' });
    if (editing?.id === photo.id) setEditing(null);
    await onChange();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight flex items-center gap-2">
          <Camera className="w-6 h-6 text-[#292524]" />
          <span>Photo Library & Field Photography</span>
        </h1>
        <p className="text-sm text-[#57534e] mt-1">
          Upload new photographs from your desktop or replace any existing photo. Photos are featured across the site gallery, hero, portfolio, and blogs.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        className={`block cursor-pointer rounded-[20px] border-2 border-dashed p-8 text-center transition-all ${
          drag ? 'border-[#292524] bg-stone-50' : 'border-[#d6d3d1] bg-white hover:border-[#292524]'
        }`}
      >
        <Upload className="w-7 h-7 mx-auto text-[#292524]" />
        <div className="mt-2 text-[15px] font-medium text-[#0c0a09]">
          Upload Photos from Desktop
        </div>
        <div className="text-xs text-[#78716c] mt-1">
          Drag & drop images here or click to choose from computer · JPEG, PNG, WebP or GIF · up to 12 MB each
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </label>

      {uploading && (
        <div className="p-3.5 rounded-[14px] bg-[#f5f5f5] text-sm text-[#57534e] flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#292524]" />
          <span>Uploading images from desktop…</span>
        </div>
      )}
      {message && (
        <div className="p-3.5 rounded-[14px] bg-[#f0fdf4] border border-[#bbf7d0] text-sm text-[#15803d] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-[14px] bg-[#fef2f2] border border-[#fecaca] text-sm text-[#dc2626] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {cms.photos.map((photo) => (
          <article
            key={photo.id}
            className="bg-white border border-[#e7e5e4] rounded-[20px] overflow-hidden shadow-xs hover:shadow-sm transition-all"
          >
            <div className="relative h-48 bg-[#f0efed] group">
              <img src={cacheUrl(photo)} alt={photo.alt} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span className="text-[10px] uppercase tracking-wider bg-black/75 text-white px-2 py-0.5 rounded-full font-mono">
                  {photo.section}
                </span>
                {!photo.visible && (
                  <span className="text-[10px] uppercase tracking-wider bg-[#dc2626] text-white px-2 py-0.5 rounded-full font-mono">
                    Hidden
                  </span>
                )}
                {photo.showInGallery && (
                  <span className="text-[10px] uppercase tracking-wider bg-[#16a34a] text-white px-2 py-0.5 rounded-full font-mono">
                    Gallery
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <div className="font-medium text-[14px] truncate text-[#0c0a09]">{photo.title}</div>
                {photo.caption ? (
                  <p className="text-xs text-[#78716c] line-clamp-1 mt-0.5">{photo.caption}</p>
                ) : (
                  <p className="text-xs text-[#a8a29e] mt-0.5">No caption</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {/* 1-click replace file from desktop */}
                <label className="apple-btn-active inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full bg-[#f5f5f4] hover:bg-[#e7e5e4] text-[#292524] cursor-pointer border border-[#e7e5e4]">
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace (Desktop)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) replacePhotoFile(photo.id, file);
                      e.target.value = '';
                    }}
                  />
                </label>

                <button
                  onClick={() => setEditing(photo)}
                  className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full border border-[#e7e5e4] hover:bg-[#fafafa]"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit Info</span>
                </button>

                <button
                  onClick={() => remove(photo)}
                  className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full border border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2]"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <PhotoModal
          photo={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            await onChange();
            setEditing(null);
          }}
          onDeleted={async () => {
            await onChange();
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function PhotoModal({
  photo,
  onClose,
  onSaved,
  onDeleted,
}: {
  photo: CmsPhoto;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onDeleted: () => Promise<void>;
}) {
  const [draft, setDraft] = useState({ ...photo });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await api(`/api/admin/photos/${photo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: draft.title,
          alt: draft.alt,
          caption: draft.caption,
          section: draft.section,
          visible: draft.visible,
          showInGallery: draft.showInGallery,
        }),
      });
      await onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  const replace = async (file: File) => {
    setBusy(true);
    setError('');
    try {
      const { data, mime } = await fileToDataUrl(file);
      await api(`/api/admin/photos/${photo.id}/replace`, {
        method: 'POST',
        body: JSON.stringify({ data, mime }),
      });
      await onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Replace failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-lg w-full max-h-[92vh] overflow-y-auto border border-[#e7e5e4]">
        <div className="relative h-56 bg-[#f0efed]">
          <img src={cacheUrl(draft)} alt={draft.alt} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-3.5">
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Title
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] font-medium normal-case tracking-normal"
            />
          </label>
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Alt text (SEO)
            <input
              value={draft.alt}
              onChange={(e) => setDraft({ ...draft, alt: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] font-medium normal-case tracking-normal"
            />
          </label>
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Caption
            <input
              value={draft.caption}
              onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] font-medium normal-case tracking-normal"
            />
          </label>
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Section
            <select
              value={draft.section}
              onChange={(e) => setDraft({ ...draft, section: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] font-medium normal-case tracking-normal"
            >
              {SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-4 text-[13px] pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.visible}
                onChange={(e) => setDraft({ ...draft, visible: e.target.checked })}
              />
              <span>Visible on website</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.showInGallery}
                onChange={(e) => setDraft({ ...draft, showInGallery: e.target.checked })}
              />
              <span>Show in photo gallery</span>
            </label>
          </div>

          {error && <p className="text-sm text-[#dc2626]">{error}</p>}

          <div className="flex flex-wrap gap-2 pt-3">
            <button
              onClick={save}
              disabled={busy}
              className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-[13px] font-medium"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Info</span>
            </button>
            <label className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#e7e5e4] text-[13px] cursor-pointer hover:border-[#292524]">
              <Upload className="w-3.5 h-3.5" />
              <span>Replace File (Desktop)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) replace(f);
                  e.target.value = '';
                }}
              />
            </label>
            <button
              onClick={async () => {
                if (!confirm(`Delete “${photo.title}”?`)) return;
                setBusy(true);
                await api(`/api/admin/photos/${photo.id}`, { method: 'DELETE' });
                await onDeleted();
              }}
              disabled={busy}
              className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#fecaca] text-[#b91c1c] text-[13px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. PROJECTS PANEL — Projects Management (Add, Edit, Desktop Photo Upload)
   ========================================================================= */
function ProjectsPanel({ cms, onChange }: { cms: CmsPayload; onChange: () => Promise<void> }) {
  const [editing, setEditing] = useState<any | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  const mergedProjects = (() => {
    const custom = cms.projects || [];
    return [
      ...DEFAULT_PROJECTS.map((def) => {
        const ov = custom.find((c) => c.id === def.id);
        return ov
          ? {
              ...def,
              ...ov,
              metrics: ov.metrics?.length ? ov.metrics : def.metrics,
              highlights: ov.highlights?.length ? ov.highlights : def.highlights,
            }
          : def;
      }),
      ...custom.filter((c) => !DEFAULT_PROJECTS.some((d) => d.id === c.id)),
    ];
  })();

  const changeProjectPhotoFromDesktop = async (project: any, file: File) => {
    setBusyId(project.id);
    setMsg('');
    try {
      const { data, mime, name } = await fileToDataUrl(file);
      const cleanTitle = `${project.title} Site Photo`;

      // 1. Upload to CMS photos
      const created = await api<{ photo: CmsPhoto }>('/api/admin/photos', {
        method: 'POST',
        body: JSON.stringify({
          data,
          mime,
          title: cleanTitle,
          alt: cleanTitle,
          section: 'projects',
          showInGallery: true,
          visible: true,
        }),
      });

      // 2. Set slot override
      const slotKey = `project-${project.id}`;
      const nextSlots = { ...cms.slots, [slotKey]: created.photo.id };
      await api('/api/admin/slots', { method: 'PUT', body: JSON.stringify({ slots: nextSlots }) });

      // 3. If custom project, also update project.image
      const isCustom = cms.projects.some((c) => c.id === project.id);
      if (isCustom) {
        await api(`/api/admin/projects/${project.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ image: created.photo.url }),
        });
      }

      await onChange();
      setMsg(`Photo updated for "${project.title}" directly from desktop!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Photo upload failed');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p: any) => {
    if (!confirm(`Delete project "${p.title}"?`)) return;
    const isCustom = cms.projects.some((c) => c.id === p.id);
    if (isCustom) {
      await api(`/api/admin/projects/${p.id}`, { method: 'DELETE' });
    } else {
      try {
        await api('/api/admin/projects', {
          method: 'POST',
          body: JSON.stringify({ id: p.id, title: p.title, category: p.category, description: 'deleted' }),
        });
        await api(`/api/admin/projects/${p.id}`, { method: 'DELETE' });
      } catch {}
    }
    await onChange();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#292524]" />
            <span>Projects Portfolio</span>
          </h1>
          <p className="text-sm text-[#57534e] mt-1">
            Add new projects, update scope/cost metrics, and change project photos directly from your desktop. All projects appear live on the website.
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-[13px] font-medium shadow-sm hover:bg-[#0c0a09]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {msg && (
        <div className="p-3.5 rounded-[14px] bg-[#f0fdf4] border border-[#bbf7d0] text-sm text-[#15803d] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mergedProjects.map((p: any) => {
          const slotPhoto = cms.photos.find((ph) => ph.id === cms.slots[`project-${p.id}`]);
          const currentImg = slotPhoto ? cacheUrl(slotPhoto) : p.image;
          const isBusy = busyId === p.id;

          return (
            <div
              key={p.id}
              className="bg-white border border-[#e7e5e4] rounded-[20px] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-sm transition-all"
            >
              <div>
                {/* Project Image Header */}
                <div className="relative h-44 bg-[#f0efed]">
                  <img src={currentImg} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-black/80 text-white px-2 py-0.5 rounded-full">
                      {p.category}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-[#16a34a] text-white px-2 py-0.5 rounded-full">
                      {p.status || 'Active'}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    {slotPhoto && (
                      <span className="text-[10px] font-mono bg-white/95 text-[#1c1917] px-2 py-0.5 rounded-full shadow">
                        Custom Desktop Photo
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="font-medium text-[16px] text-[#0c0a09]">{p.title}</div>
                  <div className="text-[11px] uppercase tracking-wider text-[#78716c] font-medium">
                    {p.location}, {p.state} · Year: {p.year} · Client: {p.client}
                  </div>
                  <p className="text-[13px] text-[#57534e] line-clamp-2 leading-relaxed">{p.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex flex-wrap items-center gap-2 border-t border-[#f5f5f4] mt-2">
                {/* 1-click change project image from desktop */}
                <label className="apple-btn-active inline-flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-full bg-[#f5f5f4] hover:bg-[#e7e5e4] text-[#292524] cursor-pointer border border-[#e7e5e4] font-medium">
                  <Upload className="w-3 h-3" />
                  <span>{isBusy ? 'Uploading…' : 'Change Photo (Desktop)'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={isBusy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) changeProjectPhotoFromDesktop(p, file);
                      e.target.value = '';
                    }}
                  />
                </label>

                <button
                  onClick={() => setEditing(p)}
                  className="inline-flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-full border border-[#e7e5e4] hover:bg-[#fafafa]"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={() => remove(p)}
                  className="inline-flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-full border border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2]"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {(editing || showNew) && (
        <ProjectEditor
          project={editing}
          photos={cms.photos}
          onClose={() => {
            setEditing(null);
            setShowNew(false);
          }}
          onSaved={async () => {
            await onChange();
            setEditing(null);
            setShowNew(false);
          }}
        />
      )}
    </div>
  );
}

function ProjectEditor({
  project,
  photos,
  onClose,
  onSaved,
}: {
  project: CmsProject | null;
  photos: CmsPhoto[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<any>({
    title: project?.title || '',
    category: project?.category || 'civic',
    categoryLabel: project?.categoryLabel || 'Civic Infrastructure',
    client: project?.client || '',
    location: project?.location || '',
    state: project?.state || 'Bihar',
    year: project?.year || String(new Date().getFullYear()),
    status: project?.status || 'Completed',
    scope: project?.scope || '',
    description: project?.description || '',
    highlights: project?.highlights?.join('\n') || '',
    image: project?.image || '',
    metrics: project?.metrics || [{ label: 'Built-up Area', value: '10,000 sq.ft' }],
  });
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [err, setErr] = useState('');

  const uploadProjectImageFromDesktop = async (file: File) => {
    setUploadingImage(true);
    setErr('');
    try {
      const { data, mime, name } = await fileToDataUrl(file);
      const cleanTitle = draft.title ? `${draft.title} Image` : name;
      const res = await api<{ photo: CmsPhoto }>('/api/admin/photos', {
        method: 'POST',
        body: JSON.stringify({
          data,
          mime,
          title: cleanTitle,
          alt: cleanTitle,
          section: 'projects',
          showInGallery: true,
          visible: true,
        }),
      });
      setDraft((d: any) => ({ ...d, image: res.photo.url }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const save = async () => {
    if (!draft.title.trim()) {
      setErr('Please provide a project title');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      const payload = {
        ...draft,
        highlights: draft.highlights.split('\n').filter(Boolean),
        metrics: draft.metrics,
      };
      if (project && project.id) {
        // If editing
        if (String(project.id).startsWith('proj_') || (project as any).createdAt) {
          await api(`/api/admin/projects/${project.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        } else {
          // If default project override
          const exists = await api<{ projects: CmsProject[] }>('/api/admin/cms')
            .then((d) => d.projects.find((p) => p.id === project.id))
            .catch(() => null);
          if (exists) {
            await api(`/api/admin/projects/${project.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
          } else {
            await api('/api/admin/projects', { method: 'POST', body: JSON.stringify({ id: project.id, ...payload }) });
          }
        }
      } else {
        // Creating new project
        await api('/api/admin/projects', { method: 'POST', body: JSON.stringify(payload) });
      }
      await onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#e7e5e4] p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e7e5e4]">
          <h2 className="text-lg font-medium text-[#0c0a09]">
            {project ? 'Edit Project Details' : 'Add New Infrastructure Project'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Photo Upload Section */}
        <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e7e5e4] space-y-3">
          <div className="text-[12px] uppercase font-semibold tracking-wider text-[#78716c]">
            Project Photograph
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:w-44 h-28 rounded-[12px] bg-[#f0efed] border border-[#e7e5e4] overflow-hidden flex-shrink-0">
              {draft.image ? (
                <img src={draft.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-xs text-[#a8a29e]">
                  <ImageIcon className="w-5 h-5 mb-1" />
                  <span>No image</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 w-full">
              {/* Desktop upload button */}
              <label className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-[13px] font-medium cursor-pointer shadow-sm hover:bg-[#0c0a09]">
                <Upload className="w-4 h-4" />
                <span>{uploadingImage ? 'Uploading image…' : 'Upload Photo from Desktop'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadProjectImageFromDesktop(f);
                    e.target.value = '';
                  }}
                />
              </label>

              {/* Choose from library */}
              <div className="text-xs text-[#78716c] pt-1">
                Or select from Photo Library:
                <select
                  value=""
                  onChange={(e) => {
                    const selected = photos.find((p) => p.id === e.target.value);
                    if (selected) setDraft({ ...draft, image: selected.url });
                  }}
                  className="mt-1 w-full p-2 rounded-[10px] border border-[#e7e5e4] bg-white text-[13px]"
                >
                  <option value="">— Select library photo —</option>
                  {photos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-[12px] uppercase tracking-wider text-[#78716c] font-medium">
            Project Title *
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
              placeholder="e.g. 50-Bed Community Hospital"
            />
          </label>

          <label className="block text-[12px] uppercase tracking-wider text-[#78716c] font-medium">
            Category
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
            >
              <option value="civic">Civic & Government</option>
              <option value="healthcare">Healthcare & Hospital</option>
              <option value="solar">Solar & Clean Energy</option>
              <option value="infrastructure">Infrastructure & Bridges</option>
              <option value="materials">Material Supply & Logistics</option>
              <option value="commercial">Commercial & Industrial</option>
              <option value="residential">Residential Enclaves</option>
            </select>
          </label>

          <label className="block text-[12px] uppercase tracking-wider text-[#78716c] font-medium">
            Category Label
            <input
              value={draft.categoryLabel}
              onChange={(e) => setDraft({ ...draft, categoryLabel: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
              placeholder="Civic Infrastructure"
            />
          </label>

          <label className="block text-[12px] uppercase tracking-wider text-[#78716c] font-medium">
            Client / Department
            <input
              value={draft.client}
              onChange={(e) => setDraft({ ...draft, client: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
              placeholder="e.g. Building Construction Dept, Bihar"
            />
          </label>

          <label className="block text-[12px] uppercase tracking-wider text-[#78716c] font-medium">
            Location
            <input
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
              placeholder="e.g. Bettiah / Ramnagar"
            />
          </label>

          <label className="block text-[12px] uppercase tracking-wider text-[#78716c] font-medium">
            State
            <input
              value={draft.state}
              onChange={(e) => setDraft({ ...draft, state: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
              placeholder="Bihar"
            />
          </label>

          <label className="block text-[12px] uppercase tracking-wider text-[#78716c] font-medium">
            Year
            <input
              value={draft.year}
              onChange={(e) => setDraft({ ...draft, year: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
              placeholder="2025"
            />
          </label>

          <label className="block text-[12px] uppercase tracking-wider text-[#78716c] font-medium">
            Status
            <select
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
            >
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Commissioned">Commissioned</option>
              <option value="Handed Over">Handed Over</option>
            </select>
          </label>
        </div>

        <label className="block text-[12px] uppercase tracking-wider text-[#78716c] font-medium">
          Scope Summary
          <input
            value={draft.scope}
            onChange={(e) => setDraft({ ...draft, scope: e.target.value })}
            className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
            placeholder="RCC structural framework, finishing, external electrification"
          />
        </label>

        <label className="block text-[12px] uppercase tracking-wider text-[#78716c] font-medium">
          Description
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={3}
            className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
            placeholder="Detailed description of the project execution and impact..."
          />
        </label>

        <label className="block text-[12px] uppercase tracking-wider text-[#78716c] font-medium">
          Highlights (one point per line)
          <textarea
            value={draft.highlights}
            onChange={(e) => setDraft({ ...draft, highlights: e.target.value })}
            rows={3}
            className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
            placeholder="IS 456:2000 compliant RCC grade M25&#10;Zero time-overrun delivery&#10;Commissioned with statutory clearances"
          />
        </label>

        <div>
          <div className="text-[12px] uppercase tracking-wider font-semibold text-[#78716c] mb-1">
            Project Metrics
          </div>
          {draft.metrics.map((m: any, i: number) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={m.label}
                onChange={(e) => {
                  const ms = [...draft.metrics];
                  ms[i].label = e.target.value;
                  setDraft({ ...draft, metrics: ms });
                }}
                placeholder="Metric label (e.g. Built-up Area)"
                className="flex-1 p-2 rounded-[8px] border border-[#e7e5e4] text-[13px]"
              />
              <input
                value={m.value}
                onChange={(e) => {
                  const ms = [...draft.metrics];
                  ms[i].value = e.target.value;
                  setDraft({ ...draft, metrics: ms });
                }}
                placeholder="Value (e.g. 15,000 sq.ft / ₹4.2 Cr)"
                className="flex-1 p-2 rounded-[8px] border border-[#e7e5e4] text-[13px]"
              />
              <button
                onClick={() =>
                  setDraft({
                    ...draft,
                    metrics: draft.metrics.filter((_: any, idx: number) => idx !== i),
                  })
                }
                className="p-2 rounded-[8px] border border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setDraft({ ...draft, metrics: [...draft.metrics, { label: '', value: '' }] })}
            className="text-[12px] px-3 py-1 rounded-full border border-[#e7e5e4] hover:bg-stone-50"
          >
            + Add Metric Row
          </button>
        </div>

        {err && <p className="text-sm text-[#dc2626]">{err}</p>}

        <div className="flex gap-2 pt-2 border-t border-[#e7e5e4]">
          <button
            onClick={save}
            disabled={busy}
            className="apple-btn-active inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#292524] text-white text-[13px] font-medium"
          >
            <Save className="w-4 h-4" />
            <span>{busy ? 'Saving…' : 'Save Project'}</span>
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#e7e5e4] text-[13px] hover:bg-stone-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. BLOGS PANEL — Write Blogs & Articles
   ========================================================================= */
function BlogsPanel({ cms, onChange }: { cms: CmsPayload; onChange: () => Promise<void> }) {
  const [selected, setSelected] = useState<string | 'new' | null>(cms.blogs[0]?.id || null);
  const current = selected === 'new' ? null : cms.blogs.find((b) => b.id === selected) || null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#292524]" />
            <span>Blogs & Field Journal</span>
          </h1>
          <p className="text-sm text-[#57534e] mt-1">
            Write and publish posts to the Journal section on the website. Cover images can be uploaded directly from your desktop.
          </p>
        </div>
        <button
          onClick={() => setSelected('new')}
          className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-[13px] font-medium shadow-sm hover:bg-[#0c0a09]"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Post</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        <div className="bg-white border border-[#e7e5e4] rounded-[20px] p-2.5 h-fit space-y-1">
          <div className="text-xs font-semibold text-[#78716c] uppercase tracking-wider px-3 py-2">
            Published & Draft Posts ({cms.blogs.length})
          </div>
          {cms.blogs.length === 0 && selected !== 'new' && (
            <p className="text-sm text-[#78716c] p-3">No posts yet. Click "+ Write New Post" to start.</p>
          )}
          {cms.blogs.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelected(b.id)}
              className={`w-full text-left px-3 py-2.5 rounded-[12px] transition-colors ${
                selected === b.id ? 'bg-[#292524] text-white' : 'hover:bg-[#fafafa] text-[#0c0a09]'
              }`}
            >
              <div className="text-[14px] font-medium truncate">{b.title}</div>
              <div className={`text-[11px] ${selected === b.id ? 'text-stone-300' : 'text-[#78716c]'}`}>
                {b.published ? '● Published' : 'Draft'} · {new Date(b.createdAt).toLocaleDateString('en-IN')}
              </div>
            </button>
          ))}
        </div>

        {(selected === 'new' || current) && (
          <BlogEditor
            blog={current}
            photos={cms.photos}
            onChange={async (id) => {
              await onChange();
              if (id) setSelected(id);
            }}
            onDeleted={async () => {
              setSelected(null);
              await onChange();
            }}
          />
        )}
      </div>
    </div>
  );
}

function BlogEditor({
  blog,
  photos,
  onChange,
  onDeleted,
}: {
  blog: CmsBlog | null;
  photos: CmsPhoto[];
  onChange: (id?: string) => Promise<void>;
  onDeleted: () => Promise<void>;
}) {
  const [draft, setDraft] = useState({
    title: blog?.title || '',
    excerpt: blog?.excerpt || '',
    body: blog?.body || '',
    coverPhotoId: blog?.coverPhotoId || '',
    published: blog?.published || false,
  });
  const [busy, setBusy] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState('');

  const uploadCoverFromDesktop = async (file: File) => {
    setUploadingCover(true);
    setError('');
    try {
      const { data, mime, name } = await fileToDataUrl(file);
      const cleanTitle = draft.title ? `${draft.title} Cover` : name;
      const res = await api<{ photo: CmsPhoto }>('/api/admin/photos', {
        method: 'POST',
        body: JSON.stringify({
          data,
          mime,
          title: cleanTitle,
          alt: cleanTitle,
          section: 'blogs',
          showInGallery: true,
          visible: true,
        }),
      });
      setDraft((d) => ({ ...d, coverPhotoId: res.photo.id }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cover upload failed');
    } finally {
      setUploadingCover(false);
    }
  };

  const save = async () => {
    if (!draft.title.trim()) {
      setError('Please provide a post title');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const payload = {
        ...draft,
        coverPhotoId: draft.coverPhotoId || null,
      };
      if (blog) {
        await api(`/api/admin/blogs/${blog.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        await onChange(blog.id);
      } else {
        const created = await api<{ blog: CmsBlog }>('/api/admin/blogs', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        await onChange(created.blog.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!blog) return;
    if (!confirm(`Delete blog post “${blog.title}”?`)) return;
    await api(`/api/admin/blogs/${blog.id}`, { method: 'DELETE' });
    await onDeleted();
  };

  const cover = photos.find((p) => p.id === draft.coverPhotoId);

  return (
    <div className="bg-white border border-[#e7e5e4] rounded-[20px] p-6 space-y-4 shadow-xs">
      <input
        value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        placeholder="Post Title (e.g. Advancing Class-A Civil Standards in Bihar)"
        className="w-full text-xl font-medium tracking-tight p-2 border-b border-[#e7e5e4] focus:outline-none focus:border-[#292524]"
      />

      <textarea
        value={draft.excerpt}
        onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
        placeholder="Short summary excerpt displayed on homepage card..."
        rows={2}
        className="w-full p-3 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
      />

      <textarea
        value={draft.body}
        onChange={(e) => setDraft({ ...draft, body: e.target.value })}
        placeholder="Write the full article body (Markdown and paragraphs supported)..."
        rows={12}
        className="w-full p-4 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] leading-relaxed font-sans"
      />

      {/* Cover Photo Upload & Selection */}
      <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e7e5e4] space-y-3">
        <div className="text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
          Article Cover Photograph
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-44 h-28 rounded-[12px] bg-[#f0efed] border border-[#e7e5e4] overflow-hidden flex-shrink-0">
            {cover ? (
              <img src={cacheUrl(cover)} alt={cover.alt} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-xs text-[#a8a29e]">
                <ImageIcon className="w-5 h-5 mb-1" />
                <span>No cover photo</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 w-full">
            <label className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-[13px] font-medium cursor-pointer shadow-sm hover:bg-[#0c0a09]">
              <Upload className="w-4 h-4" />
              <span>{uploadingCover ? 'Uploading cover…' : 'Upload Cover from Desktop'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={uploadingCover}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadCoverFromDesktop(f);
                  e.target.value = '';
                }}
              />
            </label>

            <div className="text-xs text-[#78716c] pt-1">
              Or pick from Photo Library:
              <select
                value={draft.coverPhotoId}
                onChange={(e) => setDraft({ ...draft, coverPhotoId: e.target.value })}
                className="mt-1 w-full p-2 rounded-[10px] border border-[#e7e5e4] bg-white text-[13px]"
              >
                <option value="">— None —</option>
                {photos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <label className="inline-flex items-center gap-2 text-[14px] cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={draft.published}
          onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
          className="w-4 h-4 accent-[#292524]"
        />
        <span className="font-medium text-[#0c0a09]">Publish on website journal section</span>
      </label>

      {error && <p className="text-sm text-[#dc2626]">{error}</p>}

      <div className="flex gap-2 pt-2 border-t border-[#e7e5e4]">
        <button
          onClick={save}
          disabled={busy}
          className="apple-btn-active inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#292524] text-white text-[13px] font-medium shadow-sm hover:bg-[#0c0a09]"
        >
          <Save className="w-4 h-4" />
          <span>{blog ? 'Save Post Changes' : 'Publish New Post'}</span>
        </button>
        {blog && (
          <button
            onClick={remove}
            className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#fecaca] text-[#b91c1c] text-[13px] hover:bg-[#fef2f2]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Post</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   STORAGE STATUS — where edits are kept & why they (or don't) survive refresh
   ========================================================================= */
function StorageStatusCard({ info }: { info: { mode?: string; host?: string } }) {
  if (!info.mode) {
    return (
      <div className="mt-3 p-3 rounded-[12px] bg-[#fafafa] border border-[#e7e5e4] text-[11px] text-[#78716c] leading-relaxed">
        <span className="font-semibold text-[#292524]">Saving</span>
        <br />
        Checking storage backend…
      </div>
    );
  }
  if (info.mode === 'blob') {
    return (
      <div className="mt-3 p-3 rounded-[12px] bg-[#f0fdf4] border border-[#bbf7d0] text-[11px] text-[#166534] leading-relaxed">
        <span className="font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Cloud storage: ON
        </span>
        <br />
        Turnover, stats, photos, blogs & projects are saved to Vercel Blob —
        they stay for <span className="font-semibold">every visitor</span>, across
        refreshes, logouts and redeploys.
      </div>
    );
  }
  if (info.host === 'vercel') {
    return (
      <div className="mt-3 p-3 rounded-[12px] bg-[#fffbeb] border border-[#fde68a] text-[11px] text-[#92400e] leading-relaxed">
        <span className="font-semibold flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          Temporary serverless storage
        </span>
        <br />
        Vercel wipes the API&apos;s memory on every cold start, so server-side
        data is only kept for a few minutes. Your edits are also mirrored in
        <span className="font-semibold"> this browser</span>, so they stay here
        after refresh. To keep them for <span className="font-semibold">all visitors
        permanently</span>: Vercel dashboard → project → <span className="font-semibold">Storage</span> →
        &ldquo;Add new&rdquo; → <span className="font-semibold">Vercel Blob</span> (one click, free 1&nbsp;GB).
        Vercel injects <span className="font-mono text-[10px]">BLOB_READ_WRITE_TOKEN</span> automatically —
        then redeploy.
      </div>
    );
  }
  return (
    <div className="mt-3 p-3 rounded-[12px] bg-[#f0fdf4] border border-[#bbf7d0] text-[11px] text-[#166534] leading-relaxed">
      <span className="font-semibold flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5" />
        File storage: ON
      </span>
      <br />
      Changes are saved to <span className="font-mono text-[10px]">data/cms.json</span> on this
      server — persistent across restarts.
    </div>
  );
}

/* =========================================================================
   5. COMPANY PANEL — Turnover & Trust Metrics
   ========================================================================= */
function CompanyPanel({ cms, onChange }: { cms: CmsPayload; onChange: () => Promise<void> }) {
  const [company, setCompany] = useState<CompanySettings>(cms.company);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => setCompany(cms.company), [cms.company]);

  const save = async () => {
    setBusy(true);
    setMsg('');
    setErr('');
    try {
      const res = await api<{ save?: { persisted?: boolean; storage?: string } }>('/api/admin/company', {
        method: 'PUT',
        body: JSON.stringify({ company }),
      });
      await onChange();
      if (res?.save?.persisted === false) {
        setErr('Cloud storage write failed — your update is kept in this browser but NOT for other visitors. Fix Vercel Blob (see storage card in the sidebar) and save again.');
        setMsg('Turnover updated in this browser — see warning.');
      } else {
        setMsg('Company & turnover updated live. Changes reflect immediately on the main panel and stay after refresh.');
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const updateStat = (idx: number, field: string, value: string) => {
    const stats = [...company.stats];
    (stats[idx] as any)[field] = value;
    setCompany({ ...company, stats });
  };

  const addStat = () => {
    setCompany({ ...company, stats: [...company.stats, { label: 'New Metric', value: '0', detail: '', tag: '' }] });
  };

  const removeStat = (idx: number) => {
    setCompany({ ...company, stats: company.stats.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight flex items-center gap-2">
          <IndianRupee className="w-6 h-6 text-[#292524]" />
          <span>Turnover & Company Metrics</span>
        </h1>
        <p className="text-sm text-[#57534e] mt-1">
          Update certified turnover figures (e.g. ₹14.65 Crore, ₹20 Crore, etc.) and TrustMetrics strip items.
          Saved values appear instantly on the main panel (hero, trust strip, company section, footer) and
          stay there after refresh — see the storage card in the sidebar.
        </p>
      </div>

      <div className="bg-white border border-[#e7e5e4] rounded-[20px] p-6 space-y-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Total Turnover (e.g., ₹14.65 Crore)
            <input
              value={company.turnover}
              onChange={(e) => setCompany({ ...company, turnover: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
            />
          </label>
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Short Turnover (Card Badge)
            <input
              value={company.turnoverShort}
              onChange={(e) => setCompany({ ...company, turnoverShort: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
              placeholder="₹14.65 Cr+"
            />
          </label>
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Turnover Detail
            <input
              value={company.turnoverDetail}
              onChange={(e) => setCompany({ ...company, turnoverDetail: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
            />
          </label>
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Financial Year Tag
            <input
              value={company.turnoverTag}
              onChange={(e) => setCompany({ ...company, turnoverTag: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
            />
          </label>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#78716c]">
              TrustMetrics Strip Cards
            </h3>
            <button
              onClick={addStat}
              className="text-[12px] px-3 py-1 rounded-full border border-[#e7e5e4] hover:bg-stone-50"
            >
              + Add Metric
            </button>
          </div>
          <div className="space-y-3">
            {company.stats.map((s, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 rounded-[12px] bg-[#fafafa] border border-[#e7e5e4]"
              >
                <input
                  value={s.label}
                  onChange={(e) => updateStat(idx, 'label', e.target.value)}
                  placeholder="Label"
                  className="p-2 rounded-[8px] border border-[#e7e5e4] text-[13px] bg-white"
                />
                <input
                  value={s.value}
                  onChange={(e) => updateStat(idx, 'value', e.target.value)}
                  placeholder="Value (e.g. 11 States)"
                  className="p-2 rounded-[8px] border border-[#e7e5e4] text-[13px] bg-white"
                />
                <input
                  value={s.detail}
                  onChange={(e) => updateStat(idx, 'detail', e.target.value)}
                  placeholder="Detail text"
                  className="p-2 rounded-[8px] border border-[#e7e5e4] text-[13px] bg-white"
                />
                <div className="flex gap-2">
                  <input
                    value={s.tag}
                    onChange={(e) => updateStat(idx, 'tag', e.target.value)}
                    placeholder="Tag"
                    className="flex-1 p-2 rounded-[8px] border border-[#e7e5e4] text-[13px] bg-white"
                  />
                  <button
                    onClick={() => removeStat(idx)}
                    className="p-2 rounded-[8px] border border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {msg && <p className="text-sm text-[#16a34a]">{msg}</p>}
        {err && <p className="text-sm text-[#dc2626]">{err}</p>}

        <button
          onClick={save}
          disabled={busy}
          className="apple-btn-active inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#292524] text-white text-[13px] font-medium shadow-sm hover:bg-[#0c0a09]"
        >
          <Save className="w-4 h-4" />
          <span>{busy ? 'Saving…' : 'Save Turnover & Metrics'}</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   6. ESTIMATOR PANEL — Estimation Rates
   ========================================================================= */
function EstimatorPanel({ cms, onChange }: { cms: CmsPayload; onChange: () => Promise<void> }) {
  const [estimator, setEstimator] = useState<EstimatorSettings>(cms.estimator);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => setEstimator(cms.estimator), [cms.estimator]);

  const save = async () => {
    setBusy(true);
    setMsg('');
    setErr('');
    try {
      await api('/api/admin/estimator', { method: 'PUT', body: JSON.stringify({ estimator }) });
      await onChange();
      setMsg('Estimation rates updated live. Homepage cost estimator uses new rates now.');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const verticals: (keyof EstimatorSettings)[] = ['civic', 'healthcare', 'commercial', 'solar', 'materials'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight flex items-center gap-2">
          <Calculator className="w-6 h-6 text-[#292524]" />
          <span>Project Estimation Rates (CPWD DSR)</span>
        </h1>
        <p className="text-sm text-[#57534e] mt-1">
          Edit CPWD DSR benchmark rates per vertical. Changes reflect instantly in the interactive homepage cost estimator.
        </p>
      </div>

      <div className="space-y-4">
        {verticals.map((v) => (
          <div key={v} className="bg-white border border-[#e7e5e4] rounded-[20px] p-5 space-y-3 shadow-xs">
            <div className="font-medium capitalize text-base text-[#0c0a09]">
              {v} — {estimator[v].unit}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] font-medium">
                Standard ₹
                <input
                  type="number"
                  value={estimator[v].standard}
                  onChange={(e) =>
                    setEstimator({
                      ...estimator,
                      [v]: { ...estimator[v], standard: Number(e.target.value) },
                    })
                  }
                  className="mt-1 w-full p-2.5 rounded-[10px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
                />
              </label>
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] font-medium">
                Premium ₹
                <input
                  type="number"
                  value={estimator[v].premium}
                  onChange={(e) =>
                    setEstimator({
                      ...estimator,
                      [v]: { ...estimator[v], premium: Number(e.target.value) },
                    })
                  }
                  className="mt-1 w-full p-2.5 rounded-[10px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
                />
              </label>
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c] font-medium">
                High-Spec ₹
                <input
                  type="number"
                  value={estimator[v].high_spec}
                  onChange={(e) =>
                    setEstimator({
                      ...estimator,
                      [v]: { ...estimator[v], high_spec: Number(e.target.value) },
                    })
                  }
                  className="mt-1 w-full p-2.5 rounded-[10px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
                />
              </label>
            </div>
            <label className="block text-[11px] uppercase tracking-wider text-[#78716c] font-medium">
              Unit label
              <input
                value={estimator[v].unit}
                onChange={(e) =>
                  setEstimator({
                    ...estimator,
                    [v]: { ...estimator[v], unit: e.target.value },
                  })
                }
                className="mt-1 w-full p-2.5 rounded-[10px] border border-[#e7e5e4] bg-[#fafafa] text-[13px]"
              />
            </label>
            <label className="block text-[11px] uppercase tracking-wider text-[#78716c] font-medium">
              Material conformance specification
              <input
                value={estimator[v].material}
                onChange={(e) =>
                  setEstimator({
                    ...estimator,
                    [v]: { ...estimator[v], material: e.target.value },
                  })
                }
                className="mt-1 w-full p-2.5 rounded-[10px] border border-[#e7e5e4] bg-[#fafafa] text-[13px]"
              />
            </label>
          </div>
        ))}
      </div>

      {msg && <p className="text-sm text-[#16a34a]">{msg}</p>}
      {err && <p className="text-sm text-[#dc2626]">{err}</p>}

      <button
        onClick={save}
        disabled={busy}
        className="apple-btn-active inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#292524] text-white text-[13px] font-medium shadow-sm hover:bg-[#0c0a09]"
      >
        <Save className="w-4 h-4" />
        <span>{busy ? 'Saving…' : 'Save Estimation Rates'}</span>
      </button>
    </div>
  );
}

/* =========================================================================
   7. SETTINGS PANEL — Security & Password
   ========================================================================= */
function SettingsPanel() {
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await api('/api/auth/password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrent('');
      setNew('');
      setMessage('Password successfully updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-md bg-white border border-[#e7e5e4] rounded-[20px] p-6 space-y-4 shadow-xs">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-[#292524]" />
        <h1 className="text-2xl font-medium tracking-tight text-[#0c0a09]">Console Security</h1>
      </div>
      <p className="text-sm text-[#57534e]">
        Change the password used to sign in to this admin console.
      </p>

      <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
        Current password
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] font-medium normal-case tracking-normal"
        />
      </label>

      <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
        New password (min 8 characters)
        <input
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNew(e.target.value)}
          className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] font-medium normal-case tracking-normal"
        />
      </label>

      {error && <p className="text-sm text-[#dc2626]">{error}</p>}
      {message && <p className="text-sm text-[#16a34a]">{message}</p>}

      <button
        type="submit"
        disabled={busy}
        className="apple-btn-active px-5 py-2.5 rounded-full bg-[#292524] text-white text-[13px] font-medium shadow-sm hover:bg-[#0c0a09]"
      >
        {busy ? 'Updating…' : 'Update Password'}
      </button>

      <div className="pt-4 border-t border-[#e7e5e4] text-[11px] text-[#78716c] leading-relaxed">
        Indian SEO Deployment: Content-Language en-IN, hi-IN · Geo IN-BR · Timezone Asia/Kolkata
      </div>
    </form>
  );
}
