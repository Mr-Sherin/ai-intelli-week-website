import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import dns from 'dns';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const payload = await request.json();

    if (!payload.email || !payload.email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (!payload.otp) {
      return NextResponse.json({ error: 'Verification code is required.' }, { status: 400 });
    }

    // 1. Verify OTP
    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from('otps')
      .select('*')
      .eq('email', payload.email)
      .eq('code', payload.otp)
      .single();

    if (otpError || !otpRecord) {
      return NextResponse.json({ error: 'Invalid verification code. Please try again.' }, { status: 400 });
    }

    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    // OTP is valid, delete it so it can't be reused
    await supabaseAdmin.from('otps').delete().eq('email', payload.email);

    const domain = payload.email.split('@')[1];
    try {
      const mxRecords = await dns.promises.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return NextResponse.json({ error: 'This email domain does not appear to be valid or able to receive emails.' }, { status: 400 });
      }
    } catch (e) {
      return NextResponse.json({ error: 'Please enter a valid, active email address.' }, { status: 400 });
    }

    const dbPayload: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ = {
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      college: payload.college,
      department: payload.department,
      year_designation: payload.yearDesignation,
      is_ieee_member: payload.isIeeeMember,
      ieee_member_id: payload.isIeeeMember ? payload.ieeeMemberId : null,
      ieee_card_url: payload.isIeeeMember ? payload.ieeeCardUrl : null,
      is_mulearner: payload.isMulearner,
      muid: payload.isMulearner ? payload.muId : null,
      karma_points: payload.isMulearner ? payload.karmaPoints : null,
      level: payload.isMulearner ? payload.level : null,
      preferred_session: 'Not Specified',
      message: payload.message,
      payment_status: 'pending'
    };

    // 1. Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('registrations')
      .select('id, payment_status, ticket_id')
      .eq('email', payload.email)
      .single();

    if (existingUser) {
      if (existingUser.payment_status === 'verified') {
        return NextResponse.json({ error: 'An account with this email is already registered and verified.' }, { status: 400 });
      }

      // 2. Update existing pending user
      dbPayload.ticket_id = existingUser.ticket_id; // Keep their original ticket ID
      dbPayload.ticket_qr_url = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${dbPayload.ticket_id}`;

      const { error: updateError } = await supabaseAdmin
        .from('registrations')
        .update(dbPayload)
        .eq('id', existingUser.id);

      if (updateError) throw new Error(updateError.message);
      
      return NextResponse.json({ success: true, ticketId: dbPayload.ticket_id });
    }

    // 3. Insert new user
    const ticketId = `AIW-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    dbPayload.ticket_id = ticketId;
    dbPayload.ticket_qr_url = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${ticketId}`;

    const { error: insertError } = await supabaseAdmin
      .from('registrations')
      .insert([dbPayload]);

    if (insertError) throw new Error(insertError.message);

    return NextResponse.json({ success: true, ticketId });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
