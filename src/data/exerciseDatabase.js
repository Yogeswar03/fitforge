// Comprehensive Exercise Database with animated GIFs, photos, target muscles, equipment, form cues, and common mistakes

export const WORKOUT_CATEGORIES = [
  {
    id: 'Full Body',
    name: 'Full Body Workout',
    count: 7,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    description: 'Compound multi-joint power and full metabolic conditioning'
  },
  {
    id: 'Glutes',
    name: 'Butt Workout',
    count: 5,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    description: 'Targeted glute shaping, hip thrusts, and posterior power'
  },
  {
    id: 'Chest',
    name: 'Chest Workout',
    count: 5,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    description: 'Incline, flat, fly, and pullover movements for complete pecs'
  },
  {
    id: 'Back',
    name: 'Back Workout',
    count: 6,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&auto=format&fit=crop&q=80',
    description: 'Lat pulldowns, rows, deadlifts, and wide V-taper density'
  },
  {
    id: 'Shoulders',
    name: 'Shoulder Workout',
    count: 5,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    description: 'Overhead presses, lateral raises, and 3D round deltoids'
  },
  {
    id: 'Biceps',
    name: 'Biceps Workout',
    count: 4,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    description: 'Dumbbell curls, preacher curls, and bicep peak development'
  },
  {
    id: 'Triceps',
    name: 'Triceps Workout',
    count: 4,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    description: 'Cable pushdowns, dips, skull crushers, and arm mass'
  },
  {
    id: 'Legs',
    name: 'Legs Workout',
    count: 6,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    description: 'Barbell squats, leg press, walking lunges, and calves'
  },
  {
    id: 'Core',
    name: 'Abs Workout',
    count: 6,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
    heroImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    description: 'Wipers, planks, leg raises, and rock-hard six-pack core'
  }
];

