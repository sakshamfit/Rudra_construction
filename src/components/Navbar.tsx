import React, { useState } from 'react';
import { Phone, Mail, Menu, X, FileText, ChevronRight, Activity, Lock } from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface NavbarProps {
  onOpenEstimator: () => void;
  onOpenBrochure: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEstimator, onOpenBrochure }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Services', href: '/#services' },
    { name: 'Projects', href: '/#portfolio' },
    { name: 'About', href: '/#overview' },
    { name: 'Standards', href: '/#quality' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f5f5f5]/90 backdrop-blur-md border-b border-[#e7e5e4]">
      <div className="max-w-[1440px] w-full mx-auto h-[64px] flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <a href="/" className="flex items-center gap-2.5 text-[#0c0a09] hover:opacity-85 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[#292524] text-white flex items-center justify-center font-serif text-sm font-light">
            RC
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-[19px] font-medium tracking-tight text-[#0c0a09]">
              Rudra Constructions
            </span>
            <span className="hidden sm:inline-block text-[11px] text-[#78716c] uppercase tracking-wider font-mono">
              & Suppliers
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation links with natural spacing */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Primary" itemScope itemType="https://schema.org/SiteNavigationElement">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[14px] text-[#57534e] hover:text-[#0c0a09] transition-colors font-normal"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Hotline, Admin, Prospectus & Estimator CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="hidden xl:flex items-center gap-1.5 text-xs text-[#78716c] hover:text-[#0c0a09] font-mono mr-2 transition-colors"
          >
            <Phone className="w-3 h-3 text-[#16a34a]" />
            <span>{COMPANY_INFO.phoneFormatted}</span>
          </a>

          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#78716c] hover:text-[#0c0a09] px-3 py-1.5 rounded-full border border-transparent hover:border-[#d6d3d1] transition-all"
            title="Admin Console"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin</span>
          </a>

          <button
            onClick={onOpenBrochure}
            className="apple-btn-active inline-flex items-center gap-1.5 text-[13px] font-medium text-[#292524] bg-white hover:bg-[#f0efed] border border-[#d6d3d1] px-3.5 py-1.5 rounded-full cursor-pointer transition-all"
            title="Official PDF Prospectus"
          >
            <FileText className="w-3.5 h-3.5 text-[#78716c]" />
            <span>Prospectus</span>
          </button>

          <button
            onClick={onOpenEstimator}
            className="apple-btn-active inline-flex items-center gap-1.5 text-[13px] text-white bg-[#292524] hover:bg-[#0c0a09] px-4 py-1.5 rounded-full font-medium cursor-pointer shadow-sm transition-all"
          >
            <span>Estimate</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#a7e5d3]" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#0c0a09] hover:text-[#292524] rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f5f5f5]/98 backdrop-blur-xl border-b border-[#e7e5e4] px-5 py-5 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] text-[#292524] hover:text-[#0c0a09] py-1.5 border-b border-[#e7e5e4]"
              >
                {link.name}
              </a>
            ))}
            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] text-[#292524] hover:text-[#0c0a09] py-1.5 border-b border-[#e7e5e4] flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#78716c]" />
              <span>Admin Console</span>
            </a>
            <div className="pt-3 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEstimator();
                }}
                className="apple-btn-active w-full py-2.5 px-4 rounded-full bg-[#292524] text-white text-[14px] font-medium text-center flex items-center justify-center gap-1"
              >
                <span>Interactive Cost Estimator</span>
                <ChevronRight className="w-4 h-4 text-[#a7e5d3]" />
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBrochure();
                }}
                className="apple-btn-active w-full py-2.5 px-4 rounded-full bg-white border border-[#d6d3d1] text-[#292524] text-[14px] text-center flex items-center justify-center gap-1.5 font-medium"
              >
                <FileText className="w-4 h-4 text-[#777169]" />
                <span>Download Prospectus (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
