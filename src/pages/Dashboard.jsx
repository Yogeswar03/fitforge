import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Calendar, User, CheckCircle2, Circle, Flame, 
  Dumbbell, Utensils, Plus, Sparkles, X, ChevronRight, 
  Apple, History, Trophy, Award, Check, Users, ReceiptText, Settings, PlayCircle, Bot, Activity 
} from 'lucide-react';

import useAuthStore from '../store/useAuthStore';
import useUserStore from '../store/useUserStore';
import useWorkoutStore from '../store/useWorkoutStore';
import useDietStore from '../store/useDietStore';
import useDailyLogStore from '../store/useDailyLogStore';
import { getTodayStr, getProgressPercentage, getDayName, generateId } from '../utils/calculations';
import { syncProfileToCloud } from '../lib/supabaseSync';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ExerciseModal from '../components/ui/ExerciseModal';
import PartnerDietModal from '../components/ui/PartnerDietModal';
import AiMealAgentModal from '../components/ui/AiMealAgentModal';
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
  const { profile, setProfile } = useUserStore();
  const { weeklyPlan: workoutWeeklyPlan } = useWorkoutStore();
  const { weeklyPlan: dietWeeklyPlan, partner } = useDietStore();
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

  // Active View Tab to eliminate congestion ('all' | 'workout' | 'diet' | 'macros')
  const [activeTab, setActiveTab] = useState('all');

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

  // Quick Edit Target Modal state
  const [isEditTargetsModalOpen, setIsEditTargetsModalOpen] = useState(false);
  const [modalCalories, setModalCalories] = useState(profile?.targetCalories || 2000);
  const [modalProtein, setModalProtein] = useState(profile?.targetProtein || 150);
  const [modalCarbs, setModalCarbs] = useState(profile?.targetCarbs || 200);
  const [modalFat, setModalFat] = useState(profile?.targetFat || 65);

  useEffect(() => {
    if (profile) {
      setModalCalories(profile.targetCalories || 2000);
      setModalProtein(profile.targetProtein || 150);
      setModalCarbs(profile.targetCarbs || 200);
      setModalFat(profile.targetFat || 65);
    }
  }, [profile?.targetCalories, profile?.targetProtein, profile?.targetCarbs, profile?.targetFat]);

  const handleSaveModalTargets = (e) => {
    e?.preventDefault();
    const updatedTargets = {
      targetCalories: Number(modalCalories) || 2000,
      targetProtein: Number(modalProtein) || 150,
      targetCarbs: Number(modalCarbs) || 200,
      targetFat: Number(modalFat) || 65,
    };
    setProfile(updatedTargets);
    syncProfileToCloud(null, user?.email, { ...profile, ...updatedTargets });
    setIsEditTargetsModalOpen(false);
  };

  // Celebration Modal
  const [showCelebration, setShowCelebration] = useState(false);

  // Exercise Guide Modal
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);

  // Gym Partner Diet Modal
  const [isPartnerDietModalOpen, setIsPartnerDietModalOpen] = useState(false);

  // AI Meal Agent Modal
  const [isAiMealAgentOpen, setIsAiMealAgentOpen] = useState(false);

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

  // Automatically trigger celebration modal once when all is completed
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
      className="min-h-screen bg-dark-900 text-white p-4 md:p-6 pb-36 max-w-2xl mx-auto space-y-5"
    >
      {/* ============================================================== */}
      {/* TOP HEADER: Clean Brand & Fast Navigation Icons */}
      {/* ============================================================== */}
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black gradient-accent-text tracking-tight">FitForge</h1>
            {streak > 0 && (
              <span className="text-[11px] bg-orange-500/20 text-orange-400 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame size={12} /> {streak}d
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Daily Fitness & Diet Tracking</p>
        </div>

        {/* Quick Nav Icon Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/exercises')}
            className="w-9 h-9 rounded-xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center transition-colors border border-purple-500/30 text-purple-400 hover:text-purple-300 shadow-sm"
            title="Exercise Form Guide & Realistic Demos"
          >
            <PlayCircle size={18} />
          </button>

          <button 
            onClick={() => navigate('/expenses')}
            className="w-9 h-9 rounded-xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center transition-colors border border-white/10 text-emerald-400"
            title="Gym Expenses Splitter"
          >
            <ReceiptText size={18} />
          </button>

          <button 
            onClick={() => navigate('/history')}
            className="w-9 h-9 rounded-xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center transition-colors border border-white/10 text-accent"
            title="View History Log"
          >
            <History size={18} />
          </button>

          <button 
            onClick={() => navigate('/calendar')}
            className="w-9 h-9 rounded-xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center transition-colors border border-white/10 text-accent2"
            title="View Calendar Grid"
          >
            <Calendar size={18} />
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-xl bg-dark-800 hover:bg-dark-700 flex items-center justify-center transition-colors border border-white/10 overflow-hidden"
            title="Profile & Settings"
          >
            <User size={18} className="text-gray-300" />
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* TODAY FOCUS CARD: Airy, Compact, Informative */}
      {/* ============================================================== */}
      <section className="glass rounded-3xl p-5 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div className="flex justify-between items-center relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black">{getDayName(dayOfWeek)}</h2>
              <span className="text-[10px] bg-accent text-dark-900 font-extrabold px-2 py-0.5 rounded-full">
                TODAY
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">{format(todayDate, 'MMMM d, yyyy')}</p>
            <div className="mt-2 text-accent font-bold text-sm flex items-center gap-1.5">
              <span>{todayWorkoutTemplate.isRestDay ? 'Rest & Recovery 😴' : (todayWorkoutTemplate.name || 'Workout Day 💪')}</span>
            </div>
          </div>

          {/* Activity Progress Circle */}
          <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" fill="none" className="text-dark-800" />
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
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-black">{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SLEEK QUICK ACTION STRIP (1 Compact Row to prevent congestion) */}
      {/* ============================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setIsAiMealAgentOpen(true)}
          className="flex-shrink-0 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <Bot size={15} className="text-emerald-400" />
          <span>AI Meal Logger</span>
          <span className="text-[9px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded-full uppercase">Instant</span>
        </button>

        <button
          onClick={() => navigate('/exercises')}
          className="flex-shrink-0 bg-dark-800 hover:bg-dark-700 text-purple-300 border border-purple-500/30 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <PlayCircle size={15} className="text-purple-400" />
          <span>Exercise Visuals</span>
        </button>

        {partner ? (
          <button
            onClick={() => setIsPartnerDietModalOpen(true)}
            className="flex-shrink-0 bg-dark-800 hover:bg-dark-700 text-blue-300 border border-blue-500/30 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <span>👫</span>
            <span>Partner: {partner.name}</span>
          </button>
        ) : (
          <button
            onClick={() => setIsPartnerDietModalOpen(true)}
            className="flex-shrink-0 bg-dark-800 hover:bg-dark-700 text-gray-300 border border-white/10 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Users size={15} className="text-blue-400" />
            <span>Sync Partner</span>
          </button>
        )}

        <button
          onClick={() => navigate('/expenses')}
          className="flex-shrink-0 bg-dark-800 hover:bg-dark-700 text-gray-300 border border-white/10 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <ReceiptText size={15} className="text-emerald-400" />
          <span>Expenses</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* DASHBOARD VIEW TABS: Solves congestion completely! */}
      {/* ============================================================== */}
      <div className="flex bg-dark-800/80 p-1 rounded-2xl border border-white/5">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-accent to-accent2 text-dark-900 shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('workout')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'workout'
              ? 'bg-gradient-to-r from-accent to-accent2 text-dark-900 shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Dumbbell size={13} /> Workouts ({workouts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('diet')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'diet'
              ? 'bg-gradient-to-r from-accent to-accent2 text-dark-900 shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Utensils size={13} /> Diet ({meals.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('macros')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'macros'
              ? 'bg-gradient-to-r from-accent to-accent2 text-dark-900 shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Activity size={13} /> Macros
        </button>
      </div>

      {/* ============================================================== */}
      {/* WORKOUT SECTION (Shown in 'all' or 'workout' tab) */}
      {/* ============================================================== */}
      {(activeTab === 'all' || activeTab === 'workout') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Dumbbell className="text-accent" size={20} />
              Today's Workout
              {workouts.length > 0 && (
                <span className="text-xs bg-dark-700 px-2 py-0.5 rounded-full text-accent font-bold">
                  {workouts.filter((w) => w.completed).length}/{workouts.length}
                </span>
              )}
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQuickAddExOpen(true)}
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-xl"
              >
                <Plus size={13} /> Add
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
            <div className="glass-strong rounded-3xl p-5 text-center text-gray-400 space-y-1.5 border border-white/5">
              <span className="text-3xl block">🧘</span>
              <div className="font-semibold text-white text-sm">Scheduled as Rest Day</div>
              <p className="text-xs text-gray-400">Take time to recover, stretch, and nourish your body!</p>
            </div>
          ) : workouts.length === 0 ? (
            <div className="glass-strong rounded-3xl p-5 text-center space-y-2.5 border border-dashed border-dark-700">
              <Dumbbell size={32} className="mx-auto text-accent opacity-40" />
              <div>
                <p className="font-semibold text-white text-sm">No exercises planned for today.</p>
                <p className="text-xs text-gray-400 mt-0.5">Add an exercise or set your weekly routine.</p>
              </div>
              <div className="flex gap-2 justify-center pt-1">
                <Button variant="primary" size="sm" onClick={() => navigate('/plan/workout')}>
                  Set Plan →
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsQuickAddExOpen(true)} icon={<Plus size={14} />}>
                  Quick Add
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {workouts.map((exercise) => {
                const details = getExerciseDetails(exercise.name);
                return (
                  <div
                    key={exercise.id}
                    onClick={() => handleToggleExercise(exercise.id)}
                    className={`glass-strong rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 cursor-pointer transition-all border ${
                      exercise.completed ? 'border-accent/40 bg-dark-800/40 opacity-70' : 'border-white/5 hover:border-white/15'
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
                        <CheckCircle2 size={24} className="text-accent fill-accent/20" />
                      ) : (
                        <Circle size={24} className="text-gray-500 hover:text-gray-300" />
                      )}
                    </button>

                    {/* Realistic Athlete Photo Thumbnail */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExerciseForModal(exercise.name);
                      }}
                      className="relative w-12 h-12 rounded-xl overflow-hidden bg-dark-900 border border-white/10 flex-shrink-0 group cursor-pointer hover:border-accent transition-colors shadow-sm"
                      title="Tap to view realistic demonstration & muscles"
                    >
                      <img
                        src={details?.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80'}
                        alt={exercise.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="absolute bottom-0 right-0 bg-dark-950/80 text-[8px] text-accent px-1 rounded-tl font-bold">
                        Demo
                      </span>
                    </div>

                    <div className={`flex-1 min-w-0 ${exercise.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-sm leading-snug truncate">{exercise.name}</p>
                        {details?.category && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-dark-700 text-gray-300 rounded font-medium">
                            {details.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {exercise.sets} sets × {exercise.reps} reps {exercise.weight > 0 ? `• ${exercise.weight} kg` : ''}
                      </p>
                    </div>

                    {exercise.completed ? (
                      <span className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full flex-shrink-0">
                        DONE
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExerciseForModal(exercise.name);
                        }}
                        className="text-xs text-purple-400 hover:text-purple-300 p-1.5 rounded-xl hover:bg-dark-700 transition-colors flex-shrink-0"
                        title="View Exercise Real Human Guide"
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
      )}

      {/* ============================================================== */}
      {/* DIET SECTION (Shown in 'all' or 'diet' tab) */}
      {/* ============================================================== */}
      {(activeTab === 'all' || activeTab === 'diet') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Utensils className="text-accent2" size={20} />
              Today's Meals
              {meals.length > 0 && (
                <span className="text-xs bg-dark-700 px-2 py-0.5 rounded-full text-accent2 font-bold">
                  {meals.filter((m) => m.completed).length}/{meals.length}
                </span>
              )}
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAiMealAgentOpen(true)}
                className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-xl"
              >
                <Bot size={13} /> AI Log
              </button>
              <button
                onClick={() => navigate('/log')}
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-xl"
              >
                <Plus size={13} /> Food
              </button>
              <button
                onClick={() => navigate('/plan/diet')}
                className="text-xs font-semibold text-gray-300 hover:text-white hover:underline flex items-center gap-0.5"
              >
                Plan →
              </button>
            </div>
          </div>

          {meals.length === 0 && loggedFoods.length === 0 ? (
            <div className="glass-strong rounded-3xl p-5 text-center space-y-2.5 border border-dashed border-dark-700">
              <Apple size={32} className="mx-auto text-accent2 opacity-40" />
              <div>
                <p className="font-semibold text-white text-sm">No diet plan set for today.</p>
                <p className="text-xs text-gray-400 mt-0.5">Use the AI Meal Agent to write what you ate or set a meal plan.</p>
              </div>
              <div className="flex gap-2 justify-center pt-1">
                <Button variant="primary" size="sm" onClick={() => setIsAiMealAgentOpen(true)} icon={<Bot size={14} />}>
                  AI Quick Log
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/plan/diet')}>
                  Set Plan →
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {meals.map((meal) => {
                const mealCalories = (meal.foods || []).reduce((sum, f) => sum + Number(f.calories || 0), 0);
                return (
                  <div
                    key={meal.id}
                    onClick={() => handleToggleMeal(meal.id)}
                    className={`glass-strong rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 cursor-pointer transition-all border ${
                      meal.completed ? 'border-accent/40 bg-dark-800/40 opacity-70' : 'border-white/5 hover:border-white/15'
                    }`}
                  >
                    <button className="flex-shrink-0 text-accent">
                      {meal.completed ? (
                        <CheckCircle2 size={24} className="text-accent fill-accent/20" />
                      ) : (
                        <Circle size={24} className="text-gray-500 hover:text-gray-300" />
                      )}
                    </button>

                    <span className="text-xl">{getMealEmoji(meal.type)}</span>

                    <div className={`flex-1 min-w-0 ${meal.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                      <p className="font-bold text-sm leading-snug truncate">{meal.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {mealCalories > 0 ? `${Math.round(mealCalories)} kcal` : 'Planned slot'}
                        {meal.time ? ` • ${meal.time}` : ''}
                      </p>
                    </div>

                    {meal.completed && (
                      <span className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full flex-shrink-0">
                        TAKEN
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Extra Logged Foods */}
              {loggedFoods.length > 0 && (
                <div className="pt-1 space-y-1">
                  <div className="text-[11px] font-semibold text-gray-400 px-1">
                    Extra Foods Logged ({loggedFoods.length}):
                  </div>
                  {loggedFoods.map((f) => (
                    <div 
                      key={f.id} 
                      className="glass p-2.5 rounded-xl flex justify-between items-center text-xs border border-white/5"
                    >
                      <span className="font-semibold text-white">{f.name}</span>
                      <div className="flex gap-2 items-center">
                        <span className="text-accent font-bold">{f.calories} kcal</span>
                        <span className="text-gray-400 font-medium">({f.qty}{f.unit || 'g'})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ============================================================== */}
      {/* MACROS & VITALS SECTION (Shown in 'all' or 'macros' tab) */}
      {/* ============================================================== */}
      {(activeTab === 'all' || activeTab === 'macros') && (
        <section className="glass rounded-3xl p-5 border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              📊 Daily Nutrition vs Targets
            </h3>
            <button 
              onClick={() => setIsEditTargetsModalOpen(true)}
              className="text-xs text-accent2 hover:underline font-semibold flex items-center gap-1 bg-accent2/10 px-2.5 py-1 rounded-xl"
            >
              <Settings size={13} /> Edit Targets
            </button>
          </div>

          <div className="space-y-3">
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

          {/* Steps & Water Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div 
              onClick={() => updateSteps(todayStr, steps + 500)}
              className="bg-dark-800/80 rounded-2xl p-3.5 cursor-pointer border border-white/5 active:scale-95 transition-transform"
            >
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-base">🚶</span>
                <span className="text-[10px] text-accent font-semibold">+500</span>
              </div>
              <p className="font-extrabold text-lg">{steps}</p>
              <p className="text-[11px] text-gray-400">/ {profile?.targetSteps || 10000} steps</p>
              <div className="h-1.5 bg-dark-700 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${Math.min(100, getProgressPercentage(steps, profile?.targetSteps || 10000))}%` }}
                />
              </div>
            </div>

            <div 
              onClick={() => updateWater(todayStr, water + 1)}
              className="bg-dark-800/80 rounded-2xl p-3.5 cursor-pointer border border-white/5 active:scale-95 transition-transform"
            >
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-base">💧</span>
                <span className="text-[10px] text-accent2 font-semibold">+1 glass</span>
              </div>
              <p className="font-extrabold text-lg">{water}</p>
              <p className="text-[11px] text-gray-400">/ 8 glasses</p>
              <div className="h-1.5 bg-dark-700 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-accent2 transition-all duration-300"
                  style={{ width: `${Math.min(100, getProgressPercentage(water, 8))}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* DAY COMPLETION STATUS FOOTER */}
      {/* ============================================================== */}
      <section className={`glass rounded-3xl p-5 border transition-all ${
        todayLog.dayCompleted ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10' : 'border-white/5'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            {todayLog.dayCompleted ? (
              <>
                <div className="flex items-center gap-1.5">
                  <Trophy className="text-accent" size={20} />
                  <p className="font-extrabold text-accent text-lg">Day 100% Completed! 🏆</p>
                </div>
                <p className="text-xs text-gray-300 max-w-sm">
                  {todayLog.completionMessage || "Outstanding job! Your day is permanently logged in history."}
                </p>
              </>
            ) : (
              <>
                <p className="font-extrabold text-white text-base">
                  {completedActivities}/{totalActivities} activities done
                </p>
                <p className="text-xs text-gray-400">
                  Check off exercises and meals, or mark complete when done.
                </p>
                <div className="pt-1.5">
                  <button
                    onClick={handleManualComplete}
                    className="text-xs bg-accent text-dark-900 font-bold px-3 py-1.5 rounded-xl shadow-md active:scale-95 transition-all inline-flex items-center gap-1"
                  >
                    <Check size={14} /> Mark Day Complete
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4.5" fill="none" className="text-dark-700" />
              <circle 
                cx="28" cy="28" r="22" 
                stroke="currentColor" 
                strokeWidth="4.5" 
                fill="none" 
                strokeDasharray={`${22 * 2 * Math.PI}`}
                strokeDashoffset={`${22 * 2 * Math.PI - (progressPercent / 100) * (22 * 2 * Math.PI)}`}
                className="text-accent transition-all duration-500 ease-out" 
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold">{Math.round(progressPercent)}%</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MODALS */}
      {/* ============================================================== */}
      {/* Exercise Guide Modal */}
      <ExerciseModal
        isOpen={!!selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        exerciseName={selectedExerciseForModal}
      />

      {/* Quick Add Exercise Modal */}
      <Modal isOpen={isQuickAddExOpen} onClose={() => setIsQuickAddExOpen(false)} title="Quick Add Exercise">
        <form onSubmit={handleQuickAddExercise} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Exercise Name</label>
            <input
              type="text"
              value={quickExName}
              onChange={(e) => setQuickExName(e.target.value)}
              placeholder="e.g. Incline Dumbbell Press"
              className="w-full bg-dark-800 border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-accent text-sm"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium">Sets</label>
              <input
                type="number"
                value={quickExSets}
                onChange={(e) => setQuickExSets(e.target.value)}
                className="w-full bg-dark-800 border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-accent text-sm text-center"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium">Reps</label>
              <input
                type="number"
                value={quickExReps}
                onChange={(e) => setQuickExReps(e.target.value)}
                className="w-full bg-dark-800 border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-accent text-sm text-center"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium">Weight (kg)</label>
              <input
                type="number"
                value={quickExWeight}
                onChange={(e) => setQuickExWeight(e.target.value)}
                className="w-full bg-dark-800 border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-accent text-sm text-center"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth className="mt-2">
            Add to Today
          </Button>
        </form>
      </Modal>

      {/* Edit Targets Modal */}
      <Modal isOpen={isEditTargetsModalOpen} onClose={() => setIsEditTargetsModalOpen(false)} title="Customize Targets">
        <form onSubmit={handleSaveModalTargets} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium">Daily Calories (kcal)</label>
            <input
              type="number"
              value={modalCalories}
              onChange={(e) => setModalCalories(e.target.value)}
              className="w-full bg-dark-800 border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium">Protein (g)</label>
              <input
                type="number"
                value={modalProtein}
                onChange={(e) => setModalProtein(e.target.value)}
                className="w-full bg-dark-800 border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-accent text-sm text-center"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium">Carbs (g)</label>
              <input
                type="number"
                value={modalCarbs}
                onChange={(e) => setModalCarbs(e.target.value)}
                className="w-full bg-dark-800 border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-accent text-sm text-center"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium">Fat (g)</label>
              <input
                type="number"
                value={modalFat}
                onChange={(e) => setModalFat(e.target.value)}
                className="w-full bg-dark-800 border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-accent text-sm text-center"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth className="mt-2">
            Save Targets
          </Button>
        </form>
      </Modal>

      {/* Gym Partner Diet Modal */}
      <PartnerDietModal
        isOpen={isPartnerDietModalOpen}
        onClose={() => setIsPartnerDietModalOpen(false)}
      />

      {/* AI Meal Agent Modal */}
      <AiMealAgentModal
        isOpen={isAiMealAgentOpen}
        onClose={() => setIsAiMealAgentOpen(false)}
      />

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <Modal isOpen={showCelebration} onClose={() => setShowCelebration(false)} title="🎉 Day Completed!">
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-accent/20 text-accent mx-auto flex items-center justify-center shadow-xl shadow-accent/20">
                <Trophy size={36} />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">ALL COMPLETED! 🏆</h3>
                <p className="text-xs text-accent font-semibold uppercase tracking-wider mt-0.5">
                  🔥 {streak > 0 ? `${streak} Day Streak!` : 'Great Job Today!'}
                </p>
              </div>

              <div className="p-3 bg-dark-700/60 rounded-2xl border border-white/5 text-xs text-gray-200 italic leading-relaxed">
                "{todayLog.completionMessage || "Outstanding discipline today! You crushed every set and hit your nutrition goals."}"
              </div>

              <Button variant="primary" fullWidth onClick={() => setShowCelebration(false)}>
                Awesome!
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NutritionBar({ label, eaten, target, color, unit }) {
  const percentage = target > 0 ? Math.min(100, Math.round((eaten / target) * 100)) : 0;
  return (
    <div className="space-y-1 text-xs">
      <div className="flex justify-between items-center">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className="font-bold text-white">
          {eaten} / {target} <span className="text-gray-400 font-normal">{unit}</span>
          <span className="text-[10px] text-gray-400 ml-1.5 font-normal">({percentage}%)</span>
        </span>
      </div>
      <div className="h-2 w-full bg-dark-700/60 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