export const EXERCISE_DATABASE = [
  // ==========================================
  // CHEST EXERCISES (Matching Screenshot 4)
  // ==========================================
  {
    id: 'incline-bench-press-dumbbell',
    name: 'Incline Bench Press* Dumbbell',
    aliases: ['incline bench press', 'incline press', 'db incline', 'incline dumbbell press'],
    category: 'Chest',
    subFocus: 'Upper Chest (Clavicular Head)',
    muscle: 'Upper Chest (Clavicular Pectoral), Front Deltoids, Triceps',
    focusAreas: ['Chest', 'Shoulders', 'Triceps'],
    equipment: 'Dumbbell',
    defaultSetsReps: '4 Sets × 8 reps',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
    preparation: 'Set bench to a 30-45 degree incline. Lie back with dumbbells rested on knees, then kick them up to shoulder level with elbows beneath wrists.',
    execution: [
      'Inhale and lower dumbbells smoothly until upper arms form a 45-degree angle to torso.',
      'Pause for a brief instant at bottom stretch without letting elbows drop too deep.',
      'Exhale and press weights upward in a slight arc toward center without clanging weights.'
    ],
    keyTips: [
      'Do not set bench angle too high (>45 degrees shifts work into front shoulders).',
      'Keep shoulder blades tightly pinched and pushed down into bench.',
      'Maintain feet firmly planted on the floor for leg drive stability.',
      'Control the 2-second negative eccentric descent.'
    ]
  },
  {
    id: 'bench-fly-dumbbell',
    name: 'Bench Fly* Dumbbell',
    aliases: ['bench fly', 'dumbbell fly', 'db fly', 'flat dumbbell fly'],
    category: 'Chest',
    subFocus: 'Inner & Outer Pectoral Stretch & Squeeze',
    muscle: 'Pectoralis Major (Sternal Head), Anterior Deltoids',
    focusAreas: ['Chest', 'Shoulders'],
    equipment: 'Dumbbell',
    defaultSetsReps: '4 Sets × 8 reps',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    preparation: 'Lie flat on a bench holding dumbbells directly over mid-chest with palms facing each other and elbows slightly bent.',
    execution: [
      'Lower dumbbells in a wide hugging arc until you feel a deep, comfortable stretch in your pecs.',
      'Keep the elbow bend angle completely locked throughout the repetition.',
      'Squeeze chest muscles hard to bring weights back together at the top.'
    ],
    keyTips: [
      'Do not bend elbows too much; that turns the fly into a press.',
      'Lower weights under strict control; never drop abruptly.',
      'Stop when elbows reach bench level to protect rotator cuffs.',
      'Focus mental attention on squeezing the inner pectoral cleavage.'
    ]
  },
  {
    id: 'pullover-dumbbell',
    name: 'Pullover* Dumbbell',
    aliases: ['pullover', 'db pullover', 'dumbbell pullover', 'chest pullover'],
    category: 'Chest',
    subFocus: 'Ribcage Expansion & Serratus Anterior',
    muscle: 'Pectoralis Major (Lower/Sternal), Serratus Anterior, Lats',
    focusAreas: ['Chest', 'Back'],
    equipment: 'Dumbbell',
    defaultSetsReps: '4 Sets × 8 reps',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    preparation: 'Lie perpendicular across a flat bench with your upper back supported and hips held slightly below bench height. Hold one dumbbell with both hands forming a diamond under top plate.',
    execution: [
      'Inhale deeply and lower the dumbbell in a smooth arc backward behind head.',
      'Feel the deep stretch across your chest, serratus, and ribcage.',
      'Pull the dumbbell back over your chest while contracting your pecs.'
    ],
    keyTips: [
      'Keep elbows softly bent and locked in position throughout.',
      'Do not lift hips excessively high during stretch.',
      'Inhale on the stretch to maximize chest cavity expansion.',
      'Stop when arms align roughly with torso to protect shoulders.'
    ]
  },
  {
    id: 'decline-bench-press-dumbbell',
    name: 'Decline Bench Press* Dumbbell',
    aliases: ['decline bench press', 'decline press', 'decline db press'],
    category: 'Chest',
    subFocus: 'Lower Chest Underline & Power',
    muscle: 'Lower Pectoralis Major, Triceps Brachii, Front Delts',
    focusAreas: ['Chest', 'Triceps'],
    equipment: 'Dumbbell',
    defaultSetsReps: '4 Sets × 8 reps',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
    preparation: 'Hook legs securely into the decline bench pads. Lie back holding dumbbells at lower chest level with palms facing forward.',
    execution: [
      'Press dumbbells straight up above lower chest until arms are locked out.',
      'Lower weights with control along a slight angle toward lower chest line.',
      'Push smoothly back up through palms while maintaining retracted scapulae.'
    ],
    keyTips: [
      'Always secure your shins in leg pads before handling weights.',
      'Lower weights directly to lower chest line, not toward neck.',
      'Maintain steady breathing: exhale on the press, inhale on descent.',
      'Keep wrists straight and rigid throughout.'
    ]
  },
  {
    id: 'push-up-band',
    name: 'Push-up* Band',
    aliases: ['push-up', 'pushup', 'band pushup', 'resisted push up'],
    category: 'Chest',
    subFocus: 'Chest Explosive Power & Lockout Strength',
    muscle: 'Pectoralis Major, Triceps Brachii, Deltoids, Core',
    focusAreas: ['Chest', 'Triceps', 'Shoulders'],
    equipment: 'Band',
    defaultSetsReps: '4 Sets × 8 reps',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&auto=format&fit=crop&q=80',
    preparation: 'Loop a resistance band across your upper back and secure ends beneath both palms. Assume a rigid plank position with hands slightly wider than shoulder-width.',
    execution: [
      'Inhale and lower chest with control until it is about 1-2 inches above floor.',
      'Keep elbows tucked at a 45-degree arrow angle relative to torso.',
      'Drive powerfully upward against the band resistance to full arm lockout.'
    ],
    keyTips: [
      'Do not let your hips sag or arch your lower spine.',
      'Keep your neck neutral looking slightly ahead of hands.',
      'The resistance band peaks at lockout—squeeze triceps and chest hard at top.',
      'Keep your core and glutes tightly engaged the whole set.'
    ]
  },

  // ==========================================
  // ABS / CORE EXERCISES (Matching Screenshot 3)
  // ==========================================
  {
    id: 'wipers',
    name: 'Wipers',
    aliases: ['windshield wipers', 'floor wipers', 'wiper', 'abs wipers'],
    category: 'Core',
    subFocus: 'Rotational Oblique Power & Deep Abdominal Core',
    muscle: 'Rectus Abdominis, External & Internal Obliques, Hip Flexors',
    focusAreas: ['Abs'],
    equipment: 'Body weight',
    defaultSetsReps: '3 Sets × 12 reps',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
    preparation: 'Lie on the floor with arms stretched to your sides to stabilize your body. Lift your legs straight together off the ground until they are vertical to the floor.',
    execution: [
      'Twist your legs to one side while keeping your upper body in place and your knees and feet together.',
      'Pause for a few seconds and return to the starting position slowly.',
      'Complete alternating between left and right.'
    ],
    keyTips: [
      'Do not let your legs bounce on the floor to assist the movement.',
      'Keep your legs straight and together throughout the movement.',
      'To add difficulty, keep your legs straight.',
      'Keep a braced core during the exercise.'
    ]
  },
  {
    id: 'plank',
    name: 'Core Plank',
    aliases: ['plank', 'forearm plank', 'front plank'],
    category: 'Core',
    subFocus: 'Isometric Core Bracing & Spinal Stability',
    muscle: 'Transverse Abdominis, Rectus Abdominis, Glutes, Deltoids',
    focusAreas: ['Abs'],
    equipment: 'Body weight',
    defaultSetsReps: '3 Sets × 45 sec',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
    preparation: 'Place forearms on the floor with elbows directly under shoulders. Step feet back hip-width apart on toes.',
    execution: [
      'Engage glutes and pull belly button up toward spine.',
      'Form an unbroken straight line from heels through hips to ears.',
      'Hold position with steady diaphragm breathing for prescribed time.'
    ],
    keyTips: [
      'Do not let hips sag toward floor (compresses lower back).',
      'Do not pike hips high into the air.',
      'Actively press forearms into floor to dome upper back slightly.',
      'Squeeze glutes hard to lock pelvis in neutral posture.'
    ]
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    aliases: ['leg raise', 'hanging leg raises', 'captain chair leg raise'],
    category: 'Core',
    subFocus: 'Lower Abdominal Compression & Grip Endurance',
    muscle: 'Lower Rectus Abdominis, Hip Flexors, Forearms',
    focusAreas: ['Abs'],
    equipment: 'Body weight',
    defaultSetsReps: '3 Sets × 12 reps',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
    preparation: 'Hang from a pull-up bar with overhand grip and arms fully extended with shoulders packed down.',
    execution: [
      'Tilt pelvis backward and raise legs upward until parallel to floor or higher.',
      'Pause for 1 second at top contraction.',
      'Lower legs slowly with control without swinging your body.'
    ],
    keyTips: [
      'Do not swing torso or use momentum.',
      'Focus on curling your pelvis upward, not just lifting legs.',
      'Keep legs as straight as comfortable for maximum leverage.',
      'Inhale as you lower, exhale forcefully as legs rise.'
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
    subFocus: 'V-Taper Back Width & Upper Lats',
    muscle: 'Latissimus Dorsi, Biceps, Rhomboids, Lower Traps',
    focusAreas: ['Back', 'Biceps'],
    equipment: 'Cable Machine',
    defaultSetsReps: '4 Sets × 10 reps',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&auto=format&fit=crop&q=80',
    preparation: 'Sit at pulldown station with thighs snugly pinned under roller pads. Grip bar wider than shoulder-width with palms facing forward.',
    execution: [
      'Lean back slightly (10-15 degrees) with chest lifted.',
      'Pull bar down smoothly toward upper chest, driving elbows downward and back.',
      'Squeeze lats firmly at bottom, then resist weight back to full stretch at top.'
    ],
    keyTips: [
      'Do not swing torso aggressively backward for momentum.',
      'Never pull bar behind your neck.',
      'Lead pull with elbows, not by pulling with forearms/hands.',
      'Let lats fully stretch at the very top of each rep.'
    ]
  },
  {
    id: 'pull-ups',
    name: 'Wide-Grip Pull Ups',
    aliases: ['pullups', 'pull up', 'chin ups'],
    category: 'Back',
    subFocus: 'Back Width & Relative Bodyweight Power',
    muscle: 'Lats, Rhomboids, Biceps, Forearm Grip',
    focusAreas: ['Back', 'Biceps'],
    equipment: 'Body weight',
    defaultSetsReps: '3 Sets × 8 reps',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&auto=format&fit=crop&q=80',
    preparation: 'Take an overhand grip slightly wider than shoulder width from a dead hang position.',
    execution: [
      'Pull shoulder blades down and back, then pull chest toward bar.',
      'Clear bar with chin and hold peak squeeze for half a second.',
      'Lower under complete control back to full dead hang.'
    ],
    keyTips: [
      'Avoid kipping or kicking legs to generate momentum.',
      'Ensure full arm extension at bottom for maximum lat elongation.',
      'Drive elbows down toward waistline rather than pulling with wrists.'
    ]
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    aliases: ['cable row', 'seated row', 'low row'],
    category: 'Back',
    subFocus: 'Mid-Back Thickness & Rhomboids',
    muscle: 'Rhomboids, Lats, Middle Trapezius, Biceps',
    focusAreas: ['Back', 'Biceps'],
    equipment: 'Cable Machine',
    defaultSetsReps: '4 Sets × 10 reps',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&auto=format&fit=crop&q=80',
    preparation: 'Sit with feet braced against footrests and knees softly bent. Grasp V-bar handle with arms outstretched and back straight.',
    execution: [
      'Pull handle toward navel while pulling chest up and shoulders back.',
      'Pinch shoulder blades hard together at completion.',
      'Extend arms slowly back to initial stretch without rounding lower back.'
    ],
    keyTips: [
      'Keep torso upright throughout; avoid rocking backward and forward.',
      'Keep elbows close to sides rather than flared high.',
      'Do not shrug shoulders into ears during contraction.'
    ]
  },

  // ==========================================
  // BUTT / GLUTES EXERCISES
  // ==========================================
  {
    id: 'barbell-hip-thrust',
    name: 'Barbell Hip Thrust',
    aliases: ['hip thrust', 'glute thrust', 'bb hip thrust'],
    category: 'Glutes',
    subFocus: 'Maximum Gluteus Maximus Contraction & Mass',
    muscle: 'Gluteus Maximus, Hamstrings, Core Stabilizers',
    focusAreas: ['Glutes', 'Hamstrings'],
    equipment: 'Barbell',
    defaultSetsReps: '4 Sets × 10 reps',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    preparation: 'Rest upper back against bench edge with a padded barbell across hips. Plant feet shoulder-width apart flat on floor.',
    execution: [
      'Drive hips upward through heels until knees, hips, and shoulders form a straight line.',
      'Squeeze glutes maximally at top with chin tucked looking forward.',
      'Lower hips slowly until just above floor and repeat.'
    ],
    keyTips: [
      'Do not arch lower back at top; achieve lockout by rotating pelvis.',
      'Keep chin tucked toward chest throughout movement.',
      'Drive hard through heels rather than balls of feet.',
      'Pause 1 full second at peak hip lockout on every rep.'
    ]
  },
  {
    id: 'cable-glute-kickback',
    name: 'Cable Glute Kickback',
    aliases: ['kickback', 'cable kickback', 'glute kickback'],
    category: 'Glutes',
    subFocus: 'Upper Glute Isolation & Shaping',
    muscle: 'Gluteus Maximus, Gluteus Medius',
    focusAreas: ['Glutes'],
    equipment: 'Cable Machine',
    defaultSetsReps: '3 Sets × 15 reps',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    preparation: 'Attach ankle strap to low cable pulley. Face the machine with hands gripping post for balance and slight forward torso lean.',
    execution: [
      'Kick working leg straight backward and upward using pure glute contraction.',
      'Hold peak contraction for 1 second at top.',
      'Return foot slowly to start under cable tension.'
    ],
    keyTips: [
      'Do not hyperextend lower spine to swing weight higher.',
      'Initiate and finish every rep with glute squeezing.',
      'Keep core braced to lock pelvis steady.'
    ]
  },

  // ==========================================
  // SHOULDERS EXERCISES
  // ==========================================
  {
    id: 'overhead-shoulder-press',
    name: 'Overhead Dumbbell Press',
    aliases: ['overhead press', 'db shoulder press', 'shoulder press', 'overhead press* dumbbell'],
    category: 'Shoulders',
    subFocus: 'Front & Medial Deltoid Thickness',
    muscle: 'Anterior & Medial Deltoids, Triceps, Upper Traps',
    focusAreas: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbell',
    defaultSetsReps: '4 Sets × 8 reps',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    preparation: 'Sit or stand upright holding dumbbells at shoulder level with elbows at roughly 75 degrees forward.',
    execution: [
      'Press dumbbells straight overhead in a smooth arc until arms are extended.',
      'Pause for an instant without banging weights together.',
      'Lower under control to chin/shoulder level.'
    ],
    keyTips: [
      'Do not arch lower back excessively to heave weight.',
      'Keep core braced and ribs pulled down.',
      'Lower dumbbells all the way to ear level for full range of motion.'
    ]
  },
  {
    id: 'lateral-raises',
    name: 'Dumbbell Lateral Raises',
    aliases: ['lateral raise', 'side lateral raise', 'side raises'],
    category: 'Shoulders',
    subFocus: 'Side Deltoid Width & V-Taper Frame',
    muscle: 'Lateral (Medial) Deltoids',
    focusAreas: ['Shoulders'],
    equipment: 'Dumbbell',
    defaultSetsReps: '4 Sets × 12 reps',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    preparation: 'Stand with feet hip-width apart holding light dumbbells at sides with slight elbow bend and forward torso tilt.',
    execution: [
      'Raise arms out to sides leading with elbows until parallel with floor.',
      'Pause for a beat at peak shoulder height.',
      'Lower with strict 2-second negative tempo.'
    ],
    keyTips: [
      'Do not use leg swing or hip bounce for momentum.',
      'Lead with elbows, like pouring water from pitchers.',
      'Do not raise weights above shoulder height to keep traps quiet.'
    ]
  },

  // ==========================================
  // BICEPS EXERCISES
  // ==========================================
  {
    id: 'standing-bicep-curl',
    name: 'Standing Dumbbell Bicep Curl',
    aliases: ['bicep curl', 'db curl', 'dumbbell bicep curl'],
    category: 'Biceps',
    subFocus: 'Biceps Brachii Mass & Peak',
    muscle: 'Biceps Brachii (Long & Short Heads), Brachialis',
    focusAreas: ['Biceps'],
    equipment: 'Dumbbell',
    defaultSetsReps: '4 Sets × 10 reps',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    preparation: 'Stand tall with dumbbells at sides, arms extended, palms facing thighs.',
    execution: [
      'Curl weights upward while rotating palms to face ceiling (supination).',
      'Squeeze biceps maximally at top of curl.',
      'Lower slowly along the same path to full elbow extension.'
    ],
    keyTips: [
      'Keep elbows pinned at sides; do not swing them forward.',
      'Do not lean backward as weight rises.',
      'Ensure full arm extension at bottom for complete stretch.'
    ]
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curls',
    aliases: ['hammer curl', 'db hammer curl'],
    category: 'Biceps',
    subFocus: 'Brachialis & Forearm Thickness',
    muscle: 'Brachialis, Brachioradialis, Biceps Long Head',
    focusAreas: ['Biceps'],
    equipment: 'Dumbbell',
    defaultSetsReps: '3 Sets × 12 reps',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    preparation: 'Stand holding dumbbells with neutral grip (palms facing each other).',
    execution: [
      'Curl weights smoothly toward shoulders maintaining neutral palms.',
      'Squeeze forearms and brachialis hard at top.',
      'Lower under control to complete reset.'
    ],
    keyTips: [
      'Maintain thumbs pointing upward throughout.',
      'Keep elbows stationary beside ribs.'
    ]
  },

  // ==========================================
  // TRICEPS EXERCISES
  // ==========================================
  {
    id: 'tricep-pushdown',
    name: 'Tricep Rope Pushdown',
    aliases: ['tricep pushdown', 'cable pushdown', 'rope pushdown'],
    category: 'Triceps',
    subFocus: 'Lateral & Medial Tricep Head Horseshoe',
    muscle: 'Triceps Brachii (All Heads)',
    focusAreas: ['Triceps'],
    equipment: 'Cable Machine',
    defaultSetsReps: '4 Sets × 12 reps',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    preparation: 'Grip rope attachment on high pulley. Stand with knees slightly bent and torso angled forward 10 degrees with elbows glued to sides.',
    execution: [
      'Push rope downward until arms are completely locked straight.',
      'Flourish rope ends apart at bottom for deep tricep squeeze.',
      'Control return back to 90 degrees bend at elbow.'
    ],
    keyTips: [
      'Do not let elbows drift forward or backward.',
      'Do not use shoulder weight to press down.',
      'Achieve a distinct 1-second lockout squeeze on every rep.'
    ]
  },

  // ==========================================
  // LEGS EXERCISES
  // ==========================================
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squats',
    aliases: ['squats', 'squat', 'barbell squat', 'back squat'],
    category: 'Legs',
    subFocus: 'Quad Size, Glute Mass & Total Body Strength',
    muscle: 'Quadriceps, Gluteus Maximus, Hamstrings, Adductors, Core',
    focusAreas: ['Legs', 'Glutes'],
    equipment: 'Barbell',
    defaultSetsReps: '4 Sets × 8 reps',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    preparation: 'Step under barbell resting across upper traps. Unrack and take 2 steps back, setting feet shoulder-width apart with toes angled out 20 degrees.',
    execution: [
      'Take a deep belly breath and brace abdominal wall.',
      'Hinge at hips and knees simultaneously, descending until hip crease passes below knees.',
      'Drive powerfully upward through whole foot to full standing lockout.'
    ],
    keyTips: [
      'Do not let knees collapse inward during drive.',
      'Keep chest elevated and spine locked in neutral alignment.',
      'Maintain weight distributed evenly over mid-foot.'
    ]
  },
  {
    id: 'walking-lunges',
    name: 'Walking Dumbbell Lunges',
    aliases: ['lunges', 'walking lunges', 'db lunges'],
    category: 'Legs',
    subFocus: 'Unilateral Leg Symmetry & Glute Drive',
    muscle: 'Quads, Glutes, Hamstrings, Calves',
    focusAreas: ['Legs', 'Glutes'],
    equipment: 'Dumbbell',
    defaultSetsReps: '3 Sets × 12 reps per leg',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    preparation: 'Stand tall holding dumbbells at sides with chest lifted.',
    execution: [
      'Step forward with one leg, sinking hips until both knees form 90-degree angles.',
      'Drive upward through front heel to step forward into next lunge.',
      'Alternate legs in a smooth fluid walking progression.'
    ],
    keyTips: [
      'Do not let front knee cave inward.',
      'Do not bang back knee onto the floor.',
      'Keep torso upright throughout.'
    ]
  }
];

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
  if (clean.includes('wiper')) {
    return EXERCISE_DATABASE.find(e => e.id === 'wipers') || EXERCISE_DATABASE[0];
  }
  if (clean.includes('incline') && clean.includes('bench')) {
    return EXERCISE_DATABASE.find(e => e.id === 'incline-bench-press-dumbbell') || EXERCISE_DATABASE[0];
  }
  if (clean.includes('fly')) {
    return EXERCISE_DATABASE.find(e => e.id === 'bench-fly-dumbbell') || EXERCISE_DATABASE[0];
  }
  if (clean.includes('pullover')) {
    return EXERCISE_DATABASE.find(e => e.id === 'pullover-dumbbell') || EXERCISE_DATABASE[0];
  }
  if (clean.includes('decline')) {
    return EXERCISE_DATABASE.find(e => e.id === 'decline-bench-press-dumbbell') || EXERCISE_DATABASE[0];
  }
  if (clean.includes('pushup') || clean.includes('push-up')) {
    return EXERCISE_DATABASE.find(e => e.id === 'push-up-band') || EXERCISE_DATABASE[0];
  }
  if (clean.includes('thrust') || clean.includes('glute') || clean.includes('butt')) {
    return EXERCISE_DATABASE.find(e => e.category === 'Glutes') || EXERCISE_DATABASE[0];
  }
  if (clean.includes('lat') || clean.includes('pull')) {
    return EXERCISE_DATABASE.find(e => e.id === 'lat-pulldown') || EXERCISE_DATABASE[0];
  }
  if (clean.includes('squat') || clean.includes('leg')) {
    return EXERCISE_DATABASE.find(e => e.category === 'Legs') || EXERCISE_DATABASE[0];
  }
  if (clean.includes('curl') || clean.includes('bicep')) {
    return EXERCISE_DATABASE.find(e => e.category === 'Biceps') || EXERCISE_DATABASE[0];
  }
  if (clean.includes('tricep')) {
    return EXERCISE_DATABASE.find(e => e.category === 'Triceps') || EXERCISE_DATABASE[0];
  }
  if (clean.includes('shoulder') || clean.includes('press')) {
    return EXERCISE_DATABASE.find(e => e.category === 'Shoulders') || EXERCISE_DATABASE[0];
  }

  // Default fallback
  return {
    id: 'general',
    name: exerciseName,
    category: 'Chest',
    subFocus: 'Target Workout',
    muscle: 'Active Muscle Group',
    focusAreas: ['Chest'],
    equipment: 'Dumbbell',
    defaultSetsReps: '4 Sets × 8 reps',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    preparation: 'Set up in a stable position with core braced and proper joint alignment before beginning.',
    execution: [
      'Inhale and control the movement through full range of motion.',
      'Squeeze the targeted muscle group hard at peak contraction.',
      'Exhale and return slowly to starting position.'
    ],
    keyTips: [
      'Control the 2-second negative eccentric tempo.',
      'Maintain proper spinal alignment throughout.',
      'Keep your core tightly braced.'
    ]
  };
};
