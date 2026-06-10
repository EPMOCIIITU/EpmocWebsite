import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

// --- Widgets ---

const EventsWidget = () => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events` : 'http://localhost:5001/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="col-span-full md:col-span-1 mechanical-border p-8 bg-white/5 reveal-dash">
      <h4 className="mono text-green-500 mb-6 text-xs underline">EVENT_DIRECTIVES</h4>
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="mono text-[10px] opacity-50">NO_DATA_AVAILABLE</p>
        ) : (
          events.map(ev => (
            <Link to={`/events/${ev._id}`} key={ev._id} className="block border border-white/10 p-3 hover:bg-white/5 transition-colors">
              <span className="mono text-xs block text-green-500 mb-1">{ev.title}</span>
              <span className="text-[10px] mono opacity-50 block">STATUS: {new Date(ev.date) < new Date() ? 'COMPLETED' : 'UPCOMING'}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

const TasksWidget = ({ role }) => {
  return (
    <div className="col-span-full md:col-span-2 mechanical-border p-8 bg-white/5 reveal-dash relative flex flex-col justify-center items-center group hover:bg-white/10 transition-colors cursor-pointer" onClick={() => window.location.href = '/command/tasks'}>
      <h4 className="heading-font text-3xl text-green-500 mb-2">TASK_CONTROL</h4>
      <p className="mono text-[10px] opacity-70 mb-6 text-center">ACCESS_AND_ASSIGN_PERSONNEL_DIRECTIVES</p>
      <button className="mono text-xs px-6 py-2 border border-green-500 text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
        ENTER_PORTAL &gt;
      </button>
    </div>
  );
};

const RoleManagementWidget = ({ role }) => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('LOADING_USERS...');

  const fetchUsers = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : 'http://localhost:5001/api/users', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data);
      setStatus('READY');
    } catch (err) {
      setStatus(`ERROR: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users/${userId}/role` : `http://localhost:5001/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
        credentials: 'include'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      fetchUsers();
    } catch (err) {
      alert(`Role change failed: ${err.message}`);
    }
  };

  return (
    <div className="col-span-full mechanical-border p-8 bg-white/5 reveal-dash">
      <h4 className="mono text-green-500 mb-6 text-xs underline">ROLE_MANAGEMENT_INDEX</h4>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {status !== 'READY' ? (
          <p className="mono text-[10px] text-yellow-500">{status}</p>
        ) : users.length === 0 ? (
          <p className="mono text-[10px] opacity-50">NO_USERS_FOUND</p>
        ) : (
          users.map(user => (
            <div key={user._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-colors">
              <span className="mono text-xs mb-2 md:mb-0">{user.email}</span>
              <div className="flex items-center gap-4">
                <span className={`mono text-[10px] uppercase ${user.role === 'core' ? 'text-green-500' : 'opacity-70'}`}>CURRENT: {user.role}</span>
                <select 
                  onChange={(e) => handleRoleChange(user._id, e.target.value)} 
                  value={user.role}
                  className="bg-black p-2 mono text-[10px] border border-white/20 outline-none focus:border-green-500 text-white"
                >
                  <option value="participant">PARTICIPANT</option>
                  <option value="member">MEMBER</option>
                  {role === 'core' && <option value="head">HEAD</option>}
                  {role === 'core' && <option value="core">CORE</option>}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const RegistrationsWidget = () => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events` : 'http://localhost:5001/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="col-span-full mechanical-border p-8 bg-black/50 reveal-dash relative">
      <h4 className="mono text-green-500 mb-6 text-xs underline">EVENT_DATA_INDEX</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(ev => (
          <Link key={ev._id} to={`/command/events/${ev._id}/manage`} className="block border border-white/10 p-4 hover:bg-white/5 transition-colors group">
            <span className="mono text-xs block text-white mb-2">{ev.title}</span>
            <div className="flex justify-between items-center">
              <span className="text-[10px] mono opacity-50 block">{new Date(ev.date).toLocaleDateString()}</span>
              <span className="text-[10px] mono text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">MANAGE_EVENT &gt;</span>
            </div>
          </Link>
        ))}
        {events.length === 0 && <p className="mono text-[10px] opacity-50 p-4">NO_EVENTS_FOUND</p>}
      </div>
    </div>
  );
};

const EventCreationWidget = () => {
  return (
    <div className="col-span-full mechanical-border p-8 bg-green-900/10 border-green-500/30 reveal-dash relative flex flex-col justify-center items-center group hover:bg-green-500/20 transition-colors cursor-pointer" onClick={() => window.location.href = '/command/events/new'}>
      <h4 className="heading-font text-3xl text-green-500 mb-2">INITIALIZE_DIRECTIVE</h4>
      <p className="mono text-[10px] opacity-70 mb-6 text-center text-green-500">CORE_OVERRIDE: CREATE_NEW_EVENT</p>
      <button className="mono text-xs px-6 py-2 border border-green-500 text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
        OPEN_CREATION_MATRIX &gt;
      </button>
    </div>
  );
};

export default function CommandCenter() {
  const { isAuthenticated, role, loading, user } = useAuth();
  const dashRef = useRef(null);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated && dashRef.current) {
      gsap.fromTo('.reveal-dash', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [isAuthenticated]);

  if (loading || !isAuthenticated) return null;

  return (
    <section id="command" ref={sectionRef} className="min-h-screen pt-32 pb-20 px-10 md:px-20 flex flex-col items-center">
      <div id="dashboard-ui" ref={dashRef} className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/20 pb-6">
          <div>
            <h2 className="heading-font text-5xl text-white">COMMAND.CENTER</h2>
            <p className="mono text-xs opacity-50 mt-2">LOGGED_IN_AS: {user?.email} // ROLE: <span className="text-green-500 uppercase">{role}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Participant Level (Level 1) */}
          <EventsWidget />

          {/* Member Level (Level 2) */}
          {(role === 'member' || role === 'head' || role === 'core') && (
            <TasksWidget role={role} />
          )}

          {/* Head Level (Level 3) */}
          {(role === 'head' || role === 'core') && (
            <>
              <RoleManagementWidget role={role} />
              <RegistrationsWidget />
            </>
          )}

          {/* Core Level (Level 4) */}
          {role === 'core' && (
            <EventCreationWidget />
          )}

        </div>
      </div>
    </section>
  );
}
