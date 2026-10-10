import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Layers, Target, Dumbbell, Sparkles, User, RefreshCw, Flame } from 'lucide-react';
import { getExerciseDetails } from '../../data/exerciseDatabase';

// Realistic athlete photos curated for both Men & Women across all major exercises
const REALISTIC_ATHLETE_VISUALS = {
  'bench-press': {
    male: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Pectoralis Major (Chest)',
    secondaryMuscles: 'Front Deltoids, Triceps',
    category: 'Chest',
  },
  'incline-press': {
    male: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Upper Chest (Clavicular Head)',
    secondaryMuscles: 'Anterior Delts, Triceps',
    category: 'Chest',
  },
  'pushups': {
    male: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Pectoralis Major & Core',
    secondaryMuscles: 'Triceps, Serratus Anterior',
    category: 'Chest',
  },
  'cable-fly': {
    male: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Sternal Pectoralis (Mid Chest)',
    secondaryMuscles: 'Anterior Deltoids',
    category: 'Chest',
  },
  'dips': {
    male: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Lower Chest & Triceps',
    secondaryMuscles: 'Front Deltoids',
    category: 'Chest',
  },
  'lat-pulldown': {
    male: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Latissimus Dorsi (Lats)',
    secondaryMuscles: 'Biceps, Rhomboids, Rear Delts',
    category: 'Back',
  },
  'seated-cable-row': {
    male: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Rhomboids & Mid-Back',
    secondaryMuscles: 'Lower Lats, Biceps',
    category: 'Back',
  },
  'pullups': {
    male: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Upper Lats & V-Taper',
    secondaryMuscles: 'Biceps, Core, Grip',
    category: 'Back',
  },
  'deadlift': {
    male: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Glutes, Hamstrings & Erector Spinae',
    secondaryMuscles: 'Lats, Traps, Forearms',
    category: 'Back',
  },
  'overhead-press': {
    male: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Anterior & Medial Deltoids (Shoulders)',
    secondaryMuscles: 'Triceps, Upper Chest',
    category: 'Shoulders',
  },
  'lateral-raise': {
    male: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Lateral Deltoids (Side Shoulders)',
    secondaryMuscles: 'Trapezius',
    category: 'Shoulders',
  },
  'face-pull': {
    male: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Rear Deltoids & Rotator Cuff',
    secondaryMuscles: 'Rhomboids, Traps',
    category: 'Shoulders',
  },
  'squats': {
    male: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: 'Hamstrings, Core Stabilizers',
    category: 'Legs',
  },
  'lunges': {
    male: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Glutes & Quads (Unilateral)',
    secondaryMuscles: 'Hamstrings, Calves',
    category: 'Legs',
  },
  'calf-raise': {
    male: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Gastrocnemius & Soleus (Calves)',
    secondaryMuscles: 'Achilles, Ankle Stabilizers',
    category: 'Legs',
  },
  'bicep-curl': {
    male: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Biceps Brachii (Arm Peaks)',
    secondaryMuscles: 'Brachialis, Forearms',
    category: 'Arms',
  },
  'tricep-pushdown': {
    male: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Triceps Brachii (Lateral & Medial Head)',
    secondaryMuscles: 'Anconeus',
    category: 'Arms',
  },
  'plank': {
    male: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    female: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    primaryMuscle: 'Rectus Abdominis & Transverse Core',
    secondaryMuscles: 'Glutes, Shoulders',
    category: 'Core',
  },
};

