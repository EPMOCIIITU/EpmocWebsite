import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const sectionRef = useRef(null);

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

  return (
    <section id="events" ref={sectionRef} className="p-10 md:p-20">
      <h2 className="heading-font text-5xl mb-12 reveal">EVENTS.LOG</h2>
      <div className="space-y-6">
        <div className="mechanical-border p-10 bg-white/5 flex flex-col md:flex-row gap-8 reveal">
          <div className="w-full md:w-1/3 aspect-video bg-neutral-900 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1459749411177-042180ce333b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt="MRIDANG 24" />
          </div>
          <div className="flex-1">
            <h3 className="heading-font text-4xl text-green-500">MRIDANG '24</h3>
            <p className="mono text-xs opacity-50 mt-2 mb-6">CATEGORY: CULTURAL_FEST // STATUS: COMPLETED</p>
            <p className="text-sm opacity-70 leading-relaxed mb-6">The heartbeat of IIIT Una. A fusion of tradition and modernity across 3 days of competitions, celebrity nights, and cultural showcases.</p>
            <div className="flex gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
              <span className="mono text-[10px] border border-white/20 px-2 py-1">REDBULL</span>
              <span className="mono text-[10px] border border-white/20 px-2 py-1">SBI_UNA</span>
            </div>
          </div>
        </div>
        <div className="mechanical-border p-10 bg-white/5 flex flex-col md:flex-row gap-8 reveal">
          <div className="w-full md:w-1/3 aspect-video bg-neutral-900 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt="NO SCOPE" />
          </div>
          <div className="flex-1">
            <h3 className="heading-font text-4xl text-green-500">NO SCOPE</h3>
            <p className="mono text-xs opacity-50 mt-2 mb-6">CATEGORY: E-SPORTS // STATUS: UPCOMING</p>
            <p className="text-sm opacity-70 leading-relaxed mb-6">Unleashing digital mayhem. The premier inter-college gaming tournament for Valorant, BGMI, and CS:GO.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
