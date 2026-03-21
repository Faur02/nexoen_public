'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Lock, Server } from 'lucide-react';
import { MarketingNav } from '@/components/layout/marketing-nav';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import { NexoenLogo } from '@/components/layout/nexoen-logo';
import { posts, getFeaturedPost, getGridPosts, CATEGORIES } from '@/lib/blog/posts';

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Alle');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const featured = getFeaturedPost();
  const gridPosts = getGridPosts();

  const filtered = gridPosts.filter((p) => {
    const matchCat = activeCategory === 'Alle' || p.category === activeCategory;
    const matchSearch = search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [paginated]);

  return (
    <>
      <style>{`
        * { font-family: var(--font-outfit), 'Outfit', sans-serif !important; }
        .font-display { font-family: var(--font-display-lp), 'Playfair Display', serif !important; }
        .gradient-text {
          background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .scroll-reveal { opacity:0; transform:translateY(30px); transition:all 0.8s ease-out; }
        .scroll-reveal.active { opacity:1; transform:translateY(0); }
        .blog-card { transition: all 0.3s ease; }
        .blog-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1); }
        .blog-card:hover .card-img { transform: scale(1.08); }
        .card-img { transition: transform 0.5s ease; }
        .featured-card:hover .card-img { transform: scale(1.04); }
        .featured-card { transition: all 0.3s ease; }
        .featured-card:hover { box-shadow: 0 20px 50px -15px rgba(0,0,0,0.12); }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .line-clamp-3 { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .cta-button { background:linear-gradient(135deg,#0f766e 0%,#14b8a6 100%); transition:all 0.3s ease; position:relative; overflow:hidden; }
        .cta-button::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); transition:left 0.5s; }
        .cta-button:hover::before { left:100%; }
        .cta-button:hover { transform:translateY(-2px); box-shadow:0 10px 30px -10px rgba(15,118,110,0.5); }
      `}</style>

      <div className="bg-slate-50 text-slate-800 overflow-x-hidden min-h-screen flex flex-col">
        <MarketingNav />

        {/* Hero */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-teal-50/60 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              nexoen Blog
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900">
              Nebenkosten <span className="gradient-text">& Heizkosten</span> einfach verstehen
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Tipps, Checklisten und Erklärungen für Mieter in Deutschland – damit du deine Nebenkostenabrechnung verstehst und unnötige Nachzahlungen vermeidest.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        <section className="pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto scroll-reveal">
            <Link href={`/blog/${featured.slug}`} className="block">
              <div className="featured-card bg-white rounded-[4px] overflow-hidden border border-slate-200 cursor-pointer group">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="card-img object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent md:bg-gradient-to-r" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-[4px] uppercase tracking-wider">Featured</span>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                      <span>{featured.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{featured.readTime}</span>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-slate-900 group-hover:text-teal-600 transition-colors leading-snug">
                      {featured.title}
                    </h2>
                    <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-[4px] bg-teal-50 border border-teal-100 flex-shrink-0">
                        <NexoenLogo />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">nexoen Redaktion</p>
                        <p className="text-xs text-slate-400">nexoen.de</p>
                      </div>
                      <div className="ml-auto">
                        <span className="text-teal-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
                          Weiterlesen <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Filter & Search */}
        <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-[4px] font-medium text-sm whitespace-nowrap transition-colors cursor-pointer border-none ${
                    activeCategory === cat
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-[4px] px-4 py-2 pl-9 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 flex-1">
          <div className="max-w-7xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-24 text-slate-400">
                <p className="text-lg">Keine Artikel gefunden.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginated.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                    <article className="blog-card bg-white rounded-[4px] overflow-hidden border border-slate-200 cursor-pointer group h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
                        <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="card-img object-cover" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-bold rounded-[4px] border border-teal-100">{post.category}</span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                          <span>{post.date}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="font-display text-lg font-bold mb-3 text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-3 mb-4 leading-relaxed flex-1">{post.excerpt}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 rounded-[4px] bg-teal-50 border border-teal-100 flex-shrink-0">
                              <NexoenLogo />
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-teal-600" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-[4px] bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-10 h-10 rounded-[4px] font-medium transition-colors ${n === page ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-[4px] bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-900/50 via-slate-900 to-slate-900"/>
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"/>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 scroll-reveal">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Bereit für klare Nebenkosten?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Lass dich nie wieder von deiner Nebenkostenabrechnung überraschen.
              Teste nexoen 14 Tage kostenlos – ohne Kreditkarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/register" className="cta-button text-white px-10 py-5 rounded-[4px] font-bold text-lg shadow-2xl flex items-center justify-center gap-2">
                <span>Jetzt kostenlos starten</span>
                <ArrowRight className="w-5 h-5"/>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              {[
                [<ShieldCheck key="s" className="w-4 h-4 text-teal-500"/>, 'DSGVO-konform'],
                [<Lock key="l" className="w-4 h-4 text-teal-500"/>, 'SSL-verschlüsselt'],
                [<Server key="sv" className="w-4 h-4 text-teal-500"/>, 'Serverstandort EU'],
              ].map(([icon, label], i) => (
                <div key={i} className="flex items-center gap-2">{icon}<span>{label}</span></div>
              ))}
            </div>
          </div>
        </section>

        <MarketingFooter />
      </div>
    </>
  );
}
