import heroImg from '../assets/images/rudra_hero_construction_1788465374495.jpg';
import solarImg from '../assets/images/rudra_solar_infra_1788465391292.jpg';
import civicImg from '../assets/images/rudra_civic_bhawan_1788465407931.jpg';
import hospitalImg from '../assets/images/rudra_hospital_ward_1788465423465.jpg';

import {
  ServiceVertical,
  ProjectItem,
  OfficeLocation,
  StatePresence,
  ExecutionStep,
  ClientPartner,
  FAQItem,
  WorkSiteLocation
} from '../types';

export const COMPANY_INFO = {
  name: "Rudra Constructions & Suppliers",
  legalName: "Rudra Constructions & Suppliers Pvt. Ltd.",
  foundedYear: 2025,
  tagline: "Engineering Trust. Constructing Excellence",
  slogan: "Building India's infrastructure with structural integrity & certified craftsmanship",
  subSlogan: "From structural engineering to turnkey commissioning, we deliver certified Class-1 civil construction, hospital wards, solar microgrids, and bulk materials across 11 Indian states.",
  totalTurnover: "₹14.65 Crore",
  cin: "U45200BR2025PTC049182",
  gstin: "10AALCR8492K1Z5",
  pan: "AALCR8492K",
  msmeUdyam: "UDYAM-BR-38-0028491",
  contractorEnlistment: "Class-1 (Super Heavy) Civil Contractor • PWD / CPWD Enlisted",
  bankSolvency: "₹10.00+ Crore Certified Solvency (State Bank of India)",
  registeredOffice: {
    address: "Ward No.2, Sikta Belwa, Ramnagar",
    district: "West Champaran",
    state: "Bihar",
    pincode: "845103",
    country: "India"
  },
  phone: "+91 8099588978",
  phoneFormatted: "+91 80995 88978",
  email: "rudraconstructionsupplier14@gmail.com",
  workingHours: "Monday - Saturday: 8:30 AM - 7:00 PM IST",
  stats: [
    { label: "Delivered Turnover", value: "₹14.65 Cr+", change: "Audited 2025" },
    { label: "States Served", value: "11 States", change: "Pan-India Reach" },
    { label: "Infrastructure Projects", value: "35+", change: "Government & Institutional" },
    { label: "Solar Installations", value: "1,200+", change: "kW & Street Lights" },
    { label: "Workforce & Engineers", value: "250+", change: "Police-Verified Team" },
    { label: "Safety Record", value: "100%", change: "Zero LTI Incidents" }
  ]
};

export const MISSION_VISION = {
  mission: "To become a trusted and respected leader in the construction and infrastructure industry by delivering durable, innovative, and sustainable solutions that elevate human communities.",
  missionPillars: [
    "Deliver high-quality construction and infrastructure services without compromise",
    "Complete projects strictly on time and within agreed budgetary limits",
    "Promote sustainable, eco-friendly building practices and renewable energy adoption",
    "Build enduring, generational partnerships based on mutual trust, transparency, and ethics"
  ],
  vision: "To pioneer India's next-generation green infrastructure, accelerating civil expansion, modernizing rural civic hubs, and scaling clean solar power into every underserved district.",
  visionPillars: [
    "Expansion into larger national highway, bridge, and civil infrastructure projects",
    "Accelerated deployment of commercial and rural renewable solar microgrids",
    "Adoption of advanced BIM modeling, precast engineering, and mechanized concreting",
    "Deepened strategic partnerships and joint ventures with state governments and institutions"
  ],
  coreValues: [
    {
      title: "Integrity",
      desc: "Ethical, transparent business practices with auditable project accounts, honest material disclosures, and clear contracts.",
      icon: "ShieldCheck"
    },
    {
      title: "Quality",
      desc: "Zero tolerance for substandard workmanship. We enforce strict adherence to Bureau of Indian Standards (BIS) and structural codes.",
      icon: "CheckCircle2"
    },
    {
      title: "Innovation",
      desc: "Embracing contemporary construction methods, precast engineering, solar microgrids, and digital total station surveying controls.",
      icon: "Lightbulb"
    },
    {
      title: "Responsibility",
      desc: "Unwavering commitment to environmental sustainability, workforce occupational safety, and community uplifting.",
      icon: "HeartHandshake"
    }
  ]
};

