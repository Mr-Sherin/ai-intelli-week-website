'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Lock,
  User,
  BookOpen,
  CalendarDays,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface SessionInfo {
  speaker: string;
  topic: string;
  date: string;        // YYYY-MM-DD
  displayDate: string; // e.g. "June 15"
  shortBio: string;
}

// ─── Schedule ──────────────────────────────────────────────────────────────────
const SESSIONS: Record<string, SessionInfo> = {
  '2026-06-15': {
    speaker: 'Abimel S B Kulumala',
    topic: 'AI Pentesting & Vibe Coding Basics',
    date: '2026-06-15',
    displayDate: 'June 15',
    shortBio: 'Cybersecurity meets AI — an introduction to AI-assisted pentesting and the emerging world of Vibe Coding.',
  },
  '2026-06-16': {
    speaker: 'Jobin Selvanose',
    topic: 'Anti Gravity & Vibe Coding Full Stack',
    date: '2026-06-16',
    displayDate: 'June 16',
    shortBio: 'A deep dive into full-stack development supercharged by AI tools and the Anti Gravity methodology.',
  },
  '2026-06-17': {
    speaker: 'Arjun G S',
    topic: 'AI Building from Scratch',
    date: '2026-06-17',
    displayDate: 'June 17',
    shortBio: 'From zero to model — understand how to design and build AI systems from the ground up.',
  },
  '2026-06-18': {
    speaker: 'Alwi Sam',
    topic: 'AI Integrated Software Development',
    date: '2026-06-18',
    displayDate: 'June 18',
    shortBio: 'How to weave AI seamlessly into production software workflows and modern development pipelines.',
  },
  '2026-06-19': {
    speaker: 'Adithyan L',
    topic: 'Agentic AI',
    date: '2026-06-19',
    displayDate: 'June 19',
    shortBio: 'Building autonomous AI agents that plan, reason, and act — the next frontier of applied AI.',
  },
};

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

// ─── IST helpers ───────────────────────────────────────────────────────────────
function getISTNow(): Date {
  const now = new Date();
  return new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
}

function getISTDate(): string {
  return getISTNow().toISOString().slice(0, 10);
}

/** Returns IST hour (0–23) */
function getISTHour(): number {
  return getISTNow().getUTCHours();
}

/** Minutes past midnight IST */
function getISTMinuteOfDay(): number {
  const ist = getISTNow();
  return ist.getUTCHours() * 60 + ist.getUTCMinutes();
}

// Review window: 15:00 – 23:59 IST
const OPEN_MINUTE  = 15 * 60;      // 3:00 PM  → 900
const CLOSE_MINUTE = 24 * 60 - 1;  // 11:59 PM → 1439

