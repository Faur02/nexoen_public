import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { MarketingNav } from '@/components/layout/marketing-nav';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import { NexoenLogo } from '@/components/layout/nexoen-logo';
import { getPost, getGridPosts, posts } from '@/lib/blog/posts';
import { getPostContent } from '@/lib/blog/content';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | nexoen Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://nexoen.de/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      locale: 'de_DE',
      url: `https://nexoen.de/blog/${post.slug}`,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getGridPosts().filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);

  const DE_MONTHS: Record<string, string> = { 'Jan': '01', 'Feb': '02', 'März': '03', 'Apr': '04', 'Mai': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Okt': '10', 'Nov': '11', 'Dez': '12' };
  const dateMatch = post.date.match(/(\d+)\.\s+(\w+)\.?\s+(\d{4})/);
  const isoDate = dateMatch ? `${dateMatch[3]}-${DE_MONTHS[dateMatch[2]] ?? '01'}-${dateMatch[1].padStart(2, '0')}` : post.date;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: isoDate,
    dateModified: isoDate,
    author: { '@type': 'Organization', name: 'nexoen', url: 'https://nexoen.de' },
    publisher: { '@type': 'Organization', name: 'nexoen', url: 'https://nexoen.de' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://nexoen.de/blog/${post.slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        * { font-family: var(--font-outfit), 'Outfit', sans-serif !important; }
        .font-display { font-family: var(--font-display-lp), 'Playfair Display', serif !important; }
        .prose-content p { color: #64748b; line-height: 1.8; margin-bottom: 1.25rem; }
        .prose-content h2 { font-family: var(--font-display-lp), 'Playfair Display', serif !important; font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-top: 3rem; margin-bottom: 1rem; }
        .prose-content ul { color: #64748b; space-y: 0.75rem; padding-left: 1.5rem; margin-bottom: 2rem; }
        .prose-content ul li { margin-bottom: 0.5rem; }
        .blog-card-sm { transition: all 0.3s ease; }
        .blog-card-sm:hover { transform: translateY(-4px); box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1); }
        .blog-card-sm:hover .card-img { transform: scale(1.08); }
        .card-img { transition: transform 0.5s ease; }
      `}</style>

      <div className="bg-slate-50 text-slate-800 overflow-x-hidden min-h-screen flex flex-col">
        <MarketingNav />

        {/* Post Header */}
        <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10">
            <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Zurück zum Blog
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6 mt-4">
              <span className="px-3 py-1 bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium rounded-[4px]">{post.category}</span>
              <span className="text-slate-400 text-sm">{post.date}</span>
              <span className="text-slate-400 text-sm">{post.readTime}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-slate-900">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 py-6 border-y border-slate-200">
              <div className="px-3 py-2 rounded-[4px] bg-teal-50 border border-teal-100 flex-shrink-0">
                <NexoenLogo large />
              </div>
              <div>
                <p className="font-bold text-slate-900">nexoen Redaktion</p>
                <p className="text-sm text-slate-400">nexoen.de</p>
              </div>
              <div className="ml-auto flex gap-3">
                <button className="p-2 rounded-[4px] bg-slate-100 text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </button>
                <button className="p-2 rounded-[4px] bg-slate-100 text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Post Content */}
        <article className="pb-24 px-4 sm:px-6 lg:px-8 flex-1">
          <div className="max-w-3xl mx-auto">
            <div className="relative w-full h-64 sm:h-96 rounded-[4px] overflow-hidden mb-12 border border-slate-200">
              <Image src={post.image} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>

            <div className="prose-content">
              {post.slug !== 'nebenkostenabrechnung-checkliste' && getPostContent(post.slug, post.excerpt)}
              {post.slug === 'nebenkostenabrechnung-checkliste' && <><p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">
                {post.excerpt}
              </p>

              {/* Table of Contents */}
              <div className="bg-white border border-slate-200 rounded-[4px] p-6 my-8">
                <p style={{ fontFamily: 'var(--font-display-lp), Playfair Display, serif', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', fontSize: '1rem' }}>Inhaltsverzeichnis</p>
                <ol style={{ paddingLeft: '1.25rem', margin: 0, color: '#0d9488', fontSize: '0.9rem', lineHeight: '2' }}>
                  <li><a href="#was-ist" style={{ color: '#0d9488', textDecoration: 'none' }}>Was ist eine Nebenkostenabrechnung?</a></li>
                  <li><a href="#fristen" style={{ color: '#0d9488', textDecoration: 'none' }}>Welche Fristen gelten für Vermieter und Mieter?</a></li>
                  <li><a href="#checkliste" style={{ color: '#0d9488', textDecoration: 'none' }}>Die 10-Punkte-Checkliste zur Prüfung deiner Abrechnung</a></li>
                  <li><a href="#fehler" style={{ color: '#0d9488', textDecoration: 'none' }}>Typische Fehler in Nebenkostenabrechnungen</a></li>
                  <li><a href="#beispiel" style={{ color: '#0d9488', textDecoration: 'none' }}>Beispiel: Wann Kosten ungewöhnlich hoch sind</a></li>
                  <li><a href="#einfach-pruefen" style={{ color: '#0d9488', textDecoration: 'none' }}>Nebenkostenabrechnung einfach prüfen</a></li>
                  <li><a href="#fazit" style={{ color: '#0d9488', textDecoration: 'none' }}>Fazit</a></li>
                </ol>
              </div>

              {/* Was ist */}
              <h2 id="was-ist">Was ist eine Nebenkostenabrechnung?</h2>
              <p>
                Die Nebenkostenabrechnung (auch Betriebskostenabrechnung genannt) zeigt, welche laufenden Kosten für eine Wohnung im vergangenen Jahr angefallen sind.
              </p>
              <p>Dazu gehören zum Beispiel:</p>
              <ul>
                <li>Heizkosten</li>
                <li>Warmwasser</li>
                <li>Müllabfuhr</li>
                <li>Hausmeister</li>
                <li>Gebäudeversicherung</li>
                <li>Grundsteuer</li>
                <li>Allgemeinstrom im Treppenhaus</li>
              </ul>
              <p>
                Als Mieter zahlst du diese Kosten meist monatlich als Vorauszahlung. Am Ende des Jahres erstellt der Vermieter die Abrechnung und vergleicht Vorauszahlungen mit den tatsächlichen Kosten. Das Ergebnis ist entweder eine <strong style={{ color: '#c2410c' }}>Nachzahlung</strong> (du musst Geld nachzahlen) oder ein <strong style={{ color: '#0f766e' }}>Guthaben</strong> (du bekommst Geld zurück).
              </p>
              <p>
                Gerade bei steigenden Energiepreisen sind hohe Nachzahlungen keine Seltenheit. Wer seine Heiz- und Nebenkosten das ganze Jahr im Blick behält, erlebt am Ende keine bösen Überraschungen. Genau dafür gibt es <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline' }}>nexoen</Link>.
              </p>

              {/* Fristen */}
              <h2 id="fristen">Welche Fristen gelten für Nebenkostenabrechnungen?</h2>
              <p>Das deutsche Mietrecht enthält klare Regeln.</p>

              <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-6 my-6">
                <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Frist für den Vermieter</p>
                <p style={{ color: '#64748b', margin: '0 0 1rem' }}>
                  Der Vermieter muss die Nebenkostenabrechnung spätestens <strong>12 Monate</strong> nach Ende des Abrechnungszeitraums zustellen. Kommt sie später, kann er in vielen Fällen keine Nachzahlung mehr verlangen.
                </p>
                <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Frist für Mieter</p>
                <p style={{ color: '#64748b', margin: 0 }}>
                  Als Mieter hast du <strong>12 Monate Zeit</strong>, um Einwände einzulegen. Nachzahlungen müssen meist innerhalb von 30 Tagen bezahlt werden – du kannst aber unter Vorbehalt zahlen, wenn du die Abrechnung noch prüfen möchtest.
                </p>
              </div>

              {/* Checkliste */}
              <h2 id="checkliste">Die 10-Punkte-Checkliste zur Prüfung deiner Nebenkostenabrechnung</h2>
              <p>Mit dieser Checkliste kannst du schnell erkennen, ob deine Abrechnung plausibel ist.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  { n: 1, t: 'Abrechnungszeitraum prüfen', d: 'Eine Nebenkostenabrechnung muss sich immer auf maximal 12 Monate beziehen. Wenn der Zeitraum länger ist, stimmt etwas nicht.' },
                  { n: 2, t: 'Frist der Abrechnung kontrollieren', d: 'Prüfe, ob dein Vermieter die Abrechnung rechtzeitig geschickt hat. Wenn sie zu spät kommt, musst du eventuell keine Nachzahlung leisten.' },
                  { n: 3, t: 'Vorauszahlungen vergleichen', d: 'Vergleiche deine monatlichen Vorauszahlungen mit der Gesamtsumme der Kosten. Manchmal werden Vorauszahlungen falsch berechnet oder vergessen.' },
                  { n: 4, t: 'Umlageschlüssel prüfen', d: 'Viele Kosten werden nach Wohnfläche, Anzahl der Bewohner oder Verbrauch verteilt. Ein falscher Schlüssel kann deine Kosten stark erhöhen.' },
                  { n: 5, t: 'Heizkosten überprüfen', d: 'Heizkosten machen oft 50–70 % der Nebenkosten aus. Für 50 m² sind etwa 5.000–7.000 kWh Heizenergie pro Jahr realistisch. Deutlich höhere Werte können ein Hinweis auf Fehler sein.' },
                  { n: 6, t: 'Stromverbrauch einschätzen', d: 'Ein 2-Personen-Haushalt verbraucht im Durchschnitt etwa 2.500–3.000 kWh Strom pro Jahr. Liegt deine Abrechnung deutlich darüber, lohnt sich ein genauer Blick.' },
                  { n: 7, t: 'Nicht umlagefähige Kosten erkennen', d: 'Nicht alle Kosten darf der Vermieter auf Mieter umlegen. Verwaltungskosten, Reparaturen und Instandhaltung gehören nicht in die Nebenkostenabrechnung.' },
                  { n: 8, t: 'Einzelposten vergleichen', d: 'Schau dir Hausmeister, Gartenpflege und Reinigung genauer an. Manchmal werden hier ungewöhnlich hohe Beträge berechnet.' },
                  { n: 9, t: 'Zählerstände prüfen', d: 'Wenn Heiz- oder Wasserzähler verwendet werden, sollten die Zählerstände nachvollziehbar sein. Unplausible Werte können auf Fehler hinweisen.' },
                  { n: 10, t: 'Belegeinsicht verlangen', d: 'Du hast als Mieter das Recht, Originalrechnungen einzusehen – so kannst du prüfen, ob Kosten wirklich entstanden sind und korrekt verteilt wurden.' },
                ].map(({ n, t, d }) => (
                  <div key={n} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ flexShrink: 0, width: '2rem', height: '2rem', borderRadius: '4px', background: '#ccfbf1', color: '#0f766e', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>{n}</div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem', margin: '0 0 0.25rem' }}>{t}</p>
                      <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>{d}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mid-article CTA */}
              <div style={{ borderLeft: '4px solid #14b8a6', background: 'linear-gradient(to right, #f0fdfa, transparent)', borderRadius: '0 4px 4px 0', padding: '1.25rem 1.5rem', margin: '2rem 0' }}>
                <p style={{ color: '#0f172a', fontWeight: 600, margin: '0 0 0.5rem' }}>
                  Willst du deine Heiz- und Nebenkosten das ganze Jahr automatisch im Blick behalten?
                </p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>
                  nexoen trackt deinen Verbrauch laufend und warnt dich, bevor die Nachzahlung zu hoch wird.
                </p>
                <Link href="/register" style={{ color: '#0d9488', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  14 Tage kostenlos testen →
                </Link>
              </div>

              {/* Fehler */}
              <h2 id="fehler">Häufige Fehler in Nebenkostenabrechnungen</h2>
              <p>In der Praxis treten immer wieder ähnliche Fehler auf. Typische Beispiele:</p>
              <ul>
                <li>Falscher Umlageschlüssel</li>
                <li>Doppelte Kosten</li>
                <li>Falsche Wohnfläche</li>
                <li>Nicht umlagefähige Kosten (z. B. Verwaltung, Reparaturen)</li>
                <li>Falsche Zählerstände</li>
              </ul>
              <p>
                Gerade bei großen Wohnanlagen mit vielen Parteien können solche Fehler schnell entstehen.
              </p>

              {/* Beispiel */}
              <h2 id="beispiel">Beispiel: Wann Kosten ungewöhnlich hoch sind</h2>
              <div className="bg-slate-100 border border-slate-200 rounded-[4px] p-6 my-6">
                <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem' }}>Ein realistisches Beispiel</p>
                <p style={{ color: '#64748b', margin: '0 0 0.75rem' }}>
                  Ein 2-Personen-Haushalt verbraucht durchschnittlich etwa 2.200–3.000 kWh Strom pro Jahr. Wenn deine Abrechnung plötzlich <strong>5.000 kWh Strom</strong> oder extrem hohe Heizkosten zeigt, könnte das mehrere Gründe haben:
                </p>
                <ul style={{ color: '#64748b', paddingLeft: '1.25rem', margin: 0 }}>
                  <li>Falscher Zähler</li>
                  <li>Falsche Abrechnung</li>
                  <li>Falsche Umlage im Gebäude</li>
                </ul>
                <p style={{ color: '#64748b', margin: '0.75rem 0 0' }}>
                  In solchen Fällen lohnt sich eine genaue Prüfung – und ein Widerspruch lohnt sich oft.
                </p>
              </div>

              {/* Einfach prüfen */}
              <h2 id="einfach-pruefen">Nebenkostenabrechnung einfach prüfen</h2>
              <p>
                Die Nebenkostenabrechnung manuell zu prüfen kann zeitaufwendig sein. Viele Mieter wissen außerdem nicht genau, welche Kosten erlaubt sind und welche nicht.
              </p>
              <p>
                Digitale Tools können hier helfen. Die App <Link href="/" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen</Link> analysiert deine Nebenkostenabrechnung automatisch und zeigt dir:
              </p>
              <ul>
                <li>Ungewöhnlich hohe Kosten im Vergleich zu Referenzwerten</li>
                <li>Deine laufenden Heiz- und Wasserkosten in Echtzeit</li>
                <li>Eine Prognose, wie hoch deine Nachzahlung am Ende des Jahres voraussichtlich ausfällt</li>
              </ul>
              <p>
                So bekommst du schneller einen Überblick darüber, ob deine Abrechnung plausibel ist – und kannst rechtzeitig reagieren, bevor es zu spät ist.
              </p>

              <div className="bg-teal-50 border border-teal-100 rounded-[4px] p-6 my-8" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>nexoen – deine Nebenkosten immer im Griff</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                  Tracke Strom, Heizung und Wasser das ganze Jahr. Erhalte eine Prognose für deine Nachzahlung. Verstehe endlich, was auf deiner Abrechnung steht.
                </p>
                <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #0f766e, #14b8a6)', color: '#fff', fontWeight: 700, borderRadius: '4px', padding: '0.625rem 1.25rem', fontSize: '0.9rem', textDecoration: 'none', alignSelf: 'flex-start' }}>
                  Kostenlos starten – 14 Tage gratis
                </Link>
              </div>

              {/* Fazit */}
              <h2 id="fazit">Fazit</h2>
              <p>
                Die Nebenkostenabrechnung kann schnell mehrere hundert oder sogar tausend Euro Unterschied ausmachen. Deshalb lohnt es sich immer:
              </p>
              <ul>
                <li>Fristen prüfen</li>
                <li>Kosten vergleichen</li>
                <li>Ungewöhnliche Beträge hinterfragen</li>
                <li>Bei Bedarf Einspruch einlegen</li>
              </ul>
              <p>
                Mit einer systematischen Prüfung kannst du viele Fehler erkennen und unnötige Nachzahlungen vermeiden. Wenn du deine Abrechnung einfacher analysieren möchtest, kannst du <Link href="/register" style={{ color: '#0d9488', textDecoration: 'underline', fontWeight: 600 }}>nexoen kostenlos testen</Link> – und deine Nebenkosten endlich transparent verstehen.
              </p>
            </>}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-slate-200">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 text-sm rounded-[4px]">{tag}</span>
              ))}
            </div>

            {/* Author Box */}
            <div className="mt-12 bg-white rounded-[4px] p-8 border border-slate-200">
              <div className="flex items-start gap-6">
                <div className="px-4 py-3 rounded-[4px] bg-teal-50 border border-teal-100 flex-shrink-0">
                  <NexoenLogo large />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2">nexoen Redaktion</h3>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                    Wir helfen Mieter:innen in Deutschland, ihre Nebenkosten zu verstehen, Fehler in Abrechnungen zu erkennen und unnötige Nachzahlungen zu vermeiden.
                  </p>
                  <Link href="/blog" className="text-teal-600 font-medium text-sm hover:text-teal-700 transition-colors">Alle Artikel ansehen →</Link>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {related.length > 0 && (
              <div className="mt-16">
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-8">Ähnliche Artikel</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {related.map((rp) => (
                    <Link key={rp.slug} href={`/blog/${rp.slug}`} className="block">
                      <div className="blog-card-sm bg-white rounded-[4px] overflow-hidden border border-slate-200 cursor-pointer group">
                        <div className="h-32 overflow-hidden relative">
                          <Image src={rp.image} alt={rp.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="card-img object-cover" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-display font-bold text-slate-900 group-hover:text-teal-600 transition-colors leading-snug">{rp.title}</h4>
                          <p className="text-sm text-slate-400 mt-1">{rp.date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 bg-gradient-to-r from-teal-600 to-teal-500 rounded-[4px] p-8 text-white text-center">
              <h3 className="font-display text-2xl font-bold mb-3">Deine Nebenkosten im Griff?</h3>
              <p className="text-teal-100 mb-6">Teste nexoen 14 Tage kostenlos – keine Kreditkarte nötig.</p>
              <Link href="/register" className="inline-flex items-center gap-2 bg-white text-teal-700 hover:bg-teal-50 px-8 py-3 rounded-[4px] font-bold transition-colors">
                Kostenlos starten <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>

        <MarketingFooter />
      </div>
    </>
  );
}
