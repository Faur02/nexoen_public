import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual as cryptoTimingSafeEqual, createHash } from 'crypto';
import { adminClient } from '@/lib/supabase/admin';

function timingSafeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return cryptoTimingSafeEqual(ha, hb);
}

export const runtime = 'nodejs';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const fmt = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const fmtMonth = (ym: string) => {
  const [y, m] = ym.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('de-DE', { month: 'long' });
};

const EMAIL_HEADER = `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f">
    <tr>
      <td style="padding:20px 32px">
        <span style="font-size:22px;font-weight:600;letter-spacing:-0.01em;font-family:system-ui,-apple-system,sans-serif"><span style="color:#FFFFFF">nexo</span><span style="color:#0d9488">en</span></span>
      </td>
    </tr>
  </table>`;

const EMAIL_FOOTER = `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EBEBEB;background:#FAFAF8">
    <tr>
      <td style="padding:16px 32px">
        <p style="margin:0;font-size:11px;color:#AAA;font-family:system-ui,-apple-system,sans-serif">
          nexoen &middot; <a href="https://nexoen.de" style="color:#AAA;text-decoration:none">nexoen.de</a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="https://nexoen.de/settings?tab=benachrichtigungen" style="color:#AAA;text-decoration:none">E-Mail-Einstellungen</a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a href="https://nexoen.de/impressum" style="color:#AAA;text-decoration:none">Impressum</a>
        </p>
      </td>
    </tr>
  </table>`;

