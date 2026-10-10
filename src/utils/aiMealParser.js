// Intelligent AI Meal & Macro Parser
// Analyzes free-form text of meals eaten from morning to night and calculates calories, protein, fat, carbs, and fiber

import { searchFoods, foodDatabase } from '../data/foodDatabase';

const FOOD_DICTIONARY = [
  // Grains & Carbs
  { names: ['roti', 'rotis', 'chapati', 'chapatis', 'phulka', 'fulka'], cal: 100, pro: 3.2, carb: 20, fat: 1, fib: 3, unit: 'piece', defaultQty: 2 },
  { names: ['paratha', 'parathas', 'aloo paratha'], cal: 260, pro: 5, carb: 35, fat: 11, fib: 3, unit: 'piece', defaultQty: 1 },
  { names: ['rice', 'white rice', 'chawal'], cal: 130, pro: 2.7, carb: 28, fat: 0.3, fib: 0.4, unit: 'cup', defaultQty: 1 },
  { names: ['brown rice'], cal: 111, pro: 2.6, carb: 23, fat: 0.9, fib: 1.8, unit: 'cup', defaultQty: 1 },
  { names: ['biryani', 'chicken biryani'], cal: 350, pro: 18, carb: 45, fat: 10, fib: 2, unit: 'plate', defaultQty: 1 },
  { names: ['oats', 'oatmeal'], cal: 150, pro: 5.5, carb: 27, fat: 2.5, fib: 4, unit: 'bowl', defaultQty: 1 },
  { names: ['bread', 'brown bread', 'white bread', 'slice bread'], cal: 80, pro: 3.5, carb: 14, fat: 1, fib: 1.5, unit: 'slice', defaultQty: 2 },
  { names: ['poha'], cal: 220, pro: 4.5, carb: 46, fat: 2.5, fib: 2, unit: 'plate', defaultQty: 1 },
  { names: ['upma'], cal: 200, pro: 5, carb: 35, fat: 4.5, fib: 3, unit: 'bowl', defaultQty: 1 },
  { names: ['idli', 'idlis'], cal: 60, pro: 2, carb: 12, fat: 0.2, fib: 1, unit: 'piece', defaultQty: 2 },
  { names: ['dosa'], cal: 140, pro: 3.5, carb: 22, fat: 4.5, fib: 1.2, unit: 'piece', defaultQty: 1 },

  // Proteins
  { names: ['egg', 'eggs', 'boiled egg', 'boiled eggs'], cal: 78, pro: 6.3, carb: 0.6, fat: 5.3, fib: 0, unit: 'piece', defaultQty: 2 },
  { names: ['egg white', 'egg whites'], cal: 17, pro: 3.6, carb: 0.2, fat: 0.1, fib: 0, unit: 'piece', defaultQty: 3 },
  { names: ['omelette', 'omlet', 'omelet'], cal: 154, pro: 12, carb: 1.2, fat: 11, fib: 0, unit: 'piece', defaultQty: 1 },
  { names: ['chicken', 'chicken breast', 'boiled chicken', 'grilled chicken'], cal: 165, pro: 31, carb: 0, fat: 3.6, fib: 0, unit: '100g', defaultQty: 1.5 },
  { names: ['chicken curry'], cal: 240, pro: 25, carb: 6, fat: 12, fib: 1, unit: 'bowl', defaultQty: 1 },
  { names: ['paneer', 'cottage cheese'], cal: 265, pro: 18, carb: 3, fat: 20, fib: 0, unit: '100g', defaultQty: 1 },
  { names: ['paneer sabzi', 'paneer butter masala', 'kadai paneer'], cal: 320, pro: 14, carb: 10, fat: 24, fib: 2, unit: 'bowl', defaultQty: 1 },
  { names: ['soya', 'soya chunks', 'soy chunks'], cal: 170, pro: 26, carb: 16, fat: 0.5, fib: 6.5, unit: '50g', defaultQty: 1 },
  { names: ['fish', 'fried fish', 'grilled fish'], cal: 140, pro: 22, carb: 0, fat: 5, fib: 0, unit: 'piece', defaultQty: 1 },
  { names: ['tofu'], cal: 120, pro: 13, carb: 2, fat: 7, fib: 1.5, unit: '100g', defaultQty: 1 },

  // Legumes & Dal
  { names: ['dal', 'daal', 'yellow dal', 'moong dal', 'toor dal', 'tadka dal'], cal: 140, pro: 8, carb: 22, fat: 2.5, fib: 6, unit: 'bowl', defaultQty: 1 },
  { names: ['rajma', 'kidney beans'], cal: 180, pro: 10, carb: 28, fat: 3, fib: 7, unit: 'bowl', defaultQty: 1 },
  { names: ['chole', 'chickpeas', 'chana'], cal: 210, pro: 11, carb: 32, fat: 4.5, fib: 8, unit: 'bowl', defaultQty: 1 },
  { names: ['sprouts', 'moong sprouts'], cal: 60, pro: 5, carb: 10, fat: 0.5, fib: 3, unit: 'cup', defaultQty: 1 },

  // Dairy & Shakes
  { names: ['milk', 'glass milk', 'cup milk', 'doodh'], cal: 150, pro: 8, carb: 12, fat: 8, fib: 0, unit: 'glass', defaultQty: 1 },
  { names: ['curd', 'dahi', 'yogurt'], cal: 100, pro: 4, carb: 5, fat: 4, fib: 0, unit: 'bowl', defaultQty: 1 },
  { names: ['whey', 'whey protein', 'protein shake', 'scoop whey'], cal: 120, pro: 24, carb: 3, fat: 1.5, fib: 0, unit: 'scoop', defaultQty: 1 },
  { names: ['buttermilk', 'chaas'], cal: 50, pro: 3, carb: 5, fat: 1, fib: 0, unit: 'glass', defaultQty: 1 },
  { names: ['lassi'], cal: 200, pro: 6, carb: 28, fat: 7, fib: 0, unit: 'glass', defaultQty: 1 },
  { names: ['tea', 'chai', 'milk tea'], cal: 60, pro: 2, carb: 9, fat: 2, fib: 0, unit: 'cup', defaultQty: 1 },
  { names: ['coffee', 'black coffee'], cal: 5, pro: 0.3, carb: 0.5, fat: 0, fib: 0, unit: 'cup', defaultQty: 1 },

  // Fruits & Healthy Snacks
  { names: ['banana', 'bananas', 'kela'], cal: 90, pro: 1.1, carb: 23, fat: 0.3, fib: 2.6, unit: 'piece', defaultQty: 1 },
  { names: ['apple', 'apples', 'seb'], cal: 80, pro: 0.4, carb: 21, fat: 0.3, fib: 4, unit: 'piece', defaultQty: 1 },
  { names: ['mango'], cal: 120, pro: 1.5, carb: 30, fat: 0.6, fib: 3, unit: 'piece', defaultQty: 1 },
  { names: ['orange', 'santara'], cal: 60, pro: 1.2, carb: 15, fat: 0.2, fib: 3, unit: 'piece', defaultQty: 1 },
  { names: ['almonds', 'badam'], cal: 160, pro: 6, carb: 6, fat: 14, fib: 3.5, unit: 'handful', defaultQty: 1 },
  { names: ['peanut butter'], cal: 190, pro: 8, carb: 7, fat: 16, fib: 2, unit: 'tbsp', defaultQty: 1 },
  { names: ['peanuts', 'groundnuts'], cal: 170, pro: 7, carb: 5, fat: 14, fib: 2.5, unit: 'handful', defaultQty: 1 },
  { names: ['salad', 'green salad', 'cucumber', 'kheera'], cal: 35, pro: 1.5, carb: 7, fat: 0.3, fib: 2.5, unit: 'bowl', defaultQty: 1 },
  { names: ['sabzi', 'mixed sabzi', 'vegetable'], cal: 120, pro: 3, carb: 15, fat: 6, fib: 4, unit: 'bowl', defaultQty: 1 }
];