export const SERVICES: ServiceVertical[] = [
  {
    id: "civil-structural",
    title: "Civil & Structural Construction",
    shortDesc: "End-to-end heavy reinforced concrete, foundations, structural steel, and high-load engineered frameworks.",
    fullDesc: "Rudra Constructions provides turnkey civil contracting for institutional, commercial, and governmental structures. From extensive earthwork and piling to heavy RCC frames, structural steel erection, and seismic-resistant engineering, our certified engineers ensure lifelong durability.",
    iconName: "Building2",
    capabilities: [
      "RCC framed structures & heavy foundation engineering",
      "Structural steel fabrication & Pre-Engineered Buildings (PEB)",
      "Retaining walls, stormwater culverts & drainage networks",
      "High-tensile rebar tying, shuttering & mechanized batching",
      "Rigorous adherence to IS 456:2000 and IS 1893 seismic codes"
    ],
    keyProjects: "Panchayat administrative complexes, institutional blocks, foundation piling",
    complianceStandards: ["IS 456:2000", "IS 1786 (Fe 550D)", "IS 1893 Seismic Zone IV/V"],
    badge: "Core Expertise"
  },
  {
    id: "residential-commercial",
    title: "Residential & Commercial Projects",
    shortDesc: "Modern housing societies, multi-story apartments, retail complexes, and state-of-the-art corporate office hubs.",
    fullDesc: "We design and build contemporary residential communities and high-utility commercial plazas. Combining architectural finesse with functional space planning, our developments feature energy-efficient envelopes, superior thermal insulation, acoustic comfort, and premium finishes.",
    iconName: "Home",
    capabilities: [
      "Multi-story residential towers & gated community layout",
      "Corporate office parks & commercial shopping complexes",
      "Aesthetic facade engineering (ACP, structural glazing, louvers)",
      "Integrated electrical, fire safety, HVAC & MEP installations",
      "High-grade flooring, vitrified tiling & durable weather coatings"
    ],
    keyProjects: "Urban residential blocks, commercial retail centers, corporate headquarters",
    complianceStandards: ["National Building Code (NBC 2016)", "Local Town Planning Bye-laws"],
    badge: "Turnkey Contracting"
  },
  {
    id: "infrastructure-gov",
    title: "Infrastructure & Government Development",
    shortDesc: "Public sector civic complexes, Panchayat Sarkar Bhawans, regional road corridors, culverts, and civic utilities.",
    fullDesc: "A trusted vendor to the Government of Bihar and national developmental foundations, Rudra executes critical civic assets. We build Panchayat Sarkar Bhawans, block administrative hubs, rural concrete roads, flood-resilient culverts, and public recreation parks.",
    iconName: "Landmark",
    capabilities: [
      "Panchayat Sarkar Bhawan construction with full civic amenities",
      "Inter-district rigid concrete pavements & asphalt rural roads",
      "Veterinary hospitals & animal husbandry infrastructure",
      "Civic administrative blocks, public service counters & plazas",
      "Stormwater drainage, rainwater harvesting & flood protection"
    ],
    keyProjects: "State Government Panchayat Sarkar Bhawan network across multiple districts",
    complianceStandards: ["IRC:SP:20", "MoRTH Specifications", "State PWD Handbooks"],
    badge: "Government Approved"
  },
  {
    id: "solar-renewable",
    title: "Solar & Renewable Energy Solutions",
    shortDesc: "In alignment with India's National Solar Mission: rooftop PV, public solar street lighting, and rural microgrids.",
    fullDesc: "Our dedicated renewable energy division designs, procures, and installs high-efficiency solar energy systems. From standalone solar street lighting in remote villages to high-capacity rooftop solar arrays for government institutions and industrial sheds, we provide clean, round-the-clock power.",
    iconName: "Sun",
    capabilities: [
      "Integrated all-in-one & semi-integrated LED solar street lighting",
      "Grid-tied (On-Grid) & hybrid rooftop solar PV plants (1kW - 500kW)",
      "Solar-powered community drinking water pumps & irrigation units",
      "Lithium Ferro Phosphate (LiFePO4) & Gel tubular battery storage",
      "Remote IoT monitoring, automated dusk-to-dawn sensors & AMC"
    ],
    keyProjects: "Over 1,200 solar street lighting poles & public institutional solar setups",
    complianceStandards: ["MNRE Specifications", "IEC 61215", "IEC 61730", "BIS Certified"],
    badge: "Clean Energy Pioneer"
  },
  {
    id: "healthcare-modular",
    title: "Healthcare, Hospital & Modular Infrastructure",
    shortDesc: "Equipped medical facilities, inpatient hospital wards, prefabricated health centers, and clinical sanitation spaces.",
    fullDesc: "Rudra Constructions develops sterile, resilient healthcare infrastructure. We deliver hospital ward construction, patient care units, diagnostic facility rooms, prefabricated modular isolation units, medical gas pipeline routing provisions, and anti-bacterial vinyl flooring.",
    iconName: "Stethoscope",
    capabilities: [
      "Public hospital inpatient general wards & specialized clinics",
      "Rapid-deployment modular prefabricated healthcare cabins",
      "Medical-grade antimicrobial coatings, epoxy & vinyl flooring",
      "Dedicated clean power distribution & continuous backup wiring",
      "Sanitary plumbing, medical waste drainage & autoclave rooms"
    ],
    keyProjects: "Government public hospital ward renovation and modular healthcare installations",
    complianceStandards: ["Indian Public Health Standards (IPHS)", "AERB & Fire Safety"],
    badge: "Life-Critical Works"
  },
  {
    id: "materials-supply",
    title: "Certified Building Materials Supply",
    shortDesc: "Direct factory-procured supply of Grade-53/43 cement, Fe 550D TMT bars, aggregates, sand, and AAC blocks.",
    fullDesc: "As an integrated construction and supply conglomerate, Rudra operates a reliable logistics network for bulk building materials. We supply tested, certified raw materials directly to government contractors, commercial builders, and our internal project sites at bulk-negotiated pricing.",
    iconName: "Truck",
    capabilities: [
      "TMT Rebars (Fe 500D, Fe 550D) with mill test certificates (MTC)",
      "OPC 53, OPC 43 & PPC Cement from top-tier primary manufacturers",
      "Graded blue metal aggregates (10mm, 20mm, 40mm) & washed river sand",
      "Autoclaved Aerated Concrete (AAC) blocks & fly-ash bricks",
      "High-spec solar panels, mono-perc modules, LED fixtures & GI poles"
    ],
    keyProjects: "Bulk material supply contracts for state building corporations and road projects",
    complianceStandards: ["IS 1786", "IS 269", "IS 383", "IS 2185"],
    badge: "Direct Distribution"
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Panchayat Sarkar Bhawan Administrative Complex",
    category: "civic",
    categoryLabel: "Government Civic Infrastructure",
    client: "Panchayati Raj Department (Bihar Govt.)",
    location: "West Champaran & Regional Blocks",
    state: "Bihar",
    year: "2025",
    status: "Completed",
    scope: "Full Turnkey Civil, Structural, Electrical & Solar Electrification",
    description: "Constructed standard-format, disaster-resilient Panchayat Sarkar Bhawan comprising public grievance halls, elected representative offices, digital citizen service centers, sanitized washrooms, and solar backup power.",
    highlights: [
      "Constructed 5,400+ sq.ft reinforced concrete two-story administrative building",
      "Installed ramp-assisted barrier-free access compliant with accessible India guidelines",
      "Integrated rooftop solar PV with battery backup for uninterrupted public service delivery",
      "Equipped with rainwater harvesting and dedicated borewell sanitation facilities"
    ],
    image: civicImg,
    metrics: [
      { label: "Built-up Area", value: "5,400 sq.ft" },
      { label: "Execution Time", value: "8 Months" },
      { label: "Solar Integration", value: "5 kW Rooftop" },
      { label: "Compliance", value: "100% PWD Norms" }
    ]
  },
  {
    id: "proj-2",
    title: "Public Hospital Inpatient Ward Modernization",
    category: "healthcare",
    categoryLabel: "Healthcare & Life Sciences",
    client: "Building Construction Department (Bihar Govt.)",
    location: "District Hospital Complex",
    state: "Bihar",
    year: "2025",
    status: "Completed",
    scope: "Civil Structural Refurbishment, Flooring, False Ceiling & Medical Electrical",
    description: "Complete structural renovation and retrofitting of a multi-bed hospital inpatient ward. Features medical-grade anti-static vinyl flooring, acoustic false ceiling with soothing blue LED illumination, ergonomic patient beds, and specialized sanitation zones.",
    highlights: [
      "Modernized 24-bed hospital ward with individual patient monitor points",
      "Sanitary plumbing overhaul with automated water conservation fixtures",
      "High-durability antimicrobial wall finishes preventing nosocomial infections",
      "Zero-downtime execution in phased schedule adjacent to functioning clinical wings"
    ],
    image: hospitalImg,
    metrics: [
      { label: "Bed Capacity", value: "24 Beds" },
      { label: "Lighting Standard", value: "350 Lux Uniform" },
      { label: "Flooring", value: "Antimicrobial Vinyl" },
      { label: "Handover", value: "Before Deadline" }
    ]
  },
  {
    id: "proj-3",
    title: "Solar Rural Electrification & Street Lighting Mission",
    category: "solar",
    categoryLabel: "Renewable Energy & Public Utilities",
    client: "Sehgal Foundation & Aroh Foundation",
    location: "Semi-Urban & Rural Districts",
    state: "Bihar & Uttar Pradesh",
    year: "2025",
    status: "Commissioned",
    scope: "Supply, Civil Erection, Commissioning & Maintenance of Solar Infrastructure",
    description: "Executed widespread installation of autonomous high-lumen LED solar street light systems across rural villages, community squares, and primary health centers. Provides dusk-to-dawn safety, crime deterrence, and eco-friendly lighting.",
    highlights: [
      "Installed 450+ autonomous solar street lighting poles with hot-dip galvanized coating",
      "Equipped with high-efficiency Mono PERC solar modules and LiFePO4 batteries",
      "Automated optical sensor technology ensuring 12+ hours uninterrupted twilight lighting",
      "Community maintenance training delivered to local youth panchayat members"
    ],
    image: solarImg,
    metrics: [
      { label: "Luminaires Installed", value: "450+ Poles" },
      { label: "Energy Saved", value: "68,000 kWh/yr" },
      { label: "Battery Life", value: "5+ Years LiFePO4" },
      { label: "Uptime", value: "99.4%" }
    ]
  },
  {
    id: "proj-4",
    title: "Regional Highway Overpass & Segmental Infrastructure",
    category: "infrastructure",
    categoryLabel: "Highways & Heavy Engineering",
    client: "Bihar State Building Construction Corp LTD.",
    location: "Patna - Bettiah Regional Corridor",
    state: "Bihar",
    year: "2025",
    status: "In Progress",
    scope: "Heavy Foundation Piling, Pier Caps & Segmental Deck Erection",
    description: "Execution of reinforced concrete substructure and pier columns for critical bypass corridor. Utilizes computerized batching, high-tensile Fe 550D rebar cages, and self-compacting concrete to ensure long-term structural integrity under heavy axle traffic.",
    highlights: [
      "Deep bored cast-in-situ piling reaching firm bedrock strata",
      "Cast pier caps utilizing high-strength M45 structural concrete",
      "Strict continuous non-destructive concrete strength and ultrasonic testing",
      "Comprehensive traffic management plan minimizing regional commuter disruption"
    ],
    image: heroImg,
    metrics: [
      { label: "Concrete Volume", value: "4,200 m³" },
      { label: "Grade of Steel", value: "Fe 550D TMT" },
      { label: "Load Capacity", value: "Class 70R" },
      { label: "Safety Record", value: "Zero LTI" }
    ]
  },
  {
    id: "proj-5",
    title: "Fisheries & Animal Resource Technical Facility",
    category: "civic",
    categoryLabel: "Specialized State Facilities",
    client: "Bihar Animal & Fisheries Resource Dept.",
    location: "Bettiah Regional Extension",
    state: "Bihar",
    year: "2025",
    status: "Completed",
    scope: "Civil Laboratory Construction, Cold Storage Chambers & Hatchery Infrastructure",
    description: "Specialized institutional facility built for veterinary diagnosis, aquatic testing, and storage of animal resource supplies. Includes moisture-resistant wall treatments, dedicated drainage, cold room enclosures, and staff administrative quarters.",
    highlights: [
      "Constructed cold storage enclosures maintaining controlled 2-8°C parameters",
      "Acid-resistant laboratory counters with chemical drain line interception",
      "Dedicated solar water heating systems and backup diesel-solar synchronization",
      "External concrete hardstanding and perimeter security fencing"
    ],
    image: civicImg,
    metrics: [
      { label: "Floor Area", value: "3,800 sq.ft" },
      { label: "Cold Room Vol", value: "120 m³" },
      { label: "Delivery", value: "Completed 2025" },
      { label: "Client Rating", value: "Exemplary" }
    ]
  },
  {
    id: "proj-6",
    title: "Bulk TMT Steel & Cement Logistics Consignment",
    category: "materials",
    categoryLabel: "Material Distribution & Supply",
    client: "Gramin Vikas Trust (GVT) & WOTR Projects",
    location: "Jharkhand & Odisha Operations",
    state: "Jharkhand & Odisha",
    year: "2025",
    status: "Completed",
    scope: "Certified Primary Mill Material Procurement, Weighment & Multi-Site Delivery",
    description: "Consolidated procurement and logistics dispatch of over 1,800 Metric Tonnes of primary steel and 45,000 bags of OPC 53 cement for watershed development structures, check dams, and rural housing clusters.",
    highlights: [
      "100% batch traceability with original mill test certificates (MTC)",
      "Strict weighbridge verification and zero transit damage logistics",
      "Dedicated fleet of 10-wheel heavy commercial vehicles deployed",
      "Warehouse buffer stock maintained in Patna and Bettiah yards"
    ],
    image: heroImg,
    metrics: [
      { label: "Steel Supplied", value: "1,800 MT" },
      { label: "Cement Bags", value: "45,000 Bags" },
      { label: "Test Compliance", value: "100% BIS Pass" },
      { label: "Sites Covered", value: "18 Locations" }
    ]
  }
];

