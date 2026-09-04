export interface CmsPhoto {
  id: string;
  url: string;
  filename?: string;
  title: string;
  alt: string;
  caption: string;
  section: string;
  visible: boolean;
  showInGallery: boolean;
  builtin?: boolean;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface CmsBlog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverPhotoId: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CmsProject {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  client: string;
  location: string;
  state: string;
  year: string;
  status: string;
  scope: string;
  description: string;
  highlights: string[];
  image: string;
  metrics: { label: string; value: string }[];
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface CompanySettings {
  name: string;
  legalName: string;
  turnover: string;
  turnoverShort: string;
  turnoverDetail: string;
  turnoverTag: string;
  stats: { label: string; value: string; detail: string; tag: string }[];
}

export interface EstimatorRate {
  standard: number;
  premium: number;
  high_spec: number;
  unit: string;
  material: string;
}

export interface EstimatorSettings {
  civic: EstimatorRate;
  healthcare: EstimatorRate;
  commercial: EstimatorRate;
  solar: EstimatorRate;
  materials: EstimatorRate;
}

export interface CmsPayload {
  photos: CmsPhoto[];
  blogs: CmsBlog[];
  slots: Record<string, string>;
  projects: CmsProject[];
  company: CompanySettings;
  estimator: EstimatorSettings;
}
