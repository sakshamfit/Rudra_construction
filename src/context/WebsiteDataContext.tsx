import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlogPost, WebsitePhoto, ProjectItem } from '../types';
import { INITIAL_BLOGS, INITIAL_PHOTOS } from '../data/initialContent';
import { PROJECTS } from '../data/companyData';
import heroImg from '../assets/images/rudra_hero_construction_1788465374495.jpg';

interface WebsiteDataContextType {
  photos: WebsitePhoto[];
  blogs: BlogPost[];
  projects: ProjectItem[];
  heroPhoto: {
    url: string;
    caption: string;
    altText: string;
  };
  addPhoto: (photo: Omit<WebsitePhoto, 'id' | 'uploadedAt'>) => WebsitePhoto;
  updatePhoto: (id: string, updates: Partial<WebsitePhoto>) => void;
  deletePhoto: (id: string) => void;
  addBlog: (blog: Omit<BlogPost, 'id'>) => BlogPost;
  updateBlog: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;
  updateProjectPhoto: (projectId: string, photoUrl: string) => void;
  updateHeroPhoto: (url: string, caption?: string, altText?: string) => void;
  resetToDefaults: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  
  // Admin view state
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  adminPasscode: string;
  setAdminPasscode: (code: string) => void;
  
  // Active reading blog modal
  activeReadingBlog: BlogPost | null;
  setActiveReadingBlog: (blog: BlogPost | null) => void;
}

const STORAGE_KEY = 'rudra_admin_content_storage_v2';
const PASSCODE_KEY = 'rudra_admin_passcode_v2';
const DEFAULT_PASSCODE = 'rudra2025';

const WebsiteDataContext = createContext<WebsiteDataContextType | undefined>(undefined);

