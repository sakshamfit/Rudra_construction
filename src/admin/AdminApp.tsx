import React, { useCallback, useEffect, useState } from 'react';
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
} from 'lucide-react';
import type { CmsBlog, CmsPayload, CmsPhoto, CmsProject, CompanySettings, EstimatorSettings } from '../cms/types';
import { fileToDataUrl } from '../cms/fileToDataUrl';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/companyData';

const SECTIONS = [
  { id: 'gallery', label: 'Gallery' },
  { id: 'hero', label: 'Hero' },
  { id: 'civic', label: 'Civic' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'solar', label: 'Solar' },
  { id: 'infrastructure', label: 'Infrastructure' },
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
  try { json = text ? JSON.parse(text) : {}; } catch { json = {}; }
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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'company' | 'projects' | 'estimator' | 'photos' | 'blogs' | 'placements' | 'settings'>('company');
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
      setCms({
        photos: data.photos || [],
        blogs: data.blogs || [],
        slots: data.slots || {},
        projects: (data as any).projects || [],
        company: (data as any).company || cms.company,
        estimator: (data as any).estimator || cms.estimator,
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const me = await api<{ authenticated: boolean }>('/api/auth/me');
        setAuthed(!!me.authenticated);
        if (me.authenticated) await load();
      } catch {
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
      await load();
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
        Loading console…
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
            <div className="w-10 h-10 rounded-full bg-[#292524] text-white grid place-items-center font-serif">RC</div>
            <div>
              <div className="text-lg font-medium text-[#0c0a09] tracking-tight">Site admin</div>
              <div className="text-xs text-[#78716c]">Rudra Constructions — India</div>
            </div>
          </div>
          <p className="text-sm text-[#57534e] leading-relaxed">
            Indian SEO admin. Manage turnover, project estimation rates, projects, photos, blogs.
          </p>
          <label className="block space-y-1.5">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[#78716c]">Password</span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] focus:outline-none focus:border-[#292524]"
              placeholder="Admin password"
            />
          </label>
          {error && <p className="text-sm text-[#dc2626]">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="apple-btn-active w-full py-3 rounded-full bg-[#292524] text-white text-[14px] font-medium disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Enter console'}
          </button>
          <div className="text-[11px] text-[#78716c] bg-[#fafafa] border border-[#e7e5e4] rounded-[12px] p-3">
            Default: <b>RudraAdmin@2025</b> — change in Settings after login. Admin at <b>/admin</b> works now — fixed SPA fallback.
          </div>
          <a href="/" className="block text-center text-xs text-[#78716c] hover:text-[#0c0a09]">
            Back to website
          </a>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: 'company' as const, label: 'Turnover & Company', icon: IndianRupee },
    { id: 'projects' as const, label: 'Projects', icon: Briefcase },
    { id: 'estimator' as const, label: 'Estimation Rates', icon: Calculator },
    { id: 'photos' as const, label: 'Photos', icon: Camera },
    { id: 'blogs' as const, label: 'Blogs', icon: FileText },
    { id: 'placements' as const, label: 'Site placements', icon: LayoutGrid },
    { id: 'settings' as const, label: 'Settings', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#0c0a09]">
      <header className="sticky top-0 z-40 bg-[#f5f5f5]/95 backdrop-blur-md border-b border-[#e7e5e4]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#292524] text-white grid place-items-center font-serif text-sm">RC</div>
            <div>
              <div className="text-[15px] font-medium tracking-tight">Admin console — Indian SEO</div>
              <div className="text-[11px] text-[#78716c] hidden sm:block">Turnover, estimation, projects, photos, blogs</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-full bg-white border border-[#e7e5e4]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View site
            </a>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-full text-[#57534e] hover:text-[#0c0a09]"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <nav className="lg:sticky lg:top-24 h-fit bg-white border border-[#e7e5e4] rounded-[18px] p-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-[14px] text-left ${
                  on ? 'bg-[#292524] text-white' : 'text-[#57534e] hover:bg-[#fafafa]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
          <div className="mt-3 p-3 rounded-[12px] bg-[#fafafa] border border-[#e7e5e4] text-[11px] text-[#78716c]">
            <b>Indian SEO active</b><br/>Timezone Asia/Kolkata<br/>Region IN, Language en-IN + hi-IN<br/>Edit turnover anytime.
          </div>
        </nav>

        <section>
          {tab === 'company' && <CompanyPanel cms={cms} onChange={load} />}
          {tab === 'projects' && <ProjectsPanel cms={cms} onChange={load} />}
          {tab === 'estimator' && <EstimatorPanel cms={cms} onChange={load} />}
          {tab === 'photos' && <PhotosPanel cms={cms} onChange={load} />}
          {tab === 'blogs' && <BlogsPanel cms={cms} onChange={load} />}
          {tab === 'placements' && <PlacementsPanel cms={cms} onChange={load} />}
          {tab === 'settings' && <SettingsPanel />}
        </section>
      </div>
    </div>
  );
}

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
      await api('/api/admin/company', { method: 'PUT', body: JSON.stringify({ company }) });
      await onChange();
      setMsg('Company & turnover updated live. Refresh homepage to see ₹ turnover change.');
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
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-medium tracking-tight flex items-center gap-2"><IndianRupee className="w-6 h-6"/> Turnover & Company Metrics</h1>
        <p className="text-sm text-[#57534e] mt-1">Change turnover (e.g., 14 Crores, 20 Crores, etc.) anytime. Updates TrustMetrics strip and SEO.</p>
      </div>

      <div className="bg-white border border-[#e7e5e4] rounded-[18px] p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Total Turnover (e.g., ₹14.65 Crore)
            <input value={company.turnover} onChange={e => setCompany({ ...company, turnover: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
          </label>
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Short Turnover (TrustMetrics value)
            <input value={company.turnoverShort} onChange={e => setCompany({ ...company, turnoverShort: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" placeholder="₹14.65 Cr+" />
          </label>
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Turnover Detail
            <input value={company.turnoverDetail} onChange={e => setCompany({ ...company, turnoverDetail: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
          </label>
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Turnover Tag (FY)
            <input value={company.turnoverTag} onChange={e => setCompany({ ...company, turnoverTag: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
          </label>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#78716c]">TrustMetrics Strip (6 cards)</h3>
            <button onClick={addStat} className="text-[12px] px-3 py-1 rounded-full border border-[#e7e5e4]">+ Add</button>
          </div>
          <div className="mt-3 space-y-3">
            {company.stats.map((s, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 rounded-[12px] bg-[#fafafa] border border-[#e7e5e4]">
                <input value={s.label} onChange={e => updateStat(idx, 'label', e.target.value)} placeholder="Label" className="p-2 rounded-[8px] border border-[#e7e5e4] text-[13px]" />
                <input value={s.value} onChange={e => updateStat(idx, 'value', e.target.value)} placeholder="Value ₹14.65 Cr+" className="p-2 rounded-[8px] border border-[#e7e5e4] text-[13px]" />
                <input value={s.detail} onChange={e => updateStat(idx, 'detail', e.target.value)} placeholder="Detail" className="p-2 rounded-[8px] border border-[#e7e5e4] text-[13px]" />
                <div className="flex gap-2">
                  <input value={s.tag} onChange={e => updateStat(idx, 'tag', e.target.value)} placeholder="Tag" className="flex-1 p-2 rounded-[8px] border border-[#e7e5e4] text-[13px]" />
                  <button onClick={() => removeStat(idx)} className="p-2 rounded-[8px] border border-[#fecaca] text-[#b91c1c]"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={save} disabled={busy} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#292524] text-white text-[13px]">
            <Save className="w-4 h-4"/> {busy ? 'Saving...' : 'Save Turnover & Metrics'}
          </button>
          {msg && <span className="text-sm text-[#16a34a]">{msg}</span>}
          {err && <span className="text-sm text-[#dc2626]">{err}</span>}
        </div>
      </div>
    </div>
  );
}

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
      setMsg('Estimation rates updated live. Estimator component uses new rates now.');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const verticals: (keyof EstimatorSettings)[] = ['civic', 'healthcare', 'commercial', 'solar', 'materials'];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-medium tracking-tight flex items-center gap-2"><Calculator className="w-6 h-6"/> Project Estimation Rates</h1>
        <p className="text-sm text-[#57534e] mt-1">Edit CPWD DSR rates per vertical. Changes reflect instantly in homepage estimator.</p>
      </div>

      <div className="space-y-4">
        {verticals.map((v) => (
          <div key={v} className="bg-white border border-[#e7e5e4] rounded-[18px] p-5 space-y-3">
            <div className="font-medium capitalize">{v} — {estimator[v].unit}</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c]">Standard ₹
                <input type="number" value={estimator[v].standard} onChange={e => setEstimator({ ...estimator, [v]: { ...estimator[v], standard: Number(e.target.value) } })} className="mt-1 w-full p-2 rounded-[10px] border border-[#e7e5e4] bg-[#fafafa]" />
              </label>
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c]">Premium ₹
                <input type="number" value={estimator[v].premium} onChange={e => setEstimator({ ...estimator, [v]: { ...estimator[v], premium: Number(e.target.value) } })} className="mt-1 w-full p-2 rounded-[10px] border border-[#e7e5e4] bg-[#fafafa]" />
              </label>
              <label className="block text-[11px] uppercase tracking-wider text-[#78716c]">High-Spec ₹
                <input type="number" value={estimator[v].high_spec} onChange={e => setEstimator({ ...estimator, [v]: { ...estimator[v], high_spec: Number(e.target.value) } })} className="mt-1 w-full p-2 rounded-[10px] border border-[#e7e5e4] bg-[#fafafa]" />
              </label>
            </div>
            <label className="block text-[11px] uppercase tracking-wider text-[#78716c]">Unit label
              <input value={estimator[v].unit} onChange={e => setEstimator({ ...estimator, [v]: { ...estimator[v], unit: e.target.value } })} className="mt-1 w-full p-2 rounded-[10px] border border-[#e7e5e4] bg-[#fafafa] text-[13px]" />
            </label>
            <label className="block text-[11px] uppercase tracking-wider text-[#78716c]">Material conformance text
              <input value={estimator[v].material} onChange={e => setEstimator({ ...estimator, [v]: { ...estimator[v], material: e.target.value } })} className="mt-1 w-full p-2 rounded-[10px] border border-[#e7e5e4] bg-[#fafafa] text-[13px]" />
            </label>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={save} disabled={busy} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#292524] text-white text-[13px]">
          <Save className="w-4 h-4"/> {busy ? 'Saving...' : 'Save Estimation Rates'}
        </button>
        {msg && <span className="text-sm text-[#16a34a]">{msg}</span>}
        {err && <span className="text-sm text-[#dc2626]">{err}</span>}
      </div>
    </div>
  );
}

function ProjectsPanel({ cms, onChange }: { cms: CmsPayload; onChange: () => Promise<void> }) {
  const [editing, setEditing] = useState<CmsProject | null>(null);
  const [showNew, setShowNew] = useState(false);

  const mergedProjects = (() => {
    const custom = cms.projects || [];
    return [
      ...DEFAULT_PROJECTS.map(def => {
        const ov = custom.find(c => c.id === def.id);
        return ov ? { ...def, ...ov, metrics: ov.metrics?.length ? ov.metrics : def.metrics, highlights: ov.highlights?.length ? ov.highlights : def.highlights } : def;
      }),
      ...custom.filter(c => !DEFAULT_PROJECTS.some(d => d.id === c.id)),
    ];
  })();

  const remove = async (p: any) => {
    if (!confirm(`Delete project "${p.title}"?`)) return;
    // if it's default project, we create a deleted override; otherwise delete custom
    const isCustom = cms.projects.some(c => c.id === p.id);
    if (isCustom) {
      await api(`/api/admin/projects/${p.id}`, { method: 'DELETE' });
    } else {
      // create empty custom then delete? Simpler: create a custom with same id then mark deleted via API
      // We'll POST a custom project with same id then DELETE it
      try {
        await api('/api/admin/projects', { method: 'POST', body: JSON.stringify({ id: p.id, title: p.title, category: p.category, description: 'deleted' }) });
        await api(`/api/admin/projects/${p.id}`, { method: 'DELETE' });
      } catch {}
    }
    await onChange();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight flex items-center gap-2"><Briefcase className="w-6 h-6"/> Projects — Admin Editable</h1>
          <p className="text-sm text-[#57534e] mt-1">Add, edit, delete projects. Custom projects appear live in portfolio. Turnover-linked values editable.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-[13px]"><Plus className="w-4 h-4"/> New Project</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mergedProjects.map((p: any) => (
          <div key={p.id} className="bg-white border border-[#e7e5e4] rounded-[18px] p-4 space-y-2">
            <div className="font-medium text-[15px]">{p.title}</div>
            <div className="text-[11px] uppercase tracking-wider text-[#78716c]">{p.category} · {p.state} · {p.year} · {p.status}</div>
            <div className="text-[12px] text-[#57534e] line-clamp-2">{p.description}</div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setEditing(p as any)} className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full border border-[#e7e5e4]"><Pencil className="w-3 h-3"/> Edit</button>
              <button onClick={() => remove(p)} className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full border border-[#fecaca] text-[#b91c1c]"><Trash2 className="w-3 h-3"/> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {(editing || showNew) && (
        <ProjectEditor
          project={editing as any}
          onClose={() => { setEditing(null); setShowNew(false); }}
          onSaved={async () => { await onChange(); setEditing(null); setShowNew(false); }}
        />
      )}
    </div>
  );
}

function ProjectEditor({ project, onClose, onSaved }: { project: CmsProject | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const [draft, setDraft] = useState<any>({
    title: project?.title || '',
    category: project?.category || 'civic',
    categoryLabel: project?.categoryLabel || 'Civic',
    client: project?.client || '',
    location: project?.location || '',
    state: project?.state || 'Bihar',
    year: project?.year || '2025',
    status: project?.status || 'Completed',
    scope: project?.scope || '',
    description: project?.description || '',
    highlights: project?.highlights?.join('\n') || '',
    image: project?.image || '',
    metrics: project?.metrics || [{ label: 'Built-up Area', value: '5,000 sq.ft' }],
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const save = async () => {
    setBusy(true);
    setErr('');
    try {
      const payload = {
        ...draft,
        highlights: draft.highlights.split('\n').filter(Boolean),
        metrics: draft.metrics,
      };
      if (project && project.id && !DEFAULT_PROJECTS.some(d => d.id === project.id && !draft.title.includes('proj_'))) {
        // if editing existing custom or override
        if ((project as any).id && (project as any).id.startsWith('proj') && (project as any).createdAt) {
          await api(`/api/admin/projects/${project.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        } else {
          // create override for default project
          const exists = await api<{ projects: CmsProject[] }>('/api/admin/cms').then(d => d.projects.find(p => p.id === project.id)).catch(() => null);
          if (exists) {
            await api(`/api/admin/projects/${project.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
          } else {
            await api('/api/admin/projects', { method: 'POST', body: JSON.stringify({ id: project.id, ...payload }) });
          }
        }
      } else {
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
      <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#e7e5e4] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-black/10"><X className="w-4 h-4"/></button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">Title
            <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
          </label>
          <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">Category
            <select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]">
              <option value="civic">civic</option>
              <option value="healthcare">healthcare</option>
              <option value="solar">solar</option>
              <option value="infrastructure">infrastructure</option>
              <option value="materials">materials</option>
              <option value="commercial">commercial</option>
            </select>
          </label>
          <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">Category Label
            <input value={draft.categoryLabel} onChange={e => setDraft({ ...draft, categoryLabel: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
          </label>
          <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">Client
            <input value={draft.client} onChange={e => setDraft({ ...draft, client: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
          </label>
          <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">Location
            <input value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
          </label>
          <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">State
            <input value={draft.state} onChange={e => setDraft({ ...draft, state: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
          </label>
          <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">Year
            <input value={draft.year} onChange={e => setDraft({ ...draft, year: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
          </label>
          <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">Status
            <input value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
          </label>
        </div>

        <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">Scope
          <input value={draft.scope} onChange={e => setDraft({ ...draft, scope: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
        </label>
        <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">Description
          <textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} rows={3} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
        </label>
        <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">Highlights (one per line)
          <textarea value={draft.highlights} onChange={e => setDraft({ ...draft, highlights: e.target.value })} rows={4} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
        </label>
        <label className="block text-[12px] uppercase tracking-wider text-[#78716c]">Image URL (or /assets/...)
          <input value={draft.image} onChange={e => setDraft({ ...draft, image: e.target.value })} className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]" />
        </label>

        <div>
          <div className="text-[12px] uppercase tracking-wider font-semibold text-[#78716c] mb-1">Metrics</div>
          {draft.metrics.map((m: any, i: number) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={m.label} onChange={e => { const ms = [...draft.metrics]; ms[i].label = e.target.value; setDraft({ ...draft, metrics: ms }); }} placeholder="Label" className="flex-1 p-2 rounded-[8px] border border-[#e7e5e4] text-[13px]" />
              <input value={m.value} onChange={e => { const ms = [...draft.metrics]; ms[i].value = e.target.value; setDraft({ ...draft, metrics: ms }); }} placeholder="Value" className="flex-1 p-2 rounded-[8px] border border-[#e7e5e4] text-[13px]" />
              <button onClick={() => setDraft({ ...draft, metrics: draft.metrics.filter((_: any, idx: number) => idx !== i) })} className="p-2 rounded-[8px] border border-[#fecaca] text-[#b91c1c]"><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
          <button onClick={() => setDraft({ ...draft, metrics: [...draft.metrics, { label: '', value: '' }] })} className="text-[12px] px-3 py-1 rounded-full border border-[#e7e5e4]">+ Add metric</button>
        </div>

        {err && <p className="text-sm text-[#dc2626]">{err}</p>}

        <div className="flex gap-2">
          <button onClick={save} disabled={busy} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-[13px]"><Save className="w-3.5 h-3.5"/> {busy ? 'Saving...' : 'Save'}</button>
          <button onClick={onClose} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#e7e5e4] text-[13px]">Cancel</button>
        </div>
      </div>
    </div>
  );
}

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
      setMessage(list.length === 1 ? 'Photo added to the website.' : `${list.length} photos added to the website.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (photo: CmsPhoto) => {
    if (!confirm(`Delete “${photo.title}” from the website? This cannot be undone.`)) return;
    await api(`/api/admin/photos/${photo.id}`, { method: 'DELETE' });
    if (editing?.id === photo.id) setEditing(null);
    await onChange();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Photographs</h1>
        <p className="text-sm text-[#57534e] mt-1">
          Upload, edit or delete any photo that appears on the site. Deleted images are removed from the hero, gallery, portfolio and blogs.
        </p>
      </div>

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
        className={`block cursor-pointer rounded-[20px] border-2 border-dashed p-8 text-center transition-colors ${
          drag ? 'border-[#292524] bg-white' : 'border-[#d6d3d1] bg-white'
        }`}
      >
        <Upload className="w-6 h-6 mx-auto text-[#292524]" />
        <div className="mt-2 text-[15px] font-medium">Drop images here or click to upload</div>
        <div className="text-xs text-[#78716c] mt-1">JPEG, PNG, WebP or GIF · up to 12 MB each · multiple files allowed</div>
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

      {uploading && <p className="text-sm text-[#57534e]">Uploading…</p>}
      {message && <p className="text-sm text-[#16a34a]">{message}</p>}
      {error && <p className="text-sm text-[#dc2626]">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cms.photos.map((photo) => (
          <article key={photo.id} className="bg-white border border-[#e7e5e4] rounded-[18px] overflow-hidden">
            <div className="relative h-44 bg-[#f0efed]">
              <img src={cacheUrl(photo)} alt={photo.alt} className="w-full h-full object-cover" />
              {!photo.visible && (
                <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-black/70 text-white px-2 py-1 rounded-full">
                  Hidden
                </span>
              )}
            </div>
            <div className="p-3.5 space-y-2">
              <div className="font-medium text-[14px] truncate">{photo.title}</div>
              <div className="text-[11px] text-[#78716c] uppercase tracking-wider">{photo.section}</div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => setEditing(photo)}
                  className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full border border-[#e7e5e4] hover:bg-[#fafafa]"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => remove(photo)}
                  className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full border border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2]"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <PhotoEditor
          photo={cms.photos.find((p) => p.id === editing.id) || editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            await onChange();
          }}
          onDeleted={async () => {
            setEditing(null);
            await onChange();
          }}
        />
      )}
    </div>
  );
}

function PhotoEditor({
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
  const [draft, setDraft] = useState(photo);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setDraft(photo), [photo]);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Replace failed.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Delete “${photo.title}” from the website?`)) return;
    setBusy(true);
    try {
      await api(`/api/admin/photos/${photo.id}`, { method: 'DELETE' });
      await onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-lg w-full max-h-[92vh] overflow-y-auto border border-[#e7e5e4]">
        <div className="relative h-52 bg-[#f0efed]">
          <img src={cacheUrl(draft)} alt={draft.alt} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Title
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] font-medium normal-case tracking-normal"
            />
          </label>
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
            Alt text
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
          <div className="flex gap-4 text-[13px]">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.visible}
                onChange={(e) => setDraft({ ...draft, visible: e.target.checked })}
              />
              Visible on website
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.showInGallery}
                onChange={(e) => setDraft({ ...draft, showInGallery: e.target.checked })}
              />
              Show in gallery
            </label>
          </div>
          {error && <p className="text-sm text-[#dc2626]">{error}</p>}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={save}
              disabled={busy}
              className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-[13px]"
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <label className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#e7e5e4] text-[13px] cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" /> Replace file
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
              onClick={remove}
              disabled={busy}
              className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#fecaca] text-[#b91c1c] text-[13px]"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogsPanel({ cms, onChange }: { cms: CmsPayload; onChange: () => Promise<void> }) {
  const [selected, setSelected] = useState<string | 'new' | null>(cms.blogs[0]?.id || null);
  const current = selected === 'new' ? null : cms.blogs.find((b) => b.id === selected) || null;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Blogs</h1>
          <p className="text-sm text-[#57534e] mt-1">Write posts that publish to the Journal section on the website.</p>
        </div>
        <button
          onClick={() => setSelected('new')}
          className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-[13px]"
        >
          <Plus className="w-4 h-4" /> New post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <div className="bg-white border border-[#e7e5e4] rounded-[18px] p-2 h-fit">
          {cms.blogs.length === 0 && selected !== 'new' && (
            <p className="text-sm text-[#78716c] p-3">No posts yet.</p>
          )}
          {cms.blogs.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelected(b.id)}
              className={`w-full text-left px-3 py-2.5 rounded-[12px] ${
                selected === b.id ? 'bg-[#f5f5f5]' : 'hover:bg-[#fafafa]'
              }`}
            >
              <div className="text-[14px] font-medium truncate">{b.title}</div>
              <div className="text-[11px] text-[#78716c]">{b.published ? 'Published' : 'Draft'}</div>
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
  const [error, setError] = useState('');

  const save = async () => {
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
    if (!confirm(`Delete blog “${blog.title}”?`)) return;
    await api(`/api/admin/blogs/${blog.id}`, { method: 'DELETE' });
    await onDeleted();
  };

  const cover = photos.find((p) => p.id === draft.coverPhotoId);

  return (
    <div className="bg-white border border-[#e7e5e4] rounded-[18px] p-5 space-y-3">
      <input
        value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        placeholder="Post title"
        className="w-full text-xl font-medium tracking-tight p-2 border-b border-[#e7e5e4] focus:outline-none"
      />
      <textarea
        value={draft.excerpt}
        onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
        placeholder="Short excerpt shown on the homepage"
        rows={2}
        className="w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px]"
      />
      <textarea
        value={draft.body}
        onChange={(e) => setDraft({ ...draft, body: e.target.value })}
        placeholder="Write the full article…"
        rows={12}
        className="w-full p-3 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] leading-relaxed"
      />
      <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
        Cover photo
        <select
          value={draft.coverPhotoId}
          onChange={(e) => setDraft({ ...draft, coverPhotoId: e.target.value })}
          className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] font-medium normal-case tracking-normal"
        >
          <option value="">None</option>
          {photos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </label>
      {cover && <img src={cacheUrl(cover)} alt={cover.alt} className="w-full h-36 object-cover rounded-[12px]" />}
      <label className="inline-flex items-center gap-2 text-[13px]">
        <input
          type="checkbox"
          checked={draft.published}
          onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
        />
        Published on website
      </label>
      {error && <p className="text-sm text-[#dc2626]">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={busy}
          className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-[13px]"
        >
          <Save className="w-3.5 h-3.5" /> {blog ? 'Save post' : 'Create post'}
        </button>
        {blog && (
          <button
            onClick={remove}
            className="apple-btn-active inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#fecaca] text-[#b91c1c] text-[13px]"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

function PlacementsPanel({ cms, onChange }: { cms: CmsPayload; onChange: () => Promise<void> }) {
  const [slots, setSlots] = useState(cms.slots);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => setSlots(cms.slots), [cms.slots]);

  const save = async () => {
    setBusy(true);
    setMessage('');
    try {
      await api('/api/admin/slots', { method: 'PUT', body: JSON.stringify({ slots }) });
      await onChange();
      setMessage('Placements updated on the live website.');
    } finally {
      setBusy(false);
    }
  };

  const rows = [
    { slot: 'hero', label: 'Homepage hero' },
    ...DEFAULT_PROJECTS.map((p) => ({ slot: `project-${p.id}`, label: p.title })),
    ...(cms.projects || []).filter(p => !DEFAULT_PROJECTS.some(d => d.id === p.id)).map(p => ({ slot: `project-${p.id}`, label: p.title + ' (custom)' })),
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Site placements</h1>
        <p className="text-sm text-[#57534e] mt-1">
          Choose which library photo appears in the hero and each portfolio card. Leave empty to hide that slot’s CMS override.
        </p>
      </div>
      <div className="space-y-3">
        {rows.map((row) => {
          const selected = cms.photos.find((p) => p.id === slots[row.slot]);
          return (
            <div key={row.slot} className="bg-white border border-[#e7e5e4] rounded-[16px] p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="w-full sm:w-40 h-24 rounded-[12px] overflow-hidden bg-[#f0efed] flex-shrink-0">
                {selected ? (
                  <img src={cacheUrl(selected)} alt={selected.alt} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-xs text-[#78716c]">No photo</div>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="text-[14px] font-medium">{row.label}</div>
                <select
                  value={slots[row.slot] || ''}
                  onChange={(e) => setSlots({ ...slots, [row.slot]: e.target.value })}
                  className="w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[13px]"
                >
                  <option value="">— None —</option>
                  {cms.photos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={save}
        disabled={busy}
        className="apple-btn-active inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#292524] text-white text-[13px]"
      >
        <Check className="w-4 h-4" /> Save placements
      </button>
      {message && <p className="text-sm text-[#16a34a]">{message}</p>}
    </div>
  );
}

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
      setMessage('Password updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-md bg-white border border-[#e7e5e4] rounded-[18px] p-6 space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-[#292524]" />
        <h1 className="text-2xl font-medium tracking-tight">Settings</h1>
      </div>
      <p className="text-sm text-[#57534e]">Change the password used to open this console. Indian SEO settings are server-side.</p>
      <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
        Current password
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] font-medium normal-case tracking-normal"
        />
      </label>
      <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#78716c]">
        New password
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNew(e.target.value)}
          minLength={8}
          className="mt-1 w-full p-2.5 rounded-[12px] border border-[#e7e5e4] bg-[#fafafa] text-[14px] font-medium normal-case tracking-normal"
        />
      </label>
      {error && <p className="text-sm text-[#dc2626]">{error}</p>}
      {message && <p className="text-sm text-[#16a34a]">{message}</p>}
      <button
        type="submit"
        disabled={busy}
        className="apple-btn-active px-5 py-2.5 rounded-full bg-[#292524] text-white text-[13px]"
      >
        Update password
      </button>
      <div className="pt-4 border-t border-[#e7e5e4] text-[11px] text-[#78716c]">
        Indian SEO: Content-Language en-IN, hi-IN · Geo IN-BR · Timezone Asia/Kolkata · Region asia-south1 (India)
      </div>
    </form>
  );
}
