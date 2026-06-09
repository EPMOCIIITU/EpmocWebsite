import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Internal Dashboard Components ---

const MemberDashboard = () => (
  <>
    <div className="col-span-2 mechanical-border p-8 bg-white/5">
      <h4 className="mono text-green-500 mb-6 text-xs underline">MY_TASKS</h4>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 border border-white/10">
          <span className="mono text-xs">Draft Mridang Teaser Script</span>
          <span className="text-[10px] text-yellow-500">PENDING</span>
        </div>
      </div>
    </div>
    <div className="mechanical-border p-8 bg-green-500/10">
      <h4 className="mono text-green-500 mb-4 text-xs">ALERTS</h4>
      <p className="text-[10px] opacity-60">Meeting at 6PM in LHC Room 202.</p>
    </div>
  </>
);

const HeadDashboard = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [requiresTeam, setRequiresTeam] = useState(false);
  const [maxTeamSize, setMaxTeamSize] = useState(1);
  const [status, setStatus] = useState('');

  const handleCreate = async () => {
    setStatus('CREATING_EVENT...');
    try {
      const res = await fetch(import.meta.env.VITE_API_URL || 'http://localhost:5001/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, requiresTeam, maxTeamSize }),
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus('EVENT_CREATED_SUCCESSFULLY');
      setTitle(''); setDate('');
    } catch (err) {
      setStatus(`ERROR: ${err.message}`);
    }
  };

  return (
    <div className="col-span-3 mechanical-border p-8 bg-white/5">
      <h4 className="mono text-green-500 mb-6 text-xs underline">CREATE_NEW_EVENT</h4>
      <div className="grid md:grid-cols-2 gap-6">
        <input type="text" placeholder="EVENT_TITLE" value={title} onChange={(e)=>setTitle(e.target.value)} className="bg-transparent border border-white/10 p-3 mono text-sm outline-none focus:border-green-500" />
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="bg-transparent border border-white/10 p-3 mono text-sm outline-none focus:border-green-500 text-white" />
        <label className="flex items-center gap-3 mono text-xs opacity-70">
          <input type="checkbox" checked={requiresTeam} onChange={(e)=>setRequiresTeam(e.target.checked)} className="accent-green-500" />
          REQUIRES_TEAM
        </label>
        {requiresTeam && (
          <input type="number" placeholder="MAX_TEAM_SIZE" min="1" value={maxTeamSize} onChange={(e)=>setMaxTeamSize(e.target.value)} className="bg-transparent border border-white/10 p-3 mono text-sm outline-none focus:border-green-500 text-white" />
        )}
      </div>
      <button onClick={handleCreate} className="mt-6 w-full py-3 bg-green-500 text-black heading-font text-sm hover:bg-white transition-all">INITIALIZE_EVENT</button>
      {status && <p className="mt-4 mono text-xs text-yellow-500">{status}</p>}
    </div>
  );
};

const CoreDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [status, setStatus] = useState('LOADING_EVENTS...');

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL || 'http://localhost:5001/api/events')
      .then(res => res.json())
      .then(data => { setEvents(data); setStatus('READY'); })
      .catch(err => setStatus('ERROR_FETCHING_EVENTS'));
  }, []);

  const fetchRegistrations = async (eventId) => {
    setSelectedEventId(eventId);
    if (!eventId) return setRegistrations([]);
    
    setStatus('FETCHING_DATA...');
    try {
      const res = await fetch(`http://localhost:5001/api/registrations/${eventId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRegistrations(data);
      setStatus('DATA_RETRIEVED');
    } catch (err) {
      setStatus(`ERROR: ${err.message}`);
    }
  };

  return (
    <div className="col-span-3 mechanical-border p-8 bg-black/50">
      <h4 className="mono text-green-500 mb-4 text-xs underline">REGISTRATION_DATA_INDEX</h4>
      <div className="mb-6 flex gap-4 items-center">
        <select onChange={(e) => fetchRegistrations(e.target.value)} value={selectedEventId} className="w-64 bg-black p-3 mono text-[10px] border border-white/20 outline-none text-white">
          <option value="">SELECT_EVENT...</option>
          {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
        </select>
        <span className="mono text-[10px] text-yellow-500">{status}</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full mono text-[10px] text-left opacity-80 border-collapse">
          <thead>
            <tr className="border-b border-white/20 text-green-500">
              <th className="p-2">REG_ID</th>
              <th className="p-2">USER_EMAIL</th>
              <th className="p-2">TEAM_NAME</th>
              <th className="p-2">DATE</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center opacity-50">NO_DATA_FOUND</td></tr>
            ) : (
              registrations.map(reg => (
                <tr key={reg._id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-2">{reg._id.slice(-6)}</td>
                  <td className="p-2">{reg.userId?.email || 'N/A'}</td>
                  <td className="p-2">{reg.teamId?.name || 'INDIVIDUAL'}</td>
                  <td className="p-2">{new Date(reg.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default function CommandCenter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('member');
  const authRef = useRef(null);
  const dashRef = useRef(null);
  const dashContentRef = useRef(null);
  const sectionRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
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
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(import.meta.env.VITE_API_URL || 'http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setRole(data.role);

      gsap.to(authRef.current, { 
        opacity: 0, 
        scale: 0.9, 
        duration: 0.5, 
        onComplete: () => {
          setIsAuthenticated(true);
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && dashRef.current) {
      gsap.fromTo(dashRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
    }
  }, [isAuthenticated]);

  const switchRole = (newRole) => {
    gsap.to(dashContentRef.current, { 
      opacity: 0, 
      y: 10, 
      duration: 0.3, 
      onComplete: () => {
        setRole(newRole);
        gsap.to(dashContentRef.current, { opacity: 1, y: 0, duration: 0.5 });
      }
    });
  };

  const renderDashboard = () => {
    switch(role) {
      case 'core': return <CoreDashboard />;
      case 'head': return <HeadDashboard />;
      default: return <MemberDashboard />;
    }
  };

  return (
    <section id="command" ref={sectionRef} className="min-h-screen p-10 md:p-20 flex flex-col items-center">
      {!isAuthenticated ? (
        <div id="auth-ui" ref={authRef} className="w-full max-w-lg mechanical-border p-10 bg-white/5 reveal">
          <h2 className="heading-font text-3xl mb-10 text-center">Command Access</h2>
          {error && <p className="text-red-500 mono text-xs mb-4 text-center">{error}</p>}
          <div className="space-y-6">
            <input 
              type="text" 
              placeholder="EMAIL" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-white/10 p-3 mono text-sm outline-none focus:border-green-500 text-white" 
            />
            <input 
              type="password" 
              placeholder="ACCESS_KEY" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-white/10 p-3 mono text-sm outline-none focus:border-green-500 text-white" 
            />
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="w-full py-4 border border-green-500 text-green-500 heading-font text-sm hover:bg-green-500 hover:text-black transition-all disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'INITIALIZE_SESSION'}
            </button>
          </div>
        </div>
      ) : (
        <div id="dashboard-ui" ref={dashRef} className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="heading-font text-5xl">COMMAND.CENTER</h2>
            <div className="flex gap-2">
              <button onClick={() => switchRole('member')} className={`dash-tab px-4 py-2 mono text-[10px] border border-white/20 ${role === 'member' ? 'active' : ''}`}>MEMBER</button>
              <button onClick={() => switchRole('head')} className={`dash-tab px-4 py-2 mono text-[10px] border border-white/20 ${role === 'head' ? 'active' : ''}`}>HEAD</button>
              <button onClick={() => switchRole('core')} className={`dash-tab px-4 py-2 mono text-[10px] border border-white/20 ${role === 'core' ? 'active' : ''}`}>CORE</button>
            </div>
          </div>
          <div id="dash-content" ref={dashContentRef} className="grid md:grid-cols-3 gap-8">
            {renderDashboard()}
          </div>
        </div>
      )}
    </section>
  );
}
