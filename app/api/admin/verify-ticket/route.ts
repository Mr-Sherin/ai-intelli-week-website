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
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    let currentAttendance: string[] = Array.isArray(registration.attendance) ? registration.attendance : [];

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

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
