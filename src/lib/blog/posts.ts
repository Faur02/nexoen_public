export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured?: boolean;
}

export const CATEGORIES = ['Alle', 'Heizkosten', 'Rechtliches', 'Tipps & Tricks'];

export const posts: BlogPost[] = [
  {
    slug: 'messdienste-vergleich',
    title: 'ista, Techem, Minol & Co.: Die wichtigsten Messdienste im Vergleich',
    excerpt: 'Wenn die Heizkostenabrechnung kommt, tauchen Namen wie ista, Techem oder Minol auf. Doch was machen diese Unternehmen genau – und gibt es Unterschiede, die Mieter kennen sollten? Wir vergleichen die wichtigsten Messdienstleister in Deutschland.',
    category: 'Heizkosten',
    date: '12. März 2026',
    readTime: '6 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1754734387891-36fcbb96f830?w=600&h=400&fit=crop',
    tags: ['#ista', '#Techem', '#Minol', '#Messdienst', '#Heizkosten'],
  },
  {
    slug: 'nebenkosten-zu-hoch-mieter',
    title: 'Nebenkosten zu hoch: Was ist normal? Vergleichswerte für Mieter',
    excerpt: 'Wie viel zahlen andere Mieter in Deutschland? Mit konkreten Vergleichswerten nach Wohnungsgröße erkennst du, ob deine Nebenkosten im normalen Bereich liegen – oder ob sich eine genauere Prüfung lohnt.',
    category: 'Tipps & Tricks',
    date: '11. März 2026',
    readTime: '5 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1755896487242-23cb0847e493?w=600&h=400&fit=crop',
    tags: ['#Nebenkosten', '#Nachzahlung', '#Tipps', '#Mietrecht'],
  },
  {
    slug: 'nebenkostenabrechnung-zustellung',
    title: 'Nebenkostenabrechnung: Bis wann muss sie kommen? Fristen für Mieter',
    excerpt: 'Nach deutschem Mietrecht gibt es eine klare gesetzliche Frist: Die Nebenkostenabrechnung muss spätestens 12 Monate nach Ende des Abrechnungszeitraums beim Mieter sein. Wer die Frist kennt, kann bares Geld sparen.',
    category: 'Rechtliches',
    date: '10. März 2026',
    readTime: '4 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1527377667-83c6c76f963f?w=600&h=400&fit=crop',
    tags: ['#Fristen', '#Mietrecht', '#Nebenkostenabrechnung', '#Rechtliches'],
  },
  {
    slug: 'nebenkostenabrechnung-fehler-erkennen',
    title: 'Nebenkostenabrechnung prüfen: Schritt für Schritt mit Rechenbeispielen',
    excerpt: 'Statt nur nach Fehlern zu suchen, kannst du deine Nebenkostenabrechnung auch selbst nachrechnen. Wir zeigen dir Schritt für Schritt, wie du Umlageschlüssel, Heizkosten und Vorauszahlungen selbst überprüfst – mit konkreten Rechenbeispielen.',
    category: 'Tipps & Tricks',
    date: '9. März 2026',
    readTime: '5 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1637763723578-79a4ca9225f7?w=600&h=400&fit=crop',
    tags: ['#Fehler', '#Abrechnung', '#Prüfen', '#Nebenkosten', '#Tipps'],
  },
  {
    slug: 'nebenkostenabrechnung-checkliste',
    title: 'Nebenkostenabrechnung prüfen: Die komplette Checkliste für Mieter',
    excerpt: 'Viele Mieter in Deutschland bekommen einmal im Jahr ihre Nebenkostenabrechnung – oft verbunden mit einer hohen Nachzahlung. Doch nur wenige wissen, dass Abrechnungen häufig Fehler enthalten. Mit der richtigen Prüfung erkennst du schnell, ob deine Abrechnung korrekt ist.',
    category: 'Tipps & Tricks',
    date: '5. März 2026',
    readTime: '8 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1625834318071-f28f0e51449b?w=1200&h=600&fit=crop',
    tags: ['#Nebenkosten', '#Abrechnung', '#Checkliste', '#Mietrecht', '#Sparen'],
    featured: true,
  },
  {
    slug: 'fehler-nebenkostenabrechnung',
    title: 'Typische Fehler in der Nebenkostenabrechnung: Worauf Mieter achten sollten',
    excerpt: 'Untersuchungen von Mietervereinen zeigen immer wieder: Ein Teil der Nebenkostenabrechnungen enthält Fehler. Wir zeigen dir die häufigsten Fehler und wie du sie in deiner eigenen Abrechnung erkennst.',
    category: 'Tipps & Tricks',
    date: '3. März 2026',
    readTime: '7 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1609877991470-875e44c7d71d?w=600&h=400&fit=crop',
    tags: ['#Fehler', '#Abrechnung', '#Nebenkosten', '#Tipps'],
  },
  {
    slug: 'nebenkostenabrechnung-zu-hoch',
    title: 'Nebenkostenabrechnung zu hoch: Was Mieter jetzt tun können',
    excerpt: 'Eine hohe Nachzahlung bedeutet nicht automatisch, dass die Abrechnung korrekt ist. Erfahre, warum Nebenkosten steigen können, wann eine Abrechnung ungewöhnlich hoch ist und was du als Mieter tun kannst.',
    category: 'Tipps & Tricks',
    date: '1. März 2026',
    readTime: '6 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop',
    tags: ['#Nebenkosten', '#Nachzahlung', '#Widerspruch', '#Tipps'],
  },
  {
    slug: 'nebenkosten-vermieter-abrechnen',
    title: 'Welche Nebenkosten darf der Vermieter abrechnen? Die wichtigsten Regeln',
    excerpt: 'Nicht alle Kosten darf der Vermieter auf Mieter umlegen. Das Gesetz legt genau fest, welche Betriebskosten erlaubt sind und welche nicht. Wer das weiß, kann seine Abrechnung viel besser prüfen.',
    category: 'Rechtliches',
    date: '27. Feb. 2026',
    readTime: '6 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1763729805496-b5dbf7f00c79?w=600&h=400&fit=crop',
    tags: ['#Mietrecht', '#Betriebskosten', '#Vermieter', '#Rechtliches'],
  },
  {
    slug: 'fristen-nebenkostenabrechnung',
    title: 'Fristen bei der Nebenkostenabrechnung: Diese Termine müssen Mieter kennen',
    excerpt: 'Im deutschen Mietrecht gelten klare Fristen – für Vermieter und Mieter. Wenn diese Termine überschritten werden, kann das große Auswirkungen haben. Alle wichtigen Fristen im Überblick.',
    category: 'Rechtliches',
    date: '25. Feb. 2026',
    readTime: '5 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1624969862293-b749659ccc4e?w=600&h=400&fit=crop',
    tags: ['#Fristen', '#Mietrecht', '#Abrechnungszeitraum', '#Rechtliches'],
  },
  {
    slug: 'nebenkostenabrechnung-verstehen',
    title: 'Nebenkostenabrechnung verstehen: Einfache Erklärung für Mieter',
    excerpt: 'Tabellen, Umlageschlüssel, Verbrauchskosten – viele Mieter verstehen ihre Abrechnung nur teilweise. Dabei folgt sie einer klaren Struktur. Wir erklären Schritt für Schritt, wie sie aufgebaut ist.',
    category: 'Tipps & Tricks',
    date: '22. Feb. 2026',
    readTime: '7 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&h=400&fit=crop',
    tags: ['#Abrechnung', '#Umlageschlüssel', '#Grundlagen', '#Tipps'],
  },
  {
    slug: 'nebenkosten-sparen-tipps',
    title: 'Nebenkosten sparen in der Wohnung: 10 einfache Tipps für Mieter',
    excerpt: 'Die Nebenkosten sind in den letzten Jahren stark gestiegen. Doch viele Mieter unterschätzen, wie stark das eigene Verhalten die Kosten beeinflusst. Mit diesen 10 Tipps sparst du nachhaltig.',
    category: 'Tipps & Tricks',
    date: '20. Feb. 2026',
    readTime: '6 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1488398729765-41b1c297157d?w=600&h=400&fit=crop',
    tags: ['#Sparen', '#Energie', '#Nebenkosten', '#Tipps'],
  },
  {
    slug: 'heizkosten-senken',
    title: 'Heizkosten senken in der Wohnung: Praktische Tipps für Mieter',
    excerpt: 'Heizkosten machen oft mehr als die Hälfte der Nebenkosten aus. Viele Mieter denken, sie haben wenig Einfluss. Doch durch richtiges Heizen und Lüften lässt sich oft eine Menge Energie sparen.',
    category: 'Heizkosten',
    date: '17. Feb. 2026',
    readTime: '7 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1599028274511-e02a767949a3?w=600&h=400&fit=crop',
    tags: ['#Heizkosten', '#Energie', '#Sparen', '#Heizung'],
  },
  {
    slug: 'einspruch-nebenkostenabrechnung',
    title: 'Einspruch gegen die Nebenkostenabrechnung: So legen Mieter Widerspruch ein',
    excerpt: 'Wenn Kosten nicht nachvollziehbar sind oder Fehler enthalten sind, haben Mieter das Recht auf Einspruch. Wir erklären, wann sich ein Widerspruch lohnt und wie du Schritt für Schritt vorgehst.',
    category: 'Rechtliches',
    date: '15. Feb. 2026',
    readTime: '6 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1764231467852-b609a742e082?w=600&h=400&fit=crop',
    tags: ['#Einspruch', '#Widerspruch', '#Mietrecht', '#Rechtliches'],
  },
  {
    slug: 'nebenkostenabrechnung-beispiel',
    title: 'Nebenkostenabrechnung Beispiel: So wird deine Abrechnung wirklich berechnet',
    excerpt: 'Wie kommen die Zahlen in meiner Abrechnung eigentlich zustande? Wir zeigen dir anhand eines realistischen Beispiels, wie Nebenkosten berechnet und auf Mieter in einem Mehrfamilienhaus verteilt werden.',
    category: 'Tipps & Tricks',
    date: '12. Feb. 2026',
    readTime: '5 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    tags: ['#Abrechnung', '#Beispiel', '#Umlageschlüssel', '#Grundlagen'],
  },
  {
    slug: 'ista-techem-abrechnung',
    title: 'ISTA oder Techem Abrechnung verstehen: Was diese Heizkostenabrechnungen bedeuten',
    excerpt: 'Viele Mieter erhalten ihre Heizkostenabrechnung von Dienstleistern wie ISTA oder Techem. Wir erklären, was diese Unternehmen machen, wie Heizkosten gemessen werden und worauf du achten solltest.',
    category: 'Heizkosten',
    date: '10. Feb. 2026',
    readTime: '6 Min. Lesezeit',
    image: 'https://images.unsplash.com/photo-1619140099965-06d74aaf51fa?w=600&h=400&fit=crop',
    tags: ['#ISTA', '#Techem', '#Heizkosten', '#Heizkostenabrechnung'],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getFeaturedPost(): BlogPost {
  return posts.find((p) => p.featured) ?? posts[0];
}

export function getGridPosts(): BlogPost[] {
  return posts.filter((p) => !p.featured);
}
