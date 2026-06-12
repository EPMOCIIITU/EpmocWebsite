import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Chirag Jain",
    role: "President",
    category: "core", // 'heads' or 'core'
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    name: "Tarsem Gulab",
    role: "Vice President",
    category: "core",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    name: "Pushpraj Dubey",
    role: "Treasurer",
    category: "core",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 4,
    name: "Pulkit Sujaan",
    role: "General Secretary",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 5,
    name: "Ujjaldeep Singh",
    role: "Joint Secretary",
    category: "head",
    image: "https://drive.google.com/file/d/1Wbi_b7kzFbWSYn5ksIGz84qWj_KRGNVD/view?usp=sharing"
  },
  {
    id: 6,
    name: "Rahul Meena",
    role: "Joint Secretary",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 7,
    name: "Shristi",
    role: "Core Advisor",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 8,
    name: "Arvind",
    role: "Core Advisor",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 9,
    name: "Shourya Seth",
    role: "Public Relations",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 10,
    name: "Tanu Singh",
    role: "Design",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 11,
    name: "Ankush Sharma",
    role: "Social Media",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 12,
    name: "Kapil Singh",
    role: "Volunteering",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 13,
    name: "Riyansh Raj",
    role: "Content",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 14,
    name: "Daksh Kumar",
    role: "Coverage",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 15,
    name: "Shray Chaudhary",
    role: "Video Editing",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 16,
    name: "Sujal Budhiraja",
    role: "Decoration",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 17,
    name: "Rahul Chadak",
    role: "PS and Marketing",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 18,
    name: "Aditya Pandey",
    role: "PS and Marketing",
    category: "head",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  }
];

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
            className={`filter-btn ${filter === 'head' ? 'text-green-500 underline' : 'opacity-50'}`}
            onClick={() => handleFilter('head')}
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
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" id="team-grid" ref={gridRef}>
        {TEAM_MEMBERS.map((member) => (
          <div key={member.id} className={`team-card mechanical-border p-4 bg-white/5 group reveal ${member.category} flex-none w-[calc(50%-0.75rem)] md:w-[calc(20%-1.2rem)] snap-start`}>
            <div className="scanline"></div>
            <div className="aspect-[3/4] bg-neutral-800 mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all relative">
              <img
                src={member.image?.includes('drive.google.com/file/d/') ? `https://lh3.googleusercontent.com/d/${member.image.match(/d\/([a-zA-Z0-9_-]+)/)?.[1]}` : member.image}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center mono text-white/20 text-[10px] text-center p-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>NO_IMAGE</div>';
                }}
                className="w-full h-full object-cover"
                alt={member.name}
              />
            </div>
            <h4 className="heading-font text-lg text-green-500 uppercase">{member.name}</h4>
            <p className="mono text-[10px] opacity-50 uppercase">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
