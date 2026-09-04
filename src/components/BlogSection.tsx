import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useCms } from '../cms/CmsProvider';

export const BlogSection: React.FC = () => {
  const { publishedBlogs, photoById } = useCms();
  if (!publishedBlogs.length) return null;

  return (
    <section id="journal" className="py-20 sm:py-24 bg-[#fafafa] border-b border-[#e7e5e4]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium">Field journal</p>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight leading-snug">
              Insights from the worksite.
            </h2>
            <p className="text-base sm:text-lg text-[#57534e] leading-relaxed">
              Project notes, delivery milestones and engineering briefings.
            </p>
          </div>
          <a href="/blog" className="text-[14px] font-medium text-[#292524] inline-flex items-center gap-1">
            All posts <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedBlogs.slice(0, 6).map((post) => {
            const cover = photoById(post.coverPhotoId);
            return (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-[20px] overflow-hidden border border-[#e7e5e4] hover:border-[#292524] transition-colors flex flex-col"
              >
                {cover && (
                  <img
                    src={`${cover.url}?v=${encodeURIComponent(cover.updatedAt)}`}
                    alt={cover.alt}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#78716c]">
                    {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <h3 className="text-lg font-medium text-[#0c0a09] mt-2 tracking-tight">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-[#57534e] mt-2 line-clamp-3 flex-1">{post.excerpt}</p>}
                  <span className="text-[13px] font-medium mt-4 inline-flex items-center gap-1">
                    Read article <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
