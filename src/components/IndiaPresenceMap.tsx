import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Building2,
  Sun,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Search,
  FileCheck2,
  Award,
  Lock,
  ExternalLink,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import {
  WORK_SITES_ON_MAP,
  STATES_SERVED,
  COMPANY_INFO,
  STATUTORY_SECURITY_CLEARANCES
} from '../data/companyData';
import { WorkSiteLocation } from '../types';

export const IndiaPresenceMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSite, setActiveSite] = useState<WorkSiteLocation>(WORK_SITES_ON_MAP[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);

  // Filter sites based on category and search
  const filteredSites = WORK_SITES_ON_MAP.filter((site) => {
    const matchesCategory = selectedCategory === 'all' || site.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [23.5, 82.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 15,
        scrollWheelZoom: false, // Prevents unintended scroll capture
        attributionControl: true,
      });

      // CartoDB Positron / OSM clean tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Ensure proper dimension rendering on initial layout
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map markers when filteredSites or activeSite changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const categoryColors: Record<string, { bg: string; ring: string }> = {
      civic: { bg: '#0066cc', ring: '#2997ff' },
      solar: { bg: '#059669', ring: '#34d399' },
      healthcare: { bg: '#dc2626', ring: '#f87171' },
      infrastructure: { bg: '#7c3aed', ring: '#a78bfa' },
      materials: { bg: '#d97706', ring: '#fbbf24' },
      office: { bg: '#1d1d1f', ring: '#2997ff' },
    };

    filteredSites.forEach((site) => {
      const color = categoryColors[site.category] || { bg: '#0066cc', ring: '#2997ff' };
      const isSelected = activeSite?.id === site.id;
      const isUnderExecution = site.status === 'Under Execution';

      const customIcon = L.divIcon({
        className: 'rudra-map-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; width: 34px; height: 34px;">
            ${
              isUnderExecution
                ? `<span style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background-color: ${color.ring}; opacity: 0.5; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
                : ''
            }
            <div style="width: ${isSelected ? '28px' : '22px'}; height: ${
              isSelected ? '28px' : '22px'
            }; border-radius: 9999px; background-color: ${color.bg}; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
              <span style="width: ${isSelected ? '8px' : '6px'}; height: ${
                isSelected ? '8px' : '6px'
              }; border-radius: 9999px; background-color: #ffffff;"></span>
            </div>
            <div style="position: absolute; bottom: -20px; white-space: nowrap; background-color: ${
              isSelected ? '#000000' : 'rgba(29, 29, 31, 0.88)'
            }; color: #ffffff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); pointer-events: none; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
              ${site.city.split(',')[0]}
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker(site.coordinates, { icon: customIcon });

      // Leaflet Popup with Apple styling
      const popupContent = `
        <div style="width: 250px; font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;">
          <div style="position: relative; height: 110px; width: 100%; overflow: hidden; border-top-left-radius: 16px; border-top-right-radius: 16px;">
            <img src="${site.image}" alt="${site.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.75); color: #fff; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 9999px;">
              ${site.categoryLabel}
            </div>
            <div style="position: absolute; bottom: 8px; right: 8px; background: ${color.bg}; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 9999px;">
              ${site.status}
            </div>
          </div>
          <div style="padding: 12px; color: #ffffff;">
            <h4 style="font-size: 13px; font-weight: 600; margin: 0 0 4px 0; line-height: 1.25;">${site.title}</h4>
            <p style="font-size: 11px; color: #a1a1a6; margin: 0 0 6px 0;">📍 ${site.city}, ${site.state}</p>
            <p style="font-size: 11px; color: #2997ff; margin: 0 0 8px 0; font-weight: 500;">🏛️ ${site.client}</p>
            <div style="display: flex; justify-content: space-between; font-size: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;">
              <span style="color: #a1a1a6;">Metric: <b style="color: #fff;">${site.keyMetric || 'Certified'}</b></span>
              <span style="color: #a1a1a6;">Value: <b style="color: #fff;">${site.projectValue || 'Contracted'}</b></span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        maxWidth: 270,
        className: 'apple-map-popup',
      });

      marker.on('click', () => {
        handleSelectSite(site);
      });

      markersGroup.addLayer(marker);
    });
  }, [filteredSites, activeSite]);

  // Fly to region helper
  const flyToRegion = (coords: [number, number], zoomLevel: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, zoomLevel, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  };

  // Fly to specific site
  const handleSelectSite = (site: WorkSiteLocation) => {
    setActiveSite(site);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(site.coordinates, 9, {
        duration: 1.2,
      });
    }
  };

  return (
    <section id="presence" className="py-20 sm:py-24 bg-[#ffffff] border-b border-[#e0e0e0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f5] border border-[#e7e5e4] text-xs font-medium text-[#292524]">
            <span className="w-2 h-2 rounded-full bg-[#16a34a]"></span>
            <span>Real Geographic Indian Map • 18+ Field Deployments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight leading-snug">
            Where we build across India.
          </h2>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed font-normal">
            Real-time visual map of our delivered civic administration bhawans, modernized hospital wards, solar microgrids, and bulk material logistics depots.
          </p>
        </div>

        {/* Quick Region Navigation Bar & Category Filter */}
        <div className="space-y-3 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Worksites (18+)' },
                { id: 'civic', label: 'Civic Bhawans' },
                { id: 'healthcare', label: 'Hospital Wards' },
                { id: 'solar', label: 'Solar Electrification' },
                { id: 'infrastructure', label: 'Heavy Bridges & Drainage' },
                { id: 'materials', label: 'TMT & Cement Depots' },
                { id: 'office', label: 'Operational Hubs' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`apple-btn-active px-3 py-1.5 rounded-full text-[13px] font-normal transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                      : 'bg-[#fafafc] hover:bg-[#f5f5f7] text-[#1d1d1f] border-[#e0e0e0]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Regional Focus Jumpers */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[12px]">
              <span className="text-[#7a7a7a] font-medium mr-1 hidden sm:inline">Zoom to:</span>
              <button
                onClick={() => flyToRegion([23.5, 82.5], 5)}
                className="apple-btn-active px-2.5 py-1 rounded-[10px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border border-[#e0e0e0] flex items-center gap-1 cursor-pointer"
                title="Reset to All India View"
              >
                <RotateCcw className="w-3 h-3 text-[#0066cc]" />
                <span>All India</span>
              </button>
              <button
                onClick={() => flyToRegion([26.4, 85.0], 7)}
                className="apple-btn-active px-2.5 py-1 rounded-[10px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border border-[#e0e0e0] cursor-pointer"
              >
                Bihar HQ Hub
              </button>
              <button
                onClick={() => flyToRegion([27.2, 80.5], 7)}
                className="apple-btn-active px-2.5 py-1 rounded-[10px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border border-[#e0e0e0] cursor-pointer"
              >
                UP & NCR
              </button>
              <button
                onClick={() => flyToRegion([26.5, 93.5], 7)}
                className="apple-btn-active px-2.5 py-1 rounded-[10px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border border-[#e0e0e0] cursor-pointer"
              >
                Assam & NE
              </button>
              <button
                onClick={() => flyToRegion([22.5, 85.5], 7)}
                className="apple-btn-active px-2.5 py-1 rounded-[10px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border border-[#e0e0e0] cursor-pointer"
              >
                Jharkhand & Odisha
              </button>
              <button
                onClick={() => flyToRegion([34.0, 75.0], 7)}
                className="apple-btn-active px-2.5 py-1 rounded-[10px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border border-[#e0e0e0] cursor-pointer"
              >
                J&K
              </button>
            </div>

          </div>
        </div>

        {/* Real Interactive Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Map Canvas (Apple Rounded 20px with hairline border) */}
          <div className="lg:col-span-8 bg-[#f5f5f7] rounded-[24px] border border-[#e0e0e0] overflow-hidden shadow-sm flex flex-col relative min-h-[520px] sm:min-h-[620px]">
            
            {/* Map Top Bar Controls */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#e0e0e0] shadow-sm flex items-center gap-2 text-[12px] text-[#1d1d1f]">
                <MapPin className="w-3.5 h-3.5 text-[#0066cc]" />
                <span className="font-semibold">Showing {filteredSites.length} verified project locations</span>
              </div>

              <div className="pointer-events-auto flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city, district, client..."
                    className="w-44 sm:w-56 pl-8 pr-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#e0e0e0] text-[12px] text-[#1d1d1f] placeholder:text-[#7a7a7a] focus:outline-none focus:border-[#0066cc] shadow-sm"
                  />
                  <Search className="w-3.5 h-3.5 text-[#7a7a7a] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Real Leaflet Map Container */}
            <div ref={mapContainerRef} className="w-full h-full flex-grow min-h-[520px] sm:min-h-[620px] z-10" />

            {/* Map Bottom Legend */}
            <div className="bg-[#ffffff]/95 backdrop-blur-md border-t border-[#e0e0e0] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#7a7a7a] z-20">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0066cc]"></span>
                  <span className="text-[#1d1d1f] font-medium">Civic Bhawans</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
                  <span className="text-[#1d1d1f] font-medium">Solar Energy</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></span>
                  <span className="text-[#1d1d1f] font-medium">Hospital Wards</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></span>
                  <span className="text-[#1d1d1f] font-medium">Highways & Drainage</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1d1d1f]"></span>
                  <span className="text-[#1d1d1f] font-medium">Operating Hubs</span>
                </span>
              </div>
              <span className="text-[#7a7a7a]">
                Pan & pinch to zoom • Click pin to inspect project
              </span>
            </div>

          </div>

          {/* Right Column: Active Site Inspector */}
          <div className="lg:col-span-4 flex flex-col">
            
            {/* Active Site Detailed Card */}
            <div className="bg-[#292524] text-white rounded-[24px] p-6 border border-[#3e3835] shadow-sm flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-[#a7e5d3] uppercase tracking-wider">
                    Site Inspector • {activeSite.state}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    activeSite.status === 'Completed'
                      ? 'bg-[#059669]/20 text-[#34d399] border border-[#059669]/40'
                      : activeSite.status === 'Under Execution'
                      ? 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/40'
                      : 'bg-[#a7e5d3]/20 text-[#a7e5d3] border border-[#a7e5d3]/40'
                  }`}>
                    {activeSite.status}
                  </span>
                </div>

                {/* Site Photo & Category */}
                <div className="relative h-48 sm:h-52 rounded-[16px] overflow-hidden border border-white/10 mb-4">
                  <img
                    src={activeSite.image}
                    alt={activeSite.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-[12px] font-medium bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                      {activeSite.categoryLabel}
                    </span>
                    <span className="text-[12px] font-mono text-[#a7e5d3]">
                      {activeSite.completionYear}
                    </span>
                  </div>
                </div>

                {/* Title & Location */}
                <h3 className="text-lg sm:text-[19px] font-medium text-white leading-snug">
                  {activeSite.title}
                </h3>
                <p className="text-[13px] text-[#a8a29e] mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#a7e5d3] flex-shrink-0" />
                  <span>{activeSite.city}, {activeSite.state}</span>
                </p>

                {/* Authority & Scope */}
                <div className="mt-4 p-4 rounded-[16px] bg-white/5 border border-white/10 space-y-2.5 text-[13px]">
                  <div>
                    <span className="text-[11px] text-[#a8a29e] uppercase tracking-wider block">Contracting Client:</span>
                    <span className="text-white font-medium">{activeSite.client}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#a8a29e] uppercase tracking-wider block">Delivered Scope:</span>
                    <p className="text-stone-300 text-[12px] leading-relaxed mt-0.5">{activeSite.scopeSummary}</p>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[12px]">
                    <span className="text-[#a8a29e]">Primary Metric:</span>
                    <span className="text-[#a7e5d3] font-semibold">{activeSite.keyMetric}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
                <a
                  href="#contact"
                  className="apple-btn-active flex-1 py-3 px-4 bg-white hover:bg-stone-100 text-[#0c0a09] rounded-full text-[13px] font-medium text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Inquire for Similar Site</span>
                  <ChevronRight className="w-4 h-4 text-[#0c0a09]" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Security Cheques & Statutory Clearances Section (Handcrafted Real Indian Contractor Clearances) */}
        <div className="mt-14 pt-10 border-t border-[#e0e0e0]">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#0066cc] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Clearances & Security Checks</span>
              </div>
              <h3 className="text-[24px] sm:text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
                Government Compliance & Verified Security Standards.
              </h3>
              <p className="text-[15px] text-[#7a7a7a] mt-1">
                Every project executed under statutory government checks, NABL lab tests, and police-verified manpower.
              </p>
            </div>

            <button
              onClick={() => setShowSecurityModal(true)}
              className="apple-btn-active inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white text-[13px] font-medium hover:bg-black transition-all cursor-pointer flex-shrink-0 self-start sm:self-auto"
            >
              <FileCheck2 className="w-4 h-4 text-[#2997ff]" />
              <span>View All Security Certificates</span>
            </button>
          </div>

          {/* 6 Security Verification Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STATUTORY_SECURITY_CLEARANCES.map((sec, idx) => (
              <div
                key={idx}
                className="bg-[#fafafc] rounded-[18px] p-5 border border-[#e0e0e0] hover:border-[#1d1d1f]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-[12px] bg-[#0066cc]/10 text-[#0066cc]">
                      <Lock className="w-4 h-4" />
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#e8e8ed] text-[#1d1d1f] font-semibold">
                      VERIFIED
                    </span>
                  </div>
                  <h4 className="text-[16px] font-semibold text-[#1d1d1f]">
                    {sec.title}
                  </h4>
                  <p className="text-[12px] font-medium text-[#0066cc] mt-0.5">
                    {sec.authority}
                  </p>
                  <p className="text-[12px] text-[#7a7a7a] leading-relaxed mt-2">
                    {sec.details}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e0e0e0] flex items-center justify-between text-[11px]">
                  <span className="text-[#7a7a7a]">Ref No:</span>
                  <span className="font-mono font-semibold text-[#1d1d1f]">{sec.certNo}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Security Clearances Full Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#ffffff] rounded-[24px] max-w-2xl w-full p-6 sm:p-8 border border-[#e0e0e0] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-4 mb-6">
              <div>
                <span className="text-[12px] uppercase font-semibold text-[#0066cc] tracking-wider">
                  Contractor Legal Dossier
                </span>
                <h3 className="text-[22px] font-semibold text-[#1d1d1f] mt-0.5">
                  Statutory Registrations & Security Clearances
                </h3>
              </div>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="apple-btn-active p-2 rounded-full bg-[#f5f5f7] hover:bg-[#e0e0e0] text-[#1d1d1f] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-[13px]">
              <div className="p-4 rounded-[16px] bg-[#f5f5f7] border border-[#e0e0e0] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#7a7a7a]">Legal Entity Name:</span>
                  <span className="font-semibold text-[#1d1d1f]">{COMPANY_INFO.legalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a7a7a]">Corporate Identity (CIN):</span>
                  <span className="font-mono font-semibold text-[#1d1d1f]">{COMPANY_INFO.cin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a7a7a]">GST Identification (GSTIN):</span>
                  <span className="font-mono font-semibold text-[#1d1d1f]">{COMPANY_INFO.gstin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a7a7a]">Permanent Account No (PAN):</span>
                  <span className="font-mono font-semibold text-[#1d1d1f]">{COMPANY_INFO.pan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a7a7a]">MSME Udyam Registration:</span>
                  <span className="font-mono font-semibold text-[#1d1d1f]">{COMPANY_INFO.msmeUdyam}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a7a7a]">Class-1 Contractor Enlistment:</span>
                  <span className="font-semibold text-[#0066cc]">PWD / CPWD Super Heavy Class-1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a7a7a]">SBI Solvency Clearance:</span>
                  <span className="font-semibold text-[#1d1d1f]">{COMPANY_INFO.bankSolvency}</span>
                </div>
              </div>

              <div className="p-4 rounded-[16px] bg-[#fafafc] border border-[#e0e0e0] space-y-2">
                <h5 className="font-semibold text-[#1d1d1f]">Site Security Protocols Enforced:</h5>
                <ul className="space-y-1.5 text-[#7a7a7a]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0066cc]" />
                    <span>Mandatory police background verification & biometric logging for all laborers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0066cc]" />
                    <span>NABL 3rd-party certified concrete cube tests at 7 days & 28 days for every pour</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0066cc]" />
                    <span>State Fire Department NOC and structural stability certificates signed by Chartered Engineers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0066cc]" />
                    <span>EPF & ESIC statutory welfare remittance for 100% on-site skilled and unskilled trades</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setShowSecurityModal(false)}
                  className="apple-btn-active px-6 py-2 rounded-full bg-[#1d1d1f] text-white font-medium hover:bg-black cursor-pointer"
                >
                  Close Clearance Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

