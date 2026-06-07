import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Archive() {
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
    <section id="archive" ref={sectionRef} className="p-10 md:p-20 bg-black/40">
      <h2 className="heading-font text-5xl mb-12 reveal">ARCHIVE.GALLERY</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="relative aspect-square mechanical-border overflow-hidden group reveal">
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="MRIDANG_MAIN_STAGE" />
            <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-2 left-2 mono text-[8px] bg-black p-1">LOG: MRIDANG_MAIN_STAGE</div>
        </div>
        <div className="relative aspect-square mechanical-border overflow-hidden group reveal">
            <img src="https://images.unsplash.com/photo-1514525253344-99a429996593?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="PRO_NIGHT_23" />
            <div className="absolute bottom-2 left-2 mono text-[8px] bg-black p-1">LOG: PRO_NIGHT_23</div>
        </div>
        <div className="relative aspect-square mechanical-border overflow-hidden group reveal">
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="OPEN_MIC_AAWAAZ" />
            <div className="absolute bottom-2 left-2 mono text-[8px] bg-black p-1">LOG: OPEN_MIC_AAWAAZ</div>
        </div>
        <div className="relative aspect-square mechanical-border overflow-hidden group reveal">
            <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="BATTLE_OF_BANDS" />
            <div className="absolute bottom-2 left-2 mono text-[8px] bg-black p-1">LOG: BATTLE_OF_BANDS</div>
        </div>
      </div>
    </section>
  );
}
