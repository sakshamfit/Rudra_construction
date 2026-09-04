import { BlogPost, WebsitePhoto } from '../types';
import heroImg from '../assets/images/rudra_hero_construction_1788465374495.jpg';
import solarImg from '../assets/images/rudra_solar_infra_1788465391292.jpg';
import civicImg from '../assets/images/rudra_civic_bhawan_1788465407931.jpg';
import hospitalImg from '../assets/images/rudra_hospital_ward_1788465423465.jpg';

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Seismic Resilience in North Bihar Infrastructure: Implementing IS 1893 & IS 456 Standards',
    slug: 'seismic-resilience-bihar-infrastructure',
    category: 'Civil Engineering',
    coverImage: heroImg,
    excerpt: 'How Rudra enforces Zone IV/V seismic structural parameters, high-tensile Fe 550D ductility, and ultrasonic test regimes in institutional building frames.',
    content: `Northern Bihar lies in one of the most seismically sensitive belts in the Indian subcontinent (Zone IV and Zone V). Standard civil engineering guidelines must be augmented with high ductility reinforcement detailing to safeguard public lives and institutional continuity.

### 1. Ductile Detailing under IS 13920:2016
When pouring monolithic columns and beam-column junctions for government civic complexes, conventional stirrup spacing is insufficient. We mandate closely spaced 135-degree seismic hooks with 10-diameter hook lengths, preventing rebar spalling during lateral ground accelerations.

### 2. Primary Mill Fe 550D Steel Superiority
Rudra exclusively uses primary mill Fe 550D rebars (Tata Tiscon, SAIL, Jindal). The "D" signifies guaranteed minimum elongation of 16% (often exceeding 18.5%), providing essential plastic deformation reserves before yielding.

### 3. NABL Cube Testing Milestones
Every transit mixer batch undergoes mandatory on-site slump cone checks (100–120mm workability) and 6 test cubes sampled per 50m³. Compressive strengths are verified at 7 days (targeting >67% characteristic strength) and 28 days (>100% compliance) at authorized NABL testing centers before structural formwork stripping.`,
    authorName: 'Er. Rajeshwar Sharma',
    authorRole: 'Chief Structural Consultant',
    publishDate: 'Aug 28, 2025',
    readTime: '5 min read',
    tags: ['IS 456', 'Seismic Zone V', 'RCC Detailing', 'Quality Assurance'],
    status: 'Published',
    featured: true
  },
  {
    id: 'blog-2',
    title: 'Modernizing Decentralized Governance: Architectural Anatomy of a Panchayat Sarkar Bhawan',
    slug: 'anatomy-panchayat-sarkar-bhawan',
    category: 'Case Study',
    coverImage: civicImg,
    excerpt: 'An inside look at how turnkey civil engineering, civic citizen halls, and resilient infrastructure converge in Bihar’s grassroots governance buildings.',
    content: `The Panchayat Sarkar Bhawan is more than an administrative building—it is the direct point of contact between rural citizens and government services. Creating a dignified, technologically equipped, and climate-resilient space requires careful architectural planning.

### Structural Framework & Accessibility
Each two-story Bhawan features a reinforced concrete frame designed for high-density public occupancy. Wide barrier-free ramps with tactile paving ensure universal accessibility for elderly and differently-abled citizens.

### Citizen Public Service Halls
The ground level houses biometric authentication kiosks, land record verification counters, and digital revenue collection terminals. High-traffic areas are paved with heavy-duty vitrified anti-skid tile flooring, withstands decades of daily footfall.

### Sustainable Backup & Rainwater Harvesting
To counter regional grid fluctuations, every Bhawan executed by Rudra integrates a 3 kWp rooftop solar photovoltaic backup system paired with rooftop rainwater collection recharge pits that replenish groundwater tables.`,
    authorName: 'Amitabh Verma',
    authorRole: 'Head of Civic Projects',
    publishDate: 'Jul 15, 2025',
    readTime: '4 min read',
    tags: ['Panchayat Bhawan', 'Civic Architecture', 'Turnkey Construction', 'Bihar PWD'],
    status: 'Published',
    featured: false
  },
  {
    id: 'blog-3',
    title: 'Decarbonizing Rural Roads: Deploying High-Efficiency LiFePO4 Solar Street Lighting',
    slug: 'decarbonizing-rural-roads-solar-lighting',
    category: 'Solar Energy',
    coverImage: solarImg,
    excerpt: 'Evaluating performance matrices of Mono PERC solar modules, Lithium Ferro Phosphate batteries, and intelligent optical dusk-to-dawn sensors in remote clusters.',
    content: `Rural electrification in India has transitioned rapidly from experimental pilot initiatives to large-scale municipal infrastructure. Solar street lighting is now one of the highest-impact public interventions for road safety and night-time security.

### 1. Lithium Ferro Phosphate (LiFePO4) vs Traditional Lead-Acid
Traditional tubular batteries suffered from short 2-year lifespans and frequent electrolyte maintenance. LiFePO4 chemistry delivers over 2,500 charging cycles (5–7 years operational life), superior thermal stability up to 55°C, and 95% depth of discharge efficiency.

### 2. High-Lumen LED Luminaire Engineering
Rudra’s luminaires utilize high-efficiency Bridgelux/Philips LED chips delivering 160+ lumens per watt. Batwing optical lenses distribute light uniformly across 20-meter road widths without dark spots or glare.

### 3. Integrated Dusk-to-Dawn Automation
Integrated micro-controllers automatically detect solar twilight. During peak evening hours (6 PM - 11 PM), lighting operates at 100% illumination; in late night hours, intelligent dimming mode preserves battery reserves for rainy weather conditions.`,
    authorName: 'Vikramaditya Roy',
    authorRole: 'Director - Renewable Energy Division',
    publishDate: 'Jun 10, 2025',
    readTime: '6 min read',
    tags: ['Solar EPC', 'LiFePO4', 'Clean Energy', 'Street Lighting'],
    status: 'Published',
    featured: true
  },
  {
    id: 'blog-4',
    title: 'Class-A Tender Bidding: Financial Solvency & Primary Mill Material Compliance',
    slug: 'class-a-tender-bidding-compliance',
    category: 'Tender & Compliance',
    coverImage: hospitalImg,
    excerpt: 'Key statutory prerequisites, CPWD/PWD schedule adherence, and bank solvency parameters needed to win and execute major infrastructure contracts.',
    content: `Executing public tenders exceeding ₹10 Crore requires comprehensive financial backing, rigorous statutory documentation, and unwavering technical capability.

### 1. Bank Solvency & Working Capital
Government departments require bank solvency certificates issued by Schedule-A commercial banks (such as State Bank of India). Rudra maintains certified solvency exceeding ₹10.00 Crore to ensure seamless cash flow for equipment mobilization and bulk material purchases.

### 2. Primary Mill Test Certificates (MTC)
Submitting secondary re-rolled steel is one of the most common causes of tender disqualification and structural failure. Contractual agreements mandate original heat-number-matched MTCs for every steel consignment.

### 3. Safety Compliance & ESI/PF Records
Labour welfare compliance under EPFO, ESIC, and Building and Other Construction Workers (BOCW) Act is audited on monthly RA bills before financial releases are sanctioned.`,
    authorName: 'Sanjay K. Choudhary',
    authorRole: 'Tender & Statutory Compliance Lead',
    publishDate: 'May 20, 2025',
    readTime: '4 min read',
    tags: ['Tender Guidelines', 'CPWD', 'Contracting', 'Statutory Compliance'],
    status: 'Published',
    featured: false
  }
];

