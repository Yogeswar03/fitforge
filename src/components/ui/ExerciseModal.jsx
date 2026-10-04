import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Target, ShieldCheck, Sparkles } from 'lucide-react';
import Modal from './Modal';
import { getExerciseDetails } from '../../data/exerciseDatabase';

export default function ExerciseModal({ isOpen, onClose, exerciseName }) {
  if (!isOpen || !exerciseName) return null;

  const details = getExerciseDetails(exerciseName);
  if (!details) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={details.name}>
      <div className="space-y-4">
        {/* Exercise Photo */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-dark-900 border border-white/10 shadow-lg">
          <img
            src={details.image}
            alt={details.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <span className="text-xs bg-accent text-dark-900 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {details.category}
            </span>
            <span className="text-xs text-gray-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {details.equipment}
            </span>
          </div>
        </div>

        {/* Target Muscles */}
        <div className="bg-dark-700/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <div className="text-[11px] uppercase tracking-wider font-bold text-accent flex items-center gap-1.5">
            <Target size={14} /> Primary Target Muscles
          </div>
          <div className="text-sm font-semibold text-white">
            {details.muscle}
          </div>
        </div>

        {/* Trainer Form Cues */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-accent" /> Technique & Form Cues
          </div>
          <div className="space-y-2">
            {(details.cues || []).map((cue, idx) => (
              <div 
                key={idx}
                className="bg-dark-800/90 p-3 rounded-xl border border-white/5 flex items-start gap-2.5 text-xs text-gray-200"
              >
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{cue}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-dark-700 hover:bg-dark-600 rounded-2xl text-white font-bold text-sm transition-colors mt-2"
        >
          Got It, Let's Lift! 💪
        </button>
      </div>
    </Modal>
  );
}
