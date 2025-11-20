import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectList from './components/ProjectList';
import About from './components/About';
import Phonograph from './components/Phonograph';
import Librarian from './components/Librarian';
import Grain from './components/Grain';
import DustParticles from './components/DustParticles';

function App() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
            document.querySelector(href)?.scrollIntoView({
            behavior: 'smooth'
            });
        }
      });
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-academy-bg text-academy-paper selection:bg-academy-gold selection:text-academy-ink">
      <Grain />
      <DustParticles />
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <About />
        <ProjectList />
        <Phonograph />
        
        <footer className="py-24 text-center border-t border-stone-900 bg-academy-bg">
          <p className="font-display text-stone-700 text-xs tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity">
            © {new Date().getFullYear()} UTHVAH SHANKAR.
          </p>
        </footer>
      </main>

      <Librarian />
    </div>
  );
}

export default App;