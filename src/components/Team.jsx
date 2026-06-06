import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Team() {
  const sectionRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach(el => {
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: "top 90%" },
          opacity: 1,
          y: 0,
          duration: 1
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleFilter = (newFilter) => {
    setFilter(newFilter);
    const cards = gridRef.current.querySelectorAll('.team-card');
    gsap.to(cards, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      onComplete: () => {
        cards.forEach(c => {
          c.style.display = (newFilter === 'all' || c.classList.contains(newFilter)) ? 'block' : 'none';
        });
        gsap.to(cards, { opacity: 1, scale: 1, duration: 0.5 });
      }
    });
  };

  return (
    <section id="team" ref={sectionRef} className="p-10 md:p-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 reveal">
        <h2 className="heading-font text-5xl">PERSONNEL.DIRECTORY</h2>
        <div className="flex gap-4 mono text-[10px]">
          <button 
            className={`filter-btn ${filter === 'all' ? 'text-green-500 underline' : 'opacity-50'}`} 
            onClick={() => handleFilter('all')}
          >
            ALL
          </button>
          <button 
            className={`filter-btn ${filter === 'heads' ? 'text-green-500 underline' : 'opacity-50'}`} 
            onClick={() => handleFilter('heads')}
          >
            HEADS
          </button>
          <button 
            className={`filter-btn ${filter === 'core' ? 'text-green-500 underline' : 'opacity-50'}`} 
            onClick={() => handleFilter('core')}
          >
            CORE
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6" id="team-grid" ref={gridRef}>
        <div className="team-card mechanical-border p-4 bg-white/5 group reveal heads">
          <div className="scanline"></div>
          <div className="aspect-[3/4] bg-neutral-800 mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Aryan Verma" />
          </div>
          <h4 className="heading-font text-lg text-green-500">Aryan Verma</h4>
          <p className="mono text-[10px] opacity-50">General Secretary</p>
        </div>
        <div className="team-card mechanical-border p-4 bg-white/5 group reveal heads">
          <div className="scanline"></div>
          <div className="aspect-[3/4] bg-neutral-800 mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Ishita Gupta" />
          </div>
          <h4 className="heading-font text-lg text-green-500">Ishita Gupta</h4>
          <p className="mono text-[10px] opacity-50">Design Head</p>
        </div>
        <div className="team-card mechanical-border p-4 bg-white/5 group reveal core">
          <div className="scanline"></div>
          <div className="aspect-[3/4] bg-neutral-800 mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Rahul Singh" />
          </div>
          <h4 className="heading-font text-lg text-green-500">Rahul Singh</h4>
          <p className="mono text-[10px] opacity-50">Logistics Lead</p>
        </div>
        <div className="team-card mechanical-border p-4 bg-white/5 group reveal core">
          <div className="scanline"></div>
          <div className="aspect-[3/4] bg-neutral-800 mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Sanya Negi" />
          </div>
          <h4 className="heading-font text-lg text-green-500">Sanya Negi</h4>
          <p className="mono text-[10px] opacity-50">PR & Media</p>
        </div>
      </div>
    </section>
  );
}
