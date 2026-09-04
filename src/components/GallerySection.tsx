import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCms } from '../cms/CmsProvider';

export const GallerySection: React.FC = () => {
  const { galleryPhotos } = useCms();
  const [active, setActive] = useState<string | null>(null);
  if (!galleryPhotos.length) return null;
  const open = galleryPhotos.find((p) => p.id === active);

  return (
    <section id="gallery" className="py-20 sm:py-24 bg-[#ffffff] border-b border-[#e0e0e0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-wider text-[#78716c] font-medium">Field photography</p>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight leading-snug">
            Site gallery.
          </h2>
          <p className="text-base sm:text-lg text-[#57534e] leading-relaxed font-normal">
            Photographs from civic, healthcare, solar and civil works — updated from the project archive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {galleryPhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActive(photo.id)}
              className="text-left bg-[#fafafa] rounded-[18px] overflow-hidden border border-[#e7e5e4] hover:border-[#292524] transition-colors"
            >
              <img
                src={`${photo.url}?v=${encodeURIComponent(photo.updatedAt)}`}
                alt={photo.alt || photo.title}
                className="w-full h-56 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <div className="text-[15px] font-medium text-[#0c0a09]">{photo.title}</div>
                {photo.caption && <p className="text-sm text-[#57534e] mt-1">{photo.caption}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActive(null)}
              className="absolute -top-12 right-0 text-white p-2"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={`${open.url}?v=${encodeURIComponent(open.updatedAt)}`}
              alt={open.alt}
              className="w-full max-h-[80vh] object-contain rounded-[16px] bg-black"
            />
            <p className="text-white text-sm mt-3">{open.title}{open.caption ? ` — ${open.caption}` : ''}</p>
          </div>
        </div>
      )}
    </section>
  );
};