function buildEmailHtml(params: {
  userName: string | null;
  hasOverdueMeters: boolean;
  forecastAmount: number | null;
  forecastType: 'nachzahlung' | 'guthaben' | null;
  monthlySavings: number | null;
  istaTrendText: string | null;
}): string {
  const { userName, hasOverdueMeters, forecastAmount, forecastType, monthlySavings, istaTrendText } = params;
  const greeting = userName ? `Hallo ${escapeHtml(userName)}` : 'Hallo';
  const now = new Date();
  const monthYear = now.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  const forecastBlock = forecastAmount !== null && forecastType !== null ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
      <tr>
        <td style="background:${forecastType === 'nachzahlung' ? '#FFF3E8' : '#E8F7F4'};border-radius:6px;padding:16px 20px;border-left:3px solid ${forecastType === 'nachzahlung' ? '#C97A3A' : '#1D7874'}">
          <p style="margin:0 0 3px;font-size:11px;font-weight:600;color:${forecastType === 'nachzahlung' ? '#C97A3A' : '#1D7874'};text-transform:uppercase;letter-spacing:0.8px;font-family:system-ui,-apple-system,sans-serif">
            Aktuelle Prognose
          </p>
          <p style="margin:0;font-size:24px;font-weight:700;color:${forecastType === 'nachzahlung' ? '#C97A3A' : '#1D7874'};font-family:Georgia,serif">
            ${forecastType === 'nachzahlung' ? 'Nachzahlung' : 'Guthaben'} ca. ${fmt.format(forecastAmount)}
          </p>
        </td>
      </tr>
    </table>` : '';

  const trendBlock = istaTrendText ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px">
      <tr>
        <td style="background:#F7F7F5;border-radius:4px;padding:12px 16px;font-size:13px;color:#444;font-family:system-ui,-apple-system,sans-serif">
          &#128202; ${istaTrendText}
        </td>
      </tr>
    </table>` : '';

  const savingsBlock = monthlySavings ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px">
      <tr>
        <td style="background:#F7F7F5;border-radius:4px;padding:12px 16px;font-size:13px;color:#444;font-family:system-ui,-apple-system,sans-serif">
          &#128161; Tipp: Lege monatlich <strong>${fmt.format(monthlySavings)}</strong> zurück &mdash; dann trifft dich die Jahresabrechnung nicht unvorbereitet.
        </td>
      </tr>
    </table>` : '';

  const overdueBlock = hasOverdueMeters
    ? `<p style="margin:0 0 20px;font-size:13px;color:#C97A3A;font-weight:500;font-family:system-ui,-apple-system,sans-serif">
        &#9888; Einige Zähler wurden seit über 30 Tagen nicht abgelesen.
        <a href="https://nexoen.de/meters" style="color:#C97A3A;font-weight:600">Jetzt eintragen &rarr;</a>
       </p>`
    : `<p style="margin:0 0 20px;font-size:13px;color:#666;font-family:system-ui,-apple-system,sans-serif">
        Trag kurz deine aktuellen Zählerstände ein, damit deine Prognose aktuell bleibt.
       </p>`;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>nexoen Monatsbericht ${monthYear}</title>
</head>
<body style="margin:0;padding:0;background:#F0F0EE;font-family:system-ui,-apple-system,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.08)">
          <tr><td>${EMAIL_HEADER}</td></tr>
          <tr>
            <td style="padding:32px 32px 28px">
              <p style="margin:0 0 4px;font-size:19px;font-weight:600;color:#1A1A1A;font-family:Georgia,serif">${greeting},</p>
              <p style="margin:0 0 24px;font-size:13px;color:#888">dein nexoen-Monatsbericht &mdash; ${monthYear}</p>

              ${forecastBlock}
              ${trendBlock}
              ${savingsBlock}
              ${overdueBlock}

              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0f0f0f;border-radius:4px">
                    <a href="https://nexoen.de/dashboard"
                       style="display:inline-block;padding:12px 24px;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:14px;font-family:system-ui,-apple-system,sans-serif">
                      Dashboard öffnen &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td>${EMAIL_FOOTER}</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildTrialExpiryHtml(greeting: string, daysLeft: number): string {
  const daysText = `${daysLeft} ${daysLeft === 1 ? 'Tag' : 'Tagen'}`;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Deine nexoen-Testphase läuft ab</title>
</head>
<body style="margin:0;padding:0;background:#F0F0EE;font-family:system-ui,-apple-system,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.08)">
          <tr><td>${EMAIL_HEADER}</td></tr>
          <tr>
            <td style="padding:32px 32px 28px">
              <p style="margin:0 0 4px;font-size:19px;font-weight:600;color:#1A1A1A;font-family:Georgia,serif">${greeting},</p>
              <p style="margin:0 0 20px;font-size:13px;color:#888">deine kostenlose Testphase endet in <strong style="color:#1A1A1A">${daysText}</strong>.</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
                <tr>
                  <td style="background:#F7F7F5;border-radius:6px;padding:16px 20px">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#1A1A1A">Was du mit nexoen bekommst:</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#444">&#10003; &nbsp;Nebenkostenprognose aus ista-Daten</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#444">&#10003; &nbsp;Strom- &amp; Gasverbrauch im Blick</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#444">&#10003; &nbsp;PDF-Berichte &amp; Datenexport</p>
                    <p style="margin:0;font-size:13px;color:#444">&#10003; &nbsp;Monatliche Erinnerungen per E-Mail</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:13px;color:#444">Alles für <strong>19,99&nbsp;€/Jahr</strong> &mdash; weniger als 2&nbsp;€ pro Monat.</p>

              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#E6A65C;border-radius:4px">
                    <a href="https://nexoen.de/settings?tab=abonnement"
                       style="display:inline-block;padding:12px 24px;color:#0f0f0f;text-decoration:none;font-weight:700;font-size:14px;font-family:system-ui,-apple-system,sans-serif">
                      Jetzt Jahresabo sichern &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td>${EMAIL_FOOTER}</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Vercel Cron sends GET requests — POST is not configurable
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized calls (timing-safe comparison)
  const secret = request.headers.get('x-cron-secret') ?? '';
  const expected = process.env.CRON_SECRET ?? '';
  if (!expected || !timingSafeEqual(secret, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
  }

  const supabase = adminClient;

  // Send trial expiry reminders (1–3 days before trial ends)
  const now = new Date();
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const { data: trialExpiring } = await supabase
    .from('profiles')
    .select('email, name, trial_ends_at')
    .eq('subscription_tier', 'trial')
    .gte('trial_ends_at', now.toISOString())
    .lte('trial_ends_at', in3Days.toISOString());

  for (const profile of trialExpiring || []) {
    const daysLeft = Math.max(0, Math.ceil((new Date(profile.trial_ends_at!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const greeting = profile.name ? `Hallo ${escapeHtml(profile.name)}` : 'Hallo';
    const html = buildTrialExpiryHtml(greeting, daysLeft);

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'nexoen <support@nexoen.de>',
        to: [profile.email],
        subject: `Deine nexoen-Testphase endet in ${daysLeft} ${daysLeft === 1 ? 'Tag' : 'Tagen'}`,
        html,
      }),
    });
  }

  // Fetch all users with reminders enabled
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, name, email_reminders_enabled')
    .eq('email_reminders_enabled', true);

  if (error || !profiles) {
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;

  for (const profile of profiles) {
    try {
      // Check for overdue meters (no reading in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: meters } = await supabase
        .from('meters')
        .select('id')
        .eq('user_id', profile.id)
        .is('category_id', null); // only custom meters (Strom/Gas)

      let hasOverdueMeters = false;
      if (meters && meters.length > 0) {
        const meterIds = meters.map(m => m.id);
        const { data: recentReadings } = await supabase
          .from('readings')
          .select('meter_id')
          .in('meter_id', meterIds)
          .gte('reading_date', thirtyDaysAgo.toISOString().split('T')[0]);

        const readMeters = new Set((recentReadings || []).map(r => r.meter_id));
        hasOverdueMeters = meterIds.some(id => !readMeters.has(id));
      }

      // Get forecast + billing period data
      const { data: abrechnungSetup } = await supabase
        .from('abrechnung_setup')
        .select('forecast_snapshot_amount, vorauszahlung_monthly, abrechnungszeitraum_start')
        .eq('user_id', profile.id)
        .single();

      let forecastAmount: number | null = null;
      let forecastType: 'nachzahlung' | 'guthaben' | null = null;
      let monthsElapsed = 0;

      if (abrechnungSetup?.forecast_snapshot_amount != null && abrechnungSetup.vorauszahlung_monthly > 0) {
        const annual = abrechnungSetup.vorauszahlung_monthly * 12;
        const diff = abrechnungSetup.forecast_snapshot_amount - annual;
        forecastAmount = Math.abs(diff);
        forecastType = diff > 0 ? 'nachzahlung' : 'guthaben';
      }

      if (abrechnungSetup?.abrechnungszeitraum_start) {
        const start = new Date(abrechnungSetup.abrechnungszeitraum_start);
        const now = new Date();
        monthsElapsed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
      }

      // Sparempfehlung
      const monthsRemaining = Math.max(0, 12 - monthsElapsed);
      const monthlySavings = forecastType === 'nachzahlung' && forecastAmount !== null && forecastAmount > 50 && monthsRemaining > 1
        ? Math.ceil(forecastAmount / monthsRemaining)
        : null;

      // Month-over-month ista trend (heizung category)
      let istaTrendText: string | null = null;
      const { data: heizungCategory } = await supabase
        .from('meter_categories')
        .select('id')
        .eq('user_id', profile.id)
        .eq('slug', 'heizung')
        .single();

      if (heizungCategory) {
        const { data: istaRows } = await supabase
          .from('ista_consumption')
          .select('month, units')
          .eq('category_id', heizungCategory.id)
          .order('month', { ascending: false })
          .limit(2);

        if (istaRows && istaRows.length >= 2) {
          const cur = istaRows[0];
          const prev = istaRows[1];
          if (prev.units > 0) {
            const changePct = Math.round((cur.units - prev.units) / prev.units * 100);
            if (Math.abs(changePct) < 3) {
              istaTrendText = `Heizverbrauch im ${fmtMonth(cur.month)}: stabil gegenüber ${fmtMonth(prev.month)}`;
            } else if (changePct > 0) {
              istaTrendText = `Heizverbrauch im ${fmtMonth(cur.month)}: ${changePct}% mehr als ${fmtMonth(prev.month)} ↑`;
            } else {
              istaTrendText = `Heizverbrauch im ${fmtMonth(cur.month)}: ${Math.abs(changePct)}% weniger als ${fmtMonth(prev.month)} ↓`;
            }
          }
        }
      }

      const html = buildEmailHtml({
        userName: profile.name,
        hasOverdueMeters,
        forecastAmount,
        forecastType,
        monthlySavings,
        istaTrendText,
      });

      const monthYear = now.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'nexoen <support@nexoen.de>',
          to: [profile.email],
          subject: `Dein nexoen-Monatsbericht — ${monthYear}`,
          html,
        }),
      });

      if (res.ok) {
        sent++;
      } else {
        failed++;
        console.error(`Failed to send reminder (user ${profile.id}):`, await res.text());
      }
    } catch (err) {
      failed++;
      console.error(`Error processing reminder for ${profile.id}:`, err);
    }
  }

  return NextResponse.json({ sent, failed, total: profiles.length });
}
