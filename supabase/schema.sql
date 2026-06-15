-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create speakers table
CREATE TABLE speakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  organization TEXT NOT NULL,
  topic TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  year_designation TEXT NOT NULL,
  is_ieee_member BOOLEAN DEFAULT FALSE,
  ieee_member_id TEXT,
  is_mulearner BOOLEAN DEFAULT FALSE,
  muid TEXT,
  karma_points TEXT,
  level TEXT,
  message TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'rejected')),
  payment_screenshot_url TEXT,
  ieee_card_url TEXT,
  transaction_reference TEXT,
  ticket_id TEXT,
  ticket_qr_url TEXT,
  payment_submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Speakers Policies
-- Public can read speakers
CREATE POLICY "Public can read speakers"
  ON speakers
  FOR SELECT
  TO public
  USING (true);

-- No public insert, update, or delete on speakers

-- Registrations Policies
-- Public can insert registrations
CREATE POLICY "Public can insert registrations"
  ON registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- No public select, update, or delete on registrations
-- Admins only (assuming admin role or similar, but public has no read access by default)

-- Seed Data for Speakers
INSERT INTO speakers (name, designation, organization, topic, bio, photo_url) VALUES
('Dr. Elena Rostova', 'AI Research Scientist', 'Global Tech Labs', 'Future of LLMs', 'Dr. Rostova has 15 years of experience in deep learning, focusing on generative models and their ethical implications.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400'),
('Marcus Chen', 'Machine Learning Engineer', 'DataFlow Corp', 'Scalable ML Pipelines', 'Marcus specializes in building high-throughput machine learning infrastructure for enterprise applications.', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400&h=400'),
('Dr. Aisha Johnson', 'Data Scientist', 'Nexus Insights', 'Predictive Analytics in Healthcare', 'Dr. Johnson applies advanced predictive modeling to solve critical challenges in modern healthcare systems.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400'),
('David Kim', 'Generative AI Specialist', 'Creative AI Studio', 'AI in Creative Industries', 'David bridges the gap between technology and art, building AI tools that empower digital creators.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400'),
('Prof. Sarah Williams', 'Professor of Artificial Intelligence', 'State University', 'Ethical AI Frameworks', 'Prof. Williams is a leading voice in AI ethics, guiding policy and research on fair algorithms.', 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=400&h=400'),
('James Carter', 'Industry Innovation Lead', 'TechFrontiers', 'Enterprise AI Adoption', 'James helps Fortune 500 companies integrate artificial intelligence into their core business strategies.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400');

-- --------------------------------------------------------
-- Storage Bucket & Policies for Payment Proofs
-- --------------------------------------------------------

-- 1. Create the bucket (requires Supabase superuser, but works in SQL Editor)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public to view files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

-- 3. Allow public to upload files
CREATE POLICY "Public Insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-proofs');

-- --------------------------------------------------------
-- OTP Verification Table
-- --------------------------------------------------------
CREATE TABLE otps (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
-- Prevent public access, only accessible via service role in API

-- --------------------------------------------------------
-- Speaker Reviews Table (anonymous feedback, June 15-19)
-- --------------------------------------------------------
CREATE TABLE speaker_reviews (
  id            UUID                     PRIMARY KEY DEFAULT uuid_generate_v4(),
  speaker_name  TEXT                     NOT NULL,
  session_date  DATE                     NOT NULL,
  rating        SMALLINT                 NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text   TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast per-speaker aggregation
CREATE INDEX idx_speaker_reviews_speaker ON speaker_reviews (speaker_name);
CREATE INDEX idx_speaker_reviews_date    ON speaker_reviews (session_date);

-- Enable Row Level Security
ALTER TABLE speaker_reviews ENABLE ROW LEVEL SECURITY;

-- Public can insert (anonymous submissions through the API route)
CREATE POLICY "Public can insert speaker_reviews"
  ON speaker_reviews
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Public can read aggregate data (no identifying info stored, so safe)
CREATE POLICY "Public can read speaker_reviews"
  ON speaker_reviews
  FOR SELECT
  TO public
  USING (true);

-- No public update or delete
