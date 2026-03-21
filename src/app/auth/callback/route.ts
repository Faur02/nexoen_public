import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const raw = searchParams.get('redirect') || '/dashboard';
  // Reject anything that isn't a plain relative path (blocks //, /\, data:, javascript:, etc.)
  const redirect = /^\/[^/\\]/.test(raw) || raw === '/dashboard' ? raw : '/dashboard';
  const type = searchParams.get('type');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If this is a password recovery, redirect to password reset page
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
