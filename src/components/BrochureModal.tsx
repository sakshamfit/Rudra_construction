import React from 'react';
import { X, Printer } from 'lucide-react';
import { COMPANY_INFO, MISSION_VISION, SERVICES, CLIENTS, OFFICE_LOCATIONS } from '../data/companyData';
import { useCms } from '../cms/CmsProvider';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({ isOpen, onClose }) => {
  const { company } = useCms();
  if (!isOpen) return null;
  const turnover = company?.turnover || COMPANY_INFO.totalTurnover;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#ffffff] rounded-[24px] max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e0e0e0] flex flex-col">
        
        {/* Modal Controls Header */}
        <div className="sticky top-0 z-20 bg-white/90 apple-frosted px-6 py-4 border-b border-[#e0e0e0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-[#1d1d1f] text-[15px]">
              Rudra Constructions & Suppliers — Corporate Prospectus
            </span>
            <span className="text-[11px] bg-[#f5f5f7] text-[#7a7a7a] font-normal px-2.5 py-0.5 rounded-full border border-[#e0e0e0]">
              2025 Edition
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="apple-btn-active inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-normal text-white bg-[#1d1d1f] hover:bg-[#333336] rounded-full transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#7a7a7a] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors cursor-pointer"
              aria-label="Close prospectus"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Brochure Printable Content Body */}
        <div className="p-6 sm:p-10 space-y-10 text-[#1d1d1f] printable-brochure">
          
          {/* Cover Header */}
          <div className="border-b border-[#e0e0e0] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[13px] text-[#7a7a7a] tracking-[-0.224px]">
                Official Corporate Profile & Capabilities Statement
              </p>
              <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-tight mt-1">
                RUDRA CONSTRUCTIONS & SUPPLIERS
              </h1>
              <p className="text-[14px] text-[#7a7a7a] mt-1">
                Engineering Trust. Constructing Excellence • Est. 2025
              </p>
            </div>
            <div className="text-right sm:border-l sm:border-[#e0e0e0] sm:pl-6 space-y-0.5">
              <div className="text-[12px] text-[#7a7a7a]">Total Audited Turnover</div>
              <div className="text-[26px] font-semibold text-[#1d1d1f]">{turnover}</div>
              <div className="text-[12px] text-[#7a7a7a]">Class-A Civil & Solar Contractor</div>
            </div>
          </div>

          {/* Registered Office & Contacts Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#fafafc] p-4 rounded-[16px] border border-[#e0e0e0] text-[13px]">
            <div>
              <span className="font-semibold text-[#1d1d1f] block">Registered Office</span>
              <span className="text-[#7a7a7a]">
                Ward No.2, Sikta Belwa, Ramnagar, West Champaran, Bihar 845103
              </span>
            </div>
            <div>
              <span className="font-semibold text-[#1d1d1f] block">Tender Hotline</span>
              <span className="text-[#7a7a7a]">{COMPANY_INFO.phoneFormatted}</span>
            </div>
            <div>
              <span className="font-semibold text-[#1d1d1f] block">Official Email</span>
              <span className="text-[#7a7a7a]">{COMPANY_INFO.email}</span>
            </div>
          </div>

          {/* Table of Contents Section */}
          <div className="space-y-4">
            <h2 className="text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a]">
              Table of Contents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] text-[#1d1d1f]">
              <div className="p-3 bg-[#fafafc] rounded-[12px] border border-[#e0e0e0] flex items-center justify-between">
                <span>1. Company Overview</span>
                <span className="text-[#7a7a7a]">Page 03</span>
              </div>
              <div className="p-3 bg-[#fafafc] rounded-[12px] border border-[#e0e0e0] flex items-center justify-between">
                <span>2. Mission, Vision & Core Values</span>
                <span className="text-[#7a7a7a]">Page 04</span>
              </div>
              <div className="p-3 bg-[#fafafc] rounded-[12px] border border-[#e0e0e0] flex items-center justify-between">
                <span>3. Core Verticals & Projects Portfolio</span>
                <span className="text-[#7a7a7a]">Page 05</span>
              </div>
              <div className="p-3 bg-[#fafafc] rounded-[12px] border border-[#e0e0e0] flex items-center justify-between">
                <span>4. 5-Step Project Execution Methodology</span>
                <span className="text-[#7a7a7a]">Page 06</span>
              </div>
              <div className="p-3 bg-[#fafafc] rounded-[12px] border border-[#e0e0e0] flex items-center justify-between">
                <span>5. Quality, Safety & Statutory Compliance</span>
                <span className="text-[#7a7a7a]">Page 07</span>
              </div>
              <div className="p-3 bg-[#fafafc] rounded-[12px] border border-[#e0e0e0] flex items-center justify-between">
                <span>6. Why Choose Us Strengths</span>
                <span className="text-[#7a7a7a]">Page 08</span>
              </div>
              <div className="p-3 bg-[#fafafc] rounded-[12px] border border-[#e0e0e0] flex items-center justify-between">
                <span>7. Network of Operating Offices</span>
                <span className="text-[#7a7a7a]">Page 09</span>
              </div>
              <div className="p-3 bg-[#fafafc] rounded-[12px] border border-[#e0e0e0] flex items-center justify-between">
                <span>8. Clients & Government Partners</span>
                <span className="text-[#7a7a7a]">Page 10</span>
              </div>
            </div>
          </div>

          {/* Overview Statement */}
          <div className="space-y-3">
            <h3 className="text-[18px] font-semibold text-[#1d1d1f] border-b border-[#e0e0e0] pb-2">
              1. Executive Overview & Capabilities
            </h3>
            <p className="text-[14px] text-[#7a7a7a] leading-relaxed">
              Founded in 2025, Rudra Constructions & Suppliers is an infrastructure enterprise delivering civil, healthcare, and renewable energy solutions. The company specializes in government infrastructure development (including Panchayat Sarkar Bhawans), solar energy installations, hospital ward retrofits, and the direct bulk supply of certified building materials.
            </p>
          </div>

          {/* Mission, Vision & Values */}
          <div className="space-y-3">
            <h3 className="text-[18px] font-semibold text-[#1d1d1f] border-b border-[#e0e0e0] pb-2">
              2. Mission, Vision & Core Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div className="p-4 bg-[#fafafc] rounded-[16px] border border-[#e0e0e0]">
                <span className="font-semibold text-[#0066cc] uppercase tracking-wider block mb-1">Mission</span>
                <p className="text-[#1d1d1f] leading-relaxed">{MISSION_VISION.mission}</p>
              </div>
              <div className="p-4 bg-[#fafafc] rounded-[16px] border border-[#e0e0e0]">
                <span className="font-semibold text-[#1d1d1f] uppercase tracking-wider block mb-1">Vision</span>
                <p className="text-[#1d1d1f] leading-relaxed">{MISSION_VISION.vision}</p>
              </div>
            </div>
          </div>

          {/* 6 Core Verticals */}
          <div className="space-y-3">
            <h3 className="text-[18px] font-semibold text-[#1d1d1f] border-b border-[#e0e0e0] pb-2">
              3. Service Verticals & Engineering Disciplines
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              {SERVICES.map((srv) => (
                <div key={srv.id} className="p-4 bg-[#fafafc] rounded-[16px] border border-[#e0e0e0] space-y-1">
                  <div className="font-semibold text-[#1d1d1f] flex items-center justify-between">
                    <span>{srv.title}</span>
                    <span className="text-[11px] text-[#0066cc] bg-white px-2.5 py-0.5 rounded-full border border-[#e0e0e0]">{srv.badge}</span>
                  </div>
                  <p className="text-[#7a7a7a] text-[12px] leading-relaxed">{srv.shortDesc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Offices Directory */}
          <div className="space-y-3">
            <h3 className="text-[18px] font-semibold text-[#1d1d1f] border-b border-[#e0e0e0] pb-2">
              4. Nationwide Office Locations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              {OFFICE_LOCATIONS.map((loc) => (
                <div key={loc.id} className="p-3.5 bg-[#fafafc] rounded-[14px] border border-[#e0e0e0]">
                  <span className="font-semibold text-[#1d1d1f] block">{loc.type} — {loc.city}</span>
                  <p className="text-[#7a7a7a] text-[12px] mt-0.5">{loc.address}, {loc.state} - {loc.pincode}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Client Roster */}
          <div className="space-y-3">
            <h3 className="text-[18px] font-semibold text-[#1d1d1f] border-b border-[#e0e0e0] pb-2">
              5. Certified Clients & Government Partners
            </h3>
            <div className="flex flex-wrap gap-2 text-[13px]">
              {CLIENTS.map((c, i) => (
                <span key={i} className="px-3 py-1 bg-[#ffffff] border border-[#e0e0e0] rounded-full text-[#1d1d1f]">
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t border-[#e0e0e0] flex flex-col sm:flex-row items-center justify-between text-[13px] text-[#7a7a7a] gap-4">
            <div>
              <p className="font-semibold text-[#1d1d1f]">Rudra Constructions & Suppliers</p>
              <p>Engineering Trust. Constructing Excellence.</p>
            </div>
            <div className="text-right">
              <p>Direct Consultation:</p>
              <p className="font-semibold text-[#0066cc]">{COMPANY_INFO.phoneFormatted} | {COMPANY_INFO.email}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
