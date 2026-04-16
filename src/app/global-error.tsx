"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '72px', fontWeight: 700, margin: '0 0 16px', color: '#5B8DEF', letterSpacing: '0.02em' }}>
          NEXO
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 12px' }}>
          Ein Fehler ist aufgetreten
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 32px', maxWidth: '360px', lineHeight: 1.6 }}>
          Wir haben diesen Fehler automatisch gemeldet und werden ihn beheben. Bitte versuchen Sie es später erneut.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#5B8DEF',
            color: '#fff',
            padding: '12px 32px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 500,
          }}
        >
          Zur Startseite
        </Link>
      </body>
    </html>
  );
}
