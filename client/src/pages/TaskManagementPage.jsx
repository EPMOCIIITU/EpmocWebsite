import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

export default function TaskManagementPage() {
  const { isAuthenticated, role, loading } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('INITIALIZING...');

  // Filters
  const [filterBranch, setFilterBranch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterName, setFilterName] = useState('');

  // Form
  const [showForm, setShowForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (!loading && (!isAuthenticated || role === 'participant')) {
      navigate('/command', { replace: true });
    }
  }, [isAuthenticated, role, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      if (role === 'core' || role === 'head') fetchUsers();
      gsap.fromTo('.reveal-dash', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [isAuthenticated, role]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/tasks` : 'http://localhost:5001/api/tasks', { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setTasks(data);
      setStatus('READY');
    } catch (err) {
      setStatus('ERROR_FETCHING_TASKS');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : 'http://localhost:5001/api/users', { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/tasks` : 'http://localhost:5001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle, assignedTo }),
        credentials: 'include'
      });
      if (res.ok) {
        setNewTaskTitle('');
        setAssignedTo('');
        setShowForm(false);
        fetchTasks();
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusUpdate = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING';
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/tasks/${taskId}/status` : `http://localhost:5001/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(u => {
    return (
      (filterBranch === '' || (u.branch && u.branch.toLowerCase().includes(filterBranch.toLowerCase()))) &&
      (filterDept === '' || (u.department && u.department.toLowerCase().includes(filterDept.toLowerCase()))) &&
      (filterYear === '' || u.year === filterYear) &&
      (filterName === '' || 
        (u.name && u.name.toLowerCase().includes(filterName.toLowerCase())) || 
        (u.email && u.email.toLowerCase().includes(filterName.toLowerCase())) ||
        (u.rollNo && u.rollNo.toLowerCase().includes(filterName.toLowerCase()))
      )
    );
  });

  if (loading || !isAuthenticated) return null;

  return (
    <section className="min-h-screen pt-32 pb-20 px-10 md:px-20 flex flex-col items-center">
      <div className="w-full max-w-6xl reveal-dash">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/20 pb-6">
          <div>
            <h2 className="heading-font text-5xl text-white">TASK.MANAGEMENT</h2>
            <p className="mono text-xs opacity-50 mt-2">COORDINATION_PROTOCOL // RESTRICTED_ACCESS</p>
          </div>
          <button onClick={() => navigate('/command')} className="mt-4 md:mt-0 mono text-[10px] px-4 py-2 border border-white/20 hover:bg-white/10 transition-colors">
            &lt; RETURN_TO_COMMAND_CENTER
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Assignment Panel */}
          {(role === 'core' || role === 'head') && (
            <div className="lg:col-span-1 mechanical-border p-6 bg-white/5">
              <h4 className="mono text-green-500 mb-6 text-xs underline">ASSIGN_NEW_TASK</h4>
              
              <div className="mb-6 space-y-3 border-b border-white/10 pb-6">
                <p className="mono text-[10px] opacity-50">FILTER_PERSONNEL</p>
                <input type="text" placeholder="SEARCH_NAME_OR_ROLL" value={filterName} onChange={e=>setFilterName(e.target.value)} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500" />
                <input type="text" placeholder="FILTER_BRANCH" value={filterBranch} onChange={e=>setFilterBranch(e.target.value)} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500" />
                <input type="text" placeholder="FILTER_DEPT" value={filterDept} onChange={e=>setFilterDept(e.target.value)} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500" />
                <select value={filterYear} onChange={e=>setFilterYear(e.target.value)} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500 text-white">
                  <option value="">ALL_YEARS</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="TASK_TITLE" 
                  required 
                  value={newTaskTitle} 
                  onChange={(e) => setNewTaskTitle(e.target.value)} 
                  className="w-full bg-black border border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white"
                />
                <select 
                  required 
                  value={assignedTo} 
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full bg-black border border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white"
                >
                  <option value="">SELECT_ASSIGNEE...</option>
                  {filteredUsers.map(u => (
                    <option key={u._id} value={u._id}>{u.name || u.email} ({u.role})</option>
                  ))}
                </select>
                <p className="mono text-[10px] text-green-500">{filteredUsers.length} MEMBERS_MATCH_FILTERS</p>
                <button type="submit" className="w-full py-3 bg-green-500 text-black heading-font text-sm hover:bg-white transition-all">DISPATCH_TASK</button>
              </form>
            </div>
          )}

          {/* Task Log Panel */}
          <div className={`mechanical-border p-6 bg-black/50 ${role === 'member' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
            <h4 className="mono text-green-500 mb-6 text-xs underline">ACTIVE_DIRECTIVES_LOG</h4>
            <div className="space-y-4">
              {status !== 'READY' ? (
                <p className="mono text-[10px] text-yellow-500">{status}</p>
              ) : tasks.length === 0 ? (
                <p className="mono text-[10px] opacity-50">NO_TASKS_FOUND</p>
              ) : (
                tasks.map(task => (
                  <div key={task._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-white/10 hover:bg-white/5 transition-colors gap-4">
                    <div>
                      <span className="mono text-sm block mb-1 text-white">{task.title}</span>
                      <div className="flex gap-4">
                        <span className="mono text-[10px] opacity-50 block">ASSIGNED_TO: {task.assignedTo?.email || 'UNKNOWN'}</span>
                        <span className="mono text-[10px] opacity-50 block">ASSIGNED_BY: {task.assignedBy?.email || 'SYSTEM'}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleStatusUpdate(task._id, task.status)}
                      className={`text-[10px] mono border px-4 py-2 transition-all cursor-pointer ${task.status === 'COMPLETED' ? 'text-green-500 border-green-500/30 hover:bg-green-500/10' : 'text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10'}`}
                    >
                      {task.status}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
