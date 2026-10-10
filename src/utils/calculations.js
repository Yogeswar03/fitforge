/**
 * Calculate Basal Metabolic Rate (BMR)
 * Uses Mifflin-St Jeor equation (clinically validated gold standard)
 * Or Katch-McArdle if body fat percentage is supplied.
 */
export const calculateBMR = (weight, height, age, gender = 'male', bodyFat = null) => {
  const w = Number(weight) || 70;
  const h = Number(height) || 170;
  const a = Number(age) || 25;
  const g = (gender || 'male').toLowerCase();

  // If user knows their body fat %, Katch-McArdle provides the most accurate BMR
  if (bodyFat && Number(bodyFat) > 3 && Number(bodyFat) < 60) {
    const lbm = w * (1 - Number(bodyFat) / 100);
    return Math.round(370 + 21.6 * lbm);
  }

  // Mifflin-St Jeor Formula
  if (g === 'female') {
    return Math.round(10 * w + 6.25 * h - 5 * a - 161);
  } else if (g === 'other') {
    return Math.round(10 * w + 6.25 * h - 5 * a - 78);
  }
  return Math.round(10 * w + 6.25 * h - 5 * a + 5);
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * BMR multiplied by validated Physical Activity Level (PAL)
 */
export const calculateTDEE = (weight, height, age, gender = 'male', activityLevel = 'sedentary', bodyFat = null) => {
  const bmr = calculateBMR(weight, height, age, gender, bodyFat);

  const multipliers = {
    sedentary: 1.2,      // Desk job, minimal walking
    light: 1.375,        // Light exercise 1-3 days/week
    active: 1.55,        // Moderate gym / training 3-5 days/week
    very_active: 1.725,   // Heavy training 6-7 days/week
    extreme: 1.9,        // Athlete / intense 2x daily training
  };

  const pal = multipliers[activityLevel] || 1.2;
  return Math.round(bmr * pal);
};

/**
 * Calculate Evidence-Based Macronutrient Targets (ISSN / ACSM Guidelines)
 * Tailored for gym athletes with goal-specific partitioning and macro ratios.
 */
export const calculateMacros = (tdee, weight, goal = 'maintain', dietPreference = 'any', activityLevel = 'active', gender = 'male') => {
  const tdeeVal = Number(tdee) || 2000;
  const w = Number(weight) || 70;
  const isFemale = (gender || '').toLowerCase() === 'female';

  let calories = tdeeVal;
  let proteinPerKg = 1.8; // Default optimal protein for active individuals

  // Goal-specific caloric adjustments & protein requirements
  if (goal === 'lose') {
    // 20% deficit (capped so it doesn't drop below safety thresholds: 1200 kcal for women, 1500 kcal for men)
    const minCalories = isFemale ? 1200 : 1500;
    calories = Math.max(minCalories, Math.round(tdeeVal * 0.8));
    proteinPerKg = 2.2; // Higher protein preserves lean muscle during caloric deficit
  } else if (goal === 'gain') {
    // Lean hyper-trophic surplus: +12% (approx +250 to +400 kcal) prevents excess fat storage
    calories = Math.round(tdeeVal * 1.12);
    proteinPerKg = 2.0; // Optimal muscle protein synthesis per Schoenfeld / Morton et al.
  } else if (goal === 'fit') {
    // Body recomposition: slight -8% deficit with high protein to build muscle while shedding fat
    calories = Math.round(tdeeVal * 0.92);
    proteinPerKg = 2.1;
  } else {
    // Maintenance
    calories = tdeeVal;
    proteinPerKg = 1.8;
  }

  // Vegetarian/Vegan protein buffer to account for lower plant protein bioavailability
  if (dietPreference === 'veg' || dietPreference === 'vegan') {
    proteinPerKg = Math.min(2.4, proteinPerKg + 0.1);
  }

  // Calculate Protein in grams
  const protein = Math.round(w * proteinPerKg);
  const proteinCalories = protein * 4;

  let fat = 0;
  let carbs = 0;

  if (dietPreference === 'keto') {
    // Ketogenic split: 70% fat, 25% protein, 5% net carbs
    const fatCalories = calories * 0.70;
    fat = Math.round(fatCalories / 9);
    const carbCalories = Math.max(0, calories - proteinCalories - fatCalories);
    carbs = Math.max(20, Math.round(carbCalories / 4));
  } else {
    // Standard athletic split:
    // Dietary Fat: 27% of total calories (essential for testosterone/hormone production & joint health)
    // Minimum fat floor: 45g (women), 55g (men)
    const minFat = isFemale ? 45 : 55;
    const standardFat = Math.round((calories * 0.27) / 9);
    fat = Math.max(minFat, standardFat);

    // Carbohydrates: Remaining caloric budget provides glycogen fuel for weight training
    const remainingCalories = calories - (protein * 4) - (fat * 9);
    carbs = Math.max(40, Math.round(remainingCalories / 4));
  }

  // Dietary Fiber: 14g per 1000 kcal (USDA Dietary Guidelines standard)
  const fiber = Math.max(25, Math.min(45, Math.round((calories / 1000) * 14)));

  // Water Hydration Requirement: 35ml per kg of bodyweight + 500ml for gym sweat loss
  const waterMl = Math.round(w * 35 + 500);
  const waterGlasses = Math.max(8, Math.round(waterMl / 250)); // 250ml per glass

  // Step recommendations based on activity level
  const stepMap = {
    sedentary: 8000,
    light: 9000,
    active: 10000,
    very_active: 12500,
    extreme: 15000,
  };
  const steps = stepMap[activityLevel] || 10000;

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    waterGlasses,
    waterMl,
    steps,
  };
};