export const EXECUTION_METHODOLOGY: ExecutionStep[] = [
  {
    stepNumber: "01",
    title: "Requirement Analysis & Site Assessment",
    tagline: "Precision data collection before the first shovel touches soil",
    description: "Every successful project begins with comprehensive feasibility studies. Our engineering crew conducts on-site topographical surveys, soil bearing capacity (SBC) borehole tests, environmental impact reviews, and stakeholder alignment meetings.",
    deliverables: [
      "Digital Total Station (DTS) topographical survey maps",
      "Geotechnical borehole soil investigation reports",
      "Hydrological and flood-level historical analysis",
      "Preliminary statutory clearance checklist"
    ],
    duration: "Week 1 - 2",
    tools: ["Digital Total Station", "Soil Core Drilling Rig", "GIS Mapping Software"]
  },
  {
    stepNumber: "02",
    title: "Design, Planning & Cost Estimation",
    tagline: "Value-engineered structural plans with transparent BOQs",
    description: "Our in-house structural and MEP engineers draft detailed 2D/3D blueprints and computerized structural simulations. We prepare transparent Bills of Quantities (BOQ), critical path milestone schedules, and value-engineering recommendations that reduce client expenditure without cutting corners.",
    deliverables: [
      "Complete architectural & structural working drawings",
      "STAAD.Pro structural stability & seismic load calculations",
      "Item-rate Bill of Quantities (BOQ) with market-indexed rates",
      "Primavera / MS Project milestone Gantt schedule"
    ],
    duration: "Week 2 - 4",
    tools: ["AutoCAD 2025", "STAAD.Pro", "Revit BIM", "CostX BOQ Engine"]
  },
  {
    stepNumber: "03",
    title: "Procurement & Resource Allocation",
    tagline: "Direct mill procurement and mechanized heavy plant mobilization",
    description: "Leveraging our integrated materials supply chain, we procure certified raw materials directly from primary mills, eliminating intermediary markups. Heavy machinery—including transit mixers, mini-batching plants, excavators, and scaffolding—is deployed to the project staging depot.",
    deliverables: [
      "Raw material vendor qualification and Mill Test Certificates (MTC)",
      "Mobilization of licensed plant and heavy machinery",
      "On-site labor camp setup adhering to occupational health standards",
      "Secure material inventory control and testing bay"
    ],
    duration: "Week 4 - 6",
    tools: ["Primary Mill Supply Chain", "Heavy Fleet Logistics", "Batching Plants"]
  },
  {
    stepNumber: "04",
    title: "On-Site Execution & Supervision",
    tagline: "Meticulous craftsmanship governed by Resident Engineers",
    description: "Construction proceeds under continuous vigilance. A dedicated Resident Project Manager oversees day-to-day shuttering, rebar binding, concrete pours, curing schedules, and finishing works. Daily digital progress logs and weekly drone aerial scans keep stakeholders fully informed.",
    deliverables: [
      "Daily Site Progress Reports (DPR) with photo timestamps",
      "Strict stage-gate formwork and rebar inspection sign-offs",
      "28-day water curing protocols & chemical curing compounds",
      "Zero-compromise personal protective equipment (PPE) enforcement"
    ],
    duration: "Project-Specific Duration",
    tools: ["Resident Engineers", "Total Station Alignment", "Daily DPR Tracking"]
  },
  {
    stepNumber: "05",
    title: "Quality Assurance & Safety Checks",
    tagline: "Comprehensive lab verification, audits & turnkey handover",
    description: "Before any structure is handed over, it undergoes rigorous multi-point validation. We conduct concrete core compression tests, non-destructive rebound hammer tests, electrical insulation megger tests, and plumbing pressure tests to ensure flawless operational readiness.",
    deliverables: [
      "Third-party NABL certified laboratory test reports",
      "As-Built Drawings and operations & maintenance (O&M) manuals",
      "Statutory completion certificates and structural safety warranty",
      "Seamless client facility handover with staff training"
    ],
    duration: "Final 2 - 4 Weeks",
    tools: ["NABL Accredited Testing", "Rebound Hammer", "Ultrasonic Pulse Velocity"]
  }
];

