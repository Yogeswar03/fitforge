import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, X, Play, Target, Check, Plus, 
  Dumbbell, Sparkles, AlertCircle 
} from 'lucide-react';
import { getExerciseDetails } from '../../data/exerciseDatabase';
import AnatomicalMannequin2Step from './AnatomicalMannequin2Step';
import AnatomicalBodyMap from './AnatomicalBodyMap';
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
          className="w-full max-w-lg bg-white text-gray-900 rounded-t-[32px] sm:rounded-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative font-sans"
        >
          {/* Header Drag Handle on Mobile */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 sm:hidden" />

          {/* Top Bar with Title and Back/Close Arrow */}
          <div className="p-4 sm:p-5 pb-2 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                title="Back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                  {details.name}
                </h2>
              </div>
            </div>

            {/* Men / Women Switcher (Header level) */}
            <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
              <button
                type="button"
                onClick={() => setCurrentGender('male')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  currentGender === 'male'
                    ? 'bg-black text-white shadow-sm font-black'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                ♂️ Men
              </button>
              <button
                type="button"
                onClick={() => setCurrentGender('female')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  currentGender === 'female'
                    ? 'bg-black text-white shadow-sm font-black'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                ♀️ Women
              </button>
            </div>
          </div>

          {/* Top Tabs: Instructions | Record (Matching Screenshot 1 & 3) */}
          <div className="flex px-6 border-b border-gray-100 bg-white">
            <button
              type="button"
              onClick={() => setMainTab('instructions')}
              className={`py-3 px-4 font-bold text-sm sm:text-base transition-all relative ${
                mainTab === 'instructions'
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Instructions
              {mainTab === 'instructions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
              )}
            </button>
            <div className="w-px h-6 bg-gray-200 my-auto mx-2" />
            <button
              type="button"
              onClick={() => setMainTab('record')}
              className={`py-3 px-4 font-bold text-sm sm:text-base transition-all relative ${
                mainTab === 'record'
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Record
              {mainTab === 'record' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-white">
            {mainTab === 'instructions' ? (
              <>
                {/* 1. ANATOMICAL DEMONSTRATION BOX (Side-by-side with play video button) */}
                <AnatomicalMannequin2Step
                  exerciseName={details.name}
                  gender={currentGender}
                />

                {/* 2. SEGMENTED CONTROL: [ Muscle ] | [ How to do ] (Screenshot 1 & 2) */}
                <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setSubSection('muscle')}
                    className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all text-center ${
                      subSection === 'muscle'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Muscle
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubSection('how-to-do')}
                    className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all text-center ${
                      subSection === 'how-to-do'
                        ? 'bg-black text-white shadow-sm'
                        : 'text-gray-700 hover:text-gray-900'
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
                    <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-3">
                      <AnatomicalBodyMap
                        focusAreas={focusBadges}
                        primaryMuscle={details.muscle || details.category}
                        gender={currentGender}
                      />
                    </div>

                    {/* Equipment Section */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1.5">Equipment</h4>
                      <span className="inline-block px-3.5 py-1.5 rounded-full bg-gray-100 text-gray-800 text-xs sm:text-sm font-semibold">
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
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">
                        Preparation
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {getPreparationText()}
                      </p>
                    </div>

                    {/* Execution */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">
                        Execution
                      </h3>
                      <div className="space-y-2">
                        {getExecutionSteps().map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                            <span className="font-bold text-gray-900">{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key tips */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">
                        Key tips
                      </h3>
                      <div className="space-y-2">
                        {getKeyTips().map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                            <span className="font-bold text-gray-900">{idx + 1}.</span>
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
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 space-y-3">
                  <h3 className="text-base font-bold text-gray-900">Log Exercise Performance</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Sets</label>
                      <input
                        type="number"
                        value={logSets}
                        onChange={(e) => setLogSets(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-center font-bold text-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Reps</label>
                      <input
                        type="number"
                        value={logReps}
                        onChange={(e) => setLogReps(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-center font-bold text-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={logWeight}
                        onChange={(e) => setLogWeight(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-center font-bold text-gray-900 text-sm"
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
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-bold text-center">
                    ✅ Recorded to today's workout log!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky Bottom Pill Button: "Done" (Matching Screenshot 1 & 2) */}
          <div className="p-4 sm:p-5 pt-3 border-t border-gray-100 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-base rounded-full shadow-lg active:scale-95 transition-all text-center"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
