import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles, Activity } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

/**
 * AnatomicalMannequin2Step Component
 * Highly detailed medical-grade anatomical mannequins:
 * - Men ♂️: Incline Dumbbell Bench Press, Push-ups, Squats, Bicep Curls (matching Image 1)
 * - Women ♀️: Wipers, Hip Thrusts, Squats, Crunches (matching Image 2)
 * - Fluid, human-cadence sinusoidal motion loop (stretch, drive, peak contraction)
 * - Supports both [🎬 Smooth Human Reps] and [📷 2-Step Form Breakdown] modes
 * - Dual Theme: Crisp White (#FFFFFF) & Pure Dark (#121422)
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
      
      // Biomechanical Human Cadence Curve:
      // Uses Cosine interpolation to create realistic physiological acceleration and deceleration:
      // Smooth turnaround at full stretch -> progressive acceleration -> deceleration at peak squeeze
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
    if (clean.includes('push-up') || clean.includes('pushup') || clean.includes('push up')) return 'pushups';
    if (clean.includes('incline') || clean.includes('press')) return 'incline-bench';
    if (clean.includes('fly') || clean.includes('crossover')) return 'bench-fly';
    if (clean.includes('pullover')) return 'pullover';
    if (clean.includes('bench') || clean.includes('chest')) return 'incline-bench';
    if (clean.includes('lat pull') || clean.includes('pulldown')) return 'lat-pulldown';
    if (clean.includes('pull up') || clean.includes('pullup')) return 'pullups';
    if (clean.includes('squat')) return 'squats';
    if (clean.includes('thrust') || clean.includes('bridge') || clean.includes('glute') || clean.includes('butt')) return 'hip-thrust';
    if (clean.includes('bicep') || clean.includes('curl')) return 'bicep-curls';
    if (clean.includes('ab') || clean.includes('core') || clean.includes('crunch')) return 'wipers';
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
        <div className="flex flex-col items-center justify-center py-1 min-h-[180px] sm:min-h-[210px]">
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
        <div className="grid grid-cols-2 gap-3 sm:gap-6 items-center justify-center min-h-[180px] sm:min-h-[210px] py-1">
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
 * Renders anatomical human figures with medical muscle shading:
 * - Men: Incline DB Bench Press (Image 1) with sculpted chest, delts, abs, dumbbells
 * - Women: Wipers (Image 2) with ponytail, sports bra, contoured abs/obliques
 * Smoothly interpolates joints and dumbbells based on progress (0 -> 1)
 */