export const STATES_SERVED: StatePresence[] = [
  {
    id: "bihar",
    name: "Bihar",
    code: "BR",
    region: "East",
    focusAreas: ["Panchayat Sarkar Bhawans", "Healthcare Hospital Wards", "Road & Bridge Infrastructure", "Rural Solar Lighting", "Material Supply Hubs"],
    keyClients: ["Panchayati Raj Dept.", "Building Construction Dept.", "Bihar State Building Corp.", "Bihar Animal & Fisheries"],
    activeProjectsCount: 16
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    code: "UP",
    region: "North",
    focusAreas: ["Delhi NCR Commercial Works", "Solar Street Light Arrays", "Warehouse Logistics", "Civil Renovation"],
    keyClients: ["Aroh Foundation", "Sehgal Foundation", "Commercial Developers"],
    activeProjectsCount: 6
  },
  {
    id: "jharkhand",
    name: "Jharkhand",
    code: "JH",
    region: "East",
    focusAreas: ["Check Dams & Watershed Structures", "Bulk TMT & Cement Supply", "Rural Infrastructure"],
    keyClients: ["WOTR", "GVT", "Regional Contractors"],
    activeProjectsCount: 4
  },
  {
    id: "odisha",
    name: "Odisha",
    code: "OD",
    region: "East",
    focusAreas: ["Community Civic Infrastructure", "Disaster Resilient Shelters", "Bulk Material Logistics"],
    keyClients: ["Gramin Vikas Trust", "Development Partners"],
    activeProjectsCount: 3
  },
  {
    id: "assam",
    name: "Assam",
    code: "AS",
    region: "North-East",
    focusAreas: ["Regional Offices in Biswanath & Jorhat", "Flood-Prone Elevated Civil Foundations", "Solar Lighting Corridors"],
    keyClients: ["Public Works Departments", "Tea Estate Community Infrastructure"],
    activeProjectsCount: 5
  },
  {
    id: "meghalaya",
    name: "Meghalaya",
    code: "ML",
    region: "North-East",
    focusAreas: ["Hill Slope Retaining Structures", "Solar Microgrids", "Eco-friendly Tourism Infrastructure"],
    keyClients: ["Regional Foundations", "Local Municipalities"],
    activeProjectsCount: 2
  },
  {
    id: "tripura",
    name: "Tripura",
    code: "TR",
    region: "North-East",
    focusAreas: ["Rural Water & Solar Solutions", "Civic Building Extensions", "Building Material Supply"],
    keyClients: ["State Development Societies"],
    activeProjectsCount: 2
  },
  {
    id: "arunachal-pradesh",
    name: "Arunachal Pradesh",
    code: "AR",
    region: "North-East",
    focusAreas: ["High-Altitude Remote Solar Lighting", "Prefabricated Modular Cabins", "Cold-Climate Insulation"],
    keyClients: ["Border Community Initiatives", "Institutional Foundations"],
    activeProjectsCount: 2
  },
  {
    id: "haryana",
    name: "Haryana",
    code: "HR",
    region: "North",
    focusAreas: ["Industrial Warehouse Concrete Flooring", "Commercial Office Retrofits", "Solar Rooftop Arrays"],
    keyClients: ["Corporate Logistics Hubs", "Private Industrialists"],
    activeProjectsCount: 3
  },
  {
    id: "punjab",
    name: "Punjab",
    code: "PB",
    region: "North",
    focusAreas: ["Agricultural Infrastructure", "Cold Storage Civil Works", "Solar Irrigation Pumps"],
    keyClients: ["Agri-Logistics Foundations", "Rural Cooperatives"],
    activeProjectsCount: 2
  },
  {
    id: "jammu-kashmir",
    name: "Jammu & Kashmir",
    code: "JK",
    region: "North",
    focusAreas: ["Sub-Zero Pre-Engineered Buildings", "Snow-Load Structural Steelwork", "Off-Grid Solar Storage"],
    keyClients: ["Public Infrastructure Entities", "Eco-Tourism Resorts"],
    activeProjectsCount: 2
  }
];

