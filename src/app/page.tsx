'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Lock, Server, CheckCircle, ArrowRight, TrendingUp,
  Calculator, Flame, Zap, Droplets, Gauge, BellRing, Shield,
  Upload, Activity, LineChart, PiggyBank, Calendar, Brain,
  FileCheck, FileX, CalendarClock, Sparkles, Bell, Check,
  ChevronDown, Menu, X,
} from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}
import { NexoenLogo } from '@/components/layout/nexoen-logo';

export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));

    return () => { window.removeEventListener('scroll', handleScroll); observer.disconnect(); };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        * { font-family: var(--font-body), 'Inter', sans-serif !important; }
        .font-display { font-family: var(--font-display-lp), 'Plus Jakarta Sans', sans-serif !important; }
        .gradient-text {
          background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .feature-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1); }
        .scroll-reveal { opacity:0; transform:translateY(30px); transition:all 0.8s ease-out; }
        .scroll-reveal.active { opacity:1; transform:translateY(0); }
        .cta-button {
          background: linear-gradient(135deg,#0f766e 0%,#14b8a6 100%);
          transition: transform 0.3s ease, box-shadow 0.3s ease; position:relative; overflow:hidden;
        }
        .cta-button::before {
          content:''; position:absolute; top:0; left:-100%; width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); transition:left 0.5s;
        }
        .cta-button:hover::before { left:100%; }
        .cta-button:hover { transform:translateY(-2px); box-shadow:0 10px 30px -10px rgba(15,118,110,0.5); }
        .illustration-float { animation: gfloat 6s ease-in-out infinite; will-change: transform; }
        @keyframes gfloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-20px); } }
        .step-card { background:rgba(30,41,59,0.7); backdrop-filter:blur(10px); border:1px solid rgba(51,65,85,0.5); }
        .step-number {
          background:linear-gradient(135deg,#14b8a6 0%,#0d9488 100%);
          box-shadow:0 10px 25px -5px rgba(20,184,166,0.4); opacity:0.8;
        }
        .problem-card { background:white; border:1px solid #e2e8f0; transition:border-color 0.3s ease, box-shadow 0.3s ease; }
        .problem-card:hover { border-color:#14b8a6; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); }
        .guarantee-badge { background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%); border:2px solid #f59e0b; }
        .value-card { background:white; border:1px solid #e2e8f0; transition:transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1), border-color 0.4s ease; position:relative; overflow:hidden; }
        .value-card::before { content:''; position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(135deg,#14b8a6 0%,#0d9488 100%); transform:scaleX(0); transition:transform 0.4s ease; }
        .value-card:hover { transform:translateY(-8px); box-shadow:0 25px 50px -12px rgba(0,0,0,0.15); border-color:#14b8a6; }
        .value-card:hover::before { transform:scaleX(1); }
        .price-card-main { background:linear-gradient(135deg,#0f766e 0%,#134e4a 100%); transition:transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s cubic-bezier(0.4,0,0.2,1); }
        .price-card-main:hover { transform:scale(1.03) translateY(-5px); box-shadow:0 30px 60px -15px rgba(15,118,110,0.4); }
        .trust-card { transition:transform 0.3s ease, border-left-width 0.3s ease; }
        .trust-card:hover { transform:translateX(5px); border-left-width:6px !important; }
        .nav-scrolled { background:rgba(255,255,255,0.9) !important; backdrop-filter:blur(20px); box-shadow:0 4px 30px rgba(0,0,0,0.05); }
        @media (prefers-reduced-motion: reduce) {
          .illustration-float { animation: none; }
          .scroll-reveal { transition: none; opacity: 1; transform: none; }
          .cta-button::before { transition: none; }
        }
      `}</style>

      <div className="bg-slate-50 text-slate-800 overflow-x-hidden">

        {/* ── Navigation ── */}
        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-300 py-4 ${navScrolled ? 'nav-scrolled' : ''}`}
          style={{ background: navScrolled ? undefined : 'transparent' }}
        >
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <NexoenLogo />

            <div className="hidden md:flex items-center gap-8">
              {[['features','Funktionen'],["how-it-works","So funktioniert's"],['pricing','Preise']].map(([id,label])=>(
                <button key={id} onClick={()=>scrollTo(id)} className="text-slate-600 hover:text-teal-600 transition-colors font-medium cursor-pointer bg-transparent border-none">{label}</button>
              ))}
              <Link href="/blog" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">Blog</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden md:block text-slate-600 hover:text-teal-600 transition-colors font-medium text-sm">
                Anmelden
              </Link>
              <Link href="/register" className="cta-button text-white px-6 py-2.5 rounded-[4px] font-semibold text-sm shadow-lg hidden sm:block">
                Kostenlos testen
              </Link>
              <button className="md:hidden p-2 text-slate-700 bg-transparent border-none cursor-pointer" onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3 shadow-lg">
              {[['features','Funktionen'],["how-it-works","So funktioniert's"],['pricing','Preise']].map(([id,label])=>(
                <button key={id} onClick={()=>scrollTo(id)} className="block w-full text-left text-slate-700 font-medium py-2 cursor-pointer bg-transparent border-none">{label}</button>
              ))}
              <Link href="/blog" onClick={()=>setMobileMenuOpen(false)} className="block w-full text-left text-slate-700 font-medium py-2">Blog</Link>
              <Link href="/login" onClick={()=>setMobileMenuOpen(false)} className="block w-full text-left text-slate-700 font-medium py-2">
                Anmelden
              </Link>
              <Link href="/register" onClick={()=>setMobileMenuOpen(false)} className="cta-button text-white px-6 py-3 rounded-[4px] font-semibold text-sm block text-center">
                Kostenlos testen
              </Link>
            </div>
          )}
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" style={{ background: 'radial-gradient(circle at 90% 10%, rgba(204,251,241,0.55) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(254,243,199,0.45) 0%, transparent 48%), radial-gradient(circle at 42% 52%, rgba(252,231,243,0.3) 0%, transparent 40%), white' }}>

          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10 py-16 lg:py-0 w-full">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-[4px] border border-teal-100 text-teal-700 text-sm font-medium">
                <ShieldCheck className="w-4 h-4 flex-shrink-0"/>
                <span>14 Tage kostenlos</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-5xl font-bold leading-tight text-slate-900">
                Deine Nebenkosten.<br/>
                <span className="gradient-text">Jederzeit im Blick.</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Sieh jeden Monat, ob dein Abschlag reicht.<br/>
                So vermeidest du hohe Nachzahlungen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/register" className="cta-button text-white px-8 py-4 rounded-[4px] font-semibold text-lg shadow-xl flex items-center justify-center gap-2 group">
                  <span>Kostenlos starten</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                </Link>
                <button onClick={()=>scrollTo('how-it-works')} className="px-8 py-4 rounded-[4px] font-semibold text-slate-700 border-2 border-slate-200 hover:border-teal-600 hover:text-teal-600 transition-all flex items-center justify-center gap-2 bg-transparent cursor-pointer">
                  So funktioniert's
                </button>
              </div>

            </div>

            {/* Hero Card */}
            <div className="relative illustration-float lg:pl-8 hidden sm:block">
              <div className="relative bg-white rounded-[4px] shadow-2xl p-6 border border-slate-100">
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-green-100 to-green-50 rounded-[4px] p-3 shadow-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <TrendingUp className="w-4 h-4"/><span className="font-bold text-sm">+€340</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">Rückzahlung erwartet</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-semibold text-slate-800">Jahresprognose 2026</h3>
                      <p className="text-sm text-slate-500">Stand: März 2026</p>
                    </div>
                    <div className="w-10 h-10 bg-teal-100 rounded-[4px] flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-teal-600"/>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {icon:<Flame className="w-4 h-4 text-orange-600"/>, bg:'bg-orange-100', label:'Heizung & Warmwasser', amount:'€892'},
                      {icon:<Zap className="w-4 h-4 text-yellow-600"/>, bg:'bg-yellow-100', label:'Strom', amount:'€634'},
                      {icon:<Droplets className="w-4 h-4 text-blue-600"/>, bg:'bg-blue-100', label:'Wasser', amount:'€298'},
                    ].map(item=>(
                      <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-[4px]">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${item.bg} rounded-[4px] flex items-center justify-center`}>{item.icon}</div>
                          <p className="font-medium text-slate-800 text-sm">{item.label}</p>
                        </div>
                        <span className="font-semibold text-slate-700 text-sm">{item.amount}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-[4px] p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-800 font-medium">Prognose</p>
                        <p className="text-xs text-green-600">Du zahlst zu viel</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-700">€340</p>
                        <p className="text-xs text-green-600">Rückzahlung</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust Bar ── */}
        <section className="py-10 bg-white border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-0 lg:divide-x lg:divide-slate-200">
              {[
                {icon:<Calendar className="w-5 h-5 text-teal-600"/>, bg:'bg-teal-50', title:'14 Tage kostenlos', sub:'Keine Kreditkarte nötig'},
                {icon:<CheckCircle className="w-5 h-5 text-green-600"/>, bg:'bg-green-50', title:'30 Tage Geld zurück', sub:'100% ohne Bedingungen'},
                {icon:<ShieldCheck className="w-5 h-5 text-teal-600"/>, bg:'bg-teal-50', title:'DSGVO-konform', sub:'Daten in der EU'},
              ].map((item,i)=>(
                <div key={i} className="flex items-center gap-3 justify-center lg:px-8">
                  <div className={`w-10 h-10 ${item.bg} rounded-[4px] flex items-center justify-center flex-shrink-0`}>{item.icon}</div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Problem Section ── */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16 scroll-reveal">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Das passiert <span className="text-red-500">jedes Jahr</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Viele zahlen zu viel – weil sie es zu spät merken.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {icon:<FileX className="w-7 h-7 text-red-600"/>, ibg:'bg-red-50 border-red-100', title:'Abrechnung schwer verständlich', desc:'Viele Zahlen und Fachbegriffe machen es schwer zu verstehen, wofür du zahlst.', delay:0},
                {icon:<CalendarClock className="w-7 h-7 text-orange-600"/>, ibg:'bg-orange-50 border-orange-100', title:'Zu spät erkannt', desc:'Du merkst erst bei der Abrechnung, dass dein Abschlag nicht gereicht hat.', delay:100},
                {icon:<Calculator className="w-7 h-7 text-yellow-600"/>, ibg:'bg-yellow-50 border-yellow-100', title:'Regelmäßige Nachzahlungen', desc:'Viele zahlen jedes Jahr nach, ohne vorher zu wissen, was auf sie zukommt.', delay:200},
              ].map(card=>(
                <div key={card.title} className="problem-card p-8 rounded-[4px] scroll-reveal text-center" style={{transitionDelay:`${card.delay}ms`}}>
                  <div className={`w-14 h-14 ${card.ibg} rounded-[4px] flex items-center justify-center mb-6 border mx-auto`}>{card.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-50/50 to-transparent pointer-events-none"/>
          <div className="max-w-7xl mx-auto px-6 relative z-10">

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
              <div className="scroll-reveal">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-[4px] text-teal-700 text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4"/><span>Die Lösung</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  Alle Verbräuche.<br/>Ein klares Bild.
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Trag deine Werte ein und sieh früh, ob dein Abschlag reicht.
                </p>
                <ul className="space-y-4">
                  {['Verbrauch jederzeit im Überblick','Prognose für deine Jahresabrechnung','Frühzeitig reagieren und Kosten vermeiden'].map(item=>(
                    <li key={item} className="flex items-start gap-4">
                      <div className="w-6 h-6 bg-teal-100 rounded-[4px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-teal-600"/>
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative scroll-reveal">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-200 to-blue-200 rounded-[4px] rotate-3 opacity-20"/>
                <div className="relative bg-white rounded-[4px] shadow-2xl p-6 border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800">Deine Übersicht</h3>
                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-[4px]">März 2026</span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[4px] p-6 text-white">
                      <p className="text-slate-400 text-sm mb-1">Jahresprognose</p>
                      <div className="flex flex-wrap items-end gap-2">
                        <span className="text-4xl font-bold">€1.824</span>
                        <span className="text-slate-400 mb-1">/ €2.164 gezahlt</span>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
                        <TrendingUp className="w-4 h-4"/>
                        <span>Du erhältst voraussichtlich €340 zurück</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-[4px] p-4">
                        <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-orange-500 rounded-full"/><span className="text-xs text-slate-600">Heizung</span></div>
                        <p className="text-xl font-bold text-slate-800">€892</p>
                      </div>
                      <div className="bg-slate-50 rounded-[4px] p-4">
                        <div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-yellow-500 rounded-full"/><span className="text-xs text-slate-600">Strom</span></div>
                        <p className="text-xl font-bold text-slate-800">€634</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-[4px] p-4 border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-[4px] flex items-center justify-center flex-shrink-0">
                          <Bell className="w-5 h-5 text-blue-600"/>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Erinnerung</p>
                          <p className="text-xs text-blue-700">Stromzähler muss bis 31.03. abgelesen werden</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {icon:<Gauge className="w-6 h-6"/>, title:'Alle Zähler an einem Ort', desc:'Strom, Gas, Wasser und Heizung in einer App – mit Verlauf und Vergleich.', delay:0},
                {icon:<Flame className="w-6 h-6"/>, title:'Mit allen Anbietern nutzbar', desc:'Werte einfach eintragen – egal welcher Anbieter.', delay:100},
                {icon:<BellRing className="w-6 h-6"/>, title:'Rechtzeitig erinnert werden', desc:'Du wirst erinnert, bevor du etwas verpasst.', delay:200},
                {icon:<FileCheck className="w-6 h-6"/>, title:'Als PDF speichern', desc:'Ergebnisse speichern oder einfach weitergeben.', delay:300},
              ].map(card=>(
                <div key={card.title} className="feature-card bg-slate-50 p-6 rounded-[4px] border border-slate-100 scroll-reveal text-center" style={{transitionDelay:`${card.delay}ms`}}>
                  <div className="w-12 h-12 bg-white rounded-[4px] shadow-sm flex items-center justify-center mb-4 text-teal-600 mx-auto">{card.icon}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-600">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it Works ── */}
        <section id="how-it-works" className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-900/40 via-slate-900 to-slate-900"/>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16 scroll-reveal">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">So funktioniert's</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">In drei Schritten weißt du, wo du stehst.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent"/>
              {[
                {n:'1', icon:<Upload className="w-8 h-8"/>, title:'Zählerstände eintragen', desc:'Einmal im Monat eintragen.', delay:0},
                {n:'2', icon:<Activity className="w-8 h-8"/>, title:'Verbrauch verstehen', desc:'Sieh, ob dein Abschlag noch reicht.', delay:150},
                {n:'3', icon:<LineChart className="w-8 h-8"/>, title:'Prognose erhalten', desc:'Sieh früh, ob eine Nachzahlung kommt.', delay:300},
              ].map(step=>(
                <div key={step.n} className="relative scroll-reveal" style={{transitionDelay:`${step.delay}ms`}}>
                  <div className="step-number w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-6 relative z-10 mx-auto text-white">{step.n}</div>
                  <div className="step-card rounded-[4px] p-8 text-center">
                    <div className="w-16 h-16 bg-slate-700 rounded-[4px] flex items-center justify-center mb-6 text-teal-400 mx-auto">{step.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Value Proposition ── */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 scroll-reveal">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Deine Kosten. Immer im Griff.</h2>
              <p className="text-slate-600">Versteh, was du zahlst. Keine Überraschungen.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {icon:<BellRing className="w-7 h-7 text-teal-600"/>, ibg:'bg-teal-50 border-teal-100', title:'Früh sehen, was fehlt', desc:'Jeden Monat sehen, ob dein Abschlag reicht.', delay:0},
                {icon:<Flame className="w-7 h-7 text-amber-600"/>, ibg:'bg-amber-50 border-amber-100', title:'Heizkosten klar sehen', desc:'Sofort sehen, was du wirklich zahlst.', delay:100},
                {icon:<Gauge className="w-7 h-7 text-blue-600"/>, ibg:'bg-blue-50 border-blue-100', title:'Alles an einem Ort', desc:'Alle Kosten an einem Ort – klar und einfach.', delay:200},
                {icon:<LineChart className="w-7 h-7 text-purple-600"/>, ibg:'bg-purple-50 border-purple-100', title:'Immer wissen, wo du stehst', desc:'Jeden Monat ein klarer Überblick über deine Kosten.', delay:300},
              ].map(card=>(
                <div key={card.title} className="value-card p-8 rounded-[4px] scroll-reveal" style={{transitionDelay:`${card.delay}ms`}}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${card.ibg} rounded-[4px] flex items-center justify-center flex-shrink-0 border`}>{card.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 scroll-reveal">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Ein Preis. Alles drin.</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">Ein Plan. Keine Extras. Keine versteckten Kosten.</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <div className="price-card-main rounded-[4px] p-8 text-white shadow-2xl scroll-reveal flex flex-col">
                  <div className="mb-6">
                    <span className="text-teal-300 font-semibold text-sm tracking-wider">Jahresplan</span>
                    <div className="flex items-end gap-3 mt-2">
                      <span className="text-6xl font-bold">€19<span className="text-3xl text-teal-200">,99</span></span>
                      <span className="text-teal-200 text-lg mb-2">/ Jahr</span>
                    </div>
                  <p className="text-teal-300 text-xs mt-1">Gem. § 19 UStG wird keine MwSt. berechnet.</p>
                  </div>
                  <div className="space-y-4 mb-8 flex-1">
                    {['Unbegrenzte Zähler','Alle Anbieter','Prognose deiner Kosten','Erinnerungen','PDF Export'].map(item=>(
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-slate-900"/>
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/register" className="w-full bg-white text-teal-700 hover:bg-teal-50 py-4 rounded-[4px] font-bold text-lg transition-all shadow-lg block text-center">
                    14 Tage kostenlos testen
                  </Link>
                  <p className="text-center text-sm text-teal-200 mt-4">Keine Kreditkarte • Jederzeit kündbar</p>
                </div>

                <div className="flex flex-col gap-4 scroll-reveal" style={{transitionDelay:'100ms'}}>
                  <div className="trust-card guarantee-badge rounded-[4px] p-6 border-l-4 border-amber-500 flex-1" style={{borderLeft:'4px solid #f59e0b'}}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <ShieldCheck className="w-6 h-6 text-amber-600"/>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-amber-900 mb-1">14 Tage kostenlos testen</h3>
                        <p className="text-amber-800 text-sm">Ohne Risiko testen. Keine Kreditkarte. Jederzeit kündbar.</p>
                      </div>
                    </div>
                  </div>
                  <div className="trust-card rounded-[4px] p-6 flex-1" style={{background:'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)', border:'1px solid #bbf7d0', borderLeft:'4px solid #16a34a'}}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white rounded-[4px] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckCircle className="w-6 h-6 text-green-600"/>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-green-900 mb-1">30 Tage Geld zurück</h3>
                        <p className="text-green-800 text-sm">Nicht zufrieden? Du bekommst dein Geld zurück.</p>
                      </div>
                    </div>
                  </div>
                  <div className="trust-card bg-slate-50 rounded-[4px] p-6 border border-slate-200 flex-1" style={{borderLeft:'4px solid #f59e0b'}}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-[4px] flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-amber-600"/>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Nachzahlungen früh sehen</h3>
                        <p className="text-slate-600 text-sm">Sieh früh, ob dein Abschlag reicht – bevor die Abrechnung kommt.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12 scroll-reveal">Häufige Fragen</h2>
            <div className="space-y-4">
              {[
                {q:'Wie genau ist die Prognose?', a:'Die Genauigkeit steigt mit den eingegebenen Daten. Mit vollständigen Jahreswerten aus deiner ista-Abrechnung und regelmäßigen Zählerständen liefert nexoen eine solide Orientierung – je mehr Daten, desto besser die Prognose.', delay:0},
                {q:'Mit welchen Anbietern funktioniert nexoen?', a:'nexoen funktioniert mit allen gängigen Anbietern wie ista, Techem, Brunata und Minol. Du kannst deine Werte einfach manuell eingeben.', delay:100},
                {q:'Kann ich meine Daten exportieren?', a:'Ja. Alle Zählerstände und Berechnungen können als PDF exportiert werden. Ideal für deine Unterlagen oder zur Weitergabe an den Vermieter.', delay:200},
                {q:'Wie funktioniert die Heizkostenberechnung?', a:'Gib einfach deine monatlichen HKV-Einheiten (Heizkostenverteiler) ein. nexoen berechnet automatisch die 30/70-Aufteilung und wandelt alles direkt in Euro um – unabhängig vom Anbieter.', delay:300},
              ].map((faq,i)=>(
                <div key={i} className="bg-white rounded-[4px] border border-slate-200 overflow-hidden scroll-reveal" style={{transitionDelay:`${faq.delay}ms`}}>
                  <button className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors bg-transparent cursor-pointer border-none" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${openFaq===i?'rotate-180':''}`}/>
                  </button>
                  {openFaq===i && <div className="px-6 pb-5 text-slate-600 leading-relaxed">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-900/50 via-slate-900 to-slate-900"/>
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"/>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 scroll-reveal">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-5xl font-bold text-white mb-6 leading-snug">
              Hör auf zu raten.<br/><span className="gradient-text">Fang an zu wissen</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
              14 Tage kostenlos. Keine Kreditkarte. Kein Risiko.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="cta-button text-white px-10 py-5 rounded-[4px] font-bold text-lg shadow-2xl flex items-center justify-center gap-2">
                <span>Kostenlos starten</span>
                <ArrowRight className="w-5 h-5"/>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="sm:col-span-2">
                <NexoenLogo light />
                <p className="text-sm leading-relaxed max-w-sm mt-4">
                  Die smarte App für deine Nebenkostenabrechnung.<br/>Nie wieder Überraschungen, immer die volle Kontrolle.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Produkt</h4>
                <ul className="space-y-2 text-sm">
                  <li><button onClick={()=>scrollTo('features')} className="hover:text-teal-400 transition-colors cursor-pointer bg-transparent border-none text-slate-400">Funktionen</button></li>
                  <li><button onClick={()=>scrollTo('pricing')} className="hover:text-teal-400 transition-colors cursor-pointer bg-transparent border-none text-slate-400">Preise</button></li>
                  <li><Link href="/presse" className="hover:text-teal-400 transition-colors">Presse</Link></li>
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
              <div className="text-center md:text-left">
                <p className="text-sm">© 2026 nexoen. Alle Rechte vorbehalten.</p>
                <p className="text-xs mt-1" style={{ color: '#4B5563' }}>
                  EU-Streitschlichtung:{' '}
                  <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors underline">
                    ec.europa.eu/consumers/odr
                  </a>{' '}
                  – Wir nehmen nicht an Streitbeilegungsverfahren teil.
                </p>
              </div>
              <a
                href="https://www.tiktok.com/@nexoen.de"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all"
                aria-label="nexoen auf TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
