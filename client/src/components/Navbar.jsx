export default function Navbar() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
      <div className="heading-font text-xl tracking-tighter cursor-pointer" onClick={scrollToTop}>EPMOC.SYS</div>
      <div className="flex gap-10 text-[10px] uppercase tracking-[0.3em] max-md:hidden">
        <a href="#about" className="nav-link hover:text-green-400 transition-colors">Protocols</a>
        <a href="#events" className="nav-link hover:text-green-400 transition-colors">Archive</a>
        <a href="#team" className="nav-link hover:text-green-400 transition-colors">Personnel</a>
        <a href="#command" className="nav-link text-green-500 border border-green-500/30 px-3 py-1">Secure_Login</a>
      </div>
    </nav>
  );
}
