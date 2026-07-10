import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('localhost', '127.0.0.1');
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase credentials missing from environment' }, { status: 500 });
    }

    // Admin client to bypass RLS and fetch all registrations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { email, password } = await request.json();

    const credentials = [
      { email: process.env.IEEE_EMAIL || 'ieee@aiweek.com', password: process.env.IEEE_PASSWORD || 'ieee2026' },
      { email: process.env.IEDC_EMAIL || 'iedc@aiweek.com', password: process.env.IEDC_PASSWORD || 'iedc2026' },
      { email: process.env.GDG_EMAIL || 'gdg@aiweek.com', password: process.env.GDG_PASSWORD || 'gdg2026' }
    ];

    // Verify credentials against any of the authorized accounts
    const isValid = credentials.some(cred => cred.email === email && cred.password === password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .or('payment_screenshot_url.not.is.null,payment_status.eq.verified')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
