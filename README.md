# AI Intelli Week Website

![AI Intelli Week]

A modern, high-performance web application built for the **AI Intelli Week** internship and learning initiative. The event is organized by Lourdes Matha College of Science and Technology in collaboration with **IEEE**, **IEDC**, **GDG**, **IIC**, and **µLearn**.

## 🚀 Key Features

- **Dynamic Registration Flow:** A seamless, multi-step registration form.
- **OTP Email Verification:** Built-in email OTP verification to ensure valid attendee registrations.
- **AI-Powered OCR Payment Validation:** Utilizes `tesseract.js` to automatically scan uploaded UPI payment screenshots (checking for transaction IDs, time of payment, and specific amounts).
- **Admin Dashboard:** A secure backend interface connected to Supabase to manage users, verify IEEE cards, and export attendance records directly to Excel.
- **Full Theming Support:** Seamless Light and Dark modes integrated out-of-the-box using Tailwind CSS v4 and `next-themes`.
- **Interactive UI:** Smooth, engaging animations powered by Framer Motion.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database / Backend:** [Supabase](https://supabase.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **OCR:** [Tesseract.js](https://tesseract.projectnaptha.com/)
- **Email Service:** Nodemailer

## 📂 Site Structure & Pages

The application is organized into the following main routes:

- **`/` (Home):** The main landing page showcasing the AI Intelli Week event details, countdown, and calls to action.
- **`/about`:** Provides more information about the event, its objectives, and the organizing chapters.
- **`/speakers`:** Displays the schedule and profiles of the speakers for the week-long sessions.
- **`/register`:** The dynamic, multi-step registration form with OTP and OCR payment validation.
- **`/review`:** A page where attendees can submit reviews and ratings for sessions.
- **`/ieee-guide`:** Instructions and guidance for IEEE members registering for the event.
- **`/admin`:** The secure admin dashboard for managing registrations, verifying tickets, and scanning QR codes.

## 🔐 Accessing the Admin Dashboard

The Admin Dashboard provides real-time data on registrations, OTP verification statuses, and tools to approve/reject uploaded payment screenshots.

1. Navigate to `/admin` in your browser.
2. Enter your authorized administrator email and password credentials. 
3. After logging in, you'll be able to view live registrations, scan QR codes for attendance, export data to CSV, and send tickets to verified attendees.

## 👨‍💻 Developed By

**Sherin R Fertin**

# About Me

Hi, I'm Sherin, a B.Tech Computer Science student with a strong interest in web development, AI, and entrepreneurship.I enjoy building modern, responsive, and user-focused applications while continuously learning new technologies.This repository contains a website developed by me to demonstrate my development skills and creativity.

Feel free to explore the project and share your feedback.

📫 **Connect with me on LinkedIn:** [Sherin R Fertin](https://www.linkedin.com/in/sherin-r-fertin-3b50b3382)

---

## ⚙️ Local Development

To run this project locally, follow these steps:

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Environment Variables:**
   Create a `.env.local` file and add your Supabase and Email configurations:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open your browser** and navigate to `http://localhost:3000`.
