import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

// --- Widgets ---

const EventsWidget = ({ layout = 'full' }) => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events` : 'http://localhost:5001/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className={`${layout === 'compact' ? 'col-span-full md:col-span-1' : 'col-span-full'} mechanical-border p-8 bg-white/5 reveal-dash`}>
      <h4 className="mono text-green-500 mb-6 text-xs underline">EVENT_DIRECTIVES</h4>
      <div className={layout === 'compact' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
        {events.length === 0 ? (
          <p className="mono text-[10px] opacity-50 p-3">NO_DATA_AVAILABLE</p>
        ) : (
          events.map(ev => (
            <Link to={`/events/${ev._id}`} key={ev._id} className="block border border-white/10 p-4 hover:bg-white/5 transition-colors">
              <span className="mono text-xs block text-green-500 mb-1">{ev.title}</span>
              <span className="text-[10px] mono opacity-50 block">STATUS: {new Date(ev.date) < new Date() ? 'COMPLETED' : 'UPCOMING'}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

const TasksWidget = ({ role, navigate }) => {
  return (
    <div className="col-span-full md:col-span-2 mechanical-border p-8 bg-white/5 reveal-dash relative flex flex-col justify-center items-center group hover:bg-white/10 transition-colors cursor-pointer" onClick={() => navigate('/command/tasks')}>
      <h4 className="heading-font text-3xl text-green-500 mb-2">TASK_CONTROL</h4>
      <p className="mono text-[10px] opacity-70 mb-6 text-center">ACCESS_AND_ASSIGN_PERSONNEL_DIRECTIVES</p>
      <button className="mono text-xs px-6 py-2 border border-green-500 text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
        ENTER_PORTAL &gt;
      </button>
    </div>
  );
};

const RoleManagementLinkWidget = ({ navigate }) => {
  return (
    <div className="col-span-full mechanical-border p-8 bg-white/5 reveal-dash relative flex flex-col justify-center items-center group hover:bg-white/10 transition-colors cursor-pointer" onClick={() => navigate('/command/roles')}>
      <h4 className="heading-font text-3xl text-green-500 mb-2">PERSONNEL</h4>
      <p className="mono text-[10px] opacity-70 mb-6 text-center">ACCESS_ROLE_MANAGEMENT_AND_FILTERS</p>
      <button className="mono text-xs px-6 py-2 border border-green-500 text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
        VIEW_INDEX &gt;
      </button>
    </div>
  );
};

const DepartmentSelectionWidget = ({ user }) => {
  const [departments, setDepartments] = useState(user.memberDepartments || []);

  const ALLOWED_DEPARTMENTS = [
    'Design', 'PR', 'Public Speaking and Marketing', 'Content', 
    'Technical', 'Social Media', 'Coverage and Video Editing', 
    'volunteering', 'Decoration'
  ];

  const toggleDepartment = async (deptToToggle) => {
    const updatedDepartments = departments.includes(deptToToggle)
      ? departments.filter(d => d !== deptToToggle)
      : [...departments, deptToToggle];

    setDepartments(updatedDepartments);

    try {
      await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users/${user._id}/departments` : `http://localhost:5001/api/users/${user._id}/departments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberDepartments: updatedDepartments }),
        credentials: 'include'
      });
    } catch (err) {
      alert(`Failed to save department: ${err.message}`);
    }
  };

  return (
    <div className="col-span-full mechanical-border p-8 bg-black/50 reveal-dash border-green-500/30">
      <h4 className="mono text-green-500 mb-4 text-xs underline">MY_DEPARTMENTS_PROFILE</h4>
      <p className="mono text-[10px] opacity-70 mb-6">SELECT_THE_DEPARTMENTS_YOU_ARE_WORKING_IN</p>
      <div className="flex flex-wrap gap-3">
        {ALLOWED_DEPARTMENTS.map(dept => {
          const isAssigned = departments.includes(dept);
          return (
            <button 
              key={dept}
              onClick={() => toggleDepartment(dept)}
              className={`mono text-[10px] px-4 py-2 border transition-all ${
                isAssigned 
                  ? 'border-green-500 bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
                  : 'border-white/20 text-white/50 hover:border-green-500/50 hover:text-green-500'
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const RegistrationsWidget = ({ layout = 'compact' }) => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events` : 'http://localhost:5001/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className={`${layout === 'compact' ? 'col-span-full md:col-span-1' : 'col-span-full'} mechanical-border p-8 bg-black/50 reveal-dash relative`}>
      <h4 className="mono text-green-500 mb-6 text-xs underline">EVENT_DATA_INDEX</h4>
      <div className={layout === 'compact' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
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

const EventCreationWidget = ({ navigate }) => {
  return (
    <div className="col-span-full mechanical-border p-8 bg-green-900/10 border-green-500/30 reveal-dash relative flex flex-col justify-center items-center group hover:bg-green-500/20 transition-colors cursor-pointer" onClick={() => navigate('/command/events/new')}>
      <h4 className="heading-font text-3xl text-green-500 mb-2">INITIALIZE_DIRECTIVE</h4>
      <p className="mono text-[10px] opacity-70 mb-6 text-center text-green-500">CORE_OVERRIDE: CREATE_NEW_EVENT</p>
      <button className="mono text-xs px-6 py-2 border border-green-500 text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
        OPEN_CREATION_MATRIX &gt;
      </button>
    </div>
  );
};

const CommunicationsWidget = () => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('LOADING_TRANSMISSIONS...');

  const fetchMessages = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/contact` : 'http://localhost:5001/api/contact', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'FAILED_TO_FETCH');
      setMessages(data);
      setStatus('READY');
    } catch (err) {
      setStatus(`ERROR: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/contact/${id}/read` : `http://localhost:5001/api/contact/${id}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (res.ok) fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="col-span-full mechanical-border p-8 bg-white/5 reveal-dash">
      <h4 className="mono text-green-500 mb-6 text-xs underline">COMMUNICATIONS_LOG</h4>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {status !== 'READY' ? (
          <p className="mono text-[10px] text-yellow-500">{status}</p>
        ) : messages.length === 0 ? (
          <p className="mono text-[10px] opacity-50">NO_TRANSMISSIONS_FOUND</p>
        ) : (
          messages.map(msg => (
            <div key={msg._id} className={`p-4 border ${msg.isRead ? 'border-white/10 opacity-60' : 'border-green-500 bg-green-500/5'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="mono text-xs block text-white">SENDER_ID: {msg.senderId}</span>
                  <span className="text-[9px] mono opacity-50 block mt-1">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                {!msg.isRead && (
                  <button onClick={() => handleMarkRead(msg._id)} className="mono text-[9px] px-3 py-1 bg-green-500 text-black hover:bg-white transition-colors">
                    MARK_ACKNOWLEDGED
                  </button>
                )}
              </div>
              <p className="mono text-[10px] whitespace-pre-wrap">{msg.messageData}</p>
            </div>
          ))
        )}
      </div>
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
          
          {/* Top Left Column */}
          {role === 'member' && <EventsWidget layout="compact" />}
          {(role === 'head' || role === 'core') && <RegistrationsWidget layout="compact" />}

          {/* Top Right 2-Columns */}
          {(role === 'member' || role === 'head' || role === 'core') && (
            <TasksWidget role={role} navigate={navigate} />
          )}

          {/* Full Width for Participants */}
          {role === 'participant' && <EventsWidget layout="full" />}

          {/* Department Selection (Only for Members) */}
          {role === 'member' && (
            <DepartmentSelectionWidget user={user} />
          )}

          {/* Head Level (Level 3) */}
          {(role === 'head' || role === 'core') && (
            <>
              <RoleManagementLinkWidget navigate={navigate} />
              <EventsWidget layout="full" />
              <CommunicationsWidget />
            </>
          )}

          {/* Core Level (Level 4) */}
          {role === 'core' && (
            <EventCreationWidget navigate={navigate} />
          )}

        </div>
      </div>
    </section>
  );
}