export const WebsiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<WebsitePhoto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.photos && Array.isArray(parsed.photos) && parsed.photos.length > 0) {
          return parsed.photos;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PHOTOS;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.blogs && Array.isArray(parsed.blogs) && parsed.blogs.length > 0) {
          return parsed.blogs;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_BLOGS;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projects && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
          return parsed.projects;
        }
      }
    } catch {
      // Fallback
    }
    return PROJECTS;
  });

  const [heroPhoto, setHeroPhoto] = useState<{ url: string; caption: string; altText: string }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.heroPhoto?.url) {
          return parsed.heroPhoto;
        }
      }
    } catch {
      // Fallback
    }
    return {
      url: heroImg,
      caption: 'Heavy Civil & Structural Reinforced Concrete Construction Site',
      altText: 'Rudra Constructions - Civil Engineering & Infrastructure Precision'
    };
  });

  const [adminPasscode, setAdminPasscodeState] = useState<string>(() => {
    try {
      return localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASSCODE;
    } catch {
      return DEFAULT_PASSCODE;
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeReadingBlog, setActiveReadingBlog] = useState<BlogPost | null>(null);

  // Check URL hash for direct admin link (#admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Synchronize changes to localStorage
  useEffect(() => {
    try {
      const payload = {
        photos,
        blogs,
        projects,
        heroPhoto
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Unable to persist to localStorage (may be in private browsing):', e);
    }
  }, [photos, blogs, projects, heroPhoto]);

  const setAdminPasscode = (code: string) => {
    setAdminPasscodeState(code);
    try {
      localStorage.setItem(PASSCODE_KEY, code);
    } catch {
      // Ignore
    }
  };

  const addPhoto = (photoData: Omit<WebsitePhoto, 'id' | 'uploadedAt'>): WebsitePhoto => {
    const newId = `photo-${Date.now()}`;
    const newPhoto: WebsitePhoto = {
      ...photoData,
      id: newId,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setPhotos(prev => [newPhoto, ...prev]);

    // If associated with hero or project, also update there
    if (newPhoto.section === 'hero') {
      setHeroPhoto({
        url: newPhoto.url,
        caption: newPhoto.caption || 'Heavy Civil & Structural Construction Site',
        altText: newPhoto.altText || 'Rudra Constructions'
      });
    } else if (newPhoto.associatedId?.startsWith('proj-')) {
      setProjects(prev =>
        prev.map(p => (p.id === newPhoto.associatedId ? { ...p, image: newPhoto.url } : p))
      );
    }

    return newPhoto;
  };

  const updatePhoto = (id: string, updates: Partial<WebsitePhoto>) => {
    setPhotos(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newItem = { ...item, ...updates };
          
          // Sync with hero if it's the hero photo
          if (newItem.section === 'hero' || newItem.associatedId === 'hero-main') {
            setHeroPhoto({
              url: newItem.url,
              caption: newItem.caption || '',
              altText: newItem.altText || ''
            });
          }

          // Sync with projects if associated
          if (newItem.associatedId?.startsWith('proj-')) {
            setProjects(pList =>
              pList.map(p => (p.id === newItem.associatedId ? { ...p, image: newItem.url } : p))
            );
          }

          return newItem;
        }
        return item;
      });
      return updated;
    });
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => {
      const target = prev.find(p => p.id === id);
      const filtered = prev.filter(p => p.id !== id);

      // If deleting the active hero photo, reset hero to default or next hero photo
      if (target?.section === 'hero' || target?.associatedId === 'hero-main') {
        const fallback = filtered.find(p => p.section === 'hero');
        setHeroPhoto({
          url: fallback ? fallback.url : heroImg,
          caption: fallback ? fallback.caption || '' : 'Heavy Civil & Structural Construction Site',
          altText: fallback ? fallback.altText || '' : 'Rudra Constructions'
        });
      }

      // If associated with a project, replace project image with fallback
      if (target?.associatedId?.startsWith('proj-')) {
        setProjects(pList =>
          pList.map(p => (p.id === target.associatedId ? { ...p, image: heroImg } : p))
        );
      }

      return filtered;
    });
  };

  const updateProjectPhoto = (projectId: string, photoUrl: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, image: photoUrl } : p))
    );
    // Also update or add photo in photo registry
    setPhotos(prev => {
      const existing = prev.find(ph => ph.associatedId === projectId);
      if (existing) {
        return prev.map(ph => (ph.id === existing.id ? { ...ph, url: photoUrl } : ph));
      } else {
        const newPhoto: WebsitePhoto = {
          id: `photo-${Date.now()}`,
          title: `Project: ${projectId}`,
          section: 'projects',
          sectionLabel: 'Project Case Study',
          url: photoUrl,
          associatedId: projectId,
          uploadedAt: new Date().toISOString().split('T')[0]
        };
        return [newPhoto, ...prev];
      }
    });
  };

  const updateHeroPhoto = (url: string, caption?: string, altText?: string) => {
    const updated = {
      url,
      caption: caption ?? heroPhoto.caption,
      altText: altText ?? heroPhoto.altText
    };
    setHeroPhoto(updated);

    // Sync in photos list
    setPhotos(prev => {
      const existingHero = prev.find(p => p.section === 'hero' || p.associatedId === 'hero-main');
      if (existingHero) {
        return prev.map(p =>
          p.id === existingHero.id
            ? { ...p, url, caption: updated.caption, altText: updated.altText }
            : p
        );
      } else {
        const newHero: WebsitePhoto = {
          id: `photo-hero-${Date.now()}`,
          title: 'Main Hero Showcase',
          section: 'hero',
          sectionLabel: 'Hero Main Header',
          url,
          caption: updated.caption,
          altText: updated.altText,
          associatedId: 'hero-main',
          uploadedAt: new Date().toISOString().split('T')[0]
        };
        return [newHero, ...prev];
      }
    });
  };

  const addBlog = (blogData: Omit<BlogPost, 'id'>): BlogPost => {
    const newId = `blog-${Date.now()}`;
    const newBlog: BlogPost = {
      ...blogData,
      id: newId,
      publishDate: blogData.publishDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setBlogs(prev => [newBlog, ...prev]);

    // Also register the blog's cover photo in the photo library if not already present
    if (newBlog.coverImage && !photos.some(ph => ph.url === newBlog.coverImage)) {
      addPhoto({
        title: `Cover: ${newBlog.title}`,
        section: 'blogs',
        sectionLabel: 'Blog Post Cover',
        url: newBlog.coverImage,
        caption: `Cover visual for article "${newBlog.title}"`,
        altText: newBlog.title,
        associatedId: newId
      });
    }

    return newBlog;
  };

  const updateBlog = (id: string, updates: Partial<BlogPost>) => {
    setBlogs(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(item => item.id !== id));
  };

  const resetToDefaults = () => {
    setPhotos(INITIAL_PHOTOS);
    setBlogs(INITIAL_BLOGS);
    setProjects(PROJECTS);
    setHeroPhoto({
      url: heroImg,
      caption: 'Heavy Civil & Structural Reinforced Concrete Construction Site',
      altText: 'Rudra Constructions - Civil Engineering & Infrastructure Precision'
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const exportData = () => {
    const data = {
      version: 2,
      exportDate: new Date().toISOString(),
      photos,
      blogs,
      projects,
      heroPhoto
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.photos && Array.isArray(parsed.photos)) {
        setPhotos(parsed.photos);
      }
      if (parsed.blogs && Array.isArray(parsed.blogs)) {
        setBlogs(parsed.blogs);
      }
      if (parsed.projects && Array.isArray(parsed.projects)) {
        setProjects(parsed.projects);
      }
      if (parsed.heroPhoto?.url) {
        setHeroPhoto(parsed.heroPhoto);
      }
      return true;
    } catch (err) {
      console.error('Failed to parse imported JSON:', err);
      return false;
    }
  };

  return (
    <WebsiteDataContext.Provider
      value={{
        photos,
        blogs,
        projects,
        heroPhoto,
        addPhoto,
        updatePhoto,
        deletePhoto,
        addBlog,
        updateBlog,
        deleteBlog,
        updateProjectPhoto,
        updateHeroPhoto,
        resetToDefaults,
        exportData,
        importData,
        isAdminOpen,
        setIsAdminOpen,
        isAuthenticated,
        setIsAuthenticated,
        adminPasscode,
        setAdminPasscode,
        activeReadingBlog,
        setActiveReadingBlog
      }}
    >
      {children}
    </WebsiteDataContext.Provider>
  );
};

export const useWebsiteData = () => {
  const context = useContext(WebsiteDataContext);
  if (!context) {
    throw new Error('useWebsiteData must be used within a WebsiteDataProvider');
  }
  return context;
};
