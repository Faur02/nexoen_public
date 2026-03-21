// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,

  // Scrub PII (emails, breadcrumbs, user data) before sending to Sentry
  beforeSend(event) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    if (event.message) {
      event.message = event.message.replace(emailRegex, '[email]');
    }
    if (event.exception?.values) {
      for (const ex of event.exception.values) {
        if (ex.value) ex.value = ex.value.replace(emailRegex, '[email]');
      }
    }
    // Scrub breadcrumb messages and data
    if (Array.isArray(event.breadcrumbs)) {
      for (const crumb of event.breadcrumbs) {
        if (crumb.message) crumb.message = crumb.message.replace(emailRegex, '[email]');
        if (crumb.data && typeof crumb.data === 'object') {
          for (const key of Object.keys(crumb.data)) {
            if (typeof (crumb.data as Record<string, unknown>)[key] === 'string') {
              (crumb.data as Record<string, string>)[key] = (crumb.data as Record<string, string>)[key].replace(emailRegex, '[email]');
            }
          }
        }
      }
    }
    // Strip user PII — keep only the opaque ID
    if (event.user) {
      event.user = { id: event.user.id };
    }
    return event;
  },
});
