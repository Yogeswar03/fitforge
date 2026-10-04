// Comprehensive Exercise Database with photos, target muscles, equipment, and form cues

export const EXERCISE_DATABASE = [
  // CHEST
  {
    id: 'bench-press',
    name: 'Bench Press',
    aliases: ['flat bench', 'barbell bench press', 'chest press'],
    category: 'Chest',
    muscle: 'Pectoralis Major, Triceps, Anterior Deltoids',
    equipment: 'Barbell & Flat Bench',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Pin shoulder blades together into the bench and keep feet planted firmly.',
      'Lower the bar with control until it gently touches your mid-chest.',
      'Press explosively upwards while keeping elbows tucked at roughly 45 degrees.'
    ]
  },
  {
    id: 'incline-db-press',
    name: 'Incline Dumbbell Press',
    aliases: ['incline bench press', 'incline press', 'db incline'],
    category: 'Chest',
    muscle: 'Upper Chest (Clavicular Head), Shoulders, Triceps',
    equipment: 'Dumbbells & Incline Bench (30-45°)',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Set bench to a 30-45 degree incline for upper chest focus.',
      'Lower dumbbells until upper arms are parallel to the floor.',
      'Press up in a slight arc without banging weights together at the top.'
    ]
  },
  {
    id: 'push-ups',
    name: 'Push Ups',
    aliases: ['pushups', 'push-up', 'push up'],
    category: 'Chest',
    muscle: 'Chest, Triceps, Core Stabilizers',
    equipment: 'Bodyweight',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Maintain a rigid plank line from heels to head with glutes squeezed.',
      'Lower chest until 2 inches above the ground.',
      'Push the floor away through the palms and lock out arms at the top.'
    ]
  },
  {
    id: 'cable-crossover',
    name: 'Cable Crossover',
    aliases: ['cable fly', 'cable flyes', 'cable crossover fly'],
    category: 'Chest',
    muscle: 'Inner & Outer Pectorals',
    equipment: 'Dual Cable Machine',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Take a split stance and maintain a slight bend in elbows throughout.',
      'Bring handles together across chest in a hugging motion.',
      'Squeeze chest hard for 1 second at full contraction.'
    ]
  },
  {
    id: 'chest-dips',
    name: 'Chest Dips',
    aliases: ['dips', 'parallel bar dips'],
    category: 'Chest',
    muscle: 'Lower Chest, Anterior Deltoids, Triceps',
    equipment: 'Parallel Dip Bars',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Lean torso forward 30 degrees to place maximum tension on chest.',
      'Lower until shoulders are just below elbows (90 degree bend).',
      'Push straight up through palms without shrugging shoulders.'
    ]
  },
  {
    id: 'pec-deck-fly',
    name: 'Pec Deck Fly',
    aliases: ['pec deck', 'machine fly', 'butterfly'],
    category: 'Chest',
    muscle: 'Pectoralis Major Isolation',
    equipment: 'Pec Deck Machine',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Adjust seat so handles align with mid-chest.',
      'Keep elbows slightly bent and stationary during the movement.',
      'Squeeze chest at the center and control the stretch on the way back.'
    ]
  },

  // BACK
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    aliases: ['pulldown', 'lat pull down', 'cable pulldown'],
    category: 'Back',
    muscle: 'Latissimus Dorsi, Biceps, Upper Back',
    equipment: 'Lat Pulldown Cable Machine',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Grip slightly wider than shoulder width and sit with thighs secured.',
      'Pull elbows down towards your ribs, touching bar to upper chest.',
      'Avoid swinging torso backward; let lats stretch fully at the top.'
    ]
  },
  {
    id: 'pull-ups',
    name: 'Pull Ups',
    aliases: ['pullups', 'pull up', 'chin ups', 'chin-ups'],
    category: 'Back',
    muscle: 'Lats, Rhomboids, Biceps, Forearms',
    equipment: 'Pull-up Bar',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Start from a dead hang with arms fully extended.',
      'Drive elbows down and back to pull chin over the bar.',
      'Lower under complete control for a 2-second negative.'
    ]
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    aliases: ['bent over row', 'bent over barbell row', 'bb row'],
    category: 'Back',
    muscle: 'Lats, Traps, Rhomboids, Posterior Deltoids',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Hinge at hips with flat back, torso angled around 45 degrees.',
      'Pull bar towards your belly button, leading with elbows.',
      'Squeeze shoulder blades together at top without jerking torso.'
    ]
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    aliases: ['conventional deadlift', 'barbell deadlift'],
    category: 'Back',
    muscle: 'Erector Spinae, Glutes, Hamstrings, Traps, Lats',
    equipment: 'Barbell & Weight Plates',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Stand with bar over mid-foot, feet hip-width apart.',
      'Grip bar, engage lats, take the slack out, and brace core tightly.',
      'Push the floor away through heels, locking out hips and knees together.'
    ]
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    aliases: ['cable row', 'seated row', 'low row'],
    category: 'Back',
    muscle: 'Mid-Back, Rhomboids, Lower Lats',
    equipment: 'Low Pulley Cable & V-Bar',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Sit tall with knees slightly bent; do not round lower back.',
      'Pull handle into lower abdomen while keeping chest high.',
      'Allow shoulders to stretch forward slightly at extension, then retract.'
    ]
  },
  {
    id: 't-bar-row',
    name: 'T-Bar Row',
    aliases: ['t bar row', 'tbar row'],
    category: 'Back',
    muscle: 'Mid Back Thickness, Lats, Trapezius',
    equipment: 'T-Bar Row Machine / Landmine',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Straddle the bar with knees bent and chest lifted.',
      'Pull weight towards upper abs, squeezing shoulder blades.',
      'Avoid standing up as weight rises; keep hip angle rigid.'
    ]
  },

  // SHOULDERS
  {
    id: 'overhead-shoulder-press',
    name: 'Overhead Shoulder Press',
    aliases: ['overhead press', 'military press', 'db shoulder press', 'shoulder press'],
    category: 'Shoulders',
    muscle: 'Anterior & Medial Deltoids, Triceps, Upper Chest',
    equipment: 'Barbell or Dumbbells',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Start with weights at shoulder height, elbows slightly in front of body.',
      'Press overhead in a straight line, locking elbows at the top.',
      'Brace core and glutes to avoid hyperextending lower spine.'
    ]
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    aliases: ['lateral raise', 'side lateral raise', 'side raises', 'lat raises'],
    category: 'Shoulders',
    muscle: 'Lateral Deltoids (Side Shoulders)',
    equipment: 'Dumbbells',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Hold dumbbells at sides with a slight forward torso lean.',
      'Raise arms out to sides until parallel to the floor, leading with elbows.',
      'Lower under control without swinging hips for momentum.'
    ]
  },
  {
    id: 'front-raise',
    name: 'Front Raise',
    aliases: ['dumbbell front raise', 'front raises'],
    category: 'Shoulders',
    muscle: 'Anterior (Front) Deltoids',
    equipment: 'Dumbbells or Cable',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Raise weights directly in front to eye level with arms straight.',
      'Pause briefly for a second at shoulder height.',
      'Control the descent to keep constant tension on front delts.'
    ]
  },
  {
    id: 'face-pull',
    name: 'Face Pull',
    aliases: ['cable face pull', 'face pulls'],
    category: 'Shoulders',
    muscle: 'Rear Delts, Rotator Cuff, Upper Traps',
    equipment: 'Cable Machine & Rope Attachment',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Set cable at eye level with rope attachment.',
      'Pull rope towards your nose, pulling hands apart and rotating thumbs back.',
      'Excellent for posture and protecting shoulder joints.'
    ]
  },
  {
    id: 'arnold-press',
    name: 'Arnold Press',
    aliases: ['arnold dumbbell press'],
    category: 'Shoulders',
    muscle: 'All 3 Deltoid Heads',
    equipment: 'Dumbbells & Bench',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Start with palms facing your chest like the top of a bicep curl.',
      'Rotate palms outward as you press weights up overhead.',
      'Reverse the rotation smoothly on the way down.'
    ]
  },

  // LEGS
  {
    id: 'barbell-squat',
    name: 'Barbell Squat',
    aliases: ['squats', 'squat', 'back squat', 'barbell back squat'],
    category: 'Legs',
    muscle: 'Quadriceps, Glutes, Adductors, Core',
    equipment: 'Barbell & Squat Rack',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Rest bar securely on upper traps, feet shoulder-width apart.',
      'Initiate by pushing hips back and knees out in line with toes.',
      'Descend until thighs are parallel to the ground, then drive up through mid-foot.'
    ]
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    aliases: ['machine leg press', '45 degree leg press'],
    category: 'Legs',
    muscle: 'Quadriceps, Glutes, Hamstrings',
    equipment: 'Leg Press Machine',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Place feet shoulder-width on sled; do not lock knees at top.',
      'Lower platform until knees are at 90 degrees without rounding lower back.',
      'Press through full foot surface under smooth control.'
    ]
  },
  {
    id: 'walking-lunges',
    name: 'Walking Lunges',
    aliases: ['lunges', 'dumbbell lunges', 'walking lunge'],
    category: 'Legs',
    muscle: 'Quads, Glutes, Hamstrings, Balance',
    equipment: 'Dumbbells or Bodyweight',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Step forward and lower back knee until 1 inch above floor.',
      'Keep front knee directly above ankle, torso upright.',
      'Push off front heel to step smoothly into next lunge.'
    ]
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    aliases: ['quad extension', 'machine leg extension'],
    category: 'Legs',
    muscle: 'Quadriceps Isolation',
    equipment: 'Leg Extension Machine',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Align knee joint with machine pivot axis.',
      'Extend legs until knees are straight, holding peak contraction for 1 sec.',
      'Resist weight on the descent to maximize muscle tension.'
    ]
  },
  {
    id: 'hamstring-curl',
    name: 'Hamstring Curl',
    aliases: ['leg curl', 'lying leg curl', 'seated leg curl'],
    category: 'Legs',
    muscle: 'Hamstrings (Biceps Femoris, Semitendinosus)',
    equipment: 'Leg Curl Machine',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Position pad just above heels against lower calves.',
      'Curl heels toward glutes as far as possible without lifting hips.',
      'Control the eccentric return over 2 to 3 seconds.'
    ]
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise',
    aliases: ['standing calf raise', 'seated calf raise', 'calf raises'],
    category: 'Legs',
    muscle: 'Gastrocnemius & Soleus (Calves)',
    equipment: 'Calf Machine or Dumbbells',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Lower heels below platform edge for a full deep calf stretch.',
      'Press high on balls of feet, rising onto big toes.',
      'Hold the peak squeeze at top for a full 2-second pause.'
    ]
  },

  // ARMS
  {
    id: 'barbell-bicep-curl',
    name: 'Barbell Bicep Curl',
    aliases: ['bicep curl', 'bicep curls', 'barbell curl', 'bb curl'],
    category: 'Arms',
    muscle: 'Biceps Brachii, Brachialis',
    equipment: 'Barbell or EZ-Curl Bar',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Pin elbows tightly to ribs; avoid swinging torso backward.',
      'Curl bar up toward shoulders while keeping upper arms vertical.',
      'Squeeze biceps hard at top and lower under strict control.'
    ]
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    aliases: ['dumbbell hammer curl', 'hammer curls'],
    category: 'Arms',
    muscle: 'Brachialis, Brachioradialis (Forearm & Arm Thickness)',
    equipment: 'Dumbbells',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Hold dumbbells with palms facing each other (neutral grip).',
      'Curl dumbbells up while maintaining thumbs-up hand orientation.',
      'Great for building arm width and forearm grip strength.'
    ]
  },
  {
    id: 'tricep-rope-pushdown',
    name: 'Tricep Rope Pushdown',
    aliases: ['tricep pushdown', 'cable pushdown', 'rope pushdown'],
    category: 'Arms',
    muscle: 'Triceps (Lateral and Long Head)',
    equipment: 'Cable Machine & Rope Attachment',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Keep elbows locked into sides and lean forward slightly.',
      'Push rope down and spread ends apart at bottom lockout.',
      'Allow forearms to rise up to 90 degrees before next rep.'
    ]
  },
  {
    id: 'skull-crushers',
    name: 'Skull Crushers',
    aliases: ['lying triceps extension', 'skull crusher', 'ez bar skull crusher'],
    category: 'Arms',
    muscle: 'Triceps Long Head',
    equipment: 'EZ Bar or Dumbbells & Flat Bench',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Hold bar over forehead with arms angled slightly backward.',
      'Bend elbows to lower bar towards crown of head/forehead.',
      'Extend forearms back to starting position without flaring elbows.'
    ]
  },
  {
    id: 'preacher-curl',
    name: 'Preacher Curl',
    aliases: ['ez bar preacher curl', 'machine preacher curl'],
    category: 'Arms',
    muscle: 'Short Head of Biceps (Peak)',
    equipment: 'Preacher Bench & Barbell',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Rest armpits snugly on top of preacher pad.',
      'Curl bar up without lifting elbows off the angled bench.',
      'Prevents cheating or shoulder involvement.'
    ]
  },

  // CORE
  {
    id: 'plank',
    name: 'Plank',
    aliases: ['forearm plank', 'core plank'],
    category: 'Core',
    muscle: 'Transverse Abdominis, Rectus Abdominis, Obliques',
    equipment: 'Exercise Mat',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Rest on forearms with elbows directly under shoulders.',
      'Squeeze glutes, quads, and draw belly button toward spine.',
      'Do not allow lower back to sag or hips to hike into a tent.'
    ]
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    aliases: ['leg raise', 'hanging knee raise', 'knee raises'],
    category: 'Core',
    muscle: 'Lower Abdominals, Hip Flexors',
    equipment: 'Pull-up Bar',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Hang from bar without swinging.',
      'Curl pelvis upward as you raise legs or knees toward chest.',
      'Lower legs slowly without using momentum.'
    ]
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    aliases: ['weighted russian twist', 'twists'],
    category: 'Core',
    muscle: 'Internal & External Obliques, Rotational Core',
    equipment: 'Medicine Ball, Dumbbell or Bodyweight',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Sit on floor with knees bent and feet elevated 3 inches.',
      'Lean back 45 degrees to engage core.',
      'Rotate torso side to side, touching weight to floor each side.'
    ]
  },

  // CARDIO
  {
    id: 'running-treadmill',
    name: 'Running / Treadmill',
    aliases: ['running', 'treadmill', 'jogging', 'jog'],
    category: 'Cardio',
    muscle: 'Cardiovascular System, Calves, Quads, Hamstrings',
    equipment: 'Treadmill or Outdoor Track',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Land lightly on mid-foot with a slight forward torso lean.',
      'Keep shoulders relaxed and arms swinging in sync.',
      'Maintain steady rhythmic breathing.'
    ]
  },
  {
    id: 'stationary-cycling',
    name: 'Stationary Cycling',
    aliases: ['cycling', 'spin bike', 'bike', 'stationary bike'],
    category: 'Cardio',
    muscle: 'Heart, Quadriceps, Glutes, Low-Impact Endurance',
    equipment: 'Stationary Spin Bike',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Adjust seat height so knee has a slight bend at lowest pedal position.',
      'Pedal in smooth circular strokes, pushing down and pulling up.',
      'Low impact on knees and joints.'
    ]
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    aliases: ['skipping', 'skipping rope'],
    category: 'Cardio',
    muscle: 'Calves, Coordination, High-Calorie Burn',
    equipment: 'Speed Jump Rope',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Turn rope with wrists rather than wide arm circles.',
      'Stay on the balls of your feet, jumping just 1-2 inches off floor.',
      'Land softly with slightly bent knees.'
    ]
  }
];

