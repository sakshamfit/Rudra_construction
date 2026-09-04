import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustMetrics } from './components/TrustMetrics';
import { CompanyOverview } from './components/CompanyOverview';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsPortfolio } from './components/ProjectsPortfolio';
import { MethodologySection } from './components/MethodologySection';
import { QualitySafetyCompliance } from './components/QualitySafetyCompliance';
import { IndiaPresenceMap } from './components/IndiaPresenceMap';
import { ClientsSection } from './components/ClientsSection';
import { ProjectEstimator } from './components/ProjectEstimator';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BrochureModal } from './components/BrochureModal';

export default function App() {
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isEstimatorModalOpen, setIsEstimatorModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-[#0c0a09] relative selection:bg-[#a7e5d3] selection:text-[#0c0a09]">
      {/* Navigation Header */}
      <Navbar
        onOpenEstimator={() => setIsEstimatorModalOpen(true)}
        onOpenBrochure={() => setIsBrochureOpen(true)}
      />

      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <Hero
          onOpenEstimator={() => setIsEstimatorModalOpen(true)}
          onOpenBrochure={() => setIsBrochureOpen(true)}
        />

        {/* Live Trust Metrics Strip */}
        <TrustMetrics />

        {/* Company Overview, Mission, Vision & Core Values */}
        <CompanyOverview />

        {/* 6 Core Verticals & Capabilities */}
        <ServicesSection />

        {/* Landmark Projects & Portfolio */}
        <ProjectsPortfolio />

        {/* 5-Stage Execution Methodology */}
        <MethodologySection />

        {/* Quality, Safety & Statutory Compliance */}
        <QualitySafetyCompliance />

        {/* Exciting Clients & Government Partners */}
        <ClientsSection />

        {/* Real Pan-India Interactive Geographic Map with Work Sites & Security Clearances */}
        <IndiaPresenceMap />

        {/* In-Page Interactive Project Estimator & BOQ Engine */}
        <div id="estimator-section">
          <ProjectEstimator />
        </div>

        {/* Tender RFP & Contact Section + FAQs */}
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

      {/* Standalone Estimator Modal */}
      <ProjectEstimator
        isModal={true}
        isOpen={isEstimatorModalOpen}
        onClose={() => setIsEstimatorModalOpen(false)}
      />
    </div>
  );
}
