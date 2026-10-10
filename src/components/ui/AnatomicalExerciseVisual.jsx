import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw, Sparkles, Layers } from 'lucide-react';

/**
 * AnatomicalExerciseVisual Component
 * Renders clean anatomical line illustrations (start & finish positions)
 * with targeted active muscles highlighted in vivid RED, matching gym poster / MuscleWiki style.
 * Supports both Female (♀️) and Male (♂️) athletic bodies.
 */
export default function AnatomicalExerciseVisual({ 
  exerciseName, 
  gender = 'male', 
  category = 'Chest',
  showSetsReps = true,
  defaultSets = '3 SETS 10-12 REPS'
}) {
  const [activeGender, setActiveGender] = useState(gender);
  const [viewMode, setViewMode] = useState('poster'); // 'poster' (side-by-side) | 'animated' (loop)
  const [animStep, setAnimStep] = useState(0); // 0 = start, 1 = peak

  useEffect(() => {
    setActiveGender(gender);
  }, [gender]);

  useEffect(() => {
    if (viewMode === 'animated') {
      const interval = setInterval(() => {
        setAnimStep((prev) => (prev === 0 ? 1 : 0));
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [viewMode]);

  const cleanName = (exerciseName || '').toLowerCase();

  // Determine exercise key
  const getExerciseType = () => {
    if (cleanName.includes('lat pull') || cleanName.includes('pulldown')) return 'lat-pulldown';
    if (cleanName.includes('cable row') || cleanName.includes('seated row')) return 'seated-cable-row';
    if (cleanName.includes('rear delt') || cleanName.includes('face pull')) return 'rear-delt-fly';
    if (cleanName.includes('shrug')) return 'shrugs';
    if (cleanName.includes('preacher')) return 'preacher-curl';
    if (cleanName.includes('hammer')) return 'hammer-curl';
    if (cleanName.includes('bicep') || cleanName.includes('curl')) return 'bicep-curl';
    if (cleanName.includes('tricep') || cleanName.includes('pushdown')) return 'tricep-pushdown';
    if (cleanName.includes('incline')) return 'incline-press';
    if (cleanName.includes('decline')) return 'decline-press';
    if (cleanName.includes('bench') || cleanName.includes('chest press')) return 'bench-press';
    if (cleanName.includes('pushup') || cleanName.includes('push up') || cleanName.includes('push-up')) return 'pushups';
    if (cleanName.includes('cable') && (cleanName.includes('fly') || cleanName.includes('cross'))) return 'cable-fly';
    if (cleanName.includes('dip')) return 'dips';
    if (cleanName.includes('pec deck') || cleanName.includes('butterfly')) return 'pec-deck';
    if (cleanName.includes('pullover')) return 'pullover';
    if (cleanName.includes('deadlift')) return 'deadlift';
    if (cleanName.includes('row') || cleanName.includes('barbell row')) return 'barbell-row';
    if (cleanName.includes('pull up') || cleanName.includes('pullup') || cleanName.includes('chin up')) return 'pullups';
    if (cleanName.includes('squat')) return 'squats';
    if (cleanName.includes('lunge')) return 'lunges';
    if (cleanName.includes('calf')) return 'calf-raise';
    if (cleanName.includes('overhead') || cleanName.includes('shoulder press')) return 'overhead-press';
    if (cleanName.includes('lateral raise')) return 'lateral-raise';
    if (cleanName.includes('plank')) return 'plank';
    return 'bench-press'; // fallback
  };

  const type = getExerciseType();
  const isFemale = activeGender === 'female';

  return (
    <div className="w-full bg-[#12121E] rounded-3xl p-4 border border-white/10 shadow-xl overflow-hidden relative">
      {/* Top Header: Gender Toggle & View Switcher */}
      <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Anatomical Guide
          </span>
          <span className="text-[10px] bg-red-500/20 text-red-400 font-extrabold px-2 py-0.5 rounded-full">
            Target Muscles in Red
          </span>
        </div>

        {/* Gender Toggle: Women ♀️ / Men ♂️ */}
        <div className="flex items-center gap-1 bg-dark-900/80 p-0.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveGender('male')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              !isFemale ? 'bg-accent text-dark-900 shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>♂️</span>
            <span>Men</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveGender('female')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              isFemale ? 'bg-pink-500 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>♀️</span>
            <span>Women</span>
          </button>
        </div>
      </div>

      {/* Main Illustration Canvas */}
      <div className="py-4 relative flex items-center justify-center min-h-[190px]">
        {viewMode === 'poster' ? (
          /* Side-by-side Start & Finish View (Poster style like uploaded image) */
          <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto items-center">
            {/* Start Position */}
            <div className="flex flex-col items-center text-center space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-dark-800/80 px-2 py-0.5 rounded-md border border-white/5">
                1. Start Form
              </span>
              <div className="h-40 w-full flex items-center justify-center">
                <ExerciseSvg type={type} isFemale={isFemale} phase="start" />
              </div>
            </div>

            {/* Finish / Peak Contraction Position */}
            <div className="flex flex-col items-center text-center space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                2. Peak Squeeze
              </span>
              <div className="h-40 w-full flex items-center justify-center">
                <ExerciseSvg type={type} isFemale={isFemale} phase="finish" />
              </div>
            </div>
          </div>
        ) : (
          /* Looping Animation Mode */
          <div className="flex flex-col items-center justify-center w-full">
            <div className="h-44 w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={animStep}
                  initial={{ opacity: 0.6, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <ExerciseSvg type={type} isFemale={isFemale} phase={animStep === 0 ? 'start' : 'finish'} />
                </motion.div>
              </AnimatePresence>
            </div>
            <span className="text-[11px] font-bold text-gray-400 mt-2">
              {animStep === 0 ? 'Initial Position' : 'Peak Contraction (Muscles Squeezed)'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Footer Info Bar */}
      <div className="pt-2 border-t border-white/5 flex justify-between items-center">
        <div>
          {showSetsReps && (
            <span className="text-xs font-black text-amber-400 tracking-wider">
              {defaultSets}
            </span>
          )}
        </div>

        {/* View mode toggle (Side-by-side vs Animation) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'poster' ? 'animated' : 'poster')}
            className="text-[11px] bg-dark-800 hover:bg-dark-700 text-gray-300 px-3 py-1 rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            {viewMode === 'poster' ? (
              <>
                <Play size={12} className="text-accent" />
                <span>Loop Animation</span>
              </>
            ) : (
              <>
                <Layers size={12} className="text-accent" />
                <span>Side-by-Side</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ExerciseSvg Renderer
 * Draws clean anatomical vectors with glowing red highlighted target muscles.
 * Tailors proportions for Male vs Female athletic figures.
 */
function ExerciseSvg({ type, isFemale, phase }) {
  const isStart = phase === 'start';
  const bodyColor = '#D1D5DB'; // Anatomical bone/body gray
  const highlightRed = '#FF2A4D'; // Bright red active muscle
  const secondaryRed = '#FF6B81'; // Lighter red secondary
  const equipmentColor = '#94A3B8'; // Machine & barbell steel
  const benchColor = '#475569';

  // Hair & silhouette details for female
  const headRadius = isFemale ? 9 : 10;
  const shoulderWidth = isFemale ? 34 : 44;
  const waistWidth = isFemale ? 20 : 26;
  const hipWidth = isFemale ? 28 : 25;

  switch (type) {
    // -----------------------------------------------------------------
    // LAT PULLDOWN (As in reference image)
    // -----------------------------------------------------------------
    case 'lat-pulldown':
      return (
        <svg viewBox="0 0 160 160" className="w-full h-full max-h-40">
          {/* Cable Machine Frame & Seat */}
          <rect x="70" y="10" width="20" height="6" rx="2" fill={equipmentColor} />
          <line x1="80" y1="16" x2="80" y2="40" stroke={equipmentColor} strokeWidth="3" />
          <line x1="45" y1="40" x2="115" y2="40" stroke={equipmentColor} strokeWidth="4" strokeLinecap="round" />
          <rect x="65" y="105" width="30" height="6" rx="2" fill={benchColor} />
          <line x1="80" y1="111" x2="80" y2="150" stroke={benchColor} strokeWidth="4" />

          {/* Torso / Back with Red Lat Highlights */}
          {/* Head */}
          <circle cx="80" cy={isStart ? 65 : 68} r={headRadius} fill={bodyColor} />
          {isFemale && <path d="M72 63 Q68 70 70 76" stroke="#EC4899" strokeWidth="2.5" fill="none" />}

          {/* Shoulders & Upper Back (Highlighted Red) */}
          <path
            d={isStart 
              ? "M62 80 Q80 75 98 80 L92 105 Q80 108 68 105 Z" 
              : "M60 82 Q80 78 100 82 L90 105 Q80 108 70 105 Z"}
            fill={highlightRed}
            filter="drop-shadow(0 0 3px rgba(255,42,77,0.6))"
          />

          {/* Arms holding the bar */}
          {isStart ? (
            /* Arms extended high */
            <g stroke={bodyColor} strokeWidth="5" strokeLinecap="round">
              <line x1="64" y1="78" x2="50" y2="42" />
              <line x1="96" y1="78" x2="110" y2="42" />
            </g>
          ) : (
            /* Arms pulling bar down to chest */
            <g stroke={bodyColor} strokeWidth="5" strokeLinecap="round">
              <line x1="64" y1="80" x2="52" y2="88" />
              <line x1="52" y1="88" x2="58" y2="58" />
              <line x1="96" y1="80" x2="108" y2="88" />
              <line x1="108" y1="88" x2="102" y2="58" />
            </g>
          )}

          {/* Cable bar location */}
          <line 
            x1="45" y1={isStart ? "40" : "60"} 
            x2="115" y2={isStart ? "40" : "60"} 
            stroke={equipmentColor} strokeWidth="4" strokeLinecap="round" 
          />

          {/* Lower body seated */}
          <path d="M68 106 L62 130 L45 145" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M92 106 L98 130 L115 145" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      );

    // -----------------------------------------------------------------
    // SEATED CABLE ROW (As in reference image)
    // -----------------------------------------------------------------
    case 'seated-cable-row':
      return (
        <svg viewBox="0 0 160 160" className="w-full h-full max-h-40">
          {/* Machine Bench & Pulley */}
          <rect x="35" y="115" width="85" height="6" rx="2" fill={benchColor} />
          <line x1="55" y1="121" x2="55" y2="148" stroke={benchColor} strokeWidth="4" />
          <line x1="105" y1="121" x2="105" y2="148" stroke={benchColor} strokeWidth="4" />
          {/* Cable line */}
          <line x1="20" y1="95" x2={isStart ? "65" : "85"} y2="95" stroke={equipmentColor} strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Athlete Seated (Side View) */}
          <circle cx={isStart ? "70" : "85"} cy="70" r={headRadius} fill={bodyColor} />
          {isFemale && <path d="M63 70 Q56 75 58 82" stroke="#EC4899" strokeWidth="2" fill="none" />}

          {/* Torso with Red Back Highlight */}
          <path
            d={isStart 
              ? "M67 78 L80 115 L66 115 Z" 
              : "M82 78 L95 115 L80 115 Z"}
            fill={highlightRed}
            filter="drop-shadow(0 0 4px rgba(255,42,77,0.6))"
          />

          {/* Arms pulling cable V-bar */}
          {isStart ? (
            <line x1="68" y1="83" x2="45" y2="95" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
          ) : (
            <path d="M85 83 L105 88 L85 95" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" fill="none" />
          )}

          {/* Legs on foot pads */}
          <path d="M78 115 L52 110 L30 100" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      );

    // -----------------------------------------------------------------
    // BARBELL BENCH PRESS (Chest)
    // -----------------------------------------------------------------
    case 'bench-press':
      return (
        <svg viewBox="0 0 160 160" className="w-full h-full max-h-40">
          {/* Flat Bench */}
          <rect x="25" y="105" width="110" height="7" rx="2" fill={benchColor} />
          <line x1="45" y1="112" x2="45" y2="150" stroke={benchColor} strokeWidth="4" />
          <line x1="115" y1="112" x2="115" y2="150" stroke={benchColor} strokeWidth="4" />

          {/* Athlete lying on bench */}
          <circle cx="45" cy="100" r={headRadius} fill={bodyColor} />
          {/* Torso & CHEST (Highlighted Red) */}
          <rect x="55" y="96" width="40" height="13" rx="4" fill={highlightRed} filter="drop-shadow(0 0 4px rgba(255,42,77,0.7))" />
          
          {/* Legs on floor */}
          <path d="M95 102 L115 110 L120 145" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* Arms & Barbell */}
          {isStart ? (
            /* Bar lowered to chest */
            <g>
              <line x1="72" y1="96" x2="60" y2="86" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
              <line x1="60" y1="86" x2="72" y2="76" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
              <line x1="30" y1="74" x2="115" y2="74" stroke={equipmentColor} strokeWidth="5" strokeLinecap="round" />
              <circle cx="34" cy="74" r="8" fill="#E2E8F0" />
              <circle cx="111" cy="74" r="8" fill="#E2E8F0" />
            </g>
          ) : (
            /* Bar pressed up to lockout */
            <g>
              <line x1="70" y1="96" x2="70" y2="52" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
              <line x1="30" y1="48" x2="115" y2="48" stroke={equipmentColor} strokeWidth="5" strokeLinecap="round" />
              <circle cx="34" cy="48" r="8" fill="#E2E8F0" />
              <circle cx="111" cy="48" r="8" fill="#E2E8F0" />
            </g>
          )}
        </svg>
      );

    // -----------------------------------------------------------------
    // INCLINE DUMBBELL PRESS (Upper Chest)
    // -----------------------------------------------------------------
    case 'incline-press':
      return (
        <svg viewBox="0 0 160 160" className="w-full h-full max-h-40">
          {/* 30° Incline Bench */}
          <line x1="35" y1="130" x2="90" y2="60" stroke={benchColor} strokeWidth="8" strokeLinecap="round" />
          <line x1="55" y1="120" x2="55" y2="150" stroke={benchColor} strokeWidth="4" />

          {/* Athlete reclining on 30° incline */}
          <circle cx="85" cy="55" r={headRadius} fill={bodyColor} />
          {/* UPPER CHEST (Highlighted Red) */}
          <path d="M78 65 L55 95 L45 90 Z" fill={highlightRed} filter="drop-shadow(0 0 4px rgba(255,42,77,0.8))" />

          {/* Dumbbells */}
          {isStart ? (
            /* Dumbbells down at shoulder level */
            <g>
              <line x1="68" y1="78" x2="55" y2="65" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
              <rect x="48" y="58" width="14" height="6" rx="2" fill="#E2E8F0" transform="rotate(30 55 61)" />
            </g>
          ) : (
            /* Dumbbells pressed up */
            <g>
              <line x1="68" y1="75" x2="80" y2="35" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
              <rect x="73" y="28" width="16" height="6" rx="2" fill="#E2E8F0" transform="rotate(10 81 31)" />
            </g>
          )}

          {/* Legs */}
          <path d="M40 128 L60 135 L65 152" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      );

    // -----------------------------------------------------------------
    // PUSH UPS
    // -----------------------------------------------------------------
    case 'pushups':
      return (
        <svg viewBox="0 0 160 160" className="w-full h-full max-h-40">
          {/* Floor line */}
          <line x1="15" y1="135" x2="145" y2="135" stroke={equipmentColor} strokeWidth="3" />

          {/* Rigid Body Line */}
          {isStart ? (
            /* Pushup top position */
            <g>
              <circle cx="118" cy="75" r={headRadius} fill={bodyColor} />
              {/* Chest & Core Highlighted */}
              <line x1="110" y1="82" x2="65" y2="105" stroke={highlightRed} strokeWidth="9" strokeLinecap="round" filter="drop-shadow(0 0 4px rgba(255,42,77,0.7))" />
              <line x1="65" y1="105" x2="30" y2="130" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
              {/* Arms Straight down */}
              <line x1="106" y1="85" x2="106" y2="135" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
            </g>
          ) : (
            /* Pushup bottom position */
            <g>
              <circle cx="118" cy="115" r={headRadius} fill={bodyColor} />
              <line x1="110" y1="120" x2="65" y2="125" stroke={highlightRed} strokeWidth="9" strokeLinecap="round" filter="drop-shadow(0 0 4px rgba(255,42,77,0.7))" />
              <line x1="65" y1="125" x2="30" y2="132" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
              {/* Elbows bent 90 degrees */}
              <path d="M108 120 L115 105 L108 135" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" fill="none" />
            </g>
          )}
        </svg>
      );

    // -----------------------------------------------------------------
    // BARBELL SQUATS (Legs)
    // -----------------------------------------------------------------
    case 'squats':
      return (
        <svg viewBox="0 0 160 160" className="w-full h-full max-h-40">
          <line x1="20" y1="145" x2="140" y2="145" stroke={equipmentColor} strokeWidth="3" />

          {isStart ? (
            /* Standing with Barbell */
            <g>
              <circle cx="80" cy="40" r={headRadius} fill={bodyColor} />
              {/* Barbell on Traps */}
              <line x1="35" y1="48" x2="125" y2="48" stroke={equipmentColor} strokeWidth="5" strokeLinecap="round" />
              <circle cx="39" cy="48" r="7" fill="#E2E8F0" />
              <circle cx="121" cy="48" r="7" fill="#E2E8F0" />
              {/* Torso */}
              <line x1="80" y1="48" x2="80" y2="88" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
              {/* Quads & Glutes Highlighted in Red */}
              <line x1="80" y1="88" x2="72" y2="120" stroke={highlightRed} strokeWidth="8" strokeLinecap="round" filter="drop-shadow(0 0 4px rgba(255,42,77,0.7))" />
              <line x1="80" y1="88" x2="88" y2="120" stroke={highlightRed} strokeWidth="8" strokeLinecap="round" filter="drop-shadow(0 0 4px rgba(255,42,77,0.7))" />
              <line x1="72" y1="120" x2="70" y2="145" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
              <line x1="88" y1="120" x2="90" y2="145" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
            </g>
          ) : (
            /* Deep Squat 90° */
            <g>
              <circle cx="80" cy="75" r={headRadius} fill={bodyColor} />
              {/* Barbell */}
              <line x1="35" y1="83" x2="125" y2="83" stroke={equipmentColor} strokeWidth="5" strokeLinecap="round" />
              <circle cx="39" cy="83" r="7" fill="#E2E8F0" />
              <circle cx="121" cy="83" r="7" fill="#E2E8F0" />
              {/* Torso Angled */}
              <line x1="80" y1="83" x2="70" y2="110" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
              {/* Deep Thighs & Glutes Peak Contraction in Red */}
              <path d="M70 110 L98 112 L85 145" stroke={highlightRed} strokeWidth="8" strokeLinecap="round" fill="none" filter="drop-shadow(0 0 5px rgba(255,42,77,0.8))" />
            </g>
          )}
        </svg>
      );

    // -----------------------------------------------------------------
    // BICEP CURLS (Arms)
    // -----------------------------------------------------------------
    case 'bicep-curl':
    case 'preacher-curl':
    case 'hammer-curl':
      return (
        <svg viewBox="0 0 160 160" className="w-full h-full max-h-40">
          <line x1="20" y1="145" x2="140" y2="145" stroke={equipmentColor} strokeWidth="2" />
          <circle cx="75" cy="40" r={headRadius} fill={bodyColor} />
          {/* Torso */}
          <line x1="75" y1="48" x2="75" y2="95" stroke={bodyColor} strokeWidth="9" strokeLinecap="round" />
          {/* Legs */}
          <line x1="75" y1="95" x2="68" y2="145" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
          <line x1="75" y1="95" x2="82" y2="145" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />

          {/* Biceps Highlighted in Red */}
          {isStart ? (
            /* Arms Extended Down */
            <g>
              <line x1="70" y1="58" x2="70" y2="82" stroke={highlightRed} strokeWidth="6" strokeLinecap="round" filter="drop-shadow(0 0 3px rgba(255,42,77,0.6))" />
              <line x1="70" y1="82" x2="70" y2="105" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
              <circle cx="70" cy="108" r="6" fill="#E2E8F0" />
            </g>
          ) : (
            /* Arms Curled Up (Peak Bicep Contraction) */
            <g>
              <path d="M70 58 L70 82 L76 62" stroke={highlightRed} strokeWidth="7" strokeLinecap="round" fill="none" filter="drop-shadow(0 0 5px rgba(255,42,77,0.9))" />
              <circle cx="76" cy="58" r="7" fill="#E2E8F0" />
            </g>
          )}
        </svg>
      );

    // -----------------------------------------------------------------
    // DEFAULT / CHEST DIP & OTHER MOVEMENTS
    // -----------------------------------------------------------------
    default:
      return (
        <svg viewBox="0 0 160 160" className="w-full h-full max-h-40">
          <line x1="20" y1="145" x2="140" y2="145" stroke={equipmentColor} strokeWidth="2" />
          <circle cx="80" cy="45" r={headRadius} fill={bodyColor} />
          <rect x="70" y="55" width="20" height="40" rx="6" fill={highlightRed} filter="drop-shadow(0 0 4px rgba(255,42,77,0.7))" />
          <line x1="75" y1="95" x2="70" y2="145" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
          <line x1="85" y1="95" x2="90" y2="145" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
          <line x1="68" y1="62" x2={isStart ? "52" : "58"} y2={isStart ? "88" : "70"} stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
          <line x1="92" y1="62" x2={isStart ? "108" : "102"} y2={isStart ? "88" : "70"} stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
  }
}
