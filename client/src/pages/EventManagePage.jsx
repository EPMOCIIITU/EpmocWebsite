import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

export default function EventManagePage() {
  const { id } = useParams();
  const { isAuthenticated, role, loading } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [status, setStatus] = useState('LOADING...');

  // Edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!loading && (!isAuthenticated || (role !== 'head' && role !== 'core'))) {
      navigate('/command', { replace: true });
    }
  }, [isAuthenticated, role, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated && (role === 'head' || role === 'core')) {
      fetchEventData();
      fetchRegistrations();
      gsap.fromTo('.reveal-dash', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [id, isAuthenticated, role]);

  const fetchEventData = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events/${id}` : `http://localhost:5001/api/events/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEvent(data);
      setEditData({
        title: data.title,
        date: data.date ? data.date.split('T')[0] : '',
        venue: data.venue || '',
        coverImage: data.coverImage || '',
        description: data.description || '',
        driveGalleryLink: data.driveGalleryLink || ''
      });
      setStatus('READY');
    } catch (err) {
      setStatus(`ERROR: ${err.message}`);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/registrations/${id}` : `http://localhost:5001/api/registrations/${id}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) setRegistrations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus('UPDATING...');
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/events/${id}` : `http://localhost:5001/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Update failed');
      setIsEditing(false);
      fetchEventData(); // refresh
    } catch (err) {
      setStatus(`ERROR: ${err.message}`);
    }
  };

  if (loading || !isAuthenticated || (role !== 'head' && role !== 'core')) return null;

  return (
    <section className="min-h-screen pt-32 pb-20 px-10 md:px-20 flex flex-col items-center">
      <div className="w-full max-w-6xl reveal-dash">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/20 pb-6">
          <div>
            <h2 className="heading-font text-5xl text-white">EVENT.MANAGEMENT</h2>
            <p className="mono text-xs opacity-50 mt-2">ID: {id}</p>
          </div>
          <button onClick={() => navigate('/command')} className="mt-4 md:mt-0 mono text-[10px] px-4 py-2 border border-white/20 hover:bg-white/10 transition-colors">
            &lt; RETURN_TO_COMMAND_CENTER
          </button>
        </div>

        {status === 'LOADING...' ? (
          <p className="mono text-xs text-yellow-500">LOADING_DATA...</p>
        ) : !event ? (
          <p className="mono text-xs text-red-500">EVENT_NOT_FOUND</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Event Details Panel */}
            <div className="lg:col-span-1 mechanical-border p-6 bg-white/5 h-fit">
              <div className="flex justify-between items-center mb-6">
                <h4 className="mono text-green-500 text-xs underline">EVENT_PARAMETERS</h4>
                <button onClick={() => setIsEditing(!isEditing)} className="mono text-[10px] px-3 py-1 border border-white/20 hover:bg-white/10 transition-colors">
                  {isEditing ? 'CANCEL' : 'EDIT'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block mono text-[10px] opacity-50 mb-1">TITLE</label>
                    <input type="text" required value={editData.title} onChange={e=>setEditData({...editData, title: e.target.value})} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500 text-white" />
                  </div>
                  <div>
                    <label className="block mono text-[10px] opacity-50 mb-1">DATE</label>
                    <input type="date" required value={editData.date} onChange={e=>setEditData({...editData, date: e.target.value})} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500 text-white [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block mono text-[10px] opacity-50 mb-1">VENUE</label>
                    <input type="text" value={editData.venue} onChange={e=>setEditData({...editData, venue: e.target.value})} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500 text-white" />
                  </div>
                  <div>
                    <label className="block mono text-[10px] opacity-50 mb-1">DRIVE_GALLERY_LINK</label>
                    <input type="url" value={editData.driveGalleryLink} onChange={e=>setEditData({...editData, driveGalleryLink: e.target.value})} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500 text-white" />
                  </div>
                  <div>
                    <label className="block mono text-[10px] opacity-50 mb-1">DESCRIPTION</label>
                    <textarea value={editData.description} onChange={e=>setEditData({...editData, description: e.target.value})} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500 text-white min-h-[100px]" />
                  </div>
                  <button type="submit" className="w-full py-2 bg-green-500 text-black heading-font text-xs hover:bg-white transition-all">SAVE_PARAMETERS</button>
                </form>
              ) : (
                <div className="space-y-4 mono text-xs">
                  <div><span className="opacity-50 text-[10px] block">TITLE:</span> {event.title}</div>
                  <div><span className="opacity-50 text-[10px] block">DATE:</span> {new Date(event.date).toLocaleDateString()}</div>
                  <div><span className="opacity-50 text-[10px] block">VENUE:</span> {event.venue || 'N/A'}</div>
                  <div><span className="opacity-50 text-[10px] block">GALLERY_LINK:</span> {event.driveGalleryLink ? <a href={event.driveGalleryLink} target="_blank" rel="noreferrer" className="text-green-500 hover:underline">OPEN_DRIVE_LINK</a> : 'N/A'}</div>
                  <div><span className="opacity-50 text-[10px] block">GOOGLE_SHEET_ID:</span> {event.googleSheetId || 'N/A'}</div>
                  <div><span className="opacity-50 text-[10px] block">DRIVE_FOLDER_ID:</span> {event.driveFolderId || 'N/A'}</div>
                  <div><span className="opacity-50 text-[10px] block">DESCRIPTION:</span> <p className="opacity-80 mt-1 whitespace-pre-wrap">{event.description}</p></div>
                </div>
              )}
            </div>

            {/* Registrations Panel */}
            <div className="lg:col-span-2 mechanical-border p-6 bg-black/50">
              <div className="flex justify-between items-center mb-6">
                <h4 className="mono text-green-500 text-xs underline">REGISTRATION_DATA_INDEX</h4>
                <span className="mono text-[10px] text-green-500 border border-green-500/30 px-2 py-1">TOTAL: {registrations.length}</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full mono text-[10px] text-left opacity-80 border-collapse">
                  <thead>
                    <tr className="border-b border-white/20 text-green-500">
                      <th className="p-2 whitespace-nowrap">REG_ID</th>
                      <th className="p-2">USER_EMAIL</th>
                      <th className="p-2">NAME/ROLL</th>
                      <th className="p-2">BRANCH/DEPT</th>
                      <th className="p-2">YEAR</th>
                      <th className="p-2">TEAM_NAME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr><td colSpan="6" className="p-4 text-center opacity-50 border-b border-white/10">NO_DATA_FOUND</td></tr>
                    ) : (
                      registrations.map(reg => (
                        <tr key={reg._id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-2">{reg._id.slice(-6)}</td>
                          <td className="p-2">{reg.userId?.email || 'N/A'}</td>
                          <td className="p-2">
                            {reg.userId?.name || 'N/A'}<br/>
                            <span className="opacity-50">{reg.userId?.rollNo || ''}</span>
                          </td>
                          <td className="p-2">
                            {reg.userId?.branch || 'N/A'}<br/>
                            <span className="opacity-50">{reg.userId?.department || ''}</span>
                          </td>
                          <td className="p-2">{reg.userId?.year || 'N/A'}</td>
                          <td className="p-2">{reg.teamId?.name || 'INDIVIDUAL'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