/**
 * Extracts a numeric quantity from a text fragment
 */
function extractQuantity(text, fallbackQty = 1) {
  // Look for numbers like "2", "3.5", "150g", "250ml", "1/2"
  const fractionMatch = text.match(/(\d+)\/(\d+)/);
  if (fractionMatch) {
    return Number(fractionMatch[1]) / Number(fractionMatch[2]);
  }

  const numMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (numMatch) {
    const val = parseFloat(numMatch[1]);
    // If it's in grams e.g. 150g or 200g
    if (text.toLowerCase().includes('g') && val > 10) {
      return val / 100; // normalized to 100g multiplier
    }
    return val;
  }

  // Word quantities
  const lower = text.toLowerCase();
  if (lower.includes('half') || lower.includes('adha')) return 0.5;
  if (lower.includes('one') || lower.includes('ek')) return 1;
  if (lower.includes('two') || lower.includes('do')) return 2;
  if (lower.includes('three') || lower.includes('teen')) return 3;
  if (lower.includes('four') || lower.includes('char')) return 4;

  return fallbackQty;
}

/**
 * Parses meal sections from a full-day sentence
 */
export function parseFullDayMeals(inputText) {
  if (!inputText || !inputText.trim()) {
    return { meals: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 } };
  }

  const text = inputText.toLowerCase().replace(/,/g, ' and ');

  // Meal markers definitions
  const mealSections = [
    { type: 'breakfast', label: 'Morning Breakfast', time: '08:30', regex: /(?:morning|breakfast|subah|nashta|brkfast|am)\s*[:\-]?\s*(.*?)(?=(?:afternoon|lunch|dopahar|evening|snack|snacks|night|dinner|raat|pm|$))/i },
    { type: 'lunch', label: 'Afternoon Lunch', time: '13:00', regex: /(?:afternoon|lunch|dopahar|midday)\s*[:\-]?\s*(.*?)(?=(?:evening|snack|snacks|preworkout|postworkout|night|dinner|raat|$))/i },
    { type: 'snack', label: 'Evening Snack', time: '17:30', regex: /(?:evening|snack|snacks|sham|shaam|pre\s*workout|post\s*workout|chai)\s*[:\-]?\s*(.*?)(?=(?:night|dinner|raat|$))/i },
    { type: 'dinner', label: 'Night Dinner', time: '20:30', regex: /(?:night|dinner|raat|supper|evening dinner)\s*[:\-]?\s*(.*?)$/i },
  ];

  const parsedMeals = [];
  let foundAnySection = false;

  mealSections.forEach((section) => {
    const match = text.match(section.regex);
    if (match && match[1] && match[1].trim()) {
      foundAnySection = true;
      const sectionText = match[1].trim();
      const items = parseMealItems(sectionText);
      if (items.length > 0) {
        parsedMeals.push({
          type: section.type,
          name: section.label,
          time: section.time,
          completed: true, // Marked taken by default as user already ate them!
          foods: items,
        });
      }
    }
  });

  // Fallback: If user didn't use keywords like "morning" or "lunch" but listed items separated by "and" or commas
  if (!foundAnySection || parsedMeals.length === 0) {
    const items = parseMealItems(text);
    if (items.length > 0) {
      parsedMeals.push({
        type: 'snack',
        name: 'Logged Foods',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        foods: items,
      });
    }
  }

  // Compute Grand Totals
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  parsedMeals.forEach((meal) => {
    meal.foods.forEach((f) => {
      totals.calories += Number(f.calories || 0);
      totals.protein += Number(f.protein || 0);
      totals.carbs += Number(f.carbs || 0);
      totals.fat += Number(f.fat || 0);
      totals.fiber += Number(f.fiber || 0);
    });
  });

  totals.calories = Math.round(totals.calories);
  totals.protein = Math.round(totals.protein * 10) / 10;
  totals.carbs = Math.round(totals.carbs * 10) / 10;
  totals.fat = Math.round(totals.fat * 10) / 10;
  totals.fiber = Math.round(totals.fiber * 10) / 10;

  return { meals: parsedMeals, totals };
}

