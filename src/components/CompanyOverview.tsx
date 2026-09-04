import React from 'react';
import { ShieldCheck, CheckCircle2, Lightbulb, HeartHandshake, MapPin, Building, ChevronRight } from 'lucide-react';
import { COMPANY_INFO, MISSION_VISION } from '../data/companyData';
import { useCms } from '../cms/CmsProvider';

export const CompanyOverview: React.FC = () => {
  const { company } = useCms();
  const turnover = company?.turnover || COMPANY_INFO.totalTurnover;
  return (
    <section id="overview" className="py-20 sm:py-24 bg-[#ffffff] border-b border-[#e0e0e0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 sm:mb-16">
          <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium">
            Overview & Core Philosophy
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight leading-snug">
            Engineering infrastructure with purpose and technical rigor.
          </h2>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed font-normal">
            Founded in 2025, Rudra Constructions & Suppliers delivers high-grade civil works, government administrative assets, and clean energy across 11 Indian states.
          </p>
        </div>

        {/* 2-Column Story & Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-16 sm:mb-20">
          
          {/* Left Column: Story & Philosophy */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 text-[#1c1917]">
            <div className="space-y-4 text-base sm:text-[17px] leading-relaxed font-normal text-[#44403c]">
              <h3 className="text-2xl sm:text-[26px] font-medium text-[#1c1917] tracking-tight leading-snug">
                Technical rigor combined with commercial viability.
              </h3>
              
              <p className="leading-relaxed">
                The company specializes in residential construction, commercial facilities, government infrastructure, solar installations, hospital modernization, and certified building material logistics. With mechanized plant assets and strict adherence to Bureau of Indian Standards (BIS), we execute complex civil engineering works on schedule and on budget.
              </p>

              <p className="leading-relaxed">
                From Panchayat Sarkar Bhawans to 100-bed hospital inpatient wards and 2MW community solar grids, we build durable public and commercial infrastructure that stands the test of time.
              </p>
            </div>

            {/* Quick Fact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-[18px] bg-[#fafafa] border border-[#e7e5e4]">
                <div className="text-xs uppercase text-[#78716c] font-medium tracking-wide">Headquarters</div>
                <div className="text-base font-semibold text-[#1c1917] mt-1">West Champaran, Bihar</div>
                <div className="text-sm text-[#78716c] mt-0.5 leading-normal">Ward No.2, Sikta Belwa, Ramnagar 845103</div>
              </div>

              <div className="p-5 rounded-[18px] bg-[#fafafa] border border-[#e7e5e4]">
                <div className="text-xs uppercase text-[#78716c] font-medium tracking-wide">Audited Delivery</div>
                <div className="text-base font-semibold text-[#1c1917] mt-1">{turnover}</div>
                <div className="text-sm text-[#78716c] mt-0.5 leading-normal">Certified turnover across public & private bids</div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission & Vision Card */}
          <div className="lg:col-span-5 bg-[#292524] text-white rounded-[20px] p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-8">
              {/* Mission */}
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#a7e5d3] font-semibold">
                  Our Mission
                </span>
                <p className="text-base sm:text-[17px] text-white leading-relaxed font-normal">
                  "{MISSION_VISION.mission}"
                </p>
                <div className="space-y-2 pt-1">
                  {MISSION_VISION.missionPillars.map((pillar, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-stone-300 leading-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a7e5d3] mt-2 flex-shrink-0"></span>
                      <span>{pillar}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vision */}
              <div className="pt-6 border-t border-white/15 space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#f4c5a8] font-semibold">
                  Our Vision
                </span>
                <p className="text-base sm:text-[17px] text-white leading-relaxed font-normal">
                  "{MISSION_VISION.vision}"
                </p>
                <div className="space-y-2 pt-1">
                  {MISSION_VISION.visionPillars.map((pillar, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-stone-300 leading-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2 flex-shrink-0"></span>
                      <span>{pillar}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-[12px] text-[#7a7a7a]">
              Rudra Constructions & Suppliers • Operating Standard
            </div>
          </div>

        </div>

        {/* 4 Core Values Grid: Apple Store Utility Cards (rounded 18px, 1px hairline border #e0e0e0) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.015em]">
              Core Principles
            </h3>
            <p className="text-[17px] text-[#7a7a7a] mt-1 font-normal">
              Standards that govern every engineering calculation and site execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MISSION_VISION.coreValues.map((v, i) => {
              const icons = [ShieldCheck, CheckCircle2, Lightbulb, HeartHandshake];
              const Icon = icons[i % icons.length];
              return (
                <div
                  key={v.title}
                  className="bg-[#ffffff] rounded-[18px] p-6 border border-[#e0e0e0] flex flex-col justify-between transition-colors hover:border-[#0066cc]"
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#0066cc] mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-[19px] font-semibold text-[#1d1d1f] tracking-[-0.01em]">
                      {v.title}
                    </h4>
                    <p className="text-[14px] text-[#7a7a7a] leading-[1.43] mt-2">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