export const INITIAL_PHOTOS: WebsitePhoto[] = [
  {
    id: 'photo-hero-1',
    title: 'Main Hero Infrastructure Showcase',
    section: 'hero',
    sectionLabel: 'Hero Main Header',
    url: heroImg,
    caption: 'Heavy Civil & Structural Reinforced Concrete Construction Site',
    altText: 'Rudra Constructions - Civil Engineering & Infrastructure Precision',
    associatedId: 'hero-main',
    uploadedAt: '2025-08-01'
  },
  {
    id: 'photo-proj-1',
    title: 'Panchayat Sarkar Bhawan Administrative Complex',
    section: 'projects',
    sectionLabel: 'Project Case Study #1',
    url: civicImg,
    caption: 'Two-story administrative civic complex with civic hall and solar backup',
    altText: 'Panchayat Sarkar Bhawan construction in Bihar',
    associatedId: 'proj-1',
    uploadedAt: '2025-08-01'
  },
  {
    id: 'photo-proj-2',
    title: 'Sub-Divisional Hospital Inpatient Ward Modernization',
    section: 'projects',
    sectionLabel: 'Project Case Study #2',
    url: hospitalImg,
    caption: '24-bed clinical healthcare ward with anti-bacterial finishes',
    altText: 'Modern hospital ward interior retrofit by Rudra Constructions',
    associatedId: 'proj-2',
    uploadedAt: '2025-08-01'
  },
  {
    id: 'photo-proj-3',
    title: 'Solar Rural Electrification & Street Lighting Mission',
    section: 'projects',
    sectionLabel: 'Project Case Study #3',
    url: solarImg,
    caption: 'Solar LED street light poles with LiFePO4 batteries across rural villages',
    altText: 'Solar street light installation and renewable energy infrastructure',
    associatedId: 'proj-3',
    uploadedAt: '2025-08-01'
  },
  {
    id: 'photo-proj-4',
    title: 'Regional Highway Overpass & Segmental Infrastructure',
    section: 'projects',
    sectionLabel: 'Project Case Study #4',
    url: heroImg,
    caption: 'Reinforced concrete pier columns and heavy foundations for highway bypass',
    altText: 'Regional highway construction substructure',
    associatedId: 'proj-4',
    uploadedAt: '2025-08-01'
  },
  {
    id: 'photo-proj-5',
    title: 'Fisheries & Animal Resource Technical Facility',
    section: 'projects',
    sectionLabel: 'Project Case Study #5',
    url: civicImg,
    caption: 'Specialized institutional building with cold room and testing laboratories',
    altText: 'Specialized government diagnostic facility construction',
    associatedId: 'proj-5',
    uploadedAt: '2025-08-01'
  },
  {
    id: 'photo-proj-6',
    title: 'Bulk TMT Steel & Cement Logistics Consignment',
    section: 'projects',
    sectionLabel: 'Project Case Study #6',
    url: heroImg,
    caption: 'Primary steel rebars and Grade 53 cement dispatch fleet',
    altText: 'Bulk building materials distribution logistics',
    associatedId: 'proj-6',
    uploadedAt: '2025-08-01'
  },
  {
    id: 'photo-gallery-1',
    title: 'Foundation Shuttering & Seismic Rebar Cage Tying',
    section: 'gallery',
    sectionLabel: 'Site Gallery',
    url: heroImg,
    caption: 'Structural steel rebar layout adhering to IS 456 ductile standards',
    altText: 'Rebar tying on civil site',
    uploadedAt: '2025-08-15'
  },
  {
    id: 'photo-gallery-2',
    title: 'Clean Rooftop Solar Photovoltaic Testing Array',
    section: 'gallery',
    sectionLabel: 'Site Gallery',
    url: solarImg,
    caption: 'Pre-commissioning electrical testing on grid-tied solar panels',
    altText: 'Solar PV modules on commercial rooftop',
    uploadedAt: '2025-08-15'
  },
  {
    id: 'photo-gallery-3',
    title: 'Finished Panchayat Civic Public Entrance Gate',
    section: 'gallery',
    sectionLabel: 'Site Gallery',
    url: civicImg,
    caption: 'Completed administrative entrance with weather-proof exterior coatings',
    altText: 'Administrative building entrance gate',
    uploadedAt: '2025-08-15'
  }
];