export const OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    id: "hq-registered",
    type: "Registered Headquarters",
    city: "Ramnagar, West Champaran",
    state: "Bihar",
    address: "Ward No.2, Sikta Belwa, Ramnagar",
    pincode: "845103",
    phone: "+91 8099588978",
    email: "rudraconstructionsupplier14@gmail.com",
    isPrimary: true
  },
  {
    id: "delhi-ncr",
    type: "Regional Corporate Hub",
    city: "Ghaziabad (Delhi NCR)",
    state: "Uttar Pradesh",
    address: "S8, Second Floor, Aaditya Mall, near Kotak Mahindra Bank, Indirapuram",
    pincode: "201014",
    phone: "+91 8099588978",
    email: "rudraconstructionsupplier14@gmail.com",
    isPrimary: false
  },
  {
    id: "patna-branch",
    type: "State Branch Office",
    city: "Patna",
    state: "Bihar",
    address: "Sanyukta Bhawan, Road Number Zero, Shivpuri",
    pincode: "800023",
    phone: "+91 8099588978",
    email: "rudraconstructionsupplier14@gmail.com",
    isPrimary: false
  },
  {
    id: "bettiah-branch",
    type: "Project Operations Office",
    city: "Bettiah",
    state: "Bihar",
    address: "Basant Vihar, Hariwatika Chowk, Bettiah",
    pincode: "845438",
    phone: "+91 8099588978",
    email: "rudraconstructionsupplier14@gmail.com",
    isPrimary: false
  },
  {
    id: "assam-bedeti",
    type: "State Branch Office",
    city: "Biswanath",
    state: "Assam",
    address: "Bihmari Jarani, P.O. Bedeti, Dist. Biswanath",
    pincode: "784179",
    phone: "+91 8099588978",
    email: "rudraconstructionsupplier14@gmail.com",
    isPrimary: false
  },
  {
    id: "assam-jorhat",
    type: "Project Operations Office",
    city: "Jorhat",
    state: "Assam",
    address: "Royal Garden Building 5E, Opposite Jorhat Railway Station",
    pincode: "785001",
    phone: "+91 8099588978",
    email: "rudraconstructionsupplier14@gmail.com",
    isPrimary: false
  }
];

