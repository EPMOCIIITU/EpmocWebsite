import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

import Loader from './components/Loader';
import Cursor from './components/Cursor';
import GridBackground from './components/GridBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Archive from './components/Archive';
import Events from './components/Events';
import Team from './components/Team';
import CommandCenter from './components/CommandCenter';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lastPlayed = localStorage.getItem('loader_last_played');
    const now = Date.now();
    const twelveHours = 12 * 60 * 60 * 1000;

    if (!lastPlayed || (now - parseInt(lastPlayed, 10) > twelveHours)) {
      setLoading(true);
      localStorage.setItem('loader_last_played', now.toString());
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis();
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const tempFullPage = (
    <main className="relative z-10">
      <Hero />
      <About />
      <Archive />
      <Events />
      <Team />
      <CommandCenter />
      <Contact />
      <Footer />
    </main>
  );

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      
      <div className="noise fixed inset-0"></div>
      <Cursor />
      <GridBackground />
      
      <Navbar />

      <div id="main-content" style={{ opacity: loading ? 0 : 1, transition: 'opacity 1.5s ease' }}>
        <Routes>
          <Route path="/" element={tempFullPage} />
          {/* Temporary fallbacks to prevent breaking before Phase 4+ */}
          <Route path="/archive" element={tempFullPage} />
          <Route path="/events/:id" element={tempFullPage} />
          <Route path="/auth" element={tempFullPage} />
          <Route path="/command" element={tempFullPage} />
        </Routes>
      </div>
    </>
  )
}

export default App;
