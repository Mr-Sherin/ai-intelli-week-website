"use client";

import Link from 'next/link';
import { Calendar, MapPin, Building } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative overflow-hidden w-full">
      <div className="absolute inset-0 pointer-events-none bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: "url('/hero_ai.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white tracking-tight mb-6 max-w-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          AI Intelli Week
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-200 max-w-2xl mb-10 text-balance leading-relaxed font-light"
        >
          Join a transformative week of Artificial Intelligence, Machine Learning, Data Science, and Emerging Technology through expert-led sessions, workshops, and internship opportunities.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link
            href="/register"
            className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 shadow-[0_4px_15px_rgba(6,182,212,0.3)] transition-all hover:shadow-[0_6px_20px_rgba(217,70,239,0.4)] hover:scale-105 active:scale-95"
          >
            Register Now
          </Link>
          <Link
            href="/speakers"
            className="inline-flex justify-center items-center px-8 py-4 border border-white/20 text-base font-bold rounded-full text-white bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            View Speakers
          </Link>
        </motion.div>
        
        {/* Event Details Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
          style={{ perspective: "1000px" }}
        >
          {[
            { icon: Calendar, title: 'Date', desc: 'June 15 - 22, 2026' },
            { icon: MapPin, title: 'Venue', desc: 'Lourdes Matha College of Science and Technology' },
            { icon: Building, title: 'Host', desc: 'IEEE, IEDC, GDG' }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={i}
                whileHover={{ rotateX: 5, rotateY: 5, scale: 1.05, z: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors duration-300 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-2xl p-6 text-left flex items-start space-x-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)] relative overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-slate-800/40 to-transparent opacity-80 pointer-events-none"></div>
                <Icon className="text-cyan-600 dark:text-cyan-400 w-8 h-8 shrink-0 mt-1" style={{ transform: "translateZ(15px)" }} />
                <div style={{ transform: "translateZ(15px)" }}>
                  <h3 className="text-navy dark:text-white font-bold mb-1 tracking-wide">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{item.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  );
}
