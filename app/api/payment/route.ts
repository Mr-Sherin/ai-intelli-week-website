import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('localhost', '127.0.0.1');
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase credentials missing from environment' }, { status: 500 });
    }

    // Admin client to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { email, publicUrl, txnRef } = await request.json();

    if (!email || !publicUrl || !txnRef) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Normalize transaction ID to prevent bypass via case or spacing differences
    const cleanTxnRef = txnRef.replace(/[\s\-_]/g, '').toUpperCase();

    // Check if the transaction ID is already used by another user
    const { data: existingTxn, error: checkError } = await supabaseAdmin
      .from('registrations')
      .select('email')
      .eq('transaction_reference', cleanTxnRef)
      .neq('email', email)
      .limit(1);

    if (checkError) {
      return NextResponse.json({ error: 'Error validating transaction reference' }, { status: 500 });
    }

    if (existingTxn && existingTxn.length > 0) {
      return NextResponse.json({ error: 'This UPI Transaction ID has already been used by another user.' }, { status: 400 });
    }
    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({
        payment_status: 'pending',
        payment_screenshot_url: publicUrl,
        transaction_reference: cleanTxnRef,
        payment_submitted_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
