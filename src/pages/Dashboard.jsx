import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Calendar, User, CheckCircle2, Circle, Flame, 
  Dumbbell, Utensils, Plus, Sparkles, X, ChevronRight, 
  Apple, History, Trophy, Award, Check 
} from 'lucide-react';

import useAuthStore from '../store/useAuthStore';
import useUserStore from '../store/useUserStore';
import useWorkoutStore from '../store/useWorkoutStore';
import useDietStore from '../store/useDietStore';
import useDailyLogStore from '../store/useDailyLogStore';
import { getTodayStr, getProgressPercentage, getDayName, generateId } from '../utils/calculations';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ExerciseModal from '../components/ui/ExerciseModal';
import { getExerciseDetails } from '../data/exerciseDatabase';

const TRAINER_MESSAGES = [
  "Outstanding discipline today! You crushed every set and hit your nutrition goals. Days like this build champions! 💪",
  "Incredible effort! Consistency is the only secret in fitness, and you nailed it today. Rest well tonight! 🔥",
  "Total beast mode unlocked! Every rep counted, every meal aligned. Your future physique thanks you! 🏆",
  "Flawless execution! You showed up, put in the work, and conquered the day. Proud of you, athlete! ⭐"
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { profile } = useUserStore();
  const { weeklyPlan: workoutWeeklyPlan } = useWorkoutStore();
  const { weeklyPlan: dietWeeklyPlan } = useDietStore();
  const { 
    logs, 
    initDay, 
    toggleWorkout, 
    toggleMeal, 
    addWorkoutExercise, 
    updateSteps, 
    updateWater, 
    markDayCompleted,
    getStreak 
  } = useDailyLogStore();

  const todayStr = getTodayStr();
  const todayDate = new Date();
  const dayOfWeek = todayDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // Templates for today
  const todayWorkoutTemplate = workoutWeeklyPlan?.[dayOfWeek] || { name: 'Workout Day', isRestDay: false, exercises: [] };
  const todayDietTemplate = dietWeeklyPlan?.[dayOfWeek] || { meals: [] };

  useEffect(() => {
    initDay(todayStr, todayWorkoutTemplate, todayDietTemplate);
  }, [todayStr, todayWorkoutTemplate, todayDietTemplate, initDay]);

  const todayLog = logs[todayStr] || {
    workouts: [],
    meals: [],
    loggedFoods: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    steps: 0,
    water: 0,
    dayCompleted: false,
  };

  const streak = getStreak ? getStreak() : 0;

  // Modals state
  const [isQuickAddExOpen, setIsQuickAddExOpen] = useState(false);
  const [quickExName, setQuickExName] = useState('');
  const [quickExSets, setQuickExSets] = useState('3');
  const [quickExReps, setQuickExReps] = useState('12');
  const [quickExWeight, setQuickExWeight] = useState('0');

  // Celebration Modal
  const [showCelebration, setShowCelebration] = useState(false);

  // Exercise Guide Modal
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);

  // Compute live nutrition
  const nutrition = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let fiber = 0;

    (todayLog.meals || []).forEach((meal) => {
      if (meal.completed) {
        (meal.foods || []).forEach((f) => {
          calories += Number(f.calories || 0);
          protein += Number(f.protein || 0);
          carbs += Number(f.carbs || 0);
          fat += Number(f.fat || 0);
          fiber += Number(f.fiber || 0);
        });
      }
    });

    (todayLog.loggedFoods || []).forEach((f) => {
      calories += Number(f.calories || 0);
      protein += Number(f.protein || 0);
      carbs += Number(f.carbs || 0);
      fat += Number(f.fat || 0);
      fiber += Number(f.fiber || 0);
    });

    return { calories, protein, carbs, fat, fiber };
  }, [todayLog]);

  const { workouts = [], meals = [], loggedFoods = [], steps = 0, water = 0 } = todayLog;

  const totalActivities = workouts.length + meals.length;
  const completedActivities = 
    workouts.filter((w) => w.completed).length + meals.filter((m) => m.completed).length;
  
  const allActivitiesDone = totalActivities > 0 && completedActivities === totalActivities;
  const progressPercent = totalActivities > 0 
    ? getProgressPercentage(completedActivities, totalActivities) 
    : (todayLog.dayCompleted ? 100 : 0);

  // Automatically trigger completion modal once when everything is checked
  useEffect(() => {
    if (allActivitiesDone && !todayLog.dayCompleted) {
      const msg = TRAINER_MESSAGES[Math.floor(Math.random() * TRAINER_MESSAGES.length)];
      markDayCompleted(todayStr, true, msg);
      setShowCelebration(true);
    }
  }, [allActivitiesDone, todayLog.dayCompleted, todayStr, markDayCompleted]);

  const handleManualComplete = () => {
    const msg = TRAINER_MESSAGES[Math.floor(Math.random() * TRAINER_MESSAGES.length)];
    markDayCompleted(todayStr, true, msg);
    setShowCelebration(true);
  };

  const handleToggleExercise = (id) => toggleWorkout(todayStr, id);
  const handleToggleMeal = (id) => toggleMeal(todayStr, id);

  const handleQuickAddExercise = (e) => {
    e?.preventDefault();
    if (!quickExName.trim()) return;

    addWorkoutExercise(todayStr, {
      id: generateId(),
      name: quickExName.trim(),
      sets: Number(quickExSets) || 3,
      reps: Number(quickExReps) || 12,
      weight: Number(quickExWeight) || 0,
    });

    setQuickExName('');
    setQuickExSets('3');
    setQuickExReps('12');
    setQuickExWeight('0');
    setIsQuickAddExOpen(false);
  };

  const getMealEmoji = (type) => {
    const emojis = {
      breakfast: '🍳',
      morning_snack: '🍎',
      lunch: '🥗',
      pre_workout: '⚡',
      post_workout: '💪',
      dinner: '🍗',
      snack: '🌙',
    };
    return emojis[type] || '🍽️';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen bg-dark-900 text-white p-4 md:p-6 pb-32 max-w-2xl mx-auto space-y-6"
    >
      {/* Top Header Bar with Dedicated History & Calendar Icons */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black gradient-accent-text tracking-tight">FitForge</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">Daily Fitness Tracker</span>
            {streak > 0 && (
              <span className="text-xs bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame size={12} /> {streak}d Streak
              </span>
            )}
          </div>
        </div>

        {/* Dedicated Navigation Icons: History, Calendar, Profile */}
        <div className="flex items-center gap-2">
          {/* Dedicated History Icon */}
          <button 
            onClick={() => navigate('/history')}
            className="w-10 h-10 rounded-2xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center transition-colors border border-white/5 text-accent"
            title="View Journey History"
          >
            <History size={20} />
          </button>

          {/* Calendar Icon */}
          <button 
            onClick={() => navigate('/calendar')}
            className="w-10 h-10 rounded-2xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center transition-colors border border-white/5 text-accent2"
            title="View Calendar Grid"
          >
            <Calendar size={20} />
          </button>
          
          {/* Profile Icon */}
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-2xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center transition-colors border border-white/10 overflow-hidden"
            title="Profile & Settings"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-gray-300" />
            )}
          </button>
        </div>
      </header>

      {/* Today Header Card */}
      <section className="glass rounded-3xl p-6 relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-36 h-36 bg-accent/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-extrabold">{getDayName(dayOfWeek)}</h2>
              <span className="text-xs bg-accent text-dark-900 font-bold px-2.5 py-0.5 rounded-full">
                TODAY
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-0.5">{format(todayDate, 'MMMM d, yyyy')}</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400 block uppercase font-semibold">Today's Focus</span>
            <span className="text-accent font-bold text-base">
              {todayWorkoutTemplate.isRestDay ? 'Rest & Recovery 😴' : (todayWorkoutTemplate.name || 'Workout Day 💪')}
            </span>
          </div>
        </div>
      </section>

      {/* TODAY'S WORKOUT SECTION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Dumbbell className="text-accent" size={22} />
            Today's Workout
            {workouts.length > 0 && (
              <span className="text-xs bg-dark-700 px-2.5 py-0.5 rounded-full text-accent font-bold">
                {workouts.filter((w) => w.completed).length}/{workouts.length} Done
              </span>
            )}
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQuickAddExOpen(true)}
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-xl"
            >
              <Plus size={14} /> Add
            </button>
            <button
              onClick={() => navigate('/plan/workout')}
              className="text-xs font-semibold text-accent2 hover:underline flex items-center gap-0.5"
            >
              Routine →
            </button>
          </div>
        </div>

        {todayWorkoutTemplate.isRestDay && workouts.length === 0 ? (
          <div className="glass-strong rounded-3xl p-6 text-center text-gray-400 space-y-2 border border-white/5">
            <span className="text-4xl block">🧘</span>
            <div className="font-semibold text-white">Scheduled as Rest Day</div>
            <p className="text-xs text-gray-400">Take time to recover, hydrate, and stretch!</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="glass-strong rounded-3xl p-6 text-center space-y-3 border border-dashed border-dark-700">
            <Dumbbell size={36} className="mx-auto text-accent opacity-40" />
            <div>
              <p className="font-semibold text-white">No exercises planned for {getDayName(dayOfWeek)}.</p>
              <p className="text-xs text-gray-400 mt-1">Set up your weekly routine or add exercises directly.</p>
            </div>
            <div className="flex gap-2 justify-center pt-1">
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/plan/workout')}
              >
                Set Weekly Plan →
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsQuickAddExOpen(true)}
                icon={<Plus size={16} />}
              >
                Quick Add
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {workouts.map((exercise) => {
              const details = getExerciseDetails(exercise.name);
              return (
                <div
                  key={exercise.id}
                  onClick={() => handleToggleExercise(exercise.id)}
                  className={`glass-strong rounded-2xl p-3 sm:p-4 flex items-center gap-3.5 cursor-pointer transition-all border ${
                    exercise.completed ? 'border-accent/40 bg-dark-800/40 opacity-70' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleExercise(exercise.id);
                    }}
                    className="flex-shrink-0 text-accent"
                  >
                    {exercise.completed ? (
                      <CheckCircle2 size={26} className="text-accent fill-accent/20" />
                    ) : (
                      <Circle size={26} className="text-gray-500 hover:text-gray-300" />
                    )}
                  </button>

                  {/* Exercise Visual Image Thumbnail */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExerciseForModal(exercise.name);
                    }}
                    className="relative w-14 h-14 rounded-xl overflow-hidden bg-dark-900 border border-white/10 flex-shrink-0 group cursor-pointer hover:border-accent/60 transition-colors shadow-sm"
                    title="Tap to view photo & form guide"
                  >
                    <img
                      src={details?.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80'}
                      alt={exercise.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[9px] text-accent px-1 rounded font-bold">
                      Form
                    </span>
                  </div>

                  <div className={`flex-1 min-w-0 ${exercise.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-bold text-sm sm:text-base leading-snug truncate">{exercise.name}</p>
                      {details?.category && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-dark-700 text-gray-300 rounded font-medium">
                          {details.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {exercise.sets} sets × {exercise.reps} reps {exercise.weight > 0 ? `• ${exercise.weight} kg` : ''}
                    </p>
                  </div>

                  {exercise.completed ? (
                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full flex-shrink-0">
                      DONE
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExerciseForModal(exercise.name);
                      }}
                      className="text-xs text-gray-400 hover:text-accent p-2 rounded-xl hover:bg-dark-700/60 transition-colors flex-shrink-0"
                      title="View Exercise Form Guide"
                    >
                      <Sparkles size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* TODAY'S DIET SECTION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Utensils className="text-accent2" size={22} />
            Today's Diet
            {meals.length > 0 && (
              <span className="text-xs bg-dark-700 px-2.5 py-0.5 rounded-full text-accent2 font-bold">
                {meals.filter((m) => m.completed).length}/{meals.length} Taken
              </span>
            )}
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/log')}
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-xl"
            >
              <Plus size={14} /> Log Food
            </button>
            <button
              onClick={() => navigate('/plan/diet')}
              className="text-xs font-semibold text-accent2 hover:underline flex items-center gap-0.5"
            >
              Meal Plan →
            </button>
          </div>
        </div>

        {meals.length === 0 && loggedFoods.length === 0 ? (
          <div className="glass-strong rounded-3xl p-6 text-center space-y-3 border border-dashed border-dark-700">
            <Apple size={36} className="mx-auto text-accent2 opacity-40" />
            <div>
              <p className="font-semibold text-white">No diet plan set for {getDayName(dayOfWeek)}.</p>
              <p className="text-xs text-gray-400 mt-1">Plan your daily meals or log what you just ate.</p>
            </div>
            <div className="flex gap-2 justify-center pt-1">
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/plan/diet')}
              >
                Set Meal Plan →
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/log')}
                icon={<Plus size={16} />}
              >
                Log Food
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {meals.map((meal) => {
              const mealCalories = (meal.foods || []).reduce((sum, f) => sum + Number(f.calories || 0), 0);
              return (
                <div
                  key={meal.id}
                  onClick={() => handleToggleMeal(meal.id)}
                  className={`glass-strong rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer transition-all border ${
                    meal.completed ? 'border-accent/40 bg-dark-800/40 opacity-70' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <button className="flex-shrink-0 text-accent">
                    {meal.completed ? (
                      <CheckCircle2 size={26} className="text-accent fill-accent/20" />
                    ) : (
                      <Circle size={26} className="text-gray-500 hover:text-gray-300" />
                    )}
                  </button>

                  <span className="text-2xl">{getMealEmoji(meal.type)}</span>

                  <div className={`flex-1 ${meal.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                    <p className="font-bold text-base leading-snug">{meal.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {mealCalories > 0 ? `${Math.round(mealCalories)} kcal` : 'Planned slot'}
                      {meal.time ? ` • ${meal.time}` : ''}
                    </p>
                  </div>

                  {meal.completed && (
                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      TAKEN
                    </span>
                  )}
                </div>
              );
            })}

            {/* Separately logged foods */}
            {loggedFoods.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-semibold text-gray-400 mb-2 px-1">
                  Extra Logged Today ({loggedFoods.length}):
                </div>
                <div className="space-y-1.5">
                  {loggedFoods.map((f) => (
                    <div 
                      key={f.id} 
                      className="glass p-3 rounded-xl flex justify-between items-center text-xs border border-white/5"
                    >
                      <div>
                        <span className="font-semibold text-white">{f.name}</span>
                        {f.itemsUsed && <span className="text-gray-400 ml-2 italic">({f.itemsUsed})</span>}
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-accent font-bold">{f.calories} kcal</span>
                        <span className="text-gray-400 font-medium">({f.qty}{f.unit || 'g'})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* NUTRITION INTAKE BARS */}
      <section className="glass rounded-3xl p-5 border border-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            📊 Today's Intake vs Targets
          </h3>
          <button 
            onClick={() => navigate('/log')}
            className="text-xs text-accent hover:underline font-semibold"
          >
            + Log More
          </button>
        </div>

        <div className="space-y-3.5">
          <NutritionBar 
            label="Calories Intake" 
            eaten={Math.round(nutrition.calories)} 
            target={profile?.targetCalories || 2000} 
            color="#00E676" 
            unit="kcal"
          />
          <NutritionBar 
            label="Protein Intake" 
            eaten={Math.round(nutrition.protein)} 
            target={profile?.targetProtein || 150} 
            color="#FF6B6B" 
            unit="g"
          />
          <NutritionBar 
            label="Carbs Intake" 
            eaten={Math.round(nutrition.carbs)} 
            target={profile?.targetCarbs || 200} 
            color="#00B0FF" 
            unit="g"
          />
          <NutritionBar 
            label="Fiber Intake" 
            eaten={Math.round(nutrition.fiber)} 
            target={profile?.targetFiber || 30} 
            color="#FFD740" 
            unit="g"
          />
        </div>
      </section>

      {/* STEPS & WATER CARDS */}
      <section className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => updateSteps(todayStr, steps + 500)}
          className="glass-strong rounded-3xl p-4 cursor-pointer border border-white/5 active:scale-95 transition-transform"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xl">🚶</span>
            <span className="text-[10px] text-accent font-semibold">+500 steps</span>
          </div>
          <p className="font-extrabold text-xl">{steps}</p>
          <p className="text-xs text-gray-400">/ {profile?.targetSteps || 10000} steps</p>
          <div className="h-2 bg-dark-700 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${Math.min(100, getProgressPercentage(steps, profile?.targetSteps || 10000))}%` }}
            />
          </div>
        </div>

        <div 
          onClick={() => updateWater(todayStr, water + 1)}
          className="glass-strong rounded-3xl p-4 cursor-pointer border border-white/5 active:scale-95 transition-transform"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xl">💧</span>
            <span className="text-[10px] text-accent2 font-semibold">+1 glass</span>
          </div>
          <p className="font-extrabold text-xl">{water}</p>
          <p className="text-xs text-gray-400">/ 8 glasses</p>
          <div className="h-2 bg-dark-700 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="h-full bg-accent2 transition-all duration-300"
              style={{ width: `${Math.min(100, getProgressPercentage(water, 8))}%` }}
            />
          </div>
        </div>
      </section>

      {/* DAY COMPLETION STATUS FOOTER */}
      <section className={`glass rounded-3xl p-6 border transition-all ${
        todayLog.dayCompleted ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10' : 'border-white/5'
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            {todayLog.dayCompleted ? (
              <>
                <div className="flex items-center gap-2">
                  <Trophy className="text-accent" size={22} />
                  <p className="font-extrabold text-accent text-xl">Day 100% Completed! 🏆</p>
                </div>
                <p className="text-xs text-gray-300 max-w-sm">
                  {todayLog.completionMessage || "Outstanding job! Your day is permanently archived in history."}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/history')}
                    className="text-xs bg-dark-800 hover:bg-dark-700 text-accent font-bold px-3 py-1.5 rounded-xl border border-accent/30 inline-flex items-center gap-1 transition-colors"
                  >
                    View History Log →
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="font-extrabold text-white text-lg">
                  {completedActivities}/{totalActivities} activities done
                </p>
                <p className="text-xs text-gray-400">
                  Check off your exercises and meals, or mark complete when done.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleManualComplete}
                    className="text-xs bg-accent text-dark-900 font-bold px-3.5 py-1.5 rounded-xl shadow-md active:scale-95 transition-all inline-flex items-center gap-1"
                  >
                    <Check size={14} /> Mark Day Complete
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" fill="none" className="text-dark-700" />
              <circle 
                cx="32" cy="32" r="26" 
                stroke="currentColor" 
                strokeWidth="5" 
                fill="none" 
                strokeDasharray={`${26 * 2 * Math.PI}`}
                strokeDashoffset={`${26 * 2 * Math.PI - (progressPercent / 100) * (26 * 2 * Math.PI)}`}
                className="text-accent transition-all duration-500 ease-out" 
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold">{Math.round(progressPercent)}%</span>
          </div>
        </div>
      </section>

      {/* CELEBRATION MODAL */}
      <AnimatePresence>
        {showCelebration && (
          <Modal isOpen={showCelebration} onClose={() => setShowCelebration(false)} title="🎉 Day Completed!">
            <div className="text-center space-y-5 py-2">
              <div className="w-20 h-20 rounded-full bg-accent/20 text-accent mx-auto flex items-center justify-center shadow-xl shadow-accent/20">
                <Trophy size={44} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">ALL COMPLETED! 🏆</h3>
                <p className="text-xs text-accent font-semibold uppercase tracking-wider mt-1">
                  🔥 {streak > 0 ? `${streak} Day Streak!` : 'First Day in the Books!'}
                </p>
              </div>

              <div className="p-4 bg-dark-700/60 rounded-2xl border border-white/5 text-sm text-gray-200 italic leading-relaxed">
                "{todayLog.completionMessage || "Outstanding discipline today! You crushed every set and hit your nutrition goals. Days like this build champions."}"
              </div>

              {/* Day Recap */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-dark-900/60 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-400 block">Workouts Done</span>
                  <span className="font-bold text-accent text-sm">{workouts.length} exercises</span>
                </div>
                <div className="bg-dark-900/60 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-400 block">Calories Consumed</span>
                  <span className="font-bold text-accent2 text-sm">{Math.round(nutrition.calories)} kcal</span>
                </div>
              </div>

              <div className="text-xs text-gray-400">
                ✅ Your complete workout & nutrition stats for today have been permanently saved into your history.
              </div>

              <div className="space-y-2 pt-2">
                <Button 
                  variant="primary" 
                  fullWidth 
                  size="lg"
                  onClick={() => {
                    setShowCelebration(false);
                    navigate('/history');
                  }}
                  icon={<History size={18} />}
                >
                  View in History & Records
                </Button>
                <Button 
                  variant="ghost" 
                  fullWidth 
                  onClick={() => setShowCelebration(false)}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Exercise Technique & Form Modal */}
      <ExerciseModal
        isOpen={!!selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        exerciseName={selectedExerciseForModal}
      />
    </motion.div>
  );
}

function NutritionBar({ label, eaten, target, color, unit }) {
  const percent = getProgressPercentage(eaten, target);
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1">
        <span className="text-gray-300">{label}</span>
        <span>
          <span className="font-bold text-white">{eaten}</span>{' '}
          <span className="text-gray-500 font-normal">/ {target} {unit}</span>
        </span>
      </div>
      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${Math.min(100, percent)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
