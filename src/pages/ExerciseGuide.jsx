import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, Search, Sparkles, Target, ShieldCheck, 
  ChevronRight, Play, Plus, Check, ArrowLeft, Flame, Info
} from 'lucide-react';
import { EXERCISE_DATABASE, getExerciseDetails } from '../data/exerciseDatabase';
import ExerciseModal from '../components/ui/ExerciseModal';
import useDailyLogStore from '../store/useDailyLogStore';
import { getTodayStr, generateId } from '../utils/calculations';

const CATEGORIES = [
  { id: 'Chest', name: 'Chest', emoji: '💥', subtitle: 'Pectorals, Upper, Lower & Inner' },
  { id: 'Back', name: 'Back', emoji: '🛡️', subtitle: 'Lats, Rhomboids & Thickness' },
  { id: 'Shoulders', name: 'Shoulders', emoji: '⚡', subtitle: 'Front, Lateral & Rear Deltoids' },
  { id: 'Legs', name: 'Legs', emoji: '🦵', subtitle: 'Quads, Hamstrings, Glutes & Calves' },
  { id: 'Arms', name: 'Arms', emoji: '💪', subtitle: 'Biceps, Triceps & Forearms' },
  { id: 'Core', name: 'Core / Abs', emoji: '🧘', subtitle: 'Upper Abs, Lower Abs & Obliques' },
  { id: 'Cardio', name: 'Cardio', emoji: '🏃', subtitle: 'Conditioning, Heart Rate & Fat Burn' },
];

