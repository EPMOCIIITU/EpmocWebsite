import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Registration form state
  const [teamMode, setTeamMode] = useState('create'); // 'create' or 'join'
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events/${id}` : `http://localhost:5001/api/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Event not found');
        return res.json();
      })
      .then(data => {
        setEvent(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (event) {
      gsap.fromTo('.reveal-event', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, stagger: 0.1 }
      );
    }
  }, [event]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterStatus('PROCESSING_REGISTRATION...');
    try {
      let endpoint = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/registrations` : 'http://localhost:5001/api/registrations';
      let payload = { eventId: id };

      if (event.requiresTeam) {
        if (teamMode === 'create') {
          endpoint = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/teams` : 'http://localhost:5001/api/teams';
          payload = { eventId: id, name: teamName };
        } else {
          endpoint = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/teams/join` : 'http://localhost:5001/api/teams/join';
          payload = { inviteCode };
        }
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      if (event.requiresTeam && teamMode === 'create' && data.team?.inviteCode) {
        setRegisterStatus(`REGISTRATION_SUCCESSFUL // SHARE THIS INVITE CODE WITH YOUR TEAM: ${data.team.inviteCode}`);
      } else {
        setRegisterStatus('REGISTRATION_SUCCESSFUL // LOGGED');
      }
    } catch (err) {
      setRegisterStatus(`ERROR: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10">
        <div className="mono text-green-500 text-sm">FETCHING_EVENT_DATA...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 gap-4">
        <div className="mono text-red-500 text-sm">ERROR: {error || 'EVENT_NOT_FOUND'}</div>
        <button onClick={() => navigate(-1)} className="mono text-[10px] border border-white/20 px-4 py-2 hover:bg-white/10">RETURN_TO_BASE</button>
      </div>
    );
  }

  const isCompleted = new Date(event.date) < new Date();

  return (
    <div className="min-h-screen pt-32 pb-20 px-10 md:px-20 max-w-6xl mx-auto">
      <button onClick={() => navigate(-1)} className="mono text-[10px] opacity-50 hover:opacity-100 hover:text-green-500 transition-colors mb-10 inline-block reveal-event">
        ← BACK_TO_LOG
      </button>

      <div className="relative w-full aspect-[21/9] bg-neutral-900 mb-12 mechanical-border overflow-hidden reveal-event">
        {event.coverImage ? (
          <img src={event.coverImage.includes('drive.google.com/file/d/') ? `https://drive.google.com/uc?export=view&id=${event.coverImage.match(/d\/([a-zA-Z0-9_-]+)/)?.[1]}` : event.coverImage} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center mono text-white/20 text-xs">INVALID_IMAGE_URL</div>'; }} className="w-full h-full object-cover grayscale opacity-60" alt={event.title} />
        ) : (
          <div className="w-full h-full flex items-center justify-center mono text-white/20 text-xs">NO_COVER_IMAGE</div>
        )}
        <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-black to-transparent">
          <h1 className="heading-font text-5xl md:text-7xl text-green-500 uppercase">{event.title}</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8 reveal-event">
          <div>
            <h3 className="mono text-green-500 text-xs mb-4 underline">EVENT_DESCRIPTION</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              {event.description || 'No description provided for this event.'}
            </p>
          </div>
          
          {isCompleted ? (
            <div className="mt-12">
              <h3 className="mono text-green-500 text-xs mb-4 underline">EVENT_GALLERY</h3>
              {event.driveGalleryLink ? (
                <a href={event.driveGalleryLink} target="_blank" rel="noreferrer" className="inline-block p-4 border border-green-500/30 text-green-500 hover:bg-green-500/10 transition-colors mono text-xs">
                  ACCESS_DRIVE_ARCHIVE ↗
                </a>
              ) : (
                <div className="p-10 border border-white/10 text-center mono text-[10px] opacity-50">GALLERY_NOT_AVAILABLE</div>
              )}
            </div>
          ) : (
            <div className="mt-12 mechanical-border p-8 bg-white/5">
              <h3 className="mono text-green-500 text-xs mb-6 underline">REGISTRATION_PORTAL</h3>
              {!isAuthenticated ? (
                <div className="text-center py-6">
                  <p className="text-sm opacity-70 mb-4">You must be logged in to access the registration portal.</p>
                  <Link to="/auth" className="inline-block px-6 py-3 bg-green-500 text-black heading-font text-sm hover:bg-white transition-colors">
                    AUTHENTICATE_NOW
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-6">
                  {event.requiresTeam && (
                    <div className="space-y-4">
                      <div className="flex gap-4 mb-4">
                        <button 
                          type="button" 
                          onClick={() => setTeamMode('create')}
                          className={`mono text-[10px] px-3 py-1 border transition-colors ${teamMode === 'create' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-white/20 opacity-50 hover:opacity-100'}`}
                        >
                          CREATE_TEAM
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setTeamMode('join')}
                          className={`mono text-[10px] px-3 py-1 border transition-colors ${teamMode === 'join' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-white/20 opacity-50 hover:opacity-100'}`}
                        >
                          JOIN_TEAM
                        </button>
                      </div>

                      {teamMode === 'create' ? (
                        <div>
                          <label className="block mono text-[10px] opacity-50 mb-2">TEAM_NAME</label>
                          <input 
                            type="text" 
                            required
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full bg-transparent border-b border-white/20 p-2 mono text-sm outline-none focus:border-green-500 text-white" 
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block mono text-[10px] opacity-50 mb-2">INVITE_CODE</label>
                          <input 
                            type="text" 
                            required
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                            className="w-full bg-transparent border-b border-white/20 p-2 mono text-sm outline-none focus:border-green-500 text-white uppercase" 
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <p className="mono text-[10px] opacity-40">User ID: {event.requiresTeam ? (teamMode === 'create' ? 'Will be assigned as Team Leader' : 'Will be assigned as Team Member') : 'Registered as Individual'}</p>
                  <button type="submit" className="w-full py-4 border border-green-500 text-green-500 heading-font text-sm hover:bg-green-500 hover:text-black transition-all">
                    SUBMIT_REGISTRATION
                  </button>
                  {registerStatus && <p className="mono text-[10px] text-yellow-500 text-center mt-4">{registerStatus}</p>}
                </form>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6 reveal-event">
          <div className="mechanical-border p-6 bg-black/40">
            <h4 className="mono text-[10px] opacity-50 mb-1">DATE</h4>
            <p className="mono text-sm">{new Date(event.date).toLocaleDateString()}</p>
          </div>
          <div className="mechanical-border p-6 bg-black/40">
            <h4 className="mono text-[10px] opacity-50 mb-1">STATUS</h4>
            <p className={`mono text-sm ${isCompleted ? 'text-yellow-500' : 'text-green-500'}`}>
              {isCompleted ? 'COMPLETED' : 'UPCOMING'}
            </p>
          </div>
          <div className="mechanical-border p-6 bg-black/40">
            <h4 className="mono text-[10px] opacity-50 mb-1">VENUE</h4>
            <p className="mono text-sm uppercase">{event.venue || 'TBA'}</p>
          </div>
          <div className="mechanical-border p-6 bg-black/40">
            <h4 className="mono text-[10px] opacity-50 mb-1">FORMAT</h4>
            <p className="mono text-sm">
              {event.requiresTeam ? `TEAM (1-${event.maxTeamSize})` : 'INDIVIDUAL'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
