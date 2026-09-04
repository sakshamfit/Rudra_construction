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
              Government-approved Class-A contracting, sustainable solar energy, and certified materials across 11 states. Audited turnover of {turnover}.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenEstimator}
              className="apple-btn-active px-5 py-2.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] text-white font-medium text-sm transition-all cursor-pointer shadow-sm"
            >
              Request Project Estimate
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
                  Engineering Trust. Constructing Excellence.
                </span>
              </div>
            </div>

            <p className="text-[#7a7a7a] leading-relaxed text-[13px]">
              Founded in 2025, delivering high-quality civil, commercial, healthcare, and renewable energy solutions across 11 Indian states. Audited turnover: {turnover}.
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
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li><a href="#services" className="hover:text-[#292524] transition-colors">Core Services</a></li>
              <li><a href="#portfolio" className="hover:text-[#292524] transition-colors">Landmark Projects</a></li>
              <li><a href="#quality" className="hover:text-[#292524] transition-colors">Quality &amp; Standards</a></li>
              <li><a href="#overview" className="hover:text-[#292524] transition-colors">About Rudra</a></li>
              <li><a href="#faq" className="hover:text-[#292524] transition-colors">Frequently Asked Questions</a></li>
              <li><a href="#contact" className="hover:text-[#292524] transition-colors">Tender &amp; Contact Desk</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Core Disciplines
            </h4>
            <ul className="space-y-2 text-[13px] text-[#7a7a7a]">
              <li><a href="#services" className="hover:text-[#292524] transition-colors">Civil &amp; Government Contracting</a></li>
              <li><a href="#services" className="hover:text-[#292524] transition-colors">Healthcare &amp; Hospital Infrastructure</a></li>
              <li><a href="#services" className="hover:text-[#292524] transition-colors">Solar Electrification &amp; Clean Power</a></li>
              <li><a href="#services" className="hover:text-[#292524] transition-colors">Commercial Warehouses &amp; Facilities</a></li>
              <li><a href="#services" className="hover:text-[#292524] transition-colors">Certified Bulk Material Logistics</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#1d1d1f]">
              Corporate Offices
            </h4>
            <div className="space-y-2.5 text-[12px]">
              <div>
                <span className="font-semibold text-[#1d1d1f] block">Headquarters (Bihar):</span>
                <span className="text-[#7a7a7a]">Ramnagar, West Champaran, Bihar 845103</span>
              </div>
              <div>
                <span className="font-semibold text-[#1d1d1f] block">Delhi NCR Hub:</span>
                <span className="text-[#7a7a7a]">S8 2nd Floor Aaditya Mall, Indirapuram</span>
              </div>
              <div>
                <span className="font-semibold text-[#1d1d1f] block">Patna Regional Office:</span>
                <span className="text-[#7a7a7a]">Sanyukta Bhawan, Shivpuri, Patna</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 mt-12 border-t border-[#e7e5e4] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#78716c]">
          <div>
            Copyright © {new Date().getFullYear()} Rudra Constructions &amp; Suppliers Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-[#78716c] hover:text-[#0c0a09] transition-colors">Sitemap</a>
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
