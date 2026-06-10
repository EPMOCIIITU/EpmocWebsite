import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

export default function EventCreatePage() {
  const { isAuthenticated, role, loading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [requiresTeam, setRequiresTeam] = useState(false);
  const [maxTeamSize, setMaxTeamSize] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== 'core')) {
      navigate('/command', { replace: true });
    }
  }, [isAuthenticated, role, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated && role === 'core') {
      gsap.fromTo('.reveal-dash', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [isAuthenticated, role]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setStatus('CREATING_EVENT...');
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events` : 'http://localhost:5001/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, venue, description, coverImage, requiresTeam, maxTeamSize }),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setStatus('EVENT_CREATED_SUCCESSFULLY');
      setTimeout(() => navigate('/command'), 1500);
    } catch (err) {
      setStatus(`ERROR: ${err.message}`);
    }
  };

  if (loading || !isAuthenticated || role !== 'core') return null;

  return (
    <section className="min-h-screen pt-32 pb-20 px-10 md:px-20 flex flex-col items-center">
      <div className="w-full max-w-4xl reveal-dash">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/20 pb-6">
          <div>
            <h2 className="heading-font text-5xl text-white">EVENT.CREATION</h2>
            <p className="mono text-xs opacity-50 mt-2">CORE_OVERRIDE // INITIALIZE_NEW_DIRECTIVE</p>
          </div>
          <button onClick={() => navigate('/command')} className="mt-4 md:mt-0 mono text-[10px] px-4 py-2 border border-white/20 hover:bg-white/10 transition-colors">
            &lt; RETURN_TO_COMMAND_CENTER
          </button>
        </div>

        <div className="mechanical-border p-8 bg-green-900/10 border-green-500/30">
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block mono text-[10px] opacity-50 mb-2">EVENT_TITLE</label>
              <input type="text" required value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full bg-transparent border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white" />
            </div>
            
            <div>
              <label className="block mono text-[10px] opacity-50 mb-2">DATE</label>
              <input type="date" required value={date} onChange={(e)=>setDate(e.target.value)} className="w-full bg-transparent border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white" />
            </div>

            <div>
              <label className="block mono text-[10px] opacity-50 mb-2">VENUE</label>
              <input type="text" required value={venue} onChange={(e)=>setVenue(e.target.value)} className="w-full bg-transparent border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white" />
            </div>

            <div className="md:col-span-2">
              <label className="block mono text-[10px] opacity-50 mb-2">COVER_IMAGE_URL</label>
              <input type="url" placeholder="https://" value={coverImage} onChange={(e)=>setCoverImage(e.target.value)} className="w-full bg-transparent border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white" />
            </div>

            <div className="md:col-span-2">
              <label className="block mono text-[10px] opacity-50 mb-2">DESCRIPTION</label>
              <textarea required value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full bg-transparent border border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white min-h-[100px]" />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="reqTeam" checked={requiresTeam} onChange={(e)=>setRequiresTeam(e.target.checked)} className="accent-green-500 w-4 h-4" />
              <label htmlFor="reqTeam" className="mono text-[10px] opacity-70 cursor-pointer">REQUIRES_TEAM_REGISTRATION</label>
            </div>

            {requiresTeam && (
              <div>
                <label className="block mono text-[10px] opacity-50 mb-2">MAX_TEAM_SIZE</label>
                <input type="number" min="1" required value={maxTeamSize} onChange={(e)=>setMaxTeamSize(e.target.value)} className="w-full bg-transparent border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white" />
              </div>
            )}

            <div className="md:col-span-2 mt-4">
              <button type="submit" className="w-full py-4 bg-green-500 text-black heading-font text-sm hover:bg-white transition-all">TRANSMIT_NEW_DIRECTIVE</button>
            </div>
            
            {status && (
              <div className="md:col-span-2 text-center mt-2">
                <span className={`mono text-xs ${status.includes('ERROR') ? 'text-red-500' : 'text-green-500'}`}>{status}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
