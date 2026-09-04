import React from 'react';
import { CheckCircle2, Quote } from 'lucide-react';
import { CLIENTS } from '../data/companyData';

export const ClientsSection: React.FC = () => {
  return (
    <section id="clients" className="py-20 sm:py-24 bg-[#f5f5f7] border-b border-[#e0e0e0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium">
            Institutional Alliances
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight leading-snug">
            Clients & government partners.
          </h2>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed font-normal">
            Trusted by state departments, civic statutory bodies, and national non-profit foundations for dependable execution.
          </p>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {CLIENTS.map((client, idx) => (
            <div
              key={idx}
              className="p-6 rounded-[18px] bg-[#ffffff] border border-[#e7e5e4] flex flex-col justify-between transition-colors hover:border-[#292524] group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#f5f5f5] border border-[#e7e5e4] text-[#78716c]">
                    {client.category.includes('Government') ? 'Govt Agency' : 'Foundation'}
                  </span>
                </div>
                <h3 className="text-base font-medium text-[#0c0a09] group-hover:text-[#292524] leading-snug transition-colors tracking-tight">
                  {client.name}
                </h3>
                <p className="text-xs text-[#57534e] mt-2 line-clamp-3 leading-relaxed">
                  {client.description}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#f5f5f5] flex items-center gap-1.5 text-xs text-[#78716c]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Verified Contractor</span>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Endorsements Quote Banner */}
        <div className="bg-[#292524] text-white rounded-[20px] p-8 sm:p-12 border border-[#3e3835]">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Quote className="w-7 h-7 text-[#a7e5d3] mx-auto opacity-80" />
            <blockquote className="text-lg sm:text-xl font-normal text-white leading-relaxed">
              "Rudra Constructions & Suppliers has proven to be an agile, standards-driven contracting partner across civic infrastructure developments. Their adherence to structural IS codes, transparent billing, and dedicated solar integration have reliably met statutory standards."
            </blockquote>
            <div className="pt-2">
              <div className="text-xs font-semibold text-[#a7e5d3] uppercase tracking-wider">
                Joint Infrastructure Review Board
              </div>
              <div className="text-xs text-stone-300 mt-0.5">
                Evaluated across Turnkey Civil & Solar Electrification Projects
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
