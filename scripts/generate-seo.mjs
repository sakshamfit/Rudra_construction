#!/usr/bin/env node
/**
 * Generates crawlable HTML landings, sitemaps, feeds and AI-index files.
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
const ORIGIN = (process.env.APP_URL || process.env.SITE_URL || process.env.VITE_SITE_URL || '').replace(/\/$/, '');
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
    titlePt: 'Construção Civil e Estrutural',
    shortDesc: 'End-to-end heavy reinforced concrete, foundations, structural steel, and high-load engineered frameworks.',
    shortPt: 'Concreto armado pesado, fundações, aço estrutural e estruturas de alta carga de ponta a ponta.',
    fullDesc:
      'Rudra Constructions provides turnkey civil contracting for institutional, commercial, and governmental structures. From extensive earthwork and piling to heavy RCC frames, structural steel erection, and seismic-resistant engineering, our certified engineers ensure lifelong durability.',
    fullPt:
      'A Rudra Constructions executa contratação civil turnkey para estruturas institucionais, comerciais e governamentais. Da terraplenagem e estacas a pórticos de concreto armado, montagem de aço estrutural e engenharia sísmica, nossos engenheiros certificados garantem durabilidade permanente.',
    capabilities: [
      'RCC framed structures & heavy foundation engineering',
      'Structural steel fabrication & Pre-Engineered Buildings (PEB)',
      'Retaining walls, stormwater culverts & drainage networks',
      'High-tensile rebar tying, shuttering & mechanized batching',
      'Rigorous adherence to IS 456:2000 and IS 1893 seismic codes',
    ],
    capabilitiesPt: [
      'Estruturas de concreto armado e engenharia de fundações pesadas',
      'Fabricação de aço estrutural e edifícios pré-engenheirados (PEB)',
      'Muros de arrimo, bueiros pluviais e redes de drenagem',
      'Amarração de vergalhões de alta resistência, fôrmas e usinagem mecanizada',
      'Adesão rigorosa aos códigos sísmicos IS 456:2000 e IS 1893',
    ],
    keyProjects: 'Panchayat administrative complexes, institutional blocks, foundation piling',
    keyPt: 'Complexos administrativos de Panchayat, blocos institucionais, estacas de fundação',
    compliance: ['IS 456:2000', 'IS 1786 (Fe 550D)', 'IS 1893 Seismic Zone IV/V'],
    badge: 'Core Expertise',
    image: IMG.hero,
  },
  {
    id: 'residential-commercial',
    title: 'Residential & Commercial Projects',
    titlePt: 'Projetos Residenciais e Comerciais',
    shortDesc: 'Modern housing societies, multi-story apartments, retail complexes, and state-of-the-art corporate office hubs.',
    shortPt: 'Condomínios modernos, edifícios de múltiplos andares, complexos varejistas e sedes corporativas.',
    fullDesc:
      'We design and build contemporary residential communities and high-utility commercial plazas. Combining architectural finesse with functional space planning, our developments feature energy-efficient envelopes, superior thermal insulation, acoustic comfort, and premium finishes.',
    fullPt:
      'Projetamos e construímos comunidades residenciais contemporâneas e praças comerciais de alta utilidade. Combinando precisão arquitetônica com planejamento funcional, nossos empreendimentos têm envelopes energeticamente eficientes, isolamento térmico, conforto acústico e acabamentos premium.',
    capabilities: [
      'Multi-story residential towers & gated community layout',
      'Corporate office parks & commercial shopping complexes',
      'Aesthetic facade engineering (ACP, structural glazing, louvers)',
      'Integrated electrical, fire safety, HVAC & MEP installations',
      'High-grade flooring, vitrified tiling & durable weather coatings',
    ],
    capabilitiesPt: [
      'Torres residenciais de múltiplos andares e condomínios fechados',
      'Parques de escritórios corporativos e complexos comerciais',
      'Engenharia de fachadas (ACP, vidro estrutural, brises)',
      'Instalações elétricas, contra incêndio, HVAC e MEP integradas',
      'Pisos de alta qualidade, revestimentos vitrificados e pinturas duráveis',
    ],
    keyProjects: 'Urban residential blocks, commercial retail centers, corporate headquarters',
    keyPt: 'Blocos residenciais urbanos, centros varejistas, sedes corporativas',
    compliance: ['National Building Code (NBC 2016)', 'Local Town Planning Bye-laws'],
    badge: 'Turnkey Contracting',
    image: IMG.hero,
  },
  {
    id: 'infrastructure-gov',
    title: 'Infrastructure & Government Development',
    titlePt: 'Infraestrutura e Desenvolvimento Governamental',
    shortDesc: 'Public sector civic complexes, Panchayat Sarkar Bhawans, regional road corridors, culverts, and civic utilities.',
    shortPt: 'Complexos cívicos do setor público, Panchayat Sarkar Bhawans, corredores rodoviários, bueiros e utilidades cívicas.',
    fullDesc:
      'A trusted vendor to the Government of Bihar and national developmental foundations, Rudra executes critical civic assets. We build Panchayat Sarkar Bhawans, block administrative hubs, rural concrete roads, flood-resilient culverts, and public recreation parks.',
    fullPt:
      'Fornecedor de confiança do Governo de Bihar e de fundações de desenvolvimento nacionais, a Rudra executa ativos cívicos críticos. Construímos Panchayat Sarkar Bhawans, polos administrativos, estradas rurais de concreto, bueiros resilientes a inundações e parques públicos.',
    capabilities: [
      'Panchayat Sarkar Bhawan construction with full civic amenities',
      'Inter-district rigid concrete pavements & asphalt rural roads',
      'Veterinary hospitals & animal husbandry infrastructure',
      'Civic administrative blocks, public service counters & plazas',
      'Stormwater drainage, rainwater harvesting & flood protection',
    ],
    capabilitiesPt: [
      'Construção de Panchayat Sarkar Bhawan com amenidades cívicas completas',
      'Pavimentos rígidos interdistritais e estradas rurais asfaltadas',
      'Hospitais veterinários e infraestrutura de pecuária',
      'Blocos administrativos cívicos, balcões de atendimento e praças',
      'Drenagem pluvial, captação de água da chuva e proteção contra enchentes',
    ],
    keyProjects: 'State Government Panchayat Sarkar Bhawan network across multiple districts',
    keyPt: 'Rede estadual de Panchayat Sarkar Bhawan em múltiplos distritos',
    compliance: ['IRC:SP:20', 'MoRTH Specifications', 'State PWD Handbooks'],
    badge: 'Government Approved',
    image: IMG.civic,
  },
  {
    id: 'solar-renewable',
    title: 'Solar & Renewable Energy Solutions',
    titlePt: 'Soluções de Energia Solar e Renovável',
    shortDesc: "In alignment with India's National Solar Mission: rooftop PV, public solar street lighting, and rural microgrids.",
    shortPt: 'Alinhado à Missão Solar Nacional da Índia: FV em telhado, iluminação pública solar e microrredes rurais.',
    fullDesc:
      'Our dedicated renewable energy division designs, procures, and installs high-efficiency solar energy systems. From standalone solar street lighting in remote villages to high-capacity rooftop solar arrays for government institutions and industrial sheds, we provide clean, round-the-clock power.',
    fullPt:
      'Nossa divisão de energia renovável projeta, adquire e instala sistemas solares de alta eficiência. Da iluminação pública solar autônoma em vilarejos remotos a usinas em telhado para instituições governamentais e galpões industriais, fornecemos energia limpa 24 horas.',
    capabilities: [
      'Integrated all-in-one & semi-integrated LED solar street lighting',
      'Grid-tied (On-Grid) & hybrid rooftop solar PV plants (1kW - 500kW)',
      'Solar-powered community drinking water pumps & irrigation units',
      'Lithium Ferro Phosphate (LiFePO4) & Gel tubular battery storage',
      'Remote IoT monitoring, automated dusk-to-dawn sensors & AMC',
    ],
    capabilitiesPt: [
      'Iluminação pública LED solar integrada e semi-integrada',
      'Usinas FV em telhado on-grid e híbridas (1kW - 500kW)',
      'Bombas comunitárias de água potável e irrigação solar',
      'Armazenamento LiFePO4 e baterias tubulares de gel',
      'Monitoramento IoT remoto, sensores crepusculares e AMC',
    ],
    keyProjects: 'Over 1,200 solar street lighting poles & public institutional solar setups',
    keyPt: 'Mais de 1.200 postes de iluminação solar e instalações institucionais públicas',
    compliance: ['MNRE Specifications', 'IEC 61215', 'IEC 61730', 'BIS Certified'],
    badge: 'Clean Energy Pioneer',
    image: IMG.solar,
  },
  {
    id: 'healthcare-modular',
    title: 'Healthcare, Hospital & Modular Infrastructure',
    titlePt: 'Infraestrutura Hospitalar, de Saúde e Modular',
    shortDesc: 'Equipped medical facilities, inpatient hospital wards, prefabricated health centers, and clinical sanitation spaces.',
    shortPt: 'Instalações médicas equipadas, enfermarias internadas, centros de saúde pré-fabricados e espaços clínicos sanitários.',
    fullDesc:
      'Rudra Constructions develops sterile, resilient healthcare infrastructure. We deliver hospital ward construction, patient care units, diagnostic facility rooms, prefabricated modular isolation units, medical gas pipeline routing provisions, and anti-bacterial vinyl flooring.',
    fullPt:
      'A Rudra Constructions desenvolve infraestrutura de saúde estéril e resiliente. Entregamos construção de enfermarias, unidades de cuidados, salas de diagnóstico, unidades de isolamento modulares pré-fabricadas, provisão de gases medicinais e pisos vinílicos antibacterianos.',
    capabilities: [
      'Public hospital inpatient general wards & specialized clinics',
      'Rapid-deployment modular prefabricated healthcare cabins',
      'Medical-grade antimicrobial coatings, epoxy & vinyl flooring',
      'Dedicated clean power distribution & continuous backup wiring',
      'Sanitary plumbing, medical waste drainage & autoclave rooms',
    ],
    capabilitiesPt: [
      'Enfermarias gerais internadas e clínicas especializadas',
      'Cabines de saúde modulares pré-fabricadas de implantação rápida',
      'Revestimentos antimicrobianos de grau médico, epóxi e vinílico',
      'Distribuição de energia limpa dedicada e backup contínuo',
      'Hidráulica sanitária, drenagem de resíduos médicos e salas de autoclave',
    ],
    keyProjects: 'Government public hospital ward renovation and modular healthcare installations',
    keyPt: 'Reforma de enfermarias de hospitais públicos e instalações de saúde modulares',
    compliance: ['Indian Public Health Standards (IPHS)', 'AERB & Fire Safety'],
    badge: 'Life-Critical Works',
    image: IMG.hospital,
  },
  {
    id: 'materials-supply',
    title: 'Certified Building Materials Supply',
    titlePt: 'Fornecimento de Materiais de Construção Certificados',
    shortDesc: 'Direct factory-procured supply of Grade-53/43 cement, Fe 550D TMT bars, aggregates, sand, and AAC blocks.',
    shortPt: 'Fornecimento direto de fábrica de cimento Grau-53/43, vergalhões TMT Fe 550D, agregados, areia e blocos AAC.',
    fullDesc:
      'As an integrated construction and supply conglomerate, Rudra operates a reliable logistics network for bulk building materials. We supply tested, certified raw materials directly to government contractors, commercial builders, and our internal project sites at bulk-negotiated pricing.',
    fullPt:
      'Como conglomerado integrado de construção e fornecimento, a Rudra opera uma rede logística confiável para materiais a granel. Fornecemos matérias-primas testadas e certificadas diretamente a empreiteiros governamentais, construtores comerciais e nossos próprios canteiros, com preços de volume.',
    capabilities: [
      'TMT Rebars (Fe 500D, Fe 550D) with mill test certificates (MTC)',
      'OPC 53, OPC 43 & PPC Cement from top-tier primary manufacturers',
      'Graded blue metal aggregates (10mm, 20mm, 40mm) & washed river sand',
      'Autoclaved Aerated Concrete (AAC) blocks & fly-ash bricks',
      'High-spec solar panels, mono-perc modules, LED fixtures & GI poles',
    ],
    capabilitiesPt: [
      'Vergalhões TMT (Fe 500D, Fe 550D) com certificados de mill test (MTC)',
      'Cimento OPC 53, OPC 43 e PPC de fabricantes primários de primeira linha',
      'Agregados graduados (10mm, 20mm, 40mm) e areia de rio lavada',
      'Blocos de concreto celular autoclavado (AAC) e tijolos de cinza volante',
      'Painéis solares, módulos mono-perc, luminárias LED e postes GI',
    ],
    keyProjects: 'Bulk material supply contracts for state building corporations and road projects',
    keyPt: 'Contratos de fornecimento a granel para corporações estaduais de obras e rodovias',
    compliance: ['IS 1786', 'IS 269', 'IS 383', 'IS 2185'],
    badge: 'Direct Distribution',
    image: IMG.hero,
  },
];

const PROJECTS = [
  {
    id: 'proj-1',
    title: 'Panchayat Sarkar Bhawan Administrative Complex',
    titlePt: 'Complexo Administrativo Panchayat Sarkar Bhawan',
    category: 'civic',
    categoryLabel: 'Government Civic Infrastructure',
    categoryPt: 'Infraestrutura Cívica Governamental',
    client: 'Panchayati Raj Department (Bihar Govt.)',
    location: 'West Champaran & Regional Blocks',
    state: 'Bihar',
    year: '2025',
    status: 'Completed',
    statusPt: 'Concluído',
    scope: 'Full Turnkey Civil, Structural, Electrical & Solar Electrification',
    description:
      'Constructed standard-format, disaster-resilient Panchayat Sarkar Bhawan comprising public grievance halls, elected representative offices, digital citizen service centers, sanitized washrooms, and solar backup power.',
    descriptionPt:
      'Construção de Panchayat Sarkar Bhawan resiliente a desastres, com salas de atendimento ao público, gabinetes de representantes eleitos, centros digitais de serviços ao cidadão, sanitários e energia solar de backup.',
    highlights: [
      'Constructed 5,400+ sq.ft reinforced concrete two-story administrative building',
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
    titlePt: 'Modernização de Enfermaria de Hospital Público',
    category: 'healthcare',
    categoryLabel: 'Healthcare & Life Sciences',
    categoryPt: 'Saúde e Ciências da Vida',
    client: 'Building Construction Department (Bihar Govt.)',
    location: 'District Hospital Complex',
    state: 'Bihar',
    year: '2025',
    status: 'Completed',
    statusPt: 'Concluído',
    scope: 'Civil Structural Refurbishment, Flooring, False Ceiling & Medical Electrical',
    description:
      'Complete structural renovation and retrofitting of a multi-bed hospital inpatient ward. Features medical-grade anti-static vinyl flooring, acoustic false ceiling with soothing blue LED illumination, ergonomic patient beds, and specialized sanitation zones.',
    descriptionPt:
      'Renovação estrutural completa de enfermaria hospitalar de múltiplos leitos. Piso vinílico antiestático de grau médico, forro acústico com iluminação LED, leitos ergonômicos e zonas sanitárias especializadas.',
    highlights: [
      'Modernized 24-bed hospital ward with individual patient monitor points',
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
    titlePt: 'Missão de Eletrificação Rural Solar e Iluminação Pública',
    category: 'solar',
    categoryLabel: 'Renewable Energy & Public Utilities',
    categoryPt: 'Energia Renovável e Utilidades Públicas',
    client: 'Sehgal Foundation & Aroh Foundation',
    location: 'Semi-Urban & Rural Districts',
    state: 'Bihar & Uttar Pradesh',
    year: '2025',
    status: 'Commissioned',
    statusPt: 'Comissionado',
    scope: 'Supply, Civil Erection, Commissioning & Maintenance of Solar Infrastructure',
    description:
      'Executed widespread installation of autonomous high-lumen LED solar street light systems across rural villages, community squares, and primary health centers. Provides dusk-to-dawn safety, crime deterrence, and eco-friendly lighting.',
    descriptionPt:
      'Instalação ampla de sistemas autônomos de iluminação pública LED solar de alto lúmen em vilarejos, praças comunitárias e centros de saúde primários. Segurança do crepúsculo ao amanhecer e iluminação ecológica.',
    highlights: [
      'Installed 450+ autonomous solar street lighting poles with hot-dip galvanized coating',
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
    titlePt: 'Passarela Rodoviária Regional e Infraestrutura Segmentada',
    category: 'infrastructure',
    categoryLabel: 'Highways & Heavy Engineering',
    categoryPt: 'Rodovias e Engenharia Pesada',
    client: 'Bihar State Building Construction Corp LTD.',
    location: 'Patna - Bettiah Regional Corridor',
    state: 'Bihar',
    year: '2025',
    status: 'In Progress',
    statusPt: 'Em andamento',
    scope: 'Heavy Foundation Piling, Pier Caps & Segmental Deck Erection',
    description:
      'Execution of reinforced concrete substructure and pier columns for critical bypass corridor. Utilizes computerized batching, high-tensile Fe 550D rebar cages, and self-compacting concrete to ensure long-term structural integrity under heavy axle traffic.',
    descriptionPt:
      'Execução de infraestruturas de concreto armado e colunas de pilar para corredor de contorno. Usa usinagem computadorizada, gaiolas de vergalhão Fe 550D e concreto autoadensável para integridade estrutural sob tráfego pesado.',
    highlights: [
      'Deep bored cast-in-situ piling reaching firm bedrock strata',
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
    titlePt: 'Instalação Técnica de Pesca e Recursos Animais',
    category: 'civic',
    categoryLabel: 'Specialized State Facilities',
    categoryPt: 'Instalações Estaduais Especializadas',
    client: 'Bihar Animal & Fisheries Resource Dept.',
    location: 'Bettiah Regional Extension',
    state: 'Bihar',
    year: '2025',
    status: 'Completed',
    statusPt: 'Concluído',
    scope: 'Civil Laboratory Construction, Cold Storage Chambers & Hatchery Infrastructure',
    description:
      'Specialized institutional facility built for veterinary diagnosis, aquatic testing, and storage of animal resource supplies. Includes moisture-resistant wall treatments, dedicated drainage, cold room enclosures, and staff administrative quarters.',
    descriptionPt:
      'Instalação institucional especializada para diagnóstico veterinário, testes aquáticos e armazenamento de insumos. Inclui tratamentos de parede resistentes à umidade, drenagem dedicada, câmaras frias e alojamentos administrativos.',
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
    titlePt: 'Remessa Logística de Aço TMT e Cimento a Granel',
    category: 'materials',
    categoryLabel: 'Material Distribution & Supply',
    categoryPt: 'Distribuição e Fornecimento de Materiais',
    client: 'Gramin Vikas Trust (GVT) & WOTR Projects',
    location: 'Jharkhand & Odisha Operations',
    state: 'Jharkhand & Odisha',
    year: '2025',
    status: 'Completed',
    statusPt: 'Concluído',
    scope: 'Certified Primary Mill Material Procurement, Weighment & Multi-Site Delivery',
    description:
      'Consolidated procurement and logistics dispatch of over 1,800 Metric Tonnes of primary steel and 45,000 bags of OPC 53 cement for watershed development structures, check dams, and rural housing clusters.',
    descriptionPt:
      'Aquisição consolidada e despacho logístico de mais de 1.800 toneladas métricas de aço primário e 45.000 sacos de cimento OPC 53 para estruturas de bacias, barragens de contenção e núcleos habitacionais rurais.',
    highlights: [
      '100% batch traceability with original mill test certificates (MTC)',
      'Strict weighbridge verification and zero transit damage logistics',
      'Dedicated fleet of 10-wheel heavy commercial vehicles deployed',
      'Warehouse buffer stock maintained in Patna and Bettiah yards',
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
  { id: 'hq-registered', type: 'Registered Headquarters', typePt: 'Sede Registrada', city: 'Ramnagar, West Champaran', state: 'Bihar', address: 'Ward No.2, Sikta Belwa, Ramnagar', pincode: '845103', isPrimary: true, lat: 27.1667, lng: 84.3167 },
  { id: 'delhi-ncr', type: 'Regional Corporate Hub', typePt: 'Polo Corporativo Regional', city: 'Ghaziabad (Delhi NCR)', state: 'Uttar Pradesh', address: 'S8, Second Floor, Aaditya Mall, near Kotak Mahindra Bank, Indirapuram', pincode: '201014', isPrimary: false, lat: 28.6415, lng: 77.3714 },
  { id: 'patna-branch', type: 'State Branch Office', typePt: 'Filial Estadual', city: 'Patna', state: 'Bihar', address: 'Sanyukta Bhawan, Road Number Zero, Shivpuri', pincode: '800023', isPrimary: false, lat: 25.5941, lng: 85.1376 },
  { id: 'bettiah-branch', type: 'Project Operations Office', typePt: 'Escritório de Operações', city: 'Bettiah', state: 'Bihar', address: 'Basant Vihar, Hariwatika Chowk, Bettiah', pincode: '845438', isPrimary: false, lat: 26.8022, lng: 84.5029 },
  { id: 'assam-bedeti', type: 'State Branch Office', typePt: 'Filial Estadual', city: 'Biswanath', state: 'Assam', address: 'Bihmari Jarani, P.O. Bedeti, Dist. Biswanath', pincode: '784179', isPrimary: false, lat: 26.7335, lng: 93.1491 },
  { id: 'assam-jorhat', type: 'Project Operations Office', typePt: 'Escritório de Operações', city: 'Jorhat', state: 'Assam', address: 'Royal Garden Building 5E, Opposite Jorhat Railway Station', pincode: '785001', isPrimary: false, lat: 26.7509, lng: 94.2037 },
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
  { id: 'site-ramnagar-hq', title: 'Registered Corporate HQ & Panchayat Sarkar Bhawans', cat: 'civic', city: 'Ramnagar, West Champaran', state: 'Bihar', lat: 27.1667, lng: 84.3167, client: 'Panchayati Raj Department & District Administration', status: 'Operational Hub', year: 'Est. 2025', scope: 'Central corporate headquarters and cluster of 2-story reinforced concrete Panchayat Sarkar Bhawans with digital citizen halls.', value: '₹4.85 Cr', metric: '5,400 sq.ft RCC Hub', image: IMG.civic },
  { id: 'site-bettiah-lab', title: 'Animal & Fisheries Resource Diagnostic Facility', cat: 'civic', city: 'Bettiah, West Champaran', state: 'Bihar', lat: 26.8022, lng: 84.5029, client: 'Bihar Animal & Fisheries Resource Dept.', status: 'Completed', year: '2025', scope: 'State technical laboratory, cold room storage facilities (2-8°C), and district project logistics management office.', value: '₹2.90 Cr', metric: '3,800 sq.ft Clean Lab', image: IMG.civic },
  { id: 'site-patna-bridge', title: 'Regional Highway Substructure & State Office', cat: 'infrastructure', city: 'Shivpuri, Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, client: 'Bihar State Building Construction Corp LTD.', status: 'Under Execution', year: '2025-2026', scope: 'Deep bored cast-in-situ piling, heavy pier columns, and state liaison branch office at Sanyukta Bhawan.', value: '₹6.20 Cr', metric: '4,200 m³ High-Load M45', image: IMG.hero },
  { id: 'site-muzaffarpur-hospital', title: 'Sub-Divisional Hospital Inpatient Ward Modernization', cat: 'healthcare', city: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647, client: 'Building Construction Dept. (Bihar Govt.)', status: 'Completed', year: '2025', scope: '24-bed inpatient ward retrofit with antimicrobial seamless flooring, medical gas plumbing, and 350 Lux lighting.', value: '₹1.75 Cr', metric: '24 Beds Delivered', image: IMG.hospital },
  { id: 'site-motihari-solar', title: 'Panchayat Solar Streetlighting & Mini-Grid Mission', cat: 'solar', city: 'Motihari, East Champaran', state: 'Bihar', lat: 26.647, lng: 84.9089, client: 'Sehgal Foundation & BREDA Programs', status: 'Completed', year: '2025', scope: 'Erection of 320+ hot-dip galvanized solar street poles with Mono-PERC PV modules and LiFePO4 battery banks.', value: '₹88 Lakhs', metric: '320+ Solar Poles', image: IMG.solar },
  { id: 'site-delhi-ncr-hub', title: 'Delhi NCR Corporate Hub & Commercial Contracting', cat: 'office', city: 'Indirapuram, Ghaziabad', state: 'Uttar Pradesh', lat: 28.6415, lng: 77.3714, client: 'Commercial Developers & Corporate Clients', status: 'Operational Hub', year: 'Active', scope: 'Regional bidding and commercial corporate office at Aaditya Mall managing North India tender procurement.', value: '₹5.50 Cr Pipeline', metric: 'Regional Bidding Hub', image: IMG.hero },
  { id: 'site-gorakhpur-civic', title: 'Civic Administrative Complex & Material Depots', cat: 'civic', city: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732, client: 'Municipal & Public Works Departments', status: 'Under Execution', year: '2025-2026', scope: 'RCC framed municipal administrative building and central supply staging yard for Fe 550D primary TMT bars.', value: '₹3.40 Cr', metric: '12,000 sq.ft Complex', image: IMG.civic },
  { id: 'site-varanasi-solar', title: 'Community Solar Water Systems & Lighting', cat: 'solar', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, client: 'Aroh Foundation & Village Committees', status: 'Completed', year: '2025', scope: 'Dual-axis solar pump arrays and 140 autonomous street lighting units across peri-urban village clusters.', value: '₹72 Lakhs', metric: '140 Solar Poles', image: IMG.solar },
  { id: 'site-biswanath-assam', title: 'Assam Regional Operations & Rural Infrastructure', cat: 'office', city: 'Biswanath (Bedeti)', state: 'Assam', lat: 26.7335, lng: 93.1491, client: 'State Panchayati Raj & Development Agencies', status: 'Operational Hub', year: 'Active 2025', scope: 'North-East regional administrative base, heavy machinery depot, and flood protection culvert construction.', value: '₹2.80 Cr', metric: 'North-East Base', image: IMG.hero },
  { id: 'site-jorhat-assam', title: 'Animal Husbandry Center & District Operations Base', cat: 'civic', city: 'Jorhat (Opp. Railway Station)', state: 'Assam', lat: 26.7509, lng: 94.2037, client: 'Assam Veterinary & Agriculture Directorate', status: 'Completed', year: '2025', scope: 'Regional veterinary cold chain center, research chambers, and operational office at Royal Garden Building.', value: '₹2.15 Cr', metric: 'Veterinary Center', image: IMG.civic },
  { id: 'site-guwahati-retaining', title: 'Brahmaputra Basin Flood Retaining & Staging Yard', cat: 'infrastructure', city: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, client: 'Regional Water Resources & Local Bodies', status: 'Under Execution', year: '2025-2026', scope: 'Boulder pitching, reinforced concrete retaining walls, and bulk staging yard for Grade-53 cement dispatch.', value: '₹3.90 Cr', metric: '1.4 km Retaining Wall', image: IMG.hero },
  { id: 'site-ranchi-jharkhand', title: 'Catchment Check Dams & 1,800 MT Rebar Supply', cat: 'materials', city: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, client: 'Gramin Vikas Trust (GVT) & State Watersheds', status: 'Completed', year: '2025', scope: 'Bulk supply of 1,800 MT tested primary rebar and construction of 6 masonry check dams in tribal blocks.', value: '₹4.10 Cr', metric: '1,800 MT Primary TMT', image: IMG.hero },
  { id: 'site-dhanbad-jharkhand', title: 'Heavy Foundation Substructures & Drainage Works', cat: 'infrastructure', city: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304, client: 'Industrial & Municipal Authorities', status: 'Under Execution', year: '2025-2026', scope: 'Heavy machine foundation footings, concrete stormwater drains, and structural steel shed erection.', value: '₹2.60 Cr', metric: 'Heavy RCC Pours', image: IMG.hero },
  { id: 'site-bhubaneswar-odisha', title: 'Cyclone-Resilient Community Shelter & Solar Arrays', cat: 'civic', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, client: 'WOTR Catchment Engineering & State Programs', status: 'Completed', year: '2025', scope: 'High wind-rated RCC community hall with 10 kW rooftop solar microgrid and dedicated rainwater recharge.', value: '₹1.95 Cr', metric: 'Wind-Resilient Hall', image: IMG.civic },
  { id: 'site-srinagar-jk', title: 'High-Altitude Solar Microgrid & Insulated Concrete', cat: 'solar', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0837, lng: 74.7973, client: 'Public Utilities & Tourism Department', status: 'Completed', year: '2025', scope: 'Cold-resistant solar lighting systems with frost-resistant battery enclosures and low-temp curing concrete.', value: '₹1.45 Cr', metric: 'Sub-Zero Operation', image: IMG.solar },
  { id: 'site-raipur-chhattisgarh', title: 'Rural Water Supply Structures & Solar Lighting', cat: 'solar', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, client: 'State Panchayat & Rural Engineering Services', status: 'Completed', year: '2025', scope: 'Erection of 180 solar LED streetlights and construction of concrete pump stations for rural habitations.', value: '₹1.15 Cr', metric: '180 Solar Poles', image: IMG.solar },
  { id: 'site-itanagar-arunachal', title: 'Hill Slope Gabion Retaining & Border Electrification', cat: 'infrastructure', city: 'Itanagar', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053, client: 'State PWD & Rural Electrification', status: 'Under Execution', year: '2025-2026', scope: 'Seismic Zone-V gabion and concrete retaining walls, solar mini-grids, and drainage catchments.', value: '₹2.20 Cr', metric: 'Zone-V Seismic', image: IMG.hero },
  { id: 'site-rewa-mp', title: 'Solar Park Ancillary Civil Works & Bulk Rebar', cat: 'materials', city: 'Rewa', state: 'Madhya Pradesh', lat: 24.5373, lng: 81.3042, client: 'Renewable Energy Contractors', status: 'Completed', year: '2025', scope: 'Supply of 650 MT Fe 550D TMT bars, cast foundation plinths for central inverters, and perimeter grading.', value: '₹1.80 Cr', metric: '650 MT Rebar', image: IMG.solar },
];

const CLIENTS = [
  { name: 'Panchayati Raj Department', category: 'Government Department', description: 'Government of Bihar — Turnkey execution of multi-district Panchayat Sarkar Bhawan administrative complexes.', region: 'Bihar' },
  { name: 'Building Construction Department', category: 'Government Department', description: 'Government of Bihar — Public health facilities, hospital ward retrofits, and state institutional structures.', region: 'Bihar' },
  { name: 'Bihar State Building Corporation LTD.', category: 'Public Undertaking', description: 'State civil works, high-specification public infrastructure, and heavy structural engineering projects.', region: 'Bihar' },
  { name: 'Bihar Animal & Fisheries Resource Dept.', category: 'Government Department', description: 'Veterinary clinical facilities, cold chain storage enclosures, and research hatcheries.', region: 'Bihar' },
  { name: 'Aashray Foundation', category: 'Development Foundation', description: 'Social housing, community infrastructure, clean sanitation facilities, and rural development programs.', region: 'National' },
  { name: 'Sehgal Foundation', category: 'Development Foundation', description: 'Renewable solar street lighting, water conservation structures, and sustainable rural electrification.', region: 'Pan-India' },
  { name: 'Srijjan', category: 'Development Foundation', description: 'Livelihood infrastructure, community processing centers, and village civic utilities.', region: 'East India' },
  { name: 'WOTR (Watershed Organisation Trust)', category: 'Development Foundation', description: 'Civil check dams, rural water storage structures, and sustainable catchment engineering.', region: 'Multi-State' },
  { name: 'GVT (Gramin Vikas Trust)', category: 'Development Foundation', description: 'Bulk construction material procurement, agrarian logistics facilities, and community buildings.', region: 'National' },
  { name: 'Aroh Foundation', category: 'Development Foundation', description: 'Solar electrification of public schools, rural healthcare posts, and community centers.', region: 'North & East India' },
];

const FAQS = [
  {
    q: 'What classes of government tenders and commercial projects does Rudra handle?',
    qPt: 'Quais classes de licitações governamentais e projetos comerciais a Rudra executa?',
    a: 'Rudra Constructions & Suppliers is qualified for Class-A civil engineering contracts, institutional tenders, and turnkey commercial projects. With an audited turnover exceeding ₹14.65 Crore, we handle single-contract values ranging from ₹25 Lakhs up to ₹15 Crore across civil structures, roads, government civic buildings, hospital retrofits, and renewable solar arrays.',
    aPt: 'A Rudra Constructions & Suppliers está qualificada para contratos de engenharia civil Classe-A, licitações institucionais e projetos comerciais turnkey. Com faturamento auditado superior a ₹14,65 Crore, executamos contratos individuais de ₹25 Lakhs até ₹15 Crore em estruturas civis, estradas, edifícios cívicos, reformas hospitalares e usinas solares.',
  },
  {
    q: 'Do you supply building materials as a standalone service or only for your own sites?',
    qPt: 'Vocês fornecem materiais de construção como serviço independente ou apenas para os próprios canteiros?',
    a: 'We offer both! Through our dedicated materials supply division, we provide bulk supply of Grade 53/43 cement, Fe 550D TMT rebars, graded aggregates, and AAC blocks to external government contractors, private developers, and infrastructure firms, complete with primary mill test certificates (MTC) and weighbridge verification.',
    aPt: 'Oferecemos ambos. Pela divisão de materiais, fornecemos a granel cimento Grau 53/43, vergalhões TMT Fe 550D, agregados graduados e blocos AAC a empreiteiros governamentais, incorporadores e empresas de infraestrutura, com certificados MTC e verificação em balança rodoviária.',
  },
  {
    q: 'What quality assurance and testing protocols are enforced during construction?',
    qPt: 'Quais protocolos de garantia da qualidade e ensaios são aplicados na construção?',
    a: 'We adhere strictly to Bureau of Indian Standards (IS 456, IS 1786, IS 1893). For every concrete casting, we prepare standard test cubes tested at 7 and 28 days in NABL-accredited laboratories. We also conduct on-site slump cone tests, ultrasonic pulse velocity (UPV) tests, and ultrasonic weld flaw inspections for structural steel.',
    aPt: 'Seguimos rigorosamente o Bureau of Indian Standards (IS 456, IS 1786, IS 1893). Para cada concretagem, preparamos corpos de prova ensaiados aos 7 e 28 dias em laboratórios acreditados NABL. Também realizamos slump, velocidade de pulso ultrassônico (UPV) e inspeção ultrassônica de soldas em aço estrutural.',
  },
  {
    q: 'How does your solar and renewable energy division operate?',
    qPt: 'Como opera a divisão de energia solar e renovável?',
    a: 'Our solar division designs and executes MNRE-compliant solar systems. We specialize in off-grid and hybrid rooftop solar power plants for institutional and commercial buildings, as well as integrated high-lumen LED solar street light systems with LiFePO4 battery technology and automated twilight sensors for rural and municipal roads.',
    aPt: 'Nossa divisão solar projeta e executa sistemas conformes à MNRE. Especializamo-nos em usinas FV off-grid e híbridas em telhado para edifícios institucionais e comerciais, bem como iluminação pública LED solar com baterias LiFePO4 e sensores crepusculares para vias rurais e municipais.',
  },
  {
    q: 'Where are your registered and operational branch offices located?',
    qPt: 'Onde estão os escritórios registrados e operacionais?',
    a: 'Our Registered Headquarters is located in Ramnagar, West Champaran (Bihar 845103). We operate a Regional Corporate Hub in Ghaziabad (Delhi NCR) at Aaditya Mall, Indirapuram, state offices in Patna (Shivpuri) and Bettiah (Hariwatika Chowk), as well as dual North-East operational hubs in Assam at Biswanath (Bedeti) and Jorhat (Royal Garden Building).',
    aPt: 'A sede registrada fica em Ramnagar, West Champaran (Bihar 845103). Operamos um polo corporativo em Ghaziabad (Delhi NCR) no Aaditya Mall, Indirapuram, filiais em Patna (Shivpuri) e Bettiah (Hariwatika Chowk), além de polos no Nordeste em Assam: Biswanath (Bedeti) e Jorhat (Royal Garden Building).',
  },
  {
    q: 'How can government departments or developers request an official quote or RFP response?',
    qPt: 'Como departamentos governamentais ou incorporadores solicitam cotação oficial ou resposta a RFP?',
    a: 'You can submit your project parameters directly through our online Project Cost Estimator, email tender documents to rudraconstructionsupplier14@gmail.com, or reach our project director directly at +91 8099588978. Our tender estimation team typically responds within 24–48 business hours with a preliminary BOQ review.',
    aPt: 'Envie os parâmetros do projeto pelo Estimador de Custos online, encaminhe documentos de licitação para rudraconstructionsupplier14@gmail.com ou fale com o diretor de projetos no +91 8099588978. A equipe de orçamento responde em 24–48 horas úteis com revisão preliminar de BOQ.',
  },
];

const STEPS = [
  { n: '01', title: 'Requirement Analysis & Site Assessment', titlePt: 'Análise de Requisitos e Avaliação do Canteiro', tag: 'Precision data collection before the first shovel touches soil', desc: 'Every successful project begins with comprehensive feasibility studies. Our engineering crew conducts on-site topographical surveys, soil bearing capacity (SBC) borehole tests, environmental impact reviews, and stakeholder alignment meetings.', deliverables: ['Digital Total Station (DTS) topographical survey maps', 'Geotechnical borehole soil investigation reports', 'Hydrological and flood-level historical analysis', 'Preliminary statutory clearance checklist'], duration: 'Week 1 - 2', tools: ['Digital Total Station', 'Soil Core Drilling Rig', 'GIS Mapping Software'] },
  { n: '02', title: 'Design, Planning & Cost Estimation', titlePt: 'Projeto, Planejamento e Orçamentação', tag: 'Value-engineered structural plans with transparent BOQs', desc: 'Our in-house structural and MEP engineers draft detailed 2D/3D blueprints and computerized structural simulations. We prepare transparent Bills of Quantities (BOQ), critical path milestone schedules, and value-engineering recommendations that reduce client expenditure without cutting corners.', deliverables: ['Complete architectural & structural working drawings', 'STAAD.Pro structural stability & seismic load calculations', 'Item-rate Bill of Quantities (BOQ) with market-indexed rates', 'Primavera / MS Project milestone Gantt schedule'], duration: 'Week 2 - 4', tools: ['AutoCAD 2025', 'STAAD.Pro', 'Revit BIM', 'CostX BOQ Engine'] },
  { n: '03', title: 'Procurement & Resource Allocation', titlePt: 'Aquisição e Alocação de Recursos', tag: 'Direct mill procurement and mechanized heavy plant mobilization', desc: 'Leveraging our integrated materials supply chain, we procure certified raw materials directly from primary mills, eliminating intermediary markups. Heavy machinery—including transit mixers, mini-batching plants, excavators, and scaffolding—is deployed to the project staging depot.', deliverables: ['Raw material vendor qualification and Mill Test Certificates (MTC)', 'Mobilization of licensed plant and heavy machinery', 'On-site labor camp setup adhering to occupational health standards', 'Secure material inventory control and testing bay'], duration: 'Week 4 - 6', tools: ['Primary Mill Supply Chain', 'Heavy Fleet Logistics', 'Batching Plants'] },
  { n: '04', title: 'On-Site Execution & Supervision', titlePt: 'Execução e Supervisão no Canteiro', tag: 'Meticulous craftsmanship governed by Resident Engineers', desc: 'Construction proceeds under continuous vigilance. A dedicated Resident Project Manager oversees day-to-day shuttering, rebar binding, concrete pours, curing schedules, and finishing works. Daily digital progress logs and weekly drone aerial scans keep stakeholders fully informed.', deliverables: ['Daily Site Progress Reports (DPR) with photo timestamps', 'Strict stage-gate formwork and rebar inspection sign-offs', '28-day water curing protocols & chemical curing compounds', 'Zero-compromise personal protective equipment (PPE) enforcement'], duration: 'Project-Specific Duration', tools: ['Resident Engineers', 'Total Station Alignment', 'Daily DPR Tracking'] },
  { n: '05', title: 'Quality Assurance & Safety Checks', titlePt: 'Garantia da Qualidade e Checagens de Segurança', tag: 'Comprehensive lab verification, audits & turnkey handover', desc: 'Before any structure is handed over, it undergoes rigorous multi-point validation. We conduct concrete core compression tests, non-destructive rebound hammer tests, electrical insulation megger tests, and plumbing pressure tests to ensure flawless operational readiness.', deliverables: ['Third-party NABL certified laboratory test reports', 'As-Built Drawings and operations & maintenance (O&M) manuals', 'Statutory completion certificates and structural safety warranty', 'Seamless client facility handover with staff training'], duration: 'Final 2 - 4 Weeks', tools: ['NABL Accredited Testing', 'Rebound Hammer', 'Ultrasonic Pulse Velocity'] },
];

const CLEARANCES = [
  { title: 'Class-1 Civil Enlistment', authority: 'PWD / CPWD Registered', certNo: 'CPWD/CL-1/2025/RC-0842', details: 'Authorized for heavy civil, administrative bhawans, roads, and high-value institutional tenders.' },
  { title: 'GSTIN & Tax Compliance Rating', authority: 'Govt. of India & State Commercial Tax', certNo: '10AALCR8492K1Z5', details: '100% compliant e-way billing, timely GSTR-1 & 3B filings, and auditable procurement ledgers.' },
  { title: 'Bank Solvency & BG Facilities', authority: 'State Bank of India (SBI)', certNo: 'SBI/SME/SOLV-14CR/2025', details: 'Solvency clearance certified for ₹10.00+ Crore with active Bank Guarantee (BG) and EMD issuance lines.' },
  { title: 'Statutory Labor & Social Security', authority: 'Ministry of Labour & Employment', certNo: 'EPFO: BR/PAT/0094120 • ESIC Registered', details: 'Mandatory Provident Fund, ESIC medical insurance, and police verification for all on-site manpower.' },
  { title: 'NABL Laboratory Testing Validation', authority: 'National Accreditation Board (NABL)', certNo: 'IS 456 & IS 1786 Verified', details: 'Mandatory 7-day & 28-day concrete cube compressive tests, steel tensile yield tests, and silt content audits.' },
  { title: 'Integrated Management ISO Triad', authority: 'International Organization for Standardization', certNo: 'ISO 9001:2015 • ISO 14001:2015 • ISO 45001:2018', details: 'Audited quality control, environmental safeguards, and zero-accident occupational safety protocols.' },
];

const COPY = {
  en: {
    lang: 'en',
    locale: 'en_IN',
    hreflang: 'en',
    prefix: '',
    nav: [
      ['Overview', '/about/'],
      ['Services', '/services/'],
      ['Portfolio', '/projects/'],
      ['Locations', '/locations/'],
      ['Presence', '/presence/'],
      ['FAQ', '/faq/'],
      ['Contact', '/contact/'],
    ],
    home: 'Home',
    switchLabel: 'Português (Brasil)',
    switchTo: '/pt-br/',
    request: 'Request Project Proposal',
    estimate: 'CPWD DSR Cost Estimator',
    related: 'Related index pages',
    offices: 'Operating offices',
    verticals: 'Engineering disciplines',
    crawl: 'Indexing',
    rights: `Copyright © ${new Date().getFullYear()} Rudra Constructions & Suppliers Pvt. Ltd. All rights reserved.`,
    hosted: 'Served from a Brazil (São Paulo) edge environment · America/Sao_Paulo · hreflang pt-BR + en',
    more: 'Read the full interactive site',
  },
  pt: {
    lang: 'pt-BR',
    locale: 'pt_BR',
    hreflang: 'pt-BR',
    prefix: '/pt-br',
    nav: [
      ['Visão geral', '/pt-br/about/'],
      ['Serviços', '/pt-br/services/'],
      ['Portfólio', '/pt-br/projects/'],
      ['Escritórios', '/pt-br/locations/'],
      ['Presença', '/pt-br/presence/'],
      ['FAQ', '/pt-br/faq/'],
      ['Contato', '/pt-br/contact/'],
    ],
    home: 'Início',
    switchLabel: 'English',
    switchTo: '/',
    request: 'Solicitar proposta de projeto',
    estimate: 'Estimador de custos CPWD DSR',
    related: 'Páginas de índice relacionadas',
    offices: 'Escritórios operacionais',
    verticals: 'Disciplinas de engenharia',
    crawl: 'Indexação',
    rights: `Copyright © ${new Date().getFullYear()} Rudra Constructions & Suppliers Pvt. Ltd. Todos os direitos reservados.`,
    hosted: 'Ambiente de entrega no Brasil (São Paulo) · America/Sao_Paulo · hreflang pt-BR + en',
    more: 'Abrir o site interativo completo',
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
function track(loc, { lastmod = LASTMOD, changefreq = 'weekly', priority = '0.8', image, lang = 'en' } = {}) {
  urls.push({ loc, lastmod, changefreq, priority, image, lang });
}

function hreflangs(enPath, ptPath) {
  return `
    <link rel="alternate" hreflang="en" href="${esc(abs(enPath))}" />
    <link rel="alternate" hreflang="pt-BR" href="${esc(abs(ptPath))}" />
    <link rel="alternate" hreflang="x-default" href="${esc(abs(enPath))}" />`;
}

function layout({ langKey, pathEn, pathPt, title, description, keywords, h1, crumbs, image, body, schema, type = 'WebPage' }) {
  const L = COPY[langKey];
  const pagePath = langKey === 'pt' ? pathPt : pathEn;
  const canonical = abs(pagePath);
  const ogLocale = L.locale;
  const ogAlt = langKey === 'pt' ? 'en_IN' : 'pt_BR';
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
        isPartOf: { '@id': `${abs('/') }#website` },
        about: { '@id': `${abs('/') }#organization` },
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
  <meta http-equiv="content-language" content="${L.lang}" />
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
  ${hreflangs(pathEn, pathPt)}
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
  <link rel="alternate" type="application/rss+xml" title="Rudra Constructions RSS" href="/rss.xml" />
  <link rel="alternate" type="application/atom+xml" title="Rudra Constructions Atom" href="/atom.xml" />
  <link rel="alternate" type="application/feed+json" title="Rudra Constructions JSON Feed" href="/feed.json" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/favicon.svg" />
  <link rel="search" type="application/opensearchdescription+xml" title="Rudra Constructions" href="/opensearch.xml" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="${ogLocale}" />
  <meta property="og:locale:alternate" content="${ogAlt}" />
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
  <a class="skip" href="#main">${langKey === 'pt' ? 'Saltar para o conteúdo' : 'Skip to content'}</a>
  <header class="site">
    <div class="wrap nav">
      <a class="brand" href="${L.prefix || '/'}">
        <span class="mark">RC</span>
        <strong>Rudra Constructions</strong><span>&amp; Suppliers</span>
      </a>
      <nav class="links" aria-label="Primary">${nav}</nav>
      <div class="lang">
        <a href="${pathEn}" ${langKey === 'en' ? 'aria-current="page"' : ''}>EN</a>
        <a href="${pathPt}" ${langKey === 'pt' ? 'aria-current="page"' : ''}>PT-BR</a>
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
        </div>
        <div>
          <h2>${L.verticals}</h2>
          <p>${SERVICES.map((s) => `<a href="${L.prefix}/services/${s.id}/">${esc(langKey === 'pt' ? s.titlePt : s.title)}</a>`).join('<br/>')}</p>
        </div>
        <div>
          <h2>${L.offices}</h2>
          <p>${OFFICES.map((o) => `<a href="${L.prefix}/locations/${o.id}/">${esc(o.city)}</a>`).join('<br/>')}</p>
        </div>
        <div>
          <h2>${L.crawl}</h2>
          <p>
            <a href="/sitemap.xml">XML Sitemap</a><br/>
            <a href="/sitemap.html">HTML Sitemap</a><br/>
            <a href="/rss.xml">RSS</a> · <a href="/atom.xml">Atom</a> · <a href="/feed.json">JSON</a><br/>
            <a href="/llms.txt">llms.txt</a> · <a href="/robots.txt">robots.txt</a><br/>
            <a href="/directory/">${langKey === 'pt' ? 'Kit de citação' : 'Citation kit'}</a>
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
  const L = COPY[langKey];
  const title = langKey === 'pt' ? s.titlePt : s.title;
  const full = langKey === 'pt' ? s.fullPt : s.fullDesc;
  const caps = langKey === 'pt' ? s.capabilitiesPt : s.capabilities;
  const key = langKey === 'pt' ? s.keyPt : s.keyProjects;
  return `
    <p class="lede">${esc(full)}</p>
    <div class="meta-row">
      <span class="pill">${esc(s.badge)}</span>
      ${s.compliance.map((c) => `<span class="pill">${esc(c)}</span>`).join('')}
    </div>
    <div class="hero-img"><img src="${s.image}" alt="${esc(title)} — ${esc(COMPANY.name)}" width="1200" height="630" /></div>
    <article class="prose" itemscope itemtype="https://schema.org/Service">
      <meta itemprop="name" content="${esc(title)}" />
      <meta itemprop="provider" content="${esc(COMPANY.name)}" />
      <h2>${langKey === 'pt' ? 'Entregáveis técnicos' : 'Technical deliverables'}</h2>
      <ul>${caps.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      <h2>${langKey === 'pt' ? 'Obras representativas' : 'Representative works'}</h2>
      <p>${esc(key)}</p>
      <h2>${langKey === 'pt' ? 'Conformidade' : 'Compliance'}</h2>
      <p>${esc(s.compliance.join(' · '))}</p>
      <div class="actions">
        <a class="cta" href="${L.prefix}/contact/">${L.request}</a>
        <a class="cta ghost" href="/#services">${L.more}</a>
      </div>
    </article>
    <section class="related">
      <h2>${L.related}</h2>
      <div class="grid grid-3">
        ${SERVICES.filter((x) => x.id !== s.id)
          .map(
            (x) =>
              `<article class="card"><h3><a href="${L.prefix}/services/${x.id}/">${esc(langKey === 'pt' ? x.titlePt : x.title)}</a></h3><p>${esc(langKey === 'pt' ? x.shortPt : x.shortDesc)}</p></article>`
          )
          .join('')}
      </div>
    </section>`;
}

function projectBody(p, langKey) {
  const L = COPY[langKey];
  const title = langKey === 'pt' ? p.titlePt : p.title;
  const desc = langKey === 'pt' ? p.descriptionPt : p.description;
  return `
    <p class="lede">${esc(desc)}</p>
    <div class="meta-row">
      <span class="pill">${esc(langKey === 'pt' ? p.categoryPt : p.categoryLabel)}</span>
      <span class="pill">${esc(langKey === 'pt' ? p.statusPt : p.status)}</span>
      <span class="pill">${esc(p.year)}</span>
      <span class="pill">${esc(p.state)}</span>
    </div>
    <div class="hero-img"><img src="${p.image}" alt="${esc(title)}" width="1200" height="630" /></div>
    <article class="prose" itemscope itemtype="https://schema.org/CreativeWork">
      <div class="kvs">
        <div class="kv"><b>Client</b>${esc(p.client)}</div>
        <div class="kv"><b>Location</b>${esc(p.location)}</div>
        <div class="kv"><b>Scope</b>${esc(p.scope)}</div>
        <div class="kv"><b>Status</b>${esc(langKey === 'pt' ? p.statusPt : p.status)}</div>
      </div>
      ${p.metrics.map((m) => `<div class="kv" style="display:inline-block;min-width:160px;margin:4px"><b>${esc(m.label)}</b>${esc(m.value)}</div>`).join('')}
      <h2>${langKey === 'pt' ? 'Especificações entregues' : 'Specifications delivered'}</h2>
      <ul>${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <div class="actions">
        <a class="cta" href="${L.prefix}/contact/">${L.request}</a>
        <a class="cta ghost" href="/#projects">${L.more}</a>
      </div>
    </article>`;
}

function officeBody(o, langKey) {
  const L = COPY[langKey];
  return `
    <p class="lede">${esc(o.type)} — ${esc(o.city)}, ${esc(o.state)} ${esc(o.pincode)}</p>
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
      <p><a href="https://www.google.com/maps?q=${o.lat},${o.lng}" rel="noopener noreferrer" target="_blank">${langKey === 'pt' ? 'Abrir no Google Maps' : 'Open in Google Maps'}</a></p>
      <div class="actions">
        <a class="cta" href="${L.prefix}/contact/">${L.request}</a>
        <a class="cta ghost" href="/#presence">${L.more}</a>
      </div>
    </article>
    <section class="related">
      <h2>${L.offices}</h2>
      <div class="grid grid-3">${OFFICES.filter((x) => x.id !== o.id)
        .map((x) => `<article class="card"><h3><a href="${L.prefix}/locations/${x.id}/">${esc(x.city)}</a></h3><p>${esc(langKey === 'pt' ? x.typePt : x.type)}</p></article>`)
        .join('')}</div>
    </section>`;
}

function emitPage(opts) {
  const html = layout(opts);
  const dest = (opts.langKey === 'pt' ? opts.pathPt : opts.pathEn).replace(/^\//, '') + 'index.html';
  write(dest, html);
  track(opts.langKey === 'pt' ? opts.pathPt : opts.pathEn, {
    priority: opts.priority || '0.8',
    image: opts.image,
    lang: opts.langKey === 'pt' ? 'pt-BR' : 'en',
  });
}

function keywordsBase() {
  return 'Rudra Constructions, civil contractor Bihar, government civil contractor, Class-1 contractor India, CPWD contractor, PWD Bihar contractor, Panchayat Sarkar Bhawan builder, hospital ward modernization, solar rooftop EPC, solar street lighting, building material supplier West Champaran, Patna civil construction, Fe 550D TMT supplier, cement Grade 53 supplier, turnkey infrastructure contractor';
}

function run() {
  for (const langKey of ['en', 'pt']) {
    const L = COPY[langKey];
    const pfx = L.prefix;

    // About
    emitPage({
      langKey,
      pathEn: '/about/',
      pathPt: '/pt-br/about/',
      title:
        langKey === 'pt'
          ? 'Sobre a Rudra Constructions & Suppliers | Empreiteira Classe-A'
          : 'About Rudra Constructions & Suppliers | Class-A Civil Contractor',
      description: COMPANY.subSlogan,
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Engenharia de infraestrutura com rigor técnico.' : 'Engineering infrastructure with purpose and technical rigor.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Sobre' : 'About', href: `${pfx}/about/` },
      ],
      image: IMG.hero,
      priority: '0.9',
      type: 'AboutPage',
      body: `
        <p class="lede">${esc(COMPANY.subSlogan)}</p>
        <article class="prose">
          <p>${langKey === 'pt'
            ? 'Fundada em 2025, a Rudra Constructions & Suppliers entrega obras civis de alto padrão, ativos administrativos governamentais e energia limpa em 11 estados indianos. Faturamento auditado: '
            : 'Founded in 2025, Rudra Constructions & Suppliers delivers high-grade civil works, government administrative assets, and clean energy across 11 Indian states. Audited turnover: '}${esc(COMPANY.totalTurnover)}.</p>
          <div class="kvs">
            <div class="kv"><b>CIN</b>${esc(COMPANY.cin)}</div>
            <div class="kv"><b>GSTIN</b>${esc(COMPANY.gstin)}</div>
            <div class="kv"><b>PAN</b>${esc(COMPANY.pan)}</div>
            <div class="kv"><b>MSME</b>${esc(COMPANY.msmeUdyam)}</div>
            <div class="kv"><b>Enlistment</b>${esc(COMPANY.contractorEnlistment)}</div>
            <div class="kv"><b>Solvency</b>${esc(COMPANY.bankSolvency)}</div>
          </div>
          <div class="actions"><a class="cta" href="${pfx}/contact/">${L.request}</a><a class="cta ghost" href="/#overview">${L.more}</a></div>
        </article>`,
    });

    // Services index + each
    emitPage({
      langKey,
      pathEn: '/services/',
      pathPt: '/pt-br/services/',
      title: langKey === 'pt' ? 'Serviços de engenharia civil, solar e materiais | Rudra' : 'Civil, Solar & Materials Services | Rudra Constructions',
      description:
        langKey === 'pt'
          ? 'Seis verticais turnkey: civil estrutural, residencial/comercial, infraestrutura governamental, solar, saúde modular e fornecimento de materiais certificados.'
          : 'Six turnkey verticals: civil & structural, residential & commercial, government infrastructure, solar EPC, healthcare modular, and certified materials supply.',
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Engenharia civil turnkey e energia renovável.' : 'Turnkey civil engineering and renewable power.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Serviços' : 'Services', href: `${pfx}/services/` },
      ],
      image: IMG.hero,
      priority: '0.95',
      type: 'CollectionPage',
      schema: {
        '@type': 'ItemList',
        name: 'Rudra service verticals',
        numberOfItems: SERVICES.length,
        itemListElement: SERVICES.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: abs(`${pfx}/services/${s.id}/`),
          name: langKey === 'pt' ? s.titlePt : s.title,
        })),
      },
      body: `<div class="grid grid-2">${SERVICES.map(
        (s) =>
          `<article class="card"><h2><a href="${pfx}/services/${s.id}/">${esc(langKey === 'pt' ? s.titlePt : s.title)}</a></h2><p>${esc(langKey === 'pt' ? s.shortPt : s.shortDesc)}</p></article>`
      ).join('')}</div>`,
    });

    for (const s of SERVICES) {
      emitPage({
        langKey,
        pathEn: `/services/${s.id}/`,
        pathPt: `/pt-br/services/${s.id}/`,
        title: `${langKey === 'pt' ? s.titlePt : s.title} | ${COMPANY.name}`,
        description: langKey === 'pt' ? s.shortPt : s.shortDesc,
        keywords: `${s.title}, ${keywordsBase()}`,
        h1: langKey === 'pt' ? s.titlePt : s.title,
        crumbs: [
          { name: L.home, href: pfx || '/' },
          { name: langKey === 'pt' ? 'Serviços' : 'Services', href: `${pfx}/services/` },
          { name: langKey === 'pt' ? s.titlePt : s.title, href: `${pfx}/services/${s.id}/` },
        ],
        image: s.image,
        priority: '0.9',
        type: 'Service',
        schema: {
          '@type': 'Service',
          name: langKey === 'pt' ? s.titlePt : s.title,
          description: langKey === 'pt' ? s.fullPt : s.fullDesc,
          provider: { '@id': `${abs('/') }#organization` },
          areaServed: { '@type': 'Country', name: 'India' },
        },
        body: serviceBody(s, langKey),
      });
    }

    // Projects
    emitPage({
      langKey,
      pathEn: '/projects/',
      pathPt: '/pt-br/projects/',
      title: langKey === 'pt' ? 'Portfólio de obras | Rudra Constructions' : 'Project Portfolio | Rudra Constructions & Suppliers',
      description:
        langKey === 'pt'
          ? 'Complexos administrativos, enfermarias hospitalares, redes solares rurais e logística de materiais entregues segundo normas estatutárias.'
          : 'Administrative complexes, hospital wards, rural solar grids, and bulk logistics delivered to exact statutory standards.',
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Projetos executados com precisão em toda a Índia.' : 'Engineered with precision across India.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Portfólio' : 'Portfolio', href: `${pfx}/projects/` },
      ],
      image: IMG.civic,
      priority: '0.95',
      type: 'CollectionPage',
      body: `<div class="grid grid-2">${PROJECTS.map(
        (p) =>
          `<article class="card"><h2><a href="${pfx}/projects/${p.id}/">${esc(langKey === 'pt' ? p.titlePt : p.title)}</a></h2><p>${esc(p.client)} · ${esc(p.state)} · ${esc(p.year)}</p><p>${esc(langKey === 'pt' ? p.descriptionPt : p.description)}</p></article>`
      ).join('')}</div>`,
    });

    for (const p of PROJECTS) {
      emitPage({
        langKey,
        pathEn: `/projects/${p.id}/`,
        pathPt: `/pt-br/projects/${p.id}/`,
        title: `${langKey === 'pt' ? p.titlePt : p.title} | ${COMPANY.name}`,
        description: langKey === 'pt' ? p.descriptionPt : p.description,
        keywords: `${p.title}, ${p.client}, ${p.state}, ${keywordsBase()}`,
        h1: langKey === 'pt' ? p.titlePt : p.title,
        crumbs: [
          { name: L.home, href: pfx || '/' },
          { name: langKey === 'pt' ? 'Portfólio' : 'Portfolio', href: `${pfx}/projects/` },
          { name: langKey === 'pt' ? p.titlePt : p.title, href: `${pfx}/projects/${p.id}/` },
        ],
        image: p.image,
        priority: '0.85',
        schema: {
          '@type': 'CreativeWork',
          name: p.title,
          description: p.description,
          dateCreated: '2025',
          creator: { '@id': `${abs('/') }#organization` },
          locationCreated: { '@type': 'Place', name: `${p.location}, ${p.state}` },
        },
        body: projectBody(p, langKey),
      });
    }

    // Locations
    emitPage({
      langKey,
      pathEn: '/locations/',
      pathPt: '/pt-br/locations/',
      title: langKey === 'pt' ? 'Escritórios | Rudra Constructions' : 'Offices & Operating Hubs | Rudra Constructions',
      description: 'Registered Headquarters Ramnagar, West Champaran; Regional Corporate Hub Ghaziabad; Patna; Bettiah; Biswanath; Jorhat.',
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Sede e polos operacionais.' : 'Registered headquarters and operating hubs.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Escritórios' : 'Locations', href: `${pfx}/locations/` },
      ],
      image: IMG.hero,
      priority: '0.9',
      body: `<div class="grid grid-2">${OFFICES.map(
        (o) =>
          `<article class="card"><h2><a href="${pfx}/locations/${o.id}/">${esc(o.city)}</a></h2><p>${esc(langKey === 'pt' ? o.typePt : o.type)}</p><p>${esc(o.address)}, ${esc(o.pincode)}</p></article>`
      ).join('')}</div>`,
    });

    for (const o of OFFICES) {
      emitPage({
        langKey,
        pathEn: `/locations/${o.id}/`,
        pathPt: `/pt-br/locations/${o.id}/`,
        title: `${o.city} ${langKey === 'pt' ? o.typePt : o.type} | ${COMPANY.name}`,
        description: `${o.type}, ${o.address}, ${o.city}, ${o.state} ${o.pincode}. ${COMPANY.phoneFormatted}`,
        keywords: `${o.city}, ${o.state}, Rudra Constructions office, ${keywordsBase()}`,
        h1: `${o.city} — ${langKey === 'pt' ? o.typePt : o.type}`,
        crumbs: [
          { name: L.home, href: pfx || '/' },
          { name: langKey === 'pt' ? 'Escritórios' : 'Locations', href: `${pfx}/locations/` },
          { name: o.city, href: `${pfx}/locations/${o.id}/` },
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
        body: officeBody(o, langKey),
      });
    }

    // Presence / states
    emitPage({
      langKey,
      pathEn: '/presence/',
      pathPt: '/pt-br/presence/',
      title: langKey === 'pt' ? 'Presença em 11 estados | Rudra Constructions' : 'Pan-India Presence — 11 States | Rudra Constructions',
      description: 'Bihar, Uttar Pradesh, Jharkhand, Odisha, Assam, Meghalaya, Tripura, Arunachal Pradesh, Haryana, Punjab, Jammu & Kashmir.',
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Presença operacional em 11 estados.' : 'Operational presence across 11 Indian states.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Presença' : 'Presence', href: `${pfx}/presence/` },
      ],
      image: IMG.hero,
      priority: '0.9',
      body: `<div class="grid grid-3">${STATES.map(
        (s) =>
          `<article class="card"><h2><a href="${pfx}/presence/${s.id}/">${esc(s.name)}</a></h2><p>${esc(s.region)} · ${s.count} ${langKey === 'pt' ? 'projetos ativos' : 'active projects'}</p><p>${esc(s.focus.join(', '))}</p></article>`
      ).join('')}</div>`,
    });

    for (const s of STATES) {
      const relatedSites = WORKSITES.filter((w) => w.state.toLowerCase().includes(s.name.split(' ')[0].toLowerCase()) || w.state === s.name);
      emitPage({
        langKey,
        pathEn: `/presence/${s.id}/`,
        pathPt: `/pt-br/presence/${s.id}/`,
        title: `${s.name} ${langKey === 'pt' ? 'obras e presença' : 'civil, solar & infrastructure'} | ${COMPANY.name}`,
        description: `${COMPANY.name} in ${s.name} (${s.code}). Focus: ${s.focus.join(', ')}. Key clients: ${s.clients.join(', ')}. Active projects: ${s.count}.`,
        keywords: `${s.name} contractor, ${s.name} civil construction, ${keywordsBase()}`,
        h1: `${s.name} — ${s.count} ${langKey === 'pt' ? 'projetos ativos' : 'active projects'}`,
        crumbs: [
          { name: L.home, href: pfx || '/' },
          { name: langKey === 'pt' ? 'Presença' : 'Presence', href: `${pfx}/presence/` },
          { name: s.name, href: `${pfx}/presence/${s.id}/` },
        ],
        image: IMG.hero,
        priority: '0.8',
        body: `
          <p class="lede">${esc(s.region)} India · ${esc(s.clients.join(', '))}</p>
          <article class="prose">
            <h2>${langKey === 'pt' ? 'Áreas de foco' : 'Focus areas'}</h2>
            <ul>${s.focus.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
            <h2>${langKey === 'pt' ? 'Clientes-chave' : 'Key clients'}</h2>
            <ul>${s.clients.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
            ${
              relatedSites.length
                ? `<h2>${langKey === 'pt' ? 'Canteiros neste estado' : 'Worksites in this state'}</h2><ul>${relatedSites
                    .map((w) => `<li><a href="${pfx}/worksites/${w.id}/">${esc(w.title)}</a> — ${esc(w.city)}</li>`)
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
      pathPt: '/pt-br/worksites/',
      title: langKey === 'pt' ? 'Canteiros e obras | Rudra Constructions' : 'Worksites Map Index | Rudra Constructions',
      description: '18 indexed worksites across Bihar, Uttar Pradesh, Assam, Jharkhand, Odisha, Jammu & Kashmir, Chhattisgarh, Arunachal Pradesh and Madhya Pradesh.',
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Índice de canteiros georreferenciados.' : 'Geocoded worksite index.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Canteiros' : 'Worksites', href: `${pfx}/worksites/` },
      ],
      image: IMG.hero,
      priority: '0.85',
      body: `<div class="grid grid-2">${WORKSITES.map(
        (w) =>
          `<article class="card"><h2><a href="${pfx}/worksites/${w.id}/">${esc(w.title)}</a></h2><p>${esc(w.city)}, ${esc(w.state)} · ${esc(w.status)} · ${esc(w.value)}</p></article>`
      ).join('')}</div>`,
    });

    for (const w of WORKSITES) {
      emitPage({
        langKey,
        pathEn: `/worksites/${w.id}/`,
        pathPt: `/pt-br/worksites/${w.id}/`,
        title: `${w.title} | ${w.city} | ${COMPANY.name}`,
        description: `${w.scope} Client: ${w.client}. ${w.status} ${w.year}. ${w.value}.`,
        keywords: `${w.city}, ${w.state}, ${w.title}, ${keywordsBase()}`,
        h1: w.title,
        crumbs: [
          { name: L.home, href: pfx || '/' },
          { name: langKey === 'pt' ? 'Canteiros' : 'Worksites', href: `${pfx}/worksites/` },
          { name: w.city, href: `${pfx}/worksites/${w.id}/` },
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
          <div class="hero-img"><img src="${w.image}" alt="${esc(w.title)}" width="1200" height="630" /></div>
          <article class="prose">
            <div class="kvs">
              <div class="kv"><b>City</b>${esc(w.city)}</div>
              <div class="kv"><b>State</b>${esc(w.state)}</div>
              <div class="kv"><b>Client</b>${esc(w.client)}</div>
              <div class="kv"><b>Status</b>${esc(w.status)}</div>
              <div class="kv"><b>Year</b>${esc(w.year)}</div>
              <div class="kv"><b>Value</b>${esc(w.value)}</div>
              <div class="kv"><b>Metric</b>${esc(w.metric)}</div>
              <div class="kv"><b>Geo</b>${w.lat}, ${w.lng}</div>
            </div>
            <p><a href="https://www.google.com/maps?q=${w.lat},${w.lng}" rel="noopener noreferrer" target="_blank">Google Maps</a></p>
          </article>`,
      });
    }

    // Clients
    emitPage({
      langKey,
      pathEn: '/clients/',
      pathPt: '/pt-br/clients/',
      title: langKey === 'pt' ? 'Clientes e parceiros governamentais | Rudra' : 'Clients & Government Partners | Rudra Constructions',
      description: CLIENTS.map((c) => c.name).join(', '),
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Clientes e parceiros governamentais.' : 'Clients & government partners.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Clientes' : 'Clients', href: `${pfx}/clients/` },
      ],
      image: IMG.civic,
      priority: '0.85',
      body: `<div class="grid grid-2">${CLIENTS.map(
        (c) => `<article class="card"><h2>${esc(c.name)}</h2><p>${esc(c.category)} · ${esc(c.region)}</p><p>${esc(c.description)}</p></article>`
      ).join('')}</div>`,
    });

    // FAQ
    emitPage({
      langKey,
      pathEn: '/faq/',
      pathPt: '/pt-br/faq/',
      title: langKey === 'pt' ? 'Perguntas frequentes | Rudra Constructions' : 'Frequently Asked Questions | Rudra Constructions',
      description: FAQS.map((f) => (langKey === 'pt' ? f.qPt : f.q)).join(' '),
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Perguntas frequentes.' : 'Frequently asked questions.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: 'FAQ', href: `${pfx}/faq/` },
      ],
      image: IMG.hero,
      priority: '0.85',
      type: 'FAQPage',
      schema: {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: langKey === 'pt' ? f.qPt : f.q,
          acceptedAnswer: { '@type': 'Answer', text: langKey === 'pt' ? f.aPt : f.a },
        })),
      },
      body: `<article class="prose" itemscope itemtype="https://schema.org/FAQPage">${FAQS.map(
        (f) =>
          `<section itemscope itemprop="mainEntity" itemtype="https://schema.org/Question"><h2 itemprop="name">${esc(langKey === 'pt' ? f.qPt : f.q)}</h2><div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer"><p itemprop="text">${esc(langKey === 'pt' ? f.aPt : f.a)}</p></div></section>`
      ).join('')}</article>`,
    });

    // Methodology
    emitPage({
      langKey,
      pathEn: '/methodology/',
      pathPt: '/pt-br/methodology/',
      title: langKey === 'pt' ? 'Metodologia de 5 estágios | Rudra' : '5-Stage Execution Methodology | Rudra Constructions',
      description: STEPS.map((s) => s.title).join(', '),
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Ciclo de execução em 5 estágios.' : '5-stage project execution lifecycle.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Metodologia' : 'Methodology', href: `${pfx}/methodology/` },
      ],
      image: IMG.hero,
      priority: '0.85',
      type: 'HowTo',
      schema: {
        '@type': 'HowTo',
        name: 'Rudra 5-stage project execution lifecycle',
        step: STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.desc })),
      },
      body: `<div class="grid">${STEPS.map(
        (s) =>
          `<article class="card"><h2><a href="${pfx}/methodology/${s.n}/">${esc(s.n)}. ${esc(langKey === 'pt' ? s.titlePt : s.title)}</a></h2><p>${esc(s.tag)}</p><p>${esc(s.desc)}</p></article>`
      ).join('')}</div>`,
    });

    for (const s of STEPS) {
      emitPage({
        langKey,
        pathEn: `/methodology/${s.n}/`,
        pathPt: `/pt-br/methodology/${s.n}/`,
        title: `Stage ${s.n}: ${langKey === 'pt' ? s.titlePt : s.title} | ${COMPANY.name}`,
        description: s.desc,
        keywords: keywordsBase(),
        h1: `${s.n}. ${langKey === 'pt' ? s.titlePt : s.title}`,
        crumbs: [
          { name: L.home, href: pfx || '/' },
          { name: langKey === 'pt' ? 'Metodologia' : 'Methodology', href: `${pfx}/methodology/` },
          { name: s.n, href: `${pfx}/methodology/${s.n}/` },
        ],
        image: IMG.hero,
        priority: '0.7',
        body: `<article class="prose"><p class="lede">${esc(s.tag)}</p><p>${esc(s.desc)}</p><h2>${langKey === 'pt' ? 'Entregáveis' : 'Deliverables'}</h2><ul>${s.deliverables.map((d) => `<li>${esc(d)}</li>`).join('')}</ul><p><b>${langKey === 'pt' ? 'Duração' : 'Duration'}:</b> ${esc(s.duration)}</p><p><b>Tools:</b> ${esc(s.tools.join(', '))}</p></article>`,
      });
    }

    // Quality / credentials / contact / estimator / directory / press
    emitPage({
      langKey,
      pathEn: '/quality/',
      pathPt: '/pt-br/quality/',
      title: langKey === 'pt' ? 'Qualidade, segurança e conformidade | Rudra' : 'Quality, Safety & Compliance | Rudra Constructions',
      description: 'IS 456, IS 1893, IS 1786, NBC 2016, NABL cube testing, ISO 9001:2015, ISO 14001:2015, ISO 45001:2018.',
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Qualidade, segurança e conformidade.' : 'Quality, safety & compliance.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Qualidade' : 'Quality', href: `${pfx}/quality/` },
      ],
      image: IMG.hero,
      priority: '0.85',
      body: `<article class="prose"><p>${langKey === 'pt'
        ? 'Cada projeto cívico, hospitalar e solar adere estritamente a mandatos estatutários e códigos indianos.'
        : 'Every civic, healthcare, and solar infrastructure project adheres strictly to statutory mandates and Indian standard codes.'}</p>
        <h2>ISO / NABL / PWD</h2>
        <ul>${CLEARANCES.map((c) => `<li><b>${esc(c.title)}</b> — ${esc(c.authority)} · ${esc(c.certNo)}. ${esc(c.details)}</li>`).join('')}</ul>
        <p><a href="${pfx}/credentials/">${langKey === 'pt' ? 'Ver credenciais' : 'View credentials index'}</a></p></article>`,
    });

    emitPage({
      langKey,
      pathEn: '/credentials/',
      pathPt: '/pt-br/credentials/',
      title: langKey === 'pt' ? 'Credenciais estatutárias | Rudra' : 'Statutory Credentials | Rudra Constructions',
      description: CLEARANCES.map((c) => `${c.title} ${c.certNo}`).join(' · '),
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Credenciais e liberações estatutárias.' : 'Statutory credentials and clearances.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Credenciais' : 'Credentials', href: `${pfx}/credentials/` },
      ],
      image: IMG.hero,
      priority: '0.8',
      body: `<div class="grid grid-2">${CLEARANCES.map(
        (c) => `<article class="card"><h2>${esc(c.title)}</h2><p>${esc(c.authority)}</p><p><b>${esc(c.certNo)}</b></p><p>${esc(c.details)}</p></article>`
      ).join('')}</div>`,
    });

    emitPage({
      langKey,
      pathEn: '/contact/',
      pathPt: '/pt-br/contact/',
      title: langKey === 'pt' ? 'Contato e RFP | Rudra Constructions' : 'Contact, Tenders & RFP | Rudra Constructions',
      description: `Tender hotline ${COMPANY.phoneFormatted}. ${COMPANY.email}. ${COMPANY.address}, ${COMPANY.district}, ${COMPANY.state} ${COMPANY.pincode}.`,
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Inicie um projeto ou RFP de licitação.' : 'Initiate a project or tender RFP.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Contato' : 'Contact', href: `${pfx}/contact/` },
      ],
      image: IMG.hero,
      priority: '0.95',
      type: 'ContactPage',
      body: `<article class="prose">
        <p class="lede">${esc(COMPANY.workingHours)}</p>
        <p><a href="tel:+918099588978">${esc(COMPANY.phoneFormatted)}</a><br/>
        <a href="mailto:${COMPANY.email}">${esc(COMPANY.email)}</a><br/>
        <a href="https://wa.me/918099588978">WhatsApp</a></p>
        <address>${esc(COMPANY.address)}, ${esc(COMPANY.district)}, ${esc(COMPANY.state)} ${esc(COMPANY.pincode)}, ${esc(COMPANY.country)}</address>
        <div class="actions"><a class="cta" href="/#contact">${L.more}</a><a class="cta ghost" href="${pfx}/estimator/">${L.estimate}</a></div>
      </article>`,
    });

    emitPage({
      langKey,
      pathEn: '/estimator/',
      pathPt: '/pt-br/estimator/',
      title: langKey === 'pt' ? 'Estimador de custos CPWD DSR | Rudra' : 'CPWD DSR Project Cost Estimator | Rudra Constructions',
      description: 'Interactive project cost estimator and BOQ engine for civic, healthcare, solar, infrastructure and materials packages.',
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Estimador de custos de projeto.' : 'Interactive project cost estimator.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Estimador' : 'Estimator', href: `${pfx}/estimator/` },
      ],
      image: IMG.hero,
      priority: '0.85',
      body: `<article class="prose"><p>${langKey === 'pt'
        ? 'Abra o estimador interativo no site principal para parâmetros de projeto, revisão preliminar de BOQ e resposta em 24–48 horas úteis.'
        : 'Open the interactive estimator on the main site to submit project parameters. Tender estimation typically responds within 24–48 business hours with a preliminary BOQ review.'}</p>
        <div class="actions"><a class="cta" href="/#estimator">${L.estimate}</a><a class="cta ghost" href="${pfx}/contact/">${L.request}</a></div></article>`,
    });

    emitPage({
      langKey,
      pathEn: '/directory/',
      pathPt: '/pt-br/directory/',
      title: langKey === 'pt' ? 'Kit de citação e backlinks | Rudra' : 'Citation & Backlink Kit | Rudra Constructions',
      description: 'Official NAP, identifiers and embeddable citation block for directories, partners and journalists. Same company data only.',
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Kit oficial de citação e backlink.' : 'Official citation and backlink kit.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Diretório' : 'Directory', href: `${pfx}/directory/` },
      ],
      image: IMG.hero,
      priority: '0.7',
      body: `<article class="prose">
        <p>${langKey === 'pt'
          ? 'Use este bloco NAP canônico em diretórios, páginas de parceiros e matérias. Não altere identificadores.'
          : 'Use this canonical NAP block on directories, partner pages and press. Do not alter statutory identifiers.'}</p>
        <pre style="white-space:pre-wrap;background:#fafafa;border:1px solid #e7e5e4;border-radius:12px;padding:16px;font-size:13px">${esc(`${COMPANY.legalName}
${COMPANY.address}
${COMPANY.district}, ${COMPANY.state} ${COMPANY.pincode}, ${COMPANY.country}
${COMPANY.phoneFormatted}
${COMPANY.email}
GSTIN ${COMPANY.gstin} · CIN ${COMPANY.cin} · PAN ${COMPANY.pan} · MSME ${COMPANY.msmeUdyam}`)}</pre>
        <h2>${langKey === 'pt' ? 'Âncoras sugeridas' : 'Suggested anchor text'}</h2>
        <ul>
          <li>Rudra Constructions &amp; Suppliers</li>
          <li>Class-A civil contractor Bihar</li>
          <li>Panchayat Sarkar Bhawan builder West Champaran</li>
          <li>Fe 550D TMT supplier Patna</li>
          <li>Rooftop solar EPC Bihar</li>
        </ul>
        <h2>${langKey === 'pt' ? 'Referências oficiais de saída' : 'Authoritative outbound references'}</h2>
        <ul>
          <li><a href="https://cpwd.gov.in/" rel="noopener noreferrer">CPWD</a></li>
          <li><a href="https://bis.gov.in/" rel="noopener noreferrer">Bureau of Indian Standards</a></li>
          <li><a href="https://mnre.gov.in/" rel="noopener noreferrer">MNRE</a></li>
          <li><a href="https://state.bihar.gov.in/" rel="noopener noreferrer">Government of Bihar</a></li>
          <li><a href="https://www.iso.org/" rel="noopener noreferrer">ISO</a></li>
        </ul>
        <h2>Embed</h2>
        <pre style="white-space:pre-wrap;background:#fafafa;border:1px solid #e7e5e4;border-radius:12px;padding:16px;font-size:13px">${esc(
          `<a href="${abs('/') }" rel="noopener">Rudra Constructions & Suppliers — Class-A civil, solar & infrastructure contractor</a>`
        )}</pre>
      </article>`,
    });

    emitPage({
      langKey,
      pathEn: '/press/',
      pathPt: '/pt-br/press/',
      title: langKey === 'pt' ? 'Imprensa e marcos 2025 | Rudra' : 'Press & 2025 Delivery Milestones | Rudra Constructions',
      description: 'Indexed 2025 project completions and commissioning notes drawn from the official portfolio — no invented claims.',
      keywords: keywordsBase(),
      h1: langKey === 'pt' ? 'Marcos de entrega 2025.' : '2025 delivery milestones.',
      crumbs: [
        { name: L.home, href: pfx || '/' },
        { name: langKey === 'pt' ? 'Imprensa' : 'Press', href: `${pfx}/press/` },
      ],
      image: IMG.civic,
      priority: '0.7',
      type: 'CollectionPage',
      body: `<div class="grid">${PROJECTS.map(
        (p) =>
          `<article class="card"><h2><a href="${pfx}/projects/${p.id}/">${esc(langKey === 'pt' ? p.titlePt : p.title)}</a></h2><p>${esc(p.year)} · ${esc(langKey === 'pt' ? p.statusPt : p.status)} · ${esc(p.client)}</p></article>`
      ).join('')}</div>`,
    });
  }

  // Portuguese homepage (static) — English homepage is the Vite SPA at /
  const ptHome = layout({
    langKey: 'pt',
    pathEn: '/',
    pathPt: '/pt-br/',
    title: 'Rudra Constructions & Suppliers | Empreiteira Classe-A de obras civis, solar e infraestrutura',
    description: COMPANY.subSlogan,
    keywords: keywordsBase(),
    h1: 'Construindo a infraestrutura da Índia com precisão absoluta.',
    crumbs: [{ name: 'Início', href: '/pt-br/' }],
    image: IMG.hero,
    priority: '1.0',
    type: 'WebPage',
    body: `
      <p class="lede">${esc(COMPANY.subSlogan)} Faturamento auditado de <strong>${esc(COMPANY.totalTurnover)}</strong>.</p>
      <div class="hero-img"><img src="${IMG.hero}" alt="Rudra Constructions — engenharia civil e infraestrutura" width="1200" height="630" /></div>
      <div class="grid grid-3">${SERVICES.map((s) => `<article class="card"><h2><a href="/pt-br/services/${s.id}/">${esc(s.titlePt)}</a></h2><p>${esc(s.shortPt)}</p></article>`).join('')}</div>
      <section class="related"><h2>Portfólio</h2><div class="grid grid-2">${PROJECTS.map((p) => `<article class="card"><h3><a href="/pt-br/projects/${p.id}/">${esc(p.titlePt)}</a></h3><p>${esc(p.descriptionPt)}</p></article>`).join('')}</div></section>
      <div class="actions"><a class="cta" href="/pt-br/contact/">Solicitar proposta</a><a class="cta ghost" href="/">English interactive site</a></div>`,
  });
  write('pt-br/index.html', ptHome);
  track('/pt-br/', { priority: '1.0', image: IMG.hero, lang: 'pt-BR' });

  // HTML sitemap
  const htmlMap = layout({
    langKey: 'en',
    pathEn: '/sitemap.html',
    pathPt: '/pt-br/about/',
    title: 'HTML Sitemap | Rudra Constructions & Suppliers',
    description: 'Complete crawlable HTML sitemap of all English and Portuguese index pages.',
    keywords: keywordsBase(),
    h1: 'HTML sitemap — every indexable URL.',
    crumbs: [
      { name: 'Home', href: '/' },
      { name: 'Sitemap', href: '/sitemap.html' },
    ],
    image: IMG.hero,
    priority: '0.6',
    body: `<article class="prose"><ul>${urls
      .map((u) => `<li><a href="${esc(u.loc)}">${esc(u.loc)}</a> <small>(${esc(u.lang)})</small></li>`)
      .join('')}</ul></article>`,
  });
  write('sitemap.html', htmlMap);
  track('/sitemap.html', { priority: '0.4', changefreq: 'weekly' });

  // robots
  write(
    'robots.txt',
    `# Rudra Constructions & Suppliers — full indexing
# Deploy region: southamerica-northeast1 (São Paulo, Brazil)
# Timezone: America/Sao_Paulo
# Languages: en, pt-BR

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
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
Sitemap: ${abs('/sitemap-pt-br.xml')}
Sitemap: ${abs('/rss.xml')}
`
  );

  const urlset = (list) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${list
  .map((u) => {
    const en = u.loc.startsWith('/pt-br') ? u.loc.replace('/pt-br', '') || '/' : u.loc;
    const pt = u.loc.startsWith('/pt-br') ? u.loc : u.loc === '/' ? '/pt-br/' : `/pt-br${u.loc}`;
    return `  <url>
    <loc>${esc(abs(u.loc))}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${esc(abs(en === '' ? '/' : en))}" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${esc(abs(pt))}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(abs(en === '' ? '/' : en))}" />
    ${u.image ? `<image:image><image:loc>${esc(abs(u.image))}</image:loc><image:title>${esc(COMPANY.name)}</image:title></image:image>` : ''}
  </url>`;
  })
  .join('\n')}
</urlset>
`;

  const enUrls = urls.filter((u) => u.lang !== 'pt-BR');
  const ptUrls = urls.filter((u) => u.lang === 'pt-BR');
  const imgUrls = urls.filter((u) => u.image);

  write('sitemap-pages.xml', urlset(enUrls));
  write('sitemap-pt-br.xml', urlset(ptUrls));
  write('sitemap-images.xml', urlset(imgUrls));
  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${esc(abs('/sitemap-pages.xml'))}</loc><lastmod>${LASTMOD}</lastmod></sitemap>
  <sitemap><loc>${esc(abs('/sitemap-pt-br.xml'))}</loc><lastmod>${LASTMOD}</lastmod></sitemap>
  <sitemap><loc>${esc(abs('/sitemap-images.xml'))}</loc><lastmod>${LASTMOD}</lastmod></sitemap>
</sitemapindex>
`
  );

  const rssItems = PROJECTS.map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(abs(`/projects/${p.id}/`))}</link>
      <guid>${esc(abs(`/projects/${p.id}/`))}</guid>
      <pubDate>Thu, 01 May 2025 08:30:00 +0530</pubDate>
      <description>${esc(p.description)}</description>
    </item>`
  ).join('\n');

  write(
    'rss.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(COMPANY.name)}</title>
    <link>${esc(abs('/'))}</link>
    <description>${esc(COMPANY.subSlogan)}</description>
    <language>en</language>
    <lastBuildDate>Fri, 04 Sep 2026 08:00:00 -0300</lastBuildDate>
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
  <title>${esc(COMPANY.name)}</title>
  <link href="${esc(abs('/'))}" />
  <link rel="self" href="${esc(abs('/atom.xml'))}" />
  <updated>2026-09-04T08:00:00-03:00</updated>
  <id>${esc(abs('/'))}</id>
  <author><name>${esc(COMPANY.legalName)}</name><email>${esc(COMPANY.email)}</email></author>
  ${PROJECTS.map(
    (p) => `<entry><title>${esc(p.title)}</title><link href="${esc(abs(`/projects/${p.id}/`))}" /><id>${esc(abs(`/projects/${p.id}/`))}</id><updated>2025-05-01T08:30:00+05:30</updated><summary>${esc(p.description)}</summary></entry>`
  ).join('\n  ')}
</feed>
`
  );

  write(
    'feed.json',
    JSON.stringify(
      {
        version: 'https://jsonfeed.org/version/1.1',
        title: COMPANY.name,
        home_page_url: abs('/'),
        feed_url: abs('/feed.json'),
        description: COMPANY.subSlogan,
        language: 'en',
        items: PROJECTS.map((p) => ({
          id: abs(`/projects/${p.id}/`),
          url: abs(`/projects/${p.id}/`),
          title: p.title,
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
    `# ${COMPANY.name}

> ${COMPANY.tagline}

${COMPANY.subSlogan}

- Legal name: ${COMPANY.legalName}
- Founded: ${COMPANY.foundedYear}
- Turnover: ${COMPANY.totalTurnover}
- CIN: ${COMPANY.cin}
- GSTIN: ${COMPANY.gstin}
- PAN: ${COMPANY.pan}
- MSME: ${COMPANY.msmeUdyam}
- Enlistment: ${COMPANY.contractorEnlistment}
- Phone: ${COMPANY.phone}
- Email: ${COMPANY.email}
- HQ: ${COMPANY.address}, ${COMPANY.district}, ${COMPANY.state} ${COMPANY.pincode}, ${COMPANY.country}

## Index
- [Home](/)
- [Português (Brasil)](/pt-br/)
- [About](/about/)
- [Services](/services/)
- [Projects](/projects/)
- [Locations](/locations/)
- [Presence](/presence/)
- [Worksites](/worksites/)
- [Clients](/clients/)
- [FAQ](/faq/)
- [Methodology](/methodology/)
- [Quality](/quality/)
- [Credentials](/credentials/)
- [Contact](/contact/)
- [Citation kit](/directory/)
- [Sitemap](/sitemap.html)
`
  );

  write(
    'llms-full.txt',
    `# ${COMPANY.name} — full facts for AI crawlers

${COMPANY.subSlogan}

## Identity
${JSON.stringify(COMPANY, null, 2)}

## Services
${SERVICES.map((s) => `### ${s.title}\n${s.fullDesc}\n- ${s.capabilities.join('\n- ')}`).join('\n\n')}

## Projects
${PROJECTS.map((p) => `### ${p.title}\n${p.description}\nClient: ${p.client}\n${p.highlights.join('\n')}`).join('\n\n')}

## Offices
${OFFICES.map((o) => `- ${o.type}: ${o.address}, ${o.city}, ${o.state} ${o.pincode}`).join('\n')}

## FAQ
${FAQS.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}
`
  );

  write(
    'humans.txt',
    `/* TEAM */
Publisher: ${COMPANY.legalName}
Contact: ${COMPANY.email}
Location: ${COMPANY.address}, ${COMPANY.district}, ${COMPANY.state} ${COMPANY.pincode}, ${COMPANY.country}

/* SITE */
Last update: ${LASTMOD}
Languages: en, pt-BR
Standards: HTML5, Schema.org, Open Graph, IndexNow, llms.txt, RSS, Atom, JSON Feed
Deploy: Brazil São Paulo (southamerica-northeast1), timezone America/Sao_Paulo
`
  );

  const urlCount = urls.length;
  write(
    'seo-index.json',
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        timezone: 'America/Sao_Paulo',
        region: 'southamerica-northeast1',
        languages: ['en', 'pt-BR'],
        urlCount,
        indexnowKey: INDEXNOW_KEY,
        urls: urls.map((u) => u.loc),
      },
      null,
      2
    )
  );

  console.log(`SEO generator wrote ${urlCount} indexable URLs into public/`);
}

run();
