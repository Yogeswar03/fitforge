import supabase, { isSupabaseConfigured } from './supabase';

/**
 * Safe UTF-8 Base64 encoding/decoding
 */
const utf8ToBase64 = (str) => {
  try {
    return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch (e) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
};

const base64ToUtf8 = (str) => {
  try {
    return decodeURIComponent(Array.prototype.map.call(window.atob(str), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    return decodeURIComponent(escape(window.atob(str)));
  }
};

/**
 * Calculate average daily calories from a weekly plan
 */
export const calculatePlanDailyStats = (weeklyPlan) => {
  if (!weeklyPlan) return { avgCalories: 0, avgProtein: 0, totalMeals: 0 };
  
  let totalCalories = 0;
  let totalProtein = 0;
  let totalMeals = 0;
  let activeDays = 0;

  for (let day = 0; day < 7; day++) {
    const meals = weeklyPlan[day]?.meals || [];
    if (meals.length > 0) {
      activeDays++;
      meals.forEach((m) => {
        totalMeals++;
        (m.foods || []).forEach((f) => {
          totalCalories += Number(f.calories || 0);
          totalProtein += Number(f.protein || 0);
        });
      });
    }
  }

  const daysCount = activeDays > 0 ? activeDays : 1;
  return {
    avgCalories: Math.round(totalCalories / daysCount),
    avgProtein: Math.round(totalProtein / daysCount),
    totalMeals,
    activeDays,
  };
};

/**
 * Generate a share payload and link for a diet plan
 */
export const generateDietSharePayload = async (weeklyPlan, user, profile) => {
  const stats = calculatePlanDailyStats(weeklyPlan);
  
  const payload = {
    v: 1,
    owner: {
      name: user?.name || user?.email?.split('@')[0] || 'Gym Buddy',
      email: user?.email || '',
      gender: profile?.gender || 'male',
      targetCalories: Number(profile?.targetCalories) || (stats.avgCalories || 2000),
      targetProtein: Number(profile?.targetProtein) || 140,
      goal: profile?.goal || 'maintain',
    },
    avgCalories: stats.avgCalories,
    avgProtein: stats.avgProtein,
    activeDays: stats.activeDays,
    createdAt: new Date().toISOString(),
    weeklyPlan: weeklyPlan || {},
  };

  const jsonStr = JSON.stringify(payload);
  const base64Code = utf8ToBase64(jsonStr);
  const fullCode = `FITFORGE-DIET-v1:${base64Code}`;

  // Base URL for sharing
  const origin = window.location.origin;
  const pathname = window.location.pathname.replace(/\/$/, '');
  const shareUrl = `${origin}${pathname}/#/plan/diet?partner_diet=${encodeURIComponent(fullCode)}`;

  // Optional: Try creating short 6-digit PIN in Supabase 'shared_diets' table if configured
  let shortPin = null;
  if (isSupabaseConfigured && supabase) {
    try {
      const pinCode = `GYM-${Math.floor(1000 + Math.random() * 9000)}`;
      const { error } = await supabase.from('shared_diets').upsert({
        code: pinCode,
        owner_name: payload.owner.name,
        owner_gender: payload.owner.gender,
        owner_calories: payload.avgCalories,
        plan_data: payload,
        created_at: new Date().toISOString(),
      });
      if (!error) {
        shortPin = pinCode;
      }
    } catch (e) {
      // Graceful fallback to fullCode (works offline & everywhere)
    }
  }

  return {
    payload,
    fullCode,
    shortPin,
    shareUrl,
    stats,
  };
};

/**
 * Parse and validate a diet share code (either short PIN, full encoded string, or URL)
 */
export const parseDietShareCode = async (rawInput) => {
  if (!rawInput || typeof rawInput !== 'string') {
    return { success: false, error: 'Please enter a valid share code or link.' };
  }

  let text = rawInput.trim();

  // If input is a URL with parameter, extract partner_diet
  if (text.includes('partner_diet=')) {
    try {
      const param = text.split('partner_diet=')[1]?.split('&')[0];
      if (param) {
        text = decodeURIComponent(param);
      }
    } catch (e) {
      // continue with text as is
    }
  }

  // Check if it is a short PIN (e.g. GYM-1234)
  if (text.toUpperCase().startsWith('GYM-') && isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('shared_diets')
        .select('*')
        .eq('code', text.toUpperCase())
        .single();

      if (!error && data?.plan_data?.weeklyPlan) {
        return { success: true, payload: data.plan_data };
      }
    } catch (e) {
      console.warn('Could not fetch short PIN from Supabase:', e);
    }
  }

  // Check if it has prefix FITFORGE-DIET-v1:
  let encoded = text;
  if (text.startsWith('FITFORGE-DIET-v1:')) {
    encoded = text.replace('FITFORGE-DIET-v1:', '');
  }

  try {
    const jsonStr = base64ToUtf8(encoded);
    const parsed = JSON.parse(jsonStr);

    if (!parsed.weeklyPlan || typeof parsed.weeklyPlan !== 'object') {
      return { success: false, error: 'The code does not contain a valid weekly diet plan.' };
    }

    return { success: true, payload: parsed };
  } catch (err) {
    return { 
      success: false, 
      error: 'Invalid or corrupted diet code. Please copy and paste the code again.' 
    };
  }
};

/**
 * Scale a weekly diet plan to match recipient's target calories
 * Essential for female & male gym partners who eat the same meals
 */
export const scaleDietPlan = (sourceWeeklyPlan, sourceAvgCalories, targetUserCalories) => {
  if (!sourceWeeklyPlan) return {};

  const sourceCal = Number(sourceAvgCalories) || 2000;
  const targetCal = Number(targetUserCalories) || 2000;

  // Calculate ratio, clamped between 0.35 and 2.5
  let ratio = targetCal / sourceCal;
  if (isNaN(ratio) || ratio <= 0) ratio = 1;
  ratio = Math.min(Math.max(ratio, 0.35), 2.5);

  const scaledPlan = {};

  for (let day = 0; day < 7; day++) {
    const dayData = sourceWeeklyPlan[day];
    if (!dayData || !dayData.meals) {
      scaledPlan[day] = { meals: [] };
      continue;
    }

    scaledPlan[day] = {
      meals: dayData.meals.map((meal) => ({
        ...meal,
        foods: (meal.foods || []).map((f) => {
          const origQty = Number(f.qty || 0);
          const scaledQty = origQty > 0 ? Math.round(origQty * ratio * 10) / 10 : origQty;
          
          return {
            ...f,
            qty: scaledQty,
            calories: Math.round(Number(f.calories || 0) * ratio),
            protein: Math.round(Number(f.protein || 0) * ratio * 10) / 10,
            carbs: Math.round(Number(f.carbs || 0) * ratio * 10) / 10,
            fat: Math.round(Number(f.fat || 0) * ratio * 10) / 10,
            fiber: Math.round(Number(f.fiber || 0) * ratio * 10) / 10,
          };
        }),
      })),
    };
  }

  return scaledPlan;
};
