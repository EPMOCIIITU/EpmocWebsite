import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

import Hero from '../components/Hero';
import About from '../components/About';
import Archive from '../components/Archive';
import Events from '../components/Events';
import Team from '../components/Team';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function LandingPage() {
  const { hash } = useLocation();

  useEffect(() => {
    const lenis = new Lenis();
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    // If there is a hash in the URL on load (e.g. from clicking a nav link on another page), scroll to it
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          lenis.scrollTo(element, { offset: 0 });
        }
      }, 500); // Wait a moment for GSAP to set up
    }

    return () => {
      lenis.destroy();
    };
  }, [hash]);

  return (
    <main className="relative z-10">
      <Hero />
      <About />
      <Archive />
      <Events />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
