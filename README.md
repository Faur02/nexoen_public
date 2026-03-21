# nexoen

A German-language SaaS web app for tracking utility meters (Strom, Gas, Wasser, Heizung) with ista-style Heizkostenabrechnung forecasting.

**Live app**: [nexoen.de](https://nexoen.de)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **Payments**: Stripe
- **Styling**: Tailwind CSS + Shadcn/ui
- **Error tracking**: Sentry
- **Deployment**: Vercel

## Features

- Track electricity, gas, water, and heating meter readings
- Tariff management with yearly cost forecasting
- ista Heizkostenabrechnung integration — predicts Nachzahlung or Guthaben
- Unified Nebenkosten billing form (Heizung + Warmwasser + Betriebskosten)
- PDF report export
- Dark/light mode
- Fully responsive (mobile + tablet)
- Subscription billing (14-day trial, €19.99/year)

 ## About                                                                                                                                                         
  This app was built entirely as a hobby project using Claude (AI) as the sole developer.                                                                       
  No manual coding — every line was written by AI based on my ideas and direction.

  I'm curious what developers think: Can you tell? What would you do differently?
  Feel free to open an issue with feedback.

  This is honest, invites engagement, and will likely get interesting reactions from the dev community. People love seeing real-world AI-built apps.

## Local Setup

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your credentials:
   - Create a [Supabase](https://supabase.com) project and run the SQL files in order:
     1. `supabase-schema.sql`
     2. `supabase-schema-update.sql`
     3. `supabase-schema-settings-update.sql`
     4. `supabase-rls-migration.sql`
     5. `supabase-rls-performance-fix.sql`
     6. `supabase-pricing-migration.sql`
   - Create a [Stripe](https://stripe.com) account and set up a product with an annual price
   - (Optional) Create a [Sentry](https://sentry.io) project for error tracking
   - (Optional) Add a Google Analytics 4 property ID

3. Install dependencies and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    (auth)/          # Login, register, forgot password, reset password
    (dashboard)/     # Protected app pages: dashboard, meters, reports, settings
    (legal)/         # Impressum, Datenschutz, AGB
    api/             # API routes: Stripe checkout, billing portal, webhooks, cron
    auth/callback/   # Supabase OAuth/magic link callback
  components/
    charts/          # Recharts-based consumption and cost charts
    forms/           # Meter, reading, tariff, abrechnung forms
    ista/            # ista monthly consumption components
    layout/          # Navigation, header, footer
    settings/        # Settings tabs: profile, security, subscription, export
    ui/              # Shadcn/ui base components
  lib/
    actions/         # Server actions (auth-protected DB operations)
    calculations/    # Forecast, cost, and heating calculations
    config/          # Subscription tier config
    stripe/          # Stripe client/server helpers
    supabase/        # Supabase client/server/middleware helpers
  types/
    database.ts      # All TypeScript interfaces
```

## License
  © 2026 Faur Andrei. All Rights Reserved.

  This source code is published for inspection purposes only.
  Copying, modifying, or using this code in any project without explicit written permission is not allowed.
