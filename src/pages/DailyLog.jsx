import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Apple, Activity, Droplets, Scale, Plus, Minus, X, 
  Search, Check, Trash2, Utensils, Sparkles 
} from 'lucide-react';
import useDailyLogStore from '../store/useDailyLogStore';
import useUserStore from '../store/useUserStore';
import { searchFoods } from '../data/foodDatabase';
import Button from '../components/ui/Button';

export default function DailyLog() {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const { 
    logs, 
    logFood, 
    removeLoggedFood, 
    updateSteps, 
    updateWater, 
    updateWeight 
  } = useDailyLogStore();

  const profile = useUserStore((state) => state.profile) || {};
  const todayData = logs[todayStr] || { 
    steps: 0, 
    water: 0, 
    weight: profile.weight || 0, 
    loggedFoods: [], 
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 } 
  };

  const [activeModal, setActiveModal] = useState(null); // 'food' | 'steps' | 'water' | 'weight'

  // Food Form State
  const [foodTab, setFoodTab] = useState('custom'); // 'custom' | 'search'
  const [foodName, setFoodName] = useState('');
  const [itemsUsed, setItemsUsed] = useState('');
  const [foodWeight, setFoodWeight] = useState('100');
  const [foodUnit, setFoodUnit] = useState('g');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodCarbs, setFoodCarbs] = useState('');
  const [foodFat, setFoodFat] = useState('');
  const [foodFiber, setFoodFiber] = useState('');
  const [mealType, setMealType] = useState('lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [logSuccessMessage, setLogSuccessMessage] = useState('');

  // Steps / Water / Weight
  const [stepsInput, setStepsInput] = useState(todayData.steps?.toString() || '');
  const [waterCount, setWaterCount] = useState(todayData.water || 0);
  const [weightInput, setWeightInput] = useState(todayData.weight?.toString() || profile.weight?.toString() || '');

  const searchResults = searchQuery ? searchFoods(searchQuery) : [];

  const handleSelectFromDatabase = (item) => {
    setFoodName(item.name);
    setItemsUsed(item.category ? `Category: ${item.category}` : '');
    const defaultWeight = item.defaultQty || 100;
    setFoodWeight(defaultWeight.toString());
    setFoodUnit(item.defaultUnit || 'g');
    
    // Auto-calculate calories based on weight
    const factor = defaultWeight / 100;
    setFoodCalories(Math.round(item.caloriesPer100g * factor).toString());
    setFoodProtein(Math.round((item.proteinPer100g || 0) * factor * 10) / 10 || '');
    setFoodCarbs(Math.round((item.carbsPer100g || 0) * factor * 10) / 10 || '');
    setFoodFat(Math.round((item.fatPer100g || 0) * factor * 10) / 10 || '');
    setFoodFiber(Math.round((item.fiberPer100g || 0) * factor * 10) / 10 || '');
    
    setFoodTab('custom'); // Switch to custom form so user can review/edit
  };

  const handleWeightChange = (newWeightStr) => {
    setFoodWeight(newWeightStr);
    const weightNum = parseFloat(newWeightStr);
    // If user selected a database item or has calories entered per 100g
    if (searchQuery && !isNaN(weightNum) && weightNum > 0) {
      const match = searchFoods(foodName)[0];
      if (match) {
        const factor = weightNum / 100;
        setFoodCalories(Math.round(match.caloriesPer100g * factor).toString());
        setFoodProtein((Math.round(match.proteinPer100g * factor * 10) / 10).toString());
        setFoodCarbs((Math.round(match.carbsPer100g * factor * 10) / 10).toString());
        setFoodFat((Math.round(match.fatPer100g * factor * 10) / 10).toString());
      }
    }
  };

  const handleSaveFood = (e) => {
    e?.preventDefault();
    if (!foodName.trim()) {
      alert('Please enter a food name');
      return;
    }

    const cals = parseFloat(foodCalories) || 0;
    const pro = parseFloat(foodProtein) || 0;
    const carb = parseFloat(foodCarbs) || 0;
    const fat = parseFloat(foodFat) || 0;
    const fib = parseFloat(foodFiber) || 0;
    const wt = parseFloat(foodWeight) || 100;

    logFood(todayStr, {
      name: foodName.trim(),
      itemsUsed: itemsUsed.trim(),
      qty: wt,
      unit: foodUnit,
      calories: cals,
      protein: pro,
      carbs: carb,
      fat: fat,
      fiber: fib,
      mealType,
    });

    setLogSuccessMessage(`✅ "${foodName.trim()}" logged (${cals} kcal)!`);
    setTimeout(() => setLogSuccessMessage(''), 3000);

    // Reset fields
    setFoodName('');
    setItemsUsed('');
    setFoodCalories('');
    setFoodProtein('');
    setFoodCarbs('');
    setFoodFat('');
    setFoodFiber('');
    setFoodWeight('100');
    setActiveModal(null);
  };

  const loggedItems = todayData.loggedFoods || [];
  const currentNutrition = todayData.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen bg-dark-900 text-white pb-32 px-4 md:px-6 pt-6 max-w-xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-accent-text">Daily Log</h1>
        <p className="text-gray-400">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {logSuccessMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="p-4 bg-accent/20 border border-accent text-accent rounded-2xl flex items-center gap-2 font-medium"
          >
            <Check size={20} />
            <span>{logSuccessMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Log Food Card */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setActiveModal('food')}
          className="glass p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-3 border border-red-500/20 hover:border-red-500/50 transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center text-2xl">
            <Apple size={30} />
          </div>
          <div>
            <div className="font-bold text-lg">Log Food</div>
            <div className="text-xs text-gray-400">Items, weight & calories</div>
          </div>
          <span className="text-xs text-accent font-semibold bg-accent/10 px-3 py-1 rounded-full">
            + Quick Add
          </span>
        </motion.button>

        {/* Steps Card */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setActiveModal('steps')}
          className="glass p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-3 border border-accent/20 hover:border-accent/50 transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent flex items-center justify-center text-2xl">
            <Activity size={30} />
          </div>
          <div>
            <div className="font-bold text-lg">Steps</div>
            <div className="text-sm font-semibold text-accent">{todayData.steps || 0}</div>
          </div>
          <span className="text-xs text-gray-400">Target: {profile.targetSteps || 10000}</span>
        </motion.button>

        {/* Water Card */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setActiveModal('water')}
          className="glass p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-3 border border-blue-500/20 hover:border-blue-500/50 transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-accent2 flex items-center justify-center text-2xl">
            <Droplets size={30} />
          </div>
          <div>
            <div className="font-bold text-lg">Water</div>
            <div className="text-sm font-semibold text-accent2">{todayData.water || 0} glasses</div>
          </div>
          <span className="text-xs text-gray-400">Target: 8 glasses</span>
        </motion.button>

        {/* Weight Card */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setActiveModal('weight')}
          className="glass p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-3 border border-purple-500/20 hover:border-purple-500/50 transition-colors"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl">
            <Scale size={30} />
          </div>
          <div>
            <div className="font-bold text-lg">Weight</div>
            <div className="text-sm font-semibold text-purple-300">
              {todayData.weight ? `${todayData.weight} kg` : profile.weight ? `${profile.weight} kg` : 'Track'}
            </div>
          </div>
          <span className="text-xs text-gray-400">Tap to update</span>
        </motion.button>
      </div>

      {/* Today's Nutrition Summary */}
      <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Sparkles className="text-accent" size={20} />
          Today's Nutrition Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-800/80 p-4 rounded-2xl border border-white/5">
            <div className="text-xs text-gray-400 mb-1">Calories Intake</div>
            <div className="text-2xl font-bold text-accent">{Math.round(currentNutrition.calories)} <span className="text-sm font-normal text-gray-400">kcal</span></div>
            <div className="text-xs text-gray-500 mt-1">Target: {profile.targetCalories || 2000} kcal</div>
          </div>

          <div className="bg-dark-800/80 p-4 rounded-2xl border border-white/5">
            <div className="text-xs text-gray-400 mb-1">Protein Intake</div>
            <div className="text-2xl font-bold text-red-400">{Math.round(currentNutrition.protein)} <span className="text-sm font-normal text-gray-400">g</span></div>
            <div className="text-xs text-gray-500 mt-1">Target: {profile.targetProtein || 150} g</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="bg-dark-800/50 p-3 rounded-xl text-center">
            <div className="text-xs text-gray-400">Carbs</div>
            <div className="text-lg font-bold text-accent2">{Math.round(currentNutrition.carbs)}g</div>
          </div>
          <div className="bg-dark-800/50 p-3 rounded-xl text-center">
            <div className="text-xs text-gray-400">Fat</div>
            <div className="text-lg font-bold text-yellow-400">{Math.round(currentNutrition.fat)}g</div>
          </div>
          <div className="bg-dark-800/50 p-3 rounded-xl text-center">
            <div className="text-xs text-gray-400">Fiber</div>
            <div className="text-lg font-bold text-orange-400">{Math.round(currentNutrition.fiber)}g</div>
          </div>
        </div>
      </div>

      {/* Logged Foods List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Utensils size={20} className="text-accent" />
            Foods Logged Today ({loggedItems.length})
          </h3>
          <button 
            onClick={() => setActiveModal('food')} 
            className="text-xs text-accent font-semibold hover:underline flex items-center gap-1"
          >
            <Plus size={16} /> Add Food
          </button>
        </div>

        {loggedItems.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-gray-500 border border-dashed border-dark-700">
            <Apple size={36} className="mx-auto mb-2 opacity-40 text-accent" />
            <p>No food logged yet today.</p>
            <p className="text-xs text-gray-500 mt-1">Tap "+ Quick Add" or "Log Food" above to record what you ate!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {loggedItems.map((item) => (
              <div 
                key={item.id} 
                className="glass-strong p-4 rounded-2xl flex items-center justify-between border border-white/5"
              >
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-base">{item.name}</span>
                    <span className="text-xs bg-dark-700 text-gray-300 px-2 py-0.5 rounded-full capitalize">
                      {item.mealType}
                    </span>
                  </div>
                  {item.itemsUsed && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">
                      Items used: {item.itemsUsed}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>{item.qty}{item.unit || 'g'}</span>
                    <span>•</span>
                    <span className="text-accent font-medium">{item.calories} kcal</span>
                    {item.protein > 0 && <span>• {item.protein}g Pro</span>}
                    {item.time && <span>• {item.time}</span>}
                  </div>
                </div>

                <button 
                  onClick={() => removeLoggedFood(todayStr, item.id)}
                  className="p-2 text-gray-500 hover:text-red-400 bg-dark-800 rounded-xl transition-colors"
                  title="Remove food"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FOOD LOG MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModal === 'food' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-end p-2 sm:p-4 pb-8 sm:justify-center backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-dark-800 rounded-3xl w-full max-w-lg mx-auto overflow-hidden flex flex-col max-h-[90vh] border border-white/10 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 px-6 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Apple className="text-accent" size={24} />
                  <h3 className="font-bold text-xl">Log What You Ate</h3>
                </div>
                <button 
                  onClick={() => setActiveModal(null)} 
                  className="p-2 bg-dark-700 hover:bg-dark-600 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tab Selector: Custom Entry vs Database Search */}
              <div className="flex p-2 bg-dark-900 mx-6 mt-4 rounded-xl gap-1">
                <button 
                  onClick={() => setFoodTab('custom')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    foodTab === 'custom' ? 'bg-dark-700 text-accent shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ✍️ Enter Custom Food
                </button>
                <button 
                  onClick={() => setFoodTab('search')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    foodTab === 'search' ? 'bg-dark-700 text-accent shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🔍 Search 80+ Foods
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                {/* SEARCH DATABASE VIEW */}
                {foodTab === 'search' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Search chicken, rice, eggs, oats, paneer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-dark-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-accent border border-transparent text-sm"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectFromDatabase(item)}
                          className="w-full flex justify-between items-center p-3 rounded-xl bg-dark-700/50 hover:bg-dark-700 cursor-pointer transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-white">{item.name}</div>
                            <div className="text-xs text-gray-400">
                              {item.caloriesPer100g} kcal / 100g • {item.proteinPer100g}g protein
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <Plus size={14} /> Select
                          </span>
                        </div>
                      ))}

                      {searchQuery && searchResults.length === 0 && (
                        <div className="text-center text-gray-400 py-6">
                          No foods found matching "{searchQuery}".<br />
                          <button 
                            onClick={() => { setFoodName(searchQuery); setFoodTab('custom'); }} 
                            className="mt-2 text-accent text-sm underline"
                          >
                            Enter "{searchQuery}" as custom food →
                          </button>
                        </div>
                      )}

                      {!searchQuery && (
                        <div className="text-center text-gray-500 py-6 text-sm">
                          Type any ingredient or dish to search from the nutrition database.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CUSTOM ENTRY VIEW */}
                {foodTab === 'custom' && (
                  <form onSubmit={handleSaveFood} className="space-y-4">
                    {/* Food Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Food / Dish Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Scrambled Eggs & Bread, Chicken Bowl"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        className="w-full bg-dark-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-accent border border-transparent font-medium"
                      />
                    </div>

                    {/* Items / Ingredients Used */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Items Used / Ingredients <span className="text-gray-500 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3 eggs, 2 slices brown bread, 1 tsp butter"
                        value={itemsUsed}
                        onChange={(e) => setItemsUsed(e.target.value)}
                        className="w-full bg-dark-700 rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-accent border border-transparent text-sm"
                      />
                    </div>

                    {/* Weight and Meal Type */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Weight / Amount
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="1"
                            step="any"
                            value={foodWeight}
                            onChange={(e) => handleWeightChange(e.target.value)}
                            className="w-full bg-dark-700 rounded-xl py-2.5 px-3 outline-none focus:ring-2 focus:ring-accent border border-transparent font-semibold"
                            placeholder="100"
                          />
                          <select
                            value={foodUnit}
                            onChange={(e) => setFoodUnit(e.target.value)}
                            className="bg-dark-700 rounded-xl px-2 text-sm text-gray-300 outline-none"
                          >
                            <option value="g">g</option>
                            <option value="ml">ml</option>
                            <option value="piece">pcs</option>
                            <option value="cup">cup</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          Meal
                        </label>
                        <select
                          value={mealType}
                          onChange={(e) => setMealType(e.target.value)}
                          className="w-full bg-dark-700 rounded-xl py-2.5 px-3 outline-none focus:ring-2 focus:ring-accent border border-transparent text-sm"
                        >
                          <option value="breakfast">🍳 Breakfast</option>
                          <option value="morning_snack">🍎 Morning Snack</option>
                          <option value="lunch">🥗 Lunch</option>
                          <option value="pre_workout">⚡ Pre-Workout</option>
                          <option value="post_workout">💪 Post-Workout</option>
                          <option value="dinner">🍗 Dinner</option>
                          <option value="snack">🌙 Snack</option>
                        </select>
                      </div>
                    </div>

                    {/* Calories Input */}
                    <div className="bg-dark-900/60 p-4 rounded-2xl border border-accent/20">
                      <label className="block text-xs font-bold text-accent uppercase tracking-wider mb-1">
                        Calories (kcal) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        required
                        placeholder="e.g. 450"
                        value={foodCalories}
                        onChange={(e) => setFoodCalories(e.target.value)}
                        className="w-full bg-dark-700 rounded-xl py-3 px-4 text-2xl font-bold text-white outline-none focus:ring-2 focus:ring-accent border border-transparent"
                      />
                    </div>

                    {/* Optional Macros: Protein, Carbs, Fat, Fiber */}
                    <div>
                      <div className="text-xs font-semibold text-gray-400 mb-2">
                        Macros Breakdown <span className="text-gray-500 font-normal">(optional in grams)</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Protein</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="g"
                            value={foodProtein}
                            onChange={(e) => setFoodProtein(e.target.value)}
                            className="w-full bg-dark-700 rounded-xl p-2.5 text-center text-sm font-semibold outline-none focus:ring-1 focus:ring-red-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Carbs</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="g"
                            value={foodCarbs}
                            onChange={(e) => setFoodCarbs(e.target.value)}
                            className="w-full bg-dark-700 rounded-xl p-2.5 text-center text-sm font-semibold outline-none focus:ring-1 focus:ring-accent2"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Fat</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="g"
                            value={foodFat}
                            onChange={(e) => setFoodFat(e.target.value)}
                            className="w-full bg-dark-700 rounded-xl p-2.5 text-center text-sm font-semibold outline-none focus:ring-1 focus:ring-yellow-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block mb-0.5">Fiber</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="g"
                            value={foodFiber}
                            onChange={(e) => setFoodFiber(e.target.value)}
                            className="w-full bg-dark-700 rounded-xl p-2.5 text-center text-sm font-semibold outline-none focus:ring-1 focus:ring-orange-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button variant="primary" fullWidth size="lg" type="submit">
                        💾 Log Food to Today
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* STEPS MODAL */}
        {activeModal === 'steps' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-dark-800 rounded-3xl w-full max-w-sm p-6 space-y-6 border border-white/10"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Update Steps</h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-dark-700 rounded-full">
                  <X size={18} />
                </button>
              </div>

              <div className="text-center">
                <Activity size={44} className="text-accent mx-auto mb-3" />
                <input
                  type="number"
                  value={stepsInput}
                  onChange={(e) => setStepsInput(e.target.value)}
                  className="w-full bg-dark-700 rounded-2xl py-4 px-4 text-center text-3xl font-bold outline-none focus:ring-2 focus:ring-accent"
                  placeholder="0"
                  autoFocus
                />
                <div className="text-xs text-gray-400 mt-2">Daily Goal: {profile.targetSteps || 10000} steps</div>
              </div>

              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => {
                  updateSteps(todayStr, Number(stepsInput) || 0);
                  setActiveModal(null);
                }}
              >
                Save Steps
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* WATER MODAL */}
        {activeModal === 'water' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-dark-800 rounded-3xl w-full max-w-sm p-6 space-y-6 border border-white/10"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Update Water</h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-dark-700 rounded-full">
                  <X size={18} />
                </button>
              </div>

              <div className="text-center">
                <Droplets size={44} className="text-accent2 mx-auto mb-4" />
                <div className="flex justify-center items-center gap-6 mb-2">
                  <button 
                    onClick={() => setWaterCount(Math.max(0, waterCount - 1))}
                    className="w-12 h-12 bg-dark-700 hover:bg-dark-600 rounded-full flex items-center justify-center text-xl font-bold"
                  >
                    <Minus size={20} />
                  </button>
                  <div className="text-5xl font-bold text-accent2">{waterCount}</div>
                  <button 
                    onClick={() => setWaterCount(waterCount + 1)}
                    className="w-12 h-12 bg-dark-700 hover:bg-dark-600 rounded-full flex items-center justify-center text-xl font-bold"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="text-xs text-gray-400">Glasses (approx 250ml each)</div>
              </div>

              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => {
                  updateWater(todayStr, waterCount);
                  setActiveModal(null);
                }}
              >
                Save Water
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* WEIGHT MODAL */}
        {activeModal === 'weight' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-dark-800 rounded-3xl w-full max-w-sm p-6 space-y-6 border border-white/10"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Log Today's Weight</h3>
                <button onClick={() => setActiveModal(null)} className="p-2 bg-dark-700 rounded-full">
                  <X size={18} />
                </button>
              </div>

              <div className="text-center">
                <Scale size={44} className="text-purple-400 mx-auto mb-3" />
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full bg-dark-700 rounded-2xl py-4 px-4 text-center text-3xl font-bold outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="70.0"
                  autoFocus
                />
                <div className="text-xs text-gray-400 mt-2">Weight in Kilograms (kg)</div>
              </div>

              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => {
                  updateWeight(todayStr, Number(weightInput) || 0);
                  setActiveModal(null);
                }}
              >
                Save Weight
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
