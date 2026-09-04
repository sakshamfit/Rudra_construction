import React from 'react';
import { ShieldCheck, HardHat, Award, Leaf, Zap, Trees, CheckCircle2, FileCheck2 } from 'lucide-react';

export const QualitySafetyCompliance: React.FC = () => {
  const safetyProtocols = [
    {
      title: "Strict Industry Standards",
      desc: "Comprehensive conformance with Bureau of Indian Standards (IS 456, IS 1893, IS 1786) and National Building Code (NBC 2016).",
      icon: Award
    },
    {
      title: "Certified Mill-Tested Materials",
      desc: "Exclusively primary steel with manufacturer Mill Test Certificates (MTC) and Grade-53/43 cement with batch cube testing.",
      icon: FileCheck2
    },
    {
      title: "Zero-Harm On-Site Protocols",
      desc: "Mandatory PPE enforcement, daily morning toolbox briefings, certified scaffolding, and certified first-aid marshals.",
      icon: HardHat
    },
    {
      title: "Continuous Supervision & Audits",
      desc: "Resident project engineers conduct stage-gate audits for every concrete pour, curing cycle, and reinforcement placement.",
      icon: ShieldCheck
    }
  ];

  const sustainabilityPillars = [
    {
      title: "Low-Carbon Methodologies",
      desc: "Minimizing carbon footprint with fly-ash blended cement (PPC), modular precast components, and localized resource sourcing.",
      icon: Leaf
    },
    {
      title: "Energy Efficiency",
      desc: "Integrating high-lumen solar LED luminaires, daylight optimization architectural layouts, and rooftop solar microgrids.",
      icon: Zap
    },
    {
      title: "Ethical Procurement",
      desc: "Direct procurement from primary mills, washed sand, non-toxic water-based finishes, and lead-free electrical conduits.",
      icon: Award
    },
    {
      title: "Civic Infrastructure",
      desc: "Delivering accessible civic hubs, Panchayat Sarkar Bhawans, and hospital wards that elevate rural living and community health.",
      icon: Trees
    }
  ];

  const whyChooseUsStrengths = [
    "Competitive, honest, and completely transparent item-rate pricing",
    "Turnkey execution with company-owned machinery fleet",
    "Future-ready approach with integrated solar infrastructure",
    "Comprehensive after-sales defect liability and technical support",
    "Recognized Class-1 government contractor registration",
    "Daily digital progress logging and milestone transparency",
    "Engineered structural and architectural solutions for complex sites",
    "Direct oversight by senior engineering directors throughout build lifecycle"
  ];

  return (
    <section id="quality" className="py-20 sm:py-24 bg-[#f5f5f7] border-b border-[#e0e0e0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium">
            Statutory Assurance
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight leading-snug">
            Quality, safety & compliance.
          </h2>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed font-normal">
            Every civic, healthcare, and solar infrastructure project adheres strictly to statutory mandates and Indian standard codes.
          </p>
        </div>

        {/* 4 Core Pillars of Safety & Quality */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-16">
          {safetyProtocols.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#ffffff] rounded-[18px] p-6 sm:p-7 border border-[#e7e5e4] flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#f5f5f5] text-[#1c1917] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-[#0c0a09] tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#57534e] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Promotion: Eco-Friendly & Sustainability */}
        <div className="bg-[#292524] text-white rounded-[20px] p-8 sm:p-12 mb-12 sm:mb-16 border border-[#3e3835]">
          <div className="space-y-8">
            <div className="max-w-2xl space-y-2.5">
              <span className="text-xs uppercase text-[#a7e5d3] font-semibold tracking-wider">Environmental Responsibility</span>
              <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-normal text-white tracking-tight leading-snug">
                Sustainable building & clean energy integration.
              </h3>
              <p className="text-base text-stone-300 leading-relaxed font-normal">
                Infrastructure designed to minimize environmental load through ecological materials, renewable rooftop microgrids, and resource-efficient engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sustainabilityPillars.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-[16px] p-5">
                    <div className="w-9 h-9 rounded-full bg-white/10 text-[#a7e5d3] flex items-center justify-center mb-4">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-base font-semibold text-white mb-1.5 tracking-tight">{p.title}</h4>
                    <p className="text-xs text-stone-300 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-[#ffffff] rounded-[20px] p-8 sm:p-12 border border-[#e7e5e4]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs uppercase text-[#78716c] font-semibold tracking-wider">
                Contractor Capabilities
              </p>
              <h3 className="text-2xl sm:text-3xl font-medium text-[#0c0a09] tracking-tight leading-snug">
                Why governments and institutions partner with Rudra.
              </h3>
              <p className="text-sm sm:text-base text-[#57534e] leading-relaxed">
                We establish enduring partnerships with government agencies, development authorities, and private clients through statutory adherence, direct communication, and contractual discipline.
              </p>
              <div className="p-4 rounded-[14px] bg-[#fafafa] border border-[#e7e5e4] text-xs sm:text-sm text-[#0c0a09] space-y-1">
                <span className="font-semibold text-[#1c1917] block">Contractual Transparency:</span>
                <p className="text-[#57534e] leading-relaxed">
                  Direct access to designated project directors, transparent stage billing, and NABL test certifications on demand.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whyChooseUsStrengths.map((strength, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3.5 rounded-[12px] bg-[#fafafa] border border-[#e7e5e4] text-sm text-[#0c0a09]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                    <span className="leading-normal">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
