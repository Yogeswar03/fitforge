export const calculateTDEE = (weight, height, age, gender, activityLevel) => {
  let bmr;
  const w = Number(weight) || 70;
  const h = Number(height) || 170;
  const a = Number(age) || 25;
  const g = (gender || 'male').toLowerCase();

  if (g === 'female') {
    bmr = 10 * w + 6.25 * h - 5 * a - 161;
  } else {
    bmr = 10 * w + 6.25 * h - 5 * a + 5;
  }

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    active: 1.55,
    very_active: 1.725,
  };

  return bmr * (multipliers[activityLevel] || 1.2);
};

export const calculateMacros = (tdee, weight, goal) => {
  let calories = tdee;
  let proteinPerKg = 1.8;
  const w = Number(weight) || 70;

  if (goal === 'lose') {
    calories -= 500;
    proteinPerKg = 2.0;
  } else if (goal === 'gain') {
    calories += 300;
    proteinPerKg = 2.2;
  } else if (goal === 'fit') {
    calories -= 200;
    proteinPerKg = 2.0;
  }

  const protein = Math.round(w * proteinPerKg);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  return {
    calories: Math.round(calories),
    protein,
    carbs,
    fat,
  };
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