/**
 * Extracts individual food items from a meal sentence
 */
function parseMealItems(chunkText) {
  // Split by 'and', '+', '&', commas, newline
  const fragments = chunkText.split(/\band\b|\+|,|\n|&/i).map(s => s.trim()).filter(Boolean);
  const items = [];

  fragments.forEach((fragment) => {
    const cleanFragment = fragment.toLowerCase();
    let bestMatch = null;

    // Search our expanded food dictionary
    for (const food of FOOD_DICTIONARY) {
      for (const alias of food.names) {
        if (cleanFragment.includes(alias)) {
          // If already matched a shorter alias, prefer the longer more specific one
          if (!bestMatch || alias.length > bestMatch.alias.length) {
            bestMatch = { food, alias };
          }
        }
      }
    }

    if (bestMatch) {
      const { food } = bestMatch;
      const qty = extractQuantity(cleanFragment, food.defaultQty);
      const isHundredGram = food.unit === '100g' || food.unit === '50g';
      
      const multiplier = isHundredGram ? qty : (qty / (food.defaultQty || 1));
      const cals = Math.round(food.cal * multiplier);
      const pro = Math.round((food.pro * multiplier) * 10) / 10;
      const carb = Math.round((food.carb * multiplier) * 10) / 10;
      const fat = Math.round((food.fat * multiplier) * 10) / 10;
      const fib = Math.round((food.fib * multiplier) * 10) / 10;

      // Clean display name
      const displayName = food.names[0].charAt(0).toUpperCase() + food.names[0].slice(1);
      const displayQty = isHundredGram ? `${Math.round(qty * 100)}g` : `${qty} ${food.unit}`;

      items.push({
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        name: `${displayName} (${displayQty})`,
        rawName: displayName,
        qty: qty,
        unit: food.unit,
        calories: cals,
        protein: pro,
        carbs: carb,
        fat: fat,
        fiber: fib,
      });
    } else if (cleanFragment.length > 2) {
      // Fallback search in foodDatabase
      const dbSearch = searchFoods(cleanFragment);
      if (dbSearch && dbSearch.length > 0) {
        const item = dbSearch[0];
        const qty = extractQuantity(cleanFragment, 1);
        const ratio = (qty * (item.defaultQty || 100)) / 100;

        items.push({
          id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
          name: `${item.name} (${qty} ${item.defaultUnit || 'serving'})`,
          rawName: item.name,
          qty: qty,
          unit: item.defaultUnit || 'serving',
          calories: Math.round(item.caloriesPer100g * ratio),
          protein: Math.round(item.proteinPer100g * ratio * 10) / 10,
          carbs: Math.round(item.carbsPer100g * ratio * 10) / 10,
          fat: Math.round(item.fatPer100g * ratio * 10) / 10,
          fiber: Math.round((item.fiberPer100g || 0) * ratio * 10) / 10,
        });
      }
    }
  });

  return items;
}
