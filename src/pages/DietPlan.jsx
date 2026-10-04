import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Copy, Dumbbell, Utensils, Search, Clock, 
  Save, Sparkles, X, Check, Users, Heart 
} from 'lucide-react';
import useDietStore from '../store/useDietStore';
import useWorkoutStore from '../store/useWorkoutStore';
import useDailyLogStore from '../store/useDailyLogStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PartnerDietModal from '../components/ui/PartnerDietModal';
import { generateId, getTodayStr, DAYS_OF_WEEK, getDayName } from '../utils/calculations';
import { searchFoods } from '../data/foodDatabase';
import { syncDietPlanToCloud } from '../lib/supabaseSync';

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳', defaultTime: '08:00' },
  { id: 'morning_snack', label: 'Morning Snack', icon: '🍎', defaultTime: '11:00' },
  { id: 'lunch', label: 'Lunch', icon: '🥗', defaultTime: '13:00' },
  { id: 'pre_workout', label: 'Pre-Workout', icon: '⚡', defaultTime: '16:00' },
  { id: 'post_workout', label: 'Post-Workout', icon: '💪', defaultTime: '18:00' },
  { id: 'dinner', label: 'Dinner', icon: '🍗', defaultTime: '20:00' },
  { id: 'snack', label: 'Evening Snack', icon: '🌙', defaultTime: '22:00' },
];

