import { useEffect, useRef, useState } from 'react';

export const useTypewriterAnimation = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');
  const elementRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let index = 0;
          const typeWriter = () => {
            if (index < text.length) {
              setDisplayText(text.slice(0, index + 1));
              index++;
              setTimeout(typeWriter, speed);
            }
          };
          typeWriter();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [text, speed]);

  return { displayText, elementRef };
};