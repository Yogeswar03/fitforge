import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Sparkles, ChevronRight, 
  Crown, User, Dumbbell, Play, Check 
} from 'lucide-react';
import { WORKOUT_CATEGORIES, EXERCISE_DATABASE, getExerciseDetails } from '../data/exerciseDatabase';
import ExerciseModal from '../components/ui/ExerciseModal';
import useDailyLogStore from '../store/useDailyLogStore';
import useUserStore from '../store/useUserStore';
import { getTodayStr, generateId } from '../utils/calculations';

/**
 * ExerciseGuide Page
 * Pixel-perfect implementation of the user's reference screenshots:
 * - Level 1: "Gym Workout" list of workout categories (Chest, Back, Shoulders, Biceps, Triceps, Full Body, Legs, Butt, Abs)
 *           with muscular photo thumbnail & black circle right arrow (Screenshot 5)
 * - Level 2: Category Exercises view with hero banner, exercise cards showing anatomical mannequin on white background (Screenshot 4),
 *           and floating bottom "START" button
 * - Level 3: Exercise Detail Modal with pure white background, side-by-side 2-step mannequins with active muscles in red,
 *           video play button, "Muscle" focus area with Front & Back anatomical map, and "How to do" coaching steps (Screenshots 1, 2, 3)
 */
