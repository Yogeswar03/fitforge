// Comprehensive Exercise Database with animated GIFs, photos, target muscles, equipment, form cues, and common mistakes

export const EXERCISE_DATABASE = [
  // ==========================================
  // CHEST EXERCISES (Upper, Mid, Lower & Inner)
  // ==========================================
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    aliases: ['bench press', 'flat bench', 'barbell bench press', 'chest press', 'flat barbell bench'],
    category: 'Chest',
    subFocus: 'Overall Chest Mass & Power (Sternal Head)',
    muscle: 'Pectoralis Major (Mid Chest), Anterior Deltoids, Triceps',
    equipment: 'Barbell & Flat Bench',
    gif: 'https://media.giphy.com/media/26gJomDq8k24v9W8E/giphy.gif',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Pin shoulder blades together and drive them down into the bench.',
      'Grip the bar slightly wider than shoulder-width with wrists straight.',
      'Lower bar with control until it gently touches your mid-chest/nipple line.',
      'Press explosively upward while keeping elbows tucked at roughly 45 degrees.'
    ],
    mistakes: [
      'Flaring elbows 90 degrees out (damages shoulder joint)',
      'Bouncing barbell violently off the sternum',
      'Lifting your glutes/butt off the bench during heavy drive'
    ]
  },
  {
    id: 'incline-db-press',
    name: 'Incline Dumbbell Press',
    aliases: ['incline bench press', 'incline press', 'db incline', 'incline dumbbell press'],
    category: 'Chest',
    subFocus: 'Upper Chest (Clavicular Head)',
    muscle: 'Upper Chest (Clavicular Pectoral), Front Deltoids, Triceps',
    equipment: 'Dumbbells & Incline Bench (30° - 45°)',
    gif: 'https://media.giphy.com/media/MdRI2tmI5e7HX7P76U/giphy.gif',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Set bench to a 30-45 degree angle (too high shifts focus to shoulders).',
      'Start with dumbbells over chest with palms facing forward.',
      'Lower dumbbells slowly until upper arms are parallel to the floor.',
      'Press upward in a smooth arc without clanging the weights together at top.'
    ],
    mistakes: [
      'Setting bench angle too high (>45° turns it into a shoulder press)',
      'Banging dumbbells together at top (losses muscle tension)',
      'Dropping elbows too low and overstretching the shoulder joint'
    ]
  },
  {
    id: 'push-ups',
    name: 'Standard Push-Ups',
    aliases: ['pushups', 'push-up', 'push up', 'standard pushup'],
    category: 'Chest',
    subFocus: 'Chest Endurance & Core Stability',
    muscle: 'Pectoralis Major, Triceps Brachii, Core Stabilizers, Serratus',
    equipment: 'Bodyweight',
    gif: 'https://media.giphy.com/media/7YCC7PTNX2TOhJQ6aW/giphy.gif',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Maintain a rigid plank line from heels to head with core and glutes engaged.',
      'Place hands slightly wider than shoulder-width with fingers spread.',
      'Lower chest until approximately 2 inches off the ground.',
      'Push floor away firmly through palms, fully locking out arms at top.'
    ],
    mistakes: [
      'Sagging hips or hyperextending lower spine',
      'Flaring elbows out like a T-shape instead of an arrow shape',
      'Cheating reps by only nodding head without lowering chest'
    ]
  },
  {
    id: 'cable-crossover',
    name: 'Cable Crossover / Fly',
    aliases: ['cable fly', 'cable flyes', 'cable crossover fly', 'cable cross over'],
    category: 'Chest',
    subFocus: 'Inner Chest & Continuous Pectoral Tension',
    muscle: 'Inner & Outer Pectoralis Major, Sternal Head',
    equipment: 'Dual Cable Machine with Single Handles',
    gif: 'https://media.giphy.com/media/MdRI2tmI5e7HX7P76U/giphy.gif',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Take a staggered split stance with a slight forward torso lean.',
      'Keep a slight bend in elbows and lock that joint angle.',
      'Bring handles together across chest in a wide hugging movement.',
      'Squeeze pecs hard at center for 1 full second at peak contraction.'
    ],
    mistakes: [
      'Using excessive weight and turning the fly into a chest press',
      'Bending and straightening elbows during the motion',
      'Letting shoulders shrug up toward ears during the stretch'
    ]
  },
  {
    id: 'chest-dips',
    name: 'Chest Dips',
    aliases: ['dips', 'parallel bar dips', 'bodyweight dips'],
    category: 'Chest',
    subFocus: 'Lower Chest & Outer Pec Flare',
    muscle: 'Lower Pectorals (Abdominal Head), Anterior Deltoids, Triceps',
    equipment: 'Parallel Dip Station',
    gif: 'https://media.giphy.com/media/3o7TKMGpxxHOGTazFS/giphy.gif',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Lean your torso forward at a 30-degree angle to place tension on chest.',
      'Bend knees and cross ankles to prevent swinging.',
      'Lower body until shoulders are just below elbows (90 degree bend).',
      'Drive straight up through palms while maintaining the forward torso lean.'
    ],
    mistakes: [
      'Staying completely upright (this shifts all tension to triceps)',
      'Shrugging shoulders near ears instead of keeping scapulae depressed',
      'Dropping too deep without proper shoulder mobility'
    ]
  },
  {
    id: 'pec-deck-fly',
    name: 'Pec Deck Machine Fly',
    aliases: ['pec deck', 'machine fly', 'butterfly', 'seated fly machine'],
    category: 'Chest',
    subFocus: 'Pectoral Isolation & Deep Stretch',
    muscle: 'Pectoralis Major (Isolation)',
    equipment: 'Pec Deck / Butterfly Machine',
    gif: 'https://media.giphy.com/media/26gJomDq8k24v9W8E/giphy.gif',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Adjust seat height so handles align directly with your mid-chest.',
      'Keep elbows softly bent and rigid throughout the whole range of motion.',
      'Bring pads/handles together, squeezing your chest firmly at the center.',
      'Control the eccentric return slowly to feel a deep chest stretch.'
    ],
    mistakes: [
      'Setting seat too low or high causing shoulder impingement',
      'Letting weights slam on the stack between repetitions',
      'Rounding shoulders forward as you bring hands together'
    ]
  },
  {
    id: 'decline-bench-press',
    name: 'Decline Bench Press',
    aliases: ['decline press', 'decline db press', 'decline barbell press'],
    category: 'Chest',
    subFocus: 'Lower Chest Line & Cut',
    muscle: 'Lower Pectoralis Major, Triceps',
    equipment: 'Decline Bench & Barbell or Dumbbells',
    gif: 'https://media.giphy.com/media/26gJomDq8k24v9W8E/giphy.gif',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Hook legs securely into the decline bench pads.',
      'Lower weight with control directly to the lower chest line.',
      'Press straight up to lockout, maintaining scapular retraction.'
    ],
    mistakes: [
      'Failing to anchor legs securely',
      'Lowering the bar too high toward neck',
      'Lifting weight too fast and losing bar path'
    ]
  },
  {
    id: 'dumbbell-pullover',
    name: 'Dumbbell Pullover',
    aliases: ['pullover', 'db pullover', 'chest pullover'],
    category: 'Chest',
    subFocus: 'Chest Expansion & Serratus Anterior',
    muscle: 'Pectoralis Major (Sternal Head), Serratus Anterior, Lats',
    equipment: 'Flat Bench & Single Dumbbell',
    gif: 'https://media.giphy.com/media/MdRI2tmI5e7HX7P76U/giphy.gif',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Lie perpendicular across a flat bench with upper back supported.',
      'Hold dumbbell with both hands forming a diamond under the top plate.',
      'Lower dumbbell in an arc behind head while keeping hips slightly low.',
      'Pull dumbbell back over chest using your chest and serratus muscles.'
    ],
    mistakes: [
      'Bending elbows too much (turns into a skull crusher)',
      'Lifting hips excessively high during stretch',
      'Over-extending beyond safe shoulder range'
    ]
  },

  // ==========================================
  // BACK EXERCISES
  // ==========================================
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    aliases: ['pulldown', 'lat pull down', 'cable pulldown'],
    category: 'Back',
    subFocus: 'V-Taper Back Width',
    muscle: 'Latissimus Dorsi, Biceps, Rhomboids, Lower Traps',
    equipment: 'Lat Pulldown Cable Machine',
    gif: 'https://media.giphy.com/media/26gJomDq8k24v9W8E/giphy.gif',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Grip bar slightly wider than shoulder width and anchor thighs firmly.',
      'Lean back very slightly (10-15 degrees) and draw chest upward.',
      'Pull elbows down and back toward ribs until bar reaches upper chest.',
      'Resist weight on way up for a full lat stretch at top.'
    ],
    mistakes: [
      'Swinging torso violently backward like a rowing motion',
      'Pulling bar behind the neck (dangerous for cervical spine)',
      'Using biceps rather than initiating pull with lats'
    ]
  },
  {
    id: 'pull-ups',
    name: 'Wide-Grip Pull Ups',
    aliases: ['pullups', 'pull up', 'chin ups', 'chin-ups'],
    category: 'Back',
    subFocus: 'Upper Lat Width & Upper Body Power',
    muscle: 'Lats, Rhomboids, Biceps, Forearm Grip',
    equipment: 'Pull-up Bar',
    gif: 'https://media.giphy.com/media/7YCC7PTNX2TOhJQ6aW/giphy.gif',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Start from a dead hang with arms fully extended.',
      'Depress scapulae, then pull elbows down to lift chin over bar.',
      'Lower under complete control for a full 2-second eccentric drop.'
    ],
    mistakes: [
      'Kicking legs or kipping body for momentum',
      'Not dropping down to full arm extension (half reps)',
      'Reaching chin up without pulling chest to bar'
    ]
  },
  {
    id: 'barbell-row',
    name: 'Bent-Over Barbell Row',
    aliases: ['bent over row', 'bent over barbell row', 'bb row'],
    category: 'Back',
    subFocus: 'Back Thickness & Mid-Back Density',
    muscle: 'Lats, Rhomboids, Middle & Lower Trapezius, Rear Delts',
    equipment: 'Barbell & Weight Plates',
    gif: 'https://media.giphy.com/media/26gJomDq8k24v9W8E/giphy.gif',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Hinge at hips with flat back, torso angled around 45 degrees.',
      'Pull bar smoothly towards your belly button, leading with elbows.',
      'Squeeze shoulder blades together firmly at top of pull.'
    ],
    mistakes: [
      'Rounding lower back (dangerous spinal flexion under load)',
      'Standing too upright and turning it into a shrug',
      'Using leg jerk momentum to heave the bar'
    ]
  },
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    aliases: ['conventional deadlift', 'barbell deadlift', 'deadlift'],
    category: 'Back',
    subFocus: 'Full Posterior Chain & Core Power',
    muscle: 'Erector Spinae, Glutes, Hamstrings, Lats, Traps',
    equipment: 'Barbell & Weight Plates',
    gif: 'https://media.giphy.com/media/26gJomDq8k24v9W8E/giphy.gif',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Stand with bar over mid-foot, feet hip-width apart.',
      'Grip bar, engage lats, pull the slack out, and brace abdominal wall.',
      'Push floor away through heels, locking hips and knees synchronously.'
    ],
    mistakes: [
      'Rounding lumbar spine during initial lift off',
      'Hyperextending and leaning backwards at lockout',
      'Letting barbell drift away from shins during ascent'
    ]
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    aliases: ['cable row', 'seated row', 'low row'],
    category: 'Back',
    subFocus: 'Mid-Back Thickness & Lower Lats',
    muscle: 'Mid-Back, Rhomboids, Lower Lats, Biceps',
    equipment: 'Low Pulley Cable & V-Bar Handle',
    gif: 'https://media.giphy.com/media/MdRI2tmI5e7HX7P76U/giphy.gif',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Sit tall with knees slightly bent; never round your lower back.',
      'Pull handle into lower abdomen while puffing chest out.',
      'Squeeze shoulder blades together and pause briefly.'
    ],
    mistakes: [
      'Excessive backward torso swinging',
      'Shrugging shoulders into ears',
      'Pulling handle too high into upper chest'
    ]
  },

  // ==========================================
  // SHOULDERS EXERCISES
  // ==========================================
  {
    id: 'overhead-shoulder-press',
    name: 'Overhead Shoulder Press',
    aliases: ['overhead press', 'military press', 'db shoulder press', 'shoulder press', 'overhead db press'],
    category: 'Shoulders',
    subFocus: 'Overall Shoulder Size & Front Delts',
    muscle: 'Anterior & Medial Deltoids, Triceps, Upper Pecs',
    equipment: 'Dumbbells or Barbell',
    gif: 'https://media.giphy.com/media/MdRI2tmI5e7HX7P76U/giphy.gif',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Start with weights at shoulder height with elbows slightly in front.',
      'Press directly overhead in a straight line to full arm lockout.',
      'Keep glutes and abs locked tight to protect lower back.'
    ],
    mistakes: [
      'Excessively arching lower back to push heavier weights',
      'Flaring elbows out to extreme sides during press',
      'Not locking out overhead'
    ]
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    aliases: ['lateral raise', 'side lateral raise', 'side raises', 'lat raises'],
    category: 'Shoulders',
    subFocus: 'Boulder Shoulder Width (Side Delts)',
    muscle: 'Lateral (Side) Deltoids',
    equipment: 'Dumbbells',
    gif: 'https://media.giphy.com/media/MdRI2tmI5e7HX7P76U/giphy.gif',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Stand with feet hip-width apart and a slight 10° forward lean.',
      'Raise arms out to sides until parallel to ground, leading with elbows.',
      'Pour water motion at top with pinkies slightly higher than thumbs.'
    ],
    mistakes: [
      'Swinging hips or knees to heave dumbbells up',
      'Raising weights way above shoulder level into traps',
      'Using weights that are too heavy for strict deltoid isolation'
    ]
  },
  {
    id: 'face-pull',
    name: 'Cable Face Pull',
    aliases: ['cable face pull', 'face pulls', 'face pull'],
    category: 'Shoulders',
    subFocus: 'Rear Delts & Rotator Cuff Health',
    muscle: 'Posterior (Rear) Deltoids, Infraspinatus, Trapezius',
    equipment: 'Cable Machine & Rope Attachment',
    gif: 'https://media.giphy.com/media/26gJomDq8k24v9W8E/giphy.gif',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Set cable at eye level with rope attachment.',
      'Pull rope towards bridge of nose, pulling hands apart laterally.',
      'Externally rotate shoulders so thumbs point backward at end of rep.'
    ],
    mistakes: [
      'Pulling too low into chin instead of forehead/nose',
      'Letting shoulders roll forward internally',
      'Using body momentum rather than upper back retraction'
    ]
  },

  // ==========================================
  // LEGS EXERCISES
  // ==========================================
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    aliases: ['squats', 'squat', 'back squat', 'barbell back squat'],
    category: 'Legs',
    subFocus: 'Quad & Glute Power & Leg Mass',
    muscle: 'Quadriceps, Gluteus Maximus, Hamstrings, Core',
    equipment: 'Barbell & Squat Rack',
    gif: 'https://media.giphy.com/media/fYHUeuuuFa3VFBOLzA/giphy.gif',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Rest bar comfortably on upper traps; feet shoulder-width, toes turned out 15°.',
      'Push hips back and bend knees, tracking knees outward over toes.',
      'Descend until hip crease is below parallel, then drive up through mid-foot.'
    ],
    mistakes: [
      'Knees caving inward (valgus collapse)',
      'Heels lifting off the ground during descent',
      'Rounding lower spine at the bottom (butt wink)'
    ]
  },
  {
    id: 'walking-lunges',
    name: 'Walking Lunges',
    aliases: ['lunges', 'dumbbell lunges', 'walking lunge'],
    category: 'Legs',
    subFocus: 'Glute & Quad Isolation, Unilateral Balance',
    muscle: 'Glutes, Quads, Hamstrings, Hip Stabilizers',
    equipment: 'Dumbbells or Bodyweight',
    gif: 'https://media.giphy.com/media/cXHxOJu8vEwhoApxjy/giphy.gif',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Take a long step forward and lower back knee until 1 inch off floor.',
      'Front shin should remain vertical with front knee over ankle.',
      'Drive up through front heel to step fluidly into next stride.'
    ],
    mistakes: [
      'Taking steps that are too short and overloading knee tendon',
      'Leaning torso drastically forward',
      'Banging back kneecap against the hard floor'
    ]
  },
  {
    id: 'calf-raise',
    name: 'Calf Raises',
    aliases: ['standing calf raise', 'seated calf raise', 'calf raises', 'calf raise'],
    category: 'Legs',
    subFocus: 'Calf Density & Ankle Strength',
    muscle: 'Gastrocnemius & Soleus',
    equipment: 'Calf Block / Dumbbells',
    gif: 'https://media.giphy.com/media/2wXXVCek2NfkneGqz9/giphy.gif',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Lower heels below platform edge for a full 2-second deep stretch.',
      'Drive up high onto the balls of your big toes.',
      'Hold the top contraction for a solid 2-second squeeze.'
    ],
    mistakes: [
      'Bouncing rapidly at bottom without pausing (uses Achilles tendon bounce)',
      'Rolling weight onto outside edges of pinky toes',
      'Bending knees to initiate movement'
    ]
  },

  // ==========================================
  // ARMS EXERCISES
  // ==========================================
  {
    id: 'barbell-bicep-curl',
    name: 'Barbell Bicep Curl',
    aliases: ['bicep curl', 'bicep curls', 'barbell curl', 'bb curl', 'curls'],
    category: 'Arms',
    subFocus: 'Bicep Peak & Overall Arm Mass',
    muscle: 'Biceps Brachii (Short & Long Head), Brachialis',
    equipment: 'Barbell or EZ-Curl Bar',
    gif: 'https://media.giphy.com/media/8xomIW1Nx983bM9RRg/giphy.gif',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Lock elbows into sides of ribs and stand with upright posture.',
      'Curl weight upward toward shoulders without swinging hips.',
      'Squeeze biceps violently at peak, then lower under a 3-second negative.'
    ],
    mistakes: [
      'Swinging upper body backward to throw the weight up',
      'Letting elbows drift forward in front of shoulders',
      'Dropping bar quickly on the negative without tension'
    ]
  },
  {
    id: 'tricep-rope-pushdown',
    name: 'Tricep Rope Pushdown',
    aliases: ['tricep pushdown', 'cable pushdown', 'rope pushdown'],
    category: 'Arms',
    subFocus: 'Tricep Horseshoe & Lockout Power',
    muscle: 'Triceps Brachii (Lateral, Medial & Long Head)',
    equipment: 'Cable Machine & Rope Attachment',
    gif: 'https://media.giphy.com/media/3o7TKMGpxxHOGTazFS/giphy.gif',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Pin elbows firmly at side of ribs with a slight 15° forward lean.',
      'Push rope down until arms lock out completely.',
      'Spread ends of the rope outward at bottom for maximum contraction.'
    ],
    mistakes: [
      'Allowing elbows to flare outward or travel up and down',
      'Using bodyweight momentum to press the cable down',
      'Not locking out completely at bottom'
    ]
  },

  // ==========================================
  // CORE & ABS EXERCISES
  // ==========================================
  {
    id: 'plank',
    name: 'Forearm Core Plank',
    aliases: ['forearm plank', 'core plank', 'plank'],
    category: 'Core',
    subFocus: 'Isometric Abdominal Endurance',
    muscle: 'Transverse Abdominis, Rectus Abdominis, Obliques',
    equipment: 'Exercise Mat',
    gif: 'https://media.giphy.com/media/39wjDz1y3UI51qgv4K/giphy.gif',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
    cues: [
      'Rest on forearms with elbows directly beneath shoulder joints.',
      'Squeeze glutes, tighten quads, and draw navel toward spine.',
      'Keep head in line with spine looking at floor.'
    ],
    mistakes: [
      'Sagging hips towards floor (strains lower back)',
      'Hiking hips high in the air into an inverted V',
      'Holding breath instead of deep diaphragmatic breathing'
    ]
  }
];

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
  if (clean.includes('bench') || clean.includes('chest') || clean.includes('pushup') || clean.includes('dip') || clean.includes('pec')) {
    return { ...EXERCISE_DATABASE[0], name: exerciseName };
  }
  if (clean.includes('squat') || clean.includes('leg') || clean.includes('lunge') || clean.includes('calf')) {
    return { ...EXERCISE_DATABASE.find(e => e.category === 'Legs') || EXERCISE_DATABASE[0], name: exerciseName };
  }
  if (clean.includes('pull') || clean.includes('row') || clean.includes('deadlift') || clean.includes('lat')) {
    return { ...EXERCISE_DATABASE.find(e => e.category === 'Back') || EXERCISE_DATABASE[0], name: exerciseName };
  }
  if (clean.includes('shoulder') || clean.includes('press') || clean.includes('lateral')) {
    return { ...EXERCISE_DATABASE.find(e => e.category === 'Shoulders') || EXERCISE_DATABASE[0], name: exerciseName };
  }
  if (clean.includes('curl') || clean.includes('bicep') || clean.includes('tricep') || clean.includes('arm')) {
    return { ...EXERCISE_DATABASE.find(e => e.category === 'Arms') || EXERCISE_DATABASE[0], name: exerciseName };
  }

  // Default fallback
  return {
    id: 'general',
    name: exerciseName,
    category: 'Workout',
    subFocus: 'Full Body Conditioning',
    muscle: 'Full Body & Core',
    equipment: 'Gym Equipment',
    gif: 'https://media.giphy.com/media/26gJomDq8k24v9W8E/giphy.gif',
    image: CATEGORY_FALLBACK_IMAGES.General,
    cues: [
      'Maintain smooth, controlled cadence on both lifting and lowering phases.',
      'Breathe out during exertion, breathe in as you reset.',
      'Keep core braced and spine neutral throughout all repetitions.'
    ],
    mistakes: [
      'Rushing the movement and losing control of the weight',
      'Failing to brace core and breath properly'
    ]
  };
};
