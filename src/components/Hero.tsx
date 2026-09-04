import React from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  FileText,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Building2,
  Award,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import heroImg from '../assets/images/rudra_hero_construction_1788465374495.jpg';

interface HeroProps {
  onOpenEstimator: () => void;
  onOpenBrochure: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEstimator, onOpenBrochure }) => {
  return (
    <section className="relative overflow-hidden bg-[#f5f5f5] text-[#0c0a09] pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-[#e7e5e4]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Centered Hero Stack */}
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          
          {/* Hero Display Headline with Natural Line Spacing and Refined Typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-normal text-[#0c0a09] tracking-tight leading-[1.18] sm:leading-[1.15]">
            Building India’s infrastructure with <span className="font-medium text-[#1c1917] underline decoration-[#a7e5d3] decoration-2 underline-offset-8">absolute precision</span>.
          </h1>

          {/* Lead Subtitle with Clean Line Spacing & Balanced Tracking */}
          <p className="text-base sm:text-lg lg:text-[19px] text-[#57534e] leading-relaxed max-w-3xl mx-auto font-normal">
            Class-A civil engineering, institutional complexes, rooftop solar microgrids, and certified bulk material logistics across 11 states. Audited turnover of <strong className="font-semibold text-[#1c1917]">{COMPANY_INFO.totalTurnover}</strong>.
          </p>

          {/* Action CTAs: Ink Primary Pill (#292524) + Outline Pill + Text Link */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#contact"
              className="apple-btn-active inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#292524] hover:bg-[#0c0a09] text-white text-[15px] font-medium shadow-sm transition-all"
            >
              <span>Request Project Proposal</span>
              <ChevronRight className="w-4 h-4 text-[#a7e5d3]" />
            </a>

            <button
              onClick={onOpenEstimator}
              className="apple-btn-active inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#f0efed] border border-[#d6d3d1] text-[#292524] text-[15px] font-medium transition-all"
            >
              <span>CPWD DSR Cost Estimator</span>
            </button>

            <button
              onClick={onOpenBrochure}
              className="apple-btn-active inline-flex items-center gap-1.5 text-[14px] text-[#292524] hover:text-[#0c0a09] font-medium px-2 py-1 transition-all"
            >
              <FileText className="w-4 h-4 text-[#777169]" />
              <span className="underline underline-offset-4 decoration-[#d6d3d1]">View Official Prospectus</span>
            </button>
          </div>
        </div>

        {/* Real Civil Construction Showcase Visual Container */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto relative">
          
          <div className="relative rounded-[22px] sm:rounded-[28px] overflow-hidden apple-product-shadow-lg bg-[#ffffff] border border-[#e7e5e4]">
            
            {/* Real Civil Construction Photography */}
            <img
              src={heroImg}
              alt="Rudra Constructions - Civil Engineering & Infrastructure Precision"
              className="w-full h-[360px] sm:h-[480px] lg:h-[540px] object-cover object-center"
              referrerPolicy="no-referrer"
            />

            {/* Top-Left Grounded Location Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[12px] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#a7e5d3]" />
              <span>Panchayat Sarkar Bhawan Site, Bihar</span>
            </div>

            {/* Top-Right Grounded Statutory Enlistment Badge */}
            <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[12px] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#a7e5d3]" />
              <span>IS 456:2000 & CPWD Standard Assured</span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 bg-gradient-to-t from-black/85 via-black/45 to-transparent text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#a7e5d3]">
                  Government & Institutional Works • Class-A Execution
                </p>
                <p className="text-[16px] sm:text-[18px] font-normal text-white mt-0.5">
                  Administrative Bhawans, Hospital Inpatient Blocks & 2.4 MWp Clean Solar
                </p>
              </div>

              <div className="flex items-center gap-4 text-[13px] text-white/90">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#a7e5d3]" />
                  <span>GSTIN & Tax Audited</span>
                </span>
                <span className="text-white/40">•</span>
                <span className="text-[#f4c5a8] font-medium">11 Operational States</span>
              </div>
            </div>

          </div>

        </div>

        {/* Institutional Footnote */}
        <div className="mt-10 text-center text-[13px] text-[#777169] font-normal tracking-wide max-w-2xl mx-auto">
          Enlisted contractor for Department of Panchayati Raj, Building Construction Department & Bihar State Building Construction Corporation Ltd.
        </div>

      </div>
    </section>
  );
};
