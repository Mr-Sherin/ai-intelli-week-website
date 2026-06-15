import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const { email, password } = await request.json();

    // Verify admin credentials
    const credentials = [
      { email: process.env.IEEE_EMAIL || 'ieee@aiweek.com', password: process.env.IEEE_PASSWORD || 'ieee2026' },
      { email: process.env.IEDC_EMAIL || 'iedc@aiweek.com', password: process.env.IEDC_PASSWORD || 'iedc2026' },
      { email: process.env.GDG_EMAIL || 'gdg@aiweek.com', password: process.env.GDG_PASSWORD || 'gdg2026' }
    ];
    const isValid = credentials.some(c => c.email === email && c.password === password);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      return NextResponse.json({ error: 'SMTP email credentials not configured on the server.' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch verified attendees who have NOT received their ticket yet
    const { data: registrations, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('payment_status', 'verified')
      .not('ticket_sent', 'eq', true);

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch registrations: ' + fetchError.message }, { status: 500 });
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: 'All verified attendees already have their tickets!' });
    }

    // Set up nodemailer
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let sentCount = 0;
    const failedEmails: string[] = [];

    for (const reg of registrations) {
      try {
        const ticketType = reg.is_ieee_member ? 'IEEE Member' : reg.is_mulearner ? 'Mulearner' : 'General Delegate';
        // QR code as a URL-based image (no extra package needed)
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(reg.ticket_id)}&margin=10&color=0f172a&bgcolor=ffffff`;

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your AI Intelli Week Ticket</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">
          
          <!-- Header gradient bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#06b6d4,#a855f7);height:6px;"></td>
          </tr>

          <!-- Top branding section -->
          <tr>
            <td style="background:#0f172a;padding:40px 40px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:0.15em;color:#06b6d4;text-transform:uppercase;">AI Intelli Week 2026</p>
              <h1 style="margin:0;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Your Ticket is Here!</h1>
              <p style="margin:16px 0 0;font-size:16px;color:#94a3b8;line-height:1.6;">Hi <strong style="color:#e2e8f0;">${reg.full_name}</strong>, you're all set. Below is your official pass for the event.</p>
            </td>
          </tr>

          <!-- Ticket card -->
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:20px;overflow:hidden;">
                <!-- Ticket top -->
                <tr>
                  <td style="padding:28px 28px 24px;background:linear-gradient(135deg,#0f172a,#1e293b);">
                    <p style="margin:0 0 4px;font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">AI Intelli Week 2026</p>
                    <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.15em;color:#06b6d4;text-transform:uppercase;">Premium Access Pass</p>
                    <p style="margin:0 0 2px;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Dates</p>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#e2e8f0;">June 15 &ndash; 22, 2026</p>
                  </td>
                </tr>

                <!-- Ticket divider -->
                <tr>
                  <td style="background:#1e293b;padding:0 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="12" style="width:12px;"><div style="width:12px;height:12px;background:#f1f5f9;border-radius:50%;margin-left:-6px;"></div></td>
                        <td style="border-top:2px dashed #334155;"></td>
                        <td width="12" style="width:12px;text-align:right;"><div style="width:12px;height:12px;background:#f1f5f9;border-radius:50%;margin-right:-6px;display:inline-block;"></div></td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Ticket bottom: details + QR -->
                <tr>
                  <td style="padding:24px 28px 28px;background:#1e293b;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:20px;">
                          <p style="margin:0 0 2px;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Attendee</p>
                          <p style="margin:0 0 16px;font-size:18px;font-weight:900;color:#ffffff;">${reg.full_name}</p>

                          <p style="margin:0 0 2px;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Ticket Type</p>
                          <p style="margin:0 0 16px;font-size:14px;font-weight:600;color:#e2e8f0;">${ticketType}</p>

                          <p style="margin:0 0 2px;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">College</p>
                          <p style="margin:0 0 16px;font-size:13px;font-weight:500;color:#cbd5e1;">${reg.college || 'N/A'}</p>

                          <p style="margin:0 0 2px;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Ticket ID</p>
                          <p style="margin:0;font-size:13px;font-family:monospace;font-weight:700;color:#06b6d4;letter-spacing:0.05em;">${reg.ticket_id}</p>
                        </td>
                        <td style="vertical-align:middle;text-align:center;min-width:120px;">
                          <div style="background:#ffffff;padding:8px;border-radius:12px;display:inline-block;">
                            <img src="${qrCodeUrl}" alt="Ticket QR Code" width="120" height="120" style="display:block;border-radius:6px;" />
                          </div>
                          <p style="margin:8px 0 0;font-size:10px;color:#64748b;font-weight:600;">Scan at entry</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Instructions -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="16" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#15803d;">&#10003; You&rsquo;re Confirmed!</p>
                    <p style="margin:0;font-size:13px;color:#166534;line-height:1.6;">Please bring this ticket (print or on your phone) to the event. The QR code above will be scanned at the entrance each day to mark your attendance. Save this email!</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WhatsApp CTA -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center;">
              <p style="margin:0 0 16px;font-size:14px;color:#64748b;">Stay updated — join the attendees WhatsApp group:</p>
              <a href="https://chat.whatsapp.com/CfPgFsO9f7k70Yhl4Oq5x9" style="display:inline-block;background:#25D366;color:#ffffff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;">Join WhatsApp Group</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">&copy; ${new Date().getFullYear()} AI Intelli Week. All rights reserved.<br/>This ticket was sent to ${reg.email}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        await transporter.sendMail({
          from: `"AI Intelli Week" <${process.env.SMTP_EMAIL}>`,
          to: reg.email,
          subject: `🎟️ Your AI Intelli Week Ticket — ${reg.full_name}`,
          html,
        });

        // Mark ticket as sent in the DB
        await supabaseAdmin
          .from('registrations')
          .update({ ticket_sent: true })
          .eq('id', reg.id);

        sentCount++;
      } catch (err) {
        console.error(`Failed to send ticket to ${reg.email}:`, err);
        failedEmails.push(reg.email);
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      failed: failedEmails.length,
      failedEmails,
      message: `Successfully sent ${sentCount} ticket(s).${failedEmails.length > 0 ? ` Failed for: ${failedEmails.join(', ')}` : ''}`,
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
