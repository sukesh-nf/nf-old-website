import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const SUB_PAGES = ['admin-upload', 'case-example', 'reading-the-shift', 'data-readiness-index', 'agentic-ai-cx-frontline', 'exemplar-videos', 'faq', 'knowledge'];

function isOnSubPage(): boolean {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return SUB_PAGES.includes(hash);
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasBackground, setHasBackground] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHasBackground(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'About Us', href: '#what-nexfrontier-does' },
    { label: 'Knowledge Centre', href: '#/faq' },
    { label: 'Calculate Quiet Loss', href: '#calculate-quiet-loss' },
    { label: 'Apply For BETA', href: '#beta-programme' },
  ];

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!isOnSubPage()) return;
    e.preventDefault();
    setMobileMenuOpen(false);
    const anchor = href.replace(/^#/, '');
    window.location.hash = '';
    requestAnimationFrame(() => {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  return (
    <>
      {/* Sentinel element at top of page - Header watches this via IntersectionObserver */}
      <div ref={sentinelRef} className="absolute top-0 left-0 w-px h-px" aria-hidden="true" />

      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          hasBackground ? 'bg-nex-dark/90 border-b border-nex-cyan/10' : 'bg-transparent'
        }`}
        style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
      >
        <div className="container-wide flex items-center justify-between h-20">
          <a href="#" className="flex items-center -ml-10">
            <img src="/Crop_Image.png" alt="NexFrontier" className="h-14 w-auto object-contain object-left" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="font-inter text-nex-grey hover:text-nex-cyan text-sm font-medium transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
            {/* Investor area — grouped box */}
            <div className="flex items-center gap-1 p-1 rounded-full border border-nex-cyan/20 bg-nex-cyan/5 backdrop-blur-sm">
              <a
                href="#investor-brief"
                onClick={(e) => handleNavClick(e, '#investor-brief')}
                className="font-inter px-5 py-1.5 bg-nex-cyan text-nex-dark font-semibold rounded-full hover:shadow-glow-cyan-lg transition-all duration-300 text-sm"
              >
                Investor Brief
              </a>
              <a
                href="#/investor-data-room"
                className="font-inter px-5 py-1.5 border border-nex-cyan/50 text-nex-cyan font-semibold rounded-full hover:bg-nex-cyan/15 hover:border-nex-cyan hover:shadow-[0_0_12px_rgba(0,212,212,0.35)] transition-all duration-300 text-sm"
              >
                Data Room
              </a>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-nex-cyan"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div id="mobile-nav" className="md:hidden bg-nex-dark/95 border-b border-nex-cyan/10">
            <nav className="container-wide py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { handleNavClick(e, item.href); setMobileMenuOpen(false); }}
                  className="font-inter text-nex-grey hover:text-nex-cyan text-sm font-medium transition-colors duration-300"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#investor-brief"
                onClick={(e) => { handleNavClick(e, '#investor-brief'); setMobileMenuOpen(false); }}
                className="font-inter w-full px-6 py-2 bg-nex-cyan text-nex-dark font-semibold rounded-full hover:shadow-glow-cyan-lg transition-all duration-300 text-sm text-center"
              >
                Investor Brief
              </a>
              <a
                href="#/investor-data-room"
                onClick={() => setMobileMenuOpen(false)}
                className="font-inter w-full px-6 py-2 border border-nex-cyan/50 text-nex-cyan font-semibold rounded-full hover:bg-nex-cyan/15 hover:border-nex-cyan hover:shadow-[0_0_12px_rgba(0,212,212,0.35)] transition-all duration-300 text-sm text-center"
              >
                Data Room
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
