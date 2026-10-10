import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw, Target, Dumbbell, Sparkles, Flame, CheckCircle, ChevronRight, Eye } from 'lucide-react';
import { getExerciseDetails } from '../../data/exerciseDatabase';

/**
 * AnatomicalExerciseVisual Component
 * Designed directly after the user's reference gym poster:
 * - Two distinct positions: 1. START FORM & 2. PEAK SQUEEZE
 * - Anatomically contoured human athlete (contoured muscle lines, joints, gym equipment)
 * - Women ♀️ and Men ♂️ models with distinct athletic physiques
 * - Active target muscles highlighted in VIVID ELECTRIC RED (#FF1E44)
 * - Prominent EXERCISE NAME and TARGET MUSCLE overlay directly on the visual
 * - Interactive Motion Player (looping repetition animation with rep counter)
 */
export default function AnatomicalExerciseVisual({ 
  exerciseName = 'Lat Pulldown', 
  gender = 'male', 
  category = 'Back',
  showSetsReps = true,
  defaultSets = '2 SETS 10 REPS'
}) {
  const [activeGender, setActiveGender] = useState(gender);
  const [viewMode, setViewMode] = useState('poster'); // 'poster' (side-by-side) | 'animated' (looping rep)
  const [animPhase, setAnimPhase] = useState('start'); // 'start' | 'finish'
  const [isPlaying, setIsPlaying] = useState(false);
  const [repCount, setRepCount] = useState(1);

  useEffect(() => {
    setActiveGender(gender);
  }, [gender]);

  // Motion animation loop
  useEffect(() => {
    let interval;
    if (viewMode === 'animated' || isPlaying) {
      interval = setInterval(() => {
        setAnimPhase((prev) => {
          if (prev === 'start') {
            return 'finish';
          } else {
            setRepCount((c) => (c >= 10 ? 1 : c + 1));
            return 'start';
          }
        });
      }, 1300);
    }
    return () => clearInterval(interval);
  }, [viewMode, isPlaying]);

  const cleanName = (exerciseName || '').toLowerCase();

  // Normalize exercise key
  const getExerciseKey = () => {
    if (cleanName.includes('lat pull') || cleanName.includes('pulldown')) return 'lat-pulldown';
    if (cleanName.includes('seated cable row') || cleanName.includes('cable row') || cleanName.includes('seated row')) return 'seated-cable-row';
    if (cleanName.includes('rear delt') || cleanName.includes('face pull')) return 'rear-delt-fly';
    if (cleanName.includes('shrug')) return 'db-shrugs';
    if (cleanName.includes('preacher')) return 'preacher-curls';
    if (cleanName.includes('hammer')) return 'hammer-curls';
    if (cleanName.includes('bicep') || cleanName.includes('curl')) return 'bicep-curl';
    if (cleanName.includes('tricep') || cleanName.includes('pushdown')) return 'tricep-pushdown';
    if (cleanName.includes('incline')) return 'incline-db-press';
    if (cleanName.includes('bench') || cleanName.includes('chest press')) return 'bench-press';
    if (cleanName.includes('pushup') || cleanName.includes('push up') || cleanName.includes('push-up')) return 'pushups';
    if (cleanName.includes('cable') && (cleanName.includes('fly') || cleanName.includes('cross'))) return 'cable-fly';
    if (cleanName.includes('dip')) return 'chest-dips';
    if (cleanName.includes('deadlift')) return 'deadlift';
    if (cleanName.includes('pull up') || cleanName.includes('pullup') || cleanName.includes('chin up')) return 'pullups';
    if (cleanName.includes('squat')) return 'barbell-squat';
    if (cleanName.includes('lunge')) return 'walking-lunges';
    if (cleanName.includes('calf')) return 'calf-raise';
    if (cleanName.includes('overhead') || cleanName.includes('shoulder press')) return 'overhead-press';
    if (cleanName.includes('lateral raise')) return 'lateral-raise';
    if (cleanName.includes('plank')) return 'plank';
    return 'lat-pulldown'; // fallback to standard lat pulldown
  };

  const key = getExerciseKey();
  const details = getExerciseDetails(exerciseName) || {};
  const isFemale = activeGender === 'female';

  // Target muscle breakdown
  const muscleTargetInfo = getMuscleInfo(key, details);

  return (
    <div className="w-full bg-[#0E0E18] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative font-sans">
      {/* ============================================================== */}
      {/* POSTER TITLE & GENDER TOGGLE BAR */}
      {/* ============================================================== */}
      <div className="p-3.5 bg-gradient-to-r from-dark-950 via-[#131322] to-dark-950 border-b border-white/10 flex flex-wrap justify-between items-center gap-2">
        {/* Left: Exercise Name Tag */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-400 text-dark-950 font-black px-2 py-0.5 rounded uppercase tracking-wider">
              WORKOUT GUIDE
            </span>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              {details.category || category}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mt-0.5 flex items-center gap-2">
            <span>{details.name || exerciseName}</span>
          </h2>
        </div>

        {/* Right: Men ♂️ / Women ♀️ Switcher */}
        <div className="flex items-center gap-1 bg-dark-900/90 p-1 rounded-2xl border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveGender('male')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              !isFemale 
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-dark-950 shadow-md font-extrabold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>♂️</span>
            <span>Men</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveGender('female')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              isFemale 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md font-extrabold' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>♀️</span>
            <span>Women</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TARGET MUSCLE BANNER (Directly on visual) */}
      {/* ============================================================== */}
      <div className="px-4 py-2.5 bg-red-950/30 border-b border-red-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[11px] font-black text-red-400 uppercase tracking-wider">
            ACTIVE TARGET MUSCLE:
          </span>
          <span className="text-xs font-bold text-white bg-red-500/20 px-2 py-0.5 rounded-lg border border-red-500/30">
            {muscleTargetInfo.primary}
          </span>
        </div>
        
        <div className="text-[10px] text-gray-300 font-medium flex items-center gap-1.5">
          <span className="text-red-400 font-bold">Highlighted in Red</span>
          <span>• Assisting: {muscleTargetInfo.secondary}</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ANATOMICAL POSTER CANVAS: Side-by-side Start & Finish */}
      {/* ============================================================== */}
      <div className="p-4 sm:p-5 relative bg-gradient-to-b from-[#10101E] to-[#0A0A14] flex flex-col items-center justify-center min-h-[290px]">
        {viewMode === 'poster' ? (
          /* SIDE-BY-SIDE 2-STEP VIEW (Just like uploaded reference poster) */
          <div className="w-full max-w-lg mx-auto grid grid-cols-2 gap-3 sm:gap-6 items-center">
            {/* Step 1: Start Position */}
            <div className="flex flex-col items-center text-center space-y-2 bg-dark-900/60 p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-dark-700 text-gray-300 text-[10px] font-black flex items-center justify-center border border-white/10">
                  1
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-300">
                  START FORM
                </span>
              </div>
              <div className="h-48 w-full flex items-center justify-center">
                <AnatomicalFigureSvg exercise={key} isFemale={isFemale} phase="start" />
              </div>
              <span className="text-[10px] text-gray-400 font-semibold px-2 py-0.5 bg-dark-800 rounded-md">
                Setup & Joint Stretch
              </span>
            </div>

            {/* Step 2: Peak Contraction (Target Muscle In Red) */}
            <div className="flex flex-col items-center text-center space-y-2 bg-red-950/20 p-3 rounded-2xl border border-red-500/30">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-red-500/30">
                  2
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1">
                  PEAK SQUEEZE <Flame size={12} className="text-red-500" />
                </span>
              </div>
              <div className="h-48 w-full flex items-center justify-center">
                <AnatomicalFigureSvg exercise={key} isFemale={isFemale} phase="finish" />
              </div>
              <span className="text-[10px] text-red-300 font-bold px-2 py-0.5 bg-red-500/20 rounded-md border border-red-500/30">
                Muscles Squeezed (Red)
              </span>
            </div>
          </div>
        ) : (
          /* ANIMATED LOOPING REPETITION MODE */
          <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center justify-between w-full px-4">
              <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-xl border ${
                animPhase === 'finish' 
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' 
                  : 'bg-dark-800 text-gray-300 border-white/10'
              }`}>
                {animPhase === 'start' ? '1. Start Extension' : '2. Peak Contraction 🔥'}
              </span>

              <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
                Rep {repCount} of 10
              </span>
            </div>

            <div className="h-56 w-full flex items-center justify-center bg-dark-900/40 rounded-3xl border border-white/5 p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${key}-${animPhase}-${activeGender}`}
                  initial={{ opacity: 0.8, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.8, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <AnatomicalFigureSvg exercise={key} isFemale={isFemale} phase={animPhase} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* POSTER FOOTER: Sets & Reps in Gold + View Switcher */}
      {/* ============================================================== */}
      <div className="p-3.5 bg-dark-950 border-t border-white/10 flex flex-wrap justify-between items-center gap-2">
        {/* Sets & Reps tag matching reference poster */}
        <div>
          {showSetsReps && (
            <div className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-widest drop-shadow flex items-center gap-1.5">
              <span>⚡</span>
              <span>{defaultSets}</span>
            </div>
          )}
        </div>

        {/* View Mode Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'poster' ? 'animated' : 'poster')}
            className="px-3 py-1.5 bg-dark-800 hover:bg-dark-700 text-white text-xs font-bold rounded-xl border border-white/10 flex items-center gap-1.5 transition-all shadow-sm"
          >
            {viewMode === 'poster' ? (
              <>
                <Play size={13} className="text-accent" />
                <span>Play Motion Loop</span>
              </>
            ) : (
              <>
                <Eye size={13} className="text-accent2" />
                <span>Side-by-Side Poster</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Return primary and secondary target muscle descriptions
 */
function getMuscleInfo(key, details) {
  const muscleMap = {
    'lat-pulldown': { primary: 'Latissimus Dorsi (Lats)', secondary: 'Biceps, Rear Delts, Rhomboids' },
    'seated-cable-row': { primary: 'Rhomboids & Mid-Back', secondary: 'Lats, Biceps, Traps' },
    'rear-delt-fly': { primary: 'Posterior (Rear) Deltoids', secondary: 'Rhomboids, Infraspinatus' },
    'db-shrugs': { primary: 'Upper Trapezius (Traps)', secondary: 'Levator Scapulae, Forearms' },
    'preacher-curls': { primary: 'Biceps Brachii (Short Head)', secondary: 'Brachialis, Forearm Flexors' },
    'hammer-curls': { primary: 'Brachialis & Long Bicep Head', secondary: 'Brachioradialis (Forearms)' },
    'bicep-curl': { primary: 'Biceps Brachii (Peak)', secondary: 'Brachialis, Forearms' },
    'tricep-pushdown': { primary: 'Triceps Brachii (Lateral Head)', secondary: 'Anconeus' },
    'incline-db-press': { primary: 'Upper Chest (Clavicular Head)', secondary: 'Anterior Delts, Triceps' },
    'bench-press': { primary: 'Pectoralis Major (Mid/Overall Chest)', secondary: 'Triceps, Front Delts' },
    'pushups': { primary: 'Pectorals & Core Stabilizers', secondary: 'Triceps, Anterior Delts' },
    'cable-fly': { primary: 'Pectoralis Sternal Head (Inner Pecs)', secondary: 'Anterior Deltoids' },
    'chest-dips': { primary: 'Lower Pectorals (Chest Flare)', secondary: 'Triceps, Front Delts' },
    'deadlift': { primary: 'Glutes, Hamstrings & Lower Spine', secondary: 'Lats, Upper Traps, Forearms' },
    'pullups': { primary: 'Latissimus Dorsi & Upper Back', secondary: 'Biceps, Rhomboids, Core' },
    'barbell-squat': { primary: 'Quadriceps & Gluteus Maximus', secondary: 'Hamstrings, Calves, Core' },
    'walking-lunges': { primary: 'Glutes & Quads (Unilateral)', secondary: 'Hamstrings, Calves' },
    'calf-raise': { primary: 'Gastrocnemius & Soleus (Calves)', secondary: 'Achilles Tendon, Ankles' },
    'overhead-press': { primary: 'Anterior & Medial Deltoids (Shoulders)', secondary: 'Triceps, Upper Chest' },
    'lateral-raise': { primary: 'Lateral Deltoids (Side Shoulders)', secondary: 'Trapezius' },
    'plank': { primary: 'Rectus Abdominis & Deep Core', secondary: 'Glutes, Shoulders' },
  };

  if (muscleMap[key]) return muscleMap[key];
  if (details.muscle) {
    const parts = details.muscle.split(',');
    return { primary: parts[0]?.trim() || 'Target Muscle', secondary: parts.slice(1).join(',').trim() || 'Assisting Muscles' };
  }
  return { primary: 'Target Muscle Group', secondary: 'Assisting Muscles' };
}

/**
 * AnatomicalFigureSvg
 * High-definition SVG rendering anatomical human athletic body (Women & Men)
 * on exercise machines / free weights, showing START and FINISH phases
 * with target muscles highlighted in glowing bright RED (#FF1E44).
 */
function AnatomicalFigureSvg({ exercise, isFemale, phase }) {
  const isStart = phase === 'start';
  const bodyColor = '#CBD5E1'; // Athletic sculpted muscle tone
  const shadedMuscle = '#94A3B8'; // Muscle shading lines
  const targetRed = '#FF1E44'; // Bright active muscle contraction
  const highlightRed = '#FF4D6D'; // Glow highlight
  const machineSteel = '#475569';
  const steelFrame = '#334155';
  const cableColor = '#94A3B8';
  const benchPad = '#1E293B';
  const shortsColor = isFemale ? '#F43F5E' : '#0F172A'; // Women pink/rose athletic shorts, Men dark shorts
  const topColor = isFemale ? '#F43F5E' : 'none'; // Sports bra for female

  // -------------------------------------------------------------------
  // 1. LAT PULLDOWN (Cable Machine - As in user's reference image)
  // -------------------------------------------------------------------
  if (exercise === 'lat-pulldown') {
    return (
      <svg viewBox="0 0 170 190" className="w-full h-full max-h-48 drop-shadow-xl">
        <defs>
          <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#FF1E44" />
          </linearGradient>
        </defs>

        {/* Machine Frame & Weight Stack */}
        <rect x="25" y="20" width="8" height="155" fill={steelFrame} rx="2" />
        <rect x="22" y="50" width="14" height="60" fill="#1E293B" rx="1" />
        <line x1="29" y1="20" x2="100" y2="20" stroke={steelFrame} strokeWidth="6" strokeLinecap="round" />
        <circle cx="100" cy="20" r="5" fill={machineSteel} />

        {/* Cable Pulley */}
        {isStart ? (
          <line x1="100" y1="20" x2="100" y2="55" stroke={cableColor} strokeWidth="2.5" />
        ) : (
          <line x1="100" y1="20" x2="95" y2="82" stroke={cableColor} strokeWidth="2.5" />
        )}

        {/* Pulldown Wide Bar */}
        {isStart ? (
          <path d="M 75 52 Q 100 55 125 52" stroke={machineSteel} strokeWidth="4" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M 72 80 Q 95 83 118 80" stroke={machineSteel} strokeWidth="4" strokeLinecap="round" fill="none" />
        )}

        {/* Bench & Knee Pad */}
        <rect x="65" y="125" width="45" height="10" rx="3" fill={benchPad} />
        <line x1="85" y1="135" x2="85" y2="175" stroke={steelFrame} strokeWidth="6" />
        <rect x="60" y="105" width="18" height="8" rx="3" fill={benchPad} />

        {/* ATHLETE BODY (Seated Facing Left/Machine) */}
        {/* Head */}
        <circle cx="95" cy={isStart ? "68" : "72"} r={isFemale ? "9" : "10"} fill={bodyColor} />
        {isFemale && (
          /* Ponytail */
          <path d={isStart ? "M 103 68 Q 112 72 110 82" : "M 103 72 Q 112 76 110 86"} stroke="#E2E8F0" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}

        {/* Torso & Spine */}
        {/* Back & Lats: In Finish phase, LATS ARE VIVID RED! */}
        <path
          d={isStart 
            ? "M 92 78 L 94 125 L 82 125 L 85 82 Z" 
            : "M 92 82 L 95 125 L 80 125 L 84 86 Z"
          }
          fill={!isStart ? "url(#redGlow)" : bodyColor}
          filter={!isStart ? "drop-shadow(0 0 6px #ff1e44)" : "none"}
        />

        {/* Female sports top if female */}
        {isFemale && (
          <rect x="83" y={isStart ? "80" : "84"} width="12" height="15" rx="3" fill={topColor} opacity="0.9" />
        )}

        {/* Arms */}
        {isStart ? (
          /* Arms reaching high to the bar */
          <g>
            <path d="M 90 77 L 85 54 L 88 52" stroke={bodyColor} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 95 77 L 115 54 L 112 52" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        ) : (
          /* Arms pulled down, elbows driven back, biceps squeezed */
          <g>
            <path d="M 90 82 L 80 102 L 85 82" stroke="url(#redGlow)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="drop-shadow(0 0 5px #ff1e44)" />
            <path d="M 94 82 L 105 102 L 100 82" stroke="url(#redGlow)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="drop-shadow(0 0 5px #ff1e44)" />
          </g>
        )}

        {/* Shorts / Pelvis */}
        <path d="M 80 122 L 96 122 L 94 136 L 76 136 Z" fill={shortsColor} />

        {/* Thighs (locked under knee pad) & Legs */}
        <path d="M 82 125 L 62 110 L 62 165 L 55 175" stroke={bodyColor} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  // -------------------------------------------------------------------
  // 2. SEATED CABLE ROW (As in user's reference image)
  // -------------------------------------------------------------------
  if (exercise === 'seated-cable-row') {
    return (
      <svg viewBox="0 0 170 190" className="w-full h-full max-h-48 drop-shadow-xl">
        <defs>
          <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#FF1E44" />
          </linearGradient>
        </defs>

        {/* Low Pulley Machine & Cable */}
        <rect x="25" y="60" width="8" height="115" fill={steelFrame} />
        <circle cx="33" cy="115" r="5" fill={machineSteel} />
        <rect x="45" y="110" width="6" height="25" rx="1" fill={machineSteel} /> {/* Foot Plate */}

        {/* Bench */}
        <rect x="65" y="130" width="65" height="10" rx="3" fill={benchPad} />
        <line x1="95" y1="140" x2="95" y2="175" stroke={steelFrame} strokeWidth="6" />

        {/* Cable & V-Bar */}
        {isStart ? (
          <>
            <line x1="33" y1="115" x2="75" y2="115" stroke={cableColor} strokeWidth="2.5" />
            <rect x="73" y="110" width="4" height="10" rx="1" fill={machineSteel} />
          </>
        ) : (
          <>
            <line x1="33" y1="115" x2="92" y2="118" stroke={cableColor} strokeWidth="2.5" />
            <rect x="90" y="113" width="4" height="10" rx="1" fill={machineSteel} />
          </>
        )}

        {/* ATHLETE BODY (Seated facing left) */}
        {/* Head */}
        <circle cx={isStart ? "105" : "115"} cy="85" r={isFemale ? "9" : "10"} fill={bodyColor} />
        {isFemale && (
          <path d={isStart ? "M 112 85 Q 122 88 120 98" : "M 122 85 Q 132 88 130 98"} stroke="#E2E8F0" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}

        {/* Torso & Back: In Finish, RHOMBOIDS & LATS IN VIVID RED */}
        <path
          d={isStart 
            ? "M 103 95 L 98 132 L 112 132 L 115 95 Z" 
            : "M 112 95 L 105 132 L 122 132 L 126 95 Z"
          }
          fill={!isStart ? "url(#redGlow)" : bodyColor}
          filter={!isStart ? "drop-shadow(0 0 6px #ff1e44)" : "none"}
        />

        {isFemale && (
          <rect x={isStart ? "99" : "107"} y="96" width="14" height="15" rx="3" fill={topColor} opacity="0.9" />
        )}

        {/* Arms */}
        {isStart ? (
          /* Arms reaching forward to handle */
          <path d="M 105 97 L 76 115" stroke={bodyColor} strokeWidth="7" strokeLinecap="round" fill="none" />
        ) : (
          /* Arms pulled into ribcage, elbows driven backward */
          <path d="M 113 97 L 130 115 L 94 118" stroke="url(#redGlow)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="drop-shadow(0 0 5px #ff1e44)" />
        )}

        {/* Shorts */}
        <path d={isStart ? "M 96 128 L 115 128 L 112 140 L 93 140 Z" : "M 103 128 L 124 128 L 120 140 L 100 140 Z"} fill={shortsColor} />

        {/* Legs on footplate */}
        <path d={isStart ? "M 100 132 L 75 125 L 48 118" : "M 108 132 L 78 125 L 48 118"} stroke={bodyColor} strokeWidth="9" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // -------------------------------------------------------------------
  // 3. PREACHER CURLS (As in user's reference image)
  // -------------------------------------------------------------------
  if (exercise === 'preacher-curls') {
    return (
      <svg viewBox="0 0 170 190" className="w-full h-full max-h-48 drop-shadow-xl">
        <defs>
          <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#FF1E44" />
          </linearGradient>
        </defs>

        {/* Preacher Bench Pad (Slanted) & Seat */}
        <polygon points="60,95 85,120 78,125 53,100" fill={benchPad} />
        <rect x="95" y="130" width="35" height="8" rx="2" fill={benchPad} />
        <line x1="70" y1="110" x2="70" y2="175" stroke={steelFrame} strokeWidth="6" />
        <line x1="110" y1="138" x2="110" y2="175" stroke={steelFrame} strokeWidth="6" />

        {/* ATHLETE BODY (Seated behind pad) */}
        <circle cx="102" cy="78" r={isFemale ? "9" : "10"} fill={bodyColor} />
        {isFemale && (
          <path d="M 110 78 Q 120 82 118 92" stroke="#E2E8F0" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}

        {/* Torso leaning into pad */}
        <path d="M 98 88 L 78 115 L 94 135 L 112 135 L 110 90 Z" fill={bodyColor} />
        {isFemale && <rect x="88" y="92" width="16" height="15" rx="3" fill={topColor} opacity="0.9" />}

        {/* ARMS & BICEPS: In finish, BICEPS IN VIVID RED! */}
        {isStart ? (
          /* Arms extended resting down on pad */
          <g>
            <path d="M 93 92 L 68 108 L 48 100" stroke={bodyColor} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Barbell weights at bottom */}
            <circle cx="48" cy="100" r="7" fill={machineSteel} />
            <line x1="40" y1="100" x2="56" y2="100" stroke="#FFF" strokeWidth="3" />
          </g>
        ) : (
          /* Arms curled up, BICEPS BULGING RED */
          <g>
            <path d="M 93 92 L 68 112 L 62 82" stroke="url(#redGlow)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="drop-shadow(0 0 6px #ff1e44)" />
            {/* Barbell weights curled at top */}
            <circle cx="62" cy="82" r="7" fill={machineSteel} />
            <line x1="54" y1="82" x2="70" y2="82" stroke="#FFF" strokeWidth="3" />
          </g>
        )}

        {/* Shorts & Legs */}
        <rect x="94" y="130" width="22" height="12" rx="2" fill={shortsColor} />
        <path d="M 100 135 L 80 150 L 80 175" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // -------------------------------------------------------------------
  // 4. HAMMER CURLS & BICEP CURLS (As in user's reference image)
  // -------------------------------------------------------------------
  if (exercise === 'hammer-curls' || exercise === 'bicep-curl') {
    return (
      <svg viewBox="0 0 170 190" className="w-full h-full max-h-48 drop-shadow-xl">
        <defs>
          <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#FF1E44" />
          </linearGradient>
        </defs>

        {/* ATHLETE BODY (Standing Frontal/Slight Angle) */}
        {/* Head */}
        <circle cx="85" cy="40" r={isFemale ? "9" : "10"} fill={bodyColor} />
        {isFemale && (
          <path d="M 92 40 Q 102 44 100 55" stroke="#E2E8F0" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}

        {/* Torso */}
        <path
          d={isFemale 
            ? "M 75 52 L 95 52 L 91 92 L 79 92 Z" 
            : "M 70 52 L 100 52 L 94 92 L 76 92 Z"
          }
          fill={bodyColor}
        />
        {isFemale && <rect x="74" y="52" width="22" height="16" rx="3" fill={topColor} opacity="0.9" />}

        {/* Biceps & Forearms: In Finish phase, BICEPS IN VIVID RED */}
        {isStart ? (
          /* Arms hanging down at sides holding dumbbells */
          <g>
            <path d="M 72 54 L 62 85 L 62 105" stroke={bodyColor} strokeWidth="6.5" strokeLinecap="round" fill="none" />
            <path d="M 98 54 L 108 85 L 108 105" stroke={bodyColor} strokeWidth="6.5" strokeLinecap="round" fill="none" />
            {/* Dumbbells at thighs */}
            <rect x="57" y="102" width="10" height="14" rx="2" fill={machineSteel} />
            <rect x="103" y="102" width="10" height="14" rx="2" fill={machineSteel} />
          </g>
        ) : (
          /* Arms curled up, BICEPS BURNING IN RED */
          <g>
            <path d="M 72 54 L 62 85 L 70 65" stroke="url(#redGlow)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="drop-shadow(0 0 6px #ff1e44)" />
            <path d="M 98 54 L 108 85 L 100 65" stroke="url(#redGlow)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="drop-shadow(0 0 6px #ff1e44)" />
            {/* Dumbbells at chest height */}
            <rect x="65" y="60" width="11" height="14" rx="2" fill={machineSteel} />
            <rect x="94" y="60" width="11" height="14" rx="2" fill={machineSteel} />
          </g>
        )}

        {/* Shorts */}
        <path d="M 75 90 L 95 90 L 98 115 L 72 115 Z" fill={shortsColor} />

        {/* Legs */}
        <path d="M 78 115 L 76 175" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M 92 115 L 94 175" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // -------------------------------------------------------------------
  // 5. DB SHRUGS (As in user's reference image)
  // -------------------------------------------------------------------
  if (exercise === 'db-shrugs') {
    return (
      <svg viewBox="0 0 170 190" className="w-full h-full max-h-48 drop-shadow-xl">
        <defs>
          <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#FF1E44" />
          </linearGradient>
        </defs>

        {/* Athlete Standing Back View (Highlighting TRAPEZIUS IN RED) */}
        <circle cx="85" cy={isStart ? "42" : "38"} r={isFemale ? "9" : "10"} fill={bodyColor} />

        {/* Trapezius & Neck: In Finish phase, TRAPS ELEVATED & VIVID RED */}
        <path
          d={isStart 
            ? "M 70 55 Q 85 46 100 55 L 95 72 Q 85 75 75 72 Z" 
            : "M 66 46 Q 85 36 104 46 L 98 68 Q 85 72 72 68 Z"
          }
          fill={!isStart ? "url(#redGlow)" : bodyColor}
          filter={!isStart ? "drop-shadow(0 0 7px #ff1e44)" : "none"}
        />

        {/* Mid-back & Spine */}
        <path d="M 72 65 L 98 65 L 93 95 L 77 95 Z" fill={bodyColor} />

        {/* Arms holding heavy dumbbells */}
        <path d={isStart ? "M 68 56 L 60 102" : "M 66 48 L 60 96"} stroke={bodyColor} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d={isStart ? "M 102 56 L 110 102" : "M 104 48 L 110 96"} stroke={bodyColor} strokeWidth="7" strokeLinecap="round" fill="none" />

        {/* Dumbbells at sides */}
        <rect x="54" y={isStart ? "98" : "92"} width="12" height="18" rx="3" fill={machineSteel} />
        <rect x="104" y={isStart ? "98" : "92"} width="12" height="18" rx="3" fill={machineSteel} />

        {/* Shorts & Legs */}
        <path d="M 75 94 L 95 94 L 98 120 L 72 120 Z" fill={shortsColor} />
        <path d="M 77 120 L 75 175" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M 93 120 L 95 175" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // -------------------------------------------------------------------
  // 6. BARBELL BENCH PRESS (Flat Bench, Chest in VIVID RED)
  // -------------------------------------------------------------------
  if (exercise === 'bench-press') {
    return (
      <svg viewBox="0 0 170 190" className="w-full h-full max-h-48 drop-shadow-xl">
        <defs>
          <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#FF1E44" />
          </linearGradient>
        </defs>

        {/* Bench & Barbell Rack */}
        <rect x="30" y="115" width="95" height="10" rx="3" fill={benchPad} />
        <line x1="38" y1="125" x2="38" y2="165" stroke={steelFrame} strokeWidth="6" />
        <line x1="110" y1="125" x2="110" y2="165" stroke={steelFrame} strokeWidth="6" />
        <line x1="42" y1="70" x2="42" y2="125" stroke={steelFrame} strokeWidth="5" />

        {/* Athlete lying on bench */}
        <circle cx="48" cy="110" r={isFemale ? "9" : "10"} fill={bodyColor} />
        {/* Chest & Torso: In Finish, PECS IN VIVID RED! */}
        <path
          d="M 58 112 L 95 112 L 95 102 L 58 102 Z"
          fill={!isStart ? "url(#redGlow)" : bodyColor}
          filter={!isStart ? "drop-shadow(0 0 6px #ff1e44)" : "none"}
        />

        {/* Barbell & Arms */}
        {isStart ? (
          /* Start: Barbell pressed high up */
          <g>
            <path d="M 68 105 L 68 70" stroke={bodyColor} strokeWidth="6.5" strokeLinecap="round" fill="none" />
            <line x1="50" y1="68" x2="86" y2="68" stroke={machineSteel} strokeWidth="4" />
            <circle cx="50" cy="68" r="8" fill={machineSteel} />
            <circle cx="86" cy="68" r="8" fill={machineSteel} />
          </g>
        ) : (
          /* Finish: Barbell lowered to mid-chest, pecs stretched red */
          <g>
            <path d="M 68 110 L 58 118 L 68 96" stroke="url(#redGlow)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="drop-shadow(0 0 6px #ff1e44)" />
            <line x1="50" y1="94" x2="86" y2="94" stroke={machineSteel} strokeWidth="4" />
            <circle cx="50" cy="94" r="8" fill={machineSteel} />
            <circle cx="86" cy="94" r="8" fill={machineSteel} />
          </g>
        )}

        {/* Legs bent down to floor for drive */}
        <path d="M 95 115 L 115 125 L 115 165" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  // -------------------------------------------------------------------
  // 7. BARBELL BACK SQUAT (Legs & Glutes in VIVID RED)
  // -------------------------------------------------------------------
  if (exercise === 'barbell-squat') {
    return (
      <svg viewBox="0 0 170 190" className="w-full h-full max-h-48 drop-shadow-xl">
        <defs>
          <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#FF1E44" />
          </linearGradient>
        </defs>

        {isStart ? (
          /* START: Standing Tall with Barbell on Traps */
          <g>
            {/* Barbell Across Traps */}
            <line x1="50" y1="48" x2="120" y2="48" stroke={machineSteel} strokeWidth="4" />
            <circle cx="52" cy="48" r="9" fill={machineSteel} />
            <circle cx="118" cy="48" r="9" fill={machineSteel} />

            {/* Head & Torso */}
            <circle cx="85" cy="40" r={isFemale ? "9" : "10"} fill={bodyColor} />
            <path d="M 72 50 L 98 50 L 93 98 L 77 98 Z" fill={bodyColor} />

            {/* Shorts */}
            <path d="M 75 96 L 95 96 L 98 116 L 72 116 Z" fill={shortsColor} />

            {/* Quads & Legs Standing Straight */}
            <path d="M 77 115 L 75 175" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M 93 115 L 95 175" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          /* FINISH: Deep Parallel Squat, QUADS & GLUTES BURNING IN VIVID RED */
          <g>
            {/* Barbell lowered */}
            <line x1="45" y1="88" x2="115" y2="88" stroke={machineSteel} strokeWidth="4" />
            <circle cx="47" cy="88" r="9" fill={machineSteel} />
            <circle cx="113" cy="88" r="9" fill={machineSteel} />

            {/* Head & Angled Torso */}
            <circle cx="85" cy="78" r={isFemale ? "9" : "10"} fill={bodyColor} />
            <path d="M 72 88 L 98 88 L 92 124 L 76 124 Z" fill={bodyColor} />

            {/* Shorts & Glutes in Deep Hinge */}
            <path d="M 75 122 L 95 122 L 102 138 L 70 138 Z" fill={shortsColor} />

            {/* Quads Bent 90° Parallel to Floor IN VIVID RED */}
            <path d="M 75 125 L 55 138 L 65 175" stroke="url(#redGlow)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="drop-shadow(0 0 6px #ff1e44)" />
            <path d="M 93 125 L 115 138 L 105 175" stroke="url(#redGlow)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="drop-shadow(0 0 6px #ff1e44)" />
          </g>
        )}
      </svg>
    );
  }

  // -------------------------------------------------------------------
  // DEFAULT / GENERAL EXERCISE (Clean anatomical figure with red muscle)
  // -------------------------------------------------------------------
  return (
    <svg viewBox="0 0 170 190" className="w-full h-full max-h-48 drop-shadow-xl">
      <defs>
        <linearGradient id="redGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D6D" />
          <stop offset="100%" stopColor="#FF1E44" />
        </linearGradient>
      </defs>

      {/* Head */}
      <circle cx="85" cy="42" r={isFemale ? "9" : "10"} fill={bodyColor} />
      {isFemale && <path d="M 92 42 Q 102 46 100 56" stroke="#E2E8F0" strokeWidth="3" fill="none" strokeLinecap="round" />}

      {/* Torso */}
      <path
        d="M 72 52 L 98 52 L 93 96 L 77 96 Z"
        fill={!isStart ? "url(#redGlow)" : bodyColor}
        filter={!isStart ? "drop-shadow(0 0 6px #ff1e44)" : "none"}
      />

      {/* Arms */}
      <path d={isStart ? "M 72 55 L 60 90 L 60 115" : "M 72 55 L 55 85 L 68 65"} stroke={!isStart ? "url(#redGlow)" : bodyColor} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={isStart ? "M 98 55 L 110 90 L 110 115" : "M 98 55 L 115 85 L 102 65"} stroke={!isStart ? "url(#redGlow)" : bodyColor} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Dumbbells */}
      <rect x="54" y={isStart ? "110" : "60"} width="12" height="15" rx="2" fill={machineSteel} />
      <rect x="104" y={isStart ? "110" : "60"} width="12" height="15" rx="2" fill={machineSteel} />

      {/* Shorts & Legs */}
      <path d="M 75 94 L 95 94 L 98 120 L 72 120 Z" fill={shortsColor} />
      <path d="M 77 120 L 75 175" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M 93 120 L 95 175" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" fill="none" />
    </svg>
  );
}