// Fallback category imagery if an exercise is custom/unmatched
export const CATEGORY_FALLBACK_IMAGES = {
  Chest: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
  Back: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&auto=format&fit=crop&q=80',
  Shoulders: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
  Legs: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
  Arms: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
  Core: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
  Cardio: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80',
  General: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80'
};

/**
 * Find matching exercise details from the database by partial name
 */
export const getExerciseDetails = (exerciseName) => {
  if (!exerciseName) return null;
  const clean = exerciseName.trim().toLowerCase();

  // 1. Exact match on name
  let match = EXERCISE_DATABASE.find(
    (e) => e.name.toLowerCase() === clean
  );
  if (match) return match;

  // 2. Match on aliases
  match = EXERCISE_DATABASE.find(
    (e) => e.aliases && e.aliases.some((a) => clean.includes(a) || a.includes(clean))
  );
  if (match) return match;

  // 3. Partial inclusion match
  match = EXERCISE_DATABASE.find(
    (e) => clean.includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(clean)
  );
  if (match) return match;

  // 4. Keyword heuristic
  if (clean.includes('bench') || clean.includes('chest') || clean.includes('pushup') || clean.includes('dip')) {
    return { ...EXERCISE_DATABASE[0], name: exerciseName };
  }
  if (clean.includes('squat') || clean.includes('leg') || clean.includes('lunge') || clean.includes('calf')) {
    return { ...EXERCISE_DATABASE.find(e => e.category === 'Legs'), name: exerciseName };
  }
  if (clean.includes('pull') || clean.includes('row') || clean.includes('deadlift') || clean.includes('lat')) {
    return { ...EXERCISE_DATABASE.find(e => e.category === 'Back'), name: exerciseName };
  }
  if (clean.includes('shoulder') || clean.includes('press') || clean.includes('lateral')) {
    return { ...EXERCISE_DATABASE.find(e => e.category === 'Shoulders'), name: exerciseName };
  }
  if (clean.includes('curl') || clean.includes('bicep') || clean.includes('tricep') || clean.includes('arm')) {
    return { ...EXERCISE_DATABASE.find(e => e.category === 'Arms'), name: exerciseName };
  }

  // Default fallback
  return {
    id: 'general',
    name: exerciseName,
    category: 'Workout',
    muscle: 'Full Body & Core',
    equipment: 'Gym Equipment',
    image: CATEGORY_FALLBACK_IMAGES.General,
    cues: [
      'Maintain smooth, controlled cadence on both lifting and lowering phases.',
      'Breathe out during exertion, breathe in as you reset.',
      'Keep core braced and spine neutral throughout all repetitions.'
    ]
  };
};
