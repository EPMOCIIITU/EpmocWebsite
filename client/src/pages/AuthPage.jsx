import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Extended fields for registration
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const authRef = useRef(null);

  // If already authenticated, redirect away
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/command', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    gsap.fromTo(authRef.current, 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
    );
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('INITIALIZATION_FAILED: MISSING_PARAMETERS');
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
        // AuthContext will update state and the useEffect will redirect
      } else {
        if (password !== confirmPassword) {
          setError('VALIDATION_ERROR: PASSWORDS_DO_NOT_MATCH');
          return;
        }
        await register(email, password, 'participant', {
          name, rollNo, branch, year
        });
        // Automatically switch to login on success
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
        setName('');
        setRollNo('');
        setBranch('');
        setYear('');
        setError('REGISTRATION_SUCCESSFUL // PLEASE_LOGIN');
      }
    } catch (err) {
      setError(`ERROR: ${err.message}`);
    }
  };

  if (loading || isAuthenticated) return null; // Avoid flicker

  return (
    <div className="min-h-screen pt-32 pb-20 px-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-md" ref={authRef}>
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`mono text-xs px-4 py-2 border ${isLogin ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-white/20 opacity-50 hover:opacity-100'} transition-all`}
          >
            LOGIN_PROTOCOL
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`mono text-xs px-4 py-2 border ${!isLogin ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-white/20 opacity-50 hover:opacity-100'} transition-all`}
          >
            REGISTER_NODE
          </button>
        </div>

        <div className="mechanical-border p-10 bg-black/60 backdrop-blur-md">
          <h2 className="heading-font text-3xl mb-8 text-center">
            {isLogin ? 'SYSTEM_ACCESS' : 'INITIALIZE_USER'}
          </h2>
          
          {error && (
            <div className={`mono text-[10px] mb-6 p-3 text-center ${error.includes('SUCCESS') ? 'text-green-500 border border-green-500/30 bg-green-500/10' : 'text-red-500 border border-red-500/30 bg-red-500/10'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mono text-[10px] opacity-50 mb-2">USER_IDENTIFIER (EMAIL)</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white transition-colors" 
              />
            </div>
            <div className="relative">
              <label className="block mono text-[10px] opacity-50 mb-2">SECURITY_KEY (PASSWORD)</label>
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white transition-colors pr-12" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 bottom-3 mono text-[10px] text-green-500 opacity-50 hover:opacity-100"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mono text-[10px] opacity-50 mb-2">FULL_NAME</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block mono text-[10px] opacity-50 mb-2">ROLL_NUMBER</label>
                  <input 
                    type="text" 
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block mono text-[10px] opacity-50 mb-2">BRANCH</label>
                  <select
                    required
                    value={branch}
                    onChange={(e) => { setBranch(e.target.value); setYear(''); }}
                    className="w-full bg-black border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white transition-colors" 
                  >
                    <option value="">SELECT_BRANCH...</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="IT">IT</option>
                    <option value="CY">CY</option>
                    <option value="DS">DS</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block mono text-[10px] opacity-50 mb-2">ACADEMIC_YEAR</label>
                  <select
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-black border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white transition-colors" 
                    disabled={!branch}
                  >
                    <option value="">{branch ? 'SELECT_YEAR...' : 'SELECT_BRANCH_FIRST'}</option>
                    {(!branch || branch === 'CSE' || branch === 'ECE' || branch === 'CY' || branch === 'DS') && <option value="1">1st Year</option>}
                    {(!branch || branch === 'CSE' || branch === 'ECE' || branch === 'CY' || branch === 'DS') && <option value="2">2nd Year</option>}
                    {(!branch || branch === 'CSE' || branch === 'ECE' || branch === 'IT' || branch === 'CY' || branch === 'DS') && <option value="3">3rd Year</option>}
                    {(!branch || branch === 'CSE' || branch === 'ECE' || branch === 'IT') && <option value="4">4th Year</option>}
                    {(!branch || branch === 'CSE' || branch === 'ECE' || branch === 'IT') && <option value="Alumni">Alumni</option>}
                  </select>
                </div>
                <div className="relative col-span-2">
                  <label className="block mono text-[10px] opacity-50 mb-2">CONFIRM_SECURITY_KEY</label>
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 p-3 mono text-sm outline-none focus:border-green-500 text-white transition-colors pr-12" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 bottom-3 mono text-[10px] text-green-500 opacity-50 hover:opacity-100"
                  >
                    {showConfirmPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-4 border border-green-500 text-green-500 heading-font text-sm hover:bg-green-500 hover:text-black transition-all mt-4"
            >
              {isLogin ? 'AUTHENTICATE' : 'TRANSMIT_DATA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
