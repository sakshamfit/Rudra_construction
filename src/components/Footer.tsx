import React from 'react';
import { Phone, Mail, MapPin, ArrowUp, FileText } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface FooterProps {
  onOpenBrochure: () => void;
  onOpenEstimator: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBrochure, onOpenEstimator }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f5f5f7] text-[#7a7a7a] text-[12px] border-t border-[#e0e0e0]">
      
      {/* Top Banner Call to Action */}
      <div className="bg-[#ffffff] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#e7e5e4]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-[#78716c] uppercase tracking-wider">
              Engineering & Execution
            </span>
            <h3 className="text-2xl sm:text-3xl font-normal text-[#0c0a09] tracking-tight leading-snug">
              Partner with Rudra Constructions & Suppliers.
            </h3>
            <p className="text-sm sm:text-base text-[#57534e] max-w-2xl leading-relaxed">
              Government-approved Class-A contracting, sustainable solar energy, and certified materials across 11 states.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenEstimator}
              className="apple-btn-active px-5 py-2.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] text-white font-medium text-sm transition-all cursor-pointer shadow-sm"
            >
              Run Project Estimator
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

      {/* Main Footer Directory */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Overview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#1d1d1f] flex items-center justify-center text-white">
                <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                  <circle cx="28" cy="18" r="11" fill="#ffffff" />
                  <polygon points="6,38 24,14 42,38" fill="#1d1d1f" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="14" y1="38" x2="34" y2="38" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className="font-semibold text-[15px] tracking-tight text-[#1d1d1f] block uppercase">
                  Rudra Constructions & Suppliers
                </span>
                <span className="text-[11px] text-[#7a7a7a] tracking-normal block">
                  Engineering Trust. Constructing Excellence.
                </span>
              </div>
            </div>

            <p className="text-[#7a7a7a] leading-relaxed text-[13px]">
              Founded in 2025, delivering high-quality civil, commercial, healthcare, and renewable energy solutions across 11 Indian states. Audited turnover: {COMPANY_INFO.totalTurnover}.
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
                <span className="text-[#7a7a7a]">Ward No.2, Sikta Belwa, Ramnagar, West Champaran, Bihar 845103</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Navigation
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li><a href="#overview" className="hover:text-[#292524] transition-colors">Overview</a></li>
              <li><a href="#services" className="hover:text-[#292524] transition-colors">Verticals</a></li>
              <li><a href="#portfolio" className="hover:text-[#292524] transition-colors">Portfolio</a></li>
              <li><a href="#methodology" className="hover:text-[#292524] transition-colors">5-Stage Execution</a></li>
              <li><a href="#quality" className="hover:text-[#292524] transition-colors">Quality &amp; Safety</a></li>
              <li><a href="#presence" className="hover:text-[#292524] transition-colors">Pan-India Reach</a></li>
              <li><a href="#clients" className="hover:text-[#292524] transition-colors">Clients</a></li>
              <li><a href="#estimator-section" className="hover:text-[#292524] transition-colors">Cost Estimator</a></li>
              <li><a href="#faq" className="hover:text-[#292524] transition-colors">FAQs</a></li>
              <li><a href="#contact" className="hover:text-[#292524] transition-colors">RFP &amp; Tender</a></li>
            </ul>
          </div>

          {/* Core Verticals */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Engineering Disciplines
            </h4>
            <ul className="space-y-2 text-[13px] text-[#7a7a7a]">
              <li>Civil & Structural Heavy Works</li>
              <li>Panchayat Sarkar Bhawan Administrative Hubs</li>
              <li>Hospital Inpatient Ward Modernization</li>
              <li>Solar Street Lighting & Rooftop PV</li>
              <li>Commercial & Residential Facilities</li>
              <li>Primary Mill TMT & Grade-53 Cement</li>
            </ul>
          </div>

          {/* Operating Hubs Breakdown */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Operating Offices
            </h4>
            <div className="space-y-2.5 text-[12px]">
              <div>
                <span className="font-semibold text-[#1d1d1f] block">Delhi NCR Hub:</span>
                <span className="text-[#7a7a7a]">S8 2nd Floor Aaditya Mall, Indirapuram</span>
              </div>
              <div>
                <span className="font-semibold text-[#1d1d1f] block">Bihar State Branch:</span>
                <span className="text-[#7a7a7a]">Sanyukta Bhawan, Shivpuri, Patna</span>
              </div>
              <div>
                <span className="font-semibold text-[#1d1d1f] block">West Champaran Operations:</span>
                <span className="text-[#7a7a7a]">Basant Vihar, Hariwatika Chowk, Bettiah</span>
              </div>
              <div>
                <span className="font-semibold text-[#1d1d1f] block">Assam Regional Hubs:</span>
                <span className="text-[#7a7a7a]">Biswanath (Bedeti) & Jorhat</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, SEO Indexing & Standards */}
        <div className="pt-8 mt-12 border-t border-[#e7e5e4] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#78716c]">
          <div>
            Copyright © {new Date().getFullYear()} Rudra Constructions &amp; Suppliers Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#78716c] hover:text-[#0c0a09] transition-colors"
            >
              XML Sitemap
            </a>
            <span>•</span>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#78716c] hover:text-[#0c0a09] transition-colors"
            >
              Robots.txt
            </a>
            <span>•</span>
            <button
              onClick={onOpenBrochure}
              className="text-[#292524] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Company Brochure (PDF)</span>
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="text-[#78716c] hover:text-[#0c0a09] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