export default function ExerciseGuide() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Chest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExerciseName, setSelectedExerciseName] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const { addWorkoutExercise } = useDailyLogStore();
  const todayStr = getTodayStr();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToToday = (exercise) => {
    addWorkoutExercise(todayStr, {
      id: generateId(),
      name: exercise.name,
      sets: 3,
      reps: 12,
      weight: 0,
    });
    showToast(`✅ Added "${exercise.name}" to today's workout!`);
  };

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter((ex) => {
      const matchesSearch = 
        !searchQuery.trim() ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.aliases && ex.aliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory = 
        searchQuery.trim() ? true : ex.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-dark-900 text-white p-4 md:p-6 pb-36 max-w-4xl mx-auto space-y-6"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-accent text-dark-900 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center border border-white/5 text-gray-300 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>🏋️ Exercise & Form Guide</span>
            </h1>
            <p className="text-xs text-gray-400">Animated workout GIFs, technique & proper execution</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-xs bg-dark-800 hover:bg-dark-700 text-accent font-bold px-3 py-2 rounded-xl border border-white/10"
        >
          Dashboard →
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any exercise (e.g., bench press, incline, pushups, squats)..."
          className="w-full bg-dark-800 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-3 text-xs text-gray-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      {!searchQuery && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-accent text-dark-900 border-accent shadow-lg shadow-accent/20 scale-105'
                  : 'bg-dark-800 text-gray-400 border-white/5 hover:text-white hover:bg-dark-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Category Focus Banner for Chest or Active Category */}
      {!searchQuery && selectedCategory === 'Chest' && (
        <div className="glass rounded-3xl p-5 border border-accent/20 relative overflow-hidden bg-gradient-to-r from-accent/10 via-dark-800 to-dark-800">
          <div className="flex items-start justify-between">
            <div className="space-y-1 max-w-lg">
              <span className="text-[10px] bg-accent/20 text-accent font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Chest Mastery Guide
              </span>
              <h2 className="text-lg font-black text-white">How Chest Muscles are Trained</h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                The chest consists of the <strong>Upper Clavicular Head</strong> (Incline movements), 
                <strong>Mid Sternal Head</strong> (Flat Bench & Push-Ups), and <strong>Lower Abdominal Head</strong> (Dips & Decline). 
                Tap any exercise below to see the animated GIF and form cues!
              </p>
            </div>
            <span className="text-4xl hidden sm:block">💥</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-[11px]">
            <div className="bg-dark-900/60 p-2 rounded-xl border border-white/5">
              <span className="text-accent font-bold block">Upper Chest</span>
              <span className="text-gray-400">Incline DB / BB Press</span>
            </div>
            <div className="bg-dark-900/60 p-2 rounded-xl border border-white/5">
              <span className="text-accent2 font-bold block">Mid Chest</span>
              <span className="text-gray-400">Flat Barbell Bench</span>
            </div>
            <div className="bg-dark-900/60 p-2 rounded-xl border border-white/5">
              <span className="text-emerald-400 font-bold block">Lower Pecs</span>
              <span className="text-gray-400">Chest Dips & Decline</span>
            </div>
            <div className="bg-dark-900/60 p-2 rounded-xl border border-white/5">
              <span className="text-orange-400 font-bold block">Inner Squeeze</span>
              <span className="text-gray-400">Cable Crossovers</span>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Cards Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
            {searchQuery ? `Search Results (${filteredExercises.length})` : `${selectedCategory} Exercises (${filteredExercises.length})`}
          </h3>
          <span className="text-xs text-gray-500">Tap for animated GIF & cues</span>
        </div>

        {filteredExercises.length === 0 ? (
          <div className="glass rounded-3xl p-8 text-center text-gray-400 space-y-2 border border-dashed border-dark-700">
            <Dumbbell size={36} className="mx-auto text-accent opacity-40" />
            <p className="font-semibold text-white">No exercises found matching "{searchQuery}".</p>
            <p className="text-xs text-gray-400">Try searching for "bench", "press", "curl", or "squat".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((exercise) => {
              const displayImage = exercise.gif || exercise.image;
              return (
                <div
                  key={exercise.id}
                  className="glass-strong rounded-3xl overflow-hidden border border-white/5 hover:border-accent/40 transition-all flex flex-col group"
                >
                  {/* Visual Header / GIF Container */}
                  <div 
                    onClick={() => setSelectedExerciseName(exercise.name)}
                    className="relative w-full h-44 bg-dark-900 cursor-pointer overflow-hidden"
                  >
                    <img 
                      src={displayImage}
                      alt={exercise.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = exercise.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-black/30" />
                    
                    {/* GIF Tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-bold text-accent">
                      <Play size={10} className="fill-accent text-accent" />
                      <span>ANIMATED GIF</span>
                    </div>

                    {/* Equipment badge */}
                    <div className="absolute top-3 right-3 bg-dark-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-gray-300 font-medium">
                      {exercise.equipment}
                    </div>

                    {/* Target Muscle Overlay */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-end">
                      <div>
                        <span className="text-[10px] text-accent uppercase font-black tracking-wider block">
                          {exercise.category}
                        </span>
                        <h4 className="text-base font-extrabold text-white leading-tight drop-shadow-md">
                          {exercise.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-300 font-semibold">
                        <Target size={14} className="text-accent2" />
                        <span>{exercise.muscle}</span>
                      </div>

                      {exercise.cues && exercise.cues.length > 0 && (
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          "{exercise.cues[0]}"
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedExerciseName(exercise.name)}
                        className="flex-1 py-2 px-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Play size={12} className="text-accent fill-accent" /> Form Cues
                      </button>

                      <button
                        onClick={() => handleAddToToday(exercise)}
                        className="py-2 px-3 bg-accent/15 hover:bg-accent/25 text-accent rounded-xl text-xs font-bold border border-accent/30 flex items-center justify-center gap-1 transition-colors"
                        title="Add to today's workout"
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Demonstration Modal */}
      <ExerciseModal
        isOpen={!!selectedExerciseName}
        onClose={() => setSelectedExerciseName(null)}
        exerciseName={selectedExerciseName}
        onAddToWorkout={() => {
          const det = getExerciseDetails(selectedExerciseName);
          if (det) handleAddToToday(det);
        }}
      />
    </motion.div>
  );
}
