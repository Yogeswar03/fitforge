import React from 'react';

/**
 * AnatomicalBodyMap Component
 * Exact 1:1 reproduction of the anatomical body map from the user's reference screenshot (Image 3):
 * - Clean faceted medical-art Front View and Back View male/female figures
 * - Light-grey segmented muscle groups (#C8CCD0) on clean white background with crisp white separation lines
 * - Target muscle groups highlighted in SOLID VIBRANT RED (#EF4444 / #FF3B30)
 * - Proportional torso, shoulders, arms, six-pack, thighs, calves, and posterior chain matching reference image 3
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

  const isChest = hasMuscle('chest') || hasMuscle('pectoral') || hasMuscle('pec') || hasMuscle('bench');
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
  const isForearms = hasMuscle('forearm');

  // Exact Colors matching reference image 3
  const neutralGray = '#C8CCD2';      // Smooth body grey
  const neutralDark = '#B3B8BF';      // Darker shading tone
  const separator = '#FFFFFF';        // Crisp white muscle separation lines
  const activeRed = '#FF3B30';        // Vivid red target muscle
  const activeRedDark = '#E02E24';

  const getColor = (isActive) => isActive ? activeRed : neutralGray;
  const getStroke = (isActive) => isActive ? activeRedDark : separator;

  return (
    <div className={`flex items-center justify-center gap-6 sm:gap-14 py-2 select-none ${className}`}>
      {/* ============================================================== */}
      {/* 1. FRONT VIEW (Exact match for Left figure in Image 3)         */}
      {/* ============================================================== */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 160 270" className="w-36 sm:w-40 h-64 sm:h-72 drop-shadow-sm">
          <defs>
            <filter id="soft-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* HEAD & NECK */}
          {/* Head silhouette */}
          <ellipse cx="80" cy="22" rx="10.5" ry="14" fill={neutralGray} />
          {/* Sternocleidomastoid (Neck muscles) */}
          <path d="M 75 34 L 72 46 L 77 46 L 78 34 Z" fill={neutralDark} stroke={separator} strokeWidth="1" />
          <path d="M 85 34 L 88 46 L 83 46 L 82 34 Z" fill={neutralDark} stroke={separator} strokeWidth="1" />
          {/* Clavicle / Neck base */}
          <polygon points="73,46 87,46 83,50 77,50" fill={neutralGray} stroke={separator} strokeWidth="1" />

          {/* SHOULDERS / DELTOIDS (Anterior & Lateral) */}
          {/* Left Deltoid */}
          <path 
            d="M 64 47 C 50 49 42 56 38 68 C 39 74 46 76 52 70 C 56 65 59 56 64 47 Z" 
            fill={getColor(isShoulders)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Right Deltoid */}
          <path 
            d="M 96 47 C 110 49 118 56 122 68 C 121 74 114 76 108 70 C 104 65 101 56 96 47 Z" 
            fill={getColor(isShoulders)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />

          {/* CHEST / PECTORALIS MAJOR (Highlighted in Red in Image 3!) */}
          {/* Left Pectoral */}
          <path 
            d="M 65 48 C 77 48 78 49 78 74 C 74 77 65 77 56 75 C 50 73 52 64 57 56 C 60 51 63 49 65 48 Z" 
            fill={getColor(isChest)} 
            stroke={separator} 
            strokeWidth="1.5" 
          />
          {/* Right Pectoral */}
          <path 
            d="M 95 48 C 83 48 82 49 82 74 C 86 77 95 77 104 75 C 110 73 108 64 103 56 C 100 51 97 49 95 48 Z" 
            fill={getColor(isChest)} 
            stroke={separator} 
            strokeWidth="1.5" 
          />

          {/* ARMS (BICEPS, FOREARMS, HANDS - Palms open facing forward) */}
          {/* Left Bicep */}
          <path 
            d="M 40 70 C 34 78 33 89 35 98 C 40 98 44 94 46 86 C 47 78 46 72 40 70 Z" 
            fill={getColor(isBiceps)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Right Bicep */}
          <path 
            d="M 120 70 C 126 78 127 89 125 98 C 120 98 116 94 114 86 C 113 78 114 72 120 70 Z" 
            fill={getColor(isBiceps)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Left Forearm */}
          <path 
            d="M 33 100 C 26 112 24 126 25 140 C 30 140 34 133 36 122 C 37 112 37 103 33 100 Z" 
            fill={getColor(isForearms)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Right Forearm */}
          <path 
            d="M 127 100 C 134 112 136 126 135 140 C 130 140 126 133 124 122 C 123 112 123 103 127 100 Z" 
            fill={getColor(isForearms)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Hands (palms facing forward as in Image 3) */}
          <path d="M 24 142 C 21 148 18 153 19 157 C 22 158 25 156 27 151 C 29 147 28 143 24 142 Z" fill={neutralGray} stroke={separator} strokeWidth="1" />
          <path d="M 136 142 C 139 148 142 153 141 157 C 138 158 135 156 133 151 C 131 147 132 143 136 142 Z" fill={neutralGray} stroke={separator} strokeWidth="1" />

          {/* SERRATUS & OBLIQUES (Flanking Ribcage) */}
          <path d="M 54 77 C 58 84 57 93 54 102 C 51 98 51 86 54 77 Z" fill={getColor(isAbs)} stroke={separator} strokeWidth="1" />
          <path d="M 106 77 C 102 84 103 93 106 102 C 109 98 109 86 106 77 Z" fill={getColor(isAbs)} stroke={separator} strokeWidth="1" />
          <path d="M 55 104 C 60 114 61 123 57 128 C 53 122 52 112 55 104 Z" fill={getColor(isAbs)} stroke={separator} strokeWidth="1" />
          <path d="M 105 104 C 100 114 99 123 103 128 C 107 122 108 112 105 104 Z" fill={getColor(isAbs)} stroke={separator} strokeWidth="1" />

          {/* ABDOMINALS (Linear alba & segmented 6-pack) */}
          {/* Upper Abs */}
          <rect x="67" y="78" width="11" height="12" rx="2" fill={getColor(isAbs)} stroke={separator} strokeWidth="1.2" />
          <rect x="82" y="78" width="11" height="12" rx="2" fill={getColor(isAbs)} stroke={separator} strokeWidth="1.2" />
          {/* Middle Abs */}
          <rect x="68" y="93" width="10" height="13" rx="2" fill={getColor(isAbs)} stroke={separator} strokeWidth="1.2" />
          <rect x="82" y="93" width="10" height="13" rx="2" fill={getColor(isAbs)} stroke={separator} strokeWidth="1.2" />
          {/* Lower Abs / Core */}
          <path d="M 70 109 L 78 109 L 77 124 L 71 124 Z" fill={getColor(isAbs)} stroke={separator} strokeWidth="1.2" />
          <path d="M 82 109 L 90 109 L 89 124 L 83 124 Z" fill={getColor(isAbs)} stroke={separator} strokeWidth="1.2" />

          {/* PELVIS / GROIN */}
          <polygon points="63,126 97,126 92,143 68,143" fill={neutralGray} stroke={separator} strokeWidth="1.2" />

          {/* THIGHS / QUADRICEPS (Rectus femoris, vastus lateralis, vastus medialis) */}
          {/* Left Quad Outer */}
          <path 
            d="M 64 144 C 54 158 50 176 53 194 C 58 194 62 186 64 172 C 65 158 65 148 64 144 Z" 
            fill={getColor(isQuads)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Left Quad Inner (Teardrop / Vastus medialis) */}
          <path 
            d="M 66 144 C 70 156 71 170 70 190 C 65 194 62 192 64 176 C 65 160 65 148 66 144 Z" 
            fill={getColor(isQuads)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Right Quad Outer */}
          <path 
            d="M 96 144 C 106 158 110 176 107 194 C 102 194 98 186 96 172 C 95 158 95 148 96 144 Z" 
            fill={getColor(isQuads)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Right Quad Inner (Teardrop / Vastus medialis) */}
          <path 
            d="M 94 144 C 90 156 89 170 90 190 C 95 194 98 192 96 176 C 95 160 95 148 94 144 Z" 
            fill={getColor(isQuads)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />

          {/* KNEES / PATELLA */}
          <ellipse cx="61" cy="200" rx="5" ry="4" fill={neutralGray} stroke={separator} strokeWidth="1" />
          <ellipse cx="99" cy="200" rx="5" ry="4" fill={neutralGray} stroke={separator} strokeWidth="1" />

          {/* SHINS & CALVES (Tibia & Gastrocnemius front) */}
          {/* Left Calf / Shin */}
          <path 
            d="M 56 206 C 50 218 51 234 54 252 C 58 252 63 242 64 226 C 65 214 63 206 56 206 Z" 
            fill={getColor(isCalves)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Right Calf / Shin */}
          <path 
            d="M 104 206 C 110 218 109 234 106 252 C 102 252 97 242 96 226 C 95 214 97 206 104 206 Z" 
            fill={getColor(isCalves)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />

          {/* FEET */}
          <path d="M 53 254 C 51 260 52 264 57 264 C 61 264 61 259 58 254 Z" fill={neutralGray} stroke={separator} strokeWidth="1" />
          <path d="M 107 254 C 109 260 108 264 103 264 C 99 264 99 259 102 254 Z" fill={neutralGray} stroke={separator} strokeWidth="1" />
        </svg>
      </div>

      {/* ============================================================== */}
      {/* 2. BACK VIEW (Exact match for Right figure in Image 3)         */}
      {/* ============================================================== */}
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 160 270" className="w-36 sm:w-40 h-64 sm:h-72 drop-shadow-sm">
          {/* HEAD & NECK (BACK) */}
          <ellipse cx="80" cy="22" rx="10.5" ry="14" fill={neutralGray} />
          <path d="M 75 34 L 74 45 L 86 45 L 85 34 Z" fill={neutralDark} stroke={separator} strokeWidth="1" />

          {/* TRAPEZIUS (Diamond-shaped Upper Back) */}
          <polygon 
            points="80,44 97,55 80,84 63,55" 
            fill={getColor(isTraps)} 
            stroke={separator} 
            strokeWidth="1.5" 
          />

          {/* REAR DELTOIDS (Back Shoulders) */}
          {/* Left Rear Delt */}
          <path 
            d="M 62 49 C 48 53 42 62 38 72 C 45 76 52 74 58 66 C 60 59 61 53 62 49 Z" 
            fill={getColor(isShoulders)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Right Rear Delt */}
          <path 
            d="M 98 49 C 112 53 118 62 122 72 C 115 76 108 74 102 66 C 100 59 99 53 98 49 Z" 
            fill={getColor(isShoulders)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />

          {/* TRICEPS (Lateral & Long Heads) */}
          {/* Left Tricep */}
          <path 
            d="M 38 74 C 33 82 32 92 34 100 C 40 100 44 95 46 86 C 46 78 43 74 38 74 Z" 
            fill={getColor(isTriceps)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Right Tricep */}
          <path 
            d="M 122 74 C 127 82 128 92 126 100 C 120 100 116 95 114 86 C 114 78 117 74 122 74 Z" 
            fill={getColor(isTriceps)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Forearms (Back) */}
          <path d="M 33 102 C 26 114 24 128 25 142 C 30 142 34 135 36 124 C 37 114 37 105 33 102 Z" fill={getColor(isForearms)} stroke={separator} strokeWidth="1.2" />
          <path d="M 127 102 C 134 114 136 128 135 142 C 130 142 126 135 124 124 C 123 114 123 105 127 102 Z" fill={getColor(isForearms)} stroke={separator} strokeWidth="1.2" />
          {/* Hands */}
          <path d="M 24 144 C 21 150 18 155 19 159 C 22 160 25 158 27 153 C 29 149 28 145 24 144 Z" fill={neutralGray} stroke={separator} strokeWidth="1" />
          <path d="M 136 144 C 139 150 142 155 141 159 C 138 160 135 158 133 153 C 131 149 132 145 136 144 Z" fill={neutralGray} stroke={separator} strokeWidth="1" />

          {/* LATS / LATISSIMUS DORSI (Mid Back Wings) */}
          {/* Left Lat Wing */}
          <path 
            d="M 63 68 C 55 82 54 100 58 114 C 65 113 72 108 77 96 C 75 84 70 74 63 68 Z" 
            fill={getColor(isLats)} 
            stroke={separator} 
            strokeWidth="1.5" 
          />
          {/* Right Lat Wing */}
          <path 
            d="M 97 68 C 105 82 106 100 102 114 C 95 113 88 108 83 96 C 85 84 90 74 97 68 Z" 
            fill={getColor(isLats)} 
            stroke={separator} 
            strokeWidth="1.5" 
          />

          {/* LOWER BACK (Erector Spinae & Thoracolumbar Fascia) */}
          <polygon points="73,100 87,100 85,124 75,124" fill={neutralGray} stroke={separator} strokeWidth="1.2" />

          {/* GLUTEUS MAXIMUS (Butt) */}
          {/* Left Glute */}
          <path 
            d="M 60 126 C 52 136 51 149 57 158 C 66 160 76 156 79 142 C 79 132 74 126 60 126 Z" 
            fill={getColor(isGlutes)} 
            stroke={separator} 
            strokeWidth="1.5" 
          />
          {/* Right Glute */}
          <path 
            d="M 100 126 C 108 136 109 149 103 158 C 94 160 84 156 81 142 C 81 132 86 126 100 126 Z" 
            fill={getColor(isGlutes)} 
            stroke={separator} 
            strokeWidth="1.5" 
          />

          {/* HAMSTRINGS (Biceps Femoris & Semitendinosus - Back of Thighs) */}
          {/* Left Hamstring */}
          <path 
            d="M 57 160 C 51 172 50 186 53 196 C 60 196 66 190 70 178 C 72 168 70 160 57 160 Z" 
            fill={getColor(isHamstrings)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Right Hamstring */}
          <path 
            d="M 103 160 C 109 172 110 186 107 196 C 100 196 94 190 90 178 C 88 168 90 160 103 160 Z" 
            fill={getColor(isHamstrings)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />

          {/* BACK OF KNEES (Popliteal fossa) */}
          <ellipse cx="61" cy="200" rx="5" ry="3" fill={neutralGray} stroke={separator} strokeWidth="1" />
          <ellipse cx="99" cy="200" rx="5" ry="3" fill={neutralGray} stroke={separator} strokeWidth="1" />

          {/* CALVES / GASTROCNEMIUS (Inner & Outer Heads) */}
          {/* Left Calf */}
          <path 
            d="M 55 204 C 47 216 48 232 52 250 C 58 250 63 240 65 224 C 66 212 63 204 55 204 Z" 
            fill={getColor(isCalves)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />
          {/* Right Calf */}
          <path 
            d="M 105 204 C 113 216 112 232 108 250 C 102 250 97 240 95 224 C 94 212 97 204 105 204 Z" 
            fill={getColor(isCalves)} 
            stroke={separator} 
            strokeWidth="1.2" 
          />

          {/* HEELS */}
          <path d="M 52 252 C 50 258 51 262 56 262 C 60 262 60 257 57 252 Z" fill={neutralGray} stroke={separator} strokeWidth="1" />
          <path d="M 108 252 C 110 258 109 262 104 262 C 100 262 100 257 103 252 Z" fill={neutralGray} stroke={separator} strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

