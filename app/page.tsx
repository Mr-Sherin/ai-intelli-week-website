"use client";

import Hero from '@/components/Hero';
import { 
  Lightbulb, 
  Wrench, 
  Users, 
  Briefcase, 
  Laptop, 
  Coffee, 
  Compass, 
  Award 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const highlights = [
    { icon: Lightbulb, title: 'Expert Sessions', desc: 'Learn from industry leaders and academic pioneers.' },
    { icon: Wrench, title: 'Hands-On Workshops', desc: 'Build real-world AI applications with guidance.' },
    { icon: Users, title: 'Industry Mentorship', desc: 'Get 1-on-1 advice from AI professionals.' },
    { icon: Briefcase, title: 'Internship Opportunities', desc: 'Connect with top tech companies hiring now.' },
    { icon: Laptop, title: 'AI Tools Demonstration', desc: 'Explore the latest generative AI platforms.' },
    { icon: Coffee, title: 'Networking Sessions', desc: 'Build your professional network over coffee.' },
    { icon: Compass, title: 'Career Guidance', desc: 'Navigate the rapidly evolving AI job market.' },
    { icon: Award, title: 'Certificates', desc: 'Earn a verifiable certificate of participation.' },
  ];

  const schedule = [
    { day: 'June 15', title: 'AI Pentesting & Vibe Coding Basics' },
    { day: 'June 16', title: 'Vibe Coding Anti Gravity' },
    { day: 'June 17', title: 'AI Tools Part 1' },
    { day: 'June 18', title: 'AI Tools Part 2' },
    { day: 'June 19', title: 'AI Tools Part 3' },
    { day: 'June 20 & 21', title: 'Project Completion (From Home)' },
    { day: 'June 22', title: 'Final Review' },
  ];

  return (
    <div className="w-full">
      <Hero />
      
      {/* Event Overview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-800/50 rounded-3xl p-10 shadow-[0_8px_30px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-slate-800/40 to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-navy dark:text-white mb-6 tracking-tight">About The Event</h2>
                <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-6">
                  AI Intelli Week is a university-hosted internship and learning initiative designed to expose students to modern AI technologies, industry trends, practical applications, and career opportunities.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-6">
                  Throughout the week, participants will dive deep into hands-on workshops, engaging tech talks, and collaborative projects that bridge the gap between academic theory and real-world implementation. Whether you are a beginner looking to understand the basics of prompt engineering or an experienced coder eager to explore advanced machine learning models, this event offers something valuable for everyone.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Join hundreds of students and professionals in an immersive week of discovery and networking. Organized in collaboration with IEEE, IEDC, and GDG, this initiative aims to build a robust local tech community and kickstart your journey into the future of technology and innovation.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 w-full"
            style={{ perspective: "1000px" }}
          >
            <motion.div 
              whileHover={{ rotateY: 5, rotateX: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60 relative"
            >
              <div className="absolute inset-0 bg-[url('/ai_tools.png')] bg-cover bg-center transition-transform duration-1000 hover:scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 mix-blend-overlay"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ perspective: "1000px" }}>
          <h2 className="text-4xl font-bold text-navy dark:text-white text-center mb-16 tracking-tight">Event Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    rotateX: 10, 
                    rotateY: -10, 
                    scale: 1.05,
                  }}
                  className="bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-xl p-8 rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 relative overflow-hidden"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 dark:from-slate-800/60 to-transparent opacity-80"></div>
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-fuchsia-100 dark:from-cyan-900/40 dark:to-fuchsia-900/40 rounded-xl flex items-center justify-center mb-6 border border-white/50 dark:border-slate-700/50" style={{ transform: "translateZ(30px)" }}>
                    <Icon className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-3" style={{ transform: "translateZ(20px)" }}>{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed" style={{ transform: "translateZ(10px)" }}>{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Attend Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl font-bold text-navy dark:text-white mb-8 tracking-tight">Why You Should Attend</h2>
            <ul className="space-y-6">
              {[
                'Learn from Experts',
                'Build Industry Knowledge',
                'Discover Career Paths',
                'Connect with Professionals',
                'Gain Internship Opportunities',
                'Receive Participation Certificate'
              ].map((benefit, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                  className="flex items-center text-slate-700 dark:text-slate-200 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-xl border border-white/60 dark:border-slate-800/60 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 flex items-center justify-center mr-4 shrink-0 shadow-lg shadow-cyan-500/20">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-navy dark:text-white">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 w-full"
            style={{ perspective: "1000px" }}
          >
            <motion.div 
              whileHover={{ rotateY: -10, rotateX: 10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60 relative"
            >
              <div className="absolute inset-0 bg-[url('/students_ai.png')] bg-cover bg-center transition-transform duration-1000 hover:scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/10 to-cyan-500/10 mix-blend-overlay"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Week Schedule Section */}
      <section id="schedule" className="py-24 relative z-10 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden relative">
            
            {/* Background Image for Schedule Container */}
            <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('/schedule_bg.png')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/40 dark:from-slate-950/90 dark:via-slate-900/80 dark:to-slate-900/40 pointer-events-none"></div>

            <div className="relative z-10 p-10 lg:p-16 flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl lg:text-5xl font-black mb-6 text-navy dark:text-white tracking-tight"
                >
                  Week Schedule
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-slate-700 dark:text-slate-300 font-medium mb-8 leading-relaxed space-y-6"
                >
                  <p>
                    Get ready for an intensive, hands-on journey into the next generation of software development and security. Our meticulously crafted week is designed to bridge the gap between academic theory and practical, industry-ready skills.
                  </p>
                  <p>
                    You&apos;ll start by mastering the fundamentals of AI Pentesting and the revolutionary concept of Vibe Coding. As the week progresses, we&apos;ll dive deep into cutting-edge generative AI tools, exploring how to leverage them for maximum productivity and innovation.
                  </p>
                  <p>
                    Finally, you&apos;ll put your knowledge to the test by building a real-world project from home. This hands-on capstone ensures you walk away not just with theoretical knowledge, but with tangible experience you can showcase to future employers.
                  </p>
                </motion.div>
              </div>
              
              <div className="lg:w-2/3 space-y-4">
                {schedule.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex flex-col sm:flex-row items-baseline gap-4 sm:gap-6 p-5 bg-white/70 dark:bg-slate-800/70 hover:bg-white/90 dark:hover:bg-slate-700/90 backdrop-blur-md rounded-2xl border border-white/80 dark:border-slate-700/80 transition-all shadow-sm hover:shadow-md cursor-default"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-fuchsia-600 dark:from-cyan-400 dark:to-fuchsia-400 font-black text-2xl min-w-[100px]">{item.day}</span>
                    <span className="text-xl font-bold text-navy dark:text-white">{item.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
