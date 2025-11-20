import React, { useState } from 'react';
import { PROJECTS } from '../constants';
import { ArrowUpRight, X, Hash } from 'lucide-react';
import { Project } from '../types';

const ProjectList: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (project: Project) => {
    setIsAnimating(true);
    setSelectedProject(project);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedProject(null);
      setIsAnimating(false);
    }, 500); 
  };

  return (
    <section id="works" className="relative py-32 px-6 md:px-20 min-h-screen flex flex-col items-center bg-academy-bg">
      {/* Decorative header */}
      <div className="text-center mb-20">
        <span className="font-mono text-academy-gold text-xs tracking-[0.4em] block mb-6">THE ARCHIVES</span>
        <h2 className="font-display text-5xl md:text-7xl text-academy-paper opacity-90">Select Works</h2>
      </div>

      {/* Grid Layout for Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full z-10">
        {PROJECTS.map((project, index) => (
          <div
            key={project.id}
            onClick={() => handleSelect(project)}
            className="group relative h-64 md:h-80 border border-stone-800 bg-stone-900/30 cursor-pointer overflow-hidden transition-all duration-500 hover:border-academy-gold/50"
          >
            {/* Hover Reveal Background */}
            <div className="absolute inset-0 bg-academy-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="font-mono text-academy-gold text-xs">NO. 0{index + 1}</span>
                <ArrowUpRight className="w-5 h-5 text-stone-600 group-hover:text-academy-paper transition-colors duration-300" />
              </div>

              <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="font-display text-3xl text-stone-300 group-hover:text-academy-paper transition-colors duration-300 mb-2">
                  {project.title}
                </h3>
                <p className="font-serif italic text-stone-500 text-sm group-hover:text-academy-gold transition-colors duration-300">
                  {project.category}
                </p>
              </div>
            </div>

            {/* Decorative corner lines */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </div>

      {/* Full Screen Project Detail Modal (The "Tome" Page) */}
      {selectedProject && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 md:px-0 transition-opacity duration-500 ${isAnimating && !selectedProject ? 'opacity-0' : 'opacity-100'}`}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* The "Card" / "File" */}
          <div
            className={`
              relative w-full max-w-5xl bg-[#121212] border border-stone-800 shadow-2xl overflow-hidden
              transform transition-all duration-700 ease-out rounded-sm
              ${isAnimating ? 'translate-y-[20px] opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}
            `}
          >
             {/* Paper Texture Overlay (Dark Mode) */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.07] z-0 mix-blend-overlay"
                style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}
            />

            {/* Top Bar of the "File" */}
            <div className="h-1 bg-academy-gold w-full relative z-10 shadow-[0_0_15px_rgba(157,140,112,0.3)]" />

            <div className="p-8 md:p-16 relative max-h-[90vh] overflow-y-auto z-10">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 text-stone-500 hover:text-academy-paper transition-colors z-20"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header Content */}
              <div className="flex flex-col md:flex-row gap-8 md:items-end border-b border-stone-800 pb-8 mb-10">
                <div>
                   <span className="font-mono text-xs tracking-widest text-academy-gold mb-3 block">PROJECT REPORT // {selectedProject.year}</span>
                   <h2 className="font-display text-5xl md:text-7xl text-academy-paper leading-none">{selectedProject.title}</h2>
                </div>
                <div className="md:ml-auto pb-2">
                    <span className="font-serif italic text-2xl text-stone-400">{selectedProject.category}</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                  <p className="font-serif text-lg leading-relaxed text-stone-300">
                    {selectedProject.description}
                  </p>
                  <p className="font-mono text-sm leading-loose text-stone-500 border-l-2 border-stone-800 pl-6">
                    This project represents a deeper inquiry into {selectedProject.category.toLowerCase()} design.
                    The architecture prioritizes robustness and clarity, adhering to the principles of
                    minimalism and functional purity necessary for high-performance computing environments.
                  </p>
                </div>

                {/* Sidebar / Metadata */}
                <div className="border-l border-stone-800 pl-8 space-y-10">
                  <div>
                    <span className="font-display text-xs font-bold tracking-[0.2em] mb-6 block text-stone-500">TECHNOLOGIES</span>
                    <ul className="space-y-3">
                      {selectedProject.tech.map(t => (
                        <li key={t} className="font-mono text-xs text-stone-400 flex items-center gap-3">
                          <Hash className="w-3 h-3 text-academy-gold/50" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-3 font-display font-bold text-sm tracking-widest text-academy-gold hover:text-academy-paper transition-colors border-b border-academy-gold/20 pb-1"
                    >
                      ACCESS REPOSITORY
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer/Signature */}
              <div className="mt-16 pt-8 border-t border-stone-800 flex justify-between items-end opacity-40">
                <div className="font-serif italic text-sm text-stone-500">
                    Archived by Uthvah
                </div>
                <div className="font-mono text-xs text-stone-600">
                    ID: {selectedProject.id.toUpperCase()}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectList;