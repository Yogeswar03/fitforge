import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTodayStr } from '../utils/calculations';

const createEmptyDayLog = () => ({
  workouts: [],
  meals: [],
  loggedFoods: [],
  nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  steps: 0,
  water: 0,
  weight: null,
  notes: '',
  dayCompleted: false,
  completedAt: null,
  completionMessage: '',
});

const useDailyLogStore = create(
  persist(
    (set, get) => ({
      currentEmail: null,
      logsByUser: {}, // { [email]: logs }
      logs: {}, // logs of active user

      setCurrentUser: (email) => {
        if (!email) {
          set({ currentEmail: null, logs: {} });
          return;
        }
        const cleanEmail = email.trim().toLowerCase();
        const existingLogs = get().logsByUser?.[cleanEmail] || {};
        set({
          currentEmail: cleanEmail,
          logs: existingLogs,
        });
      },

      _commitLogs: (newLogs) => {
        const email = get().currentEmail;
        const updatedByUser = email
          ? { ...get().logsByUser, [email]: newLogs }
          : get().logsByUser;

        set({
          logs: newLogs,
          logsByUser: updatedByUser,
        });
      },

      initDay: (dateStr, workoutPlan = { exercises: [] }, dietPlan = { meals: [] }) => {
        const { logs } = get();
        const existing = logs[dateStr];

        if (!existing) {
          const workouts = (workoutPlan.exercises || []).map((ex) => ({ ...ex, completed: false }));
          const meals = (dietPlan.meals || []).map((m) => ({ ...m, completed: false }));

          const newLogs = {
            ...logs,
            [dateStr]: {
              ...createEmptyDayLog(),
              workouts,
              meals,
            },
          };
          get()._commitLogs(newLogs);
          return;
        }

        const shouldSyncWorkouts =
          (!existing.workouts || existing.workouts.length === 0) &&
          workoutPlan.exercises &&
          workoutPlan.exercises.length > 0;
        const shouldSyncMeals =
          (!existing.meals || existing.meals.length === 0) &&
          dietPlan.meals &&
          dietPlan.meals.length > 0;

        if (shouldSyncWorkouts || shouldSyncMeals) {
          const newLogs = {
            ...logs,
            [dateStr]: {
              ...existing,
              workouts: shouldSyncWorkouts
                ? (workoutPlan.exercises || []).map((ex) => ({ ...ex, completed: false }))
                : existing.workouts,
              meals: shouldSyncMeals
                ? (dietPlan.meals || []).map((m) => ({ ...m, completed: false }))
                : existing.meals,
            },
          };
          get()._commitLogs(newLogs);
        }
      },

      syncPlan: (dateStr, workoutPlan, dietPlan) => {
        const { logs } = get();
        const currentLog = logs[dateStr] || createEmptyDayLog();

        let newWorkouts = currentLog.workouts || [];
        if (workoutPlan && workoutPlan.exercises) {
          const existingMap = new Map((currentLog.workouts || []).map((w) => [w.id, w.completed]));
          newWorkouts = workoutPlan.exercises.map((ex) => ({
            ...ex,
            completed: existingMap.get(ex.id) || false,
          }));
        }

        let newMeals = currentLog.meals || [];
        if (dietPlan && dietPlan.meals) {
          const existingMap = new Map((currentLog.meals || []).map((m) => [m.id, m.completed]));
          newMeals = dietPlan.meals.map((m) => ({
            ...m,
            completed: existingMap.get(m.id) || false,
          }));
        }

        const newLogs = {
          ...logs,
          [dateStr]: {
            ...currentLog,
            workouts: newWorkouts,
            meals: newMeals,
          },
        };
        get()._commitLogs(newLogs);
      },

      toggleWorkout: (dateStr, workoutId) => {
        const { logs } = get();
        const currentLog = logs[dateStr] || createEmptyDayLog();
        const workouts = (currentLog.workouts || []).map((w) =>
          w.id === workoutId ? { ...w, completed: !w.completed } : w
        );

        // Check if all completed
        const allWorkoutsDone = workouts.length > 0 && workouts.every((w) => w.completed);
        const allMealsDone = currentLog.meals.length > 0 ? currentLog.meals.every((m) => m.completed) : true;
        const autoCompleted = allWorkoutsDone && allMealsDone;

        const newLogs = {
          ...logs,
          [dateStr]: { 
            ...currentLog, 
            workouts,
            dayCompleted: autoCompleted || currentLog.dayCompleted,
            completedAt: (autoCompleted && !currentLog.completedAt) ? new Date().toISOString() : currentLog.completedAt,
          },
        };
        get()._commitLogs(newLogs);
      },

      addWorkoutExercise: (dateStr, exercise) => {
        const { logs } = get();
        const currentLog = logs[dateStr] || createEmptyDayLog();
        const newLogs = {
          ...logs,
          [dateStr]: {
            ...currentLog,
            workouts: [...(currentLog.workouts || []), { ...exercise, completed: false }],
          },
        };
        get()._commitLogs(newLogs);
      },

      toggleMeal: (dateStr, mealId) => {
        const { logs } = get();
        const currentLog = logs[dateStr] || createEmptyDayLog();
        let mealNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
        let wasCompleted = false;

        const meals = (currentLog.meals || []).map((m) => {
          if (m.id === mealId) {
            wasCompleted = m.completed;
            (m.foods || []).forEach((f) => {
              mealNutrition.calories += Number(f.calories || 0);
              mealNutrition.protein += Number(f.protein || 0);
              mealNutrition.carbs += Number(f.carbs || 0);
              mealNutrition.fat += Number(f.fat || 0);
              mealNutrition.fiber += Number(f.fiber || 0);
            });
            return { ...m, completed: !m.completed };
          }
          return m;
        });

        const sign = wasCompleted ? -1 : 1;
        const currentNutrition = currentLog.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
        const nutrition = {
          calories: Math.max(0, currentNutrition.calories + mealNutrition.calories * sign),
          protein: Math.max(0, currentNutrition.protein + mealNutrition.protein * sign),
          carbs: Math.max(0, currentNutrition.carbs + mealNutrition.carbs * sign),
          fat: Math.max(0, currentNutrition.fat + mealNutrition.fat * sign),
          fiber: Math.max(0, currentNutrition.fiber + mealNutrition.fiber * sign),
        };

        const allWorkoutsDone = currentLog.workouts.length > 0 ? currentLog.workouts.every((w) => w.completed) : true;
        const allMealsDone = meals.length > 0 && meals.every((m) => m.completed);
        const autoCompleted = allWorkoutsDone && allMealsDone;

        const newLogs = {
          ...logs,
          [dateStr]: { 
            ...currentLog, 
            meals, 
            nutrition,
            dayCompleted: autoCompleted || currentLog.dayCompleted,
            completedAt: (autoCompleted && !currentLog.completedAt) ? new Date().toISOString() : currentLog.completedAt,
          },
        };
        get()._commitLogs(newLogs);
      },

      logFood: (dateStr, foodEntry) => {
        const { logs } = get();
        const currentLog = logs[dateStr] || createEmptyDayLog();
        const currentNutrition = currentLog.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

        const cals = Number(foodEntry.calories || 0);
        const pro = Number(foodEntry.protein || 0);
        const carb = Number(foodEntry.carbs || 0);
        const fat = Number(foodEntry.fat || 0);
        const fib = Number(foodEntry.fiber || 0);

        const newFoodItem = {
          id: foodEntry.id || Date.now().toString(),
          name: foodEntry.name || 'Food Item',
          itemsUsed: foodEntry.itemsUsed || '',
          qty: Number(foodEntry.qty || foodEntry.weight || 100),
          unit: foodEntry.unit || 'g',
          calories: cals,
          protein: pro,
          carbs: carb,
          fat: fat,
          fiber: fib,
          mealType: foodEntry.mealType || 'snack',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedLoggedFoods = [...(currentLog.loggedFoods || []), newFoodItem];

        const updatedNutrition = {
          calories: Math.round(currentNutrition.calories + cals),
          protein: Math.round((currentNutrition.protein + pro) * 10) / 10,
          carbs: Math.round((currentNutrition.carbs + carb) * 10) / 10,
          fat: Math.round((currentNutrition.fat + fat) * 10) / 10,
          fiber: Math.round((currentNutrition.fiber + fib) * 10) / 10,
        };

        const newLogs = {
          ...logs,
          [dateStr]: {
            ...currentLog,
            loggedFoods: updatedLoggedFoods,
            nutrition: updatedNutrition,
          },
        };
        get()._commitLogs(newLogs);
      },

      batchLogAiMeals: (dateStr, newMealsList) => {
        const { logs } = get();
        const currentLog = logs[dateStr] || createEmptyDayLog();
        const currentMeals = currentLog.meals || [];

        const processedMeals = (newMealsList || []).map((m) => ({
          ...m,
          id: m.id || Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
          completed: true,
        }));

        const updatedMeals = [...currentMeals, ...processedMeals];

        let totalCal = 0, totalPro = 0, totalCarb = 0, totalFat = 0, totalFib = 0;
        updatedMeals.forEach((meal) => {
          if (meal.completed) {
            (meal.foods || []).forEach((f) => {
              totalCal += Number(f.calories || 0);
              totalPro += Number(f.protein || 0);
              totalCarb += Number(f.carbs || 0);
              totalFat += Number(f.fat || 0);
              totalFib += Number(f.fiber || 0);
            });
          }
        });
        (currentLog.loggedFoods || []).forEach((f) => {
          totalCal += Number(f.calories || 0);
          totalPro += Number(f.protein || 0);
          totalCarb += Number(f.carbs || 0);
          totalFat += Number(f.fat || 0);
          totalFib += Number(f.fiber || 0);
        });

        const newLogs = {
          ...logs,
          [dateStr]: {
            ...currentLog,
            meals: updatedMeals,
            nutrition: {
              calories: Math.round(totalCal),
              protein: Math.round(totalPro * 10) / 10,
              carbs: Math.round(totalCarb * 10) / 10,
              fat: Math.round(totalFat * 10) / 10,
              fiber: Math.round(totalFib * 10) / 10,
            },
          },
        };
        get()._commitLogs(newLogs);
      },

      removeLoggedFood: (dateStr, foodId) => {
        const { logs } = get();
        const currentLog = logs[dateStr];
        if (!currentLog) return;

        const itemToRemove = (currentLog.loggedFoods || []).find((f) => f.id === foodId);
        if (!itemToRemove) return;

        const updatedLoggedFoods = currentLog.loggedFoods.filter((f) => f.id !== foodId);
        const currentNutrition = currentLog.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

        const updatedNutrition = {
          calories: Math.max(0, Math.round(currentNutrition.calories - (itemToRemove.calories || 0))),
          protein: Math.max(0, Math.round((currentNutrition.protein - (itemToRemove.protein || 0)) * 10) / 10),
          carbs: Math.max(0, Math.round((currentNutrition.carbs - (itemToRemove.carbs || 0)) * 10) / 10),
          fat: Math.max(0, Math.round((currentNutrition.fat - (itemToRemove.fat || 0)) * 10) / 10),
          fiber: Math.max(0, Math.round((currentNutrition.fiber - (itemToRemove.fiber || 0)) * 10) / 10),
        };

        const newLogs = {
          ...logs,
          [dateStr]: {
            ...currentLog,
            loggedFoods: updatedLoggedFoods,
            nutrition: updatedNutrition,
          },
        };
        get()._commitLogs(newLogs);
      },

      // Mark the entire day complete with a custom celebration message
      markDayCompleted: (dateStr, isCompleted = true, completionMessage = '') => {
        const { logs } = get();
        const currentLog = logs[dateStr] || createEmptyDayLog();

        const newLogs = {
          ...logs,
          [dateStr]: {
            ...currentLog,
            dayCompleted: isCompleted,
            completedAt: isCompleted ? new Date().toISOString() : null,
            completionMessage: completionMessage || currentLog.completionMessage,
          },
        };
        get()._commitLogs(newLogs);
      },

      updateSteps: (dateStr, steps) => {
        const { logs } = get();
        const currentLog = logs[dateStr] || createEmptyDayLog();
        const newLogs = {
          ...logs,
          [dateStr]: { ...currentLog, steps: Number(steps) },
        };
        get()._commitLogs(newLogs);
      },

      updateWater: (dateStr, water) => {
        const { logs } = get();
        const currentLog = logs[dateStr] || createEmptyDayLog();
        const newLogs = {
          ...logs,
          [dateStr]: { ...currentLog, water: Math.max(0, Number(water)) },
        };
        get()._commitLogs(newLogs);
      },

      updateWeight: (dateStr, weight) => {
        const { logs } = get();
        const currentLog = logs[dateStr] || createEmptyDayLog();
        const newLogs = {
          ...logs,
          [dateStr]: { ...currentLog, weight: Number(weight) },
        };
        get()._commitLogs(newLogs);
      },

      getDay: (dateStr) => get().logs[dateStr] || null,

      getDayNutrition: (dateStr) =>
        get().logs[dateStr]?.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },

      getCompletedDays: () =>
        Object.keys(get().logs).filter((date) => get().logs[date]?.dayCompleted),

      getStreak: () => {
        const logs = get().logs || {};
        let streak = 0;
        const checkDate = new Date();

        const todayStr = getTodayStr();
        // If today is completed, start from today, else start checking from yesterday
        if (!logs[todayStr]?.dayCompleted) {
          checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
          const y = checkDate.getFullYear();
          const m = String(checkDate.getMonth() + 1).padStart(2, '0');
          const d = String(checkDate.getDate()).padStart(2, '0');
          const checkStr = `${y}-${m}-${d}`;

          if (logs[checkStr]?.dayCompleted) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

        return streak;
      },
    }),
    { name: 'fitforge-daily-logs' }
  )
);

export default useDailyLogStore;
