import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, X, Play, Target, Check, Plus, 
  Dumbbell, Sparkles, AlertCircle 
} from 'lucide-react';
import { getExerciseDetails } from '../../data/exerciseDatabase';
import AnatomicalMannequin2Step from './AnatomicalMannequin2Step';
import AnatomicalBodyMap from './AnatomicalBodyMap';
import ThemeToggle from './ThemeToggle';
import useThemeStore from '../../store/useThemeStore';
import useUserStore from '../../store/useUserStore';
import useDailyLogStore from '../../store/useDailyLogStore';
import { getTodayStr, generateId } from '../../utils/calculations';

/**
 * ExerciseModal Component
 * Full-screen or slide-up sheet with pure white background matching the user's screenshots:
 * - Header: Back arrow, Title (e.g. "Push-up* Band", "Wipers"), Men/Women toggle
 * - Tabs: Instructions (with red underline) | Record
 * - Anatomical demonstration box: Side-by-side 2-step mannequins with active red muscles + video play button
 * - Segmented control: [ Muscle ] | [ How to do ]
 * - Muscle view: Focus Area badges with red dots + Front/Back Anatomical Body Map + Equipment
 * - How to do view: Preparation, Execution (1,2,3), Key tips (1,2,3,4)
 * - Record tab: Sets, Reps, Weight with "Add to Workout"
 * - Sticky "Done" button at bottom
 */
