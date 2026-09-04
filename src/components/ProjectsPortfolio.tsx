import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useCms } from '../cms/CmsProvider';
import { ProjectItem } from '../types';

export const ProjectsPortfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'civic', label: 'Civic & Govt' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'solar', label: 'Solar' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'materials', label: 'Material Supply' },
  ];

  const { resolveSlotUrl, allProjectsMerged } = useCms();

  const filteredProjects = activeCategory === 'all' ? allProjectsMerged : allProjectsMerged.filter((p: ProjectItem) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-[#fafafa] border-b border-[#e7e5e4] relative z-10">
      <span id="projects" className="absolute -top-20"></span>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#f0efed] border border-[#e7e5e4] text-[11px] font-mono uppercase tracking-wider text-[#777169]">
              <span>Landmark Deployments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#0c0a09] tracking-tight leading-snug">
              Engineered with precision across India.
            </h2>
            <p className="text-base sm:text-lg text-[#57534e] leading-relaxed font-normal">
              Administrative complexes, hospital wards, rural solar grids, and bulk logistics delivered to exact statutory standards.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`apple-btn-active px-4 py-2 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#292524] text-white shadow-sm'
                    : 'bg-[#ffffff] text-[#4e4e4e] hover:text-[#0c0a09] border border-[#e7e5e4]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project: ProjectItem, idx: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              className="bg-[#ffffff] rounded-[20px] overflow-visible border border-[#e7e5e4] flex flex-col justify-between transition-all hover:border-[#292524] hover:shadow-lg group relative"
            >
              <div>
                <div className="relative h-60 rounded-t-[19px] overflow-hidden bg-[#f0efed]">
                  <img
                    src={resolveSlotUrl(`project-${project.id}`, project.image)}
                    alt={`${project.title} — ${project.location}, ${project.state} — ${project.client}`}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-600"
                    width={800}
                    height={480}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/80 text-white backdrop-blur-sm border border-white/10">
                      {project.categoryLabel}
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white flex items-center justify-between text-[12px] font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#a7e5d3]" />
                      <span>
                        {project.location}, {project.state}
                      </span>
                    </span>
                    <span className="text-white/80">{project.year}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-[12px] text-[#777169] font-mono uppercase tracking-wider">{project.client}</div>
                  <h3 className="text-lg font-medium text-[#0c0a09] group-hover:text-[#292524] transition-colors line-clamp-1 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#57534e] line-clamp-2 leading-relaxed">{project.description}</p>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#f0efed]">
                    {project.metrics.slice(0, 2).map((m, mIdx) => (
                      <div key={mIdx} className="bg-[#fafafa] p-2.5 rounded-[12px] border border-[#f0efed]">
                        <div className="text-[10px] font-mono uppercase text-[#777169]">{m.label}</div>
                        <div className="text-[14px] font-semibold text-[#0c0a09] mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="apple-btn-active w-full inline-flex items-center justify-between py-2.5 px-4 text-[13px] font-medium text-[#292524] bg-[#fafafa] hover:bg-[#f0efed] border border-[#e7e5e4] rounded-full cursor-pointer transition-all"
                  >
                    <span>View Engineering Specs</span>
                    <ChevronRight className="w-4 h-4 text-[#777169] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <a
                    href={`/projects/${project.id}/`}
                    className="text-[12px] text-[#78716c] hover:text-[#0c0a09] text-center underline underline-offset-4"
                  >
                    Open indexed case study
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#ffffff] rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e7e5e4]"
              >
                <div className="relative h-64 bg-black">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-5 left-6 right-6 text-white">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#a7e5d3]">{selectedProject.categoryLabel}</div>
                    <h3 className="text-[22px] sm:text-[26px] font-medium text-white mt-1 leading-tight">{selectedProject.title}</h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fafafa] p-4 rounded-[16px] border border-[#e7e5e4] text-[12px] font-mono">
                    <div>
                      <span className="text-[#777169] block text-[10px]">AUTHORITY</span>
                      <span className="text-[#0c0a09] font-medium">{selectedProject.client}</span>
                    </div>
                    <div>
                      <span className="text-[#777169] block text-[10px]">LOCATION</span>
                      <span className="text-[#0c0a09] font-medium">{selectedProject.location}</span>
                    </div>
                    <div>
                      <span className="text-[#777169] block text-[10px]">STATUS</span>
                      <span className="text-[#16a34a] font-medium">{selectedProject.status}</span>
                    </div>
                    <div>
                      <span className="text-[#777169] block text-[10px]">YEAR</span>
                      <span className="text-[#0c0a09] font-medium">{selectedProject.year}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#777169]">Scope Description</h4>
                    <p className="text-[15px] text-[#292524] leading-[1.5]">{selectedProject.description}</p>
                    <p className="text-[13px] text-[#777169] pt-1 font-mono">Deliverable: {selectedProject.scope}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#777169]">Specifications Delivered</h4>
                    <div className="space-y-2">
                      {selectedProject.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-[14px] text-[#292524]">
                          <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#777169]">Execution Metrics</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedProject.metrics.map((m, idx) => (
                        <div key={idx} className="bg-[#fafafa] p-3 rounded-[12px] text-center border border-[#e7e5e4]">
                          <div className="text-[10px] font-mono uppercase text-[#777169]">{m.label}</div>
                          <div className="text-[15px] font-semibold text-[#0c0a09] mt-0.5">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#e7e5e4] flex justify-end">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="apple-btn-active px-6 py-2.5 rounded-full bg-[#292524] hover:bg-[#0c0a09] text-white text-[13px] font-medium cursor-pointer transition-colors"
                    >
                      Close Specs
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
