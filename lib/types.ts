export interface Speaker {
  id: string;
  name: string;
  designation: string;
  organization: string;
  topic: string;
  bio: string;
  photo_url?: string;
  created_at?: string;
}

export interface Registration {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year_designation: string;
  preferred_session: string;
  message?: string;
  payment_status?: 'pending' | 'verified' | 'rejected';
  payment_screenshot_url?: string;
  transaction_reference?: string;
  ticket_id?: string;
  created_at?: string;
}

export interface SpeakerReview {
  id?: string;
  speaker_name: string;
  session_date: string;   // YYYY-MM-DD
  rating: number;         // 1–5
  review_text?: string | null;
  created_at?: string;
}
