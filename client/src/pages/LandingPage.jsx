import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

import Hero from '../components/Hero';
import About from '../components/About';
import Archive from '../components/Archive';
import Events from '../components/Events';
import Team from '../components/Team';
import Footer from '../components/Footer';

export default function LandingPage() {
  const { hash } = useLocation();

  useEffect(() => {
    const lenis = new Lenis();
    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          lenis.scrollTo(element, { offset: 0 });
        }
      }, 500);
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [hash]);

  return (
    <main className="relative z-10">
      <Hero />
      <About />
      <Events />
      <Archive />
      <Team />
      <Footer />
    </main>
  );
}
