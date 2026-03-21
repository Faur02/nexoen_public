import Link from 'next/link';
import { Twitter, Instagram, Linkedin } from 'lucide-react';
import { NexoenLogo } from './nexoen-logo';

export function MarketingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2">
            <NexoenLogo light />
            <p className="text-sm leading-relaxed max-w-sm mt-4">
              Die smarte App für deine Nebenkostenabrechnung.<br />
              Nie wieder Überraschungen, immer die volle Kontrolle.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Produkt</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features" className="hover:text-teal-400 transition-colors">Funktionen</Link></li>
              <li><Link href="/#pricing" className="hover:text-teal-400 transition-colors">Preise</Link></li>
              <li><Link href="/blog" className="hover:text-teal-400 transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/impressum" className="hover:text-teal-400 transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-teal-400 transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-teal-400 transition-colors">AGB</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2026 nexoen. Alle Rechte vorbehalten.</p>
          <div className="flex items-center gap-4">
            {[Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
