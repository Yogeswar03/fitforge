import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateTDEE, calculateMacros, getTodayStr } from '../utils/calculations';

const getDefaultProfile = () => ({
  age: null,
  height: null,
  weight: null,
  gender: null,
  goal: 'maintain',
  activityLevel: 'sedentary',
  dietPreference: 'any',
  tdee: 0,
  targetCalories: 0,
  targetProtein: 0,
  targetCarbs: 0,
  targetFat: 0,
  targetFiber: 30,
  targetSteps: 10000,
  startDate: null,
});

const useUserStore = create(
  persist(
    (set, get) => ({
      currentEmail: null,
      profiles: {}, // { [email]: profile }
      profile: getDefaultProfile(),

      setCurrentUser: (email) => {
        if (!email) {
          set({ currentEmail: null, profile: getDefaultProfile() });
          return;
        }
        const cleanEmail = email.trim().toLowerCase();
        const existingProfile = get().profiles[cleanEmail] || getDefaultProfile();
        set({
          currentEmail: cleanEmail,
          profile: existingProfile,
        });
      },

      setProfile: (data) => set((state) => {
        const email = state.currentEmail;
        const currentProfile = state.profile || getDefaultProfile();
        const updatedProfile = { ...currentProfile, ...data };

        if (!updatedProfile.startDate) {
          updatedProfile.startDate = getTodayStr();
        }

        const hasBodyStats =
          updatedProfile.weight &&
          updatedProfile.height &&
          updatedProfile.age &&
          updatedProfile.gender &&
          updatedProfile.activityLevel;

        const bodyStatsChanged =
          (data.weight !== undefined && data.weight !== currentProfile.weight) ||
          (data.height !== undefined && data.height !== currentProfile.height) ||
          (data.age !== undefined && data.age !== currentProfile.age) ||
          (data.gender !== undefined && data.gender !== currentProfile.gender) ||
          (data.goal !== undefined && data.goal !== currentProfile.goal) ||
          (data.activityLevel !== undefined && data.activityLevel !== currentProfile.activityLevel);

        if (hasBodyStats) {
          const tdee = calculateTDEE(
            updatedProfile.weight,
            updatedProfile.height,
            updatedProfile.age,
            updatedProfile.gender,
            updatedProfile.activityLevel
          );
          updatedProfile.tdee = Math.round(tdee);

          // Only compute default macros if targets are not set yet, or body stats changed without explicit calorie target
          const needsDefaultMacros =
            (!currentProfile.targetCalories || currentProfile.targetCalories === 0) ||
            (bodyStatsChanged && data.targetCalories === undefined);

          if (needsDefaultMacros) {
            const macros = calculateMacros(
              tdee,
              updatedProfile.weight,
              updatedProfile.goal,
              updatedProfile.dietPreference,
              updatedProfile.activityLevel,
              updatedProfile.gender
            );
            if (data.targetCalories === undefined) updatedProfile.targetCalories = macros.calories;
            if (data.targetProtein === undefined) updatedProfile.targetProtein = macros.protein;
            if (data.targetCarbs === undefined) updatedProfile.targetCarbs = macros.carbs;
            if (data.targetFat === undefined) updatedProfile.targetFat = macros.fat;
            if (data.targetFiber === undefined) updatedProfile.targetFiber = macros.fiber || 30;
            if (data.targetSteps === undefined) updatedProfile.targetSteps = macros.steps || 10000;
            if (data.targetWater === undefined) updatedProfile.targetWater = macros.waterGlasses || 8;
          }
        }

        // Explicit targets from caller ALWAYS win!
        if (data.targetCalories !== undefined) {
          updatedProfile.targetCalories = Number(data.targetCalories);
        }
        if (data.targetProtein !== undefined) {
          updatedProfile.targetProtein = Number(data.targetProtein);
        }
        if (data.targetCarbs !== undefined) {
          updatedProfile.targetCarbs = Number(data.targetCarbs);
        }
        if (data.targetFat !== undefined) {
          updatedProfile.targetFat = Number(data.targetFat);
        }
        if (data.targetFiber !== undefined) {
          updatedProfile.targetFiber = Number(data.targetFiber);
        }
        if (data.targetSteps !== undefined) {
          updatedProfile.targetSteps = Number(data.targetSteps);
        }

        const updatedProfiles = email
          ? { ...state.profiles, [email]: updatedProfile }
          : state.profiles;

        return {
          profile: updatedProfile,
          profiles: updatedProfiles,
        };
      }),
    }),
    { name: 'fitforge-user' }
  )
);

export default useUserStore;
