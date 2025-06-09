import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number; // ms per character
}

const TypewriterText = ({ text, className = '', speed = 18 }: TypewriterTextProps) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let current = 0;
    let active = true;
    setDisplayed('');
    function type() {
      if (!active) return;
      if (current <= text.length) {
        setDisplayed(text.slice(0, current));
        current++;
        setTimeout(type, speed);
      }
    }
    type();
    return () => { active = false; };
  }, [text, speed]);

  return (
    <p className={`whitespace-pre-line ${className}`}>{displayed}</p>
  );
};

export default TypewriterText; 