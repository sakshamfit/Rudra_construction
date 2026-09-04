import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Clock, FileCheck } from 'lucide-react';
import { EXECUTION_METHODOLOGY } from '../data/companyData';

export const MethodologySection: React.FC = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const activeStep = EXECUTION_METHODOLOGY[selectedStepIndex];

  return (
    <section id="methodology" className="py-20 sm:py-24 bg-[#ffffff] border-b border-[#e0e0e0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium">
            Engineering Protocol
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight leading-snug">
            5-stage project execution lifecycle.
          </h2>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed font-normal">
            A linear, verifiable engineering workflow ensuring quality gates, statutory approvals, and timely commissioning.
          </p>
        </div>

        {/* 5-Step Process Horizontal Stepper */}
        <div className="flex justify-center mb-10 overflow-x-auto py-2">
          <div className="inline-flex bg-[#f5f5f7] p-1 rounded-full border border-[#e0e0e0] max-w-full">
            {EXECUTION_METHODOLOGY.map((step, idx) => {
              const isCurrent = idx === selectedStepIndex;
              return (
                <button
                  key={step.stepNumber}
                  onClick={() => setSelectedStepIndex(idx)}
                  className={`apple-btn-active px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-2 ${
                    isCurrent
                      ? 'bg-[#ffffff] text-[#0c0a09] font-medium shadow-sm'
                      : 'text-[#78716c] hover:text-[#0c0a09] font-normal'
                  }`}
                >
                  <span className="text-xs opacity-70 font-mono">0{idx + 1}</span>
                  <span>{step.title.split(' ')[0]} {step.title.split(' ')[1] || ''}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Breakdown Panel */}
        <div className="bg-[#fafafa] border border-[#e7e5e4] rounded-[20px] p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-[#292524] uppercase tracking-wider font-semibold">
                  <span>Stage {activeStep.stepNumber} of 05</span>
                  <span className="text-[#d6d3d1]">•</span>
                  <span className="text-[#78716c] font-normal flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Target: {activeStep.duration}
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-medium text-[#0c0a09] tracking-tight leading-snug">
                  {activeStep.title}
                </h3>
                <p className="text-sm font-medium text-[#292524]">
                  {activeStep.tagline}
                </p>
                <p className="text-base sm:text-[17px] text-[#57534e] leading-relaxed font-normal pt-1">
                  {activeStep.description}
                </p>
              </div>

              {/* Deliverables Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1c1917] flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#292524]" />
                  <span>Key Technical Deliverables & Milestones</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeStep.deliverables.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2.5 p-3 rounded-[12px] bg-[#ffffff] border border-[#e7e5e4] text-sm text-[#292524] leading-normal"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Standards Employed */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#78716c]">Standards Applied:</span>
                {activeStep.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#ffffff] border border-[#e7e5e4] text-[#292524] text-xs font-normal"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Side Visual Workflow Card */}
            <div className="lg:col-span-5 bg-[#292524] text-white p-7 sm:p-8 rounded-[18px] space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#a7e5d3] uppercase tracking-wider">Quality Gate Checkpoint</span>
                <h4 className="text-xl font-medium text-white tracking-tight">
                  Zero Deviation Handover Policy
                </h4>
                <p className="text-sm text-stone-300 leading-relaxed">
                  Stage {activeStep.stepNumber} requires mandatory cross-signoff by Resident Structural Engineers and NABL Quality Officers before subsequent operations proceed.
                </p>
              </div>

              <div className="p-4 rounded-[14px] bg-white/5 border border-white/10 space-y-2.5 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#cccccc]">Statutory Clearances</span>
                  <span className="text-[#2997ff] font-semibold">100% Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#cccccc]">Material Testing</span>
                  <span className="text-white font-semibold">NABL Accredited</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#cccccc]">Site PPE & EHS</span>
                  <span className="text-white font-semibold">Zero Compromise</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedStepIndex((prev) => (prev + 1) % EXECUTION_METHODOLOGY.length)}
                  className="apple-btn-active w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-[14px] font-normal cursor-pointer"
                >
                  <span>Next: Step {EXECUTION_METHODOLOGY[(selectedStepIndex + 1) % EXECUTION_METHODOLOGY.length].stepNumber}</span>
                  <ChevronRight className="w-4 h-4 text-[#2997ff]" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
