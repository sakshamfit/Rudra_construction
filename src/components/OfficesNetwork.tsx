import React, { useState } from 'react';
import { MapPin, Phone, Mail, Copy, Check, ChevronRight } from 'lucide-react';
import { OFFICE_LOCATIONS, COMPANY_INFO } from '../data/companyData';
import { OfficeLocation } from '../types';

export const OfficesNetwork: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (office: OfficeLocation) => {
    const text = `${office.type}: ${office.address}, ${office.city}, ${office.state} - ${office.pincode}. Phone: ${office.phone || COMPANY_INFO.phone}`;
    navigator.clipboard.writeText(text);
    setCopiedId(office.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="offices" className="py-20 sm:py-24 bg-[#ffffff] border-b border-[#e0e0e0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium">
            Regional Mobilization
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight leading-snug">
            Operating offices & hubs.
          </h2>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed font-normal">
            Strategic offices in Bihar, Delhi NCR, and Assam ensuring responsive site supervision and logistics.
          </p>
        </div>

        {/* Office Cards Grid: Apple Store Utility Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFICE_LOCATIONS.map((office) => {
            const isCopied = copiedId === office.id;
            return (
              <div
                key={office.id}
                className="bg-[#ffffff] rounded-[18px] p-6 sm:p-7 border border-[#e0e0e0] flex flex-col justify-between transition-colors hover:border-[#0066cc]"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] px-3 py-1 rounded-full ${
                      office.isPrimary
                        ? 'bg-[#1d1d1f] text-white font-medium'
                        : 'bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0] font-normal'
                    }`}>
                      {office.type}
                    </span>
                    <span className="text-[12px] font-mono text-[#7a7a7a]">
                      PIN: {office.pincode}
                    </span>
                  </div>

                  {/* City & State */}
                  <div>
                    <h3 className="text-[21px] font-semibold text-[#1d1d1f] tracking-tight">
                      {office.city}, {office.state}
                    </h3>
                    <p className="text-[14px] text-[#7a7a7a] mt-2 leading-[1.43]">
                      {office.address}
                    </p>
                  </div>

                  {/* Contact tags */}
                  <div className="pt-3 border-t border-[#f0f0f0] space-y-2 text-[13px] text-[#1d1d1f]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#0066cc] flex-shrink-0" />
                      <a
                        href={`tel:${office.phone || COMPANY_INFO.phone}`}
                        className="hover:text-[#0066cc] transition-colors"
                      >
                        {office.phone || COMPANY_INFO.phoneFormatted}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#0066cc] flex-shrink-0" />
                      <a
                        href={`mailto:${office.email || COMPANY_INFO.email}`}
                        className="hover:text-[#0066cc] transition-colors truncate"
                      >
                        {office.email || COMPANY_INFO.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-4 mt-4 border-t border-[#f0f0f0] flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(office)}
                    className="apple-btn-active inline-flex items-center gap-1.5 text-[13px] text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#0066cc]" />
                        <span className="text-[#0066cc]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#7a7a7a]" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${office.address}, ${office.city}, ${office.state} ${office.pincode}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-btn-active inline-flex items-center gap-1 text-[13px] text-[#0066cc] hover:underline"
                  >
                    <span>View Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
