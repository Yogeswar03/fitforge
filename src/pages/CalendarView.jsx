import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay, 
  isBefore, 
  isAfter, 
  subMonths, 
  addMonths, 
  startOfWeek, 
  endOfWeek, 
  differenceInDays 
} from 'date-fns';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  History, Trophy, Dumbbell, Utensils, CheckCircle2, 
  XCircle, Sparkles, Activity, Droplets, Scale, ArrowRight 
} from 'lucide-react';

import useDailyLogStore from '../store/useDailyLogStore';
import useUserStore from '../store/useUserStore';
import ExerciseModal from '../components/ui/ExerciseModal';
import { getExerciseDetails } from '../data/exerciseDatabase';
import Button from '../components/ui/Button';

export default function CalendarView() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);
  
  const { logs, getStreak } = useDailyLogStore();
  const { profile } = useUserStore();
  
  const todayDate = new Date();
  const startDate = profile?.startDate ? new Date(profile.startDate) : todayDate;
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const totalDays = Math.max(1, differenceInDays(todayDate, startDate) + 1);
  const completedDaysCount = Object.values(logs || {}).filter((log) => log.dayCompleted).length;
  const streak = getStreak ? getStreak() : 0;
  
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedLog = logs[selectedDateStr];

  const getDayStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (isBefore(date, startOfDay(startDate))) return 'inactive';
    if (isAfter(date, todayDate)) return 'future';
    
    const log = logs[dateStr];
    if (!log) return 'missed';
    
    if (log.dayCompleted) return 'completed';
    
    const hasWorkouts = log.workouts?.some((w) => w.completed);
    const hasMeals = log.meals?.some((m) => m.completed);
    const hasFoods = (log.loggedFoods || []).length > 0;
    
    if (hasWorkouts || hasMeals || hasFoods || (log.steps && log.steps > 0)) return 'partial';
    
    return 'missed';
  };

  const getStatusClasses = (status, isSelected, isToday) => {
    let classes = 'flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all relative ';
    
    if (isSelected) {
      classes += 'ring-2 ring-accent ring-offset-2 ring-offset-dark-900 font-bold scale-110 ';
    } else if (isToday) {
      classes += 'border border-accent ';
    }
    
    switch (status) {
      case 'completed':
        return classes + 'bg-accent/20 text-accent font-bold';
      case 'partial':
        return classes + 'bg-yellow-400/20 text-yellow-400 font-bold';
      case 'missed':
        return classes + 'bg-red-500/10 text-gray-500';
      case 'future':
        return classes + 'bg-transparent text-gray-600';
      case 'inactive':
      default:
        return classes + 'bg-transparent text-gray-700 opacity-30';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <span className="absolute -bottom-1 -right-1 text-[11px]">✅</span>;
      case 'partial': return <span className="absolute -bottom-1 -right-1 text-[11px]">🟡</span>;
      case 'missed': return <span className="absolute -bottom-1 -right-1 text-[11px]">❌</span>;
      default: return null;
    }
  };

  function startOfDay(d) {
    const newD = new Date(d);
    newD.setHours(0, 0, 0, 0);
    return newD;
  }

  // Selected Day Details
  const selectedWorkouts = selectedLog?.workouts || [];
  const selectedMeals = selectedLog?.meals || [];
  const selectedFoods = selectedLog?.loggedFoods || [];
  const selectedNutrition = selectedLog?.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  const completedWorkouts = selectedWorkouts.filter((w) => w.completed).length;
  const completedMeals = selectedMeals.filter((m) => m.completed).length;

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
            <CalendarIcon size={28} className="text-accent" /> Calendar Journey
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Tap any date to inspect full workout & nutrition records
          </p>
        </div>

        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-1.5 bg-dark-800 hover:bg-dark-700 text-accent font-bold px-3.5 py-2 rounded-2xl border border-white/5 text-xs transition-colors"
        >
          <History size={16} />
          <span>List History</span>
        </button>
      </div>

      {/* Progress Journey Card */}
      <div className="glass rounded-3xl p-5 border border-white/5 flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-400 font-semibold uppercase">Journey Stats</div>
          <div className="text-xl font-bold text-white mt-1">
            {completedDaysCount} Days Completed
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Member since {format(startDate, 'MMM d, yyyy')}
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-400 font-semibold uppercase">Current Streak</div>
          <div className="text-2xl font-black text-orange-400 flex items-center justify-end gap-1 mt-1">
            <span className="text-xl">🔥</span> {streak} Days
          </div>
        </div>
      </div>

      {/* Month Calendar Section */}
      <section className="glass-strong rounded-3xl p-5 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="p-2 hover:bg-dark-700 rounded-full transition-colors">
            <ChevronLeft size={22} />
          </button>
          <h2 className="text-lg font-bold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-dark-700 rounded-full transition-colors">
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i}>{day}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-3 justify-items-center">
          {calendarDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, todayDate);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const status = getDayStatus(day);
            
            return (
              <button
                key={i}
                onClick={() => status !== 'inactive' && status !== 'future' && setSelectedDate(day)}
                disabled={status === 'inactive' || status === 'future'}
                className={getStatusClasses(status, isSelected, isToday)}
                style={{ opacity: isCurrentMonth ? 1 : 0.25 }}
              >
                {format(day, 'd')}
                {getStatusBadge(status)}
              </button>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="flex justify-center gap-4 text-[11px] text-gray-400 pt-3 border-t border-white/5">
          <span className="flex items-center gap-1"><span>✅</span> Completed</span>
          <span className="flex items-center gap-1"><span>🟡</span> Partial</span>
          <span className="flex items-center gap-1"><span>❌</span> Missed</span>
        </div>
      </section>

      {/* DETAILED HISTORY FOR SELECTED DATE */}
      <section className="glass rounded-3xl p-6 border border-white/5 space-y-5">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            <span className="text-xs text-gray-400">Selected Date History Record</span>
          </div>

          <div>
            {isSameDay(selectedDate, todayDate) ? (
              <span className="text-xs bg-accent text-dark-900 font-extrabold px-3 py-1 rounded-full">
                TODAY
              </span>
            ) : selectedLog?.dayCompleted ? (
              <span className="text-xs bg-accent/20 text-accent font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 size={14} /> COMPLETED
              </span>
            ) : (
              <span className="text-xs bg-dark-700 text-gray-300 font-medium px-3 py-1 rounded-full">
                {selectedLog ? 'Partial Record' : 'No Activity'}
              </span>
            )}
          </div>
        </div>

        {!selectedLog ? (
          <div className="text-center py-8 text-gray-400 space-y-2">
            <CalendarIcon size={32} className="mx-auto opacity-30 text-gray-400" />
            <p className="text-sm font-semibold text-gray-300">No records saved for this date.</p>
            <p className="text-xs text-gray-500">Pick any past active day above to see its workout and diet breakdown.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Completion Praise Banner if Completed */}
            {selectedLog.dayCompleted && (
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-2xl text-xs text-accent flex items-start gap-2.5">
                <Trophy size={18} className="flex-shrink-0 text-accent mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white mb-0.5">Day Complete! 🏆</div>
                  <div>
                    {selectedLog.completionMessage || 'Outstanding work! All goals and targets were crushed on this day.'}
                  </div>
                </div>
              </div>
            )}

            {/* Nutrition Intake Breakdown */}
            <div className="bg-dark-800/80 p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Nutrition Consumed</span>
                <span className="text-accent font-bold text-sm">{Math.round(selectedNutrition.calories)} kcal</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                <div className="bg-dark-900/60 p-2 rounded-xl">
                  <span className="text-[10px] text-gray-400 block">Calories</span>
                  <span className="font-bold text-accent">{Math.round(selectedNutrition.calories)}</span>
                </div>
                <div className="bg-dark-900/60 p-2 rounded-xl">
                  <span className="text-[10px] text-gray-400 block">Protein</span>
                  <span className="font-bold text-red-400">{Math.round(selectedNutrition.protein)}g</span>
                </div>
                <div className="bg-dark-900/60 p-2 rounded-xl">
                  <span className="text-[10px] text-gray-400 block">Carbs</span>
                  <span className="font-bold text-accent2">{Math.round(selectedNutrition.carbs)}g</span>
                </div>
                <div className="bg-dark-900/60 p-2 rounded-xl">
                  <span className="text-[10px] text-gray-400 block">Fat</span>
                  <span className="font-bold text-yellow-400">{Math.round(selectedNutrition.fat)}g</span>
                </div>
              </div>
            </div>

            {/* Workouts History */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-300">
                <span className="flex items-center gap-1.5"><Dumbbell size={16} className="text-accent" /> Workouts</span>
                <span className="text-accent font-semibold">{completedWorkouts}/{selectedWorkouts.length} Completed</span>
              </div>

              {selectedWorkouts.length === 0 ? (
                <div className="text-xs text-gray-500 italic p-2 bg-dark-800 rounded-xl">
                  No scheduled exercises on this date.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {selectedWorkouts.map((w, idx) => {
                    const details = getExerciseDetails(w.name);
                    return (
                      <div 
                        key={idx}
                        className="bg-dark-800 p-2.5 sm:p-3 rounded-xl flex justify-between items-center text-xs border border-white/5 gap-2"
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
                          <span className="text-gray-400 font-medium text-[11px]">
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

            {/* Meals & Foods History */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-300">
                <span className="flex items-center gap-1.5"><Utensils size={16} className="text-accent2" /> Meals & Diet</span>
                <span className="text-accent2 font-semibold">{completedMeals}/{selectedMeals.length} Taken</span>
              </div>

              {selectedMeals.length === 0 && selectedFoods.length === 0 ? (
                <div className="text-xs text-gray-500 italic p-2 bg-dark-800 rounded-xl">
                  No meals logged on this date.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {selectedMeals.map((m, idx) => (
                    <div key={idx} className="bg-dark-800 p-3 rounded-xl flex justify-between items-center text-xs border border-white/5">
                      <div className="flex items-center gap-2">
                        {m.completed ? (
                          <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                        ) : (
                          <XCircle size={16} className="text-gray-500 flex-shrink-0" />
                        )}
                        <span className={`font-semibold ${m.completed ? 'text-white' : 'text-gray-400'}`}>{m.name}</span>
                      </div>
                      <span className="text-accent font-semibold">
                        {m.foods?.reduce((sum, f) => sum + Number(f.calories || 0), 0) || 0} kcal
                      </span>
                    </div>
                  ))}

                  {selectedFoods.map((f, idx) => (
                    <div key={idx} className="bg-dark-800 p-3 rounded-xl flex justify-between items-center text-xs border border-white/5">
                      <div>
                        <span className="font-semibold text-white">{f.name}</span>
                        {f.itemsUsed && <span className="text-gray-500 ml-1.5 italic">({f.itemsUsed})</span>}
                      </div>
                      <span className="text-accent font-semibold">{f.calories} kcal ({f.qty}{f.unit || 'g'})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Steps & Water & Weight */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="bg-dark-800 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-400 block mb-0.5">Steps Walked</span>
                <span className="font-bold text-white text-sm">🚶 {selectedLog.steps || 0}</span>
              </div>
              <div className="bg-dark-800 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-400 block mb-0.5">Water Drank</span>
                <span className="font-bold text-accent2 text-sm">💧 {selectedLog.water || 0} gls</span>
              </div>
              <div className="bg-dark-800 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-400 block mb-0.5">Body Weight</span>
                <span className="font-bold text-purple-300 text-sm">
                  ⚖️ {selectedLog.weight ? `${selectedLog.weight} kg` : '-'}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Exercise Technique & Form Modal */}
      <ExerciseModal
        isOpen={!!selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        exerciseName={selectedExerciseForModal}
      />
    </motion.div>
  );
}