export const CLIENTS: ClientPartner[] = [
  {
    name: "Panchayati Raj Department",
    category: "Government Department",
    description: "Government of Bihar — Turnkey execution of multi-district Panchayat Sarkar Bhawan administrative complexes.",
    logoText: "Panchayati Raj (Bihar Govt.)",
    region: "Bihar"
  },
  {
    name: "Building Construction Department",
    category: "Government Department",
    description: "Government of Bihar — Public health facilities, hospital ward retrofits, and state institutional structures.",
    logoText: "Building Construction Dept. (Govt. of Bihar)",
    region: "Bihar"
  },
  {
    name: "Bihar State Building Corporation LTD.",
    category: "Public Undertaking",
    description: "State civil works, high-specification public infrastructure, and heavy structural engineering projects.",
    logoText: "Bihar State Building Corp. Ltd.",
    region: "Bihar"
  },
  {
    name: "Bihar Animal & Fisheries Resource Dept.",
    category: "Government Department",
    description: "Veterinary clinical facilities, cold chain storage enclosures, and research hatcheries.",
    logoText: "Animal & Fisheries Resource Dept.",
    region: "Bihar"
  },
  {
    name: "Aashray Foundation",
    category: "Development Foundation",
    description: "Social housing, community infrastructure, clean sanitation facilities, and rural development programs.",
    logoText: "Aashray Foundation",
    region: "National"
  },
  {
    name: "Sehgal Foundation",
    category: "Development Foundation",
    description: "Renewable solar street lighting, water conservation structures, and sustainable rural electrification.",
    logoText: "Sehgal Foundation",
    region: "Pan-India"
  },
  {
    name: "Srijjan",
    category: "Development Foundation",
    description: "Livelihood infrastructure, community processing centers, and village civic utilities.",
    logoText: "Srijjan",
    region: "East India"
  },
  {
    name: "WOTR (Watershed Organisation Trust)",
    category: "Development Foundation",
    description: "Civil check dams, rural water storage structures, and sustainable catchment engineering.",
    logoText: "WOTR",
    region: "Multi-State"
  },
  {
    name: "GVT (Gramin Vikas Trust)",
    category: "Development Foundation",
    description: "Bulk construction material procurement, agrarian logistics facilities, and community buildings.",
    logoText: "Gramin Vikas Trust (GVT)",
    region: "National"
  },
  {
    name: "Aroh Foundation",
    category: "Development Foundation",
    description: "Solar electrification of public schools, rural healthcare posts, and community centers.",
    logoText: "Aroh Foundation",
    region: "North & East India"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "What classes of government tenders and commercial projects does Rudra handle?",
    answer: "Rudra Constructions & Suppliers is qualified for Class-A civil engineering contracts, institutional tenders, and turnkey commercial projects. With an audited turnover exceeding ₹14.65 Crore, we handle single-contract values ranging from ₹25 Lakhs up to ₹15 Crore across civil structures, roads, government civic buildings, hospital retrofits, and renewable solar arrays.",
    category: "Credentials & Bidding"
  },
  {
    question: "Do you supply building materials as a standalone service or only for your own sites?",
    answer: "We offer both! Through our dedicated materials supply division, we provide bulk supply of Grade 53/43 cement, Fe 550D TMT rebars, graded aggregates, and AAC blocks to external government contractors, private developers, and infrastructure firms, complete with primary mill test certificates (MTC) and weighbridge verification.",
    category: "Materials & Supply"
  },
  {
    question: "What quality assurance and testing protocols are enforced during construction?",
    answer: "We adhere strictly to Bureau of Indian Standards (IS 456, IS 1786, IS 1893). For every concrete casting, we prepare standard test cubes tested at 7 and 28 days in NABL-accredited laboratories. We also conduct on-site slump cone tests, ultrasonic pulse velocity (UPV) tests, and ultrasonic weld flaw inspections for structural steel.",
    category: "Quality & Safety"
  },
  {
    question: "How does your solar and renewable energy division operate?",
    answer: "Our solar division designs and executes MNRE-compliant solar systems. We specialize in off-grid and hybrid rooftop solar power plants for institutional and commercial buildings, as well as integrated high-lumen LED solar street light systems with LiFePO4 battery technology and automated twilight sensors for rural and municipal roads.",
    category: "Solar & Renewable"
  },
  {
    question: "Where are your registered and operational branch offices located?",
    answer: "Our Registered Headquarters is located in Ramnagar, West Champaran (Bihar 845103). We operate a Regional Corporate Hub in Ghaziabad (Delhi NCR) at Aaditya Mall, Indirapuram, state offices in Patna (Shivpuri) and Bettiah (Hariwatika Chowk), as well as dual North-East operational hubs in Assam at Biswanath (Bedeti) and Jorhat (Royal Garden Building).",
    category: "Offices & Locations"
  },
  {
    question: "How can government departments or developers request an official quote or RFP response?",
    answer: "You can submit your project parameters directly through our online Project Cost Estimator, email tender documents to rudraconstructionsupplier14@gmail.com, or reach our project director directly at +91 8099588978. Our tender estimation team typically responds within 24–48 business hours with a preliminary BOQ review.",
    category: "Tenders & Inquiries"
  }
];

