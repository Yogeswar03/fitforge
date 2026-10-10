import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Sparkles, Send, Check, X, Flame, 
  Utensils, Clock, ChevronRight, AlertCircle, RefreshCw 
} from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { parseFullDayMeals } from '../../utils/aiMealParser';
import useDailyLogStore from '../../store/useDailyLogStore';
import { getTodayStr } from '../../utils/calculations';
import { syncDailyLogToCloud } from '../../lib/supabaseSync';
import useAuthStore from '../../store/useAuthStore';

const QUICK_PROMPTS = [
  {
    label: '💪 High Protein Day',
    text: 'Morning 3 boiled eggs and 1 glass milk, afternoon 1 bowl white rice with dal and 150g chicken breast, evening 1 scoop whey protein and 1 banana, night 2 rotis with 100g paneer'
  },
  {
    label: '🥗 Vegetarian Gym Diet',
    text: 'Morning 1 bowl oats with milk and 1 apple, afternoon 2 rotis with 1 bowl dal and 100g paneer, evening 1 bowl sprouts and 1 cup green tea, night 1 cup rice with rajma and salad'
  },
  {
    label: '🔥 Lean Fat Loss',
    text: 'Morning 2 egg whites with black coffee, afternoon 150g grilled chicken with green salad and 1 cup brown rice, evening 1 handful almonds, night 1 bowl dal with mixed sabzi'
  }
];

export default function AiMealAgentModal({ isOpen, onClose }) {
  const [inputText, setInputText] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const { batchLogAiMeals, getDay } = useDailyLogStore();
  const { user } = useAuthStore();
  const todayStr = getTodayStr();

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    // Simulate micro-delay for realistic AI thinking feel
    setTimeout(() => {
      const result = parseFullDayMeals(inputText);
      setParsedResult(result);
      setIsAnalyzing(false);
    }, 350);
  };

  const handleConfirmLog = () => {
    if (!parsedResult || !parsedResult.meals || parsedResult.meals.length === 0) return;

    batchLogAiMeals(todayStr, parsedResult.meals);

    // Sync to Supabase cloud
    const updatedDay = useDailyLogStore.getState().getDay(todayStr);
    if (updatedDay) {
      syncDailyLogToCloud(null, user?.email, todayStr, updatedDay);
    }

    setIsLogged(true);
    setTimeout(() => {
      setIsLogged(false);
      setParsedResult(null);
      setInputText('');
      onClose();
    }, 1500);
  };

  const handleClear = () => {
    setInputText('');
    setParsedResult(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🤖 AI Meal Logger Agent">
      <div className="space-y-4 pt-1">
        {/* Agent Greeting Header */}
        <div className="bg-gradient-to-r from-accent/15 via-dark-800 to-dark-800 p-4 rounded-2xl border border-accent/20 flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent text-dark-900 flex items-center justify-center font-black shadow-lg shadow-accent/20 flex-shrink-0">
            <Bot size={22} />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>Tell me what you ate today!</span>
              <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">
                Auto-Macros
              </span>
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Write all your meals from morning to night in simple words. I will calculate your calories, protein, carbs, fat, and fiber, and directly log them into your <strong>Today's Meals Taken</strong> card.
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300 flex justify-between items-center">
            <span>What did you eat from morning to night?</span>
            {inputText && (
              <button 
                type="button" 
                onClick={handleClear}
                className="text-gray-400 hover:text-white text-[11px]"
              >
                Clear
              </button>
            )}
          </label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (parsedResult) setParsedResult(null); // Reset when user modifies text
            }}
            placeholder="e.g., Morning 2 boiled eggs and 1 glass milk, afternoon 1 cup rice with dal and 150g chicken, evening 1 apple, night 2 rotis with 100g paneer"
            className="w-full bg-dark-700 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-accent resize-none leading-relaxed"
          />
        </div>

        {/* Quick Example Chips */}
        {!parsedResult && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-gray-400">Quick Examples (Tap to test):</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(p.text);
                    if (parsedResult) setParsedResult(null);
                  }}
                  className="text-[11px] bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white px-2.5 py-1 rounded-xl border border-white/5 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Button: Analyze */}
        {!parsedResult && (
          <Button
            variant="primary"
            fullWidth
            size="md"
            onClick={handleAnalyze}
            disabled={!inputText.trim() || isAnalyzing}
            loading={isAnalyzing}
            icon={<Sparkles size={16} />}
          >
            {isAnalyzing ? 'Calculating Calories & Macros...' : 'Analyze & Calculate Macros ✨'}
          </Button>
        )}

        {/* Parsed Results Review */}
        <AnimatePresence>
          {parsedResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3.5 pt-2"
            >
              {/* Grand Totals Summary Card */}
              <div className="glass-strong rounded-2xl p-4 border border-accent/30 space-y-2 bg-gradient-to-b from-dark-800 to-dark-900">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-extrabold text-accent flex items-center gap-1.5">
                    <Flame size={14} /> Total Day Nutrition Calculated
                  </span>
                  <span className="text-base font-black text-white">
                    {parsedResult.totals.calories} <span className="text-xs font-normal text-gray-400">kcal</span>
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-dark-900/60 p-2 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 block font-medium">Protein</span>
                    <span className="font-extrabold text-sm text-red-400">{parsedResult.totals.protein}g</span>
                  </div>
                  <div className="bg-dark-900/60 p-2 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 block font-medium">Carbs</span>
                    <span className="font-extrabold text-sm text-accent2">{parsedResult.totals.carbs}g</span>
                  </div>
                  <div className="bg-dark-900/60 p-2 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 block font-medium">Fat</span>
                    <span className="font-extrabold text-sm text-yellow-400">{parsedResult.totals.fat}g</span>
                  </div>
                  <div className="bg-dark-900/60 p-2 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 block font-medium">Fiber</span>
                    <span className="font-extrabold text-sm text-emerald-400">{parsedResult.totals.fiber}g</span>
                  </div>
                </div>
              </div>

              {/* Meals Breakdown List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <div className="text-xs font-bold text-gray-300">Recognized Meal Slots:</div>
                {parsedResult.meals.map((meal, mIdx) => (
                  <div 
                    key={mIdx}
                    className="bg-dark-800/80 p-3 rounded-2xl border border-white/5 space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Utensils size={13} className="text-accent" />
                        {meal.name}
                      </span>
                      <span className="text-gray-400 text-[10px] flex items-center gap-1">
                        <Clock size={11} /> {meal.time}
                      </span>
                    </div>

                    <div className="space-y-1 pl-4 border-l-2 border-white/10">
                      {meal.foods.map((food, fIdx) => (
                        <div key={fIdx} className="flex justify-between items-center text-[11px] text-gray-300">
                          <span>{food.name}</span>
                          <span className="text-accent font-semibold">{food.calories} kcal ({food.protein}g P)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Confirm Logging Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setParsedResult(null)}
                  className="py-3 px-4 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-dark-800 border border-white/5"
                >
                  Edit Input
                </button>
                <Button
                  variant="primary"
                  fullWidth
                  size="md"
                  onClick={handleConfirmLog}
                  disabled={isLogged}
                  icon={isLogged ? <Check size={16} /> : <Check size={16} />}
                >
                  {isLogged ? '✅ Successfully Logged to Today!' : 'Log Directly to Today\'s Meals 🚀'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
