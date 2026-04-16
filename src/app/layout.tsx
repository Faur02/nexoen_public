import type { Metadata } from "next";
import { Source_Serif_4, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieNoticeLoader } from "@/components/cookie-notice-loader";
import { AnalyticsProvider } from "@/components/analytics-provider";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display-lp",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "nexoen – Nebenkostenabrechnung & Heizkosten im Blick",
  description: "Verfolge deine Nebenkosten, Heizkosten und Zählerstände das ganze Jahr. Erkenne frühzeitig ob eine Nachzahlung droht – 3 Monate kostenlos testen.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nexoen.de'),
  alternates: {
    canonical: 'https://nexoen.de',
  },
  openGraph: {
    title: "nexoen – Nebenkostenabrechnung & Heizkosten im Blick",
    description: "Verfolge deine Nebenkosten, Heizkosten und Zählerstände das ganze Jahr. Erkenne frühzeitig ob eine Nachzahlung droht – 3 Monate kostenlos testen.",
    siteName: "nexoen",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nexoen – Nebenkostenabrechnung & Heizkosten im Blick",
    description: "Verfolge deine Nebenkosten, Heizkosten und Zählerstände das ganze Jahr. Erkenne frühzeitig ob eine Nachzahlung droht.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${sourceSerif.variable} ${inter.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            {children}
            <CookieNoticeLoader />
          </TooltipProvider>
        </ThemeProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
