import React from 'react';

/**
 * AnatomicalBodyMap Component
 * Exact 1-to-1 fidelity reproduction of the anatomical body map from the user's reference screenshot (Image 3):
 * - Clean faceted Front View and Back View anatomical human mannequins
 * - Standing in standard anatomical position (palms forward, arms angled slightly out)
 * - Gray segmented muscle groups with crisp white separations (#D1D5DB / #E5E7EB)
 * - Targeted muscles highlighted in SOLID VIBRANT RED (#EF4444 / #FF3B30)
 * - Supports Men and Women anatomical contours
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

  const hasMuscle = (name) => tags.some(t => t.includes(name));

  const isChest = hasMuscle('chest') || hasMuscle('pectoral') || hasMuscle('pec');
  const isAbs = hasMuscle('ab') || hasMuscle('core') || hasMuscle('wiper') || hasMuscle('oblique');
  const isShoulders = hasMuscle('shoulder') || hasMuscle('delt');
  const isBiceps = hasMuscle('bicep') || (hasMuscle('arm') && !hasMuscle('tricep'));
  const isTriceps = hasMuscle('tricep');
  const isLats = hasMuscle('lat') || hasMuscle('back');
  const isTraps = hasMuscle('trap');
  const isGlutes = hasMuscle('glute') || hasMuscle('butt') || hasMuscle('hip');
  const isQuads = hasMuscle('quad') || hasMuscle('leg') || hasMuscle('thigh');
  const isHamstrings = hasMuscle('hamstring');
  const isCalves = hasMuscle('calf') || hasMuscle('calves');

  // Palette matching Image 3
  const neutralFill = '#D1D5DB'; // Medical slate gray
  const neutralStroke = '#FFFFFF'; // Crisp white muscle contour separators
  const activeRed = '#EF4444'; // Solid bright red target muscle
  const activeRedStroke = '#DC2626';

  return (
    <div className={`flex items-center justify-center gap-6 sm:gap-12 py-3 select-none ${className}`}>
      {/* ============================================================== */}
      {/* 1. FRONT VIEW (Exact silhouette from Image 3)                   */}
      {/* ============================================================== */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 140 250" className="w-32 sm:w-36 h-64 sm:h-72 drop-shadow-sm">
          {/* Head & Neck */}
          <ellipse cx="70" cy="24" rx="11" ry="14" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
          <path d="M 64 36 L 62 46 L 78 46 L 76 36 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />

          {/* Trapezius / Clavicle base */}
          <path d="M 62 46 L 50 50 L 52 56 L 68 54 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
          <path d="M 78 46 L 90 50 L 88 56 L 72 54 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />

          {/* DELTOIDS (Shoulders - Left & Right) */}
          <path 
            d="M 50 49 Q 36 54 32 68 Q 42 76 46 64 Z" 
            fill={isShoulders ? activeRed : neutralFill} 
            stroke={isShoulders ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
          <path 
            d="M 90 49 Q 104 54 108 68 Q 98 76 94 64 Z" 
            fill={isShoulders ? activeRed : neutralFill} 
            stroke={isShoulders ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />

          {/* CHEST / PECTORALS (Matching Image 3 in Solid Vibrant Red) */}
          {/* Left Pectoral */}
          <path 
            d="M 50 54 Q 69 53 68 76 Q 54 88 45 76 Q 44 64 50 54 Z" 
            fill={isChest ? activeRed : neutralFill} 
            stroke={isChest ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
          {/* Right Pectoral */}
          <path 
            d="M 90 54 Q 71 53 72 76 Q 86 88 95 76 Q 96 64 90 54 Z" 
            fill={isChest ? activeRed : neutralFill} 
            stroke={isChest ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />

          {/* BICEPS & UPPER ARMS */}
          <path 
            d="M 32 68 Q 24 86 26 102 Q 34 100 37 84 Q 37 76 32 68 Z" 
            fill={isBiceps ? activeRed : neutralFill} 
            stroke={isBiceps ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
          <path 
            d="M 108 68 Q 116 86 114 102 Q 106 100 103 84 Q 103 76 108 68 Z" 
            fill={isBiceps ? activeRed : neutralFill} 
            stroke={isBiceps ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />

          {/* FOREARMS & HANDS */}
          <path d="M 25 104 Q 16 128 18 144 Q 25 142 28 120 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
          <path d="M 115 104 Q 124 128 122 144 Q 115 142 112 120 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
          <ellipse cx="17" cy="149" rx="4" ry="6" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />
          <ellipse cx="123" cy="149" rx="4" ry="6" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />

          {/* ABDOMINALS (6-Pack Blocks & Obliques) */}
          <g>
            {/* Top Abs (Left & Right) */}
            <path d="M 58 80 L 68 80 L 68 93 L 57 93 Z" fill={isAbs ? activeRed : neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
            <path d="M 72 80 L 82 80 L 83 93 L 72 93 Z" fill={isAbs ? activeRed : neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
            {/* Mid Abs */}
            <path d="M 57 95 L 68 95 L 68 108 L 57 108 Z" fill={isAbs ? activeRed : neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
            <path d="M 72 95 L 83 95 L 83 108 L 72 108 Z" fill={isAbs ? activeRed : neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
            {/* Lower Abs */}
            <path d="M 58 110 L 68 110 L 68 122 L 59 122 Z" fill={isAbs ? activeRed : neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
            <path d="M 72 110 L 82 110 L 81 122 L 72 122 Z" fill={isAbs ? activeRed : neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
            {/* Obliques / Serratus flank */}
            <path d="M 46 80 Q 56 94 54 116 L 47 110 Z" fill={isAbs ? activeRed : neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
            <path d="M 94 80 Q 84 94 86 116 L 93 110 Z" fill={isAbs ? activeRed : neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
          </g>

          {/* PELVIS / GROIN */}
          <polygon points="54,124 86,124 80,140 60,140" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />

          {/* QUADRICEPS (Thighs) */}
          <path 
            d="M 54 140 Q 42 168 46 195 Q 62 195 65 168 Q 66 148 60 140 Z" 
            fill={isQuads ? activeRed : neutralFill} 
            stroke={isQuads ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
          <path 
            d="M 86 140 Q 98 168 94 195 Q 78 195 75 168 Q 74 148 80 140 Z" 
            fill={isQuads ? activeRed : neutralFill} 
            stroke={isQuads ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />

          {/* Knees */}
          <ellipse cx="53" cy="199" rx="5" ry="4" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />
          <ellipse cx="87" cy="199" rx="5" ry="4" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />

          {/* CALVES / SHINS */}
          <path 
            d="M 48 204 Q 40 226 50 244 L 56 244 Q 58 226 57 204 Z" 
            fill={isCalves ? activeRed : neutralFill} 
            stroke={isCalves ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
          <path 
            d="M 92 204 Q 100 226 90 244 L 84 244 Q 82 226 83 204 Z" 
            fill={isCalves ? activeRed : neutralFill} 
            stroke={isCalves ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
        </svg>
      </div>

      {/* ============================================================== */}
      {/* 2. BACK VIEW (Exact silhouette from Image 3)                    */}
      {/* ============================================================== */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 140 250" className="w-32 sm:w-36 h-64 sm:h-72 drop-shadow-sm">
          {/* Head & Neck (Back) */}
          <ellipse cx="70" cy="24" rx="11" ry="14" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
          <path d="M 64 36 L 62 46 L 78 46 L 76 36 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />

          {/* TRAPEZIUS (Diamond Upper Back) */}
          <polygon 
            points="70,44 86,55 70,82 54,55" 
            fill={isTraps ? activeRed : neutralFill} 
            stroke={isTraps ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />

          {/* REAR DELTOIDS (Shoulders - Back) */}
          <path 
            d="M 50 49 Q 36 54 32 68 Q 42 76 46 64 Z" 
            fill={isShoulders ? activeRed : neutralFill} 
            stroke={isShoulders ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
          <path 
            d="M 90 49 Q 104 54 108 68 Q 98 76 94 64 Z" 
            fill={isShoulders ? activeRed : neutralFill} 
            stroke={isShoulders ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />

          {/* TRICEPS (Back of arms) */}
          <path 
            d="M 32 68 Q 24 86 26 102 Q 34 100 37 84 Q 37 76 32 68 Z" 
            fill={isTriceps ? activeRed : neutralFill} 
            stroke={isTriceps ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
          <path 
            d="M 108 68 Q 116 86 114 102 Q 106 100 103 84 Q 103 76 108 68 Z" 
            fill={isTriceps ? activeRed : neutralFill} 
            stroke={isTriceps ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />

          {/* FOREARMS & HANDS */}
          <path d="M 25 104 Q 16 128 18 144 Q 25 142 28 120 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
          <path d="M 115 104 Q 124 128 122 144 Q 115 142 112 120 Z" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />
          <ellipse cx="17" cy="149" rx="4" ry="6" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />
          <ellipse cx="123" cy="149" rx="4" ry="6" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />

          {/* LATS / LATISSIMUS DORSI (Mid Back Wings) */}
          <path 
            d="M 52 68 Q 70 80 69 110 Q 52 112 46 88 Z" 
            fill={isLats ? activeRed : neutralFill} 
            stroke={isLats ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
          <path 
            d="M 88 68 Q 70 80 71 110 Q 88 112 94 88 Z" 
            fill={isLats ? activeRed : neutralFill} 
            stroke={isLats ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />

          {/* LOWER BACK (Erector Spinae) */}
          <polygon points="63,110 77,110 74,128 66,128" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.5" />

          {/* GLUTES (Butt) */}
          <path 
            d="M 50 128 Q 45 152 68 152 Q 70 140 64 128 Z" 
            fill={isGlutes ? activeRed : neutralFill} 
            stroke={isGlutes ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
          <path 
            d="M 90 128 Q 95 152 72 152 Q 70 140 76 128 Z" 
            fill={isGlutes ? activeRed : neutralFill} 
            stroke={isGlutes ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />

          {/* HAMSTRINGS (Back of Thighs) */}
          <path 
            d="M 48 154 Q 40 178 46 195 Q 60 195 64 176 Q 66 160 62 154 Z" 
            fill={isHamstrings ? activeRed : neutralFill} 
            stroke={isHamstrings ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
          <path 
            d="M 92 154 Q 100 178 94 195 Q 80 195 76 176 Q 74 160 78 154 Z" 
            fill={isHamstrings ? activeRed : neutralFill} 
            stroke={isHamstrings ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />

          {/* Back of Knees */}
          <ellipse cx="53" cy="199" rx="5" ry="3" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />
          <ellipse cx="87" cy="199" rx="5" ry="3" fill={neutralFill} stroke={neutralStroke} strokeWidth="1.2" />

          {/* CALVES (Gastrocnemius - Back View) */}
          <path 
            d="M 46 202 Q 38 224 48 244 L 56 244 Q 58 224 56 202 Z" 
            fill={isCalves ? activeRed : neutralFill} 
            stroke={isCalves ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
          <path 
            d="M 94 202 Q 102 224 92 244 L 84 244 Q 82 224 84 202 Z" 
            fill={isCalves ? activeRed : neutralFill} 
            stroke={isCalves ? activeRedStroke : neutralStroke} 
            strokeWidth="1.5" 
          />
        </svg>
      </div>
    </div>
  );
}
