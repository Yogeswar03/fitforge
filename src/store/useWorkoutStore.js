import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getDefaultWeeklyPlan = () => ({
  0: { name: 'Rest Day', isRestDay: true, exercises: [] },
  1: { name: '', isRestDay: false, exercises: [] },
  2: { name: '', isRestDay: false, exercises: [] },
  3: { name: '', isRestDay: false, exercises: [] },
  4: { name: '', isRestDay: false, exercises: [] },
  5: { name: '', isRestDay: false, exercises: [] },
  6: { name: '', isRestDay: false, exercises: [] },
});

const useWorkoutStore = create(
  persist(
    (set, get) => ({
      currentEmail: null,
      weeklyPlansByUser: {}, // { [email]: weeklyPlan }
      weeklyPlan: getDefaultWeeklyPlan(),

      setCurrentUser: (email) => {
        if (!email) {
          set({ currentEmail: null, weeklyPlan: getDefaultWeeklyPlan() });
          return;
        }
        const cleanEmail = email.trim().toLowerCase();
        const existingPlan = get().weeklyPlansByUser?.[cleanEmail] || getDefaultWeeklyPlan();
        set({
          currentEmail: cleanEmail,
          weeklyPlan: existingPlan,
        });
      },

      setDayPlan: (dayOfWeek, data) => set((state) => {
        const email = state.currentEmail;
        const currentPlan = state.weeklyPlan || getDefaultWeeklyPlan();
        const updatedWeeklyPlan = {
          ...currentPlan,
          [dayOfWeek]: { ...currentPlan[dayOfWeek], ...data },
        };

        const updatedByUser = email
          ? { ...state.weeklyPlansByUser, [email]: updatedWeeklyPlan }
          : state.weeklyPlansByUser;

        return {
          weeklyPlan: updatedWeeklyPlan,
          weeklyPlansByUser: updatedByUser,
        };
      }),

      addExercise: (dayOfWeek, exercise) => set((state) => {
        const email = state.currentEmail;
        const currentPlan = state.weeklyPlan || getDefaultWeeklyPlan();
        const currentDay = currentPlan[dayOfWeek] || { name: '', isRestDay: false, exercises: [] };

        const updatedWeeklyPlan = {
          ...currentPlan,
          [dayOfWeek]: {
            ...currentDay,
            exercises: [...(currentDay.exercises || []), exercise],
          },
        };

        const updatedByUser = email
          ? { ...state.weeklyPlansByUser, [email]: updatedWeeklyPlan }
          : state.weeklyPlansByUser;

        return {
          weeklyPlan: updatedWeeklyPlan,
          weeklyPlansByUser: updatedByUser,
        };
      }),

      removeExercise: (dayOfWeek, exerciseId) => set((state) => {
        const email = state.currentEmail;
        const currentPlan = state.weeklyPlan || getDefaultWeeklyPlan();
        const currentDay = currentPlan[dayOfWeek] || { name: '', isRestDay: false, exercises: [] };

        const updatedWeeklyPlan = {
          ...currentPlan,
          [dayOfWeek]: {
            ...currentDay,
            exercises: (currentDay.exercises || []).filter((ex) => ex.id !== exerciseId),
          },
        };

        const updatedByUser = email
          ? { ...state.weeklyPlansByUser, [email]: updatedWeeklyPlan }
          : state.weeklyPlansByUser;

        return {
          weeklyPlan: updatedWeeklyPlan,
          weeklyPlansByUser: updatedByUser,
        };
      }),

      updateExercise: (dayOfWeek, exerciseId, data) => set((state) => {
        const email = state.currentEmail;
        const currentPlan = state.weeklyPlan || getDefaultWeeklyPlan();
        const currentDay = currentPlan[dayOfWeek] || { name: '', isRestDay: false, exercises: [] };

        const updatedWeeklyPlan = {
          ...currentPlan,
          [dayOfWeek]: {
            ...currentDay,
            exercises: (currentDay.exercises || []).map((ex) =>
              ex.id === exerciseId ? { ...ex, ...data } : ex
            ),
          },
        };

        const updatedByUser = email
          ? { ...state.weeklyPlansByUser, [email]: updatedWeeklyPlan }
          : state.weeklyPlansByUser;

        return {
          weeklyPlan: updatedWeeklyPlan,
          weeklyPlansByUser: updatedByUser,
        };
      }),

      getDayPlan: (dayOfWeek) => {
        return get().weeklyPlan?.[dayOfWeek] || { name: '', isRestDay: false, exercises: [] };
      },
    }),
    { name: 'fitforge-workouts' }
  )
);

export default useWorkoutStore;
