import React from 'react';
import { motion } from 'motion/react';
import { Award, Globe2, Briefcase, Sun, Users2, ShieldCheck } from 'lucide-react';

export const TrustMetrics: React.FC = () => {
  const metrics = [
    {
      label: "Audited Turnover",
      value: "₹14.65 Cr",
      detail: "Civil & Solar Works",
      tag: "FY 2024-25",
    },
    {
      label: "States Served",
      value: "11 States",
      detail: "Pan-India Footprint",
      tag: "18+ Depots",
    },
    {
      label: "Institutional Assets",
      value: "35+ Sites",
      detail: "Completed & Active",
      tag: "Handed Over",
    },
    {
      label: "Clean Solar Units",
      value: "1,200+",
      detail: "Installed Capacities",
      tag: "Microgrids",
    },
    {
      label: "Field Workforce",
      value: "250+",
      detail: "Engineers & Crews",
      tag: "Biometric Verified",
    },
    {
      label: "Statutory Compliance",
      value: "100%",
      detail: "NABL & IS 456 Standards",
      tag: "Zero Deviation",
    }
  ];

  return (
    <section className="bg-[#fafafa] border-b border-[#e7e5e4] py-10 sm:py-14 relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e7e5e4]">
          {metrics.map((m, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`flex flex-col items-center text-center pt-4 sm:pt-0 ${
                index !== 0 ? 'sm:pl-4' : ''
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#777169] bg-[#f0efed] px-2 py-0.5 rounded-full border border-[#e7e5e4]">
                  {m.tag}
                </span>
              </div>

              <span className="text-[28px] sm:text-[34px] font-light text-[#0c0a09] tracking-[-0.025em] leading-none">
                {m.value}
              </span>

              <span className="text-[14px] font-medium text-[#292524] mt-2 tracking-[0.01em]">
                {m.label}
              </span>

              <span className="text-[12px] text-[#777169] mt-0.5 tracking-[0.01em]">
                {m.detail}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
