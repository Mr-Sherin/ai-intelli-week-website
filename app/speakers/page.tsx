"use client";

import { motion } from "framer-motion";
import { Mic, Calendar, UserPlus } from "lucide-react";

export default function SpeakersPage() {
  return (
    <div className="w-full py-24 min-h-[70vh] flex items-center justify-center relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-cyan-400/10 to-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="w-24 h-24 mx-auto bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex items-center justify-center mb-8 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-fuchsia-100 rounded-3xl opacity-50"></div>
          <Mic className="w-10 h-10 text-navy relative z-10" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-navy tracking-tight mb-6"
        >
          Speakers <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-fuchsia-600">Announcing Soon</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed mb-12"
        >
          We're currently curating an incredible lineup of industry leaders, academic pioneers, and tech innovators for AI Intelli Week 2026. Get ready to learn from the brightest minds in Artificial Intelligence!
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          <div className="bg-white/50 backdrop-blur-md border border-white/60 p-6 rounded-2xl flex items-center shadow-sm text-left">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mr-4 shrink-0">
              <Calendar className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h3 className="font-bold text-navy">Schedule Updates</h3>
              <p className="text-sm text-slate-500 font-medium">Coming in the next few weeks</p>
            </div>
          </div>
          
          <div className="bg-white/50 backdrop-blur-md border border-white/60 p-6 rounded-2xl flex items-center shadow-sm text-left">
            <div className="w-12 h-12 bg-fuchsia-100 rounded-xl flex items-center justify-center mr-4 shrink-0">
              <UserPlus className="w-6 h-6 text-fuchsia-600" />
            </div>
            <div>
              <h3 className="font-bold text-navy">Top Tier Mentors</h3>
              <p className="text-sm text-slate-500 font-medium">From leading tech giants</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
