import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, X } from 'lucide-react';
import { STATES_SERVED } from '../data/companyData';
import { useCms } from '../cms/CmsProvider';

interface ProjectEstimatorProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export const ProjectEstimator: React.FC<ProjectEstimatorProps> = ({ isOpen, onClose, isModal = false }) => {
  const [projectType, setProjectType] = useState<'civic' | 'healthcare' | 'commercial' | 'solar' | 'materials'>('civic');
  const [selectedState, setSelectedState] = useState<string>('Bihar');
  const [scaleValue, setScaleValue] = useState<number>(5000);
  const [qualityGrade, setQualityGrade] = useState<'standard' | 'premium' | 'high_spec'>('premium');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const { estimator } = useCms();

  const calculateEstimate = () => {
    const rates = estimator?.[projectType] || {
      standard: 1800,
      premium: 1950,
      high_spec: 2300,
      unit: 'sq.ft built-up area',
      material: 'Grade 53 Cement, Fe 550D TMT Steel, Graded Aggregates',
    };

    let ratePerUnit = 1800;
    let unitLabel = rates.unit || 'sq.ft built-up area';
    let timelineMonths = 6;
    let materialReqs = rates.material;

    if (projectType === 'civic') {
      ratePerUnit = qualityGrade === 'standard' ? rates.standard : qualityGrade === 'premium' ? rates.premium : rates.high_spec;
      timelineMonths = Math.max(4, Math.round(scaleValue / 900));
    } else if (projectType === 'healthcare') {
      ratePerUnit = qualityGrade === 'standard' ? rates.standard : qualityGrade === 'premium' ? rates.premium : rates.high_spec;
      timelineMonths = Math.max(3, Math.round(scaleValue / 1200));
    } else if (projectType === 'commercial') {
      ratePerUnit = qualityGrade === 'standard' ? rates.standard : qualityGrade === 'premium' ? rates.premium : rates.high_spec;
      timelineMonths = Math.max(6, Math.round(scaleValue / 700));
    } else if (projectType === 'solar') {
      ratePerUnit = qualityGrade === 'standard' ? rates.standard : qualityGrade === 'premium' ? rates.premium : rates.high_spec;
      timelineMonths = Math.max(1, Math.round(scaleValue / 100));
    } else if (projectType === 'materials') {
      ratePerUnit = rates.standard;
      unitLabel = rates.unit;
      timelineMonths = 1;
    }

    const totalCost = scaleValue * ratePerUnit;
    const totalInLakhs = (totalCost / 100000).toFixed(2);
    const totalInCrores = (totalCost / 10000000).toFixed(2);

    return {
      ratePerUnit,
      unitLabel,
      timelineMonths,
      totalCost,
      totalInLakhs,
      totalInCrores,
      materialReqs,
    };
  };

