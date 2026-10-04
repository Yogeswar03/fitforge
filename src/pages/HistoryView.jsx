import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, compareDesc } from 'date-fns';
import { 
  History, Calendar, Trophy, Flame, Dumbbell, Utensils, 
  ChevronDown, ChevronUp, CheckCircle2, XCircle, Sparkles, 
  Activity, Droplets, Scale, Apple, ArrowRight 
} from 'lucide-react';

import useDailyLogStore from '../store/useDailyLogStore';
import useUserStore from '../store/useUserStore';
import Button from '../components/ui/Button';
import ExerciseModal from '../components/ui/ExerciseModal';
import { getExerciseDetails } from '../data/exerciseDatabase';

export default function HistoryView() {
  const navigate = useNavigate();
  const { logs, getStreak } = useDailyLogStore();
  const { profile } = useUserStore();

  const [expandedDate, setExpandedDate] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'completed'
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);

  const streak = getStreak ? getStreak() : 0;

  // Sort logged dates in reverse chronological order (newest first)
  const sortedDates = useMemo(() => {
    return Object.keys(logs || {})
      .sort((a, b) => b.localeCompare(a));
  }, [logs]);

  const filteredDates = useMemo(() => {
    if (filterType === 'completed') {
      return sortedDates.filter((dateStr) => logs[dateStr]?.dayCompleted);
    }
    return sortedDates;
  }, [sortedDates, logs, filterType]);

  const totalCompletedDays = Object.values(logs || {}).filter((l) => l.dayCompleted).length;
  const totalDaysRecorded = sortedDates.length;
  const completionRate = totalDaysRecorded > 0 ? Math.round((totalCompletedDays / totalDaysRecorded) * 100) : 0;

  const toggleExpand = (dateStr) => {
    setExpandedDate((prev) => (prev === dateStr ? null : dateStr));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen bg-dark-900 text-white p-4 md:p-6 pb-32 max-w-2xl mx-auto space-y-6"
    >
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold gradient-accent-text flex items-center gap-2">
            <History size={28} className="text-accent" /> History & Records
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Every workout, meal, and achievement saved from Day 1
          </p>
        </div>

        <button
          onClick={() => navigate('/calendar')}
          className="flex items-center gap-1.5 bg-dark-800 hover:bg-dark-700 text-accent font-bold px-3.5 py-2 rounded-2xl border border-white/5 text-xs transition-colors"
        >
          <Calendar size={16} />
          <span>Calendar</span>
        </button>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass p-4 rounded-3xl text-center border border-white/5">
          <div className="text-2xl font-black text-accent">{totalCompletedDays}</div>
          <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Days Completed</div>
        </div>

        <div className="glass p-4 rounded-3xl text-center border border-white/5">
          <div className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
            <Flame size={20} /> {streak}
          </div>
          <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Day Streak</div>
        </div>

        <div className="glass p-4 rounded-3xl text-center border border-white/5">
          <div className="text-2xl font-black text-accent2">{completionRate}%</div>
          <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">Success Rate</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-dark-800 rounded-2xl border border-white/5">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
            filterType === 'all' ? 'bg-dark-700 text-accent shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          All Recorded Days ({totalDaysRecorded})
        </button>
        <button
          onClick={() => setFilterType('completed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
            filterType === 'completed' ? 'bg-dark-700 text-accent shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          🏆 Completed Only ({totalCompletedDays})
        </button>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredDates.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center space-y-3 border border-dashed border-dark-700">
            <History size={40} className="mx-auto text-accent opacity-40" />
            <h3 className="font-bold text-lg text-white">No history records found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              As you complete workouts and log your nutrition, your daily records will be saved here automatically!
            </p>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={() => navigate('/')}>
                Go to Today's Dashboard →
              </Button>
            </div>
          </div>
        ) : (
          filteredDates.map((dateStr) => {
            const dayLog = logs[dateStr] || {};
            const isExpanded = expandedDate === dateStr;
            const workouts = dayLog.workouts || [];
            const meals = dayLog.meals || [];
            const loggedFoods = dayLog.loggedFoods || [];
            const nutrition = dayLog.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
            
            const completedWorkoutsCount = workouts.filter((w) => w.completed).length;
            const completedMealsCount = meals.filter((m) => m.completed).length;

            let formattedDate = dateStr;
            try {
              const [y, m, d] = dateStr.split('-');
              const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
              formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');
            } catch (e) {
              formattedDate = dateStr;
            }

            return (
              <div 
                key={dateStr}
                className="glass-strong rounded-3xl border border-white/5 overflow-hidden transition-all"
              >
                {/* Day Card Header (Tappable) */}
                <div 
                  onClick={() => toggleExpand(dateStr)}
                  className="p-5 cursor-pointer flex justify-between items-center hover:bg-dark-800/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">{formattedDate}</span>
                      {dayLog.dayCompleted ? (
                        <span className="text-[10px] bg-accent/20 text-accent font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={12} /> COMPLETED
                        </span>
                      ) : (
                        <span className="text-[10px] bg-yellow-400/10 text-yellow-400 font-bold px-2 py-0.5 rounded-full">
                          PARTIAL
                        </span>
                      )}
                    </div>

                    {/* Quick Stats Line */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                      <span>🏋️ {completedWorkoutsCount}/{workouts.length} exercises</span>
                      <span>•</span>
                      <span>🍽️ {completedMealsCount}/{meals.length} meals</span>
                      <span>•</span>
                      <span className="text-accent font-semibold">{Math.round(nutrition.calories)} kcal</span>
                      {dayLog.steps > 0 && <span>• 🚶 {dayLog.steps} steps</span>}
                    </div>
                  </div>

                  <button className="p-2 text-gray-400 hover:text-white">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {/* Expanded Full Day Breakdown */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 pt-1 space-y-4 border-t border-white/5 bg-dark-900/40"
                    >
                      {/* Trainer Completion Message */}
                      {dayLog.completionMessage && (
                        <div className="p-3 bg-accent/10 border border-accent/20 rounded-2xl text-xs text-accent flex items-start gap-2">
                          <Sparkles size={16} className="flex-shrink-0 mt-0.5" />
                          <span>{dayLog.completionMessage}</span>
                        </div>
                      )}

                      {/* Nutrition Totals */}
                      <div className="bg-dark-800/80 p-4 rounded-2xl border border-white/5 space-y-2">
                        <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                          Day Nutrition Summary
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-dark-900/60 p-2 rounded-xl">
                            <span className="text-[10px] text-gray-400 block">Calories</span>
                            <span className="font-bold text-accent">{Math.round(nutrition.calories)}</span>
                          </div>
                          <div className="bg-dark-900/60 p-2 rounded-xl">
                            <span className="text-[10px] text-gray-400 block">Protein</span>
                            <span className="font-bold text-red-400">{Math.round(nutrition.protein)}g</span>
                          </div>
                          <div className="bg-dark-900/60 p-2 rounded-xl">
                            <span className="text-[10px] text-gray-400 block">Carbs</span>
                            <span className="font-bold text-accent2">{Math.round(nutrition.carbs)}g</span>
                          </div>
                          <div className="bg-dark-900/60 p-2 rounded-xl">
                            <span className="text-[10px] text-gray-400 block">Fat</span>
                            <span className="font-bold text-yellow-400">{Math.round(nutrition.fat)}g</span>
                          </div>
                        </div>
                      </div>

                      {/* Workouts Detail */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                          <Dumbbell size={16} className="text-accent" /> Workouts Performed
                        </div>
                        {workouts.length === 0 ? (
                          <div className="text-xs text-gray-500 italic pl-1">No workout recorded on this day.</div>
                        ) : (
                          <div className="space-y-1.5">
                            {workouts.map((w, idx) => {
                              const details = getExerciseDetails(w.name);
                              return (
                                <div 
                                  key={idx}
                                  className="bg-dark-800 p-2 sm:p-2.5 rounded-xl flex items-center justify-between text-xs border border-white/5 gap-2"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    {w.completed ? (
                                      <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                                    ) : (
                                      <XCircle size={16} className="text-gray-500 flex-shrink-0" />
                                    )}

                                    {/* Exercise Thumbnail */}
                                    <div 
                                      onClick={() => setSelectedExerciseForModal(w.name)}
                                      className="relative w-8 h-8 rounded-lg overflow-hidden bg-dark-900 border border-white/10 flex-shrink-0 cursor-pointer hover:border-accent/60 transition-colors"
                                      title="Tap to view form guide"
                                    >
                                      <img
                                        src={details?.image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80'}
                                        alt={w.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                          e.target.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80';
                                        }}
                                      />
                                    </div>

                                    <div className="min-w-0">
                                      <span className={`font-semibold truncate block ${w.completed ? 'text-white' : 'text-gray-400'}`}>
                                        {w.name}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-gray-400 text-[11px]">
                                      {w.sets}×{w.reps} {w.weight > 0 ? `• ${w.weight}kg` : ''}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedExerciseForModal(w.name)}
                                      className="text-gray-400 hover:text-accent p-1"
                                      title="Form Guide"
                                    >
                                      <Sparkles size={13} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Meals & Foods Logged */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                          <Utensils size={16} className="text-accent2" /> Meals & Foods Eaten
                        </div>
                        {meals.length === 0 && loggedFoods.length === 0 ? (
                          <div className="text-xs text-gray-500 italic pl-1">No meals logged on this day.</div>
                        ) : (
                          <div className="space-y-1.5">
                            {meals.map((m, idx) => (
                              <div key={idx} className="bg-dark-800 p-2.5 rounded-xl text-xs border border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  {m.completed ? (
                                    <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                                  ) : (
                                    <XCircle size={16} className="text-gray-500 flex-shrink-0" />
                                  )}
                                  <span className={`font-semibold ${m.completed ? 'text-white' : 'text-gray-400'}`}>{m.name}</span>
                                </div>
                                <span className="text-gray-400">
                                  {m.foods?.reduce((sum, f) => sum + Number(f.calories || 0), 0) || 0} kcal
                                </span>
                              </div>
                            ))}

                            {loggedFoods.map((f, idx) => (
                              <div key={idx} className="bg-dark-800 p-2.5 rounded-xl text-xs border border-white/5 flex justify-between items-center">
                                <div>
                                  <span className="font-semibold text-white">{f.name}</span>
                                  {f.itemsUsed && <span className="text-gray-500 ml-1.5 italic">({f.itemsUsed})</span>}
                                </div>
                                <div className="text-accent font-semibold">
                                  {f.calories} kcal ({f.qty}{f.unit || 'g'})
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Activity & Vitals */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-dark-800 p-2 rounded-xl border border-white/5">
                          <span className="text-[10px] text-gray-400 block">Steps</span>
                          <span className="font-bold text-white">🚶 {dayLog.steps || 0}</span>
                        </div>
                        <div className="bg-dark-800 p-2 rounded-xl border border-white/5">
                          <span className="text-[10px] text-gray-400 block">Water</span>
                          <span className="font-bold text-accent2">💧 {dayLog.water || 0} gls</span>
                        </div>
                        <div className="bg-dark-800 p-2 rounded-xl border border-white/5">
                          <span className="text-[10px] text-gray-400 block">Weight</span>
                          <span className="font-bold text-purple-300">
                            ⚖️ {dayLog.weight ? `${dayLog.weight} kg` : '-'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Exercise Technique & Form Modal */}
      <ExerciseModal
        isOpen={!!selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        exerciseName={selectedExerciseForModal}
      />
    </motion.div>
  );
}
