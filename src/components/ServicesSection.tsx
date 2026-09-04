import React, { useState } from 'react';
import { Building2, Home, Landmark, Sun, Stethoscope, Truck, Check, ChevronRight } from 'lucide-react';
import { SERVICES } from '../data/companyData';

interface ServicesSectionProps {
  onSelectServiceForEstimate?: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForEstimate }) => {
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES[0].id);

  const activeService = SERVICES.find(s => s.id === activeServiceId) || SERVICES[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return Building2;
      case 'Home': return Home;
      case 'Landmark': return Landmark;
      case 'Sun': return Sun;
      case 'Stethoscope': return Stethoscope;
      case 'Truck': return Truck;
      default: return Building2;
    }
  };

  return (
    <section id="services" className="py-20 sm:py-24 bg-[#ffffff] border-b border-[#e0e0e0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium">
            Core Verticals & Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight leading-snug">
            Turnkey civil engineering and renewable power.
          </h2>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed font-normal">
            Complete lifecycle delivery spanning civil contracting, community infrastructure, solar electrification, and certified materials.
          </p>
        </div>

        {/* Apple Segmented Control / Pill Bar */}
        <div className="flex justify-center mb-10 overflow-x-auto py-2">
          <div className="inline-flex bg-[#f5f5f7] p-1 rounded-full border border-[#e0e0e0] max-w-full">
            {SERVICES.map((service) => {
              const isActive = service.id === activeServiceId;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`apple-btn-active px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#ffffff] text-[#0c0a09] font-medium shadow-sm'
                      : 'text-[#78716c] hover:text-[#0c0a09] font-normal'
                  }`}
                >
                  {service.title.split(' ')[0]} {service.title.split(' ')[1] || ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Vertical Detail Presentation Card */}
        <div className="bg-[#292524] text-white rounded-[20px] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
            
            {/* Left Column: Vertical Specs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2.5">
                <span className="text-xs uppercase tracking-wider text-[#a7e5d3] font-semibold">
                  Engineering Scope • {activeService.badge || 'Certified Capability'}
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-normal text-white tracking-tight leading-snug">
                  {activeService.title}
                </h3>
                <p className="text-stone-300 text-base sm:text-[17px] leading-relaxed font-normal pt-1">
                  {activeService.fullDesc}
                </p>
              </div>

              {/* Specific Engineering Capabilities */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                  Technical Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeService.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-stone-200 bg-white/5 p-3 rounded-[12px] leading-normal">
                      <Check className="w-4 h-4 text-[#a7e5d3] flex-shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance & Standards */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-white/60">Compliance:</span>
                {activeService.complianceStandards.map((std, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-normal">
                    {std}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Deployment Specs & CTAs */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-black/40 p-6 sm:p-8 rounded-[16px] border border-white/10">
              <div className="space-y-5">
                <div>
                  <span className="text-xs text-white/60 uppercase tracking-wider">Representative Works</span>
                  <p className="text-base sm:text-[17px] font-normal text-white mt-1.5 leading-relaxed">
                    {activeService.keyProjects}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-5 space-y-3">
                  <span className="text-xs text-white/60 uppercase tracking-wider">Quality Assurance</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3.5 rounded-[12px]">
                      <div className="text-base font-semibold text-white">IS & NABL</div>
                      <div className="text-xs text-white/60 mt-0.5">Bureau of Indian Standards</div>
                    </div>
                    <div className="bg-white/5 p-3.5 rounded-[12px]">
                      <div className="text-base font-semibold text-white">Full Turnkey</div>
                      <div className="text-xs text-white/60 mt-0.5">Commissioning & handover</div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-stone-300 leading-relaxed">
                  Transparent BOQ calculation, lab-tested aggregate verification, and certified engineering supervision.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href="#contact"
                  className="apple-btn-active w-full inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-[#a7e5d3] hover:bg-[#8ee0ca] text-[#0c0a09] text-[15px] font-medium cursor-pointer text-center"
                >
                  <span>Inquire for {activeService.title.split(' ')[0]}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href={`/services/${activeService.id}/`}
                  className="apple-btn-active w-full inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-[14px] font-medium cursor-pointer text-center border border-white/15"
                >
                  <span>Index page</span>
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