export default function AnatomicalExerciseVisual({ 
  exerciseName, 
  gender = 'male', 
  category = 'Chest',
  showSetsReps = true,
  defaultSets = '3 SETS • 10-12 REPS'
}) {
  const [activeGender, setActiveGender] = useState(gender);
  const [viewMode, setViewMode] = useState('human'); // 'human' (Real Athlete) | 'anatomy' (Muscle Map)
  const [phase, setPhase] = useState('start'); // 'start' | 'peak'
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setActiveGender(gender);
  }, [gender]);

  // Motion animation loop
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPhase((prev) => (prev === 'start' ? 'peak' : 'start'));
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const cleanName = (exerciseName || '').toLowerCase();

  // Find exercise key
  const getExerciseKey = () => {
    if (cleanName.includes('lat pull') || cleanName.includes('pulldown')) return 'lat-pulldown';
    if (cleanName.includes('cable row') || cleanName.includes('seated row')) return 'seated-cable-row';
    if (cleanName.includes('rear delt') || cleanName.includes('face pull')) return 'face-pull';
    if (cleanName.includes('bicep') || cleanName.includes('curl')) return 'bicep-curl';
    if (cleanName.includes('tricep') || cleanName.includes('pushdown')) return 'tricep-pushdown';
    if (cleanName.includes('incline')) return 'incline-press';
    if (cleanName.includes('bench') || cleanName.includes('chest press')) return 'bench-press';
    if (cleanName.includes('pushup') || cleanName.includes('push up') || cleanName.includes('push-up')) return 'pushups';
    if (cleanName.includes('cable') && (cleanName.includes('fly') || cleanName.includes('cross'))) return 'cable-fly';
    if (cleanName.includes('dip')) return 'dips';
    if (cleanName.includes('deadlift')) return 'deadlift';
    if (cleanName.includes('pull up') || cleanName.includes('pullup') || cleanName.includes('chin up')) return 'pullups';
    if (cleanName.includes('squat')) return 'squats';
    if (cleanName.includes('lunge')) return 'lunges';
    if (cleanName.includes('calf')) return 'calf-raise';
    if (cleanName.includes('overhead') || cleanName.includes('shoulder press')) return 'overhead-press';
    if (cleanName.includes('lateral raise')) return 'lateral-raise';
    if (cleanName.includes('plank')) return 'plank';
    return 'bench-press';
  };

  const key = getExerciseKey();
  const visualData = REALISTIC_ATHLETE_VISUALS[key] || REALISTIC_ATHLETE_VISUALS['bench-press'];
  const details = getExerciseDetails(exerciseName) || {};

  const isFemale = activeGender === 'female';
  const athletePhoto = isFemale ? visualData.female : visualData.male;
  const primaryMuscle = details.muscle?.split(',')[0] || visualData.primaryMuscle;
  const secondaryMuscles = details.muscle?.split(',').slice(1).join(',') || visualData.secondaryMuscles;

  return (
    <div className="w-full bg-[#0D0D17] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
      {/* ============================================================== */}
      {/* TOP CONTROLS BAR: Gender Toggle & Visual Mode */}
      {/* ============================================================== */}
      <div className="flex justify-between items-center p-3 sm:p-3.5 bg-dark-900/90 border-b border-white/5 backdrop-blur-md">
        {/* Gender Toggle: Women ♀️ / Men ♂️ */}
        <div className="flex items-center gap-1 bg-dark-800 p-0.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveGender('male')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              !isFemale 
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-dark-950 shadow-md shadow-emerald-500/20' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>♂️</span>
            <span>Men</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveGender('female')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isFemale 
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-pink-500/20' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>♀️</span>
            <span>Women</span>
          </button>
        </div>

        {/* View Switcher: Real Human Athlete vs Anatomical Map */}
        <div className="flex items-center gap-1 bg-dark-800 p-0.5 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('human')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              viewMode === 'human'
                ? 'bg-accent/20 text-accent border border-accent/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User size={13} /> Real Athlete
          </button>
          <button
            type="button"
            onClick={() => setViewMode('anatomy')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              viewMode === 'anatomy'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Target size={13} /> Muscle Map
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN VISUAL CANVAS (Photo / Video with Exercise & Muscle Overlay) */}
      {/* ============================================================== */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black flex items-center justify-center">
        {viewMode === 'human' ? (
          /* REAL HUMAN ATHLETE VIEW */
          <div className="relative w-full h-full">
            <motion.img
              key={`${key}-${activeGender}-${phase}`}
              initial={{ scale: 1 }}
              animate={{ 
                scale: phase === 'peak' ? 1.04 : 1,
                filter: phase === 'peak' ? 'contrast(1.08) brightness(1.02)' : 'contrast(1) brightness(1)'
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              src={athletePhoto}
              alt={`${exerciseName} performed by ${isFemale ? 'female' : 'male'} athlete`}
              className="w-full h-full object-cover"
              loading="eager"
            />

            {/* Dark contrast gradient vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-black/60 pointer-events-none" />

            {/* DIRECT OVERLAY: EXERCISE NAME (Top Left) */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none gap-2">
              <div className="bg-dark-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 shadow-xl max-w-[70%]">
                <span className="text-[10px] text-accent font-extrabold tracking-widest uppercase block">
                  EXERCISE
                </span>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-tight uppercase drop-shadow">
                  {exerciseName || details.name || 'Workout Exercise'}
                </h3>
              </div>

              {/* Phase Badge */}
              <div className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg border ${
                phase === 'peak' 
                  ? 'bg-red-500/80 text-white border-red-400 animate-pulse' 
                  : 'bg-dark-900/80 text-gray-200 border-white/10'
              }`}>
                {phase === 'start' ? '1. Start Position' : '2. Peak Squeeze 🔥'}
              </div>
            </div>

            {/* DIRECT OVERLAY: TARGET MUSCLE (Bottom Banner) */}
            <div className="absolute bottom-3 left-3 right-3 pointer-events-none space-y-1.5">
              <div className="bg-dark-950/90 backdrop-blur-md p-3 rounded-2xl border border-white/15 shadow-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-4" />
                    <span className="text-[11px] font-extrabold text-red-400 uppercase tracking-wider">
                      PRIMARY MUSCLE:
                    </span>
                  </div>
                  <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                    Active Contraction
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-black text-white drop-shadow">
                  {primaryMuscle}
                </div>

                {secondaryMuscles && (
                  <div className="text-[10px] text-gray-300 truncate">
                    <span className="text-gray-400">Assisting:</span> {secondaryMuscles}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ANATOMICAL MUSCLE MAP VIEW (Glowing Red Active Contraction) */
          <div className="relative w-full h-full bg-[#101020] flex flex-col items-center justify-center p-6 text-center">
            {/* Exercise & Muscle overlay inside canvas */}
            <div className="absolute top-3 left-3 bg-dark-900/90 px-3 py-1 rounded-xl border border-white/10 text-left">
              <span className="text-[9px] text-gray-400 uppercase font-bold block">EXERCISE FOCUS</span>
              <span className="text-xs font-black text-white uppercase">{exerciseName}</span>
            </div>

            <div className="relative my-auto flex flex-col items-center">
              {/* Anatomical Athlete Silhouette with Red Heatmap */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <AnatomicalSilhouette isFemale={isFemale} category={details.category || visualData.category} />
              </div>

              <div className="mt-2 space-y-0.5 bg-dark-950/80 px-4 py-2 rounded-2xl border border-red-500/30">
                <div className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Flame size={12} className="text-red-500" /> TARGET MUSCLE BURNING
                </div>
                <div className="text-xs font-black text-white">{primaryMuscle}</div>
              </div>
            </div>

            <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 bg-dark-900/80 px-2 py-1 rounded-lg border border-white/5">
              Active Muscle Heatmap (Red)
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* BOTTOM ACTION BAR: Motion Player & Rep Cues */}
      {/* ============================================================== */}
      <div className="p-3 bg-dark-900/90 border-t border-white/5 flex items-center justify-between">
        <div>
          {showSetsReps && (
            <span className="text-xs font-black text-amber-400 tracking-wider">
              {defaultSets}
            </span>
          )}
        </div>

        {/* Start / Peak / Loop Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPhase(phase === 'start' ? 'peak' : 'start')}
            className="px-2.5 py-1 bg-dark-800 hover:bg-dark-700 text-gray-200 text-xs font-bold rounded-xl border border-white/10 flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={12} className="text-accent" />
            <span>{phase === 'start' ? 'See Peak Form' : 'See Start Form'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              isPlaying
                ? 'bg-accent text-dark-900 shadow-md shadow-accent/20'
                : 'bg-dark-800 hover:bg-dark-700 text-white border border-white/10'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={12} /> <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={12} /> <span>Play Loop</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Anatomical Silhouette with Red Highlighted Target Muscles
 */
function AnatomicalSilhouette({ isFemale, category = 'Chest' }) {
  const cat = (category || '').toLowerCase();
  const highlightRed = '#FF2A4D';
  const neutralBody = '#475569';

  const isChest = cat.includes('chest');
  const isBack = cat.includes('back');
  const isShoulders = cat.includes('shoulder');
  const isArms = cat.includes('arm');
  const isLegs = cat.includes('leg');
  const isCore = cat.includes('core') || cat.includes('ab');

  return (
    <svg viewBox="0 0 120 160" className="w-full h-full drop-shadow-2xl">
      {/* Head */}
      <circle cx="60" cy="20" r={isFemale ? 11 : 12} fill={neutralBody} />

      {/* Traps & Neck */}
      <path d="M 52 30 L 68 30 L 76 42 L 44 42 Z" fill={neutralBody} />

      {/* Shoulders / Deltoids */}
      <circle 
        cx="38" cy="46" r="9" 
        fill={isShoulders ? highlightRed : neutralBody} 
        className={isShoulders ? 'filter drop-shadow-[0_0_8px_#ff2a4d]' : ''}
      />
      <circle 
        cx="82" cy="46" r="9" 
        fill={isShoulders ? highlightRed : neutralBody} 
        className={isShoulders ? 'filter drop-shadow-[0_0_8px_#ff2a4d]' : ''}
      />

      {/* Chest (Pectorals) */}
      <path
        d={isFemale 
          ? "M 46 44 Q 60 48 74 44 Q 72 62 60 63 Q 48 62 46 44 Z" 
          : "M 44 43 Q 60 47 76 43 Q 76 64 60 65 Q 44 64 44 43 Z"
        }
        fill={isChest ? highlightRed : neutralBody}
        className={isChest ? 'filter drop-shadow-[0_0_12px_#ff2a4d]' : ''}
      />

      {/* Arms / Biceps & Triceps */}
      <rect 
        x="27" y="55" width={isFemale ? "9" : "11"} height="34" rx="4" 
        fill={isArms ? highlightRed : neutralBody} 
        className={isArms ? 'filter drop-shadow-[0_0_8px_#ff2a4d]' : ''}
      />
      <rect 
        x="84" y="55" width={isFemale ? "9" : "11"} height="34" rx="4" 
        fill={isArms ? highlightRed : neutralBody} 
        className={isArms ? 'filter drop-shadow-[0_0_8px_#ff2a4d]' : ''}
      />

      {/* Abdominals & Core / Lats */}
      <path
        d={isFemale 
          ? "M 50 63 L 70 63 L 68 95 L 52 95 Z" 
          : "M 48 65 L 72 65 L 70 95 L 50 95 Z"
        }
        fill={isCore ? highlightRed : (isBack ? highlightRed : '#334155')}
        className={(isCore || isBack) ? 'filter drop-shadow-[0_0_10px_#ff2a4d]' : ''}
      />

      {/* Hips & Glutes */}
      <path
        d={isFemale 
          ? "M 48 95 L 72 95 L 78 112 L 42 112 Z" 
          : "M 50 95 L 70 95 L 73 110 L 47 110 Z"
        }
        fill={isLegs ? highlightRed : neutralBody}
        className={isLegs ? 'filter drop-shadow-[0_0_8px_#ff2a4d]' : ''}
      />

      {/* Quads & Legs */}
      <rect 
        x={isFemale ? "45" : "46"} y="112" width={isFemale ? "12" : "13"} height="42" rx="5" 
        fill={isLegs ? highlightRed : neutralBody} 
        className={isLegs ? 'filter drop-shadow-[0_0_10px_#ff2a4d]' : ''}
      />
      <rect 
        x={isFemale ? "63" : "61"} y="112" width={isFemale ? "12" : "13"} height="42" rx="5" 
        fill={isLegs ? highlightRed : neutralBody} 
        className={isLegs ? 'filter drop-shadow-[0_0_10px_#ff2a4d]' : ''}
      />
    </svg>
  );
}
