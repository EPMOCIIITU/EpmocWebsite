import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function PageTransition({ children }) {
  const containerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Small delay to allow react-router to paint before animating
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Very smooth, slightly longer blur and fade entry
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 15, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