/**
 * Clinical Body Mass Index (BMI) & World Health Organization classification
 */
export const calculateBMI = (weight, height) => {
  const w = Number(weight);
  const h = Number(height);
  if (!w || !h || h <= 0) return { bmi: 0, category: 'Unknown', color: '#9CA3AF', isHealthy: false };

  const heightInMeters = h / 100;
  const bmiValue = Number((w / (heightInMeters * heightInMeters)).toFixed(1));

  let category = 'Normal';
  let color = '#00E676';
  let isHealthy = true;

  if (bmiValue < 18.5) {
    category = 'Underweight';
    color = '#00B0FF';
    isHealthy = false;
  } else if (bmiValue < 25) {
    category = 'Normal Weight ✨';
    color = '#00E676';
    isHealthy = true;
  } else if (bmiValue < 30) {
    category = 'Overweight';
    color = '#FFD740';
    isHealthy = false;
  } else {
    category = 'Obese';
    color = '#FF5252';
    isHealthy = false;
  }

  // Ideal weight range for this height (BMI 18.5 - 24.9)
  const minHealthyWeight = Math.round(18.5 * heightInMeters * heightInMeters);
  const maxHealthyWeight = Math.round(24.9 * heightInMeters * heightInMeters);

  return {
    bmi: bmiValue,
    category,
    color,
    isHealthy,
    idealWeightRange: `${minHealthyWeight} - ${maxHealthyWeight} kg`,
  };
};

/**
 * 1-Repetition Maximum (1RM) Estimator
 * Uses Brzycki and Epley equations for strength training accuracy.
 */
export const calculateOneRepMax = (weight, reps) => {
  const w = Number(weight) || 0;
  const r = Number(reps) || 1;
  if (w <= 0 || r <= 0) return 0;
  if (r === 1) return w;

  // Brzycki formula for <= 10 reps
  if (r <= 10) {
    return Math.round(w / (1.0278 - 0.0278 * r));
  }
  // Epley formula for > 10 reps
  return Math.round(w * (1 + r / 30));
};

/**
 * Exercise Calorie Burn Calculator via MET (Metabolic Equivalent of Task)
 */
export const calculateCaloriesBurned = (metValue, weightKg, durationMinutes) => {
  const met = Number(metValue) || 5;
  const w = Number(weightKg) || 70;
  const duration = Number(durationMinutes) || 30;
  // Formula: (MET * 3.5 * weightKg / 200) * minutes
  return Math.round((met * 3.5 * w / 200) * duration);
};

export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getProgressPercentage = (current, target) => {
  if (!target || target <= 0) return 0;
  return Math.min(Math.max((current / target) * 100, 0), 100);
};

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

export const formatNumber = (n) => new Intl.NumberFormat().format(n || 0);

export const DAYS_OF_WEEK = [
  { id: 1, name: 'Monday', short: 'Mon' },
  { id: 2, name: 'Tuesday', short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday', short: 'Thu' },
  { id: 5, name: 'Friday', short: 'Fri' },
  { id: 6, name: 'Saturday', short: 'Sat' },
  { id: 0, name: 'Sunday', short: 'Sun' },
];

export const getDayName = (dayIndex) => {
  const map = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
  return map[dayIndex] ?? 'Monday';
};

export const getDayShort = (dayIndex) => {
  const map = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
  return map[dayIndex] ?? 'Mon';
};