export default function ExerciseGuide() {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const defaultGender = profile?.gender === 'female' ? 'female' : 'male';
  
  // State
  const [activeGender, setActiveGender] = useState(defaultGender);
  const [selectedCategory, setSelectedCategory] = useState(null); // null = Level 1 (All categories), string = Level 2
  const [selectedExerciseName, setSelectedExerciseName] = useState(null); // Level 3 Modal
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const { addWorkoutExercise } = useDailyLogStore();
  const todayStr = getTodayStr();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter exercises for current category or search query
  const currentCategoryData = useMemo(() => {
    if (!selectedCategory) return null;
    return WORKOUT_CATEGORIES.find(c => c.id === selectedCategory) || WORKOUT_CATEGORIES[0];
  }, [selectedCategory]);

  const categoryExercises = useMemo(() => {
    if (!selectedCategory) return [];
    return EXERCISE_DATABASE.filter(ex => ex.category === selectedCategory);
  }, [selectedCategory]);

  // Handle START workout button: Adds all exercises to today's daily log
  const handleStartWorkout = () => {
    if (!categoryExercises || categoryExercises.length === 0) return;
    categoryExercises.forEach((ex) => {
      addWorkoutExercise(todayStr, {
        id: generateId(),
        name: ex.name,
        sets: 4,
        reps: 8,
        weight: profile?.weight ? Math.round(profile.weight * 0.4) : 15,
      });
    });
    showToast(`🔥 All ${categoryExercises.length} ${currentCategoryData?.name} exercises added to Today's Workout!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-36 font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-white/20"
          >
            <Sparkles size={16} className="text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto px-4 pt-4 sm:pt-6">
        {/* ============================================================== */}
        {/* LEVEL 1: "Gym Workout" Categories List (Screenshot 5)           */}
        {/* ============================================================== */}
        {!selectedCategory ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Top Bar (Screenshot 5) */}
            <div className="flex items-center justify-between pb-1">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  Gym Workout
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {/* Crown / Pro Badge */}
                <span className="text-2xl" title="FitForge Elite">👑</span>
                
                {/* Profile Circle */}
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors shadow-sm"
                  title="Profile"
                >
                  <User size={20} />
                </button>
              </div>
            </div>

            {/* Info / Onboarding Banner (Screenshot 5) */}
            <div className="bg-red-50/90 border border-red-100 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                <span className="text-base sm:text-lg">⚠️</span>
                <span>Set up your body info to unlock your ideal training plan!</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="py-1.5 px-4 bg-red-500 hover:bg-red-600 text-white font-bold text-xs sm:text-sm rounded-full shadow-sm transition-transform active:scale-95 flex-shrink-0"
              >
                Go!
              </button>
            </div>

            {/* Men / Women Switcher Bar */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Model: {activeGender === 'female' ? 'Women ♀️' : 'Men ♂️'}
              </span>
              <div className="flex items-center bg-gray-200/80 p-1 rounded-full border border-gray-300/60 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveGender('male')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    activeGender === 'male'
                      ? 'bg-black text-white shadow-sm font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ♂️ Men
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGender('female')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    activeGender === 'female'
                      ? 'bg-black text-white shadow-sm font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ♀️ Women
                </button>
              </div>
            </div>

            {/* Workout Categories List (Matching Screenshot 5 Cards) */}
            <div className="space-y-3 pt-1">
              {WORKOUT_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="bg-white rounded-3xl p-3.5 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                >
                  {/* Left: Real Muscular Athlete Thumbnail */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-xs border border-gray-100">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    {/* Middle: Title & Exercise Count */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                        {cat.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">
                        {cat.count} exercises
                      </p>
                    </div>
                  </div>

                  {/* Right: Sleek Black Circle with White Arrow (Screenshot 5) */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ============================================================== */
          /* LEVEL 2: Workout Exercises View for Category (Screenshot 4)    */
          /* ============================================================== */
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 pb-24"
          >
            {/* Top Bar with Back Arrow */}
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 transition-colors shadow-sm"
                title="Back to All Workouts"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="flex items-center bg-gray-200/80 p-1 rounded-full border border-gray-300/60">
                <button
                  type="button"
                  onClick={() => setActiveGender('male')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    activeGender === 'male' ? 'bg-black text-white font-black' : 'text-gray-600'
                  }`}
                >
                  ♂️ Men
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGender('female')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    activeGender === 'female' ? 'bg-black text-white font-black' : 'text-gray-600'
                  }`}
                >
                  ♀️ Women
                </button>
              </div>
            </div>

            {/* Hero Muscular Athlete Banner (Screenshot 4) */}
            <div className="relative rounded-3xl overflow-hidden shadow-md h-48 sm:h-56 bg-gray-900 border border-gray-200">
              <img
                src={currentCategoryData?.heroImage || currentCategoryData?.image}
                alt={currentCategoryData?.name}
                className="w-full h-full object-cover opacity-75"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              {/* Overlay Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                  {currentCategoryData?.name}
                </h2>
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300 mt-1 font-medium">
                  <span>Equipment: All Available</span>
                  <span>Current Weight: {profile?.weight || 60.0}kg</span>
                </div>
              </div>
            </div>

            {/* Exercises List Header (Screenshot 4) */}
            <div className="pt-2 px-1 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Exercises ({categoryExercises.length} Exercises)
              </h3>
              <span className="text-xs font-semibold text-gray-500">
                Tap card for instructions
              </span>
            </div>

            {/* Exercises List: Clean White Cards with Anatomical Mannequins (Screenshot 4) */}
            <div className="space-y-3">
              {categoryExercises.map((exercise) => {
                return (
                  <div
                    key={exercise.id}
                    onClick={() => setSelectedExerciseName(exercise.name)}
                    className="bg-white rounded-3xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group active:scale-[0.99]"
                  >
                    {/* Left: Anatomical Mannequin Figure on Clean White Box with Highlighted Red Muscle */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-gray-200 flex items-center justify-center p-1 flex-shrink-0 shadow-xs">
                      <MiniMannequinThumb
                        name={exercise.name}
                        gender={activeGender}
                      />
                    </div>

                    {/* Middle: Exercise Name & Sets x Reps (Screenshot 4) */}
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors">
                        {exercise.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                        {exercise.defaultSetsReps || '4 Sets × 8 reps'}
                      </p>
                    </div>

                    {/* Quick Chevron */}
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 group-hover:text-black flex items-center justify-center flex-shrink-0 transition-colors">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating Black Pill Button: "START" (Screenshot 4) */}
            <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-6 z-20 pointer-events-none">
              <button
                type="button"
                onClick={handleStartWorkout}
                className="pointer-events-auto w-full py-4 bg-black hover:bg-gray-800 text-white font-extrabold text-base sm:text-lg rounded-full shadow-2xl active:scale-95 transition-all text-center tracking-wider"
              >
                START
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* ============================================================== */}
      {/* LEVEL 3: Pure White Exercise Detail Modal (Screenshot 1, 2, 3)  */}
      {/* ============================================================== */}
      <ExerciseModal
        isOpen={!!selectedExerciseName}
        onClose={() => setSelectedExerciseName(null)}
        exerciseName={selectedExerciseName}
        initialGender={activeGender}
        onAddToWorkout={() => {
          showToast(`✅ "${selectedExerciseName}" recorded to today's workout!`);
        }}
      />
    </div>
  );
}

