import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('localhost', '127.0.0.1');
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { email, fullName } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes from now

    // 2. Save to Supabase (upsert)
    const { error: dbError } = await supabaseAdmin
      .from('otps')
      .upsert({
        email: email,
        code: otp,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      }, { onConflict: 'email' });

    if (dbError) {
      throw new Error('Failed to save OTP to database: ' + dbError.message);
    }

    // 3. Send email using Nodemailer
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      throw new Error('Email credentials are not configured on the server. Please add SMTP_EMAIL and SMTP_PASSWORD environment variables.');
    }

    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"AI Intelli Week" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Verify your AI Intelli Week Registration',
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0f172a; margin-bottom: 20px;">Verify your email address</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Hi ${fullName || 'there'},<br><br>
            Thank you for registering for AI Intelli Week! Please use the following 6-digit code to verify your email address and continue with your registration:
          </p>
          
          <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0284c7;">${otp}</span>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            This code will expire in 10 minutes. If you did not request this verification, please ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} AI Intelli Week. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (err: unknown) {
    console.error('OTP Error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Failed to send OTP' }, { status: 500 });
  }
}
