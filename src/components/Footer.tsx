import React from 'react';
import { Phone, Mail, MapPin, ArrowUp, FileText } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { useCms } from '../cms/CmsProvider';

interface FooterProps {
  onOpenBrochure: () => void;
  onOpenEstimator: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBrochure, onOpenEstimator }) => {
  const { company } = useCms();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const turnover = company?.turnover || COMPANY_INFO.totalTurnover;

  return (
    <footer className="bg-[#f5f5f7] text-[#7a7a7a] text-[12px] border-t border-[#e0e0e0]">
      
      <div className="bg-[#ffffff] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#e7e5e4]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-[#78716c] uppercase tracking-wider">
              Engineering & Execution — Indian SEO
            </span>
            <h3 className="text-2xl sm:text-3xl font-normal text-[#0c0a09] tracking-tight leading-snug">
              Partner with Rudra Constructions & Suppliers — Bihar India.
            </h3>
            <p className="text-sm sm:text-base text-[#57534e] max-w-2xl leading-relaxed">
              Government-approved Class-A contracting, sustainable solar energy, and certified materials across 11 states. Turnover {turnover} (editable via admin).
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenEstimator}
              className="apple-btn-active px-5 py-2.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] text-white font-medium text-sm transition-all cursor-pointer shadow-sm"
            >
              Run Project Estimator — Admin Editable Rates
            </button>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="apple-btn-active px-5 py-2.5 rounded-full bg-white hover:bg-[#f5f5f5] text-[#292524] font-medium text-sm border border-[#d6d3d1] transition-all"
            >
              Call: {COMPANY_INFO.phoneFormatted}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#1d1d1f] flex items-center justify-center text-white">
                <span className="font-serif">RC</span>
              </div>
              <div>
                <span className="font-semibold text-[15px] tracking-tight text-[#1d1d1f] block uppercase">
                  Rudra Constructions & Suppliers
                </span>
                <span className="text-[11px] text-[#7a7a7a] tracking-normal block">
                  Engineering Trust. Constructing Excellence. Bihar India.
                </span>
              </div>
            </div>

            <p className="text-[#7a7a7a] leading-relaxed text-[13px]">
              Founded in 2025, delivering high-quality civil, commercial, healthcare, and renewable energy solutions across 11 Indian states. Audited turnover: {turnover} (editable via admin panel /admin).
            </p>

            <div className="pt-2 space-y-2 text-[#1d1d1f] text-[13px]">
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#0066cc]" />
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-[#0066cc] font-medium text-[#1d1d1f]">
                  {COMPANY_INFO.phoneFormatted}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#0066cc]" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-[#0066cc] text-[#7a7a7a]">
                  {COMPANY_INFO.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#0066cc] flex-shrink-0 mt-0.5" />
                <span className="text-[#7a7a7a]">Ward No.2, Sikta Belwa, Ramnagar, West Champaran, Bihar 845103, India</span>
              </div>
            </div>
            <div className="pt-2">
              <a href="/admin" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#292524] text-white text-[12px]">
                Admin Panel — Edit Turnover ₹ & Estimation
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Navigation — India
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li><a href="#overview" className="hover:text-[#292524] transition-colors">Overview</a></li>
              <li><a href="#services" className="hover:text-[#292524] transition-colors">Verticals Bihar</a></li>
              <li><a href="#portfolio" className="hover:text-[#292524] transition-colors">Portfolio — Admin Editable</a></li>
              <li><a href="#methodology" className="hover:text-[#292524] transition-colors">5-Stage Execution</a></li>
              <li><a href="#quality" className="hover:text-[#292524] transition-colors">Quality &amp; Safety</a></li>
              <li><a href="#presence" className="hover:text-[#292524] transition-colors">Pan-India Reach 11 States</a></li>
              <li><a href="#clients" className="hover:text-[#292524] transition-colors">Clients Bihar Govt</a></li>
              <li><a href="#estimator-section" className="hover:text-[#292524] transition-colors">Cost Estimator — Editable Rates</a></li>
              <li><a href="/blog" className="hover:text-[#292524] transition-colors">Journal</a></li>
              <li><a href="#faq" className="hover:text-[#292524] transition-colors">FAQs</a></li>
              <li><a href="#contact" className="hover:text-[#292524] transition-colors">RFP &amp; Tender Bihar</a></li>
              <li><a href="/admin" className="hover:text-[#292524] transition-colors font-medium">Admin — Turnover & Estimation</a></li>
            </ul>
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f] pt-3">
              Index pages — Indian SEO
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li><a href="/about/" className="hover:text-[#292524] transition-colors">About Bihar — Turnover {turnover}</a></li>
              <li><a href="/services/" className="hover:text-[#292524] transition-colors">All services Bihar India</a></li>
              <li><a href="/projects/" className="hover:text-[#292524] transition-colors">All projects Bihar</a></li>
              <li><a href="/locations/" className="hover:text-[#292524] transition-colors">All offices India</a></li>
              <li><a href="/presence/" className="hover:text-[#292524] transition-colors">11 states presence</a></li>
              <li><a href="/worksites/" className="hover:text-[#292524] transition-colors">Worksites geocoded</a></li>
              <li><a href="/faq/" className="hover:text-[#292524] transition-colors">FAQ index India</a></li>
              <li><a href="/directory/" className="hover:text-[#292524] transition-colors">Citation / backlink kit India</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Engineering Disciplines — Bihar India
            </h4>
            <ul className="space-y-2 text-[13px] text-[#7a7a7a]">
              <li><a href="/services/civil-structural/" className="hover:text-[#292524] transition-colors">Civil &amp; Structural Heavy Works Bihar</a></li>
              <li><a href="/services/infrastructure-gov/" className="hover:text-[#292524] transition-colors">Panchayat Sarkar Bhawan Builder Bihar</a></li>
              <li><a href="/services/healthcare-modular/" className="hover:text-[#292524] transition-colors">Hospital Ward Modernization Bihar</a></li>
              <li><a href="/services/solar-renewable/" className="hover:text-[#292524] transition-colors">Solar Street Lighting &amp; Rooftop PV India</a></li>
              <li><a href="/services/residential-commercial/" className="hover:text-[#292524] transition-colors">Commercial &amp; Residential Facilities Bihar</a></li>
              <li><a href="/services/materials-supply/" className="hover:text-[#292524] transition-colors">Primary Mill TMT &amp; Grade-53 Cement Supply Bihar</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Operating Offices — India
            </h4>
            <div className="space-y-2.5 text-[12px]">
              <div>
                <span className="font-semibold text-[#1d1d1f] block"><a href="/locations/delhi-ncr/" className="hover:underline">Delhi NCR Hub:</a></span>
                <span className="text-[#7a7a7a]">S8 2nd Floor Aaditya Mall, Indirapuram</span>
              </div>
              <div>
                <span className="font-semibold text-[#1d1d1f] block"><a href="/locations/patna-branch/" className="hover:underline">Bihar State Branch Patna:</a></span>
                <span className="text-[#7a7a7a]">Sanyukta Bhawan, Shivpuri, Patna</span>
              </div>
              <div>
                <span className="font-semibold text-[#1d1d1f] block"><a href="/locations/bettiah-branch/" className="hover:underline">West Champaran Operations Bettiah:</a></span>
                <span className="text-[#7a7a7a]">Basant Vihar, Hariwatika Chowk, Bettiah</span>
              </div>
              <div>
                <span className="font-semibold text-[#1d1d1f] block"><a href="/locations/assam-bedeti/" className="hover:underline">Assam Regional Hubs:</a></span>
                <span className="text-[#7a7a7a]">Biswanath (Bedeti) &amp; Jorhat</span>
              </div>
            </div>
            <div className="pt-3 text-[11px] text-[#78716c] bg-[#ffffff] border border-[#e7e5e4] rounded-[12px] p-3">
              <b>Indian SEO:</b> Timezone Asia/Kolkata, Region asia-south1, Languages en-IN hi-IN, Geo IN-BR Ramnagar Bihar.
            </div>
          </div>

        </div>

        <div className="pt-8 mt-12 border-t border-[#e7e5e4] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#78716c]">
          <div>
            Copyright © {new Date().getFullYear()} Rudra Constructions &amp; Suppliers Pvt. Ltd. All rights reserved. Made in Bihar, India — Indian SEO.
            <a href="/admin" className="ml-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#292524] text-white text-[11px]">Admin — Turnover & Estimation</a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-[#78716c] hover:text-[#0c0a09] transition-colors">XML Sitemap India</a>
            <span>•</span>
            <a href="/sitemap.html" className="text-[#78716c] hover:text-[#0c0a09] transition-colors">HTML Sitemap</a>
            <span>•</span>
            <a href="/rss.xml" className="text-[#78716c] hover:text-[#0c0a09] transition-colors">RSS India</a>
            <span>•</span>
            <a href="/llms.txt" className="text-[#78716c] hover:text-[#0c0a09] transition-colors">llms.txt India</a>
            <span>•</span>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="text-[#78716c] hover:text-[#0c0a09] transition-colors">Robots.txt India</a>
            <span>•</span>
            <button onClick={onOpenBrochure} className="text-[#292524] hover:underline flex items-center gap-1 cursor-pointer font-medium">
              <FileText className="w-3.5 h-3.5" />
              <span>Company Brochure (PDF)</span>
            </button>
            <span>•</span>
            <button onClick={scrollToTop} className="text-[#78716c] hover:text-[#0c0a09] flex items-center gap-1 cursor-pointer transition-colors">
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
