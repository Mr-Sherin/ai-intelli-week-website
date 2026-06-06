"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";

type SpeakerType = {
  name: string;
  role: string;
  image: string;
  imagePosition?: string;
  linkedin: string;
  instagram: string;
  bio?: string;
};

const speakers: SpeakerType[] = [
  {
    name: "Jobin Selvanose",
    role: "Software Engineer & Content Creator",
    image: "/speaker-jobin.jpg",
    linkedin: "https://www.linkedin.com/in/jobinselvanose?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    instagram: "https://www.instagram.com/jobinselvanose?igsh=enB2NThjNG45Z2t0"
  },
  {
    name: "Abimel S B Kulumala",
    role: "Cybersecurity Researcher | R&D Team Lead, Cozmek Pvt Ltd | Favikon Global 200 Creator",
    image: "/speaker-abimel.png",
    linkedin: "https://www.linkedin.com/in/abimelsbk",
    instagram: "https://www.instagram.com/abimelsbk?igsh=OGo3MDdhcHJmeXE4"
  },
  {
    name: "Arjun G S",
    role: "Senior Dev @ Wemine | Founder of BuildFox | Former Lead GDSC Kerala",
    image: "/speaker-arjun.png",
    imagePosition: "object-top",
    linkedin: "https://www.linkedin.com/in/arjungsanal",
    instagram: "https://www.instagram.com/arjungsanal?igsh=MTdkY3M5enJnbWJkNA=="
  },
  {
    name: "Adithyan L",
    role: "Technical Manager at WagFu",
    image: "/speaker-adithyan.jpg",
    imagePosition: "object-top",
    linkedin: "https://www.linkedin.com/in/adithyanaconitum",
    instagram: ""
  },
  {
    name: "Alwi Sam",
    role: "Managing Director, Foxtech Pvt Solutions",
    image: "/speaker-alwi.jpg",
    imagePosition: "object-top",
    linkedin: "https://www.linkedin.com/in/alwi-sam-s-p-2a7017243?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    instagram: "https://www.instagram.com/_alwi_sam_?igsh=MWkzODFhMmNpOTkxMw=="
  }
];

export default function SpeakersPage() {
  return (
    <div className="w-full pt-8 pb-24 min-h-[50vh] flex flex-col items-center relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-cyan-400/10 to-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="w-16 h-16 mx-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/80 dark:border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-fuchsia-100 dark:from-cyan-900/40 dark:to-fuchsia-900/40 rounded-2xl opacity-50"></div>
          <Mic className="w-6 h-6 text-navy dark:text-white relative z-10" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-black text-navy dark:text-white tracking-tight mb-4"
        >
          Our Esteemed <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-fuchsia-600 dark:from-cyan-400 dark:to-fuchsia-400">Speakers</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12"
        >
          Meet the brilliant minds and industry leaders who will be sharing their insights and expertise at AI Intelli Week 2026.
        </motion.p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {speakers.map((speaker, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 p-8 rounded-3xl shadow-sm text-center flex flex-col items-center group relative overflow-hidden w-full max-w-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-fuchsia-50/50 dark:from-cyan-900/10 dark:to-fuchsia-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-white dark:border-slate-700 shadow-md relative z-10 bg-slate-100 dark:bg-slate-800">
                <img src={speaker.image} alt={speaker.name} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${speaker.imagePosition || 'object-center'}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-2 relative z-10">{speaker.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-8 flex-grow relative z-10 leading-relaxed">{speaker.role}</p>
              
              <div className="flex gap-3 mt-auto relative z-10">
                {speaker.linkedin && (
                  <a 
                    href={speaker.linkedin} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-[#0077b5] hover:text-white dark:hover:bg-[#0077b5] text-slate-600 dark:text-slate-400 transition-colors shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                )}
                {speaker.instagram && (
                  <a 
                    href={speaker.instagram} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-[#E1306C] hover:text-white dark:hover:bg-[#E1306C] text-slate-600 dark:text-slate-400 transition-colors shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