/**
 * MiniMannequinThumb
 * Clean anatomical line illustration with highlighted RED active target muscle for exercise list cards
 */
function MiniMannequinThumb({ name = '', gender = 'male' }) {
  const clean = name.toLowerCase();
  const targetRed = '#FF3B30';
  const grayContour = '#94A3B8';
  const skin = '#E2E8F0';

  if (clean.includes('wiper') || clean.includes('ab') || clean.includes('core')) {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full object-contain">
        <line x1="10" y1="65" x2="70" y2="65" stroke="#CBD5E1" strokeWidth="2" />
        <circle cx="20" cy="58" r="6" fill={skin} stroke={grayContour} strokeWidth="1" />
        <rect x="25" y="55" width="24" height="8" rx="2" fill={skin} stroke={grayContour} strokeWidth="1" />
        <rect x="35" y="54" width="10" height="9" rx="1.5" fill={targetRed} />
        <line x1="48" y1="58" x2="68" y2="28" stroke={grayContour} strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (clean.includes('pullover')) {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full object-contain">
        <line x1="10" y1="68" x2="70" y2="68" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="25" y="48" width="30" height="6" rx="1" fill="#475569" />
        <ellipse cx="40" cy="45" rx="16" ry="6" fill={skin} stroke={grayContour} strokeWidth="1" />
        <ellipse cx="40" cy="43" rx="9" ry="4" fill={targetRed} />
        <circle cx="26" cy="40" r="5" fill={skin} stroke={grayContour} strokeWidth="1" />
        <line x1="40" y1="42" x2="40" y2="18" stroke={grayContour} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="40" cy="15" rx="5" ry="4" fill="#EAB308" />
      </svg>
    );
  }

  if (clean.includes('fly')) {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full object-contain">
        <rect x="25" y="50" width="30" height="6" rx="1" fill="#475569" />
        <ellipse cx="40" cy="47" rx="16" ry="6" fill={skin} stroke={grayContour} strokeWidth="1" />
        <ellipse cx="40" cy="45" rx="10" ry="5" fill={targetRed} />
        <circle cx="25" cy="42" r="5" fill={skin} stroke={grayContour} strokeWidth="1" />
        <path d="M 36 44 Q 30 30 38 18" stroke={grayContour} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 44 44 Q 50 30 42 18" stroke={grayContour} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="38" cy="16" r="3.5" fill="#EAB308" />
        <circle cx="42" cy="16" r="3.5" fill="#EAB308" />
      </svg>
    );
  }

  // Bench press (flat, incline, decline) or pushup
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full object-contain">
      <rect x="22" y="48" width="36" height="6" rx="1.5" fill="#475569" transform="rotate(-15 40 50)" />
      <ellipse cx="42" cy="44" rx="16" ry="6" fill={skin} stroke={grayContour} strokeWidth="1" transform="rotate(-15 42 44)" />
      <ellipse cx="42" cy="42" rx="10" ry="5" fill={targetRed} transform="rotate(-15 42 42)" />
      <circle cx="25" cy="35" r="5" fill={skin} stroke={grayContour} strokeWidth="1" />
      <line x1="42" y1="40" x2="42" y2="18" stroke={grayContour} strokeWidth="3" strokeLinecap="round" />
      <rect x="36" y="14" width="12" height="5" rx="1.5" fill="#EAB308" />
    </svg>
  );
}
