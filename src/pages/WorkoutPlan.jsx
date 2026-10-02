import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Copy, Dumbbell, Utensils, Check, X, 
  Save, Sparkles, AlertCircle 
} from 'lucide-react';
import useWorkoutStore from '../store/useWorkoutStore';
import useDietStore from '../store/useDietStore';
import useDailyLogStore from '../store/useDailyLogStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { generateId, getTodayStr, DAYS_OF_WEEK, getDayName } from '../utils/calculations';

const EXERCISE_DATABASE = [
  { group: 'Chest', exercises: ['Bench Press', 'Incline Dumbbell Press', 'Cable Crossover', 'Push Ups', 'Chest Dips', 'Pec Deck Fly'] },
  { group: 'Back', exercises: ['Lat Pulldown', 'Barbell Row', 'Seated Cable Row', 'Pull Ups', 'T-Bar Row', 'Deadlift'] },
  { group: 'Shoulders', exercises: ['Overhead Shoulder Press', 'Dumbbell Lateral Raise', 'Front Raise', 'Face Pull', 'Arnold Press'] },
  { group: 'Legs', exercises: ['Barbell Squat', 'Leg Press', 'Walking Lunges', 'Leg Extension', 'Hamstring Curl', 'Calf Raise'] },
  { group: 'Arms', exercises: ['Barbell Bicep Curl', 'Hammer Curl', 'Tricep Rope Pushdown', 'Skull Crushers', 'Preacher Curl'] },
  { group: 'Core', exercises: ['Plank', 'Hanging Leg Raise', 'Cable Crunch', 'Russian Twist', 'Ab Wheel Rollout'] },
  { group: 'Cardio', exercises: ['Running / Treadmill', 'Stationary Cycling', 'Jump Rope', 'Rowing Machine', 'HIIT Session'] }
];

