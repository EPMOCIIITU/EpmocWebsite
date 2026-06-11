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

const MemberRequestWidget = () => {
  const [contactNumber, setContactNumber] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactNumber || !requestMessage) return setStatus('ERROR: MISSING_DATA');
    
    setStatus('PROCESSING...');
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/join` : 'http://localhost:5001/api/join', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('epmoc_auth') ? JSON.parse(localStorage.getItem('epmoc_auth')).token : ''}`
        },
        credentials: 'true', // ensure cookies are sent
        body: JSON.stringify({ contactNumber, requestMessage }),
      });
      
      if (!res.ok) throw new Error('REQUEST_FAILED');
      
      setStatus('SUCCESS: REQUEST_SUBMITTED');
      setContactNumber('');
      setRequestMessage('');
    } catch (err) {
      setStatus(`ERROR: ${err.message}`);
    }
  };

  return (
    <div className="col-span-full mechanical-border p-8 bg-green-500/5 reveal-dash">
      <h4 className="mono text-green-500 mb-6 text-xs underline">REQUEST_MEMBERSHIP_UPGRADE</h4>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <input 
          type="text" 
          placeholder="CONTACT_NUMBER" 
          value={contactNumber} 
          onChange={e=>setContactNumber(e.target.value)} 
          className="w-full bg-black border border-green-500/20 p-2.5 mono text-[9px] outline-none focus:border-green-500 text-white" 
        />
        <textarea 
          placeholder="REQUEST_MESSAGE (Why do you want to join?)" 
          value={requestMessage} 
          onChange={e=>setRequestMessage(e.target.value)} 
          className="w-full md:col-span-2 bg-black border border-green-500/20 p-2.5 mono text-[9px] outline-none focus:border-green-500 text-white min-h-[60px]" 
        />
        <div className="md:col-span-2 flex justify-between items-center mt-2">
          <p className={`mono text-[9px] ${status.includes('ERROR') ? 'text-red-500' : 'text-green-500'}`}>{status}</p>
          <button type="submit" className="py-2.5 px-6 bg-green-500 text-black heading-font text-[10px] hover:bg-white transition-all">SUBMIT_UPGRADE_REQUEST</button>
        </div>
      </form>
    </div>
  );
};

const CoreRequestsWidget = () => {
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/join` : 'http://localhost:5001/api/join', {
      credentials: 'true'
    })
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="col-span-full mechanical-border p-8 bg-white/5 reveal-dash">
      <h4 className="mono text-green-500 mb-6 text-xs underline">PENDING_MEMBERSHIP_REQUESTS</h4>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <p className="mono text-[10px] opacity-50 p-3">NO_PENDING_REQUESTS</p>
        ) : (
          requests.map(req => (
            <div key={req._id} className="border border-white/10 p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="mono text-xs text-white">{req.userId?.name || 'UNKNOWN_USER'}</span>
                <span className="mono text-[9px] text-yellow-500">{req.status}</span>
              </div>
              <div className="mono text-[9px] opacity-70 mb-2">
                ROLL: {req.userId?.rollNo} // BRANCH: {req.userId?.branch} // YR: {req.userId?.year} // CONTACT: <span className="text-green-400">{req.contactNumber}</span>
              </div>
              <p className="mono text-[10px] opacity-90 border-l border-green-500/30 pl-3 italic">"{req.requestMessage}"</p>
            </div>
          ))
        )}
      </div>
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
  const [deletePromptOpen, setDeletePromptOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteInputText, setDeleteInputText] = useState('');
  
  const fetchEvents = () => {
    fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events` : 'http://localhost:5001/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const initiateDelete = (e, ev) => {
    e.preventDefault();
    e.stopPropagation();
    setEventToDelete(ev);
    setDeleteInputText('');
    setDeletePromptOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    if (deleteInputText !== eventToDelete.title) {
      alert('Confirmation text did not match. Aborting deletion.');
      setDeletePromptOpen(false);
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events/${eventToDelete._id}` : `http://localhost:5001/api/events/${eventToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Delete failed');
      setEvents(events.filter(item => item._id !== eventToDelete._id));
      setDeletePromptOpen(false);
      setEventToDelete(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const cancelDelete = () => {
    setDeletePromptOpen(false);
    setEventToDelete(null);
    setDeleteInputText('');
  };

  return (
    <div className={`${layout === 'compact' ? 'col-span-full md:col-span-1' : 'col-span-full'} mechanical-border p-8 bg-black/50 reveal-dash relative`}>
      <h4 className="mono text-green-500 mb-6 text-xs underline">EVENT_DATA_INDEX</h4>
      <div className={layout === 'compact' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
        {events.map(ev => (
          <div key={ev._id} className="border border-white/10 p-4 hover:bg-white/5 transition-colors group relative">
            <span className="mono text-xs block text-white mb-2">{ev.title}</span>
            <div className="flex justify-between items-center">
              <span className="text-[10px] mono opacity-50 block">{new Date(ev.date).toLocaleDateString()}</span>
              
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link to={`/command/events/${ev._id}/manage`} className="text-green-500 hover:text-white transition-colors" title="Edit Event">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                </Link>
                <button onClick={(e) => initiateDelete(e, ev)} className="text-red-500 hover:text-white transition-colors" title="Delete Event">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="mono text-[10px] opacity-50 p-4">NO_EVENTS_FOUND</p>}
      </div>

      {deletePromptOpen && eventToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="mechanical-border bg-neutral-900 p-8 w-full max-w-md shadow-2xl border-red-500/50">
            <h3 className="mono text-red-500 text-xs mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
              DANGER_ZONE
            </h3>
            <p className="mono text-[10px] text-white opacity-80 mb-6 leading-relaxed">
              WARNING: This action is irreversible. It will permanently purge the event data from the database. <br/><br/>
              Type <span className="bg-red-500/20 text-red-400 px-1">{eventToDelete.title}</span> to confirm deletion.
            </p>
            <input 
              type="text" 
              value={deleteInputText}
              onChange={(e) => setDeleteInputText(e.target.value)}
              placeholder={eventToDelete.title}
              className="w-full bg-black border border-red-500/30 p-3 mono text-xs outline-none focus:border-red-500 text-white mb-6"
            />
            <div className="flex gap-4">
              <button 
                onClick={confirmDelete}
                disabled={deleteInputText !== eventToDelete.title}
                className="flex-1 py-3 bg-red-500 text-black hover:bg-red-400 disabled:opacity-50 disabled:hover:bg-red-500 transition-colors mono text-[10px]"
              >
                CONFIRM_DELETE
              </button>
              <button 
                onClick={cancelDelete}
                className="flex-1 py-3 border border-white/20 hover:bg-white/10 transition-colors mono text-[10px] text-white"
              >
                ABORT
              </button>
            </div>
          </div>
        </div>
      )}
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
          {(user.role === 'core' || user.role === 'head') && (
            <RoleManagementLinkWidget navigate={navigate} />
          )}

          {user.role === 'core' && (
            <CoreRequestsWidget />
          )}

          {/* Member Request for standard users */}
          {(user.role !== 'core' && user.role !== 'head') && (
            <MemberRequestWidget />
          )}
          
          {(role === 'head' || role === 'core') && (
            <>
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
