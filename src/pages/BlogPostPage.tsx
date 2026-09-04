import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CmsProvider, useCms } from '../cms/CmsProvider';

function Article({ slug }: { slug: string }) {
  const { publishedBlogs, photoById, loading } = useCms();
  const post = publishedBlogs.find((b) => b.slug === slug);
  const go = (hash: string) => {
    window.location.href = `/${hash}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Navbar onOpenEstimator={() => go('#estimator')} onOpenBrochure={() => go('#overview')} />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        {loading && <p className="text-sm text-[#78716c]">Loading…</p>}
        {!loading && !post && (
          <div className="space-y-3">
            <h1 className="text-3xl font-medium">Post not found.</h1>
            <a href="/blog" className="text-sm text-[#292524] underline">Back to journal</a>
          </div>
        )}
        {post && (
          <article className="bg-white border border-[#e7e5e4] rounded-[24px] overflow-hidden">
            {photoById(post.coverPhotoId) && (
              <img
                src={`${photoById(post.coverPhotoId)!.url}?v=${encodeURIComponent(photoById(post.coverPhotoId)!.updatedAt)}`}
                alt={photoById(post.coverPhotoId)!.alt}
                className="w-full h-72 object-cover"
              />
            )}
            <div className="p-6 sm:p-10 space-y-4">
              <a href="/blog" className="text-xs uppercase tracking-wider text-[#78716c]">← Journal</a>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#78716c]">
                {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight leading-tight">{post.title}</h1>
              {post.excerpt && <p className="text-lg text-[#57534e]">{post.excerpt}</p>}
              <div className="text-[16px] text-[#292524] leading-relaxed whitespace-pre-wrap pt-2">{post.body}</div>
            </div>
          </article>
        )}
      </main>
      <Footer onOpenBrochure={() => go('#overview')} onOpenEstimator={() => go('#estimator')} />
    </div>
  );
}

export function BlogPostPage({ slug }: { slug: string }) {
  return (
    <CmsProvider>
      <Article slug={slug} />
    </CmsProvider>
  );
}