export const WORK_SITES_ON_MAP: WorkSiteLocation[] = [
  {
    id: "site-ramnagar-hq",
    title: "Registered Corporate HQ & Panchayat Sarkar Bhawans",
    category: "civic",
    categoryLabel: "Civic Administrative & Head Office",
    city: "Ramnagar, West Champaran",
    state: "Bihar",
    coordinates: [27.1667, 84.3167],
    client: "Panchayati Raj Department & District Administration",
    status: "Operational Hub",
    completionYear: "Est. 2025",
    scopeSummary: "Central corporate headquarters and cluster of 2-story reinforced concrete Panchayat Sarkar Bhawans with digital citizen halls.",
    projectValue: "₹4.85 Cr",
    image: civicImg,
    keyMetric: "5,400 sq.ft RCC Hub"
  },
  {
    id: "site-bettiah-lab",
    title: "Animal & Fisheries Resource Diagnostic Facility",
    category: "civic",
    categoryLabel: "Specialized Laboratory & Operations",
    city: "Bettiah, West Champaran",
    state: "Bihar",
    coordinates: [26.8022, 84.5029],
    client: "Bihar Animal & Fisheries Resource Dept.",
    status: "Completed",
    completionYear: "2025",
    scopeSummary: "State technical laboratory, cold room storage facilities (2-8°C), and district project logistics management office.",
    projectValue: "₹2.90 Cr",
    image: civicImg,
    keyMetric: "3,800 sq.ft Clean Lab"
  },
  {
    id: "site-patna-bridge",
    title: "Regional Highway Substructure & State Office",
    category: "infrastructure",
    categoryLabel: "Highways & Substructures",
    city: "Shivpuri, Patna",
    state: "Bihar",
    coordinates: [25.5941, 85.1376],
    client: "Bihar State Building Construction Corp LTD.",
    status: "Under Execution",
    completionYear: "2025-2026",
    scopeSummary: "Deep bored cast-in-situ piling, heavy pier columns, and state liaison branch office at Sanyukta Bhawan.",
    projectValue: "₹6.20 Cr",
    image: heroImg,
    keyMetric: "4,200 m³ High-Load M45"
  },
  {
    id: "site-muzaffarpur-hospital",
    title: "Sub-Divisional Hospital Inpatient Ward Modernization",
    category: "healthcare",
    categoryLabel: "Hospital Infrastructure",
    city: "Muzaffarpur",
    state: "Bihar",
    coordinates: [26.1209, 85.3647],
    client: "Building Construction Dept. (Bihar Govt.)",
    status: "Completed",
    completionYear: "2025",
    scopeSummary: "24-bed inpatient ward retrofit with antimicrobial seamless flooring, medical gas plumbing, and 350 Lux lighting.",
    projectValue: "₹1.75 Cr",
    image: hospitalImg,
    keyMetric: "24 Beds Delivered"
  },
  {
    id: "site-motihari-solar",
    title: "Panchayat Solar Streetlighting & Mini-Grid Mission",
    category: "solar",
    categoryLabel: "Solar Electrification",
    city: "Motihari, East Champaran",
    state: "Bihar",
    coordinates: [26.6470, 84.9089],
    client: "Sehgal Foundation & BREDA Programs",
    status: "Completed",
    completionYear: "2025",
    scopeSummary: "Erection of 320+ hot-dip galvanized solar street poles with Mono-PERC PV modules and LiFePO4 battery banks.",
    projectValue: "₹88 Lakhs",
    image: solarImg,
    keyMetric: "320+ Solar Poles"
  },
  {
    id: "site-delhi-ncr-hub",
    title: "Delhi NCR Corporate Hub & Commercial Contracting",
    category: "office",
    categoryLabel: "Regional Corporate Hub",
    city: "Indirapuram, Ghaziabad",
    state: "Uttar Pradesh",
    coordinates: [28.6415, 77.3714],
    client: "Commercial Developers & Corporate Clients",
    status: "Operational Hub",
    completionYear: "Active",
    scopeSummary: "Regional bidding and commercial corporate office at Aaditya Mall managing North India tender procurement.",
    projectValue: "₹5.50 Cr Pipeline",
    image: heroImg,
    keyMetric: "Regional Bidding Hub"
  },
  {
    id: "site-gorakhpur-civic",
    title: "Civic Administrative Complex & Material Depots",
    category: "civic",
    categoryLabel: "Civic Buildings & TMT Hub",
    city: "Gorakhpur",
    state: "Uttar Pradesh",
    coordinates: [26.7606, 83.3732],
    client: "Municipal & Public Works Departments",
    status: "Under Execution",
    completionYear: "2025-2026",
    scopeSummary: "RCC framed municipal administrative building and central supply staging yard for Fe 550D primary TMT bars.",
    projectValue: "₹3.40 Cr",
    image: civicImg,
    keyMetric: "12,000 sq.ft Complex"
  },
  {
    id: "site-varanasi-solar",
    title: "Community Solar Water Systems & Lighting",
    category: "solar",
    categoryLabel: "Renewable Public Utilities",
    city: "Varanasi",
    state: "Uttar Pradesh",
    coordinates: [25.3176, 82.9739],
    client: "Aroh Foundation & Village Committees",
    status: "Completed",
    completionYear: "2025",
    scopeSummary: "Dual-axis solar pump arrays and 140 autonomous street lighting units across peri-urban village clusters.",
    projectValue: "₹72 Lakhs",
    image: solarImg,
    keyMetric: "140 Solar Poles"
  },
  {
    id: "site-biswanath-assam",
    title: "Assam Regional Operations & Rural Infrastructure",
    category: "office",
    categoryLabel: "Regional Office & Solar Works",
    city: "Biswanath (Bedeti)",
    state: "Assam",
    coordinates: [26.7335, 93.1491],
    client: "State Panchayati Raj & Development Agencies",
    status: "Operational Hub",
    completionYear: "Active 2025",
    scopeSummary: "North-East regional administrative base, heavy machinery depot, and flood protection culvert construction.",
    projectValue: "₹2.80 Cr",
    image: heroImg,
    keyMetric: "North-East Base"
  },
  {
    id: "site-jorhat-assam",
    title: "Animal Husbandry Center & District Operations Base",
    category: "civic",
    categoryLabel: "Institutional & Operations Hub",
    city: "Jorhat (Opp. Railway Station)",
    state: "Assam",
    coordinates: [26.7509, 94.2037],
    client: "Assam Veterinary & Agriculture Directorate",
    status: "Completed",
    completionYear: "2025",
    scopeSummary: "Regional veterinary cold chain center, research chambers, and operational office at Royal Garden Building.",
    projectValue: "₹2.15 Cr",
    image: civicImg,
    keyMetric: "Veterinary Center"
  },
  {
    id: "site-guwahati-retaining",
    title: "Brahmaputra Basin Flood Retaining & Staging Yard",
    category: "infrastructure",
    categoryLabel: "Drainage & Bulk Logistics",
    city: "Guwahati",
    state: "Assam",
    coordinates: [26.1445, 91.7362],
    client: "Regional Water Resources & Local Bodies",
    status: "Under Execution",
    completionYear: "2025-2026",
    scopeSummary: "Boulder pitching, reinforced concrete retaining walls, and bulk staging yard for Grade-53 cement dispatch.",
    projectValue: "₹3.90 Cr",
    image: heroImg,
    keyMetric: "1.4 km Retaining Wall"
  },
  {
    id: "site-ranchi-jharkhand",
    title: "Catchment Check Dams & 1,800 MT Rebar Supply",
    category: "materials",
    categoryLabel: "Civil Works & Materials",
    city: "Ranchi",
    state: "Jharkhand",
    coordinates: [23.3441, 85.3096],
    client: "Gramin Vikas Trust (GVT) & State Watersheds",
    status: "Completed",
    completionYear: "2025",
    scopeSummary: "Bulk supply of 1,800 MT tested primary rebar and construction of 6 masonry check dams in tribal blocks.",
    projectValue: "₹4.10 Cr",
    image: heroImg,
    keyMetric: "1,800 MT Primary TMT"
  },
  {
    id: "site-dhanbad-jharkhand",
    title: "Heavy Foundation Substructures & Drainage Works",
    category: "infrastructure",
    categoryLabel: "Heavy Foundations",
    city: "Dhanbad",
    state: "Jharkhand",
    coordinates: [23.7957, 86.4304],
    client: "Industrial & Municipal Authorities",
    status: "Under Execution",
    completionYear: "2025-2026",
    scopeSummary: "Heavy machine foundation footings, concrete stormwater drains, and structural steel shed erection.",
    projectValue: "₹2.60 Cr",
    image: heroImg,
    keyMetric: "Heavy RCC Pours"
  },
  {
    id: "site-bhubaneswar-odisha",
    title: "Cyclone-Resilient Community Shelter & Solar Arrays",
    category: "civic",
    categoryLabel: "Disaster Resilient Structures",
    city: "Bhubaneswar",
    state: "Odisha",
    coordinates: [20.2961, 85.8245],
    client: "WOTR Catchment Engineering & State Programs",
    status: "Completed",
    completionYear: "2025",
    scopeSummary: "High wind-rated RCC community hall with 10 kW rooftop solar microgrid and dedicated rainwater recharge.",
    projectValue: "₹1.95 Cr",
    image: civicImg,
    keyMetric: "Wind-Resilient Hall"
  },
  {
    id: "site-srinagar-jk",
    title: "High-Altitude Solar Microgrid & Insulated Concrete",
    category: "solar",
    categoryLabel: "Renewable High-Altitude Works",
    city: "Srinagar",
    state: "Jammu & Kashmir",
    coordinates: [34.0837, 74.7973],
    client: "Public Utilities & Tourism Department",
    status: "Completed",
    completionYear: "2025",
    scopeSummary: "Cold-resistant solar lighting systems with frost-resistant battery enclosures and low-temp curing concrete.",
    projectValue: "₹1.45 Cr",
    image: solarImg,
    keyMetric: "Sub-Zero Operation"
  },
  {
    id: "site-raipur-chhattisgarh",
    title: "Rural Water Supply Structures & Solar Lighting",
    category: "solar",
    categoryLabel: "Solar & Civil Water Works",
    city: "Raipur",
    state: "Chhattisgarh",
    coordinates: [21.2514, 81.6296],
    client: "State Panchayat & Rural Engineering Services",
    status: "Completed",
    completionYear: "2025",
    scopeSummary: "Erection of 180 solar LED streetlights and construction of concrete pump stations for rural habitations.",
    projectValue: "₹1.15 Cr",
    image: solarImg,
    keyMetric: "180 Solar Poles"
  },
  {
    id: "site-itanagar-arunachal",
    title: "Hill Slope Gabion Retaining & Border Electrification",
    category: "infrastructure",
    categoryLabel: "High Altitude Infrastructure",
    city: "Itanagar",
    state: "Arunachal Pradesh",
    coordinates: [27.0844, 93.6053],
    client: "State PWD & Rural Electrification",
    status: "Under Execution",
    completionYear: "2025-2026",
    scopeSummary: "Seismic Zone-V gabion and concrete retaining walls, solar mini-grids, and drainage catchments.",
    projectValue: "₹2.20 Cr",
    image: heroImg,
    keyMetric: "Zone-V Seismic"
  },
  {
    id: "site-rewa-mp",
    title: "Solar Park Ancillary Civil Works & Bulk Rebar",
    category: "materials",
    categoryLabel: "Solar Ancillary & Materials",
    city: "Rewa",
    state: "Madhya Pradesh",
    coordinates: [24.5373, 81.3042],
    client: "Renewable Energy Contractors",
    status: "Completed",
    completionYear: "2025",
    scopeSummary: "Supply of 650 MT Fe 550D TMT bars, cast foundation plinths for central inverters, and perimeter grading.",
    projectValue: "₹1.80 Cr",
    image: solarImg,
    keyMetric: "650 MT Rebar"
  }
];

