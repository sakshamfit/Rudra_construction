import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustMetrics } from './components/TrustMetrics';
import { CompanyOverview } from './components/CompanyOverview';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsPortfolio } from './components/ProjectsPortfolio';
import { IndiaPresenceMap } from './components/IndiaPresenceMap';
import { QualitySafetyCompliance } from './components/QualitySafetyCompliance';
import { ProjectEstimator } from './components/ProjectEstimator';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BrochureModal } from './components/BrochureModal';
import { SeoRuntime } from './components/SeoRuntime';
import { CmsProvider } from './cms/CmsProvider';

export default function App() {
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isEstimatorModalOpen, setIsEstimatorModalOpen] = useState(false);

  return (
    <CmsProvider>
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-[#0c0a09] relative selection:bg-[#a7e5d3] selection:text-[#0c0a09]" itemScope itemType="https://schema.org/WebPage">
      <SeoRuntime />
      {/* Navigation Header */}
      <Navbar
        onOpenEstimator={() => setIsEstimatorModalOpen(true)}
        onOpenBrochure={() => setIsBrochureOpen(true)}
      />

      <main id="main-content" className="flex-grow relative z-10" itemProp="mainContentOfPage">
        {/* 1. Hero Section */}
        <Hero
          onOpenEstimator={() => setIsEstimatorModalOpen(true)}
          onOpenBrochure={() => setIsBrochureOpen(true)}
        />

        {/* 2. Key Trust Metrics & Certifications */}
        <TrustMetrics />

        {/* 3. Core Civil, Solar & Material Services */}
        <ServicesSection />

        {/* 4. Landmark Projects Portfolio */}
        <ProjectsPortfolio />

        {/* 5. Pan-India Presence — Real Geographic Map with all project locations */}
        <IndiaPresenceMap />

        {/* 6. Quality, Safety & Statutory Compliance */}
        <QualitySafetyCompliance />

        {/* 7. Company Background & Mission */}
        <CompanyOverview />

        {/* 8. RFP / Tender Procurement & Contact Desk */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenBrochure={() => setIsBrochureOpen(true)}
        onOpenEstimator={() => setIsEstimatorModalOpen(true)}
      />

      {/* Company Brochure Prospectus Modal (Printable) */}
      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
      />

      {/* Standalone Estimator Modal (On Demand Only) */}
      <ProjectEstimator
        isModal={true}
        isOpen={isEstimatorModalOpen}
        onClose={() => setIsEstimatorModalOpen(false)}
      />
    </div>
    </CmsProvider>
  );
}
