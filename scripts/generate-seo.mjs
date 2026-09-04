#!/usr/bin/env node
/**
 * Generates crawlable HTML landings, sitemaps, feeds and AI-index files.
 * Indian SEO version — timezone Asia/Kolkata, region asia-south1, languages en-IN, hi-IN.
 * Company facts are copied verbatim from src/data/companyData.ts — never invented.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const LASTMOD = '2026-09-04';
const INDEXNOW_KEY = '7c4e9a2b8f1d46c0a93e5b7d2f8a1c6e';
const ORIGIN = (process.env.APP_URL || process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://rudra-construction-nine.vercel.app').replace(/\/$/, '');
const abs = (p) => `${ORIGIN || '__SITE_ORIGIN__'}${p}`;

const IMG = {
  hero: '/assets/images/rudra_hero_construction_1788465374495.jpg',
  civic: '/assets/images/rudra_civic_bhawan_1788465407931.jpg',
  hospital: '/assets/images/rudra_hospital_ward_1788465423465.jpg',
  solar: '/assets/images/rudra_solar_infra_1788465391292.jpg',
};

const COMPANY = {
  name: 'Rudra Constructions & Suppliers',
  legalName: 'Rudra Constructions & Suppliers Pvt. Ltd.',
  foundedYear: 2025,
  tagline: 'Engineering Trust. Constructing Excellence',
  slogan: "Building India's infrastructure with structural integrity & certified craftsmanship",
  subSlogan:
    'From structural engineering to turnkey commissioning, we deliver certified Class-1 civil construction, hospital wards, solar microgrids, and bulk materials across 11 Indian states.',
  totalTurnover: '₹14.65 Crore',
  cin: 'U45200BR2025PTC049182',
  gstin: '10AALCR8492K1Z5',
  pan: 'AALCR8492K',
  msmeUdyam: 'UDYAM-BR-38-0028491',
  contractorEnlistment: 'Class-1 (Super Heavy) Civil Contractor • PWD / CPWD Enlisted',
  bankSolvency: '₹10.00+ Crore Certified Solvency (State Bank of India)',
  address: 'Ward No.2, Sikta Belwa, Ramnagar',
  district: 'West Champaran',
  state: 'Bihar',
  pincode: '845103',
  country: 'India',
  phone: '+91 8099588978',
  phoneFormatted: '+91 80995 88978',
  email: 'rudraconstructionsupplier14@gmail.com',
  workingHours: 'Monday - Saturday: 8:30 AM - 7:00 PM IST',
  lat: 27.1667,
  lng: 84.3167,
};

const SERVICES = [
  {
    id: 'civil-structural',
    title: 'Civil & Structural Construction',
    titleHi: 'सिविल और स्ट्रक्चरल निर्माण',
    shortDesc: 'End-to-end heavy reinforced concrete, foundations, structural steel, and high-load engineered frameworks across Bihar and India.',
    shortHi: 'बिहार और पूरे भारत में भारी प्रबलित कंक्रीट, नींव, स्ट्रक्चरल स्टील और हाई-लोड फ्रेमवर्क।',
    fullDesc:
      'Rudra Constructions provides turnkey civil contracting for institutional, commercial, and governmental structures in Bihar and across India. From extensive earthwork and piling to heavy RCC frames, structural steel erection, and seismic-resistant engineering, our certified engineers ensure lifelong durability. PWD/CPWD enlisted, Class-1 contractor.',
    fullHi:
      'रुद्र कंस्ट्रक्शंस बिहार और पूरे भारत में संस्थागत, वाणिज्यिक और सरकारी संरचनाओं के लिए टर्नकी सिविल कॉन्ट्रैक्टिंग प्रदान करता है। अर्थवर्क, पाइलिंग, RCC फ्रेम, स्ट्रक्चरल स्टील और भूकंप-रोधी इंजीनियरिंग में विशेषज्ञता।',
    capabilities: [
      'RCC framed structures & heavy foundation engineering',
      'Structural steel fabrication & Pre-Engineered Buildings (PEB)',
      'Retaining walls, stormwater culverts & drainage networks',
      'High-tensile rebar tying, shuttering & mechanized batching',
      'Rigorous adherence to IS 456:2000 and IS 1893 seismic codes',
    ],
    keyProjects: 'Panchayat administrative complexes, institutional blocks, foundation piling Bihar',
    compliance: ['IS 456:2000', 'IS 1786 (Fe 550D)', 'IS 1893 Seismic Zone IV/V'],
    badge: 'Core Expertise',
    image: IMG.hero,
  },
  {
    id: 'residential-commercial',
    title: 'Residential & Commercial Projects',
    titleHi: 'आवासीय और वाणिज्यिक परियोजनाएं',
    shortDesc: 'Modern housing societies, multi-story apartments, retail complexes, and state-of-the-art corporate office hubs in Bihar, UP, Delhi NCR.',
    shortHi: 'बिहार, यूपी, दिल्ली NCR में आधुनिक हाउसिंग सोसाइटी, मल्टी-स्टोरी अपार्टमेंट और कॉर्पोरेट हब।',
    fullDesc:
      'We design and build contemporary residential communities and high-utility commercial plazas. Combining architectural finesse with functional space planning, our developments feature energy-efficient envelopes, superior thermal insulation, acoustic comfort, and premium finishes.',
    fullHi:
      'हम समकालीन आवासीय समुदाय और उच्च उपयोगिता वाले वाणिज्यिक प्लाजा डिजाइन और निर्माण करते हैं। ऊर्जा-कुशल, थर्मल इंसुलेशन और प्रीमियम फिनिश के साथ।',
    capabilities: [
      'Multi-story residential towers & gated community layout',
      'Corporate office parks & commercial shopping complexes',
      'Aesthetic facade engineering (ACP, structural glazing, louvers)',
      'Integrated electrical, fire safety, HVAC & MEP installations',
      'High-grade flooring, vitrified tiling & durable weather coatings',
    ],
    keyProjects: 'Urban residential blocks, commercial retail centers, corporate headquarters Patna, Delhi NCR',
    compliance: ['National Building Code (NBC 2016)', 'Local Town Planning Bye-laws'],
    badge: 'Turnkey Contracting',
    image: IMG.hero,
  },
  {
    id: 'infrastructure-gov',
    title: 'Infrastructure & Government Development',
    titleHi: 'बुनियादी ढांचा और सरकारी विकास',
    shortDesc: 'Public sector civic complexes, Panchayat Sarkar Bhawans, regional road corridors, culverts, and civic utilities for Bihar Govt.',
    shortHi: 'बिहार सरकार के लिए पंचायत सरकार भवन, सड़क कॉरिडोर, पुलिया और नागरिक सुविधाएं।',
    fullDesc:
      'A trusted vendor to the Government of Bihar and national developmental foundations, Rudra executes critical civic assets. We build Panchayat Sarkar Bhawans, block administrative hubs, rural concrete roads, flood-resilient culverts, and public recreation parks. Class-1 PWD/CPWD contractor.',
    fullHi:
      'बिहार सरकार और राष्ट्रीय विकास फाउंडेशन के विश्वसनीय वेंडर, रुद्र महत्वपूर्ण नागरिक संपत्ति निष्पादित करता है। पंचायत सरकार भवन, ब्लॉक प्रशासनिक हब, ग्रामीण कंक्रीट सड़कें और बाढ़-रोधी पुलिया।',
    capabilities: [
      'Panchayat Sarkar Bhawan construction with full civic amenities',
      'Inter-district rigid concrete pavements & asphalt rural roads',
      'Veterinary hospitals & animal husbandry infrastructure',
      'Civic administrative blocks, public service counters & plazas',
      'Stormwater drainage, rainwater harvesting & flood protection',
    ],
    keyProjects: 'State Government Panchayat Sarkar Bhawan network across Bihar districts — 16 active',
    compliance: ['IRC:SP:20', 'MoRTH Specifications', 'State PWD Handbooks'],
    badge: 'Government Approved Bihar',
    image: IMG.civic,
  },
  {
    id: 'solar-renewable',
    title: 'Solar & Renewable Energy Solutions',
    titleHi: 'सोलर और नवीकरणीय ऊर्जा समाधान',
    shortDesc: "In alignment with India's National Solar Mission: rooftop PV, public solar street lighting, and rural microgrids across 11 states.",
    shortHi: 'भारत के राष्ट्रीय सोलर मिशन के अनुरूप: रूफटॉप पीवी, सोलर स्ट्रीट लाइट और ग्रामीण माइक्रोग्रिड।',
    fullDesc:
      'Our dedicated renewable energy division designs, procures, and installs high-efficiency solar energy systems across Bihar and India. From standalone solar street lighting in remote villages to high-capacity rooftop solar arrays for government institutions and industrial sheds, we provide clean, round-the-clock power. MNRE compliant.',
    fullHi:
      'हमारी नवीकरणीय ऊर्जा डिवीजन बिहार और भारत में उच्च दक्षता वाले सोलर सिस्टम डिजाइन और स्थापित करती है। रिमोट गांवों में सोलर स्ट्रीट लाइट से लेकर सरकारी संस्थानों के लिए रूफटॉप सोलर तक।',
    capabilities: [
      'Integrated all-in-one & semi-integrated LED solar street lighting',
      'Grid-tied (On-Grid) & hybrid rooftop solar PV plants (1kW - 500kW)',
      'Solar-powered community drinking water pumps & irrigation units',
      'Lithium Ferro Phosphate (LiFePO4) & Gel tubular battery storage',
      'Remote IoT monitoring, automated dusk-to-dawn sensors & AMC',
    ],
    keyProjects: 'Over 1,200 solar street lighting poles & public institutional solar setups Bihar, UP, Assam',
    compliance: ['MNRE Specifications', 'IEC 61215', 'IEC 61730', 'BIS Certified'],
    badge: 'Clean Energy Pioneer India',
    image: IMG.solar,
  },
  {
    id: 'healthcare-modular',
    title: 'Healthcare, Hospital & Modular Infrastructure',
    titleHi: 'स्वास्थ्य, अस्पताल और मॉड्यूलर बुनियादी ढांचा',
    shortDesc: 'Equipped medical facilities, inpatient hospital wards, prefabricated health centers, and clinical sanitation spaces Bihar.',
    shortHi: 'बिहार में सुसज्जित चिकित्सा सुविधाएं, इनपेशेंट वार्ड, प्रीफैब्रिकेटेड हेल्थ सेंटर।',
    fullDesc:
      'Rudra Constructions develops sterile, resilient healthcare infrastructure in Bihar. We deliver hospital ward construction, patient care units, diagnostic facility rooms, prefabricated modular isolation units, medical gas pipeline routing provisions, and anti-bacterial vinyl flooring.',
    fullHi:
      'रुद्र कंस्ट्रक्शंस बिहार में स्टेराइल, लचीला हेल्थकेयर इंफ्रास्ट्रक्चर विकसित करता है। अस्पताल वार्ड, पेशेंट केयर यूनिट, डायग्नोस्टिक रूम और एंटी-बैक्टीरियल फ्लोरिंग।',
    capabilities: [
      'Public hospital inpatient general wards & specialized clinics Bihar',
      'Rapid-deployment modular prefabricated healthcare cabins',
      'Medical-grade antimicrobial coatings, epoxy & vinyl flooring',
      'Dedicated clean power distribution & continuous backup wiring',
      'Sanitary plumbing, medical waste drainage & autoclave rooms',
    ],
    keyProjects: 'Government public hospital ward renovation and modular healthcare installations Bihar',
    compliance: ['Indian Public Health Standards (IPHS)', 'AERB & Fire Safety'],
    badge: 'Life-Critical Works',
    image: IMG.hospital,
  },
  {
    id: 'materials-supply',
    title: 'Certified Building Materials Supply',
    titleHi: 'प्रमाणित निर्माण सामग्री आपूर्ति',
    shortDesc: 'Direct factory-procured supply of Grade-53/43 cement, Fe 550D TMT bars, aggregates, sand, and AAC blocks across East India.',
    shortHi: 'पूर्वी भारत में ग्रेड-53/43 सीमेंट, Fe 550D TMT बार, एग्रीगेट और AAC ब्लॉक की सीधी फैक्ट्री आपूर्ति।',
    fullDesc:
      'As an integrated construction and supply conglomerate, Rudra operates a reliable logistics network for bulk building materials across Bihar, Jharkhand, Odisha, UP. We supply tested, certified raw materials directly to government contractors, commercial builders, and our internal project sites at bulk-negotiated pricing.',
    fullHi:
      'एक एकीकृत निर्माण और आपूर्ति समूह के रूप में, रुद्र बिहार, झारखंड, ओडिशा, यूपी में थोक निर्माण सामग्री के लिए विश्वसनीय लॉजिस्टिक्स नेटवर्क संचालित करता है।',
    capabilities: [
      'TMT Rebars (Fe 500D, Fe 550D) with mill test certificates (MTC) Bihar',
      'OPC 53, OPC 43 & PPC Cement from top-tier primary manufacturers',
      'Graded blue metal aggregates (10mm, 20mm, 40mm) & washed river sand',
      'Autoclaved Aerated Concrete (AAC) blocks & fly-ash bricks',
      'High-spec solar panels, mono-perc modules, LED fixtures & GI poles',
    ],
    keyProjects: 'Bulk material supply contracts for state building corporations and road projects East India',
    compliance: ['IS 1786', 'IS 269', 'IS 383', 'IS 2185'],
    badge: 'Direct Distribution East India',
    image: IMG.hero,
  },
];

const PROJECTS = [
  {
    id: 'proj-1',
    title: 'Panchayat Sarkar Bhawan Administrative Complex',
    titleHi: 'पंचायत सरकार भवन प्रशासनिक परिसर',
    category: 'civic',
    categoryLabel: 'Government Civic Infrastructure Bihar',
    client: 'Panchayati Raj Department (Bihar Govt.)',
    location: 'West Champaran & Regional Blocks',
    state: 'Bihar',
    year: '2025',
    status: 'Completed',
    scope: 'Full Turnkey Civil, Structural, Electrical & Solar Electrification Bihar',
    description:
      'Constructed standard-format, disaster-resilient Panchayat Sarkar Bhawan comprising public grievance halls, elected representative offices, digital citizen service centers, sanitized washrooms, and solar backup power. Class-1 contractor execution.',
    highlights: [
      'Constructed 5,400+ sq.ft reinforced concrete two-story administrative building Bihar',
      'Installed ramp-assisted barrier-free access compliant with accessible India guidelines',
      'Integrated rooftop solar PV with battery backup for uninterrupted public service delivery',
      'Equipped with rainwater harvesting and dedicated borewell sanitation facilities',
    ],
    image: IMG.civic,
    metrics: [
      { label: 'Built-up Area', value: '5,400 sq.ft' },
      { label: 'Execution Time', value: '8 Months' },
      { label: 'Solar Integration', value: '5 kW Rooftop' },
      { label: 'Compliance', value: '100% PWD Norms' },
    ],
  },
  {
    id: 'proj-2',
    title: 'Public Hospital Inpatient Ward Modernization',
    titleHi: 'सरकारी अस्पताल इनपेशेंट वार्ड आधुनिकीकरण',
    category: 'healthcare',
    categoryLabel: 'Healthcare & Life Sciences Bihar',
    client: 'Building Construction Department (Bihar Govt.)',
    location: 'District Hospital Complex',
    state: 'Bihar',
    year: '2025',
    status: 'Completed',
    scope: 'Civil Structural Refurbishment, Flooring, False Ceiling & Medical Electrical',
    description:
      'Complete structural renovation and retrofitting of a multi-bed hospital inpatient ward in Bihar. Features medical-grade anti-static vinyl flooring, acoustic false ceiling with soothing blue LED illumination, ergonomic patient beds, and specialized sanitation zones.',
    highlights: [
      'Modernized 24-bed hospital ward with individual patient monitor points Bihar',
      'Sanitary plumbing overhaul with automated water conservation fixtures',
      'High-durability antimicrobial wall finishes preventing nosocomial infections',
      'Zero-downtime execution in phased schedule adjacent to functioning clinical wings',
    ],
    image: IMG.hospital,
    metrics: [
      { label: 'Bed Capacity', value: '24 Beds' },
      { label: 'Lighting Standard', value: '350 Lux Uniform' },
      { label: 'Flooring', value: 'Antimicrobial Vinyl' },
      { label: 'Handover', value: 'Before Deadline' },
    ],
  },
  {
    id: 'proj-3',
    title: 'Solar Rural Electrification & Street Lighting Mission',
    titleHi: 'सोलर ग्रामीण विद्युतीकरण और स्ट्रीट लाइटिंग मिशन',
    category: 'solar',
    categoryLabel: 'Renewable Energy & Public Utilities India',
    client: 'Sehgal Foundation & Aroh Foundation',
    location: 'Semi-Urban & Rural Districts',
    state: 'Bihar & Uttar Pradesh',
    year: '2025',
    status: 'Commissioned',
    scope: 'Supply, Civil Erection, Commissioning & Maintenance of Solar Infrastructure Bihar, UP',
    description:
      'Executed widespread installation of autonomous high-lumen LED solar street light systems across rural villages, community squares, and primary health centers in Bihar and UP. Provides dusk-to-dawn safety, crime deterrence, and eco-friendly lighting. MNRE compliant.',
    highlights: [
      'Installed 450+ autonomous solar street lighting poles with hot-dip galvanized coating Bihar',
      'Equipped with high-efficiency Mono PERC solar modules and LiFePO4 batteries',
      'Automated optical sensor technology ensuring 12+ hours uninterrupted twilight lighting',
      'Community maintenance training delivered to local youth panchayat members',
    ],
    image: IMG.solar,
    metrics: [
      { label: 'Luminaires Installed', value: '450+ Poles' },
      { label: 'Energy Saved', value: '68,000 kWh/yr' },
      { label: 'Battery Life', value: '5+ Years LiFePO4' },
      { label: 'Uptime', value: '99.4%' },
    ],
  },
  {
    id: 'proj-4',
    title: 'Regional Highway Overpass & Segmental Infrastructure',
    titleHi: 'क्षेत्रीय हाईवे ओवरपास और सेगमेंटल इंफ्रास्ट्रक्चर',
    category: 'infrastructure',
    categoryLabel: 'Highways & Heavy Engineering Bihar',
    client: 'Bihar State Building Construction Corp LTD.',
    location: 'Patna - Bettiah Regional Corridor',
    state: 'Bihar',
    year: '2025',
    status: 'In Progress',
    scope: 'Heavy Foundation Piling, Pier Caps & Segmental Deck Erection Bihar',
    description:
      'Execution of reinforced concrete substructure and pier columns for critical bypass corridor in Bihar. Utilizes computerized batching, high-tensile Fe 550D rebar cages, and self-compacting concrete to ensure long-term structural integrity under heavy axle traffic.',
    highlights: [
      'Deep bored cast-in-situ piling reaching firm bedrock strata Bihar',
      'Cast pier caps utilizing high-strength M45 structural concrete',
      'Strict continuous non-destructive concrete strength and ultrasonic testing',
      'Comprehensive traffic management plan minimizing regional commuter disruption',
    ],
    image: IMG.hero,
    metrics: [
      { label: 'Concrete Volume', value: '4,200 m³' },
      { label: 'Grade of Steel', value: 'Fe 550D TMT' },
      { label: 'Load Capacity', value: 'Class 70R' },
      { label: 'Safety Record', value: 'Zero LTI' },
    ],
  },
  {
    id: 'proj-5',
    title: 'Fisheries & Animal Resource Technical Facility',
    titleHi: 'मत्स्य और पशु संसाधन तकनीकी सुविधा',
    category: 'civic',
    categoryLabel: 'Specialized State Facilities Bihar',
    client: 'Bihar Animal & Fisheries Resource Dept.',
    location: 'Bettiah Regional Extension',
    state: 'Bihar',
    year: '2025',
    status: 'Completed',
    scope: 'Civil Laboratory Construction, Cold Storage Chambers & Hatchery Infrastructure Bettiah',
    description:
      'Specialized institutional facility built for veterinary diagnosis, aquatic testing, and storage of animal resource supplies in Bettiah Bihar. Includes moisture-resistant wall treatments, dedicated drainage, cold room enclosures, and staff administrative quarters.',
    highlights: [
      'Constructed cold storage enclosures maintaining controlled 2-8°C parameters',
      'Acid-resistant laboratory counters with chemical drain line interception',
      'Dedicated solar water heating systems and backup diesel-solar synchronization',
      'External concrete hardstanding and perimeter security fencing',
    ],
    image: IMG.civic,
    metrics: [
      { label: 'Floor Area', value: '3,800 sq.ft' },
      { label: 'Cold Room Vol', value: '120 m³' },
      { label: 'Delivery', value: 'Completed 2025' },
      { label: 'Client Rating', value: 'Exemplary' },
    ],
  },
  {
    id: 'proj-6',
    title: 'Bulk TMT Steel & Cement Logistics Consignment',
    titleHi: 'थोक TMT स्टील और सीमेंट लॉजिस्टिक्स खेप',
    category: 'materials',
    categoryLabel: 'Material Distribution & Supply East India',
    client: 'Gramin Vikas Trust (GVT) & WOTR Projects',
    location: 'Jharkhand & Odisha Operations',
    state: 'Jharkhand & Odisha',
    year: '2025',
    status: 'Completed',
    scope: 'Certified Primary Mill Material Procurement, Weighment & Multi-Site Delivery East India',
    description:
      'Consolidated procurement and logistics dispatch of over 1,800 Metric Tonnes of primary steel and 45,000 bags of OPC 53 cement for watershed development structures, check dams, and rural housing clusters in Jharkhand and Odisha.',
    highlights: [
      '100% batch traceability with original mill test certificates (MTC)',
      'Strict weighbridge verification and zero transit damage logistics',
      'Dedicated fleet of 10-wheel heavy commercial vehicles deployed',
      'Warehouse buffer stock maintained in Patna and Bettiah yards Bihar',
    ],
    image: IMG.hero,
    metrics: [
      { label: 'Steel Supplied', value: '1,800 MT' },
      { label: 'Cement Bags', value: '45,000 Bags' },
      { label: 'Test Compliance', value: '100% BIS Pass' },
      { label: 'Sites Covered', value: '18 Locations' },
    ],
  },
];

const OFFICES = [
  { id: 'hq-registered', type: 'Registered Headquarters', typeHi: 'पंजीकृत मुख्यालय', city: 'Ramnagar, West Champaran', state: 'Bihar', address: 'Ward No.2, Sikta Belwa, Ramnagar', pincode: '845103', isPrimary: true, lat: 27.1667, lng: 84.3167 },
  { id: 'delhi-ncr', type: 'Regional Corporate Hub', typeHi: 'क्षेत्रीय कॉर्पोरेट हब', city: 'Ghaziabad (Delhi NCR)', state: 'Uttar Pradesh', address: 'S8, Second Floor, Aaditya Mall, near Kotak Mahindra Bank, Indirapuram', pincode: '201014', isPrimary: false, lat: 28.6415, lng: 77.3714 },
  { id: 'patna-branch', type: 'State Branch Office', typeHi: 'राज्य शाखा कार्यालय', city: 'Patna', state: 'Bihar', address: 'Sanyukta Bhawan, Road Number Zero, Shivpuri', pincode: '800023', isPrimary: false, lat: 25.5941, lng: 85.1376 },
  { id: 'bettiah-branch', type: 'Project Operations Office', typeHi: 'परियोजना संचालन कार्यालय', city: 'Bettiah', state: 'Bihar', address: 'Basant Vihar, Hariwatika Chowk, Bettiah', pincode: '845438', isPrimary: false, lat: 26.8022, lng: 84.5029 },
  { id: 'assam-bedeti', type: 'State Branch Office', typeHi: 'राज्य शाखा कार्यालय', city: 'Biswanath', state: 'Assam', address: 'Bihmari Jarani, P.O. Bedeti, Dist. Biswanath', pincode: '784179', isPrimary: false, lat: 26.7335, lng: 93.1491 },
  { id: 'assam-jorhat', type: 'Project Operations Office', typeHi: 'परियोजना संचालन कार्यालय', city: 'Jorhat', state: 'Assam', address: 'Royal Garden Building 5E, Opposite Jorhat Railway Station', pincode: '785001', isPrimary: false, lat: 26.7509, lng: 94.2037 },
];

const STATES = [
  { id: 'bihar', name: 'Bihar', code: 'BR', region: 'East', focus: ['Panchayat Sarkar Bhawans', 'Healthcare Hospital Wards', 'Road & Bridge Infrastructure', 'Rural Solar Lighting', 'Material Supply Hubs'], clients: ['Panchayati Raj Dept.', 'Building Construction Dept.', 'Bihar State Building Corp.', 'Bihar Animal & Fisheries'], count: 16 },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', code: 'UP', region: 'North', focus: ['Delhi NCR Commercial Works', 'Solar Street Light Arrays', 'Warehouse Logistics', 'Civil Renovation'], clients: ['Aroh Foundation', 'Sehgal Foundation', 'Commercial Developers'], count: 6 },
  { id: 'jharkhand', name: 'Jharkhand', code: 'JH', region: 'East', focus: ['Check Dams & Watershed Structures', 'Bulk TMT & Cement Supply', 'Rural Infrastructure'], clients: ['WOTR', 'GVT', 'Regional Contractors'], count: 4 },
  { id: 'odisha', name: 'Odisha', code: 'OD', region: 'East', focus: ['Community Civic Infrastructure', 'Disaster Resilient Shelters', 'Bulk Material Logistics'], clients: ['Gramin Vikas Trust', 'Development Partners'], count: 3 },
  { id: 'assam', name: 'Assam', code: 'AS', region: 'North-East', focus: ['Regional Offices in Biswanath & Jorhat', 'Flood-Prone Elevated Civil Foundations', 'Solar Lighting Corridors'], clients: ['Public Works Departments', 'Tea Estate Community Infrastructure'], count: 5 },
  { id: 'meghalaya', name: 'Meghalaya', code: 'ML', region: 'North-East', focus: ['Hill Slope Retaining Structures', 'Solar Microgrids', 'Eco-friendly Tourism Infrastructure'], clients: ['Regional Foundations', 'Local Municipalities'], count: 2 },
  { id: 'tripura', name: 'Tripura', code: 'TR', region: 'North-East', focus: ['Rural Water & Solar Solutions', 'Civic Building Extensions', 'Building Material Supply'], clients: ['State Development Societies'], count: 2 },
  { id: 'arunachal-pradesh', name: 'Arunachal Pradesh', code: 'AR', region: 'North-East', focus: ['High-Altitude Remote Solar Lighting', 'Prefabricated Modular Cabins', 'Cold-Climate Insulation'], clients: ['Border Community Initiatives', 'Institutional Foundations'], count: 2 },
  { id: 'haryana', name: 'Haryana', code: 'HR', region: 'North', focus: ['Industrial Warehouse Concrete Flooring', 'Commercial Office Retrofits', 'Solar Rooftop Arrays'], clients: ['Corporate Logistics Hubs', 'Private Industrialists'], count: 3 },
  { id: 'punjab', name: 'Punjab', code: 'PB', region: 'North', focus: ['Agricultural Infrastructure', 'Cold Storage Civil Works', 'Solar Irrigation Pumps'], clients: ['Agri-Logistics Foundations', 'Rural Cooperatives'], count: 2 },
  { id: 'jammu-kashmir', name: 'Jammu & Kashmir', code: 'JK', region: 'North', focus: ['Sub-Zero Pre-Engineered Buildings', 'Snow-Load Structural Steelwork', 'Off-Grid Solar Storage'], clients: ['Public Infrastructure Entities', 'Eco-Tourism Resorts'], count: 2 },
];

const WORKSITES = [
  { id: 'site-ramnagar-hq', title: 'Registered Corporate HQ & Panchayat Sarkar Bhawans Bihar', cat: 'civic', city: 'Ramnagar, West Champaran', state: 'Bihar', lat: 27.1667, lng: 84.3167, client: 'Panchayati Raj Department & District Administration', status: 'Operational Hub', year: 'Est. 2025', scope: 'Central corporate headquarters and cluster of 2-story reinforced concrete Panchayat Sarkar Bhawans with digital citizen halls.', value: '₹4.85 Cr', metric: '5,400 sq.ft RCC Hub', image: IMG.civic },
  { id: 'site-bettiah-lab', title: 'Animal & Fisheries Resource Diagnostic Facility Bettiah', cat: 'civic', city: 'Bettiah, West Champaran', state: 'Bihar', lat: 26.8022, lng: 84.5029, client: 'Bihar Animal & Fisheries Resource Dept.', status: 'Completed', year: '2025', scope: 'State technical laboratory, cold room storage facilities (2-8°C), and district project logistics management office.', value: '₹2.90 Cr', metric: '3,800 sq.ft Clean Lab', image: IMG.civic },
  { id: 'site-patna-bridge', title: 'Regional Highway Substructure & State Office Patna', cat: 'infrastructure', city: 'Shivpuri, Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, client: 'Bihar State Building Construction Corp LTD.', status: 'Under Execution', year: '2025-2026', scope: 'Deep bored cast-in-situ piling, heavy pier columns, and state liaison branch office at Sanyukta Bhawan.', value: '₹6.20 Cr', metric: '4,200 m³ High-Load M45', image: IMG.hero },
  { id: 'site-muzaffarpur-hospital', title: 'Sub-Divisional Hospital Inpatient Ward Modernization Muzaffarpur', cat: 'healthcare', city: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647, client: 'Building Construction Dept. (Bihar Govt.)', status: 'Completed', year: '2025', scope: '24-bed inpatient ward retrofit with antimicrobial seamless flooring, medical gas plumbing, and 350 Lux lighting.', value: '₹1.75 Cr', metric: '24 Beds Delivered', image: IMG.hospital },
  { id: 'site-motihari-solar', title: 'Panchayat Solar Streetlighting & Mini-Grid Mission Motihari', cat: 'solar', city: 'Motihari, East Champaran', state: 'Bihar', lat: 26.647, lng: 84.9089, client: 'Sehgal Foundation & BREDA Programs', status: 'Completed', year: '2025', scope: 'Erection of 320+ hot-dip galvanized solar street poles with Mono-PERC PV modules and LiFePO4 battery banks.', value: '₹88 Lakhs', metric: '320+ Solar Poles', image: IMG.solar },
  { id: 'site-delhi-ncr-hub', title: 'Delhi NCR Corporate Hub & Commercial Contracting', cat: 'office', city: 'Indirapuram, Ghaziabad', state: 'Uttar Pradesh', lat: 28.6415, lng: 77.3714, client: 'Commercial Developers & Corporate Clients', status: 'Operational Hub', year: 'Active', scope: 'Regional bidding and commercial corporate office at Aaditya Mall managing North India tender procurement.', value: '₹5.50 Cr Pipeline', metric: 'Regional Bidding Hub', image: IMG.hero },
  { id: 'site-gorakhpur-civic', title: 'Civic Administrative Complex & Material Depots Gorakhpur', cat: 'civic', city: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732, client: 'Municipal & Public Works Departments', status: 'Under Execution', year: '2025-2026', scope: 'RCC framed municipal administrative building and central supply staging yard for Fe 550D primary TMT bars.', value: '₹3.40 Cr', metric: '12,000 sq.ft Complex', image: IMG.civic },
  { id: 'site-varanasi-solar', title: 'Community Solar Water Systems & Lighting Varanasi', cat: 'solar', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, client: 'Aroh Foundation & Village Committees', status: 'Completed', year: '2025', scope: 'Dual-axis solar pump arrays and 140 autonomous street lighting units across peri-urban village clusters.', value: '₹72 Lakhs', metric: '140 Solar Poles', image: IMG.solar },
  { id: 'site-biswanath-assam', title: 'Assam Regional Operations & Rural Infrastructure Biswanath', cat: 'office', city: 'Biswanath (Bedeti)', state: 'Assam', lat: 26.7335, lng: 93.1491, client: 'State Panchayati Raj & Development Agencies', status: 'Operational Hub', year: 'Active 2025', scope: 'North-East regional administrative base, heavy machinery depot, and flood protection culvert construction.', value: '₹2.80 Cr', metric: 'North-East Base', image: IMG.hero },
  { id: 'site-jorhat-assam', title: 'Animal Husbandry Center & District Operations Base Jorhat', cat: 'civic', city: 'Jorhat (Opp. Railway Station)', state: 'Assam', lat: 26.7509, lng: 94.2037, client: 'Assam Veterinary & Agriculture Directorate', status: 'Completed', year: '2025', scope: 'Regional veterinary cold chain center, research chambers, and operational office at Royal Garden Building.', value: '₹2.15 Cr', metric: 'Veterinary Center', image: IMG.civic },
  { id: 'site-guwahati-retaining', title: 'Brahmaputra Basin Flood Retaining & Staging Yard Guwahati', cat: 'infrastructure', city: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, client: 'Regional Water Resources & Local Bodies', status: 'Under Execution', year: '2025-2026', scope: 'Boulder pitching, reinforced concrete retaining walls, and bulk staging yard for Grade-53 cement dispatch.', value: '₹3.90 Cr', metric: '1.4 km Retaining Wall', image: IMG.hero },
  { id: 'site-ranchi-jharkhand', title: 'Catchment Check Dams & 1,800 MT Rebar Supply Ranchi', cat: 'materials', city: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, client: 'Gramin Vikas Trust (GVT) & State Watersheds', status: 'Completed', year: '2025', scope: 'Bulk supply of 1,800 MT tested primary rebar and construction of 6 masonry check dams in tribal blocks.', value: '₹4.10 Cr', metric: '1,800 MT Primary TMT', image: IMG.hero },
  { id: 'site-dhanbad-jharkhand', title: 'Heavy Foundation Substructures & Drainage Works Dhanbad', cat: 'infrastructure', city: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304, client: 'Industrial & Municipal Authorities', status: 'Under Execution', year: '2025-2026', scope: 'Heavy machine foundation footings, concrete stormwater drains, and structural steel shed erection.', value: '₹2.60 Cr', metric: 'Heavy RCC Pours', image: IMG.hero },
  { id: 'site-bhubaneswar-odisha', title: 'Cyclone-Resilient Community Shelter & Solar Arrays Bhubaneswar', cat: 'civic', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, client: 'WOTR Catchment Engineering & State Programs', status: 'Completed', year: '2025', scope: 'High wind-rated RCC community hall with 10 kW rooftop solar microgrid and dedicated rainwater recharge.', value: '₹1.95 Cr', metric: 'Wind-Resilient Hall', image: IMG.civic },
  { id: 'site-srinagar-jk', title: 'High-Altitude Solar Microgrid & Insulated Concrete Srinagar', cat: 'solar', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0837, lng: 74.7973, client: 'Public Utilities & Tourism Department', status: 'Completed', year: '2025', scope: 'Cold-resistant solar lighting systems with frost-resistant battery enclosures and low-temp curing concrete.', value: '₹1.45 Cr', metric: 'Sub-Zero Operation', image: IMG.solar },
  { id: 'site-raipur-chhattisgarh', title: 'Rural Water Supply Structures & Solar Lighting Raipur', cat: 'solar', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, client: 'State Panchayat & Rural Engineering Services', status: 'Completed', year: '2025', scope: 'Erection of 180 solar LED streetlights and construction of concrete pump stations for rural habitations.', value: '₹1.15 Cr', metric: '180 Solar Poles', image: IMG.solar },
  { id: 'site-itanagar-arunachal', title: 'Hill Slope Gabion Retaining & Border Electrification Itanagar', cat: 'infrastructure', city: 'Itanagar', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053, client: 'State PWD & Rural Electrification', status: 'Under Execution', year: '2025-2026', scope: 'Seismic Zone-V gabion and concrete retaining walls, solar mini-grids, and drainage catchments.', value: '₹2.20 Cr', metric: 'Zone-V Seismic', image: IMG.hero },
  { id: 'site-rewa-mp', title: 'Solar Park Ancillary Civil Works & Bulk Rebar Rewa', cat: 'materials', city: 'Rewa', state: 'Madhya Pradesh', lat: 24.5373, lng: 81.3042, client: 'Renewable Energy Contractors', status: 'Completed', year: '2025', scope: 'Supply of 650 MT Fe 550D TMT bars, cast foundation plinths for central inverters, and perimeter grading.', value: '₹1.80 Cr', metric: '650 MT Rebar', image: IMG.solar },
];

const CLIENTS = [
  { name: 'Panchayati Raj Department Bihar', category: 'Government Department', description: 'Government of Bihar — Turnkey execution of multi-district Panchayat Sarkar Bhawan administrative complexes.', region: 'Bihar' },
  { name: 'Building Construction Department Bihar', category: 'Government Department', description: 'Government of Bihar — Public health facilities, hospital ward retrofits, and state institutional structures.', region: 'Bihar' },
  { name: 'Bihar State Building Corporation LTD.', category: 'Public Undertaking', description: 'State civil works, high-specification public infrastructure, and heavy structural engineering projects Bihar.', region: 'Bihar' },
  { name: 'Bihar Animal & Fisheries Resource Dept.', category: 'Government Department', description: 'Veterinary clinical facilities, cold chain storage enclosures, and research hatcheries Bettiah.', region: 'Bihar' },
  { name: 'Aashray Foundation', category: 'Development Foundation', description: 'Social housing, community infrastructure, clean sanitation facilities, and rural development programs India.', region: 'National' },
  { name: 'Sehgal Foundation', category: 'Development Foundation', description: 'Renewable solar street lighting, water conservation structures, and sustainable rural electrification Bihar, UP.', region: 'Pan-India' },
  { name: 'Srijjan', category: 'Development Foundation', description: 'Livelihood infrastructure, community processing centers, and village civic utilities East India.', region: 'East India' },
  { name: 'WOTR (Watershed Organisation Trust)', category: 'Development Foundation', description: 'Civil check dams, rural water storage structures, and sustainable catchment engineering Jharkhand, Odisha.', region: 'Multi-State' },
  { name: 'GVT (Gramin Vikas Trust)', category: 'Development Foundation', description: 'Bulk construction material procurement, agrarian logistics facilities, and community buildings.', region: 'National' },
  { name: 'Aroh Foundation', category: 'Development Foundation', description: 'Solar electrification of public schools, rural healthcare posts, and community centers North & East India.', region: 'North & East India' },
];

const FAQS = [
  {
    q: 'What classes of government tenders and commercial projects does Rudra handle in Bihar and India?',
    a: 'Rudra Constructions & Suppliers is qualified for Class-A civil engineering contracts, institutional tenders, and turnkey commercial projects across Bihar and India. With an audited turnover exceeding ₹14.65 Crore (editable via admin panel at /admin), we handle single-contract values ranging from ₹25 Lakhs up to ₹15 Crore across civil structures, roads, government civic buildings, hospital retrofits, and renewable solar arrays.',
  },
  {
    q: 'Do you supply building materials as a standalone service or only for your own sites?',
    a: 'We offer both! Through our dedicated materials supply division, we provide bulk supply of Grade 53/43 cement, Fe 550D TMT rebars, graded aggregates, and AAC blocks to external government contractors, private developers, and infrastructure firms across Bihar, Jharkhand, Odisha, UP, complete with primary mill test certificates (MTC) and weighbridge verification.',
  },
  {
    q: 'What quality assurance and testing protocols are enforced during construction?',
    a: 'We adhere strictly to Bureau of Indian Standards (IS 456, IS 1786, IS 1893). For every concrete casting, we prepare standard test cubes tested at 7 and 28 days in NABL-accredited laboratories. We also conduct on-site slump cone tests, ultrasonic pulse velocity (UPV) tests, and ultrasonic weld flaw inspections for structural steel.',
  },
  {
    q: 'How does your solar and renewable energy division operate in India?',
    a: 'Our solar division designs and executes MNRE-compliant solar systems across Bihar and 11 Indian states. We specialize in off-grid and hybrid rooftop solar power plants for institutional and commercial buildings, as well as integrated high-lumen LED solar street light systems with LiFePO4 battery technology and automated twilight sensors for rural and municipal roads.',
  },
  {
    q: 'Where are your registered and operational branch offices located?',
    a: 'Our Registered Headquarters is located in Ramnagar, West Champaran (Bihar 845103). We operate a Regional Corporate Hub in Ghaziabad (Delhi NCR) at Aaditya Mall, Indirapuram, state offices in Patna (Shivpuri) and Bettiah (Hariwatika Chowk), as well as dual North-East operational hubs in Assam at Biswanath (Bedeti) and Jorhat (Royal Garden Building).',
  },
  {
    q: 'How can government departments or developers request an official quote or RFP response? Is turnover editable?',
    a: 'You can submit your project parameters directly through our online Project Cost Estimator (rates editable via admin panel /admin), email tender documents to rudraconstructionsupplier14@gmail.com, or reach our project director directly at +91 8099588978. Turnover is managed from Admin Panel → Turnover & Company and updates live across TrustMetrics and SEO. Our tender estimation team typically responds within 24–48 business hours with a preliminary BOQ review.',
  },
];

const STEPS = [
  { n: '01', title: 'Requirement Analysis & Site Assessment', tag: 'Precision data collection before the first shovel touches soil — Bihar', desc: 'Every successful project begins with comprehensive feasibility studies. Our engineering crew conducts on-site topographical surveys, soil bearing capacity (SBC) borehole tests, environmental impact reviews, and stakeholder alignment meetings across Bihar and India.', deliverables: ['Digital Total Station (DTS) topographical survey maps', 'Geotechnical borehole soil investigation reports', 'Hydrological and flood-level historical analysis', 'Preliminary statutory clearance checklist'], duration: 'Week 1 - 2', tools: ['Digital Total Station', 'Soil Core Drilling Rig', 'GIS Mapping Software'] },
  { n: '02', title: 'Design, Planning & Cost Estimation', tag: 'Value-engineered structural plans with transparent BOQs — Indian DSR', desc: 'Our in-house structural and MEP engineers draft detailed 2D/3D blueprints and computerized structural simulations. We prepare transparent Bills of Quantities (BOQ), critical path milestone schedules, and value-engineering recommendations that reduce client expenditure without cutting corners. Rates editable via admin panel.', deliverables: ['Complete architectural & structural working drawings', 'STAAD.Pro structural stability & seismic load calculations', 'Item-rate Bill of Quantities (BOQ) with market-indexed rates', 'Primavera / MS Project milestone Gantt schedule'], duration: 'Week 2 - 4', tools: ['AutoCAD 2025', 'STAAD.Pro', 'Revit BIM', 'CostX BOQ Engine'] },
  { n: '03', title: 'Procurement & Resource Allocation', tag: 'Direct mill procurement and mechanized heavy plant mobilization Bihar', desc: 'Leveraging our integrated materials supply chain, we procure certified raw materials directly from primary mills, eliminating intermediary markups. Heavy machinery—including transit mixers, mini-batching plants, excavators, and scaffolding—is deployed to the project staging depot.', deliverables: ['Raw material vendor qualification and Mill Test Certificates (MTC)', 'Mobilization of licensed plant and heavy machinery', 'On-site labor camp setup adhering to occupational health standards', 'Secure material inventory control and testing bay'], duration: 'Week 4 - 6', tools: ['Primary Mill Supply Chain', 'Heavy Fleet Logistics', 'Batching Plants'] },
  { n: '04', title: 'On-Site Execution & Supervision', tag: 'Meticulous craftsmanship governed by Resident Engineers', desc: 'Construction proceeds under continuous vigilance. A dedicated Resident Project Manager oversees day-to-day shuttering, rebar binding, concrete pours, curing schedules, and finishing works. Daily digital progress logs and weekly drone aerial scans keep stakeholders fully informed.', deliverables: ['Daily Site Progress Reports (DPR) with photo timestamps', 'Strict stage-gate formwork and rebar inspection sign-offs', '28-day water curing protocols & chemical curing compounds', 'Zero-compromise personal protective equipment (PPE) enforcement'], duration: 'Project-Specific Duration', tools: ['Resident Engineers', 'Total Station Alignment', 'Daily DPR Tracking'] },
  { n: '05', title: 'Quality Assurance & Safety Checks', tag: 'Comprehensive lab verification, audits & turnkey handover', desc: 'Before any structure is handed over, it undergoes rigorous multi-point validation. We conduct concrete core compression tests, non-destructive rebound hammer tests, electrical insulation megger tests, and plumbing pressure tests to ensure flawless operational readiness.', deliverables: ['Third-party NABL certified laboratory test reports', 'As-Built Drawings and operations & maintenance (O&M) manuals', 'Statutory completion certificates and structural safety warranty', 'Seamless client facility handover with staff training'], duration: 'Final 2 - 4 Weeks', tools: ['NABL Accredited Testing', 'Rebound Hammer', 'Ultrasonic Pulse Velocity'] },
];

const CLEARANCES = [
  { title: 'Class-1 Civil Enlistment', authority: 'PWD / CPWD Registered Bihar', certNo: 'CPWD/CL-1/2025/RC-0842', details: 'Authorized for heavy civil, administrative bhawans, roads, and high-value institutional tenders across Bihar and India.' },
  { title: 'GSTIN & Tax Compliance Rating India', authority: 'Govt. of India & State Commercial Tax', certNo: '10AALCR8492K1Z5', details: '100% compliant e-way billing, timely GSTR-1 & 3B filings, and auditable procurement ledgers.' },
  { title: 'Bank Solvency & BG Facilities India', authority: 'State Bank of India (SBI)', certNo: 'SBI/SME/SOLV-14CR/2025', details: 'Solvency clearance certified for ₹10.00+ Crore with active Bank Guarantee (BG) and EMD issuance lines.' },
  { title: 'Statutory Labor & Social Security India', authority: 'Ministry of Labour & Employment', certNo: 'EPFO: BR/PAT/0094120 • ESIC Registered', details: 'Mandatory Provident Fund, ESIC medical insurance, and police verification for all on-site manpower.' },
  { title: 'NABL Laboratory Testing Validation', authority: 'National Accreditation Board (NABL)', certNo: 'IS 456 & IS 1786 Verified', details: 'Mandatory 7-day & 28-day concrete cube compressive tests, steel tensile yield tests, and silt content audits.' },
  { title: 'Integrated Management ISO Triad', authority: 'International Organization for Standardization', certNo: 'ISO 9001:2015 • ISO 14001:2015 • ISO 45001:2018', details: 'Audited quality control, environmental safeguards, and zero-accident occupational safety protocols.' },
];

const COPY = {
  en: {
    lang: 'en-IN',
    locale: 'en_IN',
    hreflang: 'en-IN',
    prefix: '',
    nav: [
      ['Overview', '/about/'],
      ['Services', '/services/'],
      ['Portfolio', '/projects/'],
      ['Locations', '/locations/'],
      ['Presence', '/presence/'],
      ['FAQ', '/faq/'],
      ['Contact', '/contact/'],
      ['Admin', '/admin'],
    ],
    home: 'Home',
    request: 'Request Project Proposal',
    estimate: 'CPWD DSR Cost Estimator — Admin Editable',
    related: 'Related index pages',
    offices: 'Operating offices India',
    verticals: 'Engineering disciplines India',
    crawl: 'Indian SEO Indexing',
    rights: `Copyright © ${new Date().getFullYear()} Rudra Constructions & Suppliers Pvt. Ltd. All rights reserved. Made in Bihar, India.`,
    hosted: 'Served from India region asia-south1 · Timezone Asia/Kolkata · Languages en-IN, hi-IN · Indian SEO Optimized',
    more: 'Read the full interactive site',
  },
};

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function write(rel, content) {
  const full = path.join(PUBLIC, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

const urls = [];
function track(loc, { lastmod = LASTMOD, changefreq = 'weekly', priority = '0.8', image, lang = 'en-IN' } = {}) {
  urls.push({ loc, lastmod, changefreq, priority, image, lang });
}

function hreflangs(enPath) {
  return `
    <link rel="alternate" hreflang="en-IN" href="${esc(abs(enPath))}" />
    <link rel="alternate" hreflang="hi-IN" href="${esc(abs(enPath))}" />
    <link rel="alternate" hreflang="en" href="${esc(abs(enPath))}" />
    <link rel="alternate" hreflang="x-default" href="${esc(abs(enPath))}" />`;
}

function layout({ langKey, pathEn, title, description, keywords, h1, crumbs, image, body, schema, type = 'WebPage' }) {
  const L = COPY[langKey];
  const pagePath = pathEn;
  const canonical = abs(pagePath);
  const ogLocale = L.locale;
  const img = image || IMG.hero;
  const crumbHtml = crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<span aria-current="page">${esc(c.name)}</span>`
        : `<a href="${esc(c.href)}">${esc(c.name)}</a> <span aria-hidden="true">/</span> `
    )
    .join('');
  const nav = L.nav.map(([n, h]) => `<a href="${h}">${esc(n)}</a>`).join('');
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': type,
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: L.lang,
        isPartOf: { '@id': `${abs('/')}#website` },
        about: { '@id': `${abs('/')}#organization` },
        primaryImageOfPage: { '@type': 'ImageObject', url: abs(img) },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.lede'] },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: crumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: abs(c.href),
        })),
      },
      ...(schema ? (Array.isArray(schema) ? schema : [schema]) : []),
    ],
  };

  return `<!doctype html>
<html lang="${L.lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="keywords" content="${esc(keywords)}" />
  <meta name="author" content="${esc(COMPANY.legalName)}" />
  <meta name="publisher" content="${esc(COMPANY.name)}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="bingbot" content="index, follow" />
  <meta name="language" content="${L.lang}" />
  <meta http-equiv="content-language" content="en-IN, hi-IN" />
  <meta name="theme-color" content="#292524" />
  <meta name="format-detection" content="telephone=yes,address=yes,email=yes" />
  <meta name="geo.region" content="IN-BR" />
  <meta name="geo.placename" content="Ramnagar, West Champaran, Bihar, India" />
  <meta name="geo.position" content="27.1667;84.3167" />
  <meta name="ICBM" content="27.1667, 84.3167" />
  <meta name="rating" content="general" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <meta name="color-scheme" content="light" />
  <link rel="canonical" href="${esc(canonical)}" />
  ${hreflangs(pathEn)}
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
  <link rel="alternate" type="application/rss+xml" title="Rudra Constructions RSS India" href="/rss.xml" />
  <link rel="alternate" type="application/atom+xml" title="Rudra Constructions Atom" href="/atom.xml" />
  <link rel="alternate" type="application/feed+json" title="Rudra Constructions JSON Feed" href="/feed.json" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/favicon.svg" />
  <link rel="search" type="application/opensearchdescription+xml" title="Rudra Constructions India" href="/opensearch.xml" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="${ogLocale}" />
  <meta property="og:locale:alternate" content="hi_IN" />
  <meta property="og:site_name" content="${esc(COMPANY.name)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${esc(abs(img))}" />
  <meta property="og:image:alt" content="${esc(title)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(abs(img))}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/seo.css" />
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
  <script>
    (function () {
      var origin = location.origin;
      function abs(u) {
        if (!u) return origin + '/';
        if (/^https?:/i.test(u)) return u;
        return origin + (u.charAt(0) === '/' ? u : '/' + u);
      }
      var canon = document.querySelector('link[rel="canonical"]');
      if (canon) canon.href = abs(canon.getAttribute('href') || '/');
      document.querySelectorAll('link[rel="alternate"]').forEach(function (l) {
        var href = l.getAttribute('href');
        if (href && href.charAt(0) === '/') l.href = abs(href);
      });
      document.querySelectorAll('meta[property="og:url"], meta[property="og:image"], meta[name="twitter:image"]').forEach(function (m) {
        var c = m.getAttribute('content');
        if (c && c.charAt(0) === '/') m.setAttribute('content', abs(c));
      });
    })();
  </script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site">
    <div class="wrap nav">
      <a class="brand" href="/">
        <span class="mark">RC</span>
        <strong>Rudra Constructions</strong><span>&amp; Suppliers</span>
      </a>
      <nav class="links" aria-label="Primary">${nav}</nav>
      <div class="lang">
        <span>EN-IN · HI-IN</span>
      </div>
    </div>
  </header>
  <main id="main" class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">${crumbHtml}</nav>
    <header class="hero">
      <h1>${esc(h1)}</h1>
    </header>
    ${body}
  </main>
  <footer class="site">
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <h2>${esc(COMPANY.name)}</h2>
          <p>${esc(COMPANY.tagline)}</p>
          <p>${esc(COMPANY.address)}, ${esc(COMPANY.district)}, ${esc(COMPANY.state)} ${esc(COMPANY.pincode)}, ${esc(COMPANY.country)}</p>
          <p><a href="tel:+918099588978">${esc(COMPANY.phoneFormatted)}</a><br/>
          <a href="mailto:${COMPANY.email}">${esc(COMPANY.email)}</a></p>
          <p><a href="/admin">Admin Panel — Edit Turnover & Estimation</a></p>
        </div>
        <div>
          <h2>${L.verticals}</h2>
          <p>${SERVICES.map((s) => `<a href="/services/${s.id}/">${esc(s.title)}</a>`).join('<br/>')}</p>
        </div>
        <div>
          <h2>${L.offices}</h2>
          <p>${OFFICES.map((o) => `<a href="/locations/${o.id}/">${esc(o.city)}</a>`).join('<br/>')}</p>
        </div>
        <div>
          <h2>${L.crawl}</h2>
          <p>
            <a href="/sitemap.xml">XML Sitemap</a><br/>
            <a href="/sitemap.html">HTML Sitemap</a><br/>
            <a href="/rss.xml">RSS</a> · <a href="/atom.xml">Atom</a> · <a href="/feed.json">JSON</a><br/>
            <a href="/llms.txt">llms.txt</a> · <a href="/robots.txt">robots.txt</a><br/>
            <a href="/directory/">Citation kit India</a><br/>
            <a href="/admin">Admin — Turnover & Estimator</a>
          </p>
        </div>
      </div>
      <div class="legal">
        <span>${L.rights}</span>
        <span>${L.hosted}</span>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

function serviceBody(s, langKey) {
  const title = s.title;
  return `
    <p class="lede">${esc(s.fullDesc)}</p>
    <div class="meta-row">
      <span class="pill">${esc(s.badge)}</span>
      ${s.compliance.map((c) => `<span class="pill">${esc(c)}</span>`).join('')}
    </div>
    <div class="hero-img"><img src="${s.image}" alt="${esc(title)} — ${esc(COMPANY.name)} Bihar India" width="1200" height="630" /></div>
    <article class="prose" itemscope itemtype="https://schema.org/Service">
      <meta itemprop="name" content="${esc(title)}" />
      <meta itemprop="provider" content="${esc(COMPANY.name)}" />
      <h2>Technical deliverables — Bihar & India</h2>
      <ul>${s.capabilities.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      <h2>Representative works — ${esc(COMPANY.state)}</h2>
      <p>${esc(s.keyProjects)}</p>
      <h2>Compliance — Indian Standards</h2>
      <p>${esc(s.compliance.join(' · '))}</p>
      <div class="actions">
        <a class="cta" href="/contact/">Request Project Proposal — Bihar</a>
        <a class="cta ghost" href="/#services">Read the full interactive site</a>
      </div>
    </article>
    <section class="related">
      <h2>Related index pages — Indian SEO</h2>
      <div class="grid grid-3">
        ${SERVICES.filter((x) => x.id !== s.id)
          .map(
            (x) =>
              `<article class="card"><h3><a href="/services/${x.id}/">${esc(x.title)}</a></h3><p>${esc(x.shortDesc)}</p></article>`
          )
          .join('')}
      </div>
    </section>`;
}

function projectBody(p) {
  return `
    <p class="lede">${esc(p.description)}</p>
    <div class="meta-row">
      <span class="pill">${esc(p.categoryLabel)}</span>
      <span class="pill">${esc(p.status)}</span>
      <span class="pill">${esc(p.year)}</span>
      <span class="pill">${esc(p.state)} India</span>
    </div>
    <div class="hero-img"><img src="${p.image}" alt="${esc(p.title)} Bihar India" width="1200" height="630" /></div>
    <article class="prose" itemscope itemtype="https://schema.org/CreativeWork">
      <div class="kvs">
        <div class="kv"><b>Client</b>${esc(p.client)}</div>
        <div class="kv"><b>Location</b>${esc(p.location)}</div>
        <div class="kv"><b>State</b>${esc(p.state)} India</div>
        <div class="kv"><b>Scope</b>${esc(p.scope)}</div>
        <div class="kv"><b>Status</b>${esc(p.status)}</div>
      </div>
      ${p.metrics.map((m) => `<div class="kv" style="display:inline-block;min-width:160px;margin:4px"><b>${esc(m.label)}</b>${esc(m.value)}</div>`).join('')}
      <h2>Specifications delivered — Bihar</h2>
      <ul>${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <div class="actions">
        <a class="cta" href="/contact/">Request Project Proposal</a>
        <a class="cta ghost" href="/#projects">Read the full interactive site</a>
      </div>
    </article>`;
}

function officeBody(o) {
  return `
    <p class="lede">${esc(o.type)} — ${esc(o.city)}, ${esc(o.state)} ${esc(o.pincode)} India</p>
    <article class="prose" itemscope itemtype="https://schema.org/LocalBusiness">
      <address itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
        <span itemprop="streetAddress">${esc(o.address)}</span><br/>
        <span itemprop="addressLocality">${esc(o.city)}</span>,
        <span itemprop="addressRegion">${esc(o.state)}</span>
        <span itemprop="postalCode">${esc(o.pincode)}</span><br/>
        <span itemprop="addressCountry">IN</span>
      </address>
      <p><a href="tel:+918099588978">${esc(COMPANY.phoneFormatted)}</a> · <a href="mailto:${COMPANY.email}">${esc(COMPANY.email)}</a></p>
      <p>${esc(COMPANY.workingHours)}</p>
      <p><a href="https://www.google.com/maps?q=${o.lat},${o.lng}" rel="noopener noreferrer" target="_blank">Open in Google Maps — ${esc(o.city)}</a></p>
      <div class="actions">
        <a class="cta" href="/contact/">Request Project Proposal</a>
        <a class="cta ghost" href="/#presence">Read the full interactive site</a>
      </div>
    </article>
    <section class="related">
      <h2>Operating offices India</h2>
      <div class="grid grid-3">${OFFICES.filter((x) => x.id !== o.id)
        .map((x) => `<article class="card"><h3><a href="/locations/${x.id}/">${esc(x.city)}</a></h3><p>${esc(x.type)}</p></article>`)
        .join('')}</div>
    </section>`;
}

function emitPage(opts) {
  const html = layout(opts);
  const dest = opts.pathEn.replace(/^\//, '') + 'index.html';
  write(dest, html);
  track(opts.pathEn, {
    priority: opts.priority || '0.8',
    image: opts.image,
    lang: 'en-IN',
  });
}

function keywordsBase() {
  return 'Rudra Constructions Bihar, civil contractor Bihar, Class-1 contractor Bihar, PWD contractor Bihar, CPWD contractor India, Panchayat Sarkar Bhawan builder Bihar, hospital ward contractor Bihar, solar rooftop EPC Bihar, solar street light contractor Bihar, building material supplier West Champaran, Patna civil construction company, Fe 550D TMT supplier Bihar, Grade 53 cement supplier Bihar, government civil contractor Bihar, West Champaran contractor, Ramnagar contractor, turnkey infrastructure contractor India';
}

function run() {
  const langKey = 'en';

  // About
  emitPage({
    langKey,
    pathEn: '/about/',
    title: `About Rudra Constructions & Suppliers | Class-A Civil Contractor Bihar | Turnover ${COMPANY.totalTurnover}`,
    description: COMPANY.subSlogan + ` Turnover ${COMPANY.totalTurnover} — editable via admin panel /admin.`,
    keywords: keywordsBase(),
    h1: 'Engineering infrastructure with purpose and technical rigor — Bihar, India.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'About Bihar', href: '/about/' },
    ],
    image: IMG.hero,
    priority: '0.9',
    type: 'AboutPage',
    body: `
        <p class="lede">${esc(COMPANY.subSlogan)}</p>
        <article class="prose">
          <p>Founded in 2025, Rudra Constructions & Suppliers delivers high-grade civil works, government administrative assets, and clean energy across 11 Indian states. Audited turnover: ${esc(COMPANY.totalTurnover)} — editable via Admin Panel at /admin. Class-1 PWD/CPWD contractor from Ramnagar, West Champaran, Bihar.</p>
          <div class="kvs">
            <div class="kv"><b>CIN</b>${esc(COMPANY.cin)}</div>
            <div class="kv"><b>GSTIN</b>${esc(COMPANY.gstin)}</div>
            <div class="kv"><b>PAN</b>${esc(COMPANY.pan)}</div>
            <div class="kv"><b>MSME</b>${esc(COMPANY.msmeUdyam)}</div>
            <div class="kv"><b>Enlistment</b>${esc(COMPANY.contractorEnlistment)}</div>
            <div class="kv"><b>Solvency</b>${esc(COMPANY.bankSolvency)}</div>
            <div class="kv"><b>Turnover</b>${esc(COMPANY.totalTurnover)} (Admin editable)</div>
          </div>
          <div class="actions"><a class="cta" href="/contact/">Request Project Proposal Bihar</a><a class="cta ghost" href="/#overview">Read the full interactive site</a></div>
        </article>`,
  });

  // Services index + each
  emitPage({
    langKey,
    pathEn: '/services/',
    title: 'Civil, Solar & Materials Services Bihar | PWD CPWD Contractor | Rudra Constructions',
    description:
      'Six turnkey verticals Bihar India: civil & structural, residential & commercial, government infrastructure Panchayat Bhawan, solar EPC MNRE, healthcare modular, certified materials supply Fe 550D TMT.',
    keywords: keywordsBase(),
    h1: 'Turnkey civil engineering and renewable power — Bihar, India.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Services Bihar', href: '/services/' },
    ],
    image: IMG.hero,
    priority: '0.95',
    type: 'CollectionPage',
    schema: {
      '@type': 'ItemList',
      name: 'Rudra service verticals Bihar India',
      numberOfItems: SERVICES.length,
      itemListElement: SERVICES.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: abs(`/services/${s.id}/`),
        name: s.title,
      })),
    },
    body: `<div class="grid grid-2">${SERVICES.map(
      (s) =>
        `<article class="card"><h2><a href="/services/${s.id}/">${esc(s.title)}</a></h2><p>${esc(s.shortDesc)}</p></article>`
    ).join('')}</div>`,
  });

  for (const s of SERVICES) {
    emitPage({
      langKey,
      pathEn: `/services/${s.id}/`,
      title: `${s.title} Bihar | ${COMPANY.name} | Class-A PWD Contractor`,
      description: s.shortDesc,
      keywords: `${s.title} Bihar, ${keywordsBase()}`,
      h1: `${s.title} — Bihar, India`,
      crumbs: [
        { name: COPY.en.home, href: '/' },
        { name: 'Services Bihar', href: '/services/' },
        { name: s.title, href: `/services/${s.id}/` },
      ],
      image: s.image,
      priority: '0.9',
      type: 'Service',
      schema: {
        '@type': 'Service',
        name: s.title,
        description: s.fullDesc,
        provider: { '@id': `${abs('/')}#organization` },
        areaServed: { '@type': 'Country', name: 'India' },
      },
      body: serviceBody(s, langKey),
    });
  }

  // Projects
  emitPage({
    langKey,
    pathEn: '/projects/',
    title: 'Project Portfolio Bihar | Panchayat Bhawan, Hospital, Solar | Rudra Constructions',
    description:
      'Administrative complexes Bihar, hospital wards, rural solar grids, and bulk logistics delivered to exact statutory standards. Admin editable at /admin.',
    keywords: keywordsBase(),
    h1: 'Engineered with precision across Bihar and India — Admin editable.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Portfolio Bihar', href: '/projects/' },
    ],
    image: IMG.civic,
    priority: '0.95',
    type: 'CollectionPage',
    body: `<div class="grid grid-2">${PROJECTS.map(
      (p) =>
        `<article class="card"><h2><a href="/projects/${p.id}/">${esc(p.title)}</a></h2><p>${esc(p.client)} · ${esc(p.state)} · ${esc(p.year)}</p><p>${esc(p.description)}</p></article>`
    ).join('')}</div>`,
  });

  for (const p of PROJECTS) {
    emitPage({
      langKey,
      pathEn: `/projects/${p.id}/`,
      title: `${p.title} Bihar | ${COMPANY.name} | ${p.state}`,
      description: p.description,
      keywords: `${p.title} Bihar, ${p.client}, ${p.state}, ${keywordsBase()}`,
      h1: `${p.title} — ${p.state}, India`,
      crumbs: [
        { name: COPY.en.home, href: '/' },
        { name: 'Portfolio Bihar', href: '/projects/' },
        { name: p.title, href: `/projects/${p.id}/` },
      ],
      image: p.image,
      priority: '0.85',
      schema: {
        '@type': 'CreativeWork',
        name: p.title,
        description: p.description,
        dateCreated: '2025',
        creator: { '@id': `${abs('/')}#organization` },
        locationCreated: { '@type': 'Place', name: `${p.location}, ${p.state}` },
      },
      body: projectBody(p),
    });
  }

  // Locations
  emitPage({
    langKey,
    pathEn: '/locations/',
    title: 'Offices & Operating Hubs Bihar, Delhi NCR, Assam | Rudra Constructions India',
    description: 'Registered Headquarters Ramnagar, West Champaran Bihar 845103; Regional Corporate Hub Ghaziabad Delhi NCR; Patna; Bettiah; Biswanath Assam; Jorhat Assam.',
    keywords: keywordsBase(),
    h1: 'Registered headquarters Ramnagar and operating hubs — India.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Locations India', href: '/locations/' },
    ],
    image: IMG.hero,
    priority: '0.9',
    body: `<div class="grid grid-2">${OFFICES.map(
      (o) =>
        `<article class="card"><h2><a href="/locations/${o.id}/">${esc(o.city)}</a></h2><p>${esc(o.type)}</p><p>${esc(o.address)}, ${esc(o.pincode)} India</p></article>`
    ).join('')}</div>`,
  });

  for (const o of OFFICES) {
    emitPage({
      langKey,
      pathEn: `/locations/${o.id}/`,
      title: `${o.city} ${o.type} | ${COMPANY.name} | Bihar India`,
      description: `${o.type}, ${o.address}, ${o.city}, ${o.state} ${o.pincode}. ${COMPANY.phoneFormatted} — Indian SEO`,
      keywords: `${o.city}, ${o.state}, Rudra Constructions office Bihar, ${keywordsBase()}`,
      h1: `${o.city} — ${o.type} — India`,
      crumbs: [
        { name: COPY.en.home, href: '/' },
        { name: 'Locations India', href: '/locations/' },
        { name: o.city, href: `/locations/${o.id}/` },
      ],
      image: IMG.hero,
      priority: '0.8',
      schema: {
        '@type': 'LocalBusiness',
        name: `${COMPANY.name} — ${o.city}`,
        telephone: COMPANY.phone,
        email: COMPANY.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: o.address,
          addressLocality: o.city,
          addressRegion: o.state,
          postalCode: o.pincode,
          addressCountry: 'IN',
        },
        geo: { '@type': 'GeoCoordinates', latitude: o.lat, longitude: o.lng },
      },
      body: officeBody(o),
    });
  }

  // Presence / states
  emitPage({
    langKey,
    pathEn: '/presence/',
    title: 'Pan-India Presence — 11 States Bihar, UP, Assam | Rudra Constructions India',
    description: 'Bihar, Uttar Pradesh, Jharkhand, Odisha, Assam, Meghalaya, Tripura, Arunachal Pradesh, Haryana, Punjab, Jammu & Kashmir — Class-A civil contractor.',
    keywords: keywordsBase(),
    h1: 'Operational presence across 11 Indian states — Bihar HQ.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Presence India', href: '/presence/' },
    ],
    image: IMG.hero,
    priority: '0.9',
    body: `<div class="grid grid-3">${STATES.map(
      (s) =>
        `<article class="card"><h2><a href="/presence/${s.id}/">${esc(s.name)} civil contractor</a></h2><p>${esc(s.region)} India · ${s.count} active projects</p><p>${esc(s.focus.join(', '))}</p></article>`
    ).join('')}</div>`,
  });

  for (const s of STATES) {
    const relatedSites = WORKSITES.filter((w) => w.state.toLowerCase().includes(s.name.split(' ')[0].toLowerCase()) || w.state === s.name);
    emitPage({
      langKey,
      pathEn: `/presence/${s.id}/`,
      title: `${s.name} civil contractor, solar & infrastructure | ${COMPANY.name} India`,
      description: `${COMPANY.name} in ${s.name} (${s.code}). Focus: ${s.focus.join(', ')}. Key clients: ${s.clients.join(', ')}. Active projects: ${s.count}. Indian SEO.`,
      keywords: `${s.name} contractor Bihar, ${s.name} civil construction company, ${keywordsBase()}`,
      h1: `${s.name} — ${s.count} active projects — ${s.code} India`,
      crumbs: [
        { name: COPY.en.home, href: '/' },
        { name: 'Presence India', href: '/presence/' },
        { name: s.name, href: `/presence/${s.id}/` },
      ],
      image: IMG.hero,
      priority: '0.8',
      body: `
          <p class="lede">${esc(s.region)} India · ${esc(s.clients.join(', '))} — Class-A contractor</p>
          <article class="prose">
            <h2>Focus areas — ${esc(s.name)} India</h2>
            <ul>${s.focus.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
            <h2>Key clients — ${esc(s.name)}</h2>
            <ul>${s.clients.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
            ${
              relatedSites.length
                ? `<h2>Worksites in ${esc(s.name)}</h2><ul>${relatedSites
                    .map((w) => `<li><a href="/worksites/${w.id}/">${esc(w.title)}</a> — ${esc(w.city)} India</li>`)
                    .join('')}</ul>`
                : ''
            }
          </article>`,
    });
  }

  // Worksites
  emitPage({
    langKey,
    pathEn: '/worksites/',
    title: 'Worksites Map Index Bihar, UP, Assam, Jharkhand | Rudra Constructions India',
    description: '18 indexed worksites across Bihar, Uttar Pradesh, Assam, Jharkhand, Odisha, Jammu & Kashmir, Chhattisgarh, Arunachal Pradesh and Madhya Pradesh — Indian SEO.',
    keywords: keywordsBase(),
    h1: 'Geocoded worksite index — 18 sites India.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Worksites India', href: '/worksites/' },
    ],
    image: IMG.hero,
    priority: '0.85',
    body: `<div class="grid grid-2">${WORKSITES.map(
      (w) =>
        `<article class="card"><h2><a href="/worksites/${w.id}/">${esc(w.title)}</a></h2><p>${esc(w.city)}, ${esc(w.state)} India · ${esc(w.status)} · ${esc(w.value)}</p></article>`
    ).join('')}</div>`,
  });

  for (const w of WORKSITES) {
    emitPage({
      langKey,
      pathEn: `/worksites/${w.id}/`,
      title: `${w.title} | ${w.city} Bihar India | ${COMPANY.name}`,
      description: `${w.scope} Client: ${w.client}. ${w.status} ${w.year}. ${w.value}. Indian contractor.`,
      keywords: `${w.city} contractor, ${w.state} civil works, ${w.title} Bihar, ${keywordsBase()}`,
      h1: `${w.title} — ${w.city}, India`,
      crumbs: [
        { name: COPY.en.home, href: '/' },
        { name: 'Worksites India', href: '/worksites/' },
        { name: w.city, href: `/worksites/${w.id}/` },
      ],
      image: w.image,
      priority: '0.7',
      schema: {
        '@type': 'Place',
        name: w.title,
        description: w.scope,
        geo: { '@type': 'GeoCoordinates', latitude: w.lat, longitude: w.lng },
        address: { '@type': 'PostalAddress', addressLocality: w.city, addressRegion: w.state, addressCountry: 'IN' },
      },
      body: `
          <p class="lede">${esc(w.scope)}</p>
          <div class="hero-img"><img src="${w.image}" alt="${esc(w.title)} Bihar India" width="1200" height="630" /></div>
          <article class="prose">
            <div class="kvs">
              <div class="kv"><b>City</b>${esc(w.city)}</div>
              <div class="kv"><b>State</b>${esc(w.state)} India</div>
              <div class="kv"><b>Client</b>${esc(w.client)}</div>
              <div class="kv"><b>Status</b>${esc(w.status)}</div>
              <div class="kv"><b>Year</b>${esc(w.year)}</div>
              <div class="kv"><b>Value</b>${esc(w.value)}</div>
              <div class="kv"><b>Metric</b>${esc(w.metric)}</div>
              <div class="kv"><b>Geo</b>${w.lat}, ${w.lng} India</div>
            </div>
            <p><a href="https://www.google.com/maps?q=${w.lat},${w.lng}" rel="noopener noreferrer" target="_blank">Google Maps — ${esc(w.city)} India</a></p>
          </article>`,
    });
  }

  // Clients
  emitPage({
    langKey,
    pathEn: '/clients/',
    title: 'Clients & Government Partners Bihar | Panchayati Raj, BCD | Rudra Constructions India',
    description: CLIENTS.map((c) => c.name).join(', ') + ' — Government clients Bihar India.',
    keywords: keywordsBase(),
    h1: 'Clients & government partners — Bihar, India.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Clients Bihar', href: '/clients/' },
    ],
    image: IMG.civic,
    priority: '0.85',
    body: `<div class="grid grid-2">${CLIENTS.map(
      (c) => `<article class="card"><h2>${esc(c.name)}</h2><p>${esc(c.category)} · ${esc(c.region)} India</p><p>${esc(c.description)}</p></article>`
    ).join('')}</div>`,
  });

  // FAQ
  emitPage({
    langKey,
    pathEn: '/faq/',
    title: 'Frequently Asked Questions Bihar | Turnover, Estimation, Projects | Rudra Constructions India',
    description: FAQS.map((f) => f.q).join(' ') + ' Indian SEO.',
    keywords: keywordsBase(),
    h1: 'Frequently asked questions — Bihar India — Turnover editable via admin.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'FAQ India', href: '/faq/' },
    ],
    image: IMG.hero,
    priority: '0.85',
    type: 'FAQPage',
    schema: {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    body: `<article class="prose" itemscope itemtype="https://schema.org/FAQPage">${FAQS.map(
      (f) =>
        `<section itemscope itemprop="mainEntity" itemtype="https://schema.org/Question"><h2 itemprop="name">${esc(f.q)}</h2><div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer"><p itemprop="text">${esc(f.a)}</p></div></section>`
    ).join('')}</article>`,
  });

  // Methodology
  emitPage({
    langKey,
    pathEn: '/methodology/',
    title: '5-Stage Execution Methodology Bihar India | PWD CPWD | Rudra Constructions',
    description: STEPS.map((s) => s.title).join(', ') + ' — Indian DSR, admin editable estimation.',
    keywords: keywordsBase(),
    h1: '5-stage project execution lifecycle — Bihar India.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Methodology India', href: '/methodology/' },
    ],
    image: IMG.hero,
    priority: '0.85',
    type: 'HowTo',
    schema: {
      '@type': 'HowTo',
      name: 'Rudra 5-stage project execution lifecycle Bihar India',
      step: STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.desc })),
    },
    body: `<div class="grid">${STEPS.map(
      (s) =>
        `<article class="card"><h2><a href="/methodology/${s.n}/">${esc(s.n)}. ${esc(s.title)}</a></h2><p>${esc(s.tag)}</p><p>${esc(s.desc)}</p></article>`
    ).join('')}</div>`,
  });

  for (const s of STEPS) {
    emitPage({
      langKey,
      pathEn: `/methodology/${s.n}/`,
      title: `Stage ${s.n}: ${s.title} Bihar India | ${COMPANY.name}`,
      description: s.desc,
      keywords: keywordsBase(),
      h1: `${s.n}. ${s.title} — India`,
      crumbs: [
        { name: COPY.en.home, href: '/' },
        { name: 'Methodology India', href: '/methodology/' },
        { name: s.n, href: `/methodology/${s.n}/` },
      ],
      image: IMG.hero,
      priority: '0.7',
      body: `<article class="prose"><p class="lede">${esc(s.tag)}</p><p>${esc(s.desc)}</p><h2>Deliverables</h2><ul>${s.deliverables.map((d) => `<li>${esc(d)}</li>`).join('')}</ul><p><b>Duration:</b> ${esc(s.duration)}</p><p><b>Tools:</b> ${esc(s.tools.join(', '))}</p></article>`,
    });
  }

  // Quality / credentials / contact / estimator / directory / press / admin
  emitPage({
    langKey,
    pathEn: '/quality/',
    title: 'Quality, Safety & Compliance Bihar India | IS 456, NABL | Rudra Constructions',
    description: 'IS 456, IS 1893, IS 1786, NBC 2016, NABL cube testing, ISO 9001:2015, ISO 14001:2015, ISO 45001:2018 Bihar India.',
    keywords: keywordsBase(),
    h1: 'Quality, safety & compliance — Bihar India.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Quality India', href: '/quality/' },
    ],
    image: IMG.hero,
    priority: '0.85',
    body: `<article class="prose"><p>Every civic, healthcare, and solar infrastructure project in Bihar adheres strictly to statutory mandates and Indian standard codes. Class-1 contractor compliance.</p>
        <h2>ISO / NABL / PWD Bihar</h2>
        <ul>${CLEARANCES.map((c) => `<li><b>${esc(c.title)}</b> — ${esc(c.authority)} · ${esc(c.certNo)}. ${esc(c.details)}</li>`).join('')}</ul>
        <p><a href="/credentials/">View credentials index Bihar</a></p></article>`,
  });

  emitPage({
    langKey,
    pathEn: '/credentials/',
    title: 'Statutory Credentials Bihar India | PWD CPWD, GSTIN, ISO | Rudra Constructions',
    description: CLEARANCES.map((c) => `${c.title} ${c.certNo}`).join(' · ') + ' Bihar India.',
    keywords: keywordsBase(),
    h1: 'Statutory credentials and clearances — Bihar India.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Credentials India', href: '/credentials/' },
    ],
    image: IMG.hero,
    priority: '0.8',
    body: `<div class="grid grid-2">${CLEARANCES.map(
      (c) => `<article class="card"><h2>${esc(c.title)}</h2><p>${esc(c.authority)} Bihar India</p><p><b>${esc(c.certNo)}</b></p><p>${esc(c.details)}</p></article>`
    ).join('')}</div>`,
  });

  emitPage({
    langKey,
    pathEn: '/contact/',
    title: 'Contact, Tenders & RFP Bihar | +91 8099588978 | Rudra Constructions India',
    description: `Tender hotline ${COMPANY.phoneFormatted} Bihar. ${COMPANY.email}. ${COMPANY.address}, ${COMPANY.district}, ${COMPANY.state} ${COMPANY.pincode} India. Admin editable turnover and estimation.`,
    keywords: keywordsBase(),
    h1: 'Initiate a project or tender RFP — Bihar India.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Contact Bihar', href: '/contact/' },
    ],
    image: IMG.hero,
    priority: '0.95',
    type: 'ContactPage',
    body: `<article class="prose">
        <p class="lede">${esc(COMPANY.workingHours)} — Indian Timezone Asia/Kolkata</p>
        <p><a href="tel:+918099588978">${esc(COMPANY.phoneFormatted)}</a><br/>
        <a href="mailto:${COMPANY.email}">${esc(COMPANY.email)}</a><br/>
        <a href="https://wa.me/918099588978">WhatsApp Bihar</a></p>
        <address>${esc(COMPANY.address)}, ${esc(COMPANY.district)}, ${esc(COMPANY.state)} ${esc(COMPANY.pincode)}, ${esc(COMPANY.country)}</address>
        <p>Admin Panel: <a href="/admin">/admin — Edit Turnover & Estimation Rates</a></p>
        <div class="actions"><a class="cta" href="/#contact">Read the full interactive site</a><a class="cta ghost" href="/estimator/">CPWD DSR Estimator — Admin Editable</a></div>
      </article>`,
  });

  emitPage({
    langKey,
    pathEn: '/estimator/',
    title: 'CPWD DSR Project Cost Estimator Bihar India | Admin Editable Rates | Rudra Constructions',
    description: 'Interactive project cost estimator and BOQ engine for civic, healthcare, solar, infrastructure and materials packages Bihar India — rates editable via admin panel /admin.',
    keywords: keywordsBase(),
    h1: 'Interactive project cost estimator — Bihar India — Admin editable.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Estimator Bihar India', href: '/estimator/' },
    ],
    image: IMG.hero,
    priority: '0.85',
    body: `<article class="prose"><p>Open the interactive estimator on the main site to submit project parameters. Rates are managed from Admin Panel → Estimation Rates at /admin. Tender estimation typically responds within 24–48 business hours with a preliminary BOQ review. Indian SEO — Asia/Kolkata.</p>
        <div class="actions"><a class="cta" href="/#estimator">CPWD DSR Estimator — Bihar</a><a class="cta ghost" href="/contact/">Request Project Proposal</a><br/><a class="cta" href="/admin">Admin Panel — Edit Estimation Rates</a></div></article>`,
  });

  emitPage({
    langKey,
    pathEn: '/directory/',
    title: 'Citation & Backlink Kit Bihar India | NAP | Rudra Constructions',
    description: 'Official NAP, identifiers and embeddable citation block for directories, partners and journalists — Indian SEO. Same company data only.',
    keywords: keywordsBase(),
    h1: 'Official citation and backlink kit — Bihar India.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Directory India', href: '/directory/' },
    ],
    image: IMG.hero,
    priority: '0.7',
    body: `<article class="prose">
        <p>Use this canonical NAP block on directories, partner pages and press across India. Do not alter statutory identifiers. Indian SEO optimized.</p>
        <pre style="white-space:pre-wrap;background:#fafafa;border:1px solid #e7e5e4;border-radius:12px;padding:16px;font-size:13px">${esc(`${COMPANY.legalName}
${COMPANY.address}
${COMPANY.district}, ${COMPANY.state} ${COMPANY.pincode}, ${COMPANY.country}
${COMPANY.phoneFormatted}
${COMPANY.email}
GSTIN ${COMPANY.gstin} · CIN ${COMPANY.cin} · PAN ${COMPANY.pan} · MSME ${COMPANY.msmeUdyam}
Turnover: ${COMPANY.totalTurnover} (Editable via /admin)` )}</pre>
        <h2>Suggested anchor text — Indian SEO</h2>
        <ul>
          <li>Rudra Constructions &amp; Suppliers Bihar</li>
          <li>Class-A civil contractor Bihar</li>
          <li>Panchayat Sarkar Bhawan builder West Champaran</li>
          <li>Fe 550D TMT supplier Patna Bihar</li>
          <li>Rooftop solar EPC Bihar India</li>
          <li>Civil contractor Ramnagar West Champaran</li>
        </ul>
        <h2>Authoritative outbound references — India</h2>
        <ul>
          <li><a href="https://cpwd.gov.in/" rel="noopener noreferrer">CPWD India</a></li>
          <li><a href="https://bis.gov.in/" rel="noopener noreferrer">Bureau of Indian Standards BIS</a></li>
          <li><a href="https://mnre.gov.in/" rel="noopener noreferrer">MNRE India</a></li>
          <li><a href="https://state.bihar.gov.in/" rel="noopener noreferrer">Government of Bihar</a></li>
          <li><a href="https://www.iso.org/" rel="noopener noreferrer">ISO</a></li>
        </ul>
        <h2>Embed — Indian SEO</h2>
        <pre style="white-space:pre-wrap;background:#fafafa;border:1px solid #e7e5e4;border-radius:12px;padding:16px;font-size:13px">${esc(
          `<a href="${abs('/')}" rel="noopener">Rudra Constructions & Suppliers — Class-A civil contractor Bihar, solar & infrastructure India</a>`
        )}</pre>
      </article>`,
  });

  emitPage({
    langKey,
    pathEn: '/press/',
    title: 'Press & 2025 Delivery Milestones Bihar India | Rudra Constructions',
    description: 'Indexed 2025 project completions and commissioning notes drawn from the official portfolio Bihar India — no invented claims.',
    keywords: keywordsBase(),
    h1: '2025 delivery milestones — Bihar India.',
    crumbs: [
      { name: COPY.en.home, href: '/' },
      { name: 'Press Bihar', href: '/press/' },
    ],
    image: IMG.civic,
    priority: '0.7',
    type: 'CollectionPage',
    body: `<div class="grid">${PROJECTS.map(
      (p) =>
        `<article class="card"><h2><a href="/projects/${p.id}/">${esc(p.title)} Bihar</a></h2><p>${esc(p.year)} · ${esc(p.status)} · ${esc(p.client)} India</p></article>`
    ).join('')}</div>`,
  });

  // NOTE: No static /admin/ page is emitted. The admin console is a client-side
  // React SPA served from index.html at /admin (handled by the SPA fallback in
  // server.js, vite.config.ts and vercel.json). Generating public/admin/index.html
  // shadows the SPA on trailing-slash requests (/admin/) — which serve the static
  // SEO stub instead of the real login console. /admin/ is also robots-disallowed.

  // HTML sitemap
  const htmlMap = layout({
    langKey: 'en',
    pathEn: '/sitemap.html',
    title: 'HTML Sitemap Bihar India | Rudra Constructions & Suppliers',
    description: 'Complete crawlable HTML sitemap of all Indian SEO index pages — Bihar contractor.',
    keywords: keywordsBase(),
    h1: 'HTML sitemap — every indexable URL — Indian SEO Bihar India.',
    crumbs: [
      { name: 'Home', href: '/' },
      { name: 'Sitemap India', href: '/sitemap.html' },
    ],
    image: IMG.hero,
    priority: '0.6',
    body: `<article class="prose"><ul>${urls
      .map((u) => `<li><a href="${esc(u.loc)}">${esc(u.loc)}</a> <small>(${esc(u.lang)}) — Indian SEO</small></li>`)
      .join('')}</ul></article>`,
  });
  write('sitemap.html', htmlMap);
  track('/sitemap.html', { priority: '0.4', changefreq: 'weekly' });

  // robots — Indian SEO, disallow admin for security but allow indexing of main site
  write(
    'robots.txt',
    `# Rudra Constructions & Suppliers — Indian SEO full indexing
# Deploy region: asia-south1 (India)
# Timezone: Asia/Kolkata
# Languages: en-IN, hi-IN
# Admin: /admin — turnover & estimation editable

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /src/

User-agent: Googlebot
Allow: /
User-agent: Googlebot-Image
Allow: /
User-agent: Googlebot-News
Allow: /
User-agent: AdsBot-Google
Allow: /
User-agent: APIs-Google
Allow: /
User-agent: Bingbot
Allow: /
User-agent: Slurp
Allow: /
User-agent: DuckDuckBot
Allow: /
User-agent: Baiduspider
Allow: /
User-agent: YandexBot
Allow: /
User-agent: Applebot
Allow: /
User-agent: facebookexternalhit
Allow: /
User-agent: Twitterbot
Allow: /
User-agent: LinkedInBot
Allow: /
User-agent: WhatsApp
Allow: /
User-agent: TelegramBot
Allow: /
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Bytespider
Allow: /
User-agent: Amazonbot
Allow: /
User-agent: CCBot
Allow: /
User-agent: ia_archiver
Allow: /
User-agent: archive.org_bot
Allow: /

Host: __SITE_ORIGIN__

Sitemap: ${abs('/sitemap.xml')}
Sitemap: ${abs('/sitemap-pages.xml')}
Sitemap: ${abs('/sitemap-images.xml')}
Sitemap: ${abs('/rss.xml')}
`
  );

  const urlset = (list) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${list
  .map((u) => {
    return `  <url>
    <loc>${esc(abs(u.loc))}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${esc(abs(u.loc))}" />
    <xhtml:link rel="alternate" hreflang="hi-IN" href="${esc(abs(u.loc))}" />
    <xhtml:link rel="alternate" hreflang="en" href="${esc(abs(u.loc))}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(abs(u.loc))}" />
    ${u.image ? `<image:image><image:loc>${esc(abs(u.image))}</image:loc><image:title>${esc(COMPANY.name)} Bihar India</image:title><image:caption>${esc(COMPANY.tagline)}</image:caption></image:image>` : ''}
  </url>`;
  })
  .join('\n')}
</urlset>
`;

  const imgUrls = urls.filter((u) => u.image);

  write('sitemap-pages.xml', urlset(urls));
  write('sitemap-images.xml', urlset(imgUrls));
  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${esc(abs('/sitemap-pages.xml'))}</loc><lastmod>${LASTMOD}</lastmod></sitemap>
  <sitemap><loc>${esc(abs('/sitemap-images.xml'))}</loc><lastmod>${LASTMOD}</lastmod></sitemap>
</sitemapindex>
`
  );

  const rssItems = PROJECTS.map(
    (p) => `    <item>
      <title>${esc(p.title)} Bihar India</title>
      <link>${esc(abs(`/projects/${p.id}/`))}</link>
      <guid>${esc(abs(`/projects/${p.id}/`))}</guid>
      <pubDate>Thu, 01 May 2025 08:30:00 +0530</pubDate>
      <description>${esc(p.description)} — Turnover ${esc(COMPANY.totalTurnover)} — Bihar India</description>
    </item>`
  ).join('\n');

  write(
    'rss.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(COMPANY.name)} — Class-A Civil Contractor Bihar India</title>
    <link>${esc(abs('/'))}</link>
    <description>${esc(COMPANY.subSlogan)} Turnover ${esc(COMPANY.totalTurnover)} — Indian SEO Bihar</description>
    <language>en-IN</language>
    <lastBuildDate>Thu, 04 Sep 2026 08:00:00 +0530</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${esc(abs('/rss.xml'))}" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`
  );

  write(
    'atom.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(COMPANY.name)} — Bihar India</title>
  <link href="${esc(abs('/'))}" />
  <link rel="self" href="${esc(abs('/atom.xml'))}" />
  <updated>2026-09-04T08:00:00+05:30</updated>
  <id>${esc(abs('/'))}</id>
  <author><name>${esc(COMPANY.legalName)}</name><email>${esc(COMPANY.email)}</email></author>
  ${PROJECTS.map(
    (p) => `<entry><title>${esc(p.title)} Bihar India</title><link href="${esc(abs(`/projects/${p.id}/`))}" /><id>${esc(abs(`/projects/${p.id}/`))}</id><updated>2025-05-01T08:30:00+05:30</updated><summary>${esc(p.description)}</summary></entry>`
  ).join('\n  ')}
</feed>
`
  );

  write(
    'feed.json',
    JSON.stringify(
      {
        version: 'https://jsonfeed.org/version/1.1',
        title: COMPANY.name + ' — Bihar India',
        home_page_url: abs('/'),
        feed_url: abs('/feed.json'),
        description: COMPANY.subSlogan + ` Turnover ${COMPANY.totalTurnover} — Indian SEO`,
        language: 'en-IN',
        items: PROJECTS.map((p) => ({
          id: abs(`/projects/${p.id}/`),
          url: abs(`/projects/${p.id}/`),
          title: p.title + ' Bihar India',
          content_text: p.description,
          date_published: '2025-05-01T08:30:00+05:30',
        })),
      },
      null,
      2
    )
  );

  write(
    'llms.txt',
    `# ${COMPANY.name} — Indian SEO

> ${COMPANY.tagline}

${COMPANY.subSlogan}

- Legal name: ${COMPANY.legalName}
- Founded: ${COMPANY.foundedYear}
- Turnover: ${COMPANY.totalTurnover} (Editable via Admin Panel at /admin)
- CIN: ${COMPANY.cin}
- GSTIN: ${COMPANY.gstin}
- PAN: ${COMPANY.pan}
- MSME: ${COMPANY.msmeUdyam}
- Enlistment: ${COMPANY.contractorEnlistment}
- Phone: ${COMPANY.phone}
- Email: ${COMPANY.email}
- HQ: ${COMPANY.address}, ${COMPANY.district}, ${COMPANY.state} ${COMPANY.pincode}, ${COMPANY.country} India
- Timezone: Asia/Kolkata
- Region: asia-south1 India
- Languages: en-IN, hi-IN

## Indian SEO Keywords
${keywordsBase()}

## Index — India
- [Home](/) — Class-A Civil Contractor Bihar
- [About](/about/) — Turnover ${COMPANY.totalTurnover}
- [Services](/services/) — 6 verticals Bihar India
- [Projects](/projects/) — Portfolio Bihar (Admin editable)
- [Locations](/locations/) — Ramnagar, Patna, Bettiah, Ghaziabad, Assam
- [Presence](/presence/) — 11 states Pan-India
- [Worksites](/worksites/) — 18 geocoded sites
- [Clients](/clients/) — Govt partners Bihar
- [FAQ](/faq/) — Indian SEO
- [Methodology](/methodology/) — 5-stage
- [Quality](/quality/) — IS 456, NABL
- [Credentials](/credentials/) — PWD CPWD ISO
- [Contact](/contact/) — Tender RFP Bihar +91 8099588978
- [Estimator](/estimator/) — CPWD DSR rates editable via /admin
- [Admin](/admin) — Edit Turnover, Projects, Estimation Rates
- [Citation kit](/directory/) — NAP Bihar India
- [Sitemap](/sitemap.html) — Indian SEO sitemap

## Admin Features — Fixed
- Admin at /admin now renders (SPA fallback fixed)
- Turnover editable: Admin → Turnover & Company → change ₹14.65 Crore to any value live
- Project estimation rates editable: Admin → Estimation Rates → per vertical per grade
- Projects CRUD: Admin → Projects → add/edit/delete
- Photos, Blogs, Placements, Settings also available
`
  );

  write(
    'llms-full.txt',
    `# ${COMPANY.name} — full facts for AI crawlers — Indian SEO

${COMPANY.subSlogan} Turnover ${COMPANY.totalTurnover} (editable via /admin).

## Identity — India
${JSON.stringify(COMPANY, null, 2)}

## Services — Bihar India
${SERVICES.map((s) => `### ${s.title} Bihar India\n${s.fullDesc}\n- ${s.capabilities.join('\n- ')}`).join('\n\n')}

## Projects — Bihar India (Admin editable)
${PROJECTS.map((p) => `### ${p.title} Bihar India\n${p.description}\nClient: ${p.client}\n${p.highlights.join('\n')}`).join('\n\n')}

## Offices — India
${OFFICES.map((o) => `- ${o.type}: ${o.address}, ${o.city}, ${o.state} ${o.pincode} India`).join('\n')}

## FAQ — Indian SEO
${FAQS.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}

## Admin Panel — Fixed and Enhanced
- URL: /admin
- Features: Edit Turnover (14 Crore etc), Edit Project Estimation Rates, CRUD Projects, Photos, Blogs, Placements, Settings
- Indian SEO: timezone Asia/Kolkata, region asia-south1, languages en-IN hi-IN
`
  );

  write(
    'humans.txt',
    `/* TEAM — Indian SEO */
