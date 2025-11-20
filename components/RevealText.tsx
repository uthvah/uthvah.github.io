import React, { useEffect, useRef, useState } from 'react';

interface RevealTextProps {
  text: string;
  delay?: number;
  className?: string;
  tag?: React.ElementType;
}

const RevealText: React.FC<RevealTextProps> = ({ text, delay = 0, className = "", tag: Tag = 'div' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as any}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {text}
    </Tag>
  );
};

export default RevealText;