export default function ExerciseModal({ 
  isOpen, 
  onClose, 
  exerciseName, 
  onAddToWorkout, 
  initialGender 
}) {
  const { profile } = useUserStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const defaultGender = initialGender || profile?.gender || 'male';
  const [currentGender, setCurrentGender] = useState(defaultGender);
  
  // Top Tabs: 'instructions' | 'record'
  const [mainTab, setMainTab] = useState('instructions');
  
  // Segmented Pill: 'muscle' | 'how-to-do'
  const [subSection, setSubSection] = useState('muscle');

  // Record inputs
  const [logSets, setLogSets] = useState(4);
  const [logReps, setLogReps] = useState(8);
  const [logWeight, setLogWeight] = useState(profile?.weight ? Math.round(profile.weight * 0.5) : 20);
  const [loggedToast, setLoggedToast] = useState(false);

  const { addWorkoutExercise } = useDailyLogStore();
  const todayStr = getTodayStr();

  useEffect(() => {
    if (initialGender) setCurrentGender(initialGender);
  }, [initialGender]);

  if (!isOpen || !exerciseName) return null;

  const details = getExerciseDetails(exerciseName) || {
    name: exerciseName,
    category: 'Chest',
    muscle: 'Pectoralis Major',
    equipment: 'Body weight',
    cues: [],
    mistakes: []
  };

  // Focus areas extraction (e.g. Chest, Triceps, Shoulders)
  const getFocusAreaBadges = () => {
    if (details.focusAreas && Array.isArray(details.focusAreas)) {
      return details.focusAreas;
    }
    const clean = details.name.toLowerCase();
    if (clean.includes('wiper') || clean.includes('ab') || clean.includes('crunch')) {
      return ['Abs', 'Obliques'];
    }
    if (clean.includes('push-up') || clean.includes('pushup')) {
      return ['Chest', 'Triceps', 'Shoulders'];
    }
    if (clean.includes('bench') || clean.includes('chest') || clean.includes('fly') || clean.includes('pullover')) {
      return ['Chest', 'Front Delts', 'Triceps'];
    }
    if (clean.includes('lat') || clean.includes('pull') || clean.includes('row')) {
      return ['Lats', 'Upper Back', 'Biceps'];
    }
    if (clean.includes('squat') || clean.includes('leg') || clean.includes('lunge')) {
      return ['Quadriceps', 'Glutes', 'Calves'];
    }
    if (clean.includes('thrust') || clean.includes('glute') || clean.includes('butt')) {
      return ['Glutes', 'Hamstrings'];
    }
    if (clean.includes('shoulder') || clean.includes('press') || clean.includes('lateral')) {
      return ['Deltoids (Shoulders)', 'Traps'];
    }
    if (clean.includes('bicep') || clean.includes('curl')) {
      return ['Biceps', 'Forearms'];
    }
    if (clean.includes('tricep') || clean.includes('pushdown') || clean.includes('dip')) {
      return ['Triceps'];
    }
    return [details.category || 'Target Muscle'];
  };

  const focusBadges = getFocusAreaBadges();

  // Preparation text (Screenshot 2)
  const getPreparationText = () => {
    if (details.preparation) return details.preparation;
    const clean = details.name.toLowerCase();
    if (clean.includes('wiper')) {
      return 'Lie on the floor with arms stretched to your sides to stabilize your body. Lift your legs straight together off the ground until they are vertical to the floor.';
    }
    if (clean.includes('push-up') || clean.includes('pushup')) {
      return 'Place your hands firmly on the ground, slightly wider than shoulder-width apart with fingers spread. Anchor your toes to stabilize your lower body and brace your core.';
    }
    if (clean.includes('incline') || clean.includes('bench')) {
      return 'Lie flat with your back pinned against the bench, eyes directly under the weights. Plant your feet flat on the floor with knees at 90 degrees.';
    }
    if (clean.includes('squat')) {
      return 'Stand with feet shoulder-width apart, toes pointing slightly outward at 15-30 degrees. Brace your abdominal wall and keep your spine neutral.';
    }
    return `Set your body into a stable posture with core engaged and equipment adjusted to your height before initiating the movement.`;
  };

  // Execution steps (Screenshot 2)
  const getExecutionSteps = () => {
    if (details.execution && Array.isArray(details.execution) && details.execution.length > 0) {
      return details.execution;
    }
    if (details.cues && details.cues.length > 0) {
      return details.cues;
    }
    return [
      'Inhale and initiate the movement with smooth, controlled cadence.',
      'Pause for a second at the peak contraction to maximize tension.',
      'Exhale and return slowly along the same path to the starting position.'
    ];
  };

  // Key tips (Screenshot 2)
  const getKeyTips = () => {
    if (details.keyTips && Array.isArray(details.keyTips) && details.keyTips.length > 0) {
      return details.keyTips;
    }
    const clean = details.name.toLowerCase();
    if (clean.includes('wiper')) {
      return [
        'Do not let your legs bounce on the floor to assist the movement.',
        'Keep your legs straight and together throughout the movement.',
        'To add difficulty, keep your legs straight.',
        'Keep a braced core during the exercise.'
      ];
    }
    if (clean.includes('push-up') || clean.includes('pushup')) {
      return [
        'Keep elbows tucked at a 45-degree angle rather than flared 90 degrees.',
        'Maintain a straight rigid plank from heels through hips to the back of head.',
        'Do not drop your hips or arch your lower spine.',
        'Push the ground away through your full palm for full chest lockout.'
      ];
    }
    if (clean.includes('bench') || clean.includes('chest')) {
      return [
        'Keep your shoulder blades retracted and depressed into the bench.',
        'Do not bounce the weight violently off your ribcage.',
        'Lower the weight with a controlled 2-second negative tempo.',
        'Keep your wrists stacked straight over elbows.'
      ];
    }
    return (details.mistakes || []).map(m => `Avoid: ${m}`);
  };

  const handleRecordToToday = () => {
    addWorkoutExercise(todayStr, {
      id: generateId(),
      name: details.name,
      sets: Number(logSets) || 4,
      reps: Number(logReps) || 8,
      weight: Number(logWeight) || 0
    });
    if (onAddToWorkout) onAddToWorkout();
    setLoggedToast(true);
    setTimeout(() => {
      setLoggedToast(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`w-full max-w-lg rounded-t-[32px] sm:rounded-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative font-sans transition-colors ${
            isLight ? 'bg-white text-gray-900' : 'bg-[#121422] text-white border border-white/10'
          }`}
        >
          {/* Header Drag Handle on Mobile */}
          <div className={`w-12 h-1.5 rounded-full mx-auto mt-3 sm:hidden ${
            isLight ? 'bg-gray-300' : 'bg-gray-600'
          }`} />

          {/* Top Bar with Title, Theme Toggle, Men/Women, Back/Close Arrow */}
          <div className={`p-4 sm:p-5 pb-2 flex items-center justify-between border-b ${
            isLight ? 'border-gray-100' : 'border-white/10'
          }`}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-dark-800 hover:bg-dark-700 text-gray-200'
                }`}
                title="Back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className={`text-xl sm:text-2xl font-black tracking-tight leading-tight ${
                  isLight ? 'text-gray-900' : 'text-white'
                }`}>
                  {details.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Men / Women Switcher (Header level) */}
              <div className={`flex items-center p-1 rounded-full border ${
                isLight ? 'bg-gray-100 border-gray-200' : 'bg-dark-800 border-white/10'
              }`}>
                <button
                  type="button"
                  onClick={() => setCurrentGender('male')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    currentGender === 'male'
                      ? (isLight ? 'bg-black text-white font-black shadow-sm' : 'bg-white text-dark-900 font-black shadow-sm')
                      : (isLight ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white')
                  }`}
                >
                  ♂️ Men
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentGender('female')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    currentGender === 'female'
                      ? (isLight ? 'bg-black text-white font-black shadow-sm' : 'bg-white text-dark-900 font-black shadow-sm')
                      : (isLight ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white')
                  }`}
                >
                  ♀️ Women
                </button>
              </div>
            </div>
          </div>

          {/* Top Tabs: Instructions | Record (Matching Screenshot 1 & 3) */}
          <div className={`flex px-6 border-b transition-colors ${
            isLight ? 'border-gray-100 bg-white' : 'border-white/10 bg-[#121422]'
          }`}>
            <button
              type="button"
              onClick={() => setMainTab('instructions')}
              className={`py-3 px-4 font-bold text-sm sm:text-base transition-all relative ${
                mainTab === 'instructions'
                  ? (isLight ? 'text-gray-900' : 'text-white')
                  : (isLight ? 'text-gray-400 hover:text-gray-600' : 'text-gray-400 hover:text-gray-200')
              }`}
            >
              Instructions
              {mainTab === 'instructions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
              )}
            </button>
            <div className={`w-px h-6 my-auto mx-2 ${isLight ? 'bg-gray-200' : 'bg-gray-700'}`} />
            <button
              type="button"
              onClick={() => setMainTab('record')}
              className={`py-3 px-4 font-bold text-sm sm:text-base transition-all relative ${
                mainTab === 'record'
                  ? (isLight ? 'text-gray-900' : 'text-white')
                  : (isLight ? 'text-gray-400 hover:text-gray-600' : 'text-gray-400 hover:text-gray-200')
              }`}
            >
              Record
              {mainTab === 'record' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 transition-colors ${
            isLight ? 'bg-white text-gray-900' : 'bg-[#121422] text-gray-100'
          }`}>
            {mainTab === 'instructions' ? (
              <>
                {/* 1. ANATOMICAL DEMONSTRATION BOX (Side-by-side with play video button) */}
                <AnatomicalMannequin2Step
                  exerciseName={details.name}
                  gender={currentGender}
                />

                {/* 2. SEGMENTED CONTROL: [ Muscle ] | [ How to do ] (Screenshot 1 & 2) */}
                <div className={`flex p-1 rounded-full border ${
                  isLight ? 'bg-gray-100 border-gray-200' : 'bg-dark-800 border-white/10'
                }`}>
                  <button
                    type="button"
                    onClick={() => setSubSection('muscle')}
                    className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all text-center ${
                      subSection === 'muscle'
                        ? (isLight ? 'bg-black text-white shadow-sm font-black' : 'bg-white text-dark-900 shadow-sm font-black')
                        : (isLight ? 'text-gray-700 hover:text-gray-900' : 'text-gray-300 hover:text-white')
                    }`}
                  >
                    Muscle
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubSection('how-to-do')}
                    className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all text-center ${
                      subSection === 'how-to-do'
                        ? (isLight ? 'bg-black text-white shadow-sm font-black' : 'bg-white text-dark-900 shadow-sm font-black')
                        : (isLight ? 'text-gray-700 hover:text-gray-900' : 'text-gray-300 hover:text-white')
                    }`}
                  >
                    How to do
                  </button>
                </div>

                {/* SUBSECTION 1: MUSCLE TAB (Screenshot 1 & 3) */}
                {subSection === 'muscle' && (
                  <div className="space-y-4">
                    {/* Focus Area Header */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                        Focus Area
                      </h3>
                      {/* Red dot badges */}
                      <div className="flex flex-wrap gap-2">
                        {focusBadges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-100 text-gray-800 text-xs sm:text-sm font-semibold"
                          >
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Front & Back Anatomical Body Map with Red Target Muscles */}
                    <div className={`border rounded-3xl p-3 ${
                      isLight ? 'bg-gray-50/80 border-gray-100' : 'bg-dark-900/60 border-white/5'
                    }`}>
                      <AnatomicalBodyMap
                        focusAreas={focusBadges}
                        primaryMuscle={details.muscle || details.category}
                        gender={currentGender}
                      />
                    </div>

                    {/* Equipment Section */}
                    <div>
                      <h4 className={`text-sm font-bold mb-1.5 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        Equipment
                      </h4>
                      <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${
                        isLight ? 'bg-gray-100 text-gray-800' : 'bg-dark-800 text-gray-200'
                      }`}>
                        {details.equipment || 'Body weight'}
                      </span>
                    </div>
                  </div>
                )}

                {/* SUBSECTION 2: HOW TO DO TAB (Screenshot 2) */}
                {subSection === 'how-to-do' && (
                  <div className="space-y-4">
                    {/* Preparation */}
                    <div>
                      <h3 className={`text-base sm:text-lg font-bold mb-1.5 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        Preparation
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                        {getPreparationText()}
                      </p>
                    </div>

                    {/* Execution */}
                    <div>
                      <h3 className={`text-base sm:text-lg font-bold mb-1.5 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        Execution
                      </h3>
                      <div className="space-y-2">
                        {getExecutionSteps().map((step, idx) => (
                          <div key={idx} className={`flex items-start gap-2 text-xs sm:text-sm leading-relaxed ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                            <span className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key tips */}
                    <div>
                      <h3 className={`text-base sm:text-lg font-bold mb-1.5 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                        Key tips
                      </h3>
                      <div className="space-y-2">
                        {getKeyTips().map((tip, idx) => (
                          <div key={idx} className={`flex items-start gap-2 text-xs sm:text-sm leading-relaxed ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                            <span className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{idx + 1}.</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* RECORD TAB */
              <div className="space-y-4 py-2">
                <div className={`p-4 rounded-3xl border space-y-3 ${
                  isLight ? 'bg-gray-50 border-gray-100 text-gray-900' : 'bg-dark-800/80 border-white/5 text-white'
                }`}>
                  <h3 className={`text-base font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Log Exercise Performance</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 block mb-1">Sets</label>
                      <input
                        type="number"
                        value={logSets}
                        onChange={(e) => setLogSets(e.target.value)}
                        className={`w-full border rounded-xl py-2 px-3 text-center font-bold text-sm ${
                          isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-dark-900 border-white/10 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 block mb-1">Reps</label>
                      <input
                        type="number"
                        value={logReps}
                        onChange={(e) => setLogReps(e.target.value)}
                        className={`w-full border rounded-xl py-2 px-3 text-center font-bold text-sm ${
                          isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-dark-900 border-white/10 text-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 block mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={logWeight}
                        onChange={(e) => setLogWeight(e.target.value)}
                        className={`w-full border rounded-xl py-2 px-3 text-center font-bold text-sm ${
                          isLight ? 'bg-white border-gray-200 text-gray-900' : 'bg-dark-900 border-white/10 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRecordToToday}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-sm shadow-md transition-colors mt-2"
                  >
                    Log to Today's Workout
                  </button>
                </div>

                {loggedToast && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-bold text-center">
                    ✅ Recorded to today's workout log!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky Bottom Pill Button: "Done" (Matching Screenshot 1 & 2) */}
          <div className={`p-4 sm:p-5 pt-3 border-t transition-colors ${
            isLight ? 'border-gray-100 bg-white' : 'border-white/10 bg-[#121422]'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`w-full py-3.5 font-bold text-base rounded-full shadow-lg active:scale-95 transition-all text-center ${
                isLight 
                  ? 'bg-black hover:bg-gray-800 text-white' 
                  : 'bg-white hover:bg-gray-200 text-dark-900 font-extrabold'
              }`}
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
