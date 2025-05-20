import { useEffect } from 'react';

export const useAnimations = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const spans = document.querySelectorAll('.slide-up');
    const rectangles = document.querySelectorAll('.hanging-rectangle');
    
    spans.forEach((span, index) => {
      (span as HTMLElement).style.setProperty('--slide-delay', `${index * 0.2}s`);
      observer.observe(span);
    });
    
    rectangles.forEach((rectangle) => {
      observer.observe(rectangle);
    });

    return () => {
      spans.forEach(span => observer.unobserve(span));
      rectangles.forEach(rectangle => observer.unobserve(rectangle));
    };
  }, []);
};