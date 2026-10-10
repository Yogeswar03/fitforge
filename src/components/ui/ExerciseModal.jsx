import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Dumbbell, Target, ShieldCheck, Sparkles, 
  AlertTriangle, Plus, Check 
} from 'lucide-react';
import Modal from './Modal';
import { getExerciseDetails } from '../../data/exerciseDatabase';
import AnatomicalExerciseVisual from './AnatomicalExerciseVisual';
import useUserStore from '../../store/useUserStore';

export default function ExerciseModal({ isOpen, onClose, exerciseName, onAddToWorkout, initialGender }) {
  const { profile } = useUserStore();
  const defaultGender = initialGender || profile?.gender || 'male';
  const [currentGender, setCurrentGender] = useState(defaultGender);
  const [added, setAdded] = useState(false);

  if (!isOpen || !exerciseName) return null;

  const details = getExerciseDetails(exerciseName);
  if (!details) return null;

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
        {/* Anatomical Line Illustration (Poster & Red Highlighted Muscles) */}
        <AnatomicalExerciseVisual 
          exerciseName={details.name}
          gender={currentGender}
          category={details.category}
          showSetsReps={true}
          defaultSets="3 SETS 10-12 REPS"
        />

        {/* Target Muscles Badge */}
        <div className="bg-dark-700/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <div className="text-[11px] uppercase tracking-wider font-bold text-red-400 flex items-center gap-1.5">
            <Target size={14} /> Active Muscle Target (Highlighted in Red)
          </div>
          <div className="text-xs sm:text-sm font-semibold text-white">
            {details.muscle}
          </div>
          <div className="text-[11px] text-gray-400">
            Equipment: <span className="text-gray-200 font-medium">{details.equipment}</span>
          </div>
        </div>

        {/* Trainer Form Steps */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-accent" /> Proper Execution Steps
          </div>
          <div className="space-y-1.5">
            {(details.cues || []).map((cue, idx) => (
              <div 
                key={idx}
                className="bg-dark-800/90 p-2.5 rounded-xl border border-white/5 flex items-start gap-2.5 text-xs text-gray-200"
              >
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{cue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mistakes to avoid */}
        {details.mistakes && details.mistakes.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl space-y-1">
            <div className="text-[11px] uppercase tracking-wider font-bold text-red-400 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Common Mistakes to Avoid
            </div>
            <ul className="text-xs text-gray-300 space-y-0.5 pl-1">
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
        <div className="flex gap-2 pt-1">
          {onAddToWorkout && (
            <button
              type="button"
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
                  <Check size={16} /> Added to Today's Workout!
                </>
              ) : (
                <>
                  <Plus size={16} /> Add to Today's Workout
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-dark-700 hover:bg-dark-600 rounded-2xl text-white font-bold text-xs transition-colors"
          >
            Got It 💪
          </button>
        </div>
      </div>
    </Modal>
  );
}
