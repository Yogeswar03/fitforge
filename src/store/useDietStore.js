import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getDefaultWeeklyDiet = () => ({
  0: { meals: [] },
  1: { meals: [] },
  2: { meals: [] },
  3: { meals: [] },
  4: { meals: [] },
  5: { meals: [] },
  6: { meals: [] },
});

const useDietStore = create(
  persist(
    (set, get) => ({
      currentEmail: null,
      weeklyPlansByUser: {}, // { [email]: weeklyDietPlan }
      weeklyPlan: getDefaultWeeklyDiet(),

      setCurrentUser: (email) => {
        if (!email) {
          set({ currentEmail: null, weeklyPlan: getDefaultWeeklyDiet() });
          return;
        }
        const cleanEmail = email.trim().toLowerCase();
        const existingPlan = get().weeklyPlansByUser?.[cleanEmail] || getDefaultWeeklyDiet();
        set({
          currentEmail: cleanEmail,
          weeklyPlan: existingPlan,
        });
      },

      setDayMeals: (dayOfWeek, meals) => set((state) => {
        const email = state.currentEmail;
        const currentPlan = state.weeklyPlan || getDefaultWeeklyDiet();
        const updatedWeeklyPlan = {
          ...currentPlan,
          [dayOfWeek]: { meals: meals || [] },
        };

        const updatedByUser = email
          ? { ...state.weeklyPlansByUser, [email]: updatedWeeklyPlan }
          : state.weeklyPlansByUser;

        return {
          weeklyPlan: updatedWeeklyPlan,
          weeklyPlansByUser: updatedByUser,
        };
      }),

      addMeal: (dayOfWeek, meal) => set((state) => {
        const email = state.currentEmail;
        const currentPlan = state.weeklyPlan || getDefaultWeeklyDiet();
        const currentDayMeals = currentPlan[dayOfWeek]?.meals || [];

        const updatedWeeklyPlan = {
          ...currentPlan,
          [dayOfWeek]: { meals: [...currentDayMeals, meal] },
        };

        const updatedByUser = email
          ? { ...state.weeklyPlansByUser, [email]: updatedWeeklyPlan }
          : state.weeklyPlansByUser;

        return {
          weeklyPlan: updatedWeeklyPlan,
          weeklyPlansByUser: updatedByUser,
        };
      }),

      removeMeal: (dayOfWeek, mealId) => set((state) => {
        const email = state.currentEmail;
        const currentPlan = state.weeklyPlan || getDefaultWeeklyDiet();
        const currentDayMeals = currentPlan[dayOfWeek]?.meals || [];

        const updatedWeeklyPlan = {
          ...currentPlan,
          [dayOfWeek]: {
            meals: currentDayMeals.filter((m) => m.id !== mealId),
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

      updateMeal: (dayOfWeek, mealId, data) => set((state) => {
        const email = state.currentEmail;
        const currentPlan = state.weeklyPlan || getDefaultWeeklyDiet();
        const currentDayMeals = currentPlan[dayOfWeek]?.meals || [];

        const updatedWeeklyPlan = {
          ...currentPlan,
          [dayOfWeek]: {
            meals: currentDayMeals.map((m) => (m.id === mealId ? { ...m, ...data } : m)),
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

      copyDayPlan: (fromDay, toDay) => set((state) => {
        const email = state.currentEmail;
        const currentPlan = state.weeklyPlan || getDefaultWeeklyDiet();
        const mealsToCopy = JSON.parse(JSON.stringify(currentPlan[fromDay]?.meals || []));

        const updatedWeeklyPlan = {
          ...currentPlan,
          [toDay]: { meals: mealsToCopy },
        };

        const updatedByUser = email
          ? { ...state.weeklyPlansByUser, [email]: updatedWeeklyPlan }
          : state.weeklyPlansByUser;

        return {
          weeklyPlan: updatedWeeklyPlan,
          weeklyPlansByUser: updatedByUser,
        };
      }),
    }),
    { name: 'fitforge-diet' }
  )
);

export default useDietStore;
