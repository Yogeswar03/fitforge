import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUserStore from '../store/useUserStore';
import { syncProfileToCloud } from '../lib/supabaseSync';
import Button from '../components/ui/Button';

const goals = [
  { id: 'lose', icon: '🔥', title: 'Lose Weight', desc: 'Burn fat and get leaner' },
  { id: 'gain', icon: '💪', title: 'Build Muscle', desc: 'Increase strength and mass' },
  { id: 'maintain', icon: '⚖️', title: 'Maintain', desc: 'Stay at your current weight' },
  { id: 'fit', icon: '🏃', title: 'Get Fit', desc: 'Improve overall stamina' },
];

const activities = [
  { id: 'sedentary', icon: '🪑', title: 'Sedentary', desc: 'Little to no exercise' },
  { id: 'light', icon: '🚶', title: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { id: 'active', icon: '🏋️', title: 'Active', desc: 'Moderate exercise 3-5 days/week' },
  { id: 'very_active', icon: '⚡', title: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
];

const diets = [
  { id: 'nonveg', icon: '🥩', title: 'Non-Veg', desc: 'Eats meat and plant-based' },
  { id: 'veg', icon: '🥗', title: 'Vegetarian', desc: 'No meat, includes dairy/eggs' },
  { id: 'vegan', icon: '🌱', title: 'Vegan', desc: 'Strictly plant-based' },
  { id: 'keto', icon: '🥑', title: 'Keto', desc: 'High fat, low carb' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const setOnboarded = useAuthStore((state) => state.setOnboarded);
  const setProfile = useUserStore((state) => state.setProfile);

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    goal: '',
    activityLevel: '',
    dietPreference: '',
  });

  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleFinish = async () => {
    const profilePayload = {
      ...data,
      age: Number(data.age),
      height: Number(data.height),
      weight: Number(data.weight),
    };
    setProfile(profilePayload);
    setOnboarded();

    const authUser = useAuthStore.getState().user;
    if (authUser?.id && authUser?.email) {
      await syncProfileToCloud(authUser.id, authUser.email, profilePayload);
    }

    navigate('/');
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col px-6 pt-12 pb-24 safe-bottom">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Step {step} of 4</span>
          <span>{Math.round((step / 4) * 100)}%</span>
        </div>
        <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full gradient-accent transition-all duration-300 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">About You</h2>
                <p className="text-gray-400">Let's get some basic information.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setData({ ...data, gender: 'male' })}
                    className={`flex-1 py-4 rounded-2xl border-2 transition-colors ${data.gender === 'male' ? 'border-accent bg-accent/10' : 'border-white/5 bg-dark-800'}`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setData({ ...data, gender: 'female' })}
                    className={`flex-1 py-4 rounded-2xl border-2 transition-colors ${data.gender === 'female' ? 'border-accent bg-accent/10' : 'border-white/5 bg-dark-800'}`}
                  >
                    Female
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Age</label>
                  <input
                    type="number"
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                    className="w-full bg-dark-800 border border-white/5 rounded-xl py-4 px-4 text-lg focus:outline-none focus:border-accent"
                    placeholder="e.g. 25"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={data.height}
                    onChange={(e) => setData({ ...data, height: e.target.value })}
                    className="w-full bg-dark-800 border border-white/5 rounded-xl py-4 px-4 text-lg focus:outline-none focus:border-accent"
                    placeholder="e.g. 175"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={data.weight}
                    onChange={(e) => setData({ ...data, weight: e.target.value })}
                    className="w-full bg-dark-800 border border-white/5 rounded-xl py-4 px-4 text-lg focus:outline-none focus:border-accent"
                    placeholder="e.g. 70"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Goal</h2>
                <p className="text-gray-400">What do you want to achieve?</p>
              </div>
              <div className="grid gap-4">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setData({ ...data, goal: g.id })}
                    className={`p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-colors ${data.goal === g.id ? 'border-accent bg-accent/10' : 'border-white/5 bg-dark-800'}`}
                  >
                    <span className="text-3xl">{g.icon}</span>
                    <div>
                      <div className="font-bold text-lg">{g.title}</div>
                      <div className="text-sm text-gray-400">{g.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Activity Level</h2>
                <p className="text-gray-400">How active are you day-to-day?</p>
              </div>
              <div className="grid gap-4">
                {activities.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setData({ ...data, activityLevel: a.id })}
                    className={`p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-colors ${data.activityLevel === a.id ? 'border-accent bg-accent/10' : 'border-white/5 bg-dark-800'}`}
                  >
                    <span className="text-3xl">{a.icon}</span>
                    <div>
                      <div className="font-bold text-lg">{a.title}</div>
                      <div className="text-sm text-gray-400">{a.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Diet Preference</h2>
                <p className="text-gray-400">What kind of food do you prefer?</p>
              </div>
              <div className="grid gap-4">
                {diets.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setData({ ...data, dietPreference: d.id })}
                    className={`p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-colors ${data.dietPreference === d.id ? 'border-accent bg-accent/10' : 'border-white/5 bg-dark-800'}`}
                  >
                    <span className="text-3xl">{d.icon}</span>
                    <div>
                      <div className="font-bold text-lg">{d.title}</div>
                      <div className="text-sm text-gray-400">{d.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-8">
        {step > 1 && (
          <Button variant="outline" onClick={prevStep} className="flex-1 max-w-[100px]">
            <ArrowLeft size={24} />
          </Button>
        )}
        {step < 4 ? (
          <Button 
            variant="primary" 
            onClick={nextStep} 
            className="flex-1 flex items-center justify-center gap-2"
            disabled={
              (step === 1 && (!data.age || !data.height || !data.weight)) ||
              (step === 2 && !data.goal) ||
              (step === 3 && !data.activityLevel)
            }
          >
            Continue <ArrowRight size={20} />
          </Button>
        ) : (
          <Button 
            variant="primary" 
            onClick={handleFinish} 
            className="flex-1 flex items-center justify-center gap-2"
            disabled={!data.dietPreference}
          >
            Finish <Check size={20} />
          </Button>
        )}
      </div>
    </div>
  );
}
