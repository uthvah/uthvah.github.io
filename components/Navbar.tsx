import React, { useState, useEffect } from 'react';
import { Feather } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-1000 ease-in-out px-6 md:px-12 flex justify-between items-center ${
        scrolled 
        ? 'bg-academy-bg/80 backdrop-blur-md border-b border-stone-900/50 py-4' 
        : 'bg-transparent border-b border-transparent py-8'
      }`}
    >
      {/* Background Gradient Overlay for initial state - fades out when scrolled */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-academy-bg/80 to-transparent pointer-events-none transition-opacity duration-1000 ease-in-out -z-10 ${
          scrolled ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      <div className="flex items-center gap-4 group cursor-pointer relative z-10">
        <div className="relative p-2 border border-stone-800 rounded-full group-hover:border-academy-gold/50 transition-colors duration-500 bg-academy-bg/50">
            <Feather className="w-4 h-4 text-academy-gold transition-transform duration-700 group-hover:-rotate-12" />
        </div>
        <div className="flex flex-col">
            <span className="font-display font-bold text-base tracking-[0.2em] text-academy-paper group-hover:text-white transition-colors">UTHVAH</span>
            <span className="font-mono text-[9px] text-stone-600 tracking-widest group-hover:text-academy-gold transition-colors hidden md:block">SYSTEMS ARCHITECT</span>
        </div>
      </div>
      
      <div className="hidden md:flex gap-12 font-mono text-[10px] text-academy-gold/60 tracking-[0.2em] relative z-10">
        <a href="#about" className="hover:text-academy-paper transition-colors hover:underline decoration-academy-gold/30 underline-offset-8">BIO</a>
        <a href="#works" className="hover:text-academy-paper transition-colors hover:underline decoration-academy-gold/30 underline-offset-8">ARCHIVES</a>
        <a href="#phonograph" className="hover:text-academy-paper transition-colors hover:underline decoration-academy-gold/30 underline-offset-8">AUDIO</a>
        <a href="https://github.com/uthvah" target="_blank" rel="noreferrer" className="hover:text-academy-paper transition-colors hover:underline decoration-academy-gold/30 underline-offset-8">GITHUB</a>
      </div>
    </nav>
  );
};

export default Navbar;