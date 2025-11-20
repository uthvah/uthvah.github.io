import React from 'react';
import { TIMELINE } from '../constants';
import RevealText from './RevealText';

const About: React.FC = () => {
  return (
    <section id="about" className="py-32 px-6 md:px-20 max-w-6xl mx-auto relative">
      
      <div className="flex flex-col md:flex-row gap-20">
        
        {/* Left: Bio */}
        <div className="flex-1">
          <div className="sticky top-32">
            <span className="font-mono text-academy-gold text-xs tracking-widest block mb-4">// ABOUT ME</span>
            <h2 className="font-display text-4xl md:text-5xl text-academy-paper mb-8">The Archivist</h2>
            
            <div className="font-mono text-sm text-stone-400 leading-loose space-y-6 text-justify">
              <p>
                I am a systems engineer with a penchant for the foundational layers of computing. 
                While many look to the cloud, I look to the kernel. My work exists at the intersection 
                of rigorous C performance and high-level architectural design.
              </p>
              <p>
                Beyond the terminal, I am a curator of my own digital knowledge, building tools 
                like <span className="text-academy-gold">Locksidian</span> and <span className="text-academy-gold">Sync Embeds</span> to 
                ensure that information is not just stored, but engineered for longevity.
              </p>
              <p>
                This portfolio serves as a living archive—a collection of code, thought, and sound.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-stone-900">
                <div className="flex gap-8 font-serif italic text-stone-500 text-sm">
                    <span>Based in the Digital Ether</span>
                    <span>Est. 2023</span>
                </div>
            </div>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="flex-1 relative border-l border-stone-900 pl-8 md:pl-16 py-4">
          {TIMELINE.map((event, index) => (
            <div key={index} className="relative mb-16 last:mb-0 group">
              {/* Dot */}
              <div className="absolute -left-[37px] md:-left-[69px] top-2 w-3 h-3 rounded-full bg-stone-900 border border-stone-700 group-hover:bg-academy-gold group-hover:border-academy-gold transition-colors duration-500"></div>
              
              <RevealText 
                delay={index * 100} 
                text={event.year} 
                className="font-display text-2xl text-stone-600 mb-2 group-hover:text-academy-paper transition-colors" 
              />
              
              <h3 className="font-serif text-xl text-academy-gold mb-3 italic">
                {event.title}
              </h3>
              
              <p className="font-mono text-xs text-stone-500 leading-relaxed max-w-sm">
                {event.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;