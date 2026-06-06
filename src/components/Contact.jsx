import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
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
    <section id="contact" ref={sectionRef} className="p-10 md:p-20 border-t border-white/10">
      <div className="grid md:grid-cols-2 gap-20">
        <div className="reveal">
          <h2 className="heading-font text-5xl mb-8">CONTACT.PROTOCOL</h2>
          <p className="mono text-xs opacity-60 leading-loose">IIIT UNA, SALOH, HP 177209<br/>EMAIL: EPMOC@IIITU.AC.IN</p>
        </div>
        <div className="mechanical-border p-10 bg-white/5 reveal">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="SENDER_ID" className="w-full bg-transparent border-b border-white/10 p-3 mono text-xs outline-none focus:border-green-500" />
            <textarea placeholder="MESSAGE_DATA" className="w-full bg-transparent border-b border-white/10 p-3 mono text-xs outline-none focus:border-green-500"></textarea>
            <button className="px-8 py-4 border border-green-500 text-green-500 heading-font text-xs hover:bg-green-500 hover:text-black">TRANSMIT</button>
          </form>
        </div>
      </div>
    </section>
  );
}
