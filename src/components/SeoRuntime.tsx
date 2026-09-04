import { useEffect } from 'react';
import { COMPANY_INFO, SERVICES, PROJECTS, OFFICE_LOCATIONS, FAQS } from '../data/companyData';
import { absUrl, getSiteOrigin } from '../seo/site';
import { useCms } from '../cms/CmsProvider';

function upsertJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function SeoRuntime() {
  const { company } = useCms();

  useEffect(() => {
    const origin = getSiteOrigin();
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `${origin}/`);

    document.querySelectorAll('meta[property="og:url"], meta[property="og:image"], meta[name="twitter:image"]').forEach((m) => {
      const val = m.getAttribute('content') || '';
      if (val.includes('__SITE_ORIGIN__') || val.includes('ais-dev-') || val.startsWith('/')) {
        const path = val.replace(/^https?:\/\/[^/]+/, '').replace('__SITE_ORIGIN__', '') || '/';
        const abs = path.startsWith('http') ? path : `${origin}${path.startsWith('/') ? path : `/${path}`}`;
        m.setAttribute('content', abs);
      }
    });

    document.documentElement.lang = 'en-IN';

    // Update turnover in meta if needed
    const turnover = company?.turnover || COMPANY_INFO.totalTurnover;

    upsertJsonLd('jsonld-runtime', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${origin}/#webpage`,
          url: `${origin}/`,
          name: `${COMPANY_INFO.name} | Class-A Civil Contractor Bihar | Turnover ${turnover}`,
          description: `${COMPANY_INFO.subSlogan} Turnover ${turnover} — editable via admin.`,
          inLanguage: ['en-IN', 'hi-IN'],
          isPartOf: { '@id': `${origin}/#website` },
          about: { '@id': `${origin}/#organization` },
          speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2'] },
          hasPart: SERVICES.map((s) => ({
            '@type': 'SiteNavigationElement',
            name: s.title,
            url: `${origin}/services/${s.id}/`,
          })),
        },
        {
          '@type': 'ItemList',
          name: 'Service verticals India',
          itemListElement: SERVICES.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.title,
            url: absUrl(`/services/${s.id}/`),
          })),
        },
        {
          '@type': 'ItemList',
          name: 'Landmark projects India',
          itemListElement: PROJECTS.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.title,
            url: absUrl(`/projects/${p.id}/`),
          })),
        },
        {
          '@type': 'ItemList',
          name: 'Operating offices India',
          itemListElement: OFFICE_LOCATIONS.map((o, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `${o.city} ${o.type}`,
            url: absUrl(`/locations/${o.id}/`),
          })),
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQS.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        },
      ],
    });
  }, [company]);

  return (
    <a href="#main-content" className="skip-to-content">
      Skip to content
    </a>
  );
}