export default function DietPlan() {
  const navigate = useNavigate();
  const { weeklyPlan, setDayMeals, addMeal, removeMeal, updateMeal, copyDayPlan, partner } = useDietStore();
  const { weeklyPlan: workoutWeeklyPlan } = useWorkoutStore();
  const { syncPlan } = useDailyLogStore();

  const [searchParams] = useSearchParams();
  const partnerDietCodeFromUrl = searchParams.get('partner_diet') || '';

  const todayDate = new Date();
  const todayDayOfWeek = todayDate.getDay();
  const todayStr = getTodayStr();

  const [activeDay, setActiveDay] = useState(todayDayOfWeek);
  const currentMeals = weeklyPlan?.[activeDay]?.meals || [];

  const [notification, setNotification] = useState('');
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [targetCopyDay, setTargetCopyDay] = useState(todayDayOfWeek === 0 ? 1 : 0);

  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(!!partnerDietCodeFromUrl);

  useEffect(() => {
    if (partnerDietCodeFromUrl) {
      setIsPartnerModalOpen(true);
    }
  }, [partnerDietCodeFromUrl]);
  const [newMealType, setNewMealType] = useState(MEAL_TYPES[0].id);
  const [newMealTime, setNewMealTime] = useState(MEAL_TYPES[0].defaultTime);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const syncToHomeIfToday = (updatedMeals) => {
    if (activeDay === todayDayOfWeek) {
      const todayWorkout = workoutWeeklyPlan?.[todayDayOfWeek] || { exercises: [] };
      syncPlan(todayStr, todayWorkout, { meals: updatedMeals });
    }
  };

  const handleSavePlan = () => {
    setDayMeals(activeDay, currentMeals);
    syncToHomeIfToday(currentMeals);

    // Sync to Supabase cloud if connected
    syncDietPlanToCloud(null, activeDay, currentMeals);

    const isToday = activeDay === todayDayOfWeek;
    triggerNotification(
      isToday 
        ? "✅ Diet plan saved! Today's Home screen is updated with your meals!" 
        : `✅ ${getDayName(activeDay)} diet saved successfully!`
    );
  };

  const handleAddMeal = () => {
    const mealTypeInfo = MEAL_TYPES.find((m) => m.id === newMealType) || MEAL_TYPES[0];
    const newMeal = {
      id: generateId(),
      type: newMealType,
      name: mealTypeInfo.label,
      time: newMealTime,
      foods: [],
    };

    const updated = [...currentMeals, newMeal];
    addMeal(activeDay, newMeal);
    syncToHomeIfToday(updated);

    setIsAddMealModalOpen(false);
    triggerNotification(`Added "${newMeal.name}" slot`);
  };

  const handleCopyDay = () => {
    copyDayPlan(activeDay, targetCopyDay);
    if (targetCopyDay === todayDayOfWeek) {
      syncPlan(todayStr, workoutWeeklyPlan?.[todayDayOfWeek] || { exercises: [] }, { meals: currentMeals });
    }
    setIsCopyModalOpen(false);
    triggerNotification(`Copied meals to ${getDayName(targetCopyDay)}!`);
  };

  const dayTotals = useMemo(() => {
    return currentMeals.reduce((acc, meal) => {
      (meal.foods || []).forEach((food) => {
        acc.calories += Number(food.calories || 0);
        acc.protein += Number(food.protein || 0);
        acc.carbs += Number(food.carbs || 0);
        acc.fat += Number(food.fat || 0);
        acc.fiber += Number(food.fiber || 0);
      });
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  }, [currentMeals]);

  const isToday = activeDay === todayDayOfWeek;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen bg-dark-900 text-white pb-36 px-4 md:px-6 pt-6 max-w-2xl mx-auto space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-2 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold gradient-accent-text">Diet Routine</h1>
            <p className="text-gray-400 text-sm">Organize which meals you eat on each day</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPartnerModalOpen(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 border ${
                partner 
                  ? 'bg-gradient-to-r from-accent/20 to-accent2/20 border-accent/40 text-accent' 
                  : 'bg-dark-800 hover:bg-dark-700 border-white/10 text-gray-200'
              }`}
              title="Sync or share diet with your gym partner"
            >
              <Users size={16} className={partner ? 'text-accent' : 'text-accent2'} />
              <span>{partner ? `👫 ${partner.name}` : '👫 Gym Partner'}</span>
            </button>

            <button
              onClick={handleSavePlan}
              className="flex items-center gap-2 bg-accent text-dark-900 font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-accent/20 active:scale-95 transition-all text-sm"
            >
              <Save size={18} />
              <span>Save Plan</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Workout vs Diet */}
        <div className="flex gap-2 p-1 bg-dark-800 rounded-2xl border border-white/5">
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-700/50 transition-colors text-sm font-semibold"
            onClick={() => navigate('/plan/workout')}
          >
            <Dumbbell size={18} /> 💪 Workout Routine
          </button>
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-700 text-white font-semibold text-sm shadow-sm"
            disabled
          >
            <Utensils size={18} className="text-accent" /> 🍽️ Diet Plan
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

      {/* Day Selector */}
      <div>
        <div className="flex justify-between items-center mb-2 px-1 text-xs text-gray-400 font-medium">
          <span>SELECT DAY TO EDIT</span>
          {isToday && <span className="text-accent font-bold">● Editing Today's Diet</span>}
        </div>
        <div className="grid grid-cols-7 gap-1.5 bg-dark-800/80 p-2 rounded-2xl border border-white/5">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = activeDay === day.id;
            const isCurrentDay = todayDayOfWeek === day.id;
            const hasMeals = (weeklyPlan?.[day.id]?.meals || []).length > 0;

            return (
              <button
                key={day.id}
                onClick={() => setActiveDay(day.id)}
                className={`py-3 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
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
                {!isCurrentDay && hasMeals && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-dark-900' : 'bg-accent'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal Slots List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {getDayName(activeDay)}
            {isToday && (
              <span className="text-xs bg-accent/20 text-accent font-bold px-2 py-0.5 rounded-full">
                Today
              </span>
            )}
          </h2>
          <span className="text-xs text-gray-400">
            {currentMeals.length} meal slot(s)
          </span>
        </div>

        {currentMeals.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center space-y-3 border border-dashed border-dark-700">
            <Utensils size={40} className="mx-auto text-accent opacity-50" />
            <h3 className="font-bold text-lg text-white">No meals scheduled for {getDayName(activeDay)}</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Add your breakfast, lunch, pre/post workout snacks, and dinner to plan your daily nutrition.
            </p>
            <div className="pt-2">
              <Button 
                variant="primary" 
                onClick={() => setIsAddMealModalOpen(true)}
                icon={<Plus size={18} />}
              >
                + Add First Meal Slot
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {currentMeals.map((meal) => (
              <MealCard 
                key={meal.id}
                meal={meal}
                onUpdate={(data) => {
                  const updated = currentMeals.map((m) => m.id === meal.id ? { ...m, ...data } : m);
                  updateMeal(activeDay, meal.id, data);
                  syncToHomeIfToday(updated);
                }}
                onRemove={() => {
                  const updated = currentMeals.filter((m) => m.id !== meal.id);
                  removeMeal(activeDay, meal.id);
                  syncToHomeIfToday(updated);
                  triggerNotification('Meal slot removed');
                }}
              />
            ))}

            <Button 
              variant="outline" 
              fullWidth 
              onClick={() => setIsAddMealModalOpen(true)} 
              icon={<Plus size={20} />}
            >
              + Add Another Meal Slot
            </Button>

            <Button 
              variant="primary" 
              fullWidth 
              size="lg" 
              onClick={handleSavePlan}
              icon={<Save size={20} />}
            >
              Save {getDayName(activeDay)} Diet Plan
            </Button>
          </div>
        )}

        {/* Copy to another day */}
        <div className="pt-2 flex justify-between items-center text-sm px-1">
          <span className="text-gray-400 text-xs">Copy this routine?</span>
          <button 
            onClick={() => setIsCopyModalOpen(true)}
            className="text-accent2 hover:underline flex items-center gap-1.5 font-semibold text-xs"
          >
            <Copy size={16} /> Copy meals to another day...
          </button>
        </div>
      </div>

      {/* Sticky Bottom Macros Summary */}
      <div className="fixed bottom-[80px] left-0 right-0 p-3 z-40">
        <div className="max-w-xl mx-auto glass-strong bg-dark-800/95 rounded-2xl p-4 shadow-2xl border border-white/10 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Planned Calories</span>
            <span className="text-xl font-bold text-accent">{Math.round(dayTotals.calories)} <span className="text-xs text-gray-400 font-normal">kcal</span></span>
          </div>

          <div className="flex gap-4 text-xs font-semibold">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[10px]">Protein</span>
              <span className="text-red-400 font-bold">{Math.round(dayTotals.protein)}g</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[10px]">Carbs</span>
              <span className="text-accent2 font-bold">{Math.round(dayTotals.carbs)}g</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[10px]">Fat</span>
              <span className="text-yellow-400 font-bold">{Math.round(dayTotals.fat)}g</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-[10px]">Fiber</span>
              <span className="text-orange-400 font-bold">{Math.round(dayTotals.fiber)}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD MEAL SLOT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddMealModalOpen && (
          <Modal isOpen={isAddMealModalOpen} onClose={() => setIsAddMealModalOpen(false)} title="Add Meal Slot">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Meal Type</label>
                <select
                  value={newMealType}
                  onChange={(e) => {
                    setNewMealType(e.target.value);
                    const match = MEAL_TYPES.find((m) => m.id === e.target.value);
                    if (match) setNewMealTime(match.defaultTime);
                  }}
                  className="w-full bg-dark-700 rounded-xl p-3 text-white font-semibold outline-none"
                >
                  {MEAL_TYPES.map((m) => (
                    <option key={m.id} value={m.id}>{m.icon} {m.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Time Scheduled</label>
                <input
                  type="time"
                  value={newMealTime}
                  onChange={(e) => setNewMealTime(e.target.value)}
                  className="w-full bg-dark-700 rounded-xl p-3 text-white font-semibold outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <Button variant="ghost" fullWidth onClick={() => setIsAddMealModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" fullWidth onClick={handleAddMeal}>
                  Add Meal Slot
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* COPY MODAL */}
        {isCopyModalOpen && (
          <Modal isOpen={isCopyModalOpen} onClose={() => setIsCopyModalOpen(false)} title="Copy Meal Plan">
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Copy <strong>{getDayName(activeDay)}</strong>'s meals to:
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

      {/* Gym Partner Diet Hub Modal */}
      <PartnerDietModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        initialCode={partnerDietCodeFromUrl}
      />
    </motion.div>
  );
}

function MealCard({ meal, onUpdate, onRemove }) {
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Custom food entry in meal
  const [customName, setCustomName] = useState('');
  const [customQty, setCustomQty] = useState('100');
  const [customCals, setCustomCals] = useState('');

  const mealInfo = MEAL_TYPES.find((m) => m.id === meal.type) || { icon: '🍽️', label: meal.name };

  const mealTotals = useMemo(() => {
    return (meal.foods || []).reduce((acc, f) => {
      acc.calories += Number(f.calories || 0);
      acc.protein += Number(f.protein || 0);
      acc.carbs += Number(f.carbs || 0);
      acc.fat += Number(f.fat || 0);
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [meal.foods]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 1) {
      setSearchResults(searchFoods(q));
    } else {
      setSearchResults([]);
    }
  };

  const handleAddDatabaseFood = (foodInfo) => {
    const qty = foodInfo.defaultQty || 100;
    const factor = qty / 100;
    const newFood = {
      id: generateId(),
      name: foodInfo.name,
      qty,
      unit: foodInfo.defaultUnit || 'g',
      calories: Math.round(foodInfo.caloriesPer100g * factor),
      protein: Math.round((foodInfo.proteinPer100g || 0) * factor * 10) / 10,
      carbs: Math.round((foodInfo.carbsPer100g || 0) * factor * 10) / 10,
      fat: Math.round((foodInfo.fatPer100g || 0) * factor * 10) / 10,
      fiber: Math.round((foodInfo.fiberPer100g || 0) * factor * 10) / 10,
    };

    onUpdate({ foods: [...(meal.foods || []), newFood] });
    setSearchQuery('');
    setSearchResults([]);
    setIsAddingFood(false);
  };

  const handleAddManualFood = (e) => {
    e?.preventDefault();
    if (!customName.trim()) return;

    const cals = Number(customCals) || 0;
    const newFood = {
      id: generateId(),
      name: customName.trim(),
      qty: Number(customQty) || 100,
      unit: 'g',
      calories: cals,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };

    onUpdate({ foods: [...(meal.foods || []), newFood] });
    setCustomName('');
    setCustomCals('');
    setCustomQty('100');
    setIsAddingFood(false);
  };

  const handleRemoveFood = (foodId) => {
    onUpdate({ foods: (meal.foods || []).filter((f) => f.id !== foodId) });
  };

  return (
    <div className="glass-strong rounded-3xl p-5 border border-white/5 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{mealInfo.icon}</span>
          <div>
            <input 
              type="text"
              value={meal.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="font-bold text-lg text-white bg-transparent border-none outline-none focus:ring-1 focus:ring-accent rounded px-1"
            />
            <div className="flex items-center gap-1 text-xs text-gray-400 pl-1">
              <Clock size={12} />
              <input 
                type="time"
                value={meal.time}
                onChange={(e) => onUpdate({ time: e.target.value })}
                className="bg-transparent text-gray-400 border-none outline-none text-xs"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={onRemove}
          className="p-2 text-gray-500 hover:text-red-400 bg-dark-700 rounded-xl transition-colors"
          title="Remove meal slot"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Foods inside this meal */}
      <div className="space-y-2">
        {(meal.foods || []).map((food) => (
          <div key={food.id} className="flex justify-between items-center bg-dark-800/80 p-3 rounded-2xl border border-white/5">
            <div>
              <div className="font-semibold text-sm text-white">{food.name}</div>
              <div className="text-xs text-gray-400">
                {food.qty}{food.unit} • <span className="text-accent font-medium">{Math.round(food.calories)} kcal</span>
                {food.protein > 0 && ` • ${food.protein}g P`}
              </div>
            </div>
            <button 
              onClick={() => handleRemoveFood(food.id)}
              className="p-1.5 text-gray-500 hover:text-red-400"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {!isAddingFood ? (
          <button 
            onClick={() => setIsAddingFood(true)}
            className="w-full py-2.5 rounded-2xl border border-dashed border-dark-600 text-gray-400 text-xs font-semibold hover:bg-dark-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus size={14} /> Add Food to this Meal
          </button>
        ) : (
          <div className="bg-dark-800 p-4 rounded-2xl border border-accent/30 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Add Item to {meal.name}</span>
              <button onClick={() => setIsAddingFood(false)} className="text-gray-400"><X size={16} /></button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search food database..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-dark-900 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:ring-1 focus:ring-accent"
                autoFocus
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto no-scrollbar space-y-1">
                {searchResults.map((result) => (
                  <div 
                    key={result.id}
                    onClick={() => handleAddDatabaseFood(result)}
                    className="p-2.5 bg-dark-700/60 hover:bg-dark-700 rounded-xl cursor-pointer flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white">{result.name}</span>
                      <span className="text-gray-400 ml-2">{result.caloriesPer100g} kcal/100g</span>
                    </div>
                    <span className="text-accent font-bold">+ Add</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick manual entry if item not found */}
            <div className="pt-2 border-t border-dark-700 text-xs space-y-2">
              <div className="text-gray-400 font-medium">Or enter manually:</div>
              <div className="grid grid-cols-3 gap-2">
                <input 
                  type="text"
                  placeholder="Food name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="bg-dark-900 rounded-xl p-2 text-xs outline-none"
                />
                <input 
                  type="number"
                  placeholder="Weight (g)"
                  value={customQty}
                  onChange={(e) => setCustomQty(e.target.value)}
                  className="bg-dark-900 rounded-xl p-2 text-xs text-center outline-none"
                />
                <input 
                  type="number"
                  placeholder="Calories"
                  value={customCals}
                  onChange={(e) => setCustomCals(e.target.value)}
                  className="bg-dark-900 rounded-xl p-2 text-xs text-center outline-none text-accent"
                />
              </div>
              <button 
                onClick={handleAddManualFood}
                className="w-full py-2 bg-dark-700 hover:bg-dark-600 rounded-xl font-bold text-accent text-xs"
              >
                + Add Custom Item
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Meal Subtotal */}
      <div className="flex justify-between items-center pt-2 border-t border-dark-700 text-xs">
        <span className="text-gray-400 font-medium">Meal Subtotal:</span>
        <div className="flex gap-3 font-semibold">
          <span className="text-accent">{Math.round(mealTotals.calories)} kcal</span>
          <span className="text-red-400">{Math.round(mealTotals.protein)}g Protein</span>
        </div>
      </div>
    </div>
  );
}
