import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Lock,
  AlertCircle
} from 'lucide-react';
import { COMPANY_INFO, FAQS } from '../data/companyData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    phone: '',
    email: '',
    projectType: 'Civic / Government Administrative',
    projectLocation: 'Bihar',
    estimatedBudget: '₹25 Lakhs - ₹1 Crore',
    message: '',
    botField: ''
  });
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityNum1] = useState(7);
  const [securityNum2] = useState(5);
  const [securityError, setSecurityError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submissionRef, setSubmissionRef] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    setPhoneError('');
    setEmailError('');

    // 1. Honeypot check: reject bot submissions
    if (formData.botField) {
      return;
    }

    // 2. Phone Security Check (10-digit Indian Mobile)
    const cleanedPhone = formData.phone.replace(/[\s\-()+]/g, '');
    const indianPhoneRegex = /^(91)?[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleanedPhone)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    // 3. Email Security Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // 4. Human Verification Math Challenge Check
    if (parseInt(securityAnswer.trim(), 10) !== securityNum1 + securityNum2) {
      setSecurityError(`Security Check Failed: What is ${securityNum1} + ${securityNum2}? Please enter the correct number.`);
      return;
    }

    // Generate formal audit reference ID
    const refId = `RC-RFP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmissionRef(refId);
    setSubmitted(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-[#ffffff] border-b border-[#e0e0e0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium">
            Engineering Consultation
          </p>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight leading-snug">
            Initiate a project or tender RFP.
          </h2>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed font-normal">
            Connect with our technical bidding management and engineering teams for turnkey contracts or bulk supplies.
          </p>
        </div>

        {/* Contact Layout: Left Info & Hotline, Right RFP Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Left Column: Direct Communication Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Registered Office Banner Card */}
            <div className="bg-[#292524] text-white rounded-[20px] p-7 border border-[#3e3835] space-y-6">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#a7e5d3] uppercase tracking-wider">Corporate Headquarters</span>
                <h3 className="text-xl font-medium text-white tracking-tight">
                  Rudra Constructions & Suppliers
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed">
                  Engineering Trust. Constructing Excellence.
                </p>
              </div>

              <div className="space-y-4 text-[13px] text-[#cccccc]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#2997ff] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block text-white">Registered Office:</span>
                    <span>Ward No.2, Sikta Belwa, Ramnagar, West Champaran, Bihar 845103</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#2997ff] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block text-white">Tender Hotline:</span>
                    <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-[#2997ff] font-medium text-[14px] text-white">
                      {COMPANY_INFO.phoneFormatted}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#2997ff] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block text-white">Official Communications:</span>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-[#2997ff] text-[#cccccc]">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#2997ff] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium block text-white">Working Hours:</span>
                    <span>{COMPANY_INFO.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Quick Connect */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/918099588978?text=${encodeURIComponent(
                    "Hello Rudra Constructions, I would like to inquire about a project / tender."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-btn-active w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#25d366] hover:bg-[#20ba59] text-white text-[13px] font-medium transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp (+91 80995 88978)</span>
                </a>
              </div>
            </div>

            {/* Regional Hubs Quick Reference */}
            <div className="bg-[#fafafc] rounded-[18px] p-6 border border-[#e0e0e0] space-y-3">
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#7a7a7a]">
                Key Operating Hubs:
              </h4>
              <div className="space-y-2 text-[13px] text-[#1d1d1f]">
                <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#ffffff] border border-[#e0e0e0]">
                  <span className="font-medium text-[#1d1d1f]">Delhi NCR Hub:</span>
                  <span className="text-[#7a7a7a]">Aaditya Mall, Indirapuram</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#ffffff] border border-[#e0e0e0]">
                  <span className="font-medium text-[#1d1d1f]">Patna Branch:</span>
                  <span className="text-[#7a7a7a]">Shivpuri, Patna</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#ffffff] border border-[#e0e0e0]">
                  <span className="font-medium text-[#1d1d1f]">Assam Regional:</span>
                  <span className="text-[#7a7a7a]">Biswanath & Jorhat Hubs</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Formal RFP & Tender Inquiry Form */}
          <div className="lg:col-span-7 bg-[#ffffff] rounded-[20px] p-7 sm:p-9 border border-[#e0e0e0]">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-[22px] font-semibold text-[#1d1d1f] tracking-tight">
                    Submit Project RFP or Procurement Query
                  </h3>
                  <p className="text-[13px] text-[#7a7a7a]">
                    Our technical bid management and engineering team reviews all incoming requirements within 24 hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Er. Rajiv Verma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-[12px] border border-[#e0e0e0] text-[13px] bg-[#fafafc] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a] mb-1.5">
                      Organization / Authority
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Panchayati Raj / PWD / Foundation"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full p-2.5 rounded-[12px] border border-[#e0e0e0] text-[13px] bg-[#fafafc] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                    />
                  </div>
                </div>

                {/* Honeypot Bot Trap Field (Hidden from real users) */}
                <input
                  type="text"
                  name="bot_field_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.botField}
                  onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
                  style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a] mb-1.5">
                      Phone Number * (Indian 10-digit)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210 or +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (phoneError) setPhoneError('');
                      }}
                      className={`w-full p-2.5 rounded-[12px] border text-[13px] bg-[#fafafc] text-[#1d1d1f] focus:outline-none ${
                        phoneError ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-[#e0e0e0] focus:border-[#0066cc]'
                      }`}
                    />
                    {phoneError && (
                      <p className="text-[11px] text-[#dc2626] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{phoneError}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@organization.gov.in"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (emailError) setEmailError('');
                      }}
                      className={`w-full p-2.5 rounded-[12px] border text-[13px] bg-[#fafafc] text-[#1d1d1f] focus:outline-none ${
                        emailError ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-[#e0e0e0] focus:border-[#0066cc]'
                      }`}
                    />
                    {emailError && (
                      <p className="text-[11px] text-[#dc2626] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{emailError}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a] mb-1.5">
                      Project Vertical
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full p-2.5 rounded-[12px] border border-[#e0e0e0] text-[13px] bg-[#fafafc] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                    >
                      <option>Civic / Government Administrative</option>
                      <option>Hospital & Healthcare Inpatient</option>
                      <option>Commercial & Residential</option>
                      <option>Solar Electrification & Streetlights</option>
                      <option>Roads & Drainage Infrastructure</option>
                      <option>Certified Material Supply (TMT/Cement)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a] mb-1.5">
                      Project State
                    </label>
                    <select
                      value={formData.projectLocation}
                      onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                      className="w-full p-2.5 rounded-[12px] border border-[#e0e0e0] text-[13px] bg-[#fafafc] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                    >
                      <option>Bihar</option>
                      <option>Uttar Pradesh (Delhi NCR)</option>
                      <option>Jharkhand</option>
                      <option>Odisha</option>
                      <option>Assam</option>
                      <option>Meghalaya</option>
                      <option>Tripura</option>
                      <option>Arunachal Pradesh</option>
                      <option>Haryana</option>
                      <option>Punjab</option>
                      <option>Jammu & Kashmir</option>
                      <option>Other Region</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a] mb-1.5">
                      Budget Range
                    </label>
                    <select
                      value={formData.estimatedBudget}
                      onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                      className="w-full p-2.5 rounded-[12px] border border-[#e0e0e0] text-[13px] bg-[#fafafc] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                    >
                      <option>Under ₹25 Lakhs</option>
                      <option>₹25 Lakhs - ₹1 Crore</option>
                      <option>₹1 Crore - ₹5 Crores</option>
                      <option>₹5 Crores - ₹15 Crores+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#7a7a7a] mb-1.5">
                    Project Scope & Engineering Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide details regarding site location, timeline expectations, tender specs, or specific material quantities..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 rounded-[12px] border border-[#e0e0e0] text-[13px] bg-[#fafafc] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc]"
                  ></textarea>
                </div>

                {/* Security Check: Anti-Spam Human Verification */}
                <div className="p-3.5 rounded-[14px] bg-[#f5f5f7] border border-[#e0e0e0] space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#0066cc]" />
                      Security Check: Human Verification
                    </span>
                    <span className="text-[11px] text-[#7a7a7a]">Anti-bot verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-medium text-[#1d1d1f] bg-white px-3 py-1.5 rounded-[8px] border border-[#e0e0e0]">
                      What is {securityNum1} + {securityNum2} = ?
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="Answer"
                      value={securityAnswer}
                      onChange={(e) => {
                        setSecurityAnswer(e.target.value);
                        if (securityError) setSecurityError('');
                      }}
                      className="w-24 p-1.5 rounded-[8px] border border-[#e0e0e0] text-[13px] bg-white text-[#1d1d1f] text-center focus:outline-none focus:border-[#0066cc]"
                    />
                  </div>
                  {securityError && (
                    <p className="text-[11px] text-[#dc2626] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{securityError}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="apple-btn-active w-full py-3 px-6 rounded-full bg-[#0066cc] hover:bg-[#0077ed] text-white font-normal text-[15px] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Verify Security & Submit RFP Inquiry</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[12px] text-[#7a7a7a] text-center">
                  Confidentiality assured under statutory procurement and non-disclosure standards.
                </p>
              </form>
            ) : (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#059669]/10 text-[#059669] mx-auto flex items-center justify-center border border-[#059669]/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-[12px] font-semibold text-[#059669] uppercase tracking-wider">
                    Security Verification: Passed
                  </span>
                  <h3 className="text-[24px] font-semibold text-[#1d1d1f]">
                    Thank You, {formData.name || 'Partner'}!
                  </h3>
                  <p className="text-[14px] text-[#7a7a7a] max-w-md mx-auto">
                    Your project RFP for <strong>{formData.projectType}</strong> in <strong>{formData.projectLocation}</strong> has been logged into our tender review queue.
                  </p>
                </div>

                <div className="p-4 bg-[#fafafc] border border-[#e0e0e0] rounded-[14px] text-[12px] text-[#1d1d1f] max-w-sm mx-auto space-y-1.5 text-left">
                  <div className="flex justify-between">
                    <span className="text-[#7a7a7a]">Dossier Ref:</span>
                    <span className="font-mono font-semibold text-[#0066cc]">{submissionRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7a7a]">Registered Phone:</span>
                    <span className="font-mono">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7a7a]">Official Email:</span>
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#e0e0e0] pt-1.5">
                    <span className="text-[#7a7a7a]">Response SLA:</span>
                    <span className="font-semibold text-[#059669]">Within 24 business hours</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSecurityAnswer('');
                    }}
                    className="text-[13px] text-[#0066cc] hover:underline cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Frequently Asked Questions Section (Schema.org FAQPage Microdata & Anchor) */}
        <div id="faq" itemScope itemType="https://schema.org/FAQPage" className="max-w-3xl mx-auto space-y-6 pt-10 border-t border-[#e7e5e4]">
          <div className="text-center space-y-2 mb-8">
            <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium">
              Statutory &amp; Tender Inquiries
            </p>
            <h3 className="text-2xl sm:text-3xl font-normal text-[#0c0a09] tracking-tight leading-snug">
              Frequently asked questions.
            </h3>
            <p className="text-sm sm:text-base text-[#57534e] leading-relaxed">
              Clear answers regarding our credentials, procurement procedures, and field standards.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  className="bg-[#ffffff] rounded-[16px] border border-[#e7e5e4] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#fafafa] transition-colors"
                  >
                    <span itemProp="name" className="text-base font-medium text-[#0c0a09] tracking-tight">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#292524] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#78716c] flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                      className="px-5 pb-5 text-sm text-[#57534e] leading-relaxed border-t border-[#f5f5f5] pt-3"
                    >
                      <div itemProp="text">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
