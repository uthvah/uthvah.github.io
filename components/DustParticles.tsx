import React, { useEffect, useState } from 'react';

const DustParticles: React.FC = () => {
  const [particles, setParticles] = useState<{id: number, left: number, top: number, duration: number, delay: number}[]>([]);

  useEffect(() => {
    // Reduce particle count on mobile for performance, or keep it low generally.
    const count = 25; 
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 15 + Math.random() * 20, // 15-35s duration
      delay: Math.random() * -30, // Start at random points in the animation cycle
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-[2px] h-[2px] bg-academy-gold rounded-full opacity-20"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `float ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default DustParticles;