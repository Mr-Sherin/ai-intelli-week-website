import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Intelli Week",
  description: "Join a transformative week of Artificial Intelligence, Machine Learning, Data Science, and Emerging Technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative overflow-x-hidden transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Global Glowing Backgrounds */}
          <div className="fixed inset-0 z-[-2] bg-gradient-to-br from-blue-50 via-slate-50 to-fuchsia-50 dark:from-slate-950 dark:via-[#0f172a] dark:to-[#1e1b4b]" />
          <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-300/30 dark:bg-fuchsia-600/15 blur-[120px] pointer-events-none z-[-1]" />
          <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-300/30 dark:bg-cyan-600/15 blur-[120px] pointer-events-none z-[-1]" />
          
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