export const STATUTORY_SECURITY_CLEARANCES = [
  {
    title: "Class-1 Civil Enlistment",
    authority: "PWD / CPWD Registered",
    certNo: "CPWD/CL-1/2025/RC-0842",
    details: "Authorized for heavy civil, administrative bhawans, roads, and high-value institutional tenders."
  },
  {
    title: "GSTIN & Tax Compliance Rating",
    authority: "Govt. of India & State Commercial Tax",
    certNo: "10AALCR8492K1Z5",
    details: "100% compliant e-way billing, timely GSTR-1 & 3B filings, and auditable procurement ledgers."
  },
  {
    title: "Bank Solvency & BG Facilities",
    authority: "State Bank of India (SBI)",
    certNo: "SBI/SME/SOLV-14CR/2025",
    details: "Solvency clearance certified for ₹10.00+ Crore with active Bank Guarantee (BG) and EMD issuance lines."
  },
  {
    title: "Statutory Labor & Social Security",
    authority: "Ministry of Labour & Employment",
    certNo: "EPFO: BR/PAT/0094120 • ESIC Registered",
    details: "Mandatory Provident Fund, ESIC medical insurance, and police verification for all on-site manpower."
  },
  {
    title: "NABL Laboratory Testing Validation",
    authority: "National Accreditation Board (NABL)",
    certNo: "IS 456 & IS 1786 Verified",
    details: "Mandatory 7-day & 28-day concrete cube compressive tests, steel tensile yield tests, and silt content audits."
  },
  {
    title: "Integrated Management ISO Triad",
    authority: "International Organization for Standardization",
    certNo: "ISO 9001:2015 • ISO 14001:2015 • ISO 45001:2018",
    details: "Audited quality control, environmental safeguards, and zero-accident occupational safety protocols."
  }
];
