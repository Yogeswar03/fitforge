import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Dumbbell, Target, ShieldCheck, Sparkles, 
  Play, Image, AlertTriangle, Plus, Check 
} from 'lucide-react';
import Modal from './Modal';
import { getExerciseDetails } from '../../data/exerciseDatabase';

export default function ExerciseModal({ isOpen, onClose, exerciseName, onAddToWorkout }) {
  const [viewMode, setViewMode] = useState('gif'); // 'gif' | 'image'
  const [added, setAdded] = useState(false);

  if (!isOpen || !exerciseName) return null;

  const details = getExerciseDetails(exerciseName);
  if (!details) return null;

  const displayMedia = viewMode === 'gif' && details.gif ? details.gif : details.image;

  const handleAdd = () => {
    if (onAddToWorkout) {
      onAddToWorkout();
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={details.name}>
      <div className="space-y-4 pt-1">
        {/* Media Container with GIF & Photo Toggle */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-dark-900 border border-white/10 shadow-lg group">
          <img
            key={displayMedia}
            src={displayMedia}
            alt={details.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              if (viewMode === 'gif') {
                e.target.src = details.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80';
              } else {
                e.target.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-black/30 opacity-90" />
          
          {/* Top Control Bar: Mode Toggle & Category */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
            <span className="text-[10px] bg-accent text-dark-900 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              {details.category}
            </span>

            {/* GIF / Photo Switcher */}
            {details.gif && (
              <div className="flex bg-black/60 backdrop-blur-md rounded-xl p-0.5 border border-white/15">
                <button
                  type="button"
                  onClick={() => setViewMode('gif')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    viewMode === 'gif' ? 'bg-accent text-dark-900 shadow' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Play size={10} className={viewMode === 'gif' ? 'fill-dark-900' : ''} />
                  <span>GIF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('image')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    viewMode === 'image' ? 'bg-accent text-dark-900 shadow' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Image size={10} />
                  <span>Photo</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <div>
              <span className="text-[11px] text-gray-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 font-medium">
                {details.equipment}
              </span>
            </div>
            {viewMode === 'gif' && (
              <span className="text-[10px] font-extrabold text-accent bg-dark-900/80 px-2 py-0.5 rounded-md border border-accent/30 animate-pulse">
                LOOPING DEMO
              </span>
            )}
          </div>
        </div>

        {/* Target Muscles Section */}
        <div className="bg-dark-700/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <div className="text-[11px] uppercase tracking-wider font-bold text-accent flex items-center gap-1.5">
            <Target size={14} /> Target Muscle Group
          </div>
          <div className="text-xs sm:text-sm font-semibold text-white">
            {details.muscle}
          </div>
        </div>

        {/* Trainer Form Cues */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-accent" /> Technique & Form Execution
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

        {/* Common Mistakes Warning */}
        {details.mistakes && details.mistakes.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl space-y-1.5">
            <div className="text-[11px] uppercase tracking-wider font-bold text-red-400 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Common Mistakes to Avoid
            </div>
            <ul className="text-xs text-gray-300 space-y-1 pl-1">
              {details.mistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {onAddToWorkout && (
            <button
              onClick={handleAdd}
              disabled={added}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border ${
                added 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                  : 'bg-accent/15 hover:bg-accent/25 border-accent/40 text-accent'
              }`}
            >
              {added ? (
                <>
                  <Check size={16} /> Added to Workout!
                </>
              ) : (
                <>
                  <Plus size={16} /> Add to Today's Workout
                </>
              )}
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-3 bg-dark-700 hover:bg-dark-600 rounded-2xl text-white font-bold text-xs transition-colors"
          >
            Got It, Let's Lift! 💪
          </button>
        </div>
      </div>
    </Modal>
  );
}
