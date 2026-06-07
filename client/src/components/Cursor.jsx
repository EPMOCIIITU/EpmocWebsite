import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
    
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, { 
        x: e.clientX, 
        y: e.clientY, 
        duration: 0.6, 
        ease: "power3.out" 
      });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div id="custom-cursor" ref={cursorRef}>
      <div id="cursor-dot"></div>
      <svg className="absolute w-full h-full rotate-45" viewBox="0 0 100 100">
        <line x1="50" y1="0" x2="50" y2="20" stroke="white" strokeWidth="2" />
        <line x1="50" y1="80" x2="50" y2="100" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  );
}
