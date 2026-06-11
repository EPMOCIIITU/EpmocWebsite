import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events` : 'http://localhost:5001/api/events');
        const data = await res.json();
        
        // Extract all driveGalleryLinks from past events
        const galleryLinks = data
          .filter(ev => new Date(ev.date) < new Date() && ev.driveGalleryLink)
          .map(ev => ev.driveGalleryLink);
          
        setPhotos(galleryLinks);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
        setLoading(false);
      }
    };
    
    fetchGallery();
  }, []);

  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Stagger reveal animation for images
    const ctx = gsap.context(() => {
      gsap.fromTo('.gallery-item', 
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );
    }, containerRef);

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, [loading, photos]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-20" ref={containerRef}>
      <header className="mb-16">
        <h1 className="heading-font text-5xl md:text-7xl mb-4">MEDIA.VAULT</h1>
        <div className="flex items-center gap-4">
          <div className="h-[1px] bg-green-500 w-12"></div>
          <p className="mono text-xs opacity-50 tracking-widest">ARCHIVED_VISUAL_DATA</p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="mono text-green-500 animate-pulse">DECRYPTING_MEDIA...</div>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="mono text-yellow-500">NO_MEDIA_FOUND</div>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((link, idx) => (
            <div key={idx} className="gallery-item break-inside-avoid mechanical-border p-2 bg-white/5 relative group cursor-crosshair">
              <div className="scanline"></div>
              <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none mix-blend-overlay"></div>
              <img 
                src={link.includes('drive.google.com/file/d/') ? `https://lh3.googleusercontent.com/d/${link.match(/d\/([a-zA-Z0-9_-]+)/)?.[1]}` : link} 
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.style.display = 'none'; 
                  e.target.parentNode.innerHTML = '<div class="w-full aspect-video flex items-center justify-center mono text-white/20 text-xs">INVALID_IMAGE_URL</div>'; 
                }} 
                className="w-full h-auto object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                alt={`Archive media ${idx}`} 
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
