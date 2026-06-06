import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const heroTextRef = useRef(null);

  useEffect(() => {
    const heroText = heroTextRef.current;
    if (!heroText) return;

    const chars = heroText.querySelectorAll('.char');

    const initializeHeroTextColors = () => {
      chars.forEach((char, index) => {
        if (index <= 7 || index >= 12) gsap.set(char, { color: '#00ff41' });
        else gsap.set(char, { color: '#f5f5f5' });
      });
    };

    initializeHeroTextColors();

    const handleMouseMove = (e) => {
      const rect = heroText.getBoundingClientRect(); 
      const mouseX = e.clientX - rect.left;
      
      chars.forEach((char) => {
        const charRect = char.getBoundingClientRect(); 
        const charMidX = (charRect.left + charRect.right) / 2 - rect.left;
        
        if (mouseX > charMidX) {
          gsap.to(char, { y: -10, scaleY: 1.2, skewX: 10, color: '#00ff41', duration: 0.3 });
        } else {
          gsap.to(char, { y: 0, scaleY: 1, skewX: 0, color: '#f5f5f5', duration: 0.3 });
        }
      });
    };

    const handleMouseLeave = () => {
      gsap.to(chars, { y: 0, scaleY: 1, skewX: 0, color: '#f5f5f5', duration: 0.8, stagger: 0.02 });
      setTimeout(initializeHeroTextColors, 1000);
    };

    heroText.addEventListener('mousemove', handleMouseMove);
    heroText.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      heroText.removeEventListener('mousemove', handleMouseMove);
      heroText.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const text1 = "Together";
  const text2 = "We Manage";
  
  return (
    <section className="h-screen flex flex-col justify-center px-10 md:px-20">
      <div className="text-xs mb-4 opacity-50 uppercase tracking-[0.5em]">[ INITIALIZING SESSION... ]</div>
      <h1 id="hero-text" ref={heroTextRef} className="heading-font text-7xl md:text-[10vw] leading-[0.9] cursor-default">
        <div>
          {Array.from(text1).map((char, i) => (
            <span key={`t1-${i}`} className="char">{char === ' ' ? '\u00A0' : char}</span>
          ))}
        </div>
        <div>
          {Array.from(" " + text2).map((char, i) => (
            <span key={`t2-${i}`} className="char">{char === ' ' ? '\u00A0' : char}</span>
          ))}
        </div>
      </h1>
      <div className="mt-10 flex gap-10 items-center">
        <div className="w-20 h-[1px] bg-white opacity-20"></div>
        <p className="max-w-md text-sm opacity-60 leading-relaxed uppercase">
          Event Planning, Management & Organising Council. <br />
          <span className="text-green-500">Status: Operational // IIIT UNA</span>
        </p>
      </div>
    </section>
  );
}
