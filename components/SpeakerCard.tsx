"use client";

import Image from 'next/image';
import { Speaker } from '@/lib/types';
import { motion } from 'framer-motion';

export default function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -10,
        rotateX: 2,
        rotateY: 2,
        boxShadow: "0 25px 50px -12px rgba(6,182,212, 0.15)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/60 shadow-md flex flex-col h-full cursor-pointer relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
      
      <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-100/50">
        {speaker.photo_url ? (
          <Image 
            src={speaker.photo_url} 
            alt={speaker.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
            No image
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <h3 className="text-2xl font-bold text-navy mb-1">{speaker.name}</h3>
        <p className="text-sm font-bold text-cyan-600 mb-1">{speaker.designation}</p>
        <p className="text-sm font-medium text-slate-600 mb-5">{speaker.organization}</p>
        
        <div className="mt-auto">
          <div className="bg-white/50 rounded-xl p-4 mb-4 border border-white/60 transition-colors group-hover:bg-white/80 shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Session Topic</h4>
            <p className="text-sm text-navy font-bold line-clamp-2">{speaker.topic}</p>
          </div>
          
          <p className="text-sm text-slate-700 font-medium line-clamp-3">{speaker.bio}</p>
        </div>
      </div>
    </motion.div>
  );
}
