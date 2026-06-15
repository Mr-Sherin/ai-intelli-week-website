"use client";

import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegistrationForm() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white/80 dark:border-slate-800/80 max-w-2xl mx-auto relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-400/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 text-center py-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        >
          <AlertCircle className="w-20 h-20 sm:w-24 sm:h-24 text-red-500 mx-auto mb-6 sm:mb-8 drop-shadow-[0_0_25px_rgba(239,68,68,0.4)]" />
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-black text-navy dark:text-white mb-4 tracking-tight">Seats Exceeded</h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg mb-8 max-w-lg mx-auto">
          We are overwhelmed by the response! Unfortunately, all available seats for the AI Intelli Week have been filled, and new registrations are now closed.
        </p>
        <div className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold border border-slate-200 dark:border-slate-700">
          Registrations Closed
        </div>
      </div>
    </motion.div>
  );
}
