import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  ChevronRight,
  User,
  Tag,
  ArrowRight,
  BookOpen,
  Sparkles,
  Share2,
  X
} from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { BlogPost } from '../types';

export const BlogsSection: React.FC = () => {
  const { blogs, activeReadingBlog, setActiveReadingBlog, setIsAdminOpen } = useWebsiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Only show published blogs on the public site
  const publishedBlogs = blogs.filter(b => b.status === 'Published');

  const categories = ['All', 'Civil Engineering', 'Solar Energy', 'Tender & Compliance', 'Case Study'];

  const filteredBlogs = publishedBlogs.filter(blog => {
    if (selectedCategory === 'All') return true;
    return blog.category === selectedCategory;
  });

  return (
    <section id="blogs" className="py-20 sm:py-28 bg-[#fafafa] border-b border-[#e7e5e4] relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#292524]" />
              <span>Technical Publications &amp; Field Updates</span>
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#0c0a09] tracking-tight leading-tight">
              Engineering Insights &amp; Project Bulletins.
            </h2>
            <p className="text-base sm:text-lg text-[#57534e] leading-relaxed">
              In-depth analyses of Bureau of Indian Standards (IS 456, IS 1893), rural solar microgrid architectures, and public tender compliance.
            </p>
          </div>

          {/* Category Filter Pills & Admin Shortcut */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#292524] text-white shadow-xs'
                    : 'bg-white text-[#57534e] border border-[#e7e5e4] hover:bg-stone-100 hover:text-[#0c0a09]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBlogs.map(blog => (
            <article
              key={blog.id}
              className="bg-white rounded-[22px] border border-[#e7e5e4] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-black/70 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/20">
                      {blog.category}
                    </span>
                    {blog.featured && (
                      <span className="bg-[#a7e5d3] text-[#0c0a09] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Article Content Preview */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[#78716c]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{blog.publishDate}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{blog.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-[#0c0a09] leading-snug group-hover:text-stone-700 transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-sm text-[#57534e] line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              {/* Author & Read Action Footer */}
              <div className="px-6 py-4 border-t border-[#f5f5f4] bg-stone-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-semibold">
                    {blog.authorName.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-[#0c0a09] leading-tight">
                      {blog.authorName}
                    </p>
                    <p className="text-[10px] text-[#78716c]">
                      {blog.authorRole}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveReadingBlog(blog)}
                  className="apple-btn-active inline-flex items-center gap-1 text-xs font-semibold text-[#292524] hover:text-black py-1.5 px-3 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
                >
                  <span>Read Full</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#292524]" />
                </button>
              </div>

            </article>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e7e5e4] p-8">
            <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm text-stone-600 font-medium">No articles in this category currently.</p>
          </div>
        )}

        {/* Footer Admin Callout */}
        <div className="mt-12 text-center">
          <p className="text-xs text-stone-400">
            Authorized content editors can manage blogs and site media directly via the{' '}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-stone-800 underline hover:text-black font-medium cursor-pointer"
            >
              Admin Portal
            </button>.
          </p>
        </div>

      </div>

      {/* Full Article Reader Modal */}
      {activeReadingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[24px] max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header Bar */}
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70 flex-shrink-0">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                {activeReadingBlog.category} • Technical Article
              </span>
              <button
                onClick={() => setActiveReadingBlog(null)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Cover Banner */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-stone-200 shadow-xs bg-stone-100">
                <img
                  src={activeReadingBlog.coverImage}
                  alt={activeReadingBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-medium text-[#0c0a09] leading-tight">
                  {activeReadingBlog.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716c] pt-1">
                  <span className="font-medium text-[#0c0a09]">{activeReadingBlog.authorName}</span>
                  <span>({activeReadingBlog.authorRole})</span>
                  <span>•</span>
                  <span>{activeReadingBlog.publishDate}</span>
                  <span>•</span>
                  <span>{activeReadingBlog.readTime}</span>
                </div>
              </div>

              {/* Excerpt Lead */}
              <div className="p-4 rounded-xl bg-stone-50 border-l-4 border-[#292524] text-sm text-[#44403c] italic leading-relaxed">
                {activeReadingBlog.excerpt}
              </div>

              {/* Body Content */}
              <div className="text-sm sm:text-base text-[#292524] leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {activeReadingBlog.content}
              </div>

              {/* Tags */}
              {activeReadingBlog.tags && activeReadingBlog.tags.length > 0 && (
                <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-stone-400" />
                  {activeReadingBlog.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/70 flex items-center justify-between flex-shrink-0">
              <a
                href="#contact"
                onClick={() => setActiveReadingBlog(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#292524] text-white text-xs font-medium hover:bg-black transition-colors"
              >
                <span>Consult Our Engineering Team</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#a7e5d3]" />
              </a>

              <button
                onClick={() => setActiveReadingBlog(null)}
                className="px-4 py-2 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-medium"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
