import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Sparkles, Plus, Play, 
  Target, Dumbbell, ChevronRight 
} from 'lucide-react';
import { EXERCISE_DATABASE, getExerciseDetails } from '../data/exerciseDatabase';
import ExerciseModal from '../components/ui/ExerciseModal';
import AnatomicalExerciseVisual from '../components/ui/AnatomicalExerciseVisual';
import useDailyLogStore from '../store/useDailyLogStore';
import useUserStore from '../store/useUserStore';
import { getTodayStr, generateId } from '../utils/calculations';

const WORKOUT_DAYS = [
  { id: 'Chest', name: 'Chest Day', emoji: '💥', subtitle: 'Upper, Mid & Lower Pecs' },
  { id: 'Back', name: 'Pull Day (Back & Biceps)', emoji: '🛡️', subtitle: 'Lats, Rows, Rear Delts & Curls' },
  { id: 'Shoulders', name: 'Shoulders', emoji: '⚡', subtitle: 'Overhead Press & Lateral Raises' },
  { id: 'Legs', name: 'Leg Day', emoji: '🦵', subtitle: 'Squats, Lunges & Calves' },
  { id: 'Arms', name: 'Arms', emoji: '💪', subtitle: 'Biceps & Triceps' },
  { id: 'Core', name: 'Core & Abs', emoji: '🧘', subtitle: 'Planks & Core Stability' },
];

export default function ExerciseGuide() {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const defaultGender = profile?.gender === 'female' ? 'female' : 'male';
  const [activeGender, setActiveGender] = useState(defaultGender);
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
      className="min-h-screen bg-dark-900 text-white p-4 md:p-6 pb-36 max-w-4xl mx-auto space-y-5"
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

      {/* Top Header */}
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
              <span>Gym Workout Guide</span>
            </h1>
            <p className="text-xs text-gray-400">Anatomical muscle diagrams with target areas in red</p>
          </div>
        </div>

        {/* Global Men / Women Selector */}
        <div className="flex items-center gap-1 bg-dark-800 p-1 rounded-2xl border border-white/10 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveGender('male')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeGender === 'male'
                ? 'bg-accent text-dark-900 shadow-md font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>♂️</span>
            <span>Men</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveGender('female')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeGender === 'female'
                ? 'bg-pink-500 text-white shadow-md font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>♀️</span>
            <span>Women</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search exercise (e.g. bench press, lat pulldown, squats)..."
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

      {/* Workout Day Tabs */}
      {!searchQuery && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {WORKOUT_DAYS.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedCategory(day.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === day.id
                  ? 'bg-accent text-dark-900 border-accent shadow-lg shadow-accent/20 scale-105'
                  : 'bg-dark-800 text-gray-400 border-white/5 hover:text-white hover:bg-dark-700'
              }`}
            >
              <span>{day.emoji}</span>
              <span>{day.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Poster Style Exercise Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
              {searchQuery ? `Search Results (${filteredExercises.length})` : `${selectedCategory} Exercises`}
            </h2>
            <p className="text-[11px] text-gray-400">
              Showing for {activeGender === 'female' ? 'Women ♀️' : 'Men ♂️'} • Target muscles highlighted in red
            </p>
          </div>
        </div>

        {filteredExercises.length === 0 ? (
          <div className="glass rounded-3xl p-8 text-center text-gray-400 space-y-2 border border-dashed border-dark-700">
            <Dumbbell size={36} className="mx-auto text-accent opacity-40" />
            <p className="font-semibold text-white">No exercises found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((exercise) => {
              return (
                <div
                  key={exercise.id}
                  className="bg-dark-800/90 rounded-3xl p-4 border border-white/10 hover:border-accent/30 transition-all flex flex-col justify-between space-y-3"
                >
                  {/* Exercise Title Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-accent">
                        {exercise.category}
                      </span>
                      <h3 className="text-base font-extrabold text-white leading-tight">
                        {exercise.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                        Target: <span className="text-gray-200">{exercise.muscle}</span>
                      </p>
                    </div>

                    <span className="text-[10px] bg-dark-900 text-gray-300 px-2.5 py-1 rounded-full border border-white/5 font-medium">
                      {exercise.equipment}
                    </span>
                  </div>

                  {/* Anatomical Line Illustration (Start & Peak Position with Red Highlights) */}
                  <div 
                    onClick={() => setSelectedExerciseName(exercise.name)}
                    className="cursor-pointer"
                  >
                    <AnatomicalExerciseVisual
                      exerciseName={exercise.name}
                      gender={activeGender}
                      category={exercise.category}
                      showSetsReps={true}
                      defaultSets="2-3 SETS • 10-12 REPS"
                    />
                  </div>

                  {/* Quick Action Footer */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedExerciseName(exercise.name)}
                      className="flex-1 py-2.5 bg-dark-750 hover:bg-dark-700 text-white rounded-xl text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Target size={14} className="text-red-400" />
                      <span>View Form Steps</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddToToday(exercise)}
                      className="py-2.5 px-4 bg-accent/15 hover:bg-accent/25 text-accent rounded-xl text-xs font-bold border border-accent/30 flex items-center justify-center gap-1 transition-colors"
                      title="Add to today's workout log"
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      <ExerciseModal
        isOpen={!!selectedExerciseName}
        onClose={() => setSelectedExerciseName(null)}
        exerciseName={selectedExerciseName}
        initialGender={activeGender}
        onAddToWorkout={() => {
          const det = getExerciseDetails(selectedExerciseName);
          if (det) handleAddToToday(det);
        }}
      />
    </motion.div>
  );
}