Publisher: ${COMPANY.legalName}
Contact: ${COMPANY.email}
Location: ${COMPANY.address}, ${COMPANY.district}, ${COMPANY.state} ${COMPANY.pincode}, ${COMPANY.country} India
Phone: ${COMPANY.phoneFormatted}

/* SITE */
Last update: ${LASTMOD}
Languages: en-IN, hi-IN, en
Standards: HTML5, Schema.org, Open Graph, IndexNow, llms.txt, RSS, Atom, JSON Feed
Deploy: India asia-south1, timezone Asia/Kolkata, country IN
SEO: Indian SEO optimized — Class-A civil contractor Bihar, PWD CPWD, Panchayat Sarkar Bhawan builder
Admin: /admin — Turnover & Estimation editable, SPA fallback fixed
`
  );

  const urlCount = urls.length;
  write(
    'seo-index.json',
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        timezone: 'Asia/Kolkata',
        region: 'asia-south1',
        country: 'IN',
        languages: ['en-IN', 'hi-IN', 'en'],
        seo: 'Indian SEO',
        urlCount,
        indexnowKey: INDEXNOW_KEY,
        urls: urls.map((u) => u.loc),
        admin: '/admin — turnover & estimation editable — SPA fallback fixed',
      },
      null,
      2
    )
  );

  console.log(`Indian SEO generator wrote ${urlCount} indexable URLs into public/ — timezone Asia/Kolkata region asia-south1`);
}

run();
