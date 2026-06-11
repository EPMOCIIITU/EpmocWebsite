import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();

  const [senderId, setSenderId] = useState('');
  const [messageData, setMessageData] = useState('');
  const [status, setStatus] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTransmit = async (e) => {
    e.preventDefault();
    if (!senderId || !messageData) return setStatus('ERROR: MISSING_DATA');

    setStatus('TRANSMITTING...');
    try {
      const res = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/contact` : 'http://localhost:5001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, messageData }),
      });

      if (!res.ok) throw new Error('TRANSMISSION_FAILED');

      setStatus('SUCCESS: DIRECTIVE_RECEIVED');
      setSenderId('');
      setMessageData('');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus(`ERROR: ${err.message}`);
    }
  };

    const igLink = import.meta.env.VITE_SOCIAL_IG || 'https://instagram.com/epmoc_iiitu';
    const linkedinLink = import.meta.env.VITE_SOCIAL_LINKEDIN || 'https://linkedin.com/company/epmoc-iiitu';

    return (
      <footer id="contact" className="w-full bg-black/80 border-t border-white/10 pt-10 pb-4 px-10 md:px-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

            {/* Left Side: Brand & Links (Spans 7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Brand Column */}
              <div className="flex flex-col gap-3">
                <h3 className="heading-font text-2xl tracking-tighter text-white">EPMOC.SYS</h3>
                <p className="mono text-[10px] opacity-50 max-w-sm leading-relaxed">
                  EVENT PLANNING AND MANAGEMENT OPERATIONS COMMITTEE.<br />
                  INDIAN INSTITUTE OF INFORMATION TECHNOLOGY, UNA.<br />
                  SALOH, HP 177209
                </p>

                <div className="flex gap-4 mt-1">
                  <a href={igLink} target="_blank" rel="noreferrer" className="opacity-50 hover:opacity-100 hover:text-green-500 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href={linkedinLink} target="_blank" rel="noreferrer" className="opacity-50 hover:opacity-100 hover:text-green-500 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                </div>
              </div>

              {/* Links & Comms Column */}
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="mono text-green-500 text-[10px] underline mb-3">SYSTEM_LINKS</h4>
                  <ul className="space-y-1.5 mono text-[9px] opacity-70">
                    <li><Link to="/#about" className="hover:text-green-500 transition-colors">ABOUT_PROTOCOLS</Link></li>
                    <li><Link to="/#team" className="hover:text-green-500 transition-colors">PERSONNEL_ROSTER</Link></li>
                    <li><Link to="/archive" className="hover:text-green-500 transition-colors">EVENT_ARCHIVE</Link></li>
                    <li><button onClick={scrollToTop} className="hover:text-green-500 transition-colors text-left uppercase">RETURN_TO_TOP</button></li>
                  </ul>
                </div>

                <div>
                  <h4 className="mono text-green-500 text-[10px] underline mb-3">COMMS_CHANNEL</h4>
                  <a href="mailto:epmoc@iiitu.ac.in" className="mono text-[9px] opacity-70 hover:text-green-500 transition-colors block mb-4">
                    EMAIL: EPMOC@IIITU.AC.IN
                  </a>

                  <Link to="/auth" className="inline-block border border-green-500 text-green-500 px-4 py-2 hover:bg-green-500 hover:text-black transition-all mono text-[10px] text-center w-full mt-2">
                    WANT_TO_JOIN?
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Protocol Form (Spans 5 cols) */}
            <div className="lg:col-span-5">
              <div className="mechanical-border p-5 bg-white/5 h-full relative">
                <h4 className="mono text-green-500 text-[10px] underline mb-4">TRANSMISSION_PROTOCOL</h4>
                <form className="space-y-3" onSubmit={handleTransmit}>
                  <input type="text" value={senderId} onChange={e => setSenderId(e.target.value)} placeholder="SENDER_ID" className="w-full bg-black border border-white/10 p-2.5 mono text-[9px] outline-none focus:border-green-500 text-white transition-colors" />
                  <textarea value={messageData} onChange={e => setMessageData(e.target.value)} placeholder="MESSAGE_DATA" className="w-full bg-black border border-white/10 p-2.5 mono text-[9px] outline-none focus:border-green-500 text-white min-h-[60px] transition-colors"></textarea>
                  <button type="submit" className="w-full py-2.5 bg-green-500 text-black heading-font text-[10px] hover:bg-white transition-all">INITIATE_TRANSMISSION</button>
                </form>
                {status && (
                  <p className={`mt-2 mono text-[9px] ${status.includes('ERROR') ? 'text-red-500' : 'text-green-500'}`}>{status}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="text-center mono text-[9px] opacity-30 pt-4 border-t border-white/10">
            © {new Date().getFullYear()} EPMOC.SYS // CONTROL SYSTEM v2.0 // ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </footer>
    );
}