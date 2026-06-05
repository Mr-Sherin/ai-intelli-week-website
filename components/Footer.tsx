import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy py-12 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">AI Intelli Week</h3>
            <p className="text-slate-300 text-sm max-w-sm mb-6">
              Join a transformative week of Artificial Intelligence, Machine Learning, Data Science, and Emerging Technology through expert-led sessions, workshops, and internship opportunities.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/ieee_sb_lmcst?igsh=MWJ1ZWkzcDZ0NG5tcg==" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors flex items-center gap-2 group" aria-label="IEEE Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-white">IEEE</span>
              </a>
              <a href="https://www.instagram.com/lmc_innovatex?igsh=MWxtYXBreHRmZmg5dw==" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors flex items-center gap-2 group" aria-label="IEDC Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-white">IEDC</span>
              </a>
              <a href="https://www.instagram.com/gdg_lmcst?igsh=Z2h6amc5YXZqcDA5" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors flex items-center gap-2 group" aria-label="GDG Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-white">GDG</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
              <li>
                <Link href="/" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/about#ieee" className="text-slate-300 hover:text-white text-sm transition-colors">
                  IEEE
                </Link>
              </li>
              <li>
                <Link href="/about#iedc" className="text-slate-300 hover:text-white text-sm transition-colors">
                  IEDC
                </Link>
              </li>
              <li>
                <Link href="/about#gdg" className="text-slate-300 hover:text-white text-sm transition-colors">
                  GDG
                </Link>
              </li>
              <li>
                <Link href="/about#mulearn" className="text-slate-300 hover:text-white text-sm transition-colors">
                  µLearn
                </Link>
              </li>
              <li>
                <Link href="/about#iic" className="text-slate-300 hover:text-white text-sm transition-colors">
                  IIC
                </Link>
              </li>
              <li>
                <Link href="/speakers" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Speakers
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-slate-300 hover:text-white text-sm transition-colors">
                  Registration
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-slate-300 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:ieeesblmc@gmail.com" className="hover:text-white transition-colors">
                  ieeesblmc@gmail.com
                </a>
              </li>
              <li className="text-slate-300 text-sm">
                Lourdes Matha College of Science and Technology
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} AI Intelli Week. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