  const estimate = calculateEstimate();

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const content = (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[14px] text-[#7a7a7a] tracking-[-0.224px]">Statutory Estimation Tool — Admin Editable Rates</p>
          <h2 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-tight mt-1">
            Calculate budget & schedule estimates.
          </h2>
          <p className="text-[15px] text-[#7a7a7a] mt-1">
            Rates are managed from Admin Panel → Estimator. CPWD DSR 2023-25 benchmark, updated for Indian market.
          </p>
        </div>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#7a7a7a] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a] mb-2.5">
              1. Select Project Vertical:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'civic', label: 'Civic & Govt' },
                { id: 'healthcare', label: 'Healthcare' },
                { id: 'commercial', label: 'Commercial' },
                { id: 'solar', label: 'Solar' },
                { id: 'materials', label: 'Bulk Supply' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setProjectType(type.id as any);
                    if (type.id === 'solar') setScaleValue(50);
                    else if (type.id === 'materials') setScaleValue(100);
                    else setScaleValue(5000);
                  }}
                  className={`apple-btn-active px-4 py-2 rounded-full text-[13px] transition-all cursor-pointer ${
                    projectType === type.id
                      ? 'bg-[#1d1d1f] text-white font-medium shadow-xs'
                      : 'bg-[#fafafc] hover:bg-[#f0f0f0] text-[#1d1d1f] border border-[#e0e0e0]'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a]">
                2. Scale ({projectType === 'solar' ? 'Poles / kW' : projectType === 'materials' ? 'Metric Tonnes' : 'Sq.Ft Built-Up'}):
              </label>
              <span className="text-[14px] font-semibold text-[#0066cc] bg-[#f5f5f7] px-3 py-1 rounded-full border border-[#e0e0e0]">
                {scaleValue.toLocaleString()} {projectType === 'solar' ? 'Units' : projectType === 'materials' ? 'MT' : 'Sq.Ft'}
              </span>
            </div>

            <input
              type="range"
              min={projectType === 'solar' ? 10 : projectType === 'materials' ? 20 : 1000}
              max={projectType === 'solar' ? 500 : projectType === 'materials' ? 2000 : 50000}
              step={projectType === 'solar' ? 10 : projectType === 'materials' ? 10 : 500}
              value={scaleValue}
              onChange={(e) => setScaleValue(Number(e.target.value))}
              className="w-full h-1.5 bg-[#e0e0e0] rounded-lg appearance-none cursor-pointer accent-[#0066cc]"
            />
            <div className="flex justify-between text-[11px] text-[#7a7a7a] mt-1 font-mono">
              <span>{projectType === 'solar' ? '10 Units' : projectType === 'materials' ? '20 MT' : '1,000 sq.ft'}</span>
              <span>{projectType === 'solar' ? '500 Units' : projectType === 'materials' ? '2,000 MT' : '50,000 sq.ft'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a] mb-1.5">
                3. Deployment State:
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-2.5 rounded-[12px] border border-[#e0e0e0] text-[13px] bg-[#fafafc] text-[#1d1d1f] focus:ring-1 focus:ring-[#0066cc] focus:outline-none"
              >
                {STATES_SERVED.map((st) => (
                  <option key={st.id} value={st.name}>
                    {st.name} ({st.region})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a] mb-1.5">
                4. Specification Grade:
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as any)}
                className="w-full p-2.5 rounded-[12px] border border-[#e0e0e0] text-[13px] bg-[#fafafc] text-[#1d1d1f] focus:ring-1 focus:ring-[#0066cc] focus:outline-none"
              >
                <option value="standard">Standard PWD / Tender Spec</option>
                <option value="premium">Premium Institutional Grade</option>
                <option value="high_spec">High-Spec Earthquake Resilient</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#272729] text-white p-6 sm:p-7 rounded-[18px] border border-[#333336] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[12px] font-semibold text-[#2997ff] uppercase tracking-wider">Estimated Project Budget</span>
              <span className="text-[11px] text-[#cccccc]">Indian DSR</span>
            </div>

            <div>
              <div className="text-[28px] sm:text-[34px] font-semibold text-white tracking-tight">
                {Number(estimate.totalInCrores) >= 1 ? `₹${estimate.totalInCrores} Crore` : `₹${estimate.totalInLakhs} Lakhs`}
              </div>
              <div className="text-[13px] text-[#cccccc] mt-0.5">
                Approx. ₹{estimate.ratePerUnit.toLocaleString()} per {estimate.unitLabel}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-white/5 p-3 rounded-[12px] border border-white/10">
                <span className="text-[11px] text-[#cccccc] block">Duration</span>
                <span className="text-[16px] font-semibold text-[#2997ff]">~{estimate.timelineMonths} Months</span>
              </div>
              <div className="bg-white/5 p-3 rounded-[12px] border border-white/10">
                <span className="text-[11px] text-[#cccccc] block">Lead Time</span>
                <span className="text-[16px] font-semibold text-white">48–72 Hrs</span>
              </div>
            </div>

            <div className="text-[13px] text-[#cccccc] bg-white/5 p-3 rounded-[12px] border border-white/10 space-y-1">
              <span className="text-white block font-medium">Standard Material Conformance:</span>
              <p className="text-[12px] text-[#cccccc] leading-relaxed">{estimate.materialReqs}</p>
            </div>
          </div>

          {!formSubmitted ? (
            <form onSubmit={handleSubmitInquiry} className="space-y-3 pt-4 border-t border-white/10">
              <div className="text-[12px] font-semibold text-[#2997ff] uppercase tracking-wider">Request Itemized BOQ Schedule:</div>
              <input
                type="text"
                required
                placeholder="Full Name / Authority"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2.5 rounded-[12px] bg-white/10 border border-white/15 text-[13px] text-white placeholder:text-[#888888] focus:outline-none focus:border-[#2997ff]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-[12px] bg-white/10 border border-white/15 text-[13px] text-white placeholder:text-[#888888] focus:outline-none focus:border-[#2997ff]"
                />
                <input
                  type="email"
                  required
                  placeholder="Official Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full p-2.5 rounded-[12px] bg-white/10 border border-white/15 text-[13px] text-white placeholder:text-[#888888] focus:outline-none focus:border-[#2997ff]"
                />
              </div>
              <button
                type="submit"
                className="apple-btn-active w-full py-2.5 px-4 bg-[#0066cc] hover:bg-[#0077ed] text-white font-normal text-[14px] rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Submit for Official Review</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="bg-white/10 border border-white/15 p-4 rounded-[14px] text-center space-y-2">
              <CheckCircle2 className="w-7 h-7 text-[#2997ff] mx-auto" />
              <div className="text-[15px] font-semibold text-white">Estimation Request Received</div>
              <p className="text-[13px] text-[#cccccc]">
                Our resident engineer for {selectedState} will review your requirements ({scaleValue} {estimate.unitLabel}) and send a formal schedule.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-[#ffffff] rounded-[24px] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 border border-[#e0e0e0]">{content}</div>
      </div>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-[#f5f5f7] border-b border-[#e0e0e0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#ffffff] p-6 sm:p-10 rounded-[20px] border border-[#e0e0e0]">{content}</div>
      </div>
    </section>
  );
};
