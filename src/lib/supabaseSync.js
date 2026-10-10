import supabase, { isSupabaseConfigured } from './supabase';
import useUserStore from '../store/useUserStore';
import useWorkoutStore from '../store/useWorkoutStore';
import useDietStore from '../store/useDietStore';
import useDailyLogStore from '../store/useDailyLogStore';

const getActiveUserId = async (passedId) => {
  if (passedId) return passedId;
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id || null;
  } catch (e) {
    return null;
  }
};

/**
 * Sync user profile to Supabase 'profiles' table
 */
export const syncProfileToCloud = async (userId, email, profileData) => {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const uid = await getActiveUserId(userId);
    if (!uid) return null;

    const userIdentifier = (email || '').toLowerCase();
    const cleanEmail = userIdentifier.includes('@')
      ? userIdentifier
      : `${userIdentifier.replace(/\D/g, '') || uid}@phone.fitforge.app`;
    const payload = {
      id: uid,
      email: cleanEmail,
      name: profileData.name || (userIdentifier.includes('@') ? userIdentifier.split('@')[0] : `Athlete`),
      age: profileData.age ? Number(profileData.age) : null,
      height: profileData.height ? Number(profileData.height) : null,
      weight: profileData.weight ? Number(profileData.weight) : null,
      gender: profileData.gender || 'male',
      goal: profileData.goal || 'maintain',
      activity_level: profileData.activityLevel || 'sedentary',
      diet_preference: profileData.dietPreference || 'any',
      tdee: profileData.tdee || 2000,
      target_calories: profileData.targetCalories || 2000,
      target_protein: profileData.targetProtein || 150,
      target_carbs: profileData.targetCarbs || 200,
      target_fat: profileData.targetFat || 60,
      target_fiber: profileData.targetFiber || 30,
      target_steps: profileData.targetSteps || 10000,
      start_date: profileData.startDate || new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase profile sync error:', error.message);
    } else {
      console.log('✅ Profile synced to Supabase cloud');
    }
    return data;
  } catch (err) {
    console.warn('Error syncing profile to cloud:', err);
    return null;
  }
};

/**
 * Sync workout routine to Supabase 'workout_plans' table
 */
export const syncWorkoutPlanToCloud = async (userId, dayOfWeek, planData) => {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const uid = await getActiveUserId(userId);
    if (!uid) return null;

    const payload = {
      user_id: uid,
      day_of_week: Number(dayOfWeek),
      workout_name: planData.name || 'Workout Day',
      is_rest_day: !!planData.isRestDay,
      exercises: planData.exercises || [],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('workout_plans')
      .upsert(payload, { onConflict: 'user_id,day_of_week' });

    if (error) {
      console.warn('Supabase workout sync error:', error.message);
    }
    return data;
  } catch (err) {
    console.warn('Error syncing workout plan to cloud:', err);
    return null;
  }
};

/**
 * Sync diet plan to Supabase 'diet_plans' table
 */
export const syncDietPlanToCloud = async (userId, dayOfWeek, mealsData) => {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const uid = await getActiveUserId(userId);
    if (!uid) return null;

    const payload = {
      user_id: uid,
      day_of_week: Number(dayOfWeek),
      meals: mealsData || [],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('diet_plans')
      .upsert(payload, { onConflict: 'user_id,day_of_week' });

    if (error) {
      console.warn('Supabase diet sync error:', error.message);
    }
    return data;
  } catch (err) {
    console.warn('Error syncing diet plan to cloud:', err);
    return null;
  }
};

/**
 * Sync daily log to Supabase 'daily_logs' table
 */
export const syncDailyLogToCloud = async (userId, dateStr, dayLog) => {
  if (!isSupabaseConfigured || !supabase || !dayLog) return null;

  try {
    const uid = await getActiveUserId(userId);
    if (!uid) return null;

    const payload = {
      user_id: uid,
      log_date: dateStr,
      workouts: dayLog.workouts || [],
      meals: dayLog.meals || [],
      logged_foods: dayLog.loggedFoods || [],
      nutrition: dayLog.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      steps: Number(dayLog.steps || 0),
      water: Number(dayLog.water || 0),
      weight: dayLog.weight ? Number(dayLog.weight) : null,
      notes: dayLog.notes || '',
      day_completed: !!dayLog.dayCompleted,
      completed_at: dayLog.completedAt || null,
      completion_message: dayLog.completionMessage || '',
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('daily_logs')
      .upsert(payload, { onConflict: 'user_id,log_date' });

    if (error) {
      console.warn('Supabase daily log sync error:', error.message);
    }
    return data;
  } catch (err) {
    console.warn('Error syncing daily log to cloud:', err);
    return null;
  }
};

/**
 * Fetch all user data from Supabase and hydrate local stores
 */
export const loadAllUserDataFromCloud = async (userId, email) => {
  if (!isSupabaseConfigured || !supabase || !userId) return;

  try {
    // 1. Fetch Profile
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileRow) {
      useUserStore.getState().setProfile({
        name: profileRow.name,
        age: profileRow.age,
        height: profileRow.height,
        weight: profileRow.weight,
        gender: profileRow.gender,
        goal: profileRow.goal,
        activityLevel: profileRow.activity_level,
        dietPreference: profileRow.diet_preference,
        tdee: profileRow.tdee,
        targetCalories: profileRow.target_calories,
        targetProtein: profileRow.target_protein,
        targetCarbs: profileRow.target_carbs,
        targetFat: profileRow.target_fat,
        targetFiber: profileRow.target_fiber,
        targetSteps: profileRow.target_steps,
        startDate: profileRow.start_date,
      });
    }

    // 2. Fetch Workout Plans
    const { data: workoutRows } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', userId);

    if (workoutRows && workoutRows.length > 0) {
      workoutRows.forEach((row) => {
        useWorkoutStore.getState().setDayPlan(row.day_of_week, {
          name: row.workout_name,
          isRestDay: row.is_rest_day,
          exercises: row.exercises || [],
        });
      });
    }

    // 3. Fetch Diet Plans
    const { data: dietRows } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('user_id', userId);

    if (dietRows && dietRows.length > 0) {
      dietRows.forEach((row) => {
        useDietStore.getState().setDayMeals(row.day_of_week, row.meals || []);
      });
    }

    // 4. Fetch Daily Logs
    const { data: logRows } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId);

    if (logRows && logRows.length > 0) {
      const logsMap = {};
      logRows.forEach((row) => {
        logsMap[row.log_date] = {
          workouts: row.workouts || [],
          meals: row.meals || [],
          loggedFoods: row.logged_foods || [],
          nutrition: row.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
          steps: row.steps || 0,
          water: row.water || 0,
          weight: row.weight,
          notes: row.notes || '',
          dayCompleted: row.day_completed,
          completedAt: row.completed_at,
          completionMessage: row.completion_message,
        };
      });
      useDailyLogStore.getState()._commitLogs(logsMap);
    }
  } catch (err) {
    console.warn('Error loading cloud user data:', err);
  }
};
