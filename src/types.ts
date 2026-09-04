export interface ServiceVertical {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  capabilities: string[];
  keyProjects: string;
  complianceStandards: string[];
  badge?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'civic' | 'solar' | 'commercial' | 'healthcare' | 'materials' | 'infrastructure';
  categoryLabel: string;
  client: string;
  location: string;
  state: string;
  year: string;
  status: 'Completed' | 'In Progress' | 'Commissioned';
  scope: string;
  description: string;
  highlights: string[];
  image: string;
  metrics: { label: string; value: string }[];
  coordinates?: [number, number];
}

export interface OfficeLocation {
  id: string;
  type: 'Registered Headquarters' | 'Regional Corporate Hub' | 'State Branch Office' | 'Project Operations Office';
  city: string;
  state: string;
  address: string;
  pincode: string;
  phone?: string;
  email?: string;
  isPrimary?: boolean;
  coordinates?: [number, number];
}

export interface WorkSiteLocation {
  id: string;
  title: string;
  category: 'civic' | 'solar' | 'commercial' | 'healthcare' | 'materials' | 'office' | 'infrastructure';
  categoryLabel: string;
  city: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
  client: string;
  status: 'Completed' | 'Under Execution' | 'Operational Hub';
  completionYear: string;
  scopeSummary: string;
  projectValue?: string;
  image: string;
  keyMetric?: string;
}

export interface StatePresence {
  id: string;
  name: string;
  code: string;
  region: 'North' | 'East' | 'North-East';
  focusAreas: string[];
  keyClients: string[];
  activeProjectsCount: number;
}

export interface ExecutionStep {
  stepNumber: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  duration: string;
  tools: string[];
}

export interface ClientPartner {
  name: string;
  category: 'Government Department' | 'Public Undertaking' | 'Development Foundation' | 'Corporate';
  description: string;
  logoText: string;
  region: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  organization: string;
  project: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
