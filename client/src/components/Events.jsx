import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const sectionRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real events from backend
    fetch(import.meta.env.VITE_API_URL || 'http://localhost:5001/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || events.length === 0) return;
    
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach(el => {
        gsap.fromTo(el, 
          { opacity: 0, y: 50 },
          {
            scrollTrigger: { trigger: el, start: "top 90%" },
            opacity: 1,
            y: 0,
            duration: 1
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, events]);

  return (
    <section id="events" ref={sectionRef} className="p-10 md:p-20">
      <h2 className="heading-font text-5xl mb-12 reveal">EVENTS.LOG</h2>
      
      {loading ? (
        <div className="mono text-green-500 text-sm">FETCHING_DATA...</div>
      ) : events.length === 0 ? (
        <div className="mono text-yellow-500 text-sm">NO_EVENTS_FOUND_IN_DATABASE</div>
      ) : (
        <div className="space-y-6">
          {events.map((event, index) => (
            <Link to={`/events/${event._id || index}`} key={event._id || index} className="block group cursor-none">
              <div className="mechanical-border p-10 bg-white/5 flex flex-col md:flex-row gap-8 reveal group-hover:bg-white/10 transition-colors">
                <div className="w-full md:w-1/3 aspect-video bg-neutral-900 overflow-hidden flex items-center justify-center">
                  {event.coverImage ? (
                    <img src={event.coverImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={event.title} />
                  ) : (
                    <span className="mono text-white/20 text-xs">NO_IMAGE_DATA</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="heading-font text-4xl text-green-500 uppercase">{event.title}</h3>
                    <p className="mono text-xs opacity-50 mt-2 mb-6">
                      DATE: {new Date(event.date).toLocaleDateString()} // STATUS: {new Date(event.date) < new Date() ? 'COMPLETED' : 'UPCOMING'}
                    </p>
                    <p className="text-sm opacity-70 leading-relaxed mb-6">
                      {event.requiresTeam 
                        ? `TEAM EVENT (Max Size: ${event.maxTeamSize})` 
                        : 'INDIVIDUAL EVENT'}
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex gap-4 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                      <span className="mono text-[10px] border border-white/20 px-2 py-1">EPMOC_VERIFIED</span>
                    </div>
                    <span className="mono text-[10px] text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">VIEW_DETAILS →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
