import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

/**
 * AnatomicalMannequin2Step Component
 * Exact match for the exercise demonstration box in the user's screenshots:
 * - Clean white card background with rounded gray border
 * - Side-by-side Position 1 (Start form) & Position 2 (Peak contraction form)
 * - Anatomical medical mannequin with contoured athletic muscle lines
 * - Target muscles highlighted in bright RED (#FF3B30)
 * - Supports both Women ♀️ and Men ♂️ models
 * - Video Play button (▶) in the bottom-right corner to toggle smooth looping rep animation!
 */
export default function AnatomicalMannequin2Step({
  exerciseName = '',
  primaryMuscle = '',
  gender = 'male',
  className = ''
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [animPhase, setAnimPhase] = useState('start'); // 'start' | 'finish'
  const isFemale = gender === 'female';

  // Toggle looping animation when play button is pressed
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setAnimPhase(prev => (prev === 'start' ? 'finish' : 'start'));
      }, 1200);
    } else {
      setAnimPhase('start');
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const clean = (exerciseName || '').toLowerCase();

  // Determine which exercise figure to render
  const getExerciseType = () => {
    if (clean.includes('wiper') || clean.includes('windshield')) return 'wipers';
    if (clean.includes('push-up') || clean.includes('pushup') || clean.includes('push up')) return 'pushups';
    if (clean.includes('incline') && clean.includes('press')) return 'incline-bench';
    if (clean.includes('decline') && clean.includes('press')) return 'decline-bench';
    if (clean.includes('fly') || clean.includes('crossover')) return 'bench-fly';
    if (clean.includes('pullover')) return 'pullover';
    if (clean.includes('bench') || clean.includes('chest press')) return 'flat-bench';
    if (clean.includes('lat pull') || clean.includes('pulldown')) return 'lat-pulldown';
    if (clean.includes('pull up') || clean.includes('pullup') || clean.includes('chin')) return 'pullups';
    if (clean.includes('row')) return 'rows';
    if (clean.includes('deadlift')) return 'deadlift';
    if (clean.includes('squat')) return 'squats';
    if (clean.includes('thrust') || clean.includes('bridge') || clean.includes('kickback') || clean.includes('glute') || clean.includes('butt')) return 'hip-thrust';
    if (clean.includes('lunge')) return 'lunges';
    if (clean.includes('shoulder') || clean.includes('overhead') || clean.includes('military')) return 'shoulder-press';
    if (clean.includes('lateral raise')) return 'lateral-raises';
    if (clean.includes('bicep') || clean.includes('curl')) return 'bicep-curls';
    if (clean.includes('tricep') || clean.includes('pushdown') || clean.includes('skull')) return 'tricep-pushdown';
    if (clean.includes('plank')) return 'plank';
    if (clean.includes('leg raise') || clean.includes('ab') || clean.includes('crunch')) return 'wipers';
    return 'pushups';
  };

  const type = getExerciseType();

  return (
    <div className={`relative bg-white border border-gray-200 rounded-3xl p-4 sm:p-5 shadow-sm overflow-hidden select-none ${className}`}>
      {isPlaying ? (
        /* Animated Solo Loop */
        <div className="flex flex-col items-center justify-center py-4 min-h-[160px] sm:min-h-[190px]">
          <div className="text-[11px] font-extrabold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{animPhase === 'start' ? '1. Start Position' : '2. Peak Contraction (Red)'}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${type}-${animPhase}-${gender}`}
              initial={{ opacity: 0.85, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.85, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-center h-40 sm:h-48"
            >
              <MannequinFigureSvg type={type} phase={animPhase} isFemale={isFemale} />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* Side-by-side Position 1 and Position 2 (Exact screenshot style) */
        <div className="grid grid-cols-2 gap-3 sm:gap-6 items-center justify-center min-h-[160px] sm:min-h-[190px]">
          {/* Position 1 (Start) */}
          <div className="flex flex-col items-center justify-center">
            <div className="h-36 sm:h-44 w-full flex items-center justify-center">
              <MannequinFigureSvg type={type} phase="start" isFemale={isFemale} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Start</span>
          </div>

          {/* Position 2 (Finish / Peak with Red Muscle) */}
          <div className="flex flex-col items-center justify-center">
            <div className="h-36 sm:h-44 w-full flex items-center justify-center">
              <MannequinFigureSvg type={type} phase="finish" isFemale={isFemale} />
            </div>
            <span className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">Target Contraction</span>
          </div>
        </div>
      )}

      {/* Video / Play button in bottom-right corner (Matching user screenshot!) */}
      <button
        type="button"
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-300 text-gray-800 hover:text-red-500 hover:border-red-400 shadow-md flex items-center justify-center transition-all active:scale-95 group"
        title={isPlaying ? "Pause Demonstration" : "Play Looping Movement"}
      >
        {isPlaying ? (
          <Pause size={18} className="text-red-500" />
        ) : (
          <Play size={18} className="fill-gray-800 group-hover:fill-red-500 text-gray-800 group-hover:text-red-500 ml-0.5" />
        )}
      </button>
    </div>
  );
}

/**
 * MannequinFigureSvg
 * Renders medical/anatomical mannequin drawings with active muscles highlighted in bright RED.
 * Clean, high-contrast, designed specifically for white backgrounds.
 */
function MannequinFigureSvg({ type, phase, isFemale }) {
  const isStart = phase === 'start';
  const skin = '#94A3B8'; // Athletic mannequin contour lines
  const skinFill = '#E2E8F0'; // Body tone
  const muscleFill = '#CBD5E1'; // Neutral muscles
  const targetRed = '#FF3B30'; // Highlighted muscle
  const darkBench = '#334155';
  const equipmentGold = '#EAB308'; // Resistance band / Dumbbell plates
  const dumbbellGray = '#475569';
  const clothingColor = isFemale ? '#F43F5E' : '#1E293B';

  // -------------------------------------------------------------
  // 1. PUSH-UP / BAND PUSH-UP (Matching Screenshot 1 Push-up* Band)
  // -------------------------------------------------------------
  if (type === 'pushups') {
    return isStart ? (
      /* Start Phase: Upward Plank Position */
      <svg viewBox="0 0 160 100" className="w-full h-full max-h-36 object-contain">
        {/* Floor Line */}
        <line x1="10" y1="90" x2="150" y2="90" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
        {/* Legs & Torso in Angled High Plank */}
        <path d="M 20 85 L 35 75 L 60 70 L 95 65 L 125 60" fill="none" stroke={skin} strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="45" cy="73" rx="14" ry="7" fill={muscleFill} stroke={skin} strokeWidth="1.2" transform="rotate(-15 45 73)" />
        {/* Torso & Glutes */}
        <ellipse cx="80" cy="67" rx="18" ry="8" fill={clothingColor} stroke={skin} strokeWidth="1.2" transform="rotate(-8 80 67)" />
        {/* Head */}
        <circle cx="140" cy="52" r="9" fill={skinFill} stroke={skin} strokeWidth="1.5" />
        {/* Chest Pectorals & Front Deltoid in Red (Initial Tension) */}
        <path d="M 112 58 Q 124 55 126 68 Q 116 72 110 65 Z" fill={targetRed} stroke="#E11D48" strokeWidth="1.5" />
        {/* Extended Straight Arms */}
        <path d="M 120 62 L 120 88" stroke={skin} strokeWidth="5" strokeLinecap="round" />
        {/* Yellow Resistance Band across upper back to hands */}
        <path d="M 118 88 Q 112 50 122 52 Q 130 54 122 88" fill="none" stroke={equipmentGold} strokeWidth="2.5" strokeLinecap="round" />
        {/* Feet planted */}
        <circle cx="20" cy="85" r="4" fill={darkBench} />
      </svg>
    ) : (
      /* Finish Phase: Low Chest to Floor (Peak Squeeze in Red) */
      <svg viewBox="0 0 160 100" className="w-full h-full max-h-36 object-contain">
        {/* Floor Line */}
        <line x1="10" y1="90" x2="150" y2="90" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
        {/* Body Low to Floor */}
        <path d="M 20 85 L 50 82 L 85 80 L 120 78" fill="none" stroke={skin} strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="50" cy="83" rx="14" ry="6" fill={muscleFill} stroke={skin} strokeWidth="1.2" />
        {/* Glutes */}
        <ellipse cx="80" cy="81" rx="16" ry="7" fill={clothingColor} stroke={skin} strokeWidth="1.2" />
        {/* Head */}
        <circle cx="142" cy="72" r="9" fill={skinFill} stroke={skin} strokeWidth="1.5" />
        {/* Bent Arms (Triceps & Elbows Squeezing in Red) */}
        <path d="M 118 78 L 132 68 L 124 88" fill="none" stroke={targetRed} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* CHEST CONTRACTED (Bright Red Squeeze) */}
        <path d="M 116 75 Q 128 72 130 82 Q 120 85 114 80 Z" fill={targetRed} stroke="#E11D48" strokeWidth="1.8" />
        {/* Stretched Resistance Band */}
        <path d="M 124 88 Q 126 65 132 68 Q 136 70 126 88" fill="none" stroke={equipmentGold} strokeWidth="3" strokeLinecap="round" />
        <circle cx="20" cy="85" r="4" fill={darkBench} />
      </svg>
    );
  }

  // -------------------------------------------------------------
  // 2. WIPERS / ABS (Matching Screenshot 3 Wipers)
  // -------------------------------------------------------------
  if (type === 'wipers') {
    return isStart ? (
      /* Wipers Start: Lying on back, legs straight UP at 90 degrees */
      <svg viewBox="0 0 160 100" className="w-full h-full max-h-36 object-contain">
        {/* Floor line */}
        <line x1="10" y1="85" x2="150" y2="85" stroke="#CBD5E1" strokeWidth="2" />
        {/* Head */}
        <circle cx="35" cy="78" r="8" fill={skinFill} stroke={skin} strokeWidth="1.5" />
        {/* Torso on floor */}
        <rect x="42" y="74" width="45" height="10" rx="4" fill={muscleFill} stroke={skin} strokeWidth="1.2" />
        {/* Sports top/shorts for female */}
        {isFemale && <rect x="44" y="74" width="16" height="10" rx="2" fill={clothingColor} />}
        <rect x="75" y="74" width="14" height="10" rx="2" fill={clothingColor} />
        {/* Arms outstretched to side for balance */}
        <line x1="55" y1="80" x2="35" y2="86" stroke={skin} strokeWidth="3" strokeLinecap="round" />
        {/* ABDOMINALS ENGAGED (Red Highlight) */}
        <rect x="60" y="73" width="16" height="11" rx="2" fill={targetRed} stroke="#E11D48" strokeWidth="1.2" />
        {/* Legs pointing straight UP (90 degrees vertical) */}
        <path d="M 85 75 L 85 25" stroke={skin} strokeWidth="6" strokeLinecap="round" />
        <circle cx="85" cy="22" r="3" fill={equipmentGold} />
      </svg>
    ) : (
      /* Wipers Finish: Legs rotated down to the side (Obliques contraction in Red) */
      <svg viewBox="0 0 160 100" className="w-full h-full max-h-36 object-contain">
        {/* Floor line */}
        <line x1="10" y1="85" x2="150" y2="85" stroke="#CBD5E1" strokeWidth="2" />
        {/* Head on floor */}
        <circle cx="35" cy="78" r="8" fill={skinFill} stroke={skin} strokeWidth="1.5" />
        {/* Torso flat on back */}
        <rect x="42" y="74" width="45" height="10" rx="4" fill={muscleFill} stroke={skin} strokeWidth="1.2" />
        {isFemale && <rect x="44" y="74" width="16" height="10" rx="2" fill={clothingColor} />}
        <rect x="75" y="74" width="14" height="10" rx="2" fill={clothingColor} />
        {/* Outstretched arms */}
        <line x1="55" y1="80" x2="35" y2="86" stroke={skin} strokeWidth="3" strokeLinecap="round" />
        {/* OBLIQUES & ABS ROTATED IN DEEP RED */}
        <path d="M 58 72 Q 74 68 76 82 Q 62 86 58 72 Z" fill={targetRed} stroke="#E11D48" strokeWidth="1.5" />
        {/* Legs twisted together to side near floor */}
        <path d="M 85 76 Q 115 70 142 80" stroke={skin} strokeWidth="6" strokeLinecap="round" />
        <circle cx="143" cy="80" r="3" fill={equipmentGold} />
      </svg>
    );
  }

  // -------------------------------------------------------------
  // 3. INCLINE BENCH PRESS / DUMBBELL (Matching Screenshot 4)
  // -------------------------------------------------------------
  if (type === 'incline-bench' || type === 'flat-bench' || type === 'decline-bench') {
    const angle = type === 'incline-bench' ? 30 : type === 'decline-bench' ? -20 : 0;
    return isStart ? (
      /* Start: Lowered Dumbbells at Chest level */
      <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
        {/* Bench */}
        <line x1="30" y1="95" x2="130" y2="95" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="40" y="55" width="65" height="10" rx="3" fill={darkBench} transform={`rotate(${-angle} 70 60)`} />
        <line x1="50" y1="65" x2="50" y2="95" stroke="#475569" strokeWidth="3" />
        <line x1="95" y1="65" x2="95" y2="95" stroke="#475569" strokeWidth="3" />
        {/* Torso on Bench */}
        <ellipse cx="72" cy="54" rx="22" ry="9" fill={skinFill} stroke={skin} strokeWidth="1.2" transform={`rotate(${-angle} 72 54)`} />
        {/* CHEST IN ACTIVE STRETCH (Red) */}
        <ellipse cx="72" cy="51" rx="12" ry="6" fill={targetRed} stroke="#E11D48" strokeWidth="1.2" transform={`rotate(${-angle} 72 51)`} />
        {/* Head */}
        <circle cx="48" cy="42" r="8" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        {/* Bent Arms holding weights at chest */}
        <path d="M 70 48 L 82 40 L 76 34" stroke={dumbbellGray} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="70" y="30" width="12" height="6" rx="2" fill={equipmentGold} />
      </svg>
    ) : (
      /* Finish: Pressed to Lockout (Upper Chest Peak Contraction in Red) */
      <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
        {/* Bench */}
        <line x1="30" y1="95" x2="130" y2="95" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="40" y="55" width="65" height="10" rx="3" fill={darkBench} transform={`rotate(${-angle} 70 60)`} />
        <line x1="50" y1="65" x2="50" y2="95" stroke="#475569" strokeWidth="3" />
        <line x1="95" y1="65" x2="95" y2="95" stroke="#475569" strokeWidth="3" />
        {/* Torso on Bench */}
        <ellipse cx="72" cy="54" rx="22" ry="9" fill={skinFill} stroke={skin} strokeWidth="1.2" transform={`rotate(${-angle} 72 54)`} />
        {/* CHEST & DELTS FULLY SQUEEZED (Bright Red) */}
        <ellipse cx="72" cy="50" rx="14" ry="7" fill={targetRed} stroke="#E11D48" strokeWidth="1.5" transform={`rotate(${-angle} 72 50)`} />
        {/* Head */}
        <circle cx="48" cy="42" r="8" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        {/* Arms Extended Straight Up */}
        <line x1="72" y1="48" x2="72" y2="18" stroke={skin} strokeWidth="4" strokeLinecap="round" />
        <rect x="64" y="14" width="16" height="6" rx="2" fill={equipmentGold} />
      </svg>
    );
  }

  // -------------------------------------------------------------
  // 4. BENCH FLY / DUMBBELL (Matching Screenshot 4 Bench Fly* Dumbbell)
  // -------------------------------------------------------------
  if (type === 'bench-fly') {
    return isStart ? (
      /* Start: Arms wide open in deep chest stretch */
      <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
        <line x1="20" y1="95" x2="140" y2="95" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="50" y="65" width="60" height="8" rx="2" fill={darkBench} />
        <ellipse cx="80" cy="62" rx="20" ry="8" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        {/* Stretched Chest (Red) */}
        <ellipse cx="80" cy="60" rx="12" ry="5" fill={targetRed} stroke="#E11D48" strokeWidth="1" />
        <circle cx="58" cy="55" r="7" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        {/* Arms outstretched wide to sides */}
        <path d="M 76 60 Q 60 55 42 50" stroke={skin} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 84 60 Q 100 55 118 50" stroke={skin} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="40" cy="49" r="5" fill={equipmentGold} />
        <circle cx="120" cy="49" r="5" fill={equipmentGold} />
      </svg>
    ) : (
      /* Finish: Dumbbells brought together over chest (Inner Chest Squeeze in Red) */
      <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
        <line x1="20" y1="95" x2="140" y2="95" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="50" y="65" width="60" height="8" rx="2" fill={darkBench} />
        <ellipse cx="80" cy="62" rx="20" ry="8" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        {/* INNER CHEST SQUEEZE (Bright Red) */}
        <ellipse cx="80" cy="58" rx="14" ry="7" fill={targetRed} stroke="#E11D48" strokeWidth="1.5" />
        <circle cx="58" cy="55" r="7" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        {/* Arms hugging together at top */}
        <path d="M 76 58 Q 72 40 78 22" stroke={skin} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 84 58 Q 88 40 82 22" stroke={skin} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="77" cy="20" r="5" fill={equipmentGold} />
        <circle cx="83" cy="20" r="5" fill={equipmentGold} />
      </svg>
    );
  }

  // -------------------------------------------------------------
  // 5. DUMBBELL PULLOVER (Matching Screenshot 4 Pullover* Dumbbell)
  // -------------------------------------------------------------
  if (type === 'pullover') {
    return isStart ? (
      /* Pullover Start: Dumbbell stretched back behind head */
      <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
        <line x1="20" y1="95" x2="140" y2="95" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="55" y="65" width="45" height="10" rx="2" fill={darkBench} />
        <ellipse cx="82" cy="62" rx="18" ry="8" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        {/* LATS & SERRATUS STRETCHED IN RED */}
        <path d="M 75 60 Q 65 52 50 42" stroke={targetRed} strokeWidth="4" strokeLinecap="round" />
        <circle cx="65" cy="58" r="7" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        <ellipse cx="45" cy="38" rx="6" ry="8" fill={equipmentGold} />
      </svg>
    ) : (
      /* Pullover Finish: Dumbbell pulled over chest (Chest & Serratus Squeeze in Red) */
      <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
        <line x1="20" y1="95" x2="140" y2="95" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="55" y="65" width="45" height="10" rx="2" fill={darkBench} />
        <ellipse cx="82" cy="62" rx="18" ry="8" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        {/* CHEST CONTRACTED OVER BENCH (Bright Red) */}
        <ellipse cx="82" cy="58" rx="12" ry="7" fill={targetRed} stroke="#E11D48" strokeWidth="1.5" />
        <circle cx="65" cy="58" r="7" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        <line x1="82" y1="58" x2="82" y2="22" stroke={skin} strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="82" cy="18" rx="8" ry="6" fill={equipmentGold} />
      </svg>
    );
  }

  // -------------------------------------------------------------
  // 6. SQUATS / LEGS
  // -------------------------------------------------------------
  if (type === 'squats' || type === 'lunges') {
    return isStart ? (
      /* Squat Start: Standing tall */
      <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
        <line x1="20" y1="102" x2="140" y2="102" stroke="#CBD5E1" strokeWidth="2" />
        <circle cx="80" cy="18" r="8" fill={skinFill} stroke={skin} strokeWidth="1.5" />
        <line x1="80" y1="26" x2="80" y2="55" stroke={skin} strokeWidth="7" strokeLinecap="round" />
        {/* Shorts */}
        <rect x="74" y="52" width="12" height="12" rx="2" fill={clothingColor} />
        {/* Straight Legs */}
        <path d="M 76 64 L 74 100" stroke={skin} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 84 64 L 86 100" stroke={skin} strokeWidth="5.5" strokeLinecap="round" />
        {/* Barbell across traps */}
        <line x1="50" y1="28" x2="110" y2="28" stroke="#475569" strokeWidth="3" />
        <circle cx="50" cy="28" r="6" fill={equipmentGold} />
        <circle cx="110" cy="28" r="6" fill={equipmentGold} />
      </svg>
    ) : (
      /* Squat Finish: Deep Parallel Squat (Quads & Glutes in Bright Red) */
      <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
        <line x1="20" y1="102" x2="140" y2="102" stroke="#CBD5E1" strokeWidth="2" />
        <circle cx="80" cy="40" r="8" fill={skinFill} stroke={skin} strokeWidth="1.5" />
        <line x1="80" y1="48" x2="72" y2="70" stroke={skin} strokeWidth="7" strokeLinecap="round" />
        {/* GLUTES & QUADS CONTRACTED IN BRIGHT RED */}
        <ellipse cx="65" cy="72" rx="10" ry="8" fill={targetRed} stroke="#E11D48" strokeWidth="1.5" />
        <path d="M 70 72 L 95 72 L 95 100" fill="none" stroke={targetRed} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Barbell across shoulders */}
        <line x1="50" y1="48" x2="110" y2="48" stroke="#475569" strokeWidth="3" />
        <circle cx="50" cy="48" r="6" fill={equipmentGold} />
        <circle cx="110" cy="48" r="6" fill={equipmentGold} />
      </svg>
    );
  }

  // -------------------------------------------------------------
  // 7. HIP THRUST / BUTT / GLUTES
  // -------------------------------------------------------------
  if (type === 'hip-thrust') {
    return isStart ? (
      /* Hip Thrust Start: Hips dipped low */
      <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
        <line x1="20" y1="100" x2="140" y2="100" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="35" y="70" width="30" height="25" rx="3" fill={darkBench} />
        <circle cx="48" cy="62" r="7" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        {/* Upper back on bench, hips low near floor */}
        <path d="M 55 68 L 78 88 L 105 100" fill="none" stroke={skin} strokeWidth="6" strokeLinecap="round" />
        <circle cx="78" cy="85" r="5" fill={equipmentGold} />
      </svg>
    ) : (
      /* Hip Thrust Finish: Full lockout table-top (Glutes Squeeze in Bright Red) */
      <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
        <line x1="20" y1="100" x2="140" y2="100" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="35" y="70" width="30" height="25" rx="3" fill={darkBench} />
        <circle cx="48" cy="65" r="7" fill={skinFill} stroke={skin} strokeWidth="1.2" />
        {/* Flat tabletop torso, GLUTES SQUEEZED IN RED */}
        <line x1="55" y1="70" x2="90" y2="70" stroke={skin} strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="85" cy="70" rx="10" ry="8" fill={targetRed} stroke="#E11D48" strokeWidth="1.5" />
        <path d="M 90 70 L 110 70 L 110 100" fill="none" stroke={skin} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="85" cy="64" r="6" fill={equipmentGold} />
      </svg>
    );
  }

  // -------------------------------------------------------------
  // 8. LAT PULLDOWN / BACK
  // -------------------------------------------------------------
  return isStart ? (
    /* Lat Pulldown Start: Arms stretched high */
    <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
      <rect x="75" y="8" width="10" height="92" fill={darkBench} rx="2" />
      <line x1="45" y1="12" x2="115" y2="12" stroke="#475569" strokeWidth="3" />
      <circle cx="80" cy="48" r="8" fill={skinFill} stroke={skin} strokeWidth="1.5" />
      <line x1="80" y1="56" x2="80" y2="85" stroke={skin} strokeWidth="7" strokeLinecap="round" />
      {/* Arms reaching up */}
      <path d="M 76 56 L 60 25" stroke={skin} strokeWidth="4" strokeLinecap="round" />
      <path d="M 84 56 L 100 25" stroke={skin} strokeWidth="4" strokeLinecap="round" />
      <line x1="55" y1="25" x2="105" y2="25" stroke={equipmentGold} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ) : (
    /* Lat Pulldown Finish: Bar pulled down to chest, Lats in Red */
    <svg viewBox="0 0 160 110" className="w-full h-full max-h-36 object-contain">
      <rect x="75" y="8" width="10" height="92" fill={darkBench} rx="2" />
      <line x1="45" y1="12" x2="115" y2="12" stroke="#475569" strokeWidth="3" />
      <circle cx="80" cy="50" r="8" fill={skinFill} stroke={skin} strokeWidth="1.5" />
      {/* Torso with LATS IN BRIGHT RED */}
      <path d="M 72 58 Q 65 70 74 82 Q 86 82 88 70 Q 80 58 72 58 Z" fill={targetRed} stroke="#E11D48" strokeWidth="1.5" />
      {/* Arms bent pulling bar down */}
      <path d="M 72 56 L 60 68 L 65 48" stroke={skin} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 88 56 L 100 68 L 95 48" stroke={skin} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="60" y1="48" x2="100" y2="48" stroke={equipmentGold} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
