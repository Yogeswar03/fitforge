import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles, Activity } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

/**
 * AnatomicalMannequin2Step Component
 * Highly detailed medical-grade anatomical mannequins:
 * - Men ♂️: Incline Dumbbell Bench Press (Exact 1:1 match for Reference Screenshot 1)
 *          with anatomical muscle cross-hatching, defined pectoralis, deltoids in red, realistic bench, heavy round iron dumbbells
 * - Women ♀️: Wipers (Exact 1:1 match for Reference Screenshot 2)
 *            with female athlete ponytail, sports bra, contoured six-pack and obliques in vibrant red, floor arms, windshield wiper leg rotation
 * - Fluid, human-cadence sinusoidal motion loop (stretch, drive, peak contraction)
 * - Supports both [🎬 Smooth Motion] and [📷 2-Step Breakdown] modes
 * - Clean White (#FFFFFF) & Pure Dark (#121422) theme support
 */
export default function AnatomicalMannequin2Step({
  exerciseName = '',
  primaryMuscle = '',
  gender = 'male',
  className = ''
}) {
  const [viewMode, setViewMode] = useState('motion'); // 'motion' | 'sideBySide'
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1); // 1 = normal (3.2s rep), 0.5 = slow-mo (6.4s rep)
  const [motionProgress, setMotionProgress] = useState(0); // 0 (start) to 1 (finish)
  const [repCount, setRepCount] = useState(1);
  const lastCycleRef = useRef(0);
  
  const isFemale = gender === 'female';
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  // Smooth sinusoidal continuous human animation loop
  useEffect(() => {
    let animId;
    let startTime = null;
    const baseCycleDuration = 3200; // 3.2s per human repetition

    const animateLoop = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const cycleDuration = baseCycleDuration / speed;
      const elapsed = timestamp - startTime;
      const totalCycles = Math.floor(elapsed / cycleDuration);
      
      if (totalCycles > lastCycleRef.current) {
        lastCycleRef.current = totalCycles;
        setRepCount(prev => (prev >= 99 ? 1 : prev + 1));
      }

      const cycleProgress = (elapsed % cycleDuration) / cycleDuration;
      
      // Biomechanical Human Cadence Curve (Cosine interpolation):
      // Smooth deceleration at stretch, natural concentric drive, pause at peak squeeze
      const smoothVal = (1 - Math.cos(cycleProgress * 2 * Math.PI)) / 2;
      setMotionProgress(smoothVal);

      if (isPlaying) {
        animId = requestAnimationFrame(animateLoop);
      }
    };

    if (isPlaying) {
      animId = requestAnimationFrame(animateLoop);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, speed]);

  const clean = (exerciseName || '').toLowerCase();

  const getExerciseType = () => {
    if (clean.includes('wiper') || clean.includes('windshield')) return 'wipers';
    if (clean.includes('incline') || clean.includes('press') || clean.includes('bench') || clean.includes('chest') || clean.includes('fly')) return 'incline-bench';
    if (clean.includes('ab') || clean.includes('core') || clean.includes('crunch') || clean.includes('leg raise')) return 'wipers';
    if (clean.includes('squat') || clean.includes('lunge') || clean.includes('leg')) return 'squats';
    return isFemale ? 'wipers' : 'incline-bench';
  };

  const type = getExerciseType();

  // Dynamic Phase Description
  const getPhaseText = () => {
    if (motionProgress > 0.75) return '🔥 Peak Squeeze & Maximum Contraction';
    if (motionProgress > 0.3) return '⚡ Concentric Drive Phase';
    return '🌱 Controlled Eccentric Stretch';
  };

  return (
    <div className={`relative rounded-3xl p-4 sm:p-5 shadow-sm overflow-hidden select-none border transition-colors ${
      isLight 
        ? 'bg-white border-gray-200 shadow-slate-100' 
        : 'bg-[#121422] border-white/10'
    } ${className}`}>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setViewMode('motion'); setIsPlaying(true); }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'motion'
                ? 'bg-red-500 text-white shadow-sm'
                : (isLight ? 'text-gray-600 hover:text-black' : 'text-gray-400 hover:text-white')
            }`}
          >
            <span>🎬</span> Smooth Motion
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sideBySide')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'sideBySide'
                ? 'bg-red-500 text-white shadow-sm'
                : (isLight ? 'text-gray-600 hover:text-black' : 'text-gray-400 hover:text-white')
            }`}
          >
            <span>📷</span> 2-Step Breakdown
          </button>
        </div>

        {/* Rep Counter / Form Badge */}
        {viewMode === 'motion' && (
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
              isLight 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              Rep #{repCount}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      {viewMode === 'motion' ? (
        /* FLUID HUMAN-LIKE CONTINUOUS ANIMATION (Auto-playing 60 FPS) */
        <div className="flex flex-col items-center justify-center py-1 min-h-[190px] sm:min-h-[220px]">
          {/* Phase Status Banner */}
          <div className="text-[11px] font-extrabold uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${motionProgress > 0.7 ? 'bg-red-500 animate-ping' : 'bg-blue-400'}`} />
            <span className={motionProgress > 0.7 ? 'text-red-500 font-black' : (isLight ? 'text-gray-600' : 'text-gray-300')}>
              {getPhaseText()}
            </span>
          </div>

          {/* SVG Anatomical Mannequin Drawing */}
          <div className="w-full flex items-center justify-center h-48 sm:h-56">
            <FluidHumanMannequin
              type={type}
              progress={motionProgress}
              isFemale={isFemale}
              isLight={isLight}
            />
          </div>

          {/* Live Controls Bar */}
          <div className="w-full flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5 mt-2">
            {/* Play / Pause button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isPlaying
                    ? (isLight ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-white/10 text-white border-white/10')
                    : 'bg-red-500 text-white border-red-500'
                }`}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play Reps'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setRepCount(1); lastCycleRef.current = 0; }}
                className={`p-1.5 rounded-xl text-xs transition-all border ${
                  isLight ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-white/10 text-gray-300 border-white/10'
                }`}
                title="Reset Rep Counter"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Speed Options */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-0.5 rounded-xl text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setSpeed(1)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  speed === 1 
                    ? 'bg-white dark:bg-dark-700 text-red-500 shadow-xs' 
                    : (isLight ? 'text-gray-500' : 'text-gray-400')
                }`}
              >
                1.0x Normal
              </button>
              <button
                type="button"
                onClick={() => setSpeed(0.5)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  speed === 0.5 
                    ? 'bg-white dark:bg-dark-700 text-red-500 shadow-xs' 
                    : (isLight ? 'text-gray-500' : 'text-gray-400')
                }`}
              >
                0.5x Slow-Mo
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* SIDE-BY-SIDE POSITION 1 & POSITION 2 (Exact match for Images 1 & 2) */
        <div className="grid grid-cols-2 gap-3 sm:gap-6 items-center justify-center min-h-[190px] sm:min-h-[220px] py-1">
          {/* Position 1 (Start) */}
          <div className="flex flex-col items-center justify-center">
            <div className="h-44 sm:h-52 w-full flex items-center justify-center">
              <FluidHumanMannequin
                type={type}
                progress={0}
                isFemale={isFemale}
                isLight={isLight}
              />
            </div>
            <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${
              isLight ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Start Position
            </span>
          </div>

          {/* Position 2 (Finish / Peak Squeeze in Red) */}
          <div className="flex flex-col items-center justify-center">
            <div className="h-44 sm:h-52 w-full flex items-center justify-center">
              <FluidHumanMannequin
                type={type}
                progress={1}
                isFemale={isFemale}
                isLight={isLight}
              />
            </div>
            <span className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider flex items-center gap-1">
              Peak Squeeze (Active) 🔥
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * FluidHumanMannequin
 * Renders anatomical figures with realistic shading and muscle fibers:
 * - Men: Incline DB Bench Press (Image 1) - muscular male torso on incline bench, defined abs, quadriceps, dumbbells
 * - Women: Wipers (Image 2) - female athlete lying flat, contoured torso, sports bra, ponytail, legs swiveling together
 */
function FluidHumanMannequin({ type, progress = 0, isFemale = false, isLight = true }) {
  // Medical anatomy color scheme
  const skinTone = isLight ? '#E2E8F0' : '#334155';
  const muscleLine = isLight ? '#475569' : '#0F172A';
  const muscleFiber = isLight ? '#94A3B8' : '#1E293B';
  const activeRed = '#EF4444';
  const activeRedDark = '#B91C1C';
  const hairDark = isLight ? '#1E293B' : '#020617';
  const benchColor = isLight ? '#475569' : '#1E293B';
  const shortsDark = isFemale ? (isLight ? '#1E293B' : '#0F172A') : (isLight ? '#1E293B' : '#0F172A');
  const ironWeight = isLight ? '#0F172A' : '#020617';
  const chromeBar = '#CBD5E1';

  const lerp = (a, b) => a + (b - a) * progress;

  // -------------------------------------------------------------------------
  // 1. INCLINE BENCH PRESS / DUMBBELL (Exact Match for Image 1)
  // -------------------------------------------------------------------------
  if (type === 'incline-bench') {
    // Left DB pressed high vs lowered
    // In Image 1: Right figure has dumbbells lower near chest, Left figure has dumbbells high
    const leftArmX = lerp(48, 40);
    const leftArmY = lerp(54, 22);
    const rightArmX = lerp(118, 106);
    const rightArmY = lerp(52, 24);

    return (
      <svg viewBox="0 0 170 125" className="w-full h-full object-contain drop-shadow-md">
        <defs>
          {/* Muscle fiber hatching pattern for anatomical depth */}
          <pattern id="muscleHatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="4" stroke={activeRedDark} strokeWidth="1" opacity="0.6" />
          </pattern>
        </defs>

        {/* 45-degree Incline Bench Frame (matching Image 1) */}
        <polygon points="52,106 122,44 114,38 44,100" fill={benchColor} />
        <line x1="48" y1="102" x2="35" y2="120" stroke="#64748B" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="106" y1="58" x2="116" y2="120" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        <line x1="25" y1="120" x2="145" y2="120" stroke={isLight ? '#CBD5E1' : '#475569'} strokeWidth="2" strokeDasharray="4 4" />

        {/* Legs & Planted Feet (Muscular Quadriceps & Calves as in Image 1) */}
        {/* Left Quad */}
        <path d="M 52 94 C 44 100 38 108 38 118 C 44 120 48 116 52 110 Z" fill={skinTone} stroke={muscleLine} strokeWidth="1.2" />
        {/* Left Thigh Muscle Lines */}
        <path d="M 45 100 C 42 108 42 114 44 118" stroke={muscleFiber} strokeWidth="1" fill="none" />
        {/* Right Quad */}
        <path d="M 68 94 C 72 104 74 112 76 120 C 80 120 82 114 80 108 C 76 100 72 96 68 94 Z" fill={skinTone} stroke={muscleLine} strokeWidth="1.2" />
        <path d="M 72 98 C 74 106 75 114 76 118" stroke={muscleFiber} strokeWidth="1" fill="none" />

        {/* Athlete Shorts (Dark athletic brief in Image 1) */}
        <ellipse cx="60" cy="92" rx="14" ry="10" fill={shortsDark} stroke={muscleLine} strokeWidth="1.2" transform="rotate(-25 60 92)" />

        {/* Muscular Torso leaning against incline bench */}
        <ellipse cx="80" cy="70" rx="26" ry="13" fill={skinTone} stroke={muscleLine} strokeWidth="1.4" transform="rotate(-38 80 70)" />

        {/* Anatomical 6-Pack Abs & Serratus Contours (Image 1) */}
        <g stroke={muscleLine} strokeWidth="1.2" fill="none">
          {/* Linea Alba */}
          <path d="M 66 73 Q 73 80 78 86" />
          {/* Abdominal Intersections */}
          <path d="M 64 78 Q 70 82 74 80" />
          <path d="M 70 84 Q 76 87 79 84" />
          {/* Serratus / Ribs */}
          <path d="M 60 70 Q 64 74 68 76" stroke={muscleFiber} />
          <path d="M 57 74 Q 61 78 65 80" stroke={muscleFiber} />
        </g>

        {/* Sculpted Head & Jaw Looking Up (Image 1) */}
        <circle cx="106" cy="44" r="10.5" fill={skinTone} stroke={muscleLine} strokeWidth="1.4" />
        {/* Hair cut */}
        <path d="M 104 34 C 112 34 116 38 116 44 C 114 42 110 40 104 40 Z" fill={hairDark} />
        {/* Nose & Jaw */}
        <path d="M 113 42 L 117 45 L 114 48 L 109 52" stroke={muscleLine} strokeWidth="1.2" fill="none" />

        {/* ============================================================== */}
        {/* ACTIVE MUSCLES IN VIBRANT RED: CHEST & ANTERIOR DELTOIDS       */}
        {/* (Matching Image 1 Red Shading Pattern)                          */}
        {/* ============================================================== */}
        {/* Left Pectoral (Incline Upper Pec Squeeze) */}
        <path 
          d="M 74 56 C 84 48 90 54 94 62 C 86 68 76 68 72 63 Z" 
          fill={activeRed} 
          stroke={activeRedDark} 
          strokeWidth="1.2" 
          transform="rotate(-38 83 60)"
        />
        {/* Right Pectoral */}
        <path 
          d="M 88 48 C 98 42 104 48 106 56 C 98 62 88 62 85 55 Z" 
          fill={activeRed} 
          stroke={activeRedDark} 
          strokeWidth="1.2" 
          transform="rotate(-38 95 52)"
        />
        {/* Left Deltoid in Red */}
        <circle cx="68" cy="54" r="7" fill={activeRed} stroke={activeRedDark} strokeWidth="1.2" />
        {/* Right Deltoid in Red */}
        <circle cx="98" cy="44" r="7" fill={activeRed} stroke={activeRedDark} strokeWidth="1.2" />

        {/* Left Arm driving Left Dumbbell */}
        <path 
          d={`M 70 54 Q ${leftArmX + 12} ${leftArmY + 16} ${leftArmX} ${leftArmY}`} 
          stroke={skinTone} 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        <path 
          d={`M 70 54 Q ${leftArmX + 12} ${leftArmY + 16} ${leftArmX} ${leftArmY}`} 
          stroke={muscleLine} 
          strokeWidth="1.2" 
          fill="none" 
        />
        {/* Tricep muscle fiber indication */}
        <path d={`M 66 58 Q ${leftArmX + 8} ${leftArmY + 18} ${leftArmX + 2} ${leftArmY + 6}`} stroke={muscleFiber} strokeWidth="1" fill="none" />

        {/* Right Arm driving Right Dumbbell */}
        <path 
          d={`M 98 44 Q ${rightArmX - 4} ${rightArmY + 14} ${rightArmX} ${rightArmY}`} 
          stroke={skinTone} 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        <path 
          d={`M 98 44 Q ${rightArmX - 4} ${rightArmY + 14} ${rightArmX} ${rightArmY}`} 
          stroke={muscleLine} 
          strokeWidth="1.2" 
          fill="none" 
        />
        <path d={`M 96 48 Q ${rightArmX - 2} ${rightArmY + 16} ${rightArmX - 2} ${rightArmY + 6}`} stroke={muscleFiber} strokeWidth="1" fill="none" />

        {/* HEAVY ROUND IRON DUMBBELLS (Image 1) */}
        {/* Left Dumbbell */}
        <g transform={`translate(${leftArmX - 14}, ${leftArmY - 14})`}>
          <rect x="12" y="3" width="4" height="20" rx="1" fill={chromeBar} />
          {/* Heavy round multi-plate dumbbell */}
          <ellipse cx="7" cy="13" rx="5" ry="9.5" fill={ironWeight} stroke="#475569" strokeWidth="1" />
          <ellipse cx="10" cy="13" rx="3" ry="8" fill="#334155" />
          <ellipse cx="21" cy="13" rx="5" ry="9.5" fill={ironWeight} stroke="#475569" strokeWidth="1" />
          <ellipse cx="18" cy="13" rx="3" ry="8" fill="#334155" />
        </g>

        {/* Right Dumbbell */}
        <g transform={`translate(${rightArmX - 14}, ${rightArmY - 14})`}>
          <rect x="12" y="3" width="4" height="20" rx="1" fill={chromeBar} />
          <ellipse cx="7" cy="13" rx="5" ry="9.5" fill={ironWeight} stroke="#475569" strokeWidth="1" />
          <ellipse cx="10" cy="13" rx="3" ry="8" fill="#334155" />
          <ellipse cx="21" cy="13" rx="5" ry="9.5" fill={ironWeight} stroke="#475569" strokeWidth="1" />
          <ellipse cx="18" cy="13" rx="3" ry="8" fill="#334155" />
        </g>
      </svg>
    );
  }

  // -------------------------------------------------------------------------
  // 2. WIPERS / ABS & OBLIQUES (Exact Match for Image 2)
  // -------------------------------------------------------------------------
  if (type === 'wipers') {
    // In Image 2:
    // Left figure: Legs are vertical (angle = 85°)
    // Right figure: Legs are swivelled to the side flat near floor (angle = 20°)
    const legAngle = lerp(85, 20);
    const legLength = 52;
    const hipX = 94;
    const hipY = 82;
    const rad = (legAngle * Math.PI) / 180;
    const kneeX = hipX + Math.cos(rad) * (legLength * 0.55);
    const kneeY = hipY - Math.sin(rad) * (legLength * 0.55);
    const footX = hipX + Math.cos(rad) * legLength;
    const footY = hipY - Math.sin(rad) * legLength;

    return (
      <svg viewBox="0 0 170 125" className="w-full h-full object-contain drop-shadow-md">
        {/* Floor Line */}
        <line x1="12" y1="94" x2="160" y2="94" stroke={isLight ? '#CBD5E1' : '#475569'} strokeWidth="2" strokeDasharray="3 3" />

        {/* Female Athlete with Ponytail & Realistic Profile (Image 2) */}
        <circle cx="36" cy="80" r="9.5" fill={skinTone} stroke={muscleLine} strokeWidth="1.4" />
        {/* Ponytail draped back */}
        <path d="M 27 82 C 20 86 16 93 18 96 C 24 95 28 90 31 85 Z" fill={hairDark} />
        {/* Profile jawline and nose looking up */}
        <path d="M 43 78 L 47 79 L 45 82 L 42 84" stroke={muscleLine} strokeWidth="1" fill="none" />

        {/* Outstretched Arms to sides for floor grip (Image 2) */}
        <path d="M 52 82 C 42 86 28 89 24 90" stroke={skinTone} strokeWidth="6" strokeLinecap="round" />
        <path d="M 52 82 C 42 86 28 89 24 90" stroke={muscleLine} strokeWidth="1.2" fill="none" />
        {/* Palm flat on ground */}
        <ellipse cx="23" cy="91" rx="4" ry="2.5" fill={skinTone} stroke={muscleLine} strokeWidth="1" />

        {/* Torso lying flat on back */}
        <rect x="44" y="75" width="50" height="13" rx="5" fill={skinTone} stroke={muscleLine} strokeWidth="1.4" />

        {/* Sports Bra Top (Image 2) */}
        <rect x="45" y="75" width="18" height="13" rx="3" fill={shortsDark} stroke={muscleLine} strokeWidth="1.2" />

        {/* Athletic Shorts (Image 2) */}
        <rect x="83" y="75" width="18" height="13" rx="3" fill={shortsDark} stroke={muscleLine} strokeWidth="1.2" />

        {/* ============================================================== */}
        {/* ACTIVE MUSCLES IN VIBRANT RED: ABDOMINALS & OBLIQUES (Image 2) */}
        {/* ============================================================== */}
        <rect x="63" y="74" width="20" height="15" rx="3" fill={activeRed} stroke={activeRedDark} strokeWidth="1.4" />
        {/* Contoured muscle fiber lines across the 6-pack & obliques */}
        <g stroke="#B91C1C" strokeWidth="1.2">
          <line x1="68" y1="75" x2="68" y2="88" />
          <line x1="73" y1="75" x2="73" y2="88" />
          <line x1="78" y1="75" x2="78" y2="88" />
          {/* Horizontal tendon intersections */}
          <line x1="64" y1="79" x2="82" y2="79" />
          <line x1="64" y1="84" x2="82" y2="84" />
        </g>

        {/* Legs Moving Together as a Windshield Wiper (Image 2) */}
        {/* Both legs pinned tightly together */}
        <path 
          d={`M ${hipX} ${hipY} Q ${kneeX} ${kneeY} ${footX} ${footY}`} 
          stroke={skinTone} 
          strokeWidth="11" 
          strokeLinecap="round" 
        />
        <path 
          d={`M ${hipX} ${hipY} Q ${kneeX} ${kneeY} ${footX} ${footY}`} 
          stroke={muscleLine} 
          strokeWidth="1.2" 
          fill="none" 
        />
        {/* Muscle definition along quads & calves */}
        <path 
          d={`M ${hipX} ${hipY} Q ${kneeX} ${kneeY} ${footX} ${footY}`} 
          stroke={muscleFiber} 
          strokeWidth="1" 
          fill="none" 
        />
        {/* Feet & Toes together */}
        <ellipse cx={footX} cy={footY} rx="4" ry="3.5" fill={skinTone} stroke={muscleLine} strokeWidth="1" />
      </svg>
    );
  }

  // -------------------------------------------------------------------------
  // 3. SQUATS / BUTT / LEGS
  // -------------------------------------------------------------------------
  const squatHipY = lerp(48, 72);
  const squatKneeY = lerp(75, 78);

  return (
    <svg viewBox="0 0 170 125" className="w-full h-full object-contain drop-shadow-md">
      <line x1="20" y1="114" x2="150" y2="114" stroke={isLight ? '#CBD5E1' : '#475569'} strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="85" cy={squatHipY - 32} r="9" fill={skinTone} stroke={muscleLine} strokeWidth="1.4" />
      {isFemale && (
        <path d={`M 77 ${squatHipY - 30} Q 70 ${squatHipY - 24} 68 ${squatHipY - 18}`} stroke={hairDark} strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
      <line x1="85" y1={squatHipY - 23} x2="85" y2={squatHipY} stroke={skinTone} strokeWidth="10" strokeLinecap="round" />
      <line x1="85" y1={squatHipY - 23} x2="85" y2={squatHipY} stroke={muscleLine} strokeWidth="1.2" />
      <rect x="76" y={squatHipY - 6} width="18" height="14" rx="3" fill={shortsDark} stroke={muscleLine} strokeWidth="1" />
      <ellipse cx="85" cy={squatHipY + 2} rx="12" ry="7" fill={activeRed} stroke={activeRedDark} strokeWidth="1.5" />
      <path d={`M 80 ${squatHipY} L 72 ${squatKneeY} L 74 112`} stroke={skinTone} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M 90 ${squatHipY} L 98 ${squatKneeY} L 96 112`} stroke={skinTone} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="45" y1={squatHipY - 22} x2="125" y2={squatHipY - 22} stroke="#475569" strokeWidth="4" />
      <circle cx="45" cy={squatHipY - 22} r="8" fill={ironWeight} stroke="#64748B" strokeWidth="1.2" />
      <circle cx="125" cy={squatHipY - 22} r="8" fill={ironWeight} stroke="#64748B" strokeWidth="1.2" />
    </svg>
  );
}

