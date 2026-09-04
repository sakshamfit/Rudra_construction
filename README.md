# Rudra Constructions & Suppliers — Website + Admin CMS

Official website with an admin console at **/admin** (password: the value of
`ADMIN_PASSWORD`, default `RudraAdmin@2025`).

From the admin panel you can change the **annual turnover**, trust-metric
cards, photos, projects, blogs and estimation rates. Saved values render
everywhere on the main site: hero, trust-metrics strip, company section,
footer, brochure and SEO meta.

## How edits are saved (and how to make them never vanish on Vercel)

### The problem (why turnover used to "not update" / vanish)

1. **Main panel showed a hardcoded number.** The hero and brochure read the
   turnover from `src/data/companyData.ts`, not from the CMS, so admin saves
   never appeared there. *Fixed* — every component now reads the live CMS
   value (with the bundled value as fallback).

2. **Vercel serverless functions have no persistent disk.** The CMS "database"
   is a JSON document. On Vercel the API function can only write to its
   temporary `/tmp`, which is **wiped on every cold start and every
   redeploy** — so saved edits reverted to the shipped seed after a refresh.

### The fix — three layers

| Layer | What it does |
| --- | --- |
| **Vercel Blob** (server) | When a Vercel Blob is connected, the whole CMS document (turnover, stats, photos, blogs, projects, sessions) is stored in the blob: durable, shared by all visitors, survives redeploys. |
| **Browser mirror** (client) | Every committed state is also mirrored to `localStorage` on the admin device. Both the site and the admin panel keep the *newer* of server state vs mirror, so even on a stateless cold start your edits stick on your device — and sync live across open tabs. |
| **Node server** (Docker/VPS) | Without Vercel, everything persists to `data/cms.json` + `public/uploads/` as before. |

### One-time Vercel setup (≈2 minutes, makes edits permanent for everyone)

1. Open your Vercel project → **Storage** tab.
2. **Add new database** → **Vercel Blob** → any name (e.g. `rudra-cms`) → create.
   (Free tier: 1 GB / month — far more than this site needs.)
3. Done. Vercel automatically injects `BLOB_READ_WRITE_TOKEN` into the
   project's environment variables — no code or `vercel.json` changes needed.
4. Redeploy (or push an empty commit).

**Verify:** open `/admin` → the top banner turns green and says
*"Cloud storage: ON — edits are permanent"*. Edit the turnover → save → open
the homepage in a **private/incognito window** (or on your phone) → the new
turnover is there. That proves it is stored in the blob, not just in your
browser.

### Troubleshooting ("data still gone on a new device")

Open `/admin` and read the banner:

| Banner | Meaning | Fix |
| --- | --- | --- |
| 🟡 "NOT saved to the cloud yet" | The deployment has no `BLOB_READ_WRITE_TOKEN` | Create the Blob **from inside the website project** (project → Storage tab), or copy the token to project → Settings → Environment Variables (Production + Preview). Vercel redeploys automatically. |
| 🟡 + "Test connection now" → ❌ token not set | Same as above | Same as above. |
| 🟡 + test → ❌ "fetch failed" | Token is set but the Blob is unreachable | Check the token is complete (starts with `vercel_blob_rw_`), and that the Blob belongs to this project. |
| 🟢 "Cloud storage: ON" + test ✅ | Durable for everyone | Done — edits now survive refreshes, cold starts and redeploys on every device. |

Note: if `/admin` shows **no storage banner at all**, the domain is serving an
older deployment — promote/redeploy the latest one from the Vercel dashboard.

### Local development

```bash
npm install
npm run dev        # http://localhost:3000  (API + site)
npm run build      # production build (what Vercel builds)
npm start          # production Node server on :3000
```

The admin console is at `http://localhost:3000/admin`. On a local/Node host
the data file `data/cms.json` is the source of truth — no extra setup.

## Where turnover is rendered

- `src/components/Hero.tsx` — main hero line
- `src/components/TrustMetrics.tsx` — first stat card ("Audited Turnover")
- `src/components/CompanyOverview.tsx` — company section
- `src/components/Footer.tsx` — footer
- `src/components/BrochureModal.tsx` — corporate brochure
- `src/components/SeoRuntime.tsx` — `<title>` / meta description

All read `company.turnover` from the CMS (`useCms()`), which is the value you
edit in **/admin → Turnover & Metrics**.

## Notes

- Vercel KV was retired by Vercel (Dec 2024); this project uses **Vercel Blob**
  instead, via its plain REST API (no SDK dependency).
- On Vercel, photo uploads through the API are capped at 4 MB (platform
  body limit for serverless functions). On the Node server the cap is 12 MB.
- Uploads are served from `/uploads/...`: locally from `public/uploads/`,
  on Vercel from the blob (with a local `/tmp` cache).