// ─── Star Rating Component ─────────────────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded p-1 transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`w-10 h-10 transition-all duration-150 drop-shadow-sm ${
                active >= star
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {active > 0 && (
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="text-base font-bold text-amber-500 dark:text-amber-400 tracking-wide"
          >
            {RATING_LABELS[active]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Blocker screen helper ─────────────────────────────────────────────────────
function BlockerScreen({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  children,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/50 dark:border-slate-800/50 rounded-3xl p-12 shadow-xl"
      >
        <div className={`w-20 h-20 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Icon className={`w-10 h-10 ${iconColor}`} />
        </div>
        <h1 className="text-3xl font-black text-navy dark:text-white mb-4 tracking-tight">{title}</h1>
        {children}
      </motion.div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ReviewPage() {
  const [istDate, setIstDate]     = useState('');
  const [minuteOfDay, setMinute]  = useState(0);
  const [rating, setRating]       = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedSpeaker, setSubmittedSpeaker] = useState('');
  const [submittedRating, setSubmittedRating]   = useState(0);
  const [error, setError]         = useState('');

  const refresh = useCallback(() => {
    setIstDate(getISTDate());
    setMinute(getISTMinuteOfDay());
  }, []);

  useEffect(() => {
    refresh();
    // Re-check every minute so the page auto-unlocks/locks at the correct time
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Derived state
  const todaySession   = SESSIONS[istDate] ?? null;
  const isBeforeEvent  = istDate < '2026-06-15';
  const isAfterEvent   = istDate > '2026-06-19';
  const isSessionDay   = Boolean(todaySession);
  const isWindowOpen   = minuteOfDay >= OPEN_MINUTE && minuteOfDay <= CLOSE_MINUTE;

  // ── Blocker: before event ──────────────────────────────────────────────────
  if (isBeforeEvent) {
    return (
      <BlockerScreen icon={Clock} iconBg="bg-slate-100 dark:bg-slate-800" iconColor="text-slate-400 dark:text-slate-500" title="Reviews Open Soon">
        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Speaker reviews open on{' '}
          <span className="font-bold text-cyan-600 dark:text-cyan-400">June 15, 2026</span> from{' '}
          <span className="font-bold text-cyan-600 dark:text-cyan-400">3:00 PM IST</span>. Come back then to share your feedback!
        </p>
      </BlockerScreen>
    );
  }

  // ── Blocker: event ended ───────────────────────────────────────────────────
  if (isAfterEvent) {
    return (
      <BlockerScreen icon={AlertCircle} iconBg="bg-slate-100 dark:bg-slate-800" iconColor="text-slate-400 dark:text-slate-500" title="Reviews Closed">
        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          The review window for AI Intelli Week 2026 has closed. Thank you for all the feedback shared during June 15–19.
        </p>
      </BlockerScreen>
    );
  }

  // ── Blocker: no session today (weekend / non-event day within date range) ──
  if (!isSessionDay) {
    return (
      <BlockerScreen icon={CalendarDays} iconBg="bg-slate-100 dark:bg-slate-800" iconColor="text-slate-400 dark:text-slate-500" title="No Session Today">
        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          There is no scheduled speaker session today. Check back on the next event day.
        </p>
      </BlockerScreen>
    );
  }

  // ── Blocker: before 3 PM ───────────────────────────────────────────────────
  if (!isWindowOpen && minuteOfDay < OPEN_MINUTE) {
    const hoursLeft  = Math.floor((OPEN_MINUTE - minuteOfDay) / 60);
    const minsLeft   = (OPEN_MINUTE - minuteOfDay) % 60;
    const countdown  = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft}m`;

    return (
      <BlockerScreen icon={Clock} iconBg="bg-amber-50 dark:bg-amber-900/30" iconColor="text-amber-500" title="Reviews Open at 3:00 PM">
        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
          Today's session with <span className="font-bold text-navy dark:text-white">{todaySession.speaker}</span> is underway.
          The review form opens at <span className="font-bold text-amber-600 dark:text-amber-400">3:00 PM IST</span> — after the session.
        </p>
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-300 font-bold text-lg px-5 py-2.5 rounded-xl">
          <Clock className="w-5 h-5" />
          Opens in {countdown}
        </div>
      </BlockerScreen>
    );
  }

  // ── Blocker: after midnight (shouldn't normally show, just safety) ─────────
  if (!isWindowOpen && minuteOfDay > CLOSE_MINUTE) {
    return (
      <BlockerScreen icon={Lock} iconBg="bg-slate-100 dark:bg-slate-800" iconColor="text-slate-400 dark:text-slate-500" title="Reviews Closed for Today">
        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          The review window has closed for today. Come back tomorrow for the next session!
        </p>
      </BlockerScreen>
    );
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, type: 'spring', stiffness: 200 }}
          className="max-w-lg w-full text-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/50 dark:border-slate-800/50 rounded-3xl p-12 shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </motion.div>
          <h2 className="text-3xl font-black text-navy dark:text-white mb-3 tracking-tight">Thank You!</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
            Your anonymous review for{' '}
            <span className="font-bold text-navy dark:text-white">{submittedSpeaker}</span> has been submitted. Your honest feedback helps our speakers grow.
          </p>
          <div className="flex items-center justify-center gap-1 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${i < submittedRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Only one review per session is recorded. See you tomorrow!
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Main review form ───────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError('Please give a star rating before submitting.'); return; }
    if (reviewText.trim().length === 0) { setError('Please share your thoughts before submitting.'); return; }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speaker_name: todaySession!.speaker,
          session_date: todaySession!.date,
          rating,
          review_text: reviewText.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Submission failed. Please try again.');
      } else {
        setSubmittedSpeaker(todaySession!.speaker);
        setSubmittedRating(rating);
        setSubmitted(true);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const istHour    = getISTHour();
  const timeLabel  = `${String(istHour).padStart(2, '0')}:00 IST`;

  return (
    <div className="w-full py-16 relative z-10">
      <div className="max-w-xl mx-auto px-4 sm:px-6">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Reviews are open · {timeLabel}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-navy dark:text-white tracking-tight mb-3">
            Rate Today&apos;s Session
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
            Anonymous · No sign-in required · 3 PM – Midnight IST
          </p>
        </motion.div>

        {/* ── Speaker Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="relative mb-8 overflow-hidden rounded-3xl border border-white/60 dark:border-slate-700/60 bg-gradient-to-br from-cyan-50 via-white to-fuchsia-50 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900 shadow-lg shadow-cyan-500/5"
        >
          {/* decorative glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-cyan-400/20 to-fuchsia-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-fuchsia-400/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-7 sm:p-9">
            {/* date badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/80 dark:bg-slate-700/80 border border-slate-200/60 dark:border-slate-600/60 text-slate-500 dark:text-slate-400 text-xs font-semibold px-3 py-1 rounded-full mb-5">
              <CalendarDays className="w-3.5 h-3.5" />
              {todaySession.displayDate}, 2026
            </div>

            {/* Speaker name */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-md shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Speaker</p>
                <h2 className="text-2xl font-black text-navy dark:text-white tracking-tight leading-tight">
                  {todaySession.speaker}
                </h2>
              </div>
            </div>

            {/* Topic */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-slate-700/80 border border-slate-200/60 dark:border-slate-600/60 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Session Topic</p>
                <p className="text-base font-bold text-slate-700 dark:text-slate-200 leading-snug">
                  {todaySession.topic}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60 pt-4">
              {todaySession.shortBio}
            </p>
          </div>
        </motion.div>

        {/* ── Review Form ── */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14 }}
          className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-800/50 rounded-3xl p-7 sm:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.05)] space-y-8"
        >

          {/* Star rating */}
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
              How would you rate this session?
            </p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-800" />

          {/* Written review */}
          <div>
            <label
              htmlFor="review-text"
              className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3"
            >
              Share your thoughts{' '}
              <span className="text-xs font-normal normal-case text-red-500 dark:text-red-400">*</span>
            </label>
            <textarea
              id="review-text"
              rows={5}
              maxLength={1000}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={`What did you learn from ${todaySession.speaker}'s session? What stood out, or what could be improved?`}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/60 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all leading-relaxed"
            />
            <div className="flex items-center justify-between mt-1.5 px-1">
              <p className="text-xs text-slate-400 dark:text-slate-500">Your response is completely anonymous.</p>
              <p className="text-xs text-slate-400">{reviewText.length} / 1000</p>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400 font-semibold">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            id="submit-review-btn"
            disabled={submitting || rating === 0}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white font-bold text-base rounded-2xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            {submitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Anonymous Review
              </>
            )}
          </button>
        </motion.form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
          Reviews accepted daily from <strong>3:00 PM – 11:59 PM IST</strong> · June 15–19, 2026
        </p>
      </div>
    </div>
  );
}
