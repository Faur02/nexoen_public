'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp, Flame, BarChart3, Scale, Coins, ShieldCheck,
  Mail, Globe, MapPin,
} from 'lucide-react';
import { NexoenLogo } from '@/components/layout/nexoen-logo';

export default function PressePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        * { font-family: var(--font-outfit), 'Outfit', sans-serif !important; }
        .presse-page, .presse-page * { cursor: default; }
        .presse-page a, .presse-page button { cursor: pointer !important; }
        .font-display { font-family: var(--font-display-lp), 'Playfair Display', serif !important; }
        .gradient-text {
          background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .browser-frame {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.12), 0 4px 12px -4px rgba(0,0,0,0.06);
        }
        .browser-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          background: white;
        }
        .mac-dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
        .metric-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
        }
        .feature-card {
          background: white;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px -8px rgba(0,0,0,0.1);
          border-color: #14b8a6;
        }
        .cta-btn {
          background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
          transition: all 0.3s ease;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px -8px rgba(15,118,110,0.5); }
      `}</style>

      <div className="presse-page bg-white text-slate-900 overflow-x-hidden">

        {/* ── Nav ── */}
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
            <NexoenLogo />
            <div className="flex items-center gap-6 text-sm font-medium">
              <a href="#screenshots" className="text-slate-600 hover:text-teal-600 transition-colors hidden sm:block">Screenshots</a>
              <a href="#kontakt" className="text-slate-600 hover:text-teal-600 transition-colors hidden sm:block">Kontakt</a>
              <Link href="/" className="text-teal-600 hover:text-teal-700 transition-colors font-semibold">
                Zur Website →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20 pb-28">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-40" style={{ background: '#ccfbf1' }} />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: 'rgba(230,166,92,0.3)' }} />
          </div>
          <div className="relative max-w-4xl mx-auto px-6 text-center reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Presse &amp; Medien
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Nebenkosten <span className="gradient-text">transparent</span>
              <br />für alle Mieter
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              nexoen macht Nebenkostenabrechnungen verständlich und hilft Mietern in Deutschland,
              finanzielle Überraschungen das ganze Jahr zu vermeiden.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#kontakt" className="cta-btn text-white px-8 py-3.5 rounded-[4px] font-semibold text-sm shadow-lg">
                Pressekontakt aufnehmen
              </a>
              <a href="#screenshots" className="px-8 py-3.5 rounded-[4px] font-semibold text-sm text-slate-700 border-2 border-slate-200 hover:border-teal-600 hover:text-teal-600 transition-all">
                Screenshots ansehen
              </a>
            </div>
          </div>
        </section>

        {/* ── Facts Bar ── */}
        <section className="border-y border-slate-200 bg-slate-50/60">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '2026', label: 'Launch', color: 'text-teal-600' },
                { value: '19,99 €', label: 'pro Jahr', color: 'text-teal-600' },
                { value: 'Deutschland', label: 'Fokus Markt', color: 'text-orange-500' },
                { value: 'Mieter', label: 'Zielgruppe', color: 'text-emerald-600' },
              ].map((s, i) => (
                <div key={i} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className={`font-display text-3xl md:text-4xl font-bold mb-1 ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-slate-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <div className="reveal">
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
                  Das <span className="text-teal-600">Problem</span>, das wir lösen
                </h2>
                <div className="space-y-5 text-lg text-slate-600 leading-relaxed">
                  <p>
                    Jährlich erhalten Millionen Mieter in Deutschland ihre Nebenkostenabrechnung –
                    oft mit unangenehmen Überraschungen. Nachzahlungen von mehreren hundert Euro
                    sind keine Seltenheit, besonders bei steigenden Energiepreisen.
                  </p>
                  <p>
                    <strong className="text-slate-900">nexoen</strong> analysiert Verbrauchsdaten und
                    Heizkostenabrechnungen in Echtzeit und erstellt eine laufende Prognose der jährlichen
                    Nebenkosten – damit Mieter das ganze Jahr Bescheid wissen.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-[4px] bg-orange-50 text-orange-700 text-sm font-medium border border-orange-100">Nebenkosten-Prognose</span>
                  <span className="px-4 py-2 rounded-[4px] bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">Heizkostenanalyse</span>
                  <span className="px-4 py-2 rounded-[4px] bg-teal-50 text-teal-700 text-sm font-medium border border-teal-100">Verbrauchs-Tracking</span>
                </div>
              </div>

              <div className="reveal" style={{ transitionDelay: '150ms' }}>
                <div className="relative">
                  <div className="absolute -inset-4 rounded-[4px] blur-2xl opacity-50" style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.2), rgba(47,174,142,0.15))' }} />
                  <div className="relative metric-card rounded-[4px] p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Erwartete Nachzahlung</div>
                        <div className="font-display text-4xl font-bold text-orange-600">~417 €</div>
                      </div>
                      <div className="w-12 h-12 rounded-[4px] bg-orange-50 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jahreskosten (Prognose)</span>
                        <span className="font-semibold">1.065 €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Abschläge (54 € × 12)</span>
                        <span className="font-semibold text-slate-400">−648 €</span>
                      </div>
                      <div className="h-px bg-slate-200" />
                      <div className="flex justify-between font-semibold">
                        <span className="text-orange-600">Nachzahlung</span>
                        <span className="text-orange-600">~417 €</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-sm text-teal-600">
                        <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                        <span>nexoen zeigt dies frühzeitig – nicht erst im Frühjahr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Screenshots ── */}
        <section id="screenshots" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Das Dashboard</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Klare Visualisierungen, intelligente Prognosen und alle relevanten Daten auf einen Blick.
              </p>
            </div>

            <div className="space-y-20">

              {/* Screenshot 1 — Dashboard, image left */}
              <div className="grid lg:grid-cols-5 gap-10 items-center reveal">
                <div className="lg:col-span-3">
                  <div className="browser-frame">
                    <div className="browser-bar">
                      <div className="mac-dot" style={{ background: '#ff5f57' }} />
                      <div className="mac-dot" style={{ background: '#febc2e' }} />
                      <div className="mac-dot" style={{ background: '#28c840' }} />
                    </div>
                    <Image
                      src="/screenshots/dashboard.png"
                      alt="nexoen Dashboard – Jahresbilanz mit Kostenprognose und Heizungsanalyse"
                      width={1400}
                      height={900}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-[4px] bg-teal-50 text-teal-700 text-xs font-semibold uppercase tracking-wider border border-teal-100">
                    Haupt-Dashboard
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Alle Kosten im Blick</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Die Übersicht zeigt die komplette Jahresbilanz mit erwarteter Nachzahlung oder Guthaben.
                    Der monatliche Verlauf und der Vergleich mit ähnlichen Haushalten helfen,
                    den eigenen Verbrauch einzuordnen.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {[
                      'Live-Prognose der Jahreskosten',
                      'Detaillierte Heizkostenanalyse',
                      'Monatliche Kostenentwicklung',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Screenshot 2 — Zähler, image right */}
              <div className="grid lg:grid-cols-5 gap-10 items-center reveal">
                <div className="lg:col-span-2 space-y-4 lg:order-1">
                  <div className="inline-flex items-center px-3 py-1 rounded-[4px] bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider border border-emerald-100">
                    Zählermanagement
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Alle Zähler an einem Ort</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Einfache Verwaltung aller Zähler: Strom, Gas, Warmwasser, Kaltwasser und Heizung.
                    Farbcodierte Karten zeigen auf einen Blick, welche Verbrauchskategorien aktiv sind.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ['Heizung', 'bg-orange-100 text-orange-700'],
                      ['Warmwasser', 'bg-emerald-100 text-emerald-700'],
                      ['Kaltwasser', 'bg-blue-100 text-blue-700'],
                      ['Strom', 'bg-amber-100 text-amber-700'],
                    ].map(([label, cls]) => (
                      <span key={label} className={`px-3 py-1 rounded-[4px] text-xs font-medium ${cls}`}>{label}</span>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-3 lg:order-2">
                  <div className="browser-frame">
                    <div className="browser-bar">
                      <div className="mac-dot" style={{ background: '#ff5f57' }} />
                      <div className="mac-dot" style={{ background: '#febc2e' }} />
                      <div className="mac-dot" style={{ background: '#28c840' }} />
                    </div>
                    <Image
                      src="/screenshots/zaehler.png"
                      alt="nexoen Zähler-Übersicht mit Heizung, Warmwasser, Kaltwasser und Strom"
                      width={1400}
                      height={900}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
              </div>

              {/* Screenshot 3 — Heizung detail, image left */}
              <div className="grid lg:grid-cols-5 gap-10 items-center reveal">
                <div className="lg:col-span-3">
                  <div className="browser-frame">
                    <div className="browser-bar">
                      <div className="mac-dot" style={{ background: '#ff5f57' }} />
                      <div className="mac-dot" style={{ background: '#febc2e' }} />
                      <div className="mac-dot" style={{ background: '#28c840' }} />
                    </div>
                    <Image
                      src="/screenshots/strom.png"
                      alt="nexoen Strom-Detailseite mit Verbrauchsanalyse und Jahresprognose"
                      width={1400}
                      height={900}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-[4px] bg-orange-50 text-orange-700 text-xs font-semibold uppercase tracking-wider border border-orange-100">
                    Detailanalyse
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Tiefe Einblicke</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Jede Kategorie bietet detaillierte Analysen: Tagesverbrauch, monatliche Kostenentwicklung
                    und vollständiges Zählerstands-Log. Inklusive ista-Daten und Raumverwaltung für Heizung.
                  </p>
                  <div className="p-4 bg-orange-50 rounded-[4px] border border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[4px] bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Flame className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-orange-800">Frühwarnsystem</div>
                        <div className="text-xs text-orange-700">Erkennt Verbrauchstrends und warnt vor hohen Nachzahlungen</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 reveal">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Funktionen</h2>
              <p className="text-lg text-slate-600">Alles, was Mieter für transparente Nebenkosten brauchen.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <TrendingUp className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-50', title: 'Nebenkosten-Prognose', desc: 'Laufende Prognose zeigt frühzeitig, ob eine Nachzahlung oder Guthaben zu erwarten ist – basierend auf aktuellen Verbrauchsdaten.' },
                { icon: <Flame className="w-6 h-6 text-amber-600" />, bg: 'bg-amber-50', title: 'Heizkostenanalyse', desc: 'Analyse von Heizkostenabrechnungen (ista, Techem) und Berechnung des eigenen Verbrauchsanteils nach der 70/30-Regel.' },
                { icon: <BarChart3 className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50', title: 'Verbrauchs-Tracking', desc: 'Erfassung von Zählerständen für Strom, Gas, Warmwasser und Kaltwasser mit automatischer Verbrauchsberechnung.' },
                { icon: <Scale className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50', title: 'Verbrauchsvergleich', desc: 'Vergleich des eigenen Energieverbrauchs mit Referenzwerten für ähnliche Haushalte in Deutschland.' },
                { icon: <Coins className="w-6 h-6 text-teal-600" />, bg: 'bg-teal-50', title: 'Kostenübersicht', desc: 'Monatliche Kostenentwicklung und detaillierte Jahresprognosen für alle Energie- und Nebenkostenarten.' },
                { icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50', title: 'Sicher & DSGVO-konform', desc: 'SSL-verschlüsselt, Server in Europa, volle DSGVO-Konformität. Deine Daten gehören dir.' },
              ].map((f, i) => (
                <div
                  key={f.title}
                  className="feature-card p-8 rounded-[4px] reveal"
                  style={{ transitionDelay: `${(i % 3) * 80}ms` }}
                >
                  <div className={`w-12 h-12 ${f.bg} rounded-[4px] flex items-center justify-center mb-5`}>{f.icon}</div>
                  <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Founder ── */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-6">
            <div className="metric-card rounded-[4px] p-8 md:p-12 reveal">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div
                  className="w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1D7874 0%, #2FAE8E 100%)' }}
                >
                  YN
                </div>
                <div className="text-center md:text-left">
                  <h2 className="font-display text-2xl font-bold mb-1">[YOUR NAME]</h2>
                  <p className="text-teal-600 font-medium mb-4 text-sm">Gründer &amp; Entwickler</p>
                  <p className="text-slate-600 leading-relaxed mb-5">
                    Webdesigner und Entwickler aus Deutschland. Mit nexoen entwickelt er digitale Tools,
                    die komplexe Kostenstrukturen für Verbraucher verständlicher machen –
                    ohne Finanzjargon, dafür mit echtem Mehrwert für Mieter.
                  </p>
                  <a
                    href="mailto:support@nexoen.de"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    support@nexoen.de
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="kontakt" className="py-24 bg-white">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="reveal">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Pressekontakt</h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                Für Interviewanfragen, Testzugänge oder weiteres Informationsmaterial
                stehe ich gerne zur Verfügung.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: <Mail className="w-5 h-5 text-teal-600" />, label: 'E-Mail', value: 'support@nexoen.de', href: 'mailto:support@nexoen.de' },
                  { icon: <Globe className="w-5 h-5 text-teal-600" />, label: 'Website', value: 'nexoen.de', href: 'https://nexoen.de' },
                  { icon: <MapPin className="w-5 h-5 text-teal-600" />, label: 'Standort', value: 'Deutschland', href: null },
                ].map((c, i) => (
                  <div key={i} className="metric-card rounded-[4px] p-6">
                    <div className="w-10 h-10 bg-teal-50 rounded-[4px] flex items-center justify-center mb-3 mx-auto">{c.icon}</div>
                    <div className="text-xs text-slate-500 mb-1 font-medium">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} className="text-sm font-semibold text-slate-900 hover:text-teal-600 transition-colors break-all">
                        {c.value}
                      </a>
                    ) : (
                      <div className="text-sm font-semibold text-slate-900">{c.value}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <NexoenLogo light />
            <p className="text-sm">© 2026 nexoen. Alle Rechte vorbehalten.</p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/impressum" className="hover:text-teal-400 transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-teal-400 transition-colors">Datenschutz</Link>
              <Link href="/agb" className="hover:text-teal-400 transition-colors">AGB</Link>
              <Link href="/" className="hover:text-teal-400 transition-colors">Zur Website</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
