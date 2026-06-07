import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const dashContent = {
  member: (
    <>
      <div className="col-span-2 mechanical-border p-8 bg-white/5">
        <h4 className="mono text-green-500 mb-6 text-xs underline">MY_TASKS</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border border-white/10">
            <span className="mono text-xs">Draft Mridang Teaser Script</span>
            <span className="text-[10px] text-yellow-500">PENDING</span>
          </div>
          <div className="flex justify-between items-center p-4 border border-white/10">
            <span className="mono text-xs">Inventory Check: Saloh Hall</span>
            <span className="text-[10px] text-green-500">DONE</span>
          </div>
        </div>
      </div>
      <div className="mechanical-border p-8 bg-green-500/10">
        <h4 className="mono text-green-500 mb-4 text-xs">ALERTS</h4>
        <p className="text-[10px] opacity-60">Meeting at 6PM in LHC Room 202. Design team lead needed.</p>
      </div>
    </>
  ),
  head: (
    <>
      <div className="col-span-2 mechanical-border p-8 bg-white/5">
        <h4 className="mono text-green-500 mb-6 text-xs underline">LOGISTICS_DEPT_STATUS</h4>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 border border-white/10 text-center">
            <div className="text-xl">18</div>
            <div className="mono text-[8px]">NODES_ONLINE</div>
          </div>
          <div className="p-4 border border-white/10 text-center">
            <div className="text-xl">03</div>
            <div className="mono text-[8px]">TASKS_OVERDUE</div>
          </div>
        </div>
        <textarea placeholder="BROADCAST ANNOUNCEMENT..." className="w-full bg-black/40 border border-white/10 p-4 mono text-[10px] h-20 outline-none"></textarea>
      </div>
      <div className="mechanical-border p-8 bg-white/5">
        <h4 className="mono text-green-500 mb-4 text-xs">TASK_DEPLOYMENT</h4>
        <select className="w-full bg-black p-2 mono text-[10px] mb-4 border border-white/20">
          <option>ANANYA_NEGI</option>
          <option>RAHUL_SINGH</option>
        </select>
        <button className="w-full py-2 bg-green-500 text-black heading-font text-[10px]">DEPLOY</button>
      </div>
    </>
  ),
  core: (
    <div className="col-span-3 grid grid-cols-4 gap-4">
      <div className="mechanical-border p-6 bg-white/5 text-center">
        <div className="text-green-500 heading-font text-2xl">₹68K</div>
        <div className="mono text-[8px]">FEST_BUDGET</div>
      </div>
      <div className="mechanical-border p-6 bg-white/5 text-center">
        <div className="text-green-500 heading-font text-2xl">94%</div>
        <div className="mono text-[8px]">EFFICIENCY</div>
      </div>
      <div className="col-span-4 mechanical-border p-8 bg-black/50">
        <h4 className="mono text-green-500 mb-4 text-xs underline">GLOBAL_PERSONNEL_DATA</h4>
        <table className="w-full mono text-[10px] text-left opacity-60">
          <thead>
            <tr><th>ID</th><th>NODE</th><th>DEPT</th><th>ACCESS</th></tr>
          </thead>
          <tbody>
            <tr><td>#EP201</td><td>Priyanshu</td><td>TECHNICAL</td><td>GRANTED</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default function CommandCenter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('member');
  const authRef = useRef(null);
  const dashRef = useRef(null);
  const dashContentRef = useRef(null);

  const simulateLogin = () => {
    gsap.to(authRef.current, { 
      opacity: 0, 
      scale: 0.9, 
      duration: 0.5, 
      onComplete: () => {
        setIsAuthenticated(true);
      }
    });
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

  return (
    <section id="command" className="min-h-screen p-10 md:p-20 flex flex-col items-center">
      {!isAuthenticated ? (
        <div id="auth-ui" ref={authRef} className="w-full max-w-lg mechanical-border p-10 bg-white/5 reveal">
          <h2 className="heading-font text-3xl mb-10 text-center">Command Access</h2>
          <div className="space-y-6">
            <input type="text" placeholder="ROLL_NUMBER" className="w-full bg-transparent border border-white/10 p-3 mono text-sm outline-none focus:border-green-500" />
            <input type="password" placeholder="ACCESS_KEY" className="w-full bg-transparent border border-white/10 p-3 mono text-sm outline-none focus:border-green-500" />
            <button onClick={simulateLogin} className="w-full py-4 border border-green-500 text-green-500 heading-font text-sm hover:bg-green-500 hover:text-black transition-all">INITIALIZE_SESSION</button>
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
            {dashContent[role]}
          </div>
        </div>
      )}
    </section>
  );
}
