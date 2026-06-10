import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';

export default function ArchivePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events` : 'http://localhost:5001/api/events');
        const data = await res.json();
        
        // Filter events that have already happened AND have a drive link
        const pastEvents = data.filter(ev => new Date(ev.date) < new Date() && ev.driveGalleryLink);
        setEvents(pastEvents);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch archive:', err);
        setLoading(false);
      }
    };
    
    fetchArchive();
  }, []);

  useEffect(() => {
    // Setup smooth scrolling
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo('.archive-item', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading, events]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-10 md:px-20 relative z-10" ref={containerRef}>
      <h1 className="heading-font text-5xl md:text-7xl mb-4 text-white">EVENT.ARCHIVE</h1>
      <p className="mono text-xs opacity-50 mb-16 max-w-lg leading-relaxed">
        HISTORICAL_DATA_LOGS. ACCESSING PREVIOUS EVENT RECORDS, MEDIA FILES, AND DOCUMENTATION via GOOGLE_DRIVE INTEGRATION.
      </p>

      {loading ? (
        <div className="mono text-green-500 text-xs">LOADING_ARCHIVES...</div>
      ) : events.length === 0 ? (
        <div className="mono text-white/50 text-xs">NO_HISTORICAL_RECORDS_FOUND</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((ev) => (
            <a 
              key={ev._id} 
              href={ev.driveGalleryLink} 
              target="_blank" 
              rel="noreferrer"
              className="archive-item group block relative aspect-square mechanical-border overflow-hidden bg-white/5 hover:bg-white/10 transition-colors"
            >
              {ev.coverImage ? (
                <img 
                  src={ev.coverImage} 
                  alt={ev.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" 
                />
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center opacity-30 group-hover:opacity-80 transition-opacity">
                   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                   <span className="mono text-[10px] mt-4">NO_IMAGE_DATA</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100"></div>
              
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                <span className="heading-font text-xl text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">{ev.title}</span>
                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity delay-75">
                  <span className="mono text-[9px] text-green-500">{new Date(ev.date).toLocaleDateString()}</span>
                  <span className="mono text-[9px] text-white flex items-center gap-1">
                    ACCESS_DRIVE 
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
