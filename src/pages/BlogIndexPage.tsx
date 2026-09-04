import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BlogSection } from '../components/BlogSection';
import { CmsProvider } from '../cms/CmsProvider';

export function BlogIndexPage() {
  const go = (hash: string) => {
    window.location.href = `/${hash}`;
  };
  return (
    <CmsProvider>
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <Navbar onOpenEstimator={() => go('#estimator')} onOpenBrochure={() => go('#overview')} />
        <main className="flex-1">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
            <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium">Field journal</p>
            <h1 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight mt-2">All posts.</h1>
          </div>
          <BlogSection />
        </main>
        <Footer onOpenBrochure={() => go('#overview')} onOpenEstimator={() => go('#estimator')} />
      </div>
    </CmsProvider>
  );
}