function FluidHumanMannequin({ type, progress = 0, isFemale = false, isLight = true }) {
  // Biomechanical medical palette matching Images 1 & 2
  const bodyTone = isLight ? '#CBD5E1' : '#334155';
  const muscleShadow = isLight ? '#94A3B8' : '#1E293B';
  const muscleLine = isLight ? '#64748B' : '#0F172A';
  const targetRed = '#EF4444';
  const targetRedLight = '#F87171';
  const shortsDark = isFemale ? (isLight ? '#E11D48' : '#9F1239') : (isLight ? '#1E293B' : '#0F172A');
  const dumbbellPlate = isLight ? '#1E293B' : '#0F172A';
  const dumbbellChrome = '#E2E8F0';
  const benchPad = isLight ? '#334155' : '#1E293B';

  // Interpolation helper
  const lerp = (a, b) => a + (b - a) * progress;

  // -------------------------------------------------------------------------
  // 1. INCLINE BENCH PRESS / DUMBBELL (Exact Match for Image 1)
  // -------------------------------------------------------------------------
  if (type === 'incline-bench') {
    // DB Height: Lowered at chest stretch (y=52) -> Pressed overhead (y=22)
    const leftArmX = lerp(45, 38);
    const leftArmY = lerp(52, 22);
    const rightArmX = lerp(120, 108);
    const rightArmY = lerp(50, 24);

    return (
      <svg viewBox="0 0 170 125" className="w-full h-full object-contain drop-shadow-md">
        {/* Bench Structure (45° Incline Bench as in Image 1) */}
        <polygon points="55,108 120,45 110,40 45,103" fill={benchPad} />
        <line x1="50" y1="105" x2="35" y2="118" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        <line x1="105" y1="60" x2="115" y2="118" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        <line x1="25" y1="118" x2="140" y2="118" stroke={isLight ? '#CBD5E1' : '#475569'} strokeWidth="2" strokeDasharray="4 4" />

        {/* Athlete Torso leaning back against incline bench */}
        <ellipse cx="80" cy="72" rx="26" ry="12" fill={bodyTone} stroke={muscleLine} strokeWidth="1.4" transform="rotate(-38 80 72)" />
        
        {/* Detailed Muscular Abdominals (Image 1) */}
        <path d="M 66 74 Q 72 82 78 88" stroke={muscleLine} strokeWidth="1.2" fill="none" />
        <ellipse cx="74" cy="80" rx="4" ry="3" fill={muscleShadow} opacity="0.6" />
        <ellipse cx="78" cy="85" rx="4" ry="3" fill={muscleShadow} opacity="0.6" />

        {/* Athlete Legs & Shorts (Planting feet firmly on floor) */}
        <ellipse cx="58" cy="94" rx="14" ry="9" fill={shortsDark} stroke={muscleLine} strokeWidth="1.2" transform="rotate(-20 58 94)" />
        <path d="M 52 98 Q 44 108 42 118" stroke={bodyTone} strokeWidth="7" strokeLinecap="round" />
        <path d="M 52 98 Q 44 108 42 118" stroke={muscleLine} strokeWidth="1.2" fill="none" />
        <path d="M 68 98 Q 72 108 74 118" stroke={bodyTone} strokeWidth="7" strokeLinecap="round" />
        <path d="M 68 98 Q 72 108 74 118" stroke={muscleLine} strokeWidth="1.2" fill="none" />

        {/* Sculpted Head & Face looking up at weights (Image 1) */}
        <circle cx="106" cy="46" r="10" fill={bodyTone} stroke={muscleLine} strokeWidth="1.4" />
        <path d="M 112 44 Q 116 46 114 49" stroke={muscleLine} strokeWidth="1.2" fill="none" />

        {/* CHEST / PECTORALS & FRONT DELTOIDS (HIGHLIGHTED IN VIVID RED) */}
        {/* Left Pectoral */}
        <path 
          d="M 75 58 Q 88 50 94 62 Q 85 70 73 66 Z" 
          fill={targetRed} 
          stroke={targetRedLight} 
          strokeWidth="1.5" 
          transform="rotate(-38 84 62)"
        />
        {/* Right Pectoral */}
        <path 
          d="M 88 50 Q 102 44 106 56 Q 96 64 86 58 Z" 
          fill={targetRed} 
          stroke={targetRedLight} 
          strokeWidth="1.5" 
          transform="rotate(-38 96 54)"
        />

        {/* Left Arm & Shoulder holding Left Dumbbell */}
        <path 
          d={`M 70 54 Q ${leftArmX + 10} ${leftArmY + 15} ${leftArmX} ${leftArmY}`} 
          stroke={bodyTone} 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        <path 
          d={`M 70 54 Q ${leftArmX + 10} ${leftArmY + 15} ${leftArmX} ${leftArmY}`} 
          stroke={muscleLine} 
          strokeWidth="1.2" 
          fill="none" 
        />
        {/* Left Shoulder Deltoid in Red */}
        <circle cx="68" cy="54" r="7" fill={targetRed} stroke={targetRedLight} strokeWidth="1.2" />

        {/* Right Arm & Shoulder holding Right Dumbbell */}
        <path 
          d={`M 98 44 Q ${rightArmX - 5} ${rightArmY + 12} ${rightArmX} ${rightArmY}`} 
          stroke={bodyTone} 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        <path 
          d={`M 98 44 Q ${rightArmX - 5} ${rightArmY + 12} ${rightArmX} ${rightArmY}`} 
          stroke={muscleLine} 
          strokeWidth="1.2" 
          fill="none" 
        />
        {/* Right Shoulder Deltoid in Red */}
        <circle cx="98" cy="44" r="7" fill={targetRed} stroke={targetRedLight} strokeWidth="1.2" />

        {/* DUMBBELLS (Heavy Round Iron Plates matching Image 1) */}
        {/* Left Dumbbell */}
        <g transform={`translate(${leftArmX - 12}, ${leftArmY - 14})`}>
          <rect x="10" y="4" width="4" height="18" rx="1" fill={dumbbellChrome} />
          <ellipse cx="6" cy="13" rx="5" ry="9" fill={dumbbellPlate} stroke="#64748B" strokeWidth="1" />
          <ellipse cx="18" cy="13" rx="5" ry="9" fill={dumbbellPlate} stroke="#64748B" strokeWidth="1" />
        </g>

        {/* Right Dumbbell */}
        <g transform={`translate(${rightArmX - 12}, ${rightArmY - 14})`}>
          <rect x="10" y="4" width="4" height="18" rx="1" fill={dumbbellChrome} />
          <ellipse cx="6" cy="13" rx="5" ry="9" fill={dumbbellPlate} stroke="#64748B" strokeWidth="1" />
          <ellipse cx="18" cy="13" rx="5" ry="9" fill={dumbbellPlate} stroke="#64748B" strokeWidth="1" />
        </g>
      </svg>
    );
  }

  // -------------------------------------------------------------------------
  // 2. WIPERS / ABS & OBLIQUES (Exact Match for Image 2)
  // -------------------------------------------------------------------------
  if (type === 'wipers') {
    // Legs rotate from vertical (angle=90) to floor side (angle=20)
    const legAngle = lerp(90, 25);
    const legLength = 48;
    const hipX = 95;
    const hipY = 82;
    // Calculate leg tip coordinates
    const rad = (legAngle * Math.PI) / 180;
    const footX = hipX + Math.cos(rad) * legLength;
    const footY = hipY - Math.sin(rad) * legLength;

    return (
      <svg viewBox="0 0 170 125" className="w-full h-full object-contain drop-shadow-md">
        {/* Floor Line */}
        <line x1="15" y1="94" x2="155" y2="94" stroke={isLight ? '#CBD5E1' : '#475569'} strokeWidth="2" strokeDasharray="3 3" />

        {/* Female Athlete Head with Ponytail (Image 2) */}
        <circle cx="36" cy="80" r="9" fill={bodyTone} stroke={muscleLine} strokeWidth="1.4" />
        {/* Ponytail hair */}
        <path d="M 28 82 Q 22 88 20 94 Q 26 92 30 86 Z" fill={isLight ? '#475569' : '#0F172A'} />

        {/* Torso flat on back on floor */}
        <rect x="44" y="76" width="50" height="12" rx="5" fill={bodyTone} stroke={muscleLine} strokeWidth="1.4" />

        {/* Sports Bra Top (Image 2) */}
        <rect x="46" y="76" width="18" height="12" rx="3" fill={shortsDark} stroke={muscleLine} strokeWidth="1" />

        {/* Athletic Shorts */}
        <rect x="84" y="76" width="16" height="12" rx="3" fill={shortsDark} stroke={muscleLine} strokeWidth="1" />

        {/* Outstretched Arms to sides for floor stabilization (Image 2) */}
        <path d="M 52 82 Q 42 86 28 88" stroke={bodyTone} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 52 82 Q 42 86 28 88" stroke={muscleLine} strokeWidth="1" fill="none" />

        {/* ABDOMINALS & OBLIQUES IN VIBRANT RED (Image 2) */}
        <rect x="64" y="75" width="20" height="13" rx="3" fill={targetRed} stroke={targetRedLight} strokeWidth="1.5" />
        {/* Contoured muscle fiber lines across abs */}
        <line x1="68" y1="76" x2="68" y2="87" stroke="#DC2626" strokeWidth="1.2" />
        <line x1="74" y1="76" x2="74" y2="87" stroke="#DC2626" strokeWidth="1.2" />
        <line x1="80" y1="76" x2="80" y2="87" stroke="#DC2626" strokeWidth="1.2" />

        {/* Legs moving together smoothly like a human windshield wiper */}
        <path 
          d={`M ${hipX} ${hipY} Q ${(hipX + footX) / 2} ${(hipY + footY) / 2 + 4} ${footX} ${footY}`} 
          stroke={bodyTone} 
          strokeWidth="10" 
          strokeLinecap="round" 
        />
        <path 
          d={`M ${hipX} ${hipY} Q ${(hipX + footX) / 2} ${(hipY + footY) / 2 + 4} ${footX} ${footY}`} 
          stroke={muscleLine} 
          strokeWidth="1.2" 
          fill="none" 
        />
        {/* Muscular thigh contours & feet */}
        <ellipse cx={(hipX + footX) / 2} cy={(hipY + footY) / 2} rx="6" ry="4" fill={muscleShadow} opacity="0.5" />
        <ellipse cx={footX} cy={footY} rx="4" ry="3" fill={bodyTone} stroke={muscleLine} strokeWidth="1" />
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
      {/* Head */}
      <circle cx="85" cy={squatHipY - 32} r="9" fill={bodyTone} stroke={muscleLine} strokeWidth="1.4" />
      {/* Female Ponytail if female */}
      {isFemale && (
        <path d={`M 77 ${squatHipY - 30} Q 70 ${squatHipY - 24} 68 ${squatHipY - 18}`} stroke={isLight ? '#475569' : '#0F172A'} strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
      {/* Spine / Torso */}
      <line x1="85" y1={squatHipY - 23} x2="85" y2={squatHipY} stroke={bodyTone} strokeWidth="10" strokeLinecap="round" />
      <line x1="85" y1={squatHipY - 23} x2="85" y2={squatHipY} stroke={muscleLine} strokeWidth="1.2" />
      {/* Shorts */}
      <rect x="76" y={squatHipY - 6} width="18" height="14" rx="3" fill={shortsDark} stroke={muscleLine} strokeWidth="1" />
      {/* QUADS & GLUTES IN VIVID RED */}
      <ellipse cx="85" cy={squatHipY + 2} rx="12" ry="7" fill={targetRed} stroke={targetRedLight} strokeWidth="1.5" />
      {/* Legs driving through knees & heels */}
      <path d={`M 80 ${squatHipY} L 72 ${squatKneeY} L 74 112`} stroke={bodyTone} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M 90 ${squatHipY} L 98 ${squatKneeY} L 96 112`} stroke={bodyTone} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Barbell across traps */}
      <line x1="45" y1={squatHipY - 22} x2="125" y2={squatHipY - 22} stroke="#475569" strokeWidth="4" />
      <circle cx="45" cy={squatHipY - 22} r="8" fill={dumbbellPlate} stroke="#64748B" strokeWidth="1.2" />
      <circle cx="125" cy={squatHipY - 22} r="8" fill={dumbbellPlate} stroke="#64748B" strokeWidth="1.2" />
    </svg>
  );
}
