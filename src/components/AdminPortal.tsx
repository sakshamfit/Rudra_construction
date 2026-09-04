import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  FileText,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Save,
  RotateCcw,
  Download,
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Camera,
  Layers,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { WebsitePhoto, BlogPost } from '../types';

export const AdminPortal: React.FC = () => {
  const {
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
    setAdminPasscode
  } = useWebsiteData();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'photos' | 'blogs' | 'projects' | 'settings'>('photos');

  // Auth form state
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Photo filter & search
  const [photoSectionFilter, setPhotoSectionFilter] = useState<string>('all');
  const [photoSearchQuery, setPhotoSearchQuery] = useState('');

  // Photo Add/Edit Modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<WebsitePhoto | null>(null);
  const [photoFormData, setPhotoFormData] = useState({
    title: '',
    section: 'gallery' as 'hero' | 'projects' | 'worksites' | 'blogs' | 'gallery',
    sectionLabel: 'Site Gallery',
    url: '',
    caption: '',
    altText: '',
    associatedId: ''
  });
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  // Blog Add/Edit Modal
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    slug: '',
    category: 'Civil Engineering' as 'Civil Engineering' | 'Solar Energy' | 'Tender & Compliance' | 'Case Study' | 'Materials',
    coverImage: '',
    excerpt: '',
    content: '',
    authorName: 'Er. Rajeshwar Sharma',
    authorRole: 'Chief Structural Engineer',
    publishDate: '',
    readTime: '5 min read',
    tags: 'IS 456, Infrastructure, Quality Assurance',
    status: 'Published' as 'Published' | 'Draft',
    featured: false
  });
  const blogCoverFileInputRef = useRef<HTMLInputElement>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Auth submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPasscode === adminPasscode || enteredPasscode === 'rudra2025') {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('Welcome to Rudra Admin Portal');
    } else {
      setAuthError('Incorrect passcode. Please verify or use default passcode.');
    }
  };

  // Convert uploaded local image file to data URL (Base64)
  const handleFileUpload = (
    file: File,
    onSuccess: (dataUrl: string) => void
  ) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSuccess(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Open photo modal for new or editing
  const openNewPhotoModal = () => {
    setEditingPhoto(null);
    setPhotoFormData({
      title: '',
      section: 'gallery',
      sectionLabel: 'Site Gallery',
      url: '',
      caption: '',
      altText: '',
      associatedId: ''
    });
    setIsPhotoModalOpen(true);
  };

  const openEditPhotoModal = (photo: WebsitePhoto) => {
    setEditingPhoto(photo);
    setPhotoFormData({
      title: photo.title,
      section: photo.section,
      sectionLabel: photo.sectionLabel,
      url: photo.url,
      caption: photo.caption || '',
      altText: photo.altText || '',
      associatedId: photo.associatedId || ''
    });
    setIsPhotoModalOpen(true);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFormData.url) {
      alert('Please provide an image by uploading a file or entering an image URL.');
      return;
    }

    if (editingPhoto) {
      updatePhoto(editingPhoto.id, {
        title: photoFormData.title || 'Untitled Photo',
        section: photoFormData.section,
        sectionLabel: photoFormData.sectionLabel,
        url: photoFormData.url,
        caption: photoFormData.caption,
        altText: photoFormData.altText,
        associatedId: photoFormData.associatedId
      });
      showToast('Photo updated successfully.');
    } else {
      addPhoto({
        title: photoFormData.title || 'New Site Photo',
        section: photoFormData.section,
        sectionLabel: photoFormData.sectionLabel,
        url: photoFormData.url,
        caption: photoFormData.caption,
        altText: photoFormData.altText,
        associatedId: photoFormData.associatedId
      });
      showToast('New photo added to website.');
    }
    setIsPhotoModalOpen(false);
  };

  const handleDeletePhoto = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? It will be removed immediately from the website.`)) {
      deletePhoto(id);
      showToast('Photo deleted from website.');
    }
  };

  // Open blog modal for new or editing
  const openNewBlogModal = () => {
    setEditingBlog(null);
    setBlogFormData({
      title: '',
      slug: '',
      category: 'Civil Engineering',
      coverImage: heroPhoto.url,
      excerpt: '',
      content: '',
      authorName: 'Er. Rajeshwar Sharma',
      authorRole: 'Chief Structural Engineer',
      publishDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '5 min read',
      tags: 'Infrastructure, Civil Works, Bihar',
      status: 'Published',
      featured: false
    });
    setIsBlogModalOpen(true);
  };

  const openEditBlogModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogFormData({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      coverImage: blog.coverImage,
      excerpt: blog.excerpt,
      content: blog.content,
      authorName: blog.authorName,
      authorRole: blog.authorRole,
      publishDate: blog.publishDate,
      readTime: blog.readTime,
      tags: blog.tags.join(', '),
      status: blog.status,
      featured: !!blog.featured
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogFormData.title.trim()) {
      alert('Please enter a blog title.');
      return;
    }
    if (!blogFormData.content.trim()) {
      alert('Please write article content.');
      return;
    }

    const tagsArray = blogFormData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const generatedSlug = blogFormData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (editingBlog) {
      updateBlog(editingBlog.id, {
        title: blogFormData.title,
        slug: blogFormData.slug || generatedSlug,
        category: blogFormData.category,
        coverImage: blogFormData.coverImage || heroPhoto.url,
        excerpt: blogFormData.excerpt || blogFormData.content.substring(0, 140) + '...',
        content: blogFormData.content,
        authorName: blogFormData.authorName,
        authorRole: blogFormData.authorRole,
        publishDate: blogFormData.publishDate,
        readTime: blogFormData.readTime,
        tags: tagsArray,
        status: blogFormData.status,
        featured: blogFormData.featured
      });
      showToast('Blog post updated.');
    } else {
      addBlog({
        title: blogFormData.title,
        slug: blogFormData.slug || generatedSlug,
        category: blogFormData.category,
        coverImage: blogFormData.coverImage || heroPhoto.url,
        excerpt: blogFormData.excerpt || blogFormData.content.substring(0, 140) + '...',
        content: blogFormData.content,
        authorName: blogFormData.authorName,
        authorRole: blogFormData.authorRole,
        publishDate: blogFormData.publishDate,
        readTime: blogFormData.readTime,
        tags: tagsArray,
        status: blogFormData.status,
        featured: blogFormData.featured
      });
      showToast('New blog post published.');
    }
    setIsBlogModalOpen(false);
  };

  const handleDeleteBlog = (id: string, title: string) => {
    if (confirm(`Delete article "${title}"?`)) {
      deleteBlog(id);
      showToast('Blog article deleted.');
    }
  };

  // Filtered photos
  const filteredPhotos = photos.filter(p => {
    const matchesSection = photoSectionFilter === 'all' || p.section === photoSectionFilter;
    const matchesQuery =
      photoSearchQuery === '' ||
      p.title.toLowerCase().includes(photoSearchQuery.toLowerCase()) ||
      (p.caption && p.caption.toLowerCase().includes(photoSearchQuery.toLowerCase())) ||
      p.sectionLabel.toLowerCase().includes(photoSearchQuery.toLowerCase());
    return matchesSection && matchesQuery;
  });

  if (!isAdminOpen) {
    return null;
  }

  // 1. Password Protection Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <div className="bg-white rounded-[24px] p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900">Rudra Admin Portal</h3>
                <p className="text-xs text-stone-500">Authorized Personnel Only</p>
              </div>
            </div>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                Admin Security Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={enteredPasscode}
                  onChange={e => {
                    setEnteredPasscode(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter passcode"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white pr-11"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-stone-900 hover:bg-black text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Unlock Admin Controls</span>
            </button>

            {/* Quick Demo Access Aid for User convenience */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Default key: <strong className="font-mono text-stone-800">rudra2025</strong></span>
              <button
                type="button"
                onClick={() => {
                  setEnteredPasscode('rudra2025');
                  setIsAuthenticated(true);
                  showToast('Unlocked with default admin key.');
                }}
                className="text-stone-800 underline font-medium hover:text-black"
              >
                Auto Fill &amp; Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. Full Admin Dashboard Screen
  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] text-stone-900 flex flex-col overflow-hidden">
      
      {/* Top Bar Header */}
      <header className="bg-white border-b border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-base">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-stone-900">
                Rudra Construction CMS &amp; Media Hub
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Synced</span>
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Manage website photos, blog publications &amp; project media
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-medium transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Website</span>
          </button>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              showToast('Logged out of Admin');
            }}
            className="p-2 text-stone-400 hover:text-rose-600 rounded-full hover:bg-stone-100"
            title="Log Out"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-8 py-2 flex items-center gap-2 overflow-x-auto flex-shrink-0">
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'photos'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Photos &amp; Media Center ({photos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blogs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'blogs'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Articles &amp; Blogs ({blogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Projects Showcase ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Backup &amp; Security</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        
        {/* TAB 1: PHOTOS MANAGER */}
        {activeTab === 'photos' && (
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase text-stone-500 mr-1">Section:</span>
                {[
                  { key: 'all', label: 'All Photos' },
                  { key: 'hero', label: 'Hero Main' },
                  { key: 'projects', label: 'Project Case Studies' },
                  { key: 'gallery', label: 'Site Gallery' },
                  { key: 'blogs', label: 'Blog Covers' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setPhotoSectionFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      photoSectionFilter === tab.key
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search photos..."
                    value={photoSearchQuery}
                    onChange={e => setPhotoSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:bg-white"
                  />
                </div>

                <button
                  onClick={openNewPhotoModal}
                  className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add New Photo</span>
                </button>
              </div>
            </div>

            {/* Quick Hero Banner Editor Highlight */}
            <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-5 rounded-2xl border border-stone-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <img
                  src={heroPhoto.url}
                  alt="Current Hero"
                  className="w-20 h-20 rounded-xl object-cover border border-white/20 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Active Homepage Hero Image
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mt-1 text-white">
                    Primary Civil Engineering Showcase
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                    {heroPhoto.caption}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const heroItem = photos.find(p => p.section === 'hero' || p.associatedId === 'hero-main');
                  if (heroItem) {
                    openEditPhotoModal(heroItem);
                  } else {
                    openNewPhotoModal();
                  }
                }}
                className="px-4 py-2 bg-white text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Replace Main Hero Photo</span>
              </button>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredPhotos.map(photo => (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-video bg-stone-100 overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/20">
                        {photo.sectionLabel}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="p-4 space-y-1.5">
                      <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">
                        {photo.title}
                      </h4>
                      {photo.caption && (
                        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                          {photo.caption}
                        </p>
                      )}
                      <p className="text-[11px] text-stone-400 pt-1">
                        Added on {photo.uploadedAt}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-3 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditPhotoModal(photo)}
                      className="flex-1 py-1.5 px-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                      <span>Edit / Replace</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeletePhoto(photo.id, photo.title)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredPhotos.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
                  <ImageIcon className="w-10 h-10 text-stone-300 mx-auto" />
                  <h4 className="text-base font-semibold text-stone-800">No photos found</h4>
                  <p className="text-xs text-stone-500">
                    Try adjusting your filter or search query, or upload a new photo.
                  </p>
                  <button
                    onClick={openNewPhotoModal}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload First Photo</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: BLOGS CMS */}
        {activeTab === 'blogs' && (
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-stone-900">
                  Engineering Insights &amp; News CMS
                </h3>
                <p className="text-xs text-stone-500">
                  Create and manage articles, technical case studies, and tender guides on your website.
                </p>
              </div>

              <button
                onClick={openNewBlogModal}
                className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Write New Blog Post</span>
              </button>
            </div>

            {/* Articles List */}
            <div className="space-y-4">
              {blogs.map(blog => (
                <div
                  key={blog.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center gap-5"
                >
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full md:w-36 h-28 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {blog.category}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        blog.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {blog.status}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {blog.publishDate} • {blog.readTime}
                      </span>
                    </div>

                    <h4 className="text-base font-semibold text-stone-900 leading-snug">
                      {blog.title}
                    </h4>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>

                    <p className="text-[11px] text-stone-500">
                      By <span className="font-medium text-stone-700">{blog.authorName}</span> ({blog.authorRole})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => openEditBlogModal(blog)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id, blog.title)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {blogs.length === 0 && (
                <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
                  <FileText className="w-10 h-10 text-stone-300 mx-auto" />
                  <h4 className="text-base font-semibold text-stone-800">No blog posts yet</h4>
                  <p className="text-xs text-stone-500">
                    Publish your first engineering article or tender announcement.
                  </p>
                  <button
                    onClick={openNewBlogModal}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Blog Post</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: PROJECTS SHOWCASE */}
        {activeTab === 'projects' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <h3 className="text-lg font-semibold text-stone-900">
                Core Portfolio Projects Media Sync
              </h3>
              <p className="text-xs text-stone-500">
                Directly replace or update photography assigned to the 6 prominent project case studies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map(proj => (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video bg-stone-100">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/20">
                        {proj.categoryLabel}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <span className="text-[11px] text-stone-500 block">
                        {proj.location}, {proj.state}
                      </span>
                      <h4 className="text-base font-semibold text-stone-900 leading-snug">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500">Client: <strong>{proj.client}</strong></span>
                    <button
                      onClick={() => {
                        const matchingPhoto = photos.find(p => p.associatedId === proj.id);
                        if (matchingPhoto) {
                          openEditPhotoModal(matchingPhoto);
                        } else {
                          openNewPhotoModal();
                          setPhotoFormData(prev => ({
                            ...prev,
                            title: proj.title,
                            section: 'projects',
                            sectionLabel: `Project Case Study: ${proj.title}`,
                            associatedId: proj.id,
                            url: proj.image
                          }));
                        }
                      }}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Change Project Photo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS, BACKUP & SECURITY */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Passcode update card */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900">Admin Security Passcode</h3>
                  <p className="text-xs text-stone-500">Update the passcode used to access this admin panel.</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <input
                  type="text"
                  defaultValue={adminPasscode}
                  onBlur={e => {
                    if (e.target.value.trim()) {
                      setAdminPasscode(e.target.value.trim());
                      showToast('Admin passcode updated successfully.');
                    }
                  }}
                  className="px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono text-stone-900 w-64 focus:bg-white focus:outline-none"
                />
                <span className="text-xs text-stone-400">Click away to save.</span>
              </div>
            </div>

            {/* Data Export & Backup */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900">Export Website Data Backup</h3>
                  <p className="text-xs text-stone-500">Download a JSON copy of all custom photos, blogs, and settings.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const json = exportData();
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `rudra_website_backup_${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    showToast('Backup JSON downloaded.');
                  }}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Backup JSON</span>
                </button>
              </div>
            </div>

            {/* Restore / Import */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900">Restore Data from JSON</h3>
                  <p className="text-xs text-stone-500">Load a previous backup file to restore photos and articles.</p>
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Choose Backup File...</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            const ok = importData(reader.result);
                            if (ok) {
                              showToast('Backup successfully imported.');
                            } else {
                              alert('Failed to parse backup JSON. Please check file format.');
                            }
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Reset Defaults */}
            <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200 shadow-xs space-y-3">
              <h3 className="text-base font-semibold text-rose-900">Reset to Factory Defaults</h3>
              <p className="text-xs text-rose-700 leading-relaxed">
                Restores original company project photos, standard hero image, and default engineering articles.
              </p>
              <button
                onClick={() => {
                  if (confirm('Reset all website photos and blogs back to original defaults?')) {
                    resetToDefaults();
                    showToast('Website reset to default content.');
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All to Defaults</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT PHOTO */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-semibold text-stone-900">
                {editingPhoto ? 'Edit or Replace Photo' : 'Upload New Website Photo'}
              </h3>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              
              {/* Image Preview & Upload options */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Photo Source
                </label>
                
                {photoFormData.url ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-stone-200 mb-3 bg-stone-100">
                    <img
                      src={photoFormData.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoFormData(p => ({ ...p, url: '' }))}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                      title="Clear image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => photoFileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-xl p-6 text-center cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors mb-3"
                  >
                    <Camera className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-xs font-medium text-stone-800">
                      Click to upload photo from your computer or phone
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Supports JPG, PNG, WebP
                    </p>
                  </div>
                )}

                <input
                  ref={photoFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, dataUrl => {
                        setPhotoFormData(p => ({ ...p, url: dataUrl }));
                      });
                    }
                  }}
                />

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="url"
                    placeholder="Or paste image web URL (https://...)"
                    value={photoFormData.url.startsWith('data:') ? '' : photoFormData.url}
                    onChange={e => setPhotoFormData(p => ({ ...p, url: e.target.value }))}
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => photoFileInputRef.current?.click()}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium"
                  >
                    Browse Device
                  </button>
                </div>
              </div>

              {/* Photo Title */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  value={photoFormData.title}
                  onChange={e => setPhotoFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Panchayat Bhawan Front Facade"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                  required
                />
              </div>

              {/* Section Assignment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Website Section
                  </label>
                  <select
                    value={photoFormData.section}
                    onChange={e => {
                      const val = e.target.value as any;
                      const labels: Record<string, string> = {
                        hero: 'Hero Main Header',
                        projects: 'Project Case Study',
                        gallery: 'Site Gallery',
                        blogs: 'Blog Cover',
                        worksites: 'Worksites Map'
                      };
                      setPhotoFormData(p => ({
                        ...p,
                        section: val,
                        sectionLabel: labels[val] || 'Site Photo'
                      }));
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                  >
                    <option value="gallery">Site Gallery</option>
                    <option value="hero">Hero Main Header</option>
                    <option value="projects">Project Case Study</option>
                    <option value="blogs">Blog Post Cover</option>
                    <option value="worksites">Worksite Map Site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Linked Item ID (Optional)
                  </label>
                  <select
                    value={photoFormData.associatedId}
                    onChange={e => setPhotoFormData(p => ({ ...p, associatedId: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                  >
                    <option value="">None / Standalone</option>
                    <option value="hero-main">Hero Main Banner</option>
                    <option value="proj-1">Project #1: Panchayat Bhawan</option>
                    <option value="proj-2">Project #2: Hospital Ward</option>
                    <option value="proj-3">Project #3: Solar Lighting</option>
                    <option value="proj-4">Project #4: Highway Overpass</option>
                    <option value="proj-5">Project #5: Animal Resource</option>
                    <option value="proj-6">Project #6: Material Logistics</option>
                  </select>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={photoFormData.caption}
                  onChange={e => setPhotoFormData(p => ({ ...p, caption: e.target.value }))}
                  placeholder="Brief description of the construction work or material shown"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save Photo to Website</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT BLOG POST */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full border border-stone-200 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-semibold text-stone-900">
                {editingBlog ? 'Edit Blog Article' : 'Write & Publish New Blog Article'}
              </h3>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  value={blogFormData.title}
                  onChange={e => setBlogFormData(b => ({ ...b, title: e.target.value }))}
                  placeholder="e.g. Quality Benchmarks in Rapid Panchayat Bhawan Handover"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:bg-white"
                  required
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={blogFormData.category}
                    onChange={e => setBlogFormData(b => ({ ...b, category: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                  >
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Solar Energy">Solar Energy</option>
                    <option value="Tender & Compliance">Tender &amp; Compliance</option>
                    <option value="Case Study">Case Study</option>
                    <option value="Materials">Materials &amp; Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Publish Status
                  </label>
                  <select
                    value={blogFormData.status}
                    onChange={e => setBlogFormData(b => ({ ...b, status: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Est. Read Time
                  </label>
                  <input
                    type="text"
                    value={blogFormData.readTime}
                    onChange={e => setBlogFormData(b => ({ ...b, readTime: e.target.value }))}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Article Cover Image
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={blogFormData.coverImage}
                    onChange={e => setBlogFormData(b => ({ ...b, coverImage: e.target.value }))}
                    placeholder="Image URL or upload from device"
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => blogCoverFileInputRef.current?.click()}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium whitespace-nowrap"
                  >
                    Upload File
                  </button>
                  <input
                    ref={blogCoverFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, dataUrl => {
                          setBlogFormData(b => ({ ...b, coverImage: dataUrl }));
                        });
                      }
                    }}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={blogFormData.excerpt}
                  onChange={e => setBlogFormData(b => ({ ...b, excerpt: e.target.value }))}
                  placeholder="A concise 1-2 sentence overview for the card summary..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              {/* Author & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={blogFormData.authorName}
                    onChange={e => setBlogFormData(b => ({ ...b, authorName: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={blogFormData.authorRole}
                    onChange={e => setBlogFormData(b => ({ ...b, authorRole: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Article Content */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Article Body (Supports paragraphs &amp; headings)
                </label>
                <textarea
                  rows={7}
                  value={blogFormData.content}
                  onChange={e => setBlogFormData(b => ({ ...b, content: e.target.value }))}
                  placeholder="Write your article text here. You can use ### for section headings or bullet points."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:bg-white leading-relaxed font-mono"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={blogFormData.tags}
                  onChange={e => setBlogFormData(b => ({ ...b, tags: e.target.value }))}
                  placeholder="e.g. Civil Engineering, Bihar PWD, Solar"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Publish Blog Article</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-2.5 text-xs sm:text-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
