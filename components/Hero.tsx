import React from 'react';
import RevealText from './RevealText';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden border-b border-stone-900/50 bg-academy-bg selection:bg-academy-gold/30 py-20 md:py-0">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>
      
      {/* Ornate Corner Frames - Responsive */}
      <div className="absolute inset-x-4 top-24 bottom-12 md:inset-x-6 md:top-32 md:bottom-12 pointer-events-none max-w-6xl mx-auto border border-stone-800/30">
        <div className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t border-l border-academy-gold/40"></div>
        <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t border-r border-academy-gold/40"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-b border-l border-academy-gold/40"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b border-r border-academy-gold/40"></div>
      </div>

      {/* Center Vertical Axis Line */}
      <div className="absolute inset-0 pointer-events-none flex justify-center">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-stone-800/50 to-transparent opacity-50"></div>
      </div>
      
      <div className="max-w-6xl w-full z-20 relative flex flex-col items-center pt-8 md:pt-12 mb-16 md:mb-0">
        
        {/* Top Label */}
        <RevealText 
          tag="div"
          text="FIG. 01 — THE ARCHITECT"
          className="font-mono text-academy-gold text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] mb-8 md:mb-12 opacity-60 border border-academy-gold/20 px-4 py-1 rounded-full backdrop-blur-sm" 
        />
        
        <div className="relative mb-12 md:mb-16 isolate w-full">
            {/* Decorative Crosshairs */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-stone-800/50 -z-10 hidden md:block"></div>
            
            <h1 className="font-display text-5xl md:text-9xl lg:text-[11rem] text-academy-paper opacity-90 leading-[0.8] tracking-tighter mix-blend-screen">
              UTHVAH
            </h1>
            
            <div className="flex items-center justify-center gap-4 md:gap-16 my-2 md:my-4 overflow-hidden">
                 <div className="h-px flex-1 max-w-[50px] md:max-w-[100px] bg-gradient-to-r from-transparent to-stone-600"></div>
                 <span className="font-serif italic text-xl md:text-4xl text-stone-500 font-light">est. MMXXIII</span>
                 <div className="h-px flex-1 max-w-[50px] md:max-w-[100px] bg-gradient-to-l from-transparent to-stone-600"></div>
            </div>

            <h1 className="font-display text-5xl md:text-9xl lg:text-[11rem] text-stone-700 opacity-60 leading-[0.8] tracking-tighter mix-blend-overlay">
              SHANKAR
            </h1>
        </div>

        <RevealText 
          delay={300}
          text="Systems Engineer & Open Source Contributor"
          className="font-serif italic text-lg md:text-3xl text-stone-400 mb-12 tracking-wide text-center px-4"
        />

        {/* Abstract / Bio Box */}
        <div className="max-w-lg mx-auto relative group px-4">
            <div className="absolute -inset-4 bg-stone-900/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"></div>
            <p className="relative font-mono text-xs md:text-sm text-stone-500 leading-loose text-justify border-l-2 border-academy-gold/30 pl-6 pr-2 bg-academy-bg/40 backdrop-blur-sm">
                 <span className="text-academy-gold font-bold mr-2">ABSTRACT.</span> 
                 A dedicated study in C#, Python, Javascript
            </p>
        </div>
      </div>

      {/* Bottom Scroll Indicator - Positioned relatively on small screens if needed, or absolute with clearance */}
      <div className="absolute bottom-6 md:bottom-12 flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-500 cursor-pointer left-1/2 -translate-x-1/2 w-full">
        <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-stone-600 uppercase">Scroll to Explore</span>
        <div className="w-px h-8 md:h-12 bg-gradient-to-b from-stone-600 to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;