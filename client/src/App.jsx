import { useEffect, useState } from 'react';
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

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      
      <div className="noise fixed inset-0"></div>
      <Cursor />
      <GridBackground />
      
      <Navbar />

      <div id="main-content" style={{ opacity: loading ? 0 : 1, transition: 'opacity 1.5s ease' }}>
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
      </div>
    </>
  )
}

export default App;
