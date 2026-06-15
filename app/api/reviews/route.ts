import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Schedule ─────────────────────────────────────────────────────────────────
const SPEAKER_SESSIONS: Record<string, { speaker: string; topic: string }> = {
  '2026-06-15': { speaker: 'Abimel S B Kulumala', topic: 'AI Pentesting & Vibe Coding Basics' },
  '2026-06-16': { speaker: 'Jobin Selvanose',     topic: 'Anti Gravity & Vibe Coding Full Stack' },
  '2026-06-17': { speaker: 'Arjun G S',           topic: 'AI Building from Scratch' },
  '2026-06-18': { speaker: 'Alwi Sam',             topic: 'AI Integrated Software Development' },
  '2026-06-19': { speaker: 'Adithyan L',           topic: 'Agentic AI' },
};

// ─── IST helpers ──────────────────────────────────────────────────────────────
function getISTNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
}

function getISTDate(): string {
  return getISTNow().toISOString().slice(0, 10);
}

/** Minutes past midnight in IST */
function getISTMinuteOfDay(): number {
  const ist = getISTNow();
  return ist.getUTCHours() * 60 + ist.getUTCMinutes();
}

// Review window: 15:00 – 23:59 IST
const OPEN_MINUTE  = 15 * 60;      // 900
const CLOSE_MINUTE = 24 * 60 - 1;  // 1439

// ─── POST — submit a review ───────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { speaker_name, session_date, rating, review_text } = body;

    // Basic field validation
    if (!speaker_name || !session_date || rating == null) {
      return NextResponse.json(
        { error: 'Speaker name, session date, and rating are required.' },
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5.' },
        { status: 400 }
      );
    }

    // Check session date is a valid event day
    const sessionInfo = SPEAKER_SESSIONS[session_date];
    if (!sessionInfo) {
      return NextResponse.json(
        { error: 'No session is scheduled for that date.' },
        { status: 400 }
      );
    }

    // Check submitted speaker matches the scheduled speaker for that day
    if (sessionInfo.speaker !== speaker_name) {
      return NextResponse.json(
        { error: 'Speaker does not match the scheduled session.' },
        { status: 400 }
      );
    }

    // Enforce: review must be submitted ON the session day
    const todayIST = getISTDate();
    if (session_date !== todayIST) {
      return NextResponse.json(
        { error: 'Reviews can only be submitted on the day of the session.' },
        { status: 403 }
      );
    }

    // Enforce: review window 3:00 PM – 11:59 PM IST
    const minute = getISTMinuteOfDay();
    if (minute < OPEN_MINUTE || minute > CLOSE_MINUTE) {
      return NextResponse.json(
        { error: 'The review window is open from 3:00 PM to midnight IST.' },
        { status: 403 }
      );
    }

    // Insert into Supabase — no user data stored
    const { error: dbError } = await supabase.from('speaker_reviews').insert({
      speaker_name,
      session_date,
      rating,
      review_text: typeof review_text === 'string' ? review_text.trim() || null : null,
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save your review. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Review submission error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

// ─── GET — read reviews (for admin use) ──────────────────────────────────────
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('speaker_reviews')
      .select('speaker_name, session_date::text, rating, review_text, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch reviews.' }, { status: 500 });
    }

    return NextResponse.json({ reviews: data });
  } catch (err) {
    console.error('Review fetch error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
