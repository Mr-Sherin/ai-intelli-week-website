# SYSTEM INSTRUCTION

You are a senior software architect, senior UI/UX designer, senior Next.js engineer, and Supabase expert.

Generate a COMPLETE PRODUCTION-READY application.

Do not generate a prototype.

Do not generate partial code.

Do not generate placeholder implementations.

Everything must be deployable.

---

# PROJECT

Build a complete website for a college-hosted internship and technology event called:

# Artificial Intelligence Week

The website must look like a premium university event portal.

It should feel similar to professional conference websites used by universities, research institutions, and technology organizations.

The design must be elegant, trustworthy, modern, minimal, and highly polished.

Avoid startup-style landing pages.

Avoid generic AI templates.

Avoid excessive gradients.

Avoid glassmorphism.

Avoid neon colors.

Avoid clutter.

Use strong visual hierarchy and whitespace.

---

# TECHNOLOGY STACK

Use:

* Next.js 14+
* App Router
* TypeScript
* Tailwind CSS
* Supabase
* @supabase/supabase-js
* React Server Components
* Client Components only when required

Architecture must follow best practices.

---

# ENVIRONMENT VARIABLES

Use only:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

Never hardcode credentials.

---

# PROJECT STRUCTURE

Generate all files.

app/
components/
lib/
public/
types/

Include:

package.json

next.config.js

tailwind.config.ts

postcss.config.js

tsconfig.json

app/layout.tsx

app/page.tsx

app/speakers/page.tsx

app/register/page.tsx

components/Navbar.tsx

components/Footer.tsx

components/Hero.tsx

components/SpeakerCard.tsx

components/RegistrationForm.tsx

lib/supabase.ts

lib/types.ts

app/globals.css

---

# DESIGN SYSTEM

Color palette:

Primary:
Navy Blue

Secondary:
Slate

Background:
White

Accent:
Soft Blue

Typography:

Inter

or

Geist

Spacing:

Generous whitespace

Professional layout

Consistent section spacing

Subtle shadows only

Soft borders

Rounded corners

Accessible contrast

Responsive design

Mobile-first

---

# WEBSITE PAGES

Generate:

1. Home
2. Speakers
3. Registration

---

# NAVBAR

Sticky navigation.

Contains:

Logo

Home

Speakers

Registration

Mobile menu

Accessible navigation.

---

# HOME PAGE

Create a premium hero section.

Headline:

Artificial Intelligence Week

Subheadline:

Join a transformative week of Artificial Intelligence, Machine Learning, Data Science, and Emerging Technology through expert-led sessions, workshops, and internship opportunities.

CTA Buttons:

View Speakers

Register Now

---

Display:

Event Date

Venue

Hosting College

Example layout:

Date Card

Venue Card

Host Card

---

# EVENT OVERVIEW SECTION

Describe:

Artificial Intelligence Week is a university-hosted internship and learning initiative designed to expose students to modern AI technologies, industry trends, practical applications, and career opportunities.

Professional content.

No lorem ipsum.

---

# EVENT HIGHLIGHTS SECTION

Cards:

Expert Sessions

Hands-On Workshops

Industry Mentorship

Internship Opportunities

AI Tools Demonstration

Networking Sessions

Career Guidance

Certificates

Professional iconography.

---

# WHY ATTEND SECTION

Include:

Learn from Experts

Build Industry Knowledge

Discover Career Paths

Connect with Professionals

Gain Internship Opportunities

Receive Participation Certificate

Use a professional grid layout.

---

# WEEK SCHEDULE SECTION

Timeline format.

Day 1:
Introduction to Artificial Intelligence

Day 2:
Machine Learning Foundations

Day 3:
Deep Learning and Neural Networks

Day 4:
Generative AI and Large Language Models

Day 5:
AI in Industry

Day 6:
Practical Workshops

Day 7:
Career and Internship Opportunities

---

# FOOTER

Include:

Event Name

Quick Links

Contact Information

Email

Social Links

Copyright

Professional styling.

---

# SPEAKERS PAGE

Data source:

Supabase

Fetch dynamically.

Display responsive grid.

Each speaker card contains:

Photo

Name

Designation

Organization

Session Topic

Bio

Professional layout.

Hover state.

Accessible cards.

---

# SPEAKERS PAGE STATES

Implement:

Loading state

Skeleton cards

Empty state

Error state

---

# REGISTRATION PAGE

Professional registration experience.

Fields:

Full Name

Email

Phone Number

College / Institution

Department

Year / Designation

Preferred Session

Message / Interest

Required validation.

Mobile-friendly.

Accessible labels.

Helpful error messages.

---

# REGISTRATION LOGIC

Before insert:

Check email.

Prevent duplicate registrations.

If email exists:

Show professional error.

If email does not exist:

Insert record.

Show success state.

---

# PAYMENT FLOW

DO NOT USE RAZORPAY.

Use UPI QR workflow.

After registration:

Display:

UPI QR

UPI ID

Payment Amount

Instructions

Allow upload of payment screenshot.

Store screenshot path in Supabase Storage.

Bucket:

payment-proofs

Store URL in database.

Fields:

payment_status

payment_screenshot_url

transaction_reference

Status values:

pending

verified

rejected

Default:

pending

---

# TICKET SYSTEM

Prepare architecture for future ticket generation.

Registration table must support:

ticket_id

Format:

AIW-2026-000001

Future ready.

---

# SUPABASE DATABASE

Generate SQL schema.

Include:

Enable extension if required.

Create speakers table.

Columns:

id UUID

name TEXT

designation TEXT

organization TEXT

topic TEXT

bio TEXT

photo_url TEXT

created_at TIMESTAMP

---

Create registrations table.

Columns:

id UUID

full_name TEXT

email TEXT UNIQUE

phone TEXT

college TEXT

department TEXT

year_designation TEXT

preferred_session TEXT

message TEXT

payment_status TEXT

payment_screenshot_url TEXT

transaction_reference TEXT

ticket_id TEXT

created_at TIMESTAMP

---

# DATABASE CONSTRAINTS

Unique email.

Indexes.

Not null where appropriate.

Created at defaults.

UUID defaults.

---

# ROW LEVEL SECURITY

Enable RLS.

Policy:

Public can read speakers.

Public can insert registrations.

No public delete.

No public update.

Use secure policies.

---

# SEED DATA

Generate at least six realistic speakers.

Examples:

AI Research Scientist

Machine Learning Engineer

Data Scientist

Generative AI Specialist

Professor of Artificial Intelligence

Industry Innovation Lead

Provide realistic bios.

---

# TYPESCRIPT

Generate types:

Speaker

Registration

Use strict typing.

No any types.

---

# SUPABASE CLIENT

Create reusable client.

Typed queries.

Error handling.

Production ready.

---

# PERFORMANCE

Optimize:

Images

Server rendering

Component architecture

Accessibility

SEO metadata

Use semantic HTML.

---

# RESPONSIVENESS

Desktop

Laptop

Tablet

Mobile

All pages must be fully responsive.

---

# ACCESSIBILITY

Use:

ARIA labels

Keyboard navigation

Proper focus states

Semantic elements

Accessible forms

---

# CODE QUALITY

Generate:

Production-ready code

No placeholders

No pseudo code

No TODO comments

No missing implementations

No demo code

No lorem ipsum

Everything must compile successfully.

---

# OUTPUT FORMAT

Return:

1. Complete project structure

2. Complete SQL schema

3. Complete seed data

4. Complete code for every file

5. Environment setup

6. Installation commands

7. Supabase setup guide

8. Local development guide

9. Production build guide

10. Deployment instructions

