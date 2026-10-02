import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, User, Settings, ShieldCheck } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUserStore from '../store/useUserStore';
import Button from '../components/ui/Button';

import { isSupabaseConfigured } from '../lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { profile, setProfile } = useUserStore();

  const [targets, setTargets] = useState({
    targetCalories: profile?.targetCalories || 2000,
    targetProtein: profile?.targetProtein || 150,
    targetCarbs: profile?.targetCarbs || 200,
    targetFat: profile?.targetFat || 65,
    targetFiber: profile?.targetFiber || 30,
    targetSteps: profile?.targetSteps || 10000,
  });
  
  const [editingTargets, setEditingTargets] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveTargets = () => {
    setProfile(targets);
    setEditingTargets(false);
  };

  const calculateBMI = () => {
    if (!profile?.height || !profile?.weight) return 0;
    const heightInMeters = profile.height / 100;
    return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-dark-900 text-white pb-24 px-6 pt-8">
      
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full gradient-accent flex items-center justify-center text-3xl font-bold text-dark-900 shadow-lg shadow-accent/20 mb-4 relative">
          {getInitials(user?.name)}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-dark-800 rounded-full flex items-center justify-center border-2 border-dark-900">
            <User size={14} className="text-gray-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
        <p className="text-gray-400">{user?.email || 'user@example.com'}</p>
        <div className="text-xs text-accent mt-2 px-3 py-1 bg-accent/10 rounded-full font-medium">
          Member since {profile?.startDate ? new Date(profile.startDate).toLocaleDateString() : 'recently'}
        </div>
      </div>

      <div className="flex justify-center gap-8 mb-8 text-center glass-strong py-4 rounded-3xl">
        <div>
          <div className="text-2xl font-bold text-accent">🔥 3</div>
          <div className="text-xs text-gray-400">Day Streak</div>
        </div>
        <div className="w-px bg-white/10"></div>
        <div>
          <div className="text-2xl font-bold">14</div>
          <div className="text-xs text-gray-400">Days Active</div>
        </div>
        <div className="w-px bg-white/10"></div>
        <div>
          <div className="text-2xl font-bold text-accent2">85%</div>
          <div className="text-xs text-gray-400">Completion</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Body Stats */}
        <div className="glass p-6 rounded-3xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><User size={20} className="text-accent" /> Body Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-800 p-4 rounded-2xl">
              <div className="text-sm text-gray-400 mb-1">Weight</div>
              <div className="font-bold text-xl">{profile?.weight} kg</div>
            </div>
            <div className="bg-dark-800 p-4 rounded-2xl">
              <div className="text-sm text-gray-400 mb-1">Height</div>
              <div className="font-bold text-xl">{profile?.height} cm</div>
            </div>
            <div className="bg-dark-800 p-4 rounded-2xl">
              <div className="text-sm text-gray-400 mb-1">Age</div>
              <div className="font-bold text-xl">{profile?.age} yrs</div>
            </div>
            <div className="bg-dark-800 p-4 rounded-2xl">
              <div className="text-sm text-gray-400 mb-1">BMI</div>
              <div className="font-bold text-xl text-accent2">{calculateBMI()}</div>
            </div>
            <div className="bg-dark-800 p-4 rounded-2xl col-span-2 flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-400">TDEE (Est. Daily Burn)</div>
                <div className="font-bold text-xl">{profile?.tdee || 2400} kcal</div>
              </div>
              <div className="text-2xl">🔥</div>
            </div>
          </div>
        </div>

        {/* Daily Targets */}
        <div className="glass p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><Settings size={20} className="text-accent2" /> Daily Targets</h2>
            {!editingTargets ? (
              <button onClick={() => setEditingTargets(true)} className="text-sm text-accent">Edit</button>
            ) : (
              <button onClick={handleSaveTargets} className="text-sm text-accent2 flex items-center gap-1"><Save size={16} /> Save</button>
            )}
          </div>
          
          <div className="space-y-4">
            {Object.keys(targets).map(key => {
              const label = key.replace('target', '');
              return (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-400">{label}</span>
                  {editingTargets ? (
                    <input 
                      type="number" 
                      value={targets[key]} 
                      onChange={(e) => setTargets({...targets, [key]: Number(e.target.value)})}
                      className="w-24 bg-dark-700 text-right px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  ) : (
                    <span className="font-bold">{targets[key]}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Preferences Summary */}
        <div className="glass p-6 rounded-3xl">
          <h2 className="text-lg font-bold mb-4">Preferences</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-gray-400">Goal</span>
              <span className="capitalize font-medium">{profile?.goal || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-gray-400">Activity Level</span>
              <span className="capitalize font-medium">{profile?.activityLevel?.replace('_', ' ') || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Diet</span>
              <span className="capitalize font-medium">{profile?.dietPreference || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-dark-800 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
          <ShieldCheck size={24} className={isSupabaseConfigured ? "text-green-400" : "text-gray-500"} />
          <div>
            <div className="font-medium text-sm">Storage Status</div>
            <div className="text-xs text-gray-400">{isSupabaseConfigured ? 'Supabase ✅ (Cloud Sync Active)' : 'Local Storage Only'}</div>
          </div>
        </div>

        <Button variant="danger" fullWidth onClick={handleLogout} className="mt-4 flex items-center justify-center gap-2">
          <LogOut size={20} /> Log Out
        </Button>
      </div>
    </motion.div>
  );
}