export default function WorkoutPlan() {
  const navigate = useNavigate();
  const { weeklyPlan, setDayPlan, addExercise, removeExercise, updateExercise } = useWorkoutStore();
  const { weeklyPlan: dietWeeklyPlan } = useDietStore();
  const { syncPlan } = useDailyLogStore();

  const todayDate = new Date();
  const todayDayOfWeek = todayDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const todayStr = getTodayStr();

  // Active day defaults to today's day of week
  const [activeDay, setActiveDay] = useState(todayDayOfWeek);
  
  const currentPlan = weeklyPlan?.[activeDay] || { name: '', isRestDay: false, exercises: [] };

  const [notification, setNotification] = useState('');
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [targetCopyDay, setTargetCopyDay] = useState(todayDayOfWeek === 0 ? 1 : 0);

  // New Exercise Form Modal / Drawer
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState('3');
  const [newExReps, setNewExReps] = useState('12');
  const [newExWeight, setNewExWeight] = useState('0');

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Sync to today's log if the edited day is today
  const syncToHomeIfToday = (updatedPlan) => {
    if (activeDay === todayDayOfWeek) {
      const todayDiet = dietWeeklyPlan?.[todayDayOfWeek] || { meals: [] };
      syncPlan(todayStr, updatedPlan, todayDiet);
    }
  };

  const handleSavePlan = () => {
    // Save to weekly workout store
    setDayPlan(activeDay, currentPlan);
    
    // If today is this day, sync to home screen immediately!
    syncToHomeIfToday(currentPlan);

    const isToday = activeDay === todayDayOfWeek;
    triggerNotification(
      isToday 
        ? "✅ Plan saved! Today's Home screen is updated with your workouts!" 
        : `✅ ${getDayName(activeDay)} plan saved successfully!`
    );
  };

  const handleRestDayToggle = (e) => {
    const isRest = e.target.checked;
    const updated = { ...currentPlan, isRestDay: isRest, name: isRest ? 'Rest Day' : (currentPlan.name === 'Rest Day' ? '' : currentPlan.name) };
    setDayPlan(activeDay, updated);
    syncToHomeIfToday(updated);
    triggerNotification(isRest ? 'Set as Rest Day' : 'Set as Workout Day');
  };

  const handleDayNameChange = (e) => {
    const updated = { ...currentPlan, name: e.target.value };
    setDayPlan(activeDay, updated);
    syncToHomeIfToday(updated);
  };

  const handleAddNewExercise = (e) => {
    e?.preventDefault();
    if (!newExName.trim()) {
      alert('Please enter an exercise name');
      return;
    }

    const newEx = {
      id: generateId(),
      name: newExName.trim(),
      sets: Number(newExSets) || 3,
      reps: Number(newExReps) || 12,
      weight: Number(newExWeight) || 0,
    };

    const updatedPlan = {
      ...currentPlan,
      exercises: [...(currentPlan.exercises || []), newEx]
    };

    addExercise(activeDay, newEx);
    syncToHomeIfToday(updatedPlan);

    setNewExName('');
    setNewExSets('3');
    setNewExReps('12');
    setNewExWeight('0');
    setIsAddModalOpen(false);

    triggerNotification(`Added "${newEx.name}" to ${getDayName(activeDay)}`);
  };

  const handleRemoveExercise = (exerciseId) => {
    const updatedPlan = {
      ...currentPlan,
      exercises: currentPlan.exercises.filter((ex) => ex.id !== exerciseId)
    };
    removeExercise(activeDay, exerciseId);
    syncToHomeIfToday(updatedPlan);
    triggerNotification('Exercise removed');
  };

  const handleCopyDay = () => {
    setDayPlan(targetCopyDay, JSON.parse(JSON.stringify(currentPlan)));
    if (targetCopyDay === todayDayOfWeek) {
      syncPlan(todayStr, currentPlan, dietWeeklyPlan?.[todayDayOfWeek] || { meals: [] });
    }
    setIsCopyModalOpen(false);
    triggerNotification(`Copied to ${getDayName(targetCopyDay)}!`);
  };

  const isToday = activeDay === todayDayOfWeek;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen bg-dark-900 text-white pb-32 px-4 md:px-6 pt-6 max-w-2xl mx-auto space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold gradient-accent-text">Workout Routine</h1>
            <p className="text-gray-400 text-sm">Design which workouts you do on each day</p>
          </div>

          {/* Prominent Save Button */}
          <button
            onClick={handleSavePlan}
            className="flex items-center gap-2 bg-accent text-dark-900 font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-accent/20 active:scale-95 transition-all text-sm"
          >
            <Save size={18} />
            <span>Save Plan</span>
          </button>
        </div>

        {/* Tab Switcher: Workout vs Diet */}
        <div className="flex gap-2 p-1 bg-dark-800 rounded-2xl border border-white/5">
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-700 text-white font-semibold text-sm shadow-sm"
            disabled
          >
            <Dumbbell size={18} className="text-accent" /> 💪 Workout Routine
          </button>
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-700/50 transition-colors text-sm font-semibold"
            onClick={() => navigate('/plan/diet')}
          >
            <Utensils size={18} /> 🍽️ Diet Plan
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="p-3.5 bg-accent/20 border border-accent text-accent rounded-2xl flex items-center gap-2 text-sm font-semibold shadow-lg"
          >
            <Sparkles size={18} />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day Selector (Mon, Tue, Wed, Thu, Fri, Sat, Sun) */}
      <div>
        <div className="flex justify-between items-center mb-2 px-1 text-xs text-gray-400 font-medium">
          <span>SELECT DAY TO EDIT</span>
          {isToday && <span className="text-accent font-bold">● Editing Today's Workout</span>}
        </div>
        <div className="grid grid-cols-7 gap-1.5 bg-dark-800/80 p-2 rounded-2xl border border-white/5">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = activeDay === day.id;
            const isCurrentDay = todayDayOfWeek === day.id;
            const hasExercises = (weeklyPlan?.[day.id]?.exercises || []).length > 0;
            const isRest = weeklyPlan?.[day.id]?.isRestDay;

            return (
              <button
                key={day.id}
                onClick={() => setActiveDay(day.id)}
                className={`py-3 px-1 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                  isSelected 
                    ? 'bg-accent text-dark-900 font-bold shadow-md shadow-accent/20' 
                    : 'text-gray-300 hover:bg-dark-700'
                }`}
              >
                <span className="text-xs uppercase">{day.short}</span>
                {isCurrentDay && (
                  <span className={`text-[9px] px-1 rounded mt-0.5 ${isSelected ? 'bg-dark-900 text-white' : 'bg-accent/20 text-accent font-bold'}`}>
                    Today
                  </span>
                )}
                {!isCurrentDay && hasExercises && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-dark-900' : 'bg-accent'}`} />
                )}
                {!isCurrentDay && isRest && (
                  <span className="text-[10px] opacity-60">💤</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Card */}
      <div className="glass rounded-3xl p-5 md:p-6 space-y-6 border border-white/5">
        {/* Day Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{getDayName(activeDay)}</h2>
              {isToday && (
                <span className="text-xs bg-accent/20 text-accent font-bold px-2.5 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {currentPlan.isRestDay ? 'Rest & recovery day' : `${currentPlan.exercises.length} exercise(s) scheduled`}
            </p>
          </div>

          {/* Rest Day Switch */}
          <label className="flex items-center gap-3 cursor-pointer bg-dark-800/80 px-4 py-2.5 rounded-2xl border border-white/5">
            <span className="text-sm font-semibold text-gray-300">Rest Day</span>
            <input 
              type="checkbox" 
              checked={currentPlan.isRestDay || false} 
              onChange={handleRestDayToggle} 
              className="w-5 h-5 accent-accent"
            />
          </label>
        </div>

        {/* Workout Details (When not a rest day) */}
        {!currentPlan.isRestDay ? (
          <div className="space-y-5">
            {/* Workout Focus / Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Workout Focus / Muscle Group
              </label>
              <input
                type="text"
                placeholder="e.g. Chest & Triceps, Leg Day, Back & Biceps"
                value={currentPlan.name || ''}
                onChange={handleDayNameChange}
                className="w-full bg-dark-800 border border-white/10 rounded-2xl py-3 px-4 text-white font-medium outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Exercises List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-200">
                  Scheduled Exercises ({currentPlan.exercises.length})
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-xl"
                >
                  <Plus size={16} /> Add Exercise
                </button>
              </div>

              {currentPlan.exercises.length === 0 ? (
                <div className="p-8 bg-dark-800/50 rounded-2xl border border-dashed border-dark-700 text-center space-y-3">
                  <Dumbbell size={36} className="mx-auto text-accent opacity-50" />
                  <p className="text-gray-400 text-sm">No exercises added for {getDayName(activeDay)} yet.</p>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => setIsAddModalOpen(true)}
                    icon={<Plus size={16} />}
                  >
                    + Add First Exercise
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentPlan.exercises.map((ex, idx) => (
                    <div 
                      key={ex.id}
                      className="bg-dark-800/90 rounded-2xl p-4 border border-white/5 flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-dark-700 text-accent font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-white text-base">{ex.name}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveExercise(ex.id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 bg-dark-700 rounded-lg transition-colors"
                          title="Remove exercise"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Sets / Reps / Weight Inputs */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-dark-900/60 p-2 rounded-xl text-center">
                          <span className="text-[10px] text-gray-400 block">Sets</span>
                          <input 
                            type="number"
                            min="1"
                            value={ex.sets}
                            onChange={(e) => {
                              updateExercise(activeDay, ex.id, { sets: Number(e.target.value) || 1 });
                              syncToHomeIfToday({
                                ...currentPlan,
                                exercises: currentPlan.exercises.map(item => item.id === ex.id ? { ...item, sets: Number(e.target.value) || 1 } : item)
                              });
                            }}
                            className="w-full bg-transparent text-center font-bold text-sm text-white outline-none"
                          />
                        </div>

                        <div className="bg-dark-900/60 p-2 rounded-xl text-center">
                          <span className="text-[10px] text-gray-400 block">Reps</span>
                          <input 
                            type="number"
                            min="1"
                            value={ex.reps}
                            onChange={(e) => {
                              updateExercise(activeDay, ex.id, { reps: Number(e.target.value) || 1 });
                              syncToHomeIfToday({
                                ...currentPlan,
                                exercises: currentPlan.exercises.map(item => item.id === ex.id ? { ...item, reps: Number(e.target.value) || 1 } : item)
                              });
                            }}
                            className="w-full bg-transparent text-center font-bold text-sm text-white outline-none"
                          />
                        </div>

                        <div className="bg-dark-900/60 p-2 rounded-xl text-center">
                          <span className="text-[10px] text-gray-400 block">Weight (kg)</span>
                          <input 
                            type="number"
                            min="0"
                            step="2.5"
                            value={ex.weight}
                            onChange={(e) => {
                              updateExercise(activeDay, ex.id, { weight: Number(e.target.value) || 0 });
                              syncToHomeIfToday({
                                ...currentPlan,
                                exercises: currentPlan.exercises.map(item => item.id === ex.id ? { ...item, weight: Number(e.target.value) || 0 } : item)
                              });
                            }}
                            className="w-full bg-transparent text-center font-bold text-sm text-accent outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button at Bottom */}
            <div className="pt-2">
              <Button 
                variant="primary" 
                fullWidth 
                size="lg" 
                onClick={handleSavePlan}
                icon={<Save size={20} />}
              >
                Save {getDayName(activeDay)} Workout
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <span className="text-5xl block">😴</span>
            <h3 className="text-xl font-bold text-white">Scheduled as Rest Day</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Rest and recovery allow muscle fibers to rebuild stronger. Stay hydrated and get plenty of sleep!
            </p>
            <div className="pt-4">
              <Button variant="primary" onClick={handleSavePlan}>
                Save as Rest Day
              </Button>
            </div>
          </div>
        )}

        {/* Copy Day Option */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-sm">
          <span className="text-gray-400 text-xs">Want to reuse this workout?</span>
          <button 
            onClick={() => setIsCopyModalOpen(true)}
            className="text-accent2 hover:underline flex items-center gap-1.5 font-semibold text-xs"
          >
            <Copy size={16} /> Copy to another day...
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD EXERCISE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-3 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-dark-800 rounded-3xl w-full max-w-lg p-6 space-y-5 border border-white/10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Dumbbell className="text-accent" size={20} />
                  Add Exercise to {getDayName(activeDay)}
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-dark-700 rounded-full">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddNewExercise} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Exercise Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Incline Dumbbell Press, Squats, Barbell Curl"
                    value={newExName}
                    onChange={(e) => setNewExName(e.target.value)}
                    className="w-full bg-dark-700 rounded-xl py-3 px-4 font-semibold text-white outline-none focus:ring-2 focus:ring-accent"
                    autoFocus
                  />
                </div>

                {/* Quick suggestions from database */}
                <div>
                  <div className="text-xs text-gray-400 mb-1.5">Or tap a popular exercise:</div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar p-1">
                    {EXERCISE_DATABASE.map((grp) =>
                      grp.exercises.slice(0, 3).map((ex) => (
                        <button
                          type="button"
                          key={ex}
                          onClick={() => setNewExName(ex)}
                          className="text-xs bg-dark-700 hover:bg-accent hover:text-dark-900 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {ex}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Sets / Reps / Weight */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-semibold">Sets</label>
                    <input
                      type="number"
                      min="1"
                      value={newExSets}
                      onChange={(e) => setNewExSets(e.target.value)}
                      className="w-full bg-dark-700 rounded-xl py-2.5 px-3 text-center font-bold outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-semibold">Reps</label>
                    <input
                      type="number"
                      min="1"
                      value={newExReps}
                      onChange={(e) => setNewExReps(e.target.value)}
                      className="w-full bg-dark-700 rounded-xl py-2.5 px-3 text-center font-bold outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-semibold">Weight (kg)</label>
                    <input
                      type="number"
                      min="0"
                      step="2.5"
                      value={newExWeight}
                      onChange={(e) => setNewExWeight(e.target.value)}
                      className="w-full bg-dark-700 rounded-xl py-2.5 px-3 text-center font-bold text-accent outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <Button variant="primary" fullWidth size="lg" type="submit">
                    Add to Routine
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* COPY MODAL */}
        {isCopyModalOpen && (
          <Modal isOpen={isCopyModalOpen} onClose={() => setIsCopyModalOpen(false)} title="Copy Routine">
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Copy <strong>{getDayName(activeDay)}</strong>'s routine to:
              </p>
              <select
                value={targetCopyDay}
                onChange={(e) => setTargetCopyDay(Number(e.target.value))}
                className="w-full bg-dark-700 rounded-xl p-3.5 text-white font-semibold outline-none"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d.id} value={d.id} disabled={d.id === activeDay}>
                    {d.name} {d.id === activeDay ? '(Current)' : ''}
                  </option>
                ))}
              </select>
              <div className="flex gap-3 pt-3">
                <Button variant="ghost" fullWidth onClick={() => setIsCopyModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" fullWidth onClick={handleCopyDay}>
                  Confirm Copy
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
