import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const { ticketId, email, password } = await request.json();

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

    // 1. Fetch the ticket
    const { data: registration, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('ticket_id', ticketId)
      .single();

    if (fetchError || !registration) {
      return NextResponse.json({ error: 'Ticket not found in database.' }, { status: 404 });
    }

    // 2. Validate Payment Status
    if (registration.payment_status !== 'verified') {
      return NextResponse.json({ error: `Ticket invalid. Payment status is: ${registration.payment_status}` }, { status: 400 });
    }

    // 3. Attendance tracking by Date
    // Get the current date in IST (Asia/Kolkata) since the event is in India
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', { 
      timeZone: 'Asia/Kolkata', 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
    // en-CA format is YYYY-MM-DD
    const today = formatter.format(now);

    const VALID_EVENT_DATES = [
      '2026-06-15', '2026-06-16', '2026-06-17', '2026-06-18', '2026-06-19',
      '2026-06-22', '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26'
    ];

    if (!VALID_EVENT_DATES.includes(today)) {
      return NextResponse.json({ 
        success: false, 
        message: `Check-in not allowed. Today (${today}) is not a scheduled event date.`, 
        attendee: registration 
      });
    }

    const currentAttendance: string[] = Array.isArray(registration.attendance) ? registration.attendance : [];

    if (currentAttendance.includes(today)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Already checked in today!', 
        attendee: registration 
      });
    }

    // Append today's date
    const updatedAttendance = [...currentAttendance, today];

    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({ attendance: updatedAttendance })
      .eq('id', registration.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update attendance log: ' + updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Check-in successful!',
      attendee: registration
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
