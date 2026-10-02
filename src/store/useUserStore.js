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

        // Recalculate TDEE & Macros if required info is present
        if (
          updatedProfile.weight &&
          updatedProfile.height &&
          updatedProfile.age &&
          updatedProfile.gender &&
          updatedProfile.activityLevel
        ) {
          const tdee = calculateTDEE(
            updatedProfile.weight,
            updatedProfile.height,
            updatedProfile.age,
            updatedProfile.gender,
            updatedProfile.activityLevel
          );

          updatedProfile.tdee = Math.round(tdee);
          const macros = calculateMacros(tdee, updatedProfile.weight, updatedProfile.goal);
          updatedProfile.targetCalories = macros.calories;
          updatedProfile.targetProtein = macros.protein;
          updatedProfile.targetCarbs = macros.carbs;
          updatedProfile.targetFat = macros.fat;
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
