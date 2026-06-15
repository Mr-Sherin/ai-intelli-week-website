import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Speaker Reviews — AI Intelli Week',
  description:
    'Share anonymous feedback about AI Intelli Week speakers and sessions (June 15–19, 2026). Your honest review helps improve every session.',
};

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
