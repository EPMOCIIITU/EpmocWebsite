import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

export default function RoleManagementPage() {
  const { isAuthenticated, role, loading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('LOADING_USERS...');

  // Filters
  const [filterBranch, setFilterBranch] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    if (!loading && (!isAuthenticated || (role !== 'head' && role !== 'core'))) {
      navigate('/command', { replace: true });
    }
  }, [isAuthenticated, role, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated && (role === 'head' || role === 'core')) {
      fetchUsers();
      gsap.fromTo('.reveal-dash', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [isAuthenticated, role]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : 'http://localhost:5001/api/users', { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data);
      setStatus('READY');
    } catch (err) {
      setStatus(`ERROR: ${err.message}`);
    }
  };

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

  const filteredUsers = users.filter(u => {
    return (
      (filterBranch === '' || (u.branch && u.branch.toLowerCase().includes(filterBranch.toLowerCase()))) &&
      (filterYear === '' || u.year === filterYear) &&
      (filterRole === '' || u.role === filterRole) &&
      (filterName === '' || 
        (u.name && u.name.toLowerCase().includes(filterName.toLowerCase())) || 
        (u.email && u.email.toLowerCase().includes(filterName.toLowerCase())) ||
        (u.rollNo && u.rollNo.toLowerCase().includes(filterName.toLowerCase()))
      )
    );
  });

  if (loading || !isAuthenticated || (role !== 'head' && role !== 'core')) return null;

  return (
    <section className="min-h-screen pt-32 pb-20 px-10 md:px-20 flex flex-col items-center">
      <div className="w-full max-w-6xl reveal-dash">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/20 pb-6">
          <div>
            <h2 className="heading-font text-5xl text-white">PERSONNEL.MANAGEMENT</h2>
            <p className="mono text-xs opacity-50 mt-2">ACCESS_LEVEL: <span className="text-green-500 uppercase">{role}</span> // AUTHORIZED_PERSONNEL_ONLY</p>
          </div>
          <button onClick={() => navigate('/command')} className="mt-4 md:mt-0 mono text-[10px] px-4 py-2 border border-white/20 hover:bg-white/10 transition-colors">
            &lt; RETURN_TO_COMMAND_CENTER
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Panel */}
          <div className="lg:col-span-1 mechanical-border p-6 bg-white/5 h-fit">
            <h4 className="mono text-green-500 mb-6 text-xs underline">APPLY_FILTERS</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block mono text-[10px] opacity-50 mb-1">SEARCH_NAME_OR_ROLL</label>
                <input type="text" placeholder="QUERY..." value={filterName} onChange={e=>setFilterName(e.target.value)} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500 text-white" />
              </div>
              
              <div>
                <label className="block mono text-[10px] opacity-50 mb-1">BRANCH</label>
                <select value={filterBranch} onChange={e=>setFilterBranch(e.target.value)} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500 text-white">
                  <option value="">ALL_BRANCHES</option>
                  <option value="cse">CSE</option>
                  <option value="ece">ECE</option>
                  <option value="it">IT</option>
                  <option value="cy">CY</option>
                  <option value="ds">DS</option>
                </select>
              </div>

              <div>
                <label className="block mono text-[10px] opacity-50 mb-1">ACADEMIC_YEAR</label>
                <select value={filterYear} onChange={e=>setFilterYear(e.target.value)} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500 text-white">
                  <option value="">ALL_YEARS</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>

              <div>
                <label className="block mono text-[10px] opacity-50 mb-1">CURRENT_ROLE</label>
                <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} className="w-full bg-black border border-white/20 p-2 mono text-[10px] outline-none focus:border-green-500 text-white">
                  <option value="">ALL_ROLES</option>
                  <option value="participant">PARTICIPANT</option>
                  <option value="member">MEMBER</option>
                  <option value="head">HEAD</option>
                  {role === 'core' && <option value="core">CORE</option>}
                </select>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <span className="mono text-[10px] text-green-500">MATCHES_FOUND: {filteredUsers.length}</span>
              </div>
            </div>
          </div>

          {/* Users List Panel */}
          <div className="lg:col-span-3 mechanical-border p-6 bg-black/50">
            <h4 className="mono text-green-500 mb-6 text-xs underline">PERSONNEL_INDEX</h4>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {status !== 'READY' ? (
                <p className="mono text-[10px] text-yellow-500">{status}</p>
              ) : filteredUsers.length === 0 ? (
                <p className="mono text-[10px] opacity-50">NO_PERSONNEL_MATCH_CURRENT_FILTERS</p>
              ) : (
                filteredUsers.map(user => (
                  <div key={user._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-colors gap-4">
                    <div>
                      <span className="mono text-xs block text-white">{user.email}</span>
                      <span className="mono text-[9px] opacity-50 uppercase mt-1 block">
                        {user.name} // ROLL: {user.rollNo || 'N/A'} // {user.branch || 'N/A'} - YR: {user.year || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <span className={`mono text-[10px] uppercase ${user.role === 'core' ? 'text-green-500' : 'opacity-70'}`}>CURRENT: {user.role}</span>
                      <select 
                        onChange={(e) => handleRoleChange(user._id, e.target.value)} 
                        value={user.role}
                        className="bg-black p-2 mono text-[10px] border border-white/20 outline-none focus:border-green-500 text-white"
                        disabled={role !== 'core' && (user.role === 'core' || user.role === 'head')} // Prevent heads from changing other heads/cores
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

        </div>
      </div>
    </section>
  );
}
