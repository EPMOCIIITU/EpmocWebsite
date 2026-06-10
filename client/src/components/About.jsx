import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
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

      const statCounters = sectionRef.current.querySelectorAll('.stat-counter');
      statCounters.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        ScrollTrigger.create({
          trigger: stat,
          start: "top 95%",
          onEnter: () => {
            gsap.to(stat, { innerText: target, duration: 2, snap: { innerText: 1 } });
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 md:py-32 px-10 md:px-20 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="heading-font text-5xl mb-12 reveal">EPMOC.SYSTEM_OVERVIEW</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="mechanical-border p-8 bg-white/5 reveal">
            <div className="text-4xl heading-font text-green-500 mb-2 stat-counter" data-target="28">0</div>
            <div className="mono text-[10px] opacity-50 uppercase">Events Synchronized</div>
            <p className="mt-4 text-xs opacity-70">Managing the logistical backbone of IIIT Una's flagship fests.</p>
          </div>
          <div className="mechanical-border p-8 bg-white/5 reveal">
            <div className="text-4xl heading-font text-green-500 mb-2 stat-counter" data-target="180">0</div>
            <div className="mono text-[10px] opacity-50 uppercase">Active Nodes (Members)</div>
            <p className="mt-4 text-xs opacity-70">A diverse network of planners, creators, and executors.</p>
          </div>
          <div className="mechanical-border p-8 bg-white/5 reveal">
            <div className="text-4xl heading-font text-green-500 mb-2 stat-counter" data-target="100">0</div>
            <div className="mono text-[10px] opacity-50 uppercase">% Precision Rate</div>
            <p className="mt-4 text-xs opacity-70">Zero downtime in event coordination and execution.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
