"use client";

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function AboutPage() {
  const organizations = [
    {
      name: "IEEE",
      fullName: "Institute of Electrical and Electronics Engineers",
      description: "IEEE is the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity. The Student Branch at LMCST focuses on empowering students through hands-on workshops, technical talks, and global networking.",
      email: "ieeesblmc@gmail.com",
      instagram: "ieee_sb_lmcst",
      instagramLink: "https://www.instagram.com/ieee_sb_lmcst?igsh=MWJ1ZWkzcDZ0NG5tcg==",
      color: "from-blue-500 to-cyan-500",
      logo: "/ieee-logo.png",
      imageClass: "scale-90"
    },
    {
      name: "IEDC",
      fullName: "Innovation and Entrepreneurship Development Centre",
      description: "IEDC aims to foster a culture of innovation and entrepreneurship among students. We provide a platform for aspiring entrepreneurs to develop their ideas into viable products through mentorship, funding opportunities, and industry connections.",
      email: "iedc.lmcst@gmail.com",
      instagram: "lmc_innovatex",
      instagramLink: "https://www.instagram.com/lmc_innovatex?igsh=MWxtYXBreHRmZmg5dw==",
      color: "from-orange-500 to-amber-500",
      logo: "/iedc-logo.png",
      imageClass: "scale-[1.7] md:scale-[2.75] md:translate-y-3 translate-y-2"
    },
    {
      name: "GDG",
      fullName: "Google Developer Groups",
      description: "GDG On Campus is a community for students interested in Google developer technologies. We host events covering a wide range of technical topics where you can learn new skills in a hands-on, peer-to-peer learning environment.",
      email: "gdg.lmcst@gmail.com",
      instagram: "gdg_lmcst",
      instagramLink: "https://www.instagram.com/gdg_lmcst?igsh=Z2h6amc5YXZqcDA5",
      color: "from-green-500 to-emerald-500",
      logo: "/gdg-logo.png",
      imageClass: "scale-[2]"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-navy dark:text-white tracking-tight mb-4"
          >
            About The Organizers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium"
          >
            Meet the incredible communities and organizations powering AI Intelli Week.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {organizations.map((org, index) => (
            <motion.div
              key={org.name}
              id={org.name.toLowerCase()}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)"
              }}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm flex flex-col h-full relative overflow-hidden"
            >
              {/* Decorative top accent */}
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${org.color}`}></div>
              
              <div className="flex-grow">
                <div className="relative w-full h-32 mb-6 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl p-3 overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                  <img src={org.logo} alt={`${org.name} Logo`} className={`max-h-full max-w-full object-contain transition-transform ${org.imageClass || ''}`} />
                </div>
                
                <h2 className="text-2xl font-bold text-navy dark:text-white mb-1">{org.name}</h2>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">{org.fullName}</h3>
                
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8">
                  {org.description}
                </p>
              </div>

              <div className="mt-auto space-y-3 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                <a 
                  href={`mailto:${org.email}`} 
                  className="flex items-center text-slate-600 dark:text-slate-400 hover:text-navy dark:hover:text-white font-semibold transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors shadow-sm border border-transparent dark:border-slate-700">
                    <Mail className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  </div>
                  {org.email}
                </a>
                
                <a 
                  href={org.instagramLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 font-semibold transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-pink-50 dark:group-hover:bg-slate-700 transition-colors shadow-sm border border-transparent dark:border-slate-700">
                    <InstagramIcon className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  @{org.instagram}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
