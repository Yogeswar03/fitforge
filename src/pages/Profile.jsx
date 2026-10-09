import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Save, User, Settings, ShieldCheck, Edit3, 
  ReceiptText, Users, Scale, Flame, Activity, Sparkles, 
  ChevronRight, Heart, ArrowRight, X, Check 
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUserStore from '../store/useUserStore';
import useDietStore from '../store/useDietStore';
import useExpenseStore from '../store/useExpenseStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { isSupabaseConfigured } from '../lib/supabase';
import { syncProfileToCloud } from '../lib/supabaseSync';
import { formatNumber } from '../utils/calculations';

export default function Profile() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { profile, setProfile } = useUserStore();
  const { partner } = useDietStore();
  const { getSummary, partnerName } = useExpenseStore();

  const expenseSummary = getSummary ? getSummary() : { balance: 0, totalSpent: 0 };

  // Targets state
  const [targets, setTargets] = useState({
    targetCalories: profile?.targetCalories || 2000,
    targetProtein: profile?.targetProtein || 150,
    targetCarbs: profile?.targetCarbs || 200,
    targetFat: profile?.targetFat || 65,
    targetFiber: profile?.targetFiber || 30,
    targetSteps: profile?.targetSteps || 10000,
  });
  const [editingTargets, setEditingTargets] = useState(false);

  // Synchronize local targets state whenever the store profile changes
  useEffect(() => {
    if (profile) {
      setTargets({
        targetCalories: profile.targetCalories ?? 2000,
        targetProtein: profile.targetProtein ?? 150,
        targetCarbs: profile.targetCarbs ?? 200,
        targetFat: profile.targetFat ?? 65,
        targetFiber: profile.targetFiber ?? 30,
        targetSteps: profile.targetSteps ?? 10000,
      });
    }
  }, [
    profile?.targetCalories,
    profile?.targetProtein,
    profile?.targetCarbs,
    profile?.targetFat,
    profile?.targetFiber,
    profile?.targetSteps,
  ]);

  // Personal Info Edit Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editGender, setEditGender] = useState(profile?.gender || 'male');
  const [editWeight, setEditWeight] = useState(profile?.weight || '');
  const [editHeight, setEditHeight] = useState(profile?.height || '');
  const [editAge, setEditAge] = useState(profile?.age || '');
  const [editGoal, setEditGoal] = useState(profile?.goal || 'maintain');
  const [editActivity, setEditActivity] = useState(profile?.activityLevel || 'active');
  const [editDiet, setEditDiet] = useState(profile?.dietPreference || 'nonveg');

  const [notification, setNotification] = useState('');

  const triggerNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveTargets = () => {
    const cleanTargets = {
      targetCalories: Number(targets.targetCalories) || 2000,
      targetProtein: Number(targets.targetProtein) || 150,
      targetCarbs: Number(targets.targetCarbs) || 200,
      targetFat: Number(targets.targetFat) || 65,
      targetFiber: Number(targets.targetFiber) || 30,
      targetSteps: Number(targets.targetSteps) || 10000,
    };
    setProfile(cleanTargets);
    setTargets(cleanTargets);
    syncProfileToCloud(null, user?.email, { ...profile, ...cleanTargets });
    setEditingTargets(false);
    triggerNotice('✅ Daily nutrition & calorie targets updated!');
  };

  const handleOpenEditProfile = () => {
    setEditName(user?.name || '');
    setEditGender(profile?.gender || 'male');
    setEditWeight(profile?.weight || '');
    setEditHeight(profile?.height || '');
    setEditAge(profile?.age || '');
    setEditGoal(profile?.goal || 'maintain');
    setEditActivity(profile?.activityLevel || 'active');
    setEditDiet(profile?.dietPreference || 'nonveg');
    setIsEditProfileOpen(true);
  };

  const handleSavePersonalInfo = (e) => {
    e?.preventDefault();

    const updatedData = {
      name: editName.trim() || user?.name,
      gender: editGender,
      weight: Number(editWeight) || profile?.weight,
      height: Number(editHeight) || profile?.height,
      age: Number(editAge) || profile?.age,
      goal: editGoal,
      activityLevel: editActivity,
      dietPreference: editDiet,
    };

    // Update stores
    setProfile(updatedData);
    if (updateUser) {
      updateUser({ name: updatedData.name });
    }

    // Update targets local state with recalculated values
    const newProfile = useUserStore.getState().profile;
    setTargets({
      targetCalories: newProfile.targetCalories,
      targetProtein: newProfile.targetProtein,
      targetCarbs: newProfile.targetCarbs,
      targetFat: newProfile.targetFat,
      targetFiber: newProfile.targetFiber || 30,
      targetSteps: newProfile.targetSteps || 10000,
    });

    // Sync to Supabase cloud
    syncProfileToCloud(null, user?.email, newProfile);

    setIsEditProfileOpen(false);
    triggerNotice('✅ Personal Profile & Calorie Targets recalculations saved!');
  };

  const calculateBMI = () => {
    if (!profile?.height || !profile?.weight) return 0;
    const heightInMeters = profile.height / 100;
    return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    const val = Number(bmi);
    if (val < 18.5) return 'Underweight';
    if (val < 25) return 'Normal Weight ✨';
    if (val < 30) return 'Overweight';
    return 'Obese';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen bg-dark-900 text-white pb-36 px-4 md:px-6 pt-6 max-w-2xl mx-auto space-y-6"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-accent/20 border border-accent text-accent rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Sparkles size={16} />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full gradient-accent flex items-center justify-center text-3xl font-extrabold text-dark-900 shadow-xl shadow-accent/20 mb-3 relative">
          {getInitials(user?.name)}
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-dark-800 rounded-full flex items-center justify-center border-2 border-dark-900 text-accent">
            <User size={14} />
          </div>
        </div>

        <h1 className="text-2xl font-bold">{user?.name || 'Athlete'}</h1>
        <p className="text-gray-400 text-xs mt-0.5">{user?.email || 'user@example.com'}</p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-accent px-3 py-1 bg-accent/10 rounded-full font-semibold capitalize">
            {profile?.gender || 'athlete'} • {profile?.goal || 'fitness'}
          </span>
          <span className="text-xs text-gray-400 px-3 py-1 bg-dark-800 rounded-full font-medium">
            Since {profile?.startDate ? new Date(profile.startDate).toLocaleDateString() : 'recently'}
          </span>
        </div>

        {/* Edit Personal Info Button */}
        <button
          onClick={handleOpenEditProfile}
          className="mt-3 text-xs bg-dark-800 hover:bg-dark-700 text-accent font-bold px-4 py-2 rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Edit3 size={14} /> Edit Personal Profile
        </button>
      </div>

      {/* ============================================================== */}
      {/* GYM PARTNER & EXPENSE SPLITTER SECTION */}
      {/* ============================================================== */}
      <div className="glass p-5 rounded-3xl border border-white/10 space-y-3.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👫</span>
            <div>
              <h2 className="text-base font-bold text-white">Gym Partner & Shared Expenses</h2>
              <p className="text-xs text-gray-400">Track mutual gym spending, protein & splits</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Expense Splitter Card */}
          <div 
            onClick={() => navigate('/expenses')}
            className="bg-dark-800 hover:bg-dark-700/80 p-3.5 rounded-2xl border border-white/5 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-accent">
              <ReceiptText size={18} />
              <ChevronRight size={14} className="text-gray-500 group-hover:text-accent transition-colors" />
            </div>
            <div className="font-bold text-xs text-white">Expense Splitter</div>
            <div className="text-[11px] text-gray-400">
              {expenseSummary.balance > 0 ? (
                <span className="text-emerald-400 font-bold">
                  {partnerName} owes you ₹{formatNumber(expenseSummary.balance)}
                </span>
              ) : expenseSummary.balance < 0 ? (
                <span className="text-orange-400 font-bold">
                  You owe ₹{formatNumber(Math.abs(expenseSummary.balance))}
                </span>
              ) : (
                <span>All settled up ✨</span>
              )}
            </div>
          </div>

          {/* Partner Diet Card */}
          <div 
            onClick={() => navigate('/plan/diet')}
            className="bg-dark-800 hover:bg-dark-700/80 p-3.5 rounded-2xl border border-white/5 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-accent2">
              <Users size={18} />
              <ChevronRight size={14} className="text-gray-500 group-hover:text-accent2 transition-colors" />
            </div>
            <div className="font-bold text-xs text-white">Partner Diet</div>
            <div className="text-[11px] text-gray-400">
              {partner ? `Synced with ${partner.name}` : 'Connect gym buddy'}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BODY STATS CARD */}
      {/* ============================================================== */}
      <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User size={20} className="text-accent" /> Personal Body Stats
          </h2>
          <button 
            onClick={handleOpenEditProfile} 
            className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
          >
            <Edit3 size={13} /> Edit
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark-800 p-3.5 rounded-2xl border border-white/5">
            <div className="text-xs text-gray-400 mb-0.5">Body Weight</div>
            <div className="font-extrabold text-xl text-white">{profile?.weight || '--'} kg</div>
          </div>
          <div className="bg-dark-800 p-3.5 rounded-2xl border border-white/5">
            <div className="text-xs text-gray-400 mb-0.5">Height</div>
            <div className="font-extrabold text-xl text-white">{profile?.height || '--'} cm</div>
          </div>
          <div className="bg-dark-800 p-3.5 rounded-2xl border border-white/5">
            <div className="text-xs text-gray-400 mb-0.5">Age</div>
            <div className="font-extrabold text-xl text-white">{profile?.age || '--'} yrs</div>
          </div>
          <div className="bg-dark-800 p-3.5 rounded-2xl border border-white/5">
            <div className="text-xs text-gray-400 mb-0.5">BMI</div>
            <div className="font-extrabold text-xl text-accent2 flex items-center gap-1.5">
              <span>{calculateBMI()}</span>
              <span className="text-[10px] text-gray-400 font-normal">({getBMICategory(calculateBMI())})</span>
            </div>
          </div>

          <div className="bg-dark-800 p-4 rounded-2xl col-span-2 flex justify-between items-center border border-white/5">
            <div>
              <div className="text-xs text-gray-400">TDEE (Total Daily Energy Expenditure)</div>
              <div className="font-black text-xl text-accent mt-0.5">
                {profile?.tdee || 2200} kcal/day
              </div>
            </div>
            <div className="text-2xl">🔥</div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* DAILY TARGETS CARD */}
      {/* ============================================================== */}
      <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Settings size={20} className="text-accent2" /> Daily Targets
          </h2>
          {!editingTargets ? (
            <button 
              onClick={() => setEditingTargets(true)} 
              className="text-xs text-accent font-semibold hover:underline flex items-center gap-1"
            >
              <Edit3 size={13} /> Customize
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => {
                  setTargets({
                    targetCalories: profile?.targetCalories || 2000,
                    targetProtein: profile?.targetProtein || 150,
                    targetCarbs: profile?.targetCarbs || 200,
                    targetFat: profile?.targetFat || 65,
                    targetFiber: profile?.targetFiber || 30,
                    targetSteps: profile?.targetSteps || 10000,
                  });
                  setEditingTargets(false);
                }}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSaveTargets} 
                className="text-xs bg-accent text-dark-900 font-bold px-3 py-1 rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
              >
                <Save size={14} /> Save Targets
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {Object.keys(targets).map((key) => {
            const label = key.replace('target', '');
            const unit = key.includes('Calories') ? 'kcal' : key.includes('Steps') ? 'steps' : 'g';
            return (
              <div key={key} className="flex justify-between items-center text-xs pb-2.5 border-b border-white/5 last:border-none">
                <span className="text-gray-300 font-medium capitalize">{label}</span>
                {editingTargets ? (
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number" 
                      value={targets[key] === '' ? '' : targets[key]} 
                      onChange={(e) => setTargets({ 
                        ...targets, 
                        [key]: e.target.value === '' ? '' : Number(e.target.value) 
                      })}
                      className="w-24 bg-dark-700 text-right px-2.5 py-1.5 rounded-lg font-bold text-white outline-none focus:ring-2 focus:ring-accent text-xs"
                      placeholder="0"
                    />
                    <span className="text-gray-500 text-[10px] w-8">{unit}</span>
                  </div>
                ) : (
                  <span className="font-bold text-white text-sm">
                    {targets[key]} <span className="text-[10px] text-gray-500 font-normal">{unit}</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Preferences Summary */}
      <div className="glass p-6 rounded-3xl border border-white/5 space-y-3">
        <h2 className="text-lg font-bold mb-2">Fitness Preferences</h2>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-gray-400">Primary Goal</span>
            <span className="capitalize font-semibold text-white">{profile?.goal || 'Maintain'}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-gray-400">Activity Level</span>
            <span className="capitalize font-semibold text-white">{profile?.activityLevel?.replace('_', ' ') || 'Active'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Diet Type</span>
            <span className="capitalize font-semibold text-white">{profile?.dietPreference || 'Non-Vegetarian'}</span>
          </div>
        </div>
      </div>

      {/* System & Storage Status */}
      <div className="bg-dark-800 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className={isSupabaseConfigured ? "text-emerald-400" : "text-gray-500"} />
          <div>
            <div className="font-semibold text-xs text-white">Cloud Database Sync</div>
            <div className="text-[10px] text-gray-400">
              {isSupabaseConfigured ? 'Supabase Connected ✅' : 'Local Storage Mode'}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <Button 
        variant="danger" 
        fullWidth 
        size="lg" 
        onClick={handleLogout} 
        icon={<LogOut size={18} />}
      >
        Log Out
      </Button>

      {/* ============================================================== */}
      {/* EDIT PERSONAL PROFILE MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="Edit Personal Profile">
            <form onSubmit={handleSavePersonalInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-dark-700 rounded-xl py-2.5 px-3.5 text-xs text-white font-semibold outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['male', 'female'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setEditGender(g)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        editGender === g
                          ? 'bg-accent/20 border-accent text-accent'
                          : 'bg-dark-700 border-white/5 text-gray-400'
                      }`}
                    >
                      {g === 'male' ? '♂️ Male' : '♀️ Female'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight & Height */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    step="0.5"
                    required
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="w-full bg-dark-700 rounded-xl py-2.5 px-3 text-xs text-white font-bold outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    required
                    value={editHeight}
                    onChange={(e) => setEditHeight(e.target.value)}
                    className="w-full bg-dark-700 rounded-xl py-2.5 px-3 text-xs text-white font-bold outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Age & Goal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Age (yrs)
                  </label>
                  <input
                    type="number"
                    min="12"
                    max="100"
                    required
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="w-full bg-dark-700 rounded-xl py-2.5 px-3 text-xs text-white font-bold outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Fitness Goal
                  </label>
                  <select
                    value={editGoal}
                    onChange={(e) => setEditGoal(e.target.value)}
                    className="w-full bg-dark-700 rounded-xl py-2.5 px-2.5 text-xs text-white font-semibold outline-none"
                  >
                    <option value="gain">Build Muscle 💪</option>
                    <option value="lose">Lose Weight 🔥</option>
                    <option value="maintain">Maintain ⚖️</option>
                    <option value="fit">Get Fit 🏃</option>
                  </select>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Activity Level
                </label>
                <select
                  value={editActivity}
                  onChange={(e) => setEditActivity(e.target.value)}
                  className="w-full bg-dark-700 rounded-xl py-2.5 px-3 text-xs text-white font-semibold outline-none"
                >
                  <option value="sedentary">Sedentary (Desk Job, little exercise)</option>
                  <option value="light">Lightly Active (Exercise 1-3 days/wk)</option>
                  <option value="active">Active (Gym 3-5 days/wk)</option>
                  <option value="very_active">Very Active (Gym 6-7 days/wk)</option>
                </select>
              </div>

              {/* Diet Preference */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Dietary Preference
                </label>
                <select
                  value={editDiet}
                  onChange={(e) => setEditDiet(e.target.value)}
                  className="w-full bg-dark-700 rounded-xl py-2.5 px-3 text-xs text-white font-semibold outline-none"
                >
                  <option value="nonveg">Non-Vegetarian 🥩</option>
                  <option value="veg">Vegetarian 🥗</option>
                  <option value="vegan">Vegan 🌱</option>
                  <option value="keto">Keto 🥑</option>
                </select>
              </div>

              <div className="pt-2">
                <Button variant="primary" fullWidth size="lg" type="submit">
                  Save Personal Profile & Recalculate
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
