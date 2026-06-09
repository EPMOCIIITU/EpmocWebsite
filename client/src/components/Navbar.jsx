import { Link } from 'react-router-dom';

export default function Navbar() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
      <Link to="/" className="heading-font text-xl tracking-tighter cursor-pointer" onClick={scrollToTop}>EPMOC.SYS</Link>
      <div className="flex gap-10 text-[10px] uppercase tracking-[0.3em] max-md:hidden">
        <Link to="/#about" className="nav-link hover:text-green-400 transition-colors">Protocols</Link>
        <Link to="/archive" className="nav-link hover:text-green-400 transition-colors">Archive</Link>
        <Link to="/#team" className="nav-link hover:text-green-400 transition-colors">Personnel</Link>
        <Link to="/auth" className="nav-link text-green-500 border border-green-500/30 px-3 py-1">Secure_Login</Link>
      </div>
    </nav>
  );
}
