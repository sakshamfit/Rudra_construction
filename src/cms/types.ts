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

export interface CmsPayload {
  photos: CmsPhoto[];
  blogs: CmsBlog[];
  slots: Record<string, string>;
}
