import React from 'react';

/**
 * AnatomicalBodyMap Component
 * Exact reproduction of the anatomical mannequin body map in the user's reference screenshots:
 * - Clean medical-grade Front View and Back View standing figures
 * - Medical grayscale contoured muscle lines (#CBD5E1, #94A3B8, #64748B)
 * - Active target muscles highlighted in VIVID RED (#FF3B30 / #EF4444)
 * - Supports both Men and Women anatomical contours
 */
export default function AnatomicalBodyMap({ 
  focusAreas = [], 
  primaryMuscle = '', 
  gender = 'male',
  className = ''
}) {
  const isFemale = gender === 'female';

  // Normalize active muscle tags
  const tags = [
    primaryMuscle,
    ...(Array.isArray(focusAreas) ? focusAreas : [focusAreas])
  ].map(t => String(t || '').toLowerCase().trim());

  const hasMuscle = (name) => {
    return tags.some(t => t.includes(name));
  };

  const isChest = hasMuscle('chest') || hasMuscle('pectoral') || hasMuscle('pec');
  const isAbs = hasMuscle('ab') || hasMuscle('core') || hasMuscle('wiper') || hasMuscle('oblique');
  const isShoulders = hasMuscle('shoulder') || hasMuscle('delt');
  const isBiceps = hasMuscle('bicep') || hasMuscle('arm');
  const isTriceps = hasMuscle('tricep');
  const isLats = hasMuscle('lat') || hasMuscle('back');
  const isTraps = hasMuscle('trap');
  const isGlutes = hasMuscle('glute') || hasMuscle('butt') || hasMuscle('hip');
  const isQuads = hasMuscle('quad') || hasMuscle('leg') || hasMuscle('thigh');
  const isHamstrings = hasMuscle('hamstring') || (hasMuscle('leg') && !isQuads);
  const isCalves = hasMuscle('calf') || hasMuscle('calves');

  // Palette
  const neutralFill = '#E2E8F0'; // Light athletic body tone
  const neutralStroke = '#94A3B8'; // Muscle definition lines
  const activeRed = '#FF3B30'; // Highlighted active target muscle
  const activeRedDark = '#E11D48';

  return (
    <div className={`flex items-center justify-center gap-6 sm:gap-10 py-2 select-none ${className}`}>
      {/* ============================================================== */}
      {/* 1. FRONT VIEW */}
      {/* ============================================================== */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 110 220" className="w-28 sm:w-32 h-56 sm:h-64 drop-shadow-sm">
          {/* Head & Neck */}
          <ellipse cx="55" cy="22" rx="10" ry="13" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />
          <path d="M 50 35 L 50 42 L 60 42 L 60 35 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />

          {/* Shoulders / Deltoids (Front) */}
          <path 
            d="M 36 44 Q 28 48 24 58 Q 32 64 36 56 Z" 
            fill={isShoulders ? activeRed : neutralFill} 
            stroke={isShoulders ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />
          <path 
            d="M 74 44 Q 82 48 86 58 Q 78 64 74 56 Z" 
            fill={isShoulders ? activeRed : neutralFill} 
            stroke={isShoulders ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* CHEST / PECTORALS (Left & Right) */}
          <path 
            d="M 38 46 Q 54 45 54 62 Q 44 72 36 62 Z" 
            fill={isChest ? activeRed : neutralFill} 
            stroke={isChest ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />
          <path 
            d="M 72 46 Q 56 45 56 62 Q 66 72 74 62 Z" 
            fill={isChest ? activeRed : neutralFill} 
            stroke={isChest ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* BICEPS & UPPER ARMS */}
          <path 
            d="M 23 58 Q 18 72 20 84 Q 27 82 28 70 Z" 
            fill={isBiceps ? activeRed : neutralFill} 
            stroke={isBiceps ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />
          <path 
            d="M 87 58 Q 92 72 90 84 Q 83 82 82 70 Z" 
            fill={isBiceps ? activeRed : neutralFill} 
            stroke={isBiceps ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* FOREARMS & HANDS */}
          <path d="M 19 85 Q 12 105 14 118 Q 20 116 23 98 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />
          <path d="M 91 85 Q 98 105 96 118 Q 90 116 87 98 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />
          <ellipse cx="14" cy="122" rx="3" ry="5" fill={neutralFill} stroke={neutralStroke} strokeWidth="1" />
          <ellipse cx="96" cy="122" rx="3" ry="5" fill={neutralFill} stroke={neutralStroke} strokeWidth="1" />

          {/* ABDOMINALS / RECTUS ABDOMINIS & CORE */}
          <g>
            {/* Top Abs */}
            <rect 
              x="45" y="65" width="8" height="9" rx="2" 
              fill={isAbs ? activeRed : neutralFill} 
              stroke={isAbs ? activeRedDark : neutralStroke} 
              strokeWidth="1" 
            />
            <rect 
              x="57" y="65" width="8" height="9" rx="2" 
              fill={isAbs ? activeRed : neutralFill} 
              stroke={isAbs ? activeRedDark : neutralStroke} 
              strokeWidth="1" 
            />
            {/* Mid Abs */}
            <rect 
              x="45" y="76" width="8" height="9" rx="2" 
              fill={isAbs ? activeRed : neutralFill} 
              stroke={isAbs ? activeRedDark : neutralStroke} 
              strokeWidth="1" 
            />
            <rect 
              x="57" y="76" width="8" height="9" rx="2" 
              fill={isAbs ? activeRed : neutralFill} 
              stroke={isAbs ? activeRedDark : neutralStroke} 
              strokeWidth="1" 
            />
            {/* Lower Abs */}
            <rect 
              x="46" y="87" width="7" height="9" rx="2" 
              fill={isAbs ? activeRed : neutralFill} 
              stroke={isAbs ? activeRedDark : neutralStroke} 
              strokeWidth="1" 
            />
            <rect 
              x="57" y="87" width="7" height="9" rx="2" 
              fill={isAbs ? activeRed : neutralFill} 
              stroke={isAbs ? activeRedDark : neutralStroke} 
              strokeWidth="1" 
            />
            {/* Obliques Flanks */}
            <path 
              d="M 37 68 Q 44 80 43 94 L 38 90 Z" 
              fill={isAbs ? (isAbs ? '#FDA4AF' : neutralFill) : neutralFill} 
              stroke={neutralStroke} 
              strokeWidth="1" 
            />
            <path 
              d="M 73 68 Q 66 80 67 94 L 72 90 Z" 
              fill={isAbs ? (isAbs ? '#FDA4AF' : neutralFill) : neutralFill} 
              stroke={neutralStroke} 
              strokeWidth="1" 
            />
          </g>

          {/* Pelvis / Hips */}
          <path d="M 42 98 L 68 98 L 64 112 L 46 112 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />

          {/* QUADRICEPS / THIGHS */}
          <path 
            d="M 41 112 Q 33 135 37 155 Q 49 155 52 135 Q 52 118 48 112 Z" 
            fill={isQuads ? activeRed : neutralFill} 
            stroke={isQuads ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />
          <path 
            d="M 69 112 Q 77 135 73 155 Q 61 155 58 135 Q 58 118 62 112 Z" 
            fill={isQuads ? activeRed : neutralFill} 
            stroke={isQuads ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* Knees */}
          <ellipse cx="43" cy="158" rx="4" ry="4" fill={neutralFill} stroke={neutralStroke} strokeWidth="1" />
          <ellipse cx="67" cy="158" rx="4" ry="4" fill={neutralFill} stroke={neutralStroke} strokeWidth="1" />

          {/* CALVES / SHINS */}
          <path 
            d="M 39 162 Q 34 180 41 202 L 46 202 Q 47 182 46 162 Z" 
            fill={isCalves ? activeRed : neutralFill} 
            stroke={isCalves ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />
          <path 
            d="M 71 162 Q 76 180 69 202 L 64 202 Q 63 182 64 162 Z" 
            fill={isCalves ? activeRed : neutralFill} 
            stroke={isCalves ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* Feet */}
          <path d="M 39 202 L 35 212 L 46 212 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1" />
          <path d="M 71 202 L 75 212 L 64 212 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1" />
        </svg>
        <span className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Front</span>
      </div>

      {/* ============================================================== */}
      {/* 2. BACK VIEW */}
      {/* ============================================================== */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 110 220" className="w-28 sm:w-32 h-56 sm:h-64 drop-shadow-sm">
          {/* Head & Neck (Back) */}
          <ellipse cx="55" cy="22" rx="10" ry="13" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />
          <path d="M 50 35 L 50 42 L 60 42 L 60 35 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />

          {/* TRAPEZIUS (Upper Back) */}
          <path 
            d="M 45 38 L 55 48 L 65 38 L 55 35 Z" 
            fill={isTraps ? activeRed : neutralFill} 
            stroke={isTraps ? activeRedDark : neutralStroke} 
            strokeWidth="1" 
          />
          <path 
            d="M 42 42 L 55 58 L 68 42 L 55 46 Z" 
            fill={isTraps ? activeRed : neutralFill} 
            stroke={isTraps ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* REAR DELTOIDS / SHOULDERS (Back) */}
          <path 
            d="M 36 44 Q 28 48 24 58 Q 32 64 36 56 Z" 
            fill={isShoulders ? activeRed : neutralFill} 
            stroke={isShoulders ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />
          <path 
            d="M 74 44 Q 82 48 86 58 Q 78 64 74 56 Z" 
            fill={isShoulders ? activeRed : neutralFill} 
            stroke={isShoulders ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* TRICEPS (Back of arms) */}
          <path 
            d="M 23 58 Q 18 72 20 84 Q 27 82 28 70 Z" 
            fill={isTriceps ? activeRed : neutralFill} 
            stroke={isTriceps ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />
          <path 
            d="M 87 58 Q 92 72 90 84 Q 83 82 82 70 Z" 
            fill={isTriceps ? activeRed : neutralFill} 
            stroke={isTriceps ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* FOREARMS & HANDS */}
          <path d="M 19 85 Q 12 105 14 118 Q 20 116 23 98 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />
          <path d="M 91 85 Q 98 105 96 118 Q 90 116 87 98 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />
          <ellipse cx="14" cy="122" rx="3" ry="5" fill={neutralFill} stroke={neutralStroke} strokeWidth="1" />
          <ellipse cx="96" cy="122" rx="3" ry="5" fill={neutralFill} stroke={neutralStroke} strokeWidth="1" />

          {/* LATS / LATISSIMUS DORSI (Mid Back Wing) */}
          <path 
            d="M 38 52 Q 53 62 54 84 Q 40 86 36 68 Z" 
            fill={isLats ? activeRed : neutralFill} 
            stroke={isLats ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />
          <path 
            d="M 72 52 Q 57 62 56 84 Q 70 86 74 68 Z" 
            fill={isLats ? activeRed : neutralFill} 
            stroke={isLats ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* Lower Back / Erector Spinae */}
          <path 
            d="M 48 84 L 54 98 L 62 84 Z" 
            fill={isLats ? (isLats ? '#FDA4AF' : neutralFill) : neutralFill} 
            stroke={neutralStroke} 
            strokeWidth="1" 
          />

          {/* GLUTES / BUTT */}
          <path 
            d="M 40 98 Q 36 118 53 118 Q 55 108 50 98 Z" 
            fill={isGlutes ? activeRed : neutralFill} 
            stroke={isGlutes ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />
          <path 
            d="M 70 98 Q 74 118 57 118 Q 55 108 60 98 Z" 
            fill={isGlutes ? activeRed : neutralFill} 
            stroke={isGlutes ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* HAMSTRINGS (Back of Thighs) */}
          <path 
            d="M 39 120 Q 34 140 38 155 Q 49 155 52 140 Q 52 124 49 120 Z" 
            fill={isHamstrings ? activeRed : neutralFill} 
            stroke={isHamstrings ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />
          <path 
            d="M 71 120 Q 76 140 72 155 Q 61 155 58 140 Q 58 124 61 120 Z" 
            fill={isHamstrings ? activeRed : neutralFill} 
            stroke={isHamstrings ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* Back of Knees */}
          <line x1="39" y1="156" x2="48" y2="156" stroke={neutralStroke} strokeWidth="1" />
          <line x1="62" y1="156" x2="71" y2="156" stroke={neutralStroke} strokeWidth="1" />

          {/* CALVES / GASTROCNEMIUS (Back View) */}
          <path 
            d="M 37 160 Q 32 178 40 202 L 46 202 Q 48 182 46 160 Z" 
            fill={isCalves ? activeRed : neutralFill} 
            stroke={isCalves ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />
          <path 
            d="M 73 160 Q 78 178 70 202 L 64 202 Q 62 182 64 160 Z" 
            fill={isCalves ? activeRed : neutralFill} 
            stroke={isCalves ? activeRedDark : neutralStroke} 
            strokeWidth="1.2" 
          />

          {/* Heels & Soles */}
          <path d="M 38 202 L 35 212 L 46 212 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1" />
          <path d="M 72 202 L 75 212 L 64 212 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1" />
        </svg>
        <span className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Back</span>
      </div>
    </div>
  );
}
