"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Schedule', href: '/#schedule' },
    { name: 'Speakers', href: '/speakers' },
    { name: 'Registration', href: '/register' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-white/40 dark:border-slate-800/40 shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-fuchsia-600 dark:from-cyan-400 dark:to-fuchsia-400 tracking-tight">AI Intelli Week</span>
            </Link>
          </div>
          <div className="hidden md:ml-8 md:flex md:space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="inline-flex items-center px-1 pt-1 text-sm font-bold text-slate-600 hover:text-navy dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-navy hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 absolute w-full left-0 shadow-xl z-50 transition-colors duration-300">
          <div className="space-y-1 pb-3 pt-2 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-navy dark:hover:text-white rounded-md transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
