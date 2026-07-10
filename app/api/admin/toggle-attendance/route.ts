import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('localhost', '127.0.0.1');
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const { id, date, email, password } = await request.json();

    const credentials = [
      { email: process.env.IEEE_EMAIL || 'ieee@aiweek.com', password: process.env.IEEE_PASSWORD || 'ieee2026' },
      { email: process.env.IEDC_EMAIL || 'iedc@aiweek.com', password: process.env.IEDC_PASSWORD || 'iedc2026' },
      { email: process.env.GDG_EMAIL || 'gdg@aiweek.com', password: process.env.GDG_PASSWORD || 'gdg2026' }
    ];

    // Verify credentials
    const isValid = credentials.some(cred => cred.email === email && cred.password === password);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch the record
    const { data: registration, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('attendance')
      .eq('id', id)
      .single();

    if (fetchError || !registration) {
      return NextResponse.json({ error: 'Record not found in database.' }, { status: 404 });
    }

    const currentAttendance: string[] = Array.isArray(registration.attendance) ? registration.attendance : [];
    
    // Toggle the date
    let updatedAttendance;
    if (currentAttendance.includes(date)) {
      // Remove it
      updatedAttendance = currentAttendance.filter(d => d !== date);
    } else {
      // Add it
      updatedAttendance = [...currentAttendance, date];
    }

    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({ attendance: updatedAttendance })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update attendance log: ' + updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      attendance: updatedAttendance
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
