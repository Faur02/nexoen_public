'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { NexoenLogo } from './nexoen-logo';

const NAV_LINKS = [
  { label: 'Funktionen', id: 'features' },
  { label: "So funktioniert's", id: 'how-it-works' },
  { label: 'Preise', id: 'pricing' },
];

export function MarketingNav({ isHome = false }: { isHome?: boolean }) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        .mnav-scrolled { background: rgba(255,255,255,0.9) !important; backdrop-filter: blur(20px); box-shadow: 0 4px 30px rgba(0,0,0,0.05); }
        .mcta-button { background: linear-gradient(135deg,#0f766e 0%,#14b8a6 100%); transition: all 0.3s ease; position: relative; overflow: hidden; }
        .mcta-button::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); transition:left 0.5s; }
        .mcta-button:hover::before { left:100%; }
        .mcta-button:hover { transform:translateY(-2px); box-shadow:0 10px 30px -10px rgba(15,118,110,0.5); }
      `}</style>

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 py-4 ${navScrolled ? 'mnav-scrolled' : ''}`}
        style={{ background: navScrolled ? undefined : 'transparent' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/"><NexoenLogo /></Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, id }) =>
              isHome ? (
                <button key={id} onClick={() => scrollTo(id)} className="text-slate-600 hover:text-teal-600 transition-colors font-medium cursor-pointer bg-transparent border-none">
                  {label}
                </button>
              ) : (
                <Link key={id} href={`/#${id}`} className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                  {label}
                </Link>
              )
            )}
            <Link href="/blog" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">Blog</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block text-slate-600 hover:text-teal-600 transition-colors font-medium text-sm">
              Anmelden
            </Link>
            <Link href="/register" className="mcta-button text-white px-6 py-2.5 rounded-[4px] font-semibold text-sm shadow-lg hidden sm:block">
              Kostenlos testen
            </Link>
            <button className="md:hidden p-2 text-slate-700 bg-transparent border-none cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3 shadow-lg">
            {NAV_LINKS.map(({ label, id }) =>
              isHome ? (
                <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left text-slate-700 font-medium py-2 cursor-pointer bg-transparent border-none">
                  {label}
                </button>
              ) : (
                <Link key={id} href={`/#${id}`} className="block text-slate-700 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </Link>
              )
            )}
            <Link href="/blog" className="block text-slate-700 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link href="/login" className="block text-slate-700 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Anmelden</Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="mcta-button text-white px-6 py-3 rounded-[4px] font-semibold text-sm block text-center">
              Kostenlos testen
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
