export const mealTemplates = {
  muscleGain: {
    name: 'Muscle Gain (3000 cal)',
    meals: [
      { id: 'm1', name: 'Breakfast', type: 'breakfast', foods: [{ name: 'Oats', qty: 100, unit: 'g', calories: 389, protein: 17, carbs: 66, fat: 7 }, { name: 'Whey Protein', qty: 30, unit: 'g', calories: 120, protein: 24, carbs: 3, fat: 1 }, { name: 'Peanut Butter', qty: 32, unit: 'g', calories: 188, protein: 8, carbs: 6, fat: 16 }], completed: false, time: '08:00' },
      { id: 'm2', name: 'Morning Snack', type: 'snack', foods: [{ name: 'Banana', qty: 1, unit: 'piece', calories: 105, protein: 1, carbs: 27, fat: 0 }, { name: 'Almonds', qty: 30, unit: 'g', calories: 170, protein: 6, carbs: 6, fat: 15 }], completed: false, time: '11:00' },
      { id: 'm3', name: 'Lunch', type: 'lunch', foods: [{ name: 'Chicken Breast', qty: 200, unit: 'g', calories: 330, protein: 62, carbs: 0, fat: 7 }, { name: 'White Rice', qty: 150, unit: 'g', calories: 195, protein: 4, carbs: 42, fat: 0 }, { name: 'Broccoli', qty: 100, unit: 'g', calories: 34, protein: 3, carbs: 7, fat: 0 }], completed: false, time: '14:00' },
      { id: 'm4', name: 'Pre Workout', type: 'preworkout', foods: [{ name: 'Brown Bread', qty: 2, unit: 'piece', calories: 150, protein: 6, carbs: 26, fat: 2 }, { name: 'Peanut Butter', qty: 16, unit: 'g', calories: 94, protein: 4, carbs: 3, fat: 8 }], completed: false, time: '17:00' },
      { id: 'm5', name: 'Dinner', type: 'dinner', foods: [{ name: 'Salmon', qty: 150, unit: 'g', calories: 312, protein: 30, carbs: 0, fat: 20 }, { name: 'Sweet Potato', qty: 200, unit: 'g', calories: 172, protein: 3, carbs: 40, fat: 0 }], completed: false, time: '20:30' }
    ]
  },
  fatLoss: {
    name: 'Fat Loss (1800 cal)',
    meals: [
      { id: 'f1', name: 'Breakfast', type: 'breakfast', foods: [{ name: 'Egg Whites', qty: 200, unit: 'g', calories: 108, protein: 22, carbs: 1, fat: 0 }, { name: 'Spinach', qty: 50, unit: 'g', calories: 12, protein: 1, carbs: 2, fat: 0 }, { name: 'Whole Egg', qty: 1, unit: 'piece', calories: 72, protein: 6, carbs: 0, fat: 5 }], completed: false, time: '08:00' },
      { id: 'f2', name: 'Lunch', type: 'lunch', foods: [{ name: 'Chicken Breast', qty: 150, unit: 'g', calories: 248, protein: 46, carbs: 0, fat: 5 }, { name: 'Mixed Vegetables', qty: 150, unit: 'g', calories: 50, protein: 3, carbs: 10, fat: 0 }, { name: 'Olive Oil', qty: 10, unit: 'g', calories: 88, protein: 0, carbs: 0, fat: 10 }], completed: false, time: '13:00' },
      { id: 'f3', name: 'Snack', type: 'snack', foods: [{ name: 'Greek Yogurt', qty: 150, unit: 'g', calories: 88, protein: 15, carbs: 6, fat: 0 }, { name: 'Almonds', qty: 15, unit: 'g', calories: 85, protein: 3, carbs: 3, fat: 7 }], completed: false, time: '16:00' },
      { id: 'f4', name: 'Dinner', type: 'dinner', foods: [{ name: 'White Fish', qty: 200, unit: 'g', calories: 180, protein: 38, carbs: 0, fat: 2 }, { name: 'Asparagus', qty: 100, unit: 'g', calories: 20, protein: 2, carbs: 4, fat: 0 }], completed: false, time: '19:30' }
    ]
  },
  maintenance: {
    name: 'Maintenance (2400 cal)',
    meals: [
      { id: 'n1', name: 'Breakfast', type: 'breakfast', foods: [{ name: 'Oats', qty: 60, unit: 'g', calories: 233, protein: 10, carbs: 40, fat: 4 }, { name: 'Milk', qty: 200, unit: 'ml', calories: 120, protein: 6, carbs: 10, fat: 6 }], completed: false, time: '08:00' },
      { id: 'n2', name: 'Lunch', type: 'lunch', foods: [{ name: 'Chicken Breast', qty: 150, unit: 'g', calories: 248, protein: 46, carbs: 0, fat: 5 }, { name: 'Rice', qty: 100, unit: 'g', calories: 130, protein: 3, carbs: 28, fat: 0 }, { name: 'Broccoli', qty: 100, unit: 'g', calories: 34, protein: 3, carbs: 7, fat: 0 }], completed: false, time: '13:30' },
      { id: 'n3', name: 'Snack', type: 'snack', foods: [{ name: 'Apple', qty: 1, unit: 'piece', calories: 95, protein: 0, carbs: 25, fat: 0 }, { name: 'Peanut Butter', qty: 16, unit: 'g', calories: 94, protein: 4, carbs: 3, fat: 8 }], completed: false, time: '16:30' },
      { id: 'n4', name: 'Dinner', type: 'dinner', foods: [{ name: 'Paneer', qty: 100, unit: 'g', calories: 296, protein: 18, carbs: 3, fat: 22 }, { name: 'Chapati', qty: 2, unit: 'piece', calories: 140, protein: 6, carbs: 30, fat: 1 }, { name: 'Salad', qty: 100, unit: 'g', calories: 20, protein: 1, carbs: 4, fat: 0 }], completed: false, time: '20:00' }
    ]
  },
  vegetarian: {
    name: 'Vegetarian (2200 cal)',
    meals: [
      { id: 'v1', name: 'Breakfast', type: 'breakfast', foods: [{ name: 'Poha', qty: 150, unit: 'g', calories: 270, protein: 4, carbs: 54, fat: 4 }, { name: 'Milk', qty: 250, unit: 'ml', calories: 150, protein: 8, carbs: 12, fat: 8 }], completed: false, time: '08:30' },
      { id: 'v2', name: 'Lunch', type: 'lunch', foods: [{ name: 'Dal', qty: 200, unit: 'g', calories: 232, protein: 14, carbs: 40, fat: 2 }, { name: 'Rice', qty: 150, unit: 'g', calories: 195, protein: 4, carbs: 42, fat: 0 }, { name: 'Mixed Veg', qty: 100, unit: 'g', calories: 45, protein: 2, carbs: 8, fat: 1 }], completed: false, time: '13:30' },
      { id: 'v3', name: 'Snack', type: 'snack', foods: [{ name: 'Roasted Chickpeas', qty: 50, unit: 'g', calories: 180, protein: 9, carbs: 30, fat: 3 }], completed: false, time: '17:00' },
      { id: 'v4', name: 'Dinner', type: 'dinner', foods: [{ name: 'Paneer', qty: 150, unit: 'g', calories: 444, protein: 27, carbs: 4, fat: 33 }, { name: 'Chapati', qty: 2, unit: 'piece', calories: 140, protein: 6, carbs: 30, fat: 1 }, { name: 'Spinach', qty: 100, unit: 'g', calories: 23, protein: 3, carbs: 4, fat: 0 }], completed: false, time: '20:30' }
    ]
  },
  keto: {
    name: 'Keto (2000 cal)',
    meals: [
      { id: 'k1', name: 'Breakfast', type: 'breakfast', foods: [{ name: 'Eggs', qty: 3, unit: 'piece', calories: 216, protein: 18, carbs: 0, fat: 15 }, { name: 'Avocado', qty: 100, unit: 'g', calories: 160, protein: 2, carbs: 9, fat: 15 }, { name: 'Butter', qty: 10, unit: 'g', calories: 72, protein: 0, carbs: 0, fat: 8 }], completed: false, time: '08:00' },
      { id: 'k2', name: 'Lunch', type: 'lunch', foods: [{ name: 'Chicken Thighs', qty: 200, unit: 'g', calories: 418, protein: 34, carbs: 0, fat: 30 }, { name: 'Broccoli', qty: 100, unit: 'g', calories: 34, protein: 3, carbs: 7, fat: 0 }, { name: 'Olive Oil', qty: 15, unit: 'g', calories: 119, protein: 0, carbs: 0, fat: 14 }], completed: false, time: '13:00' },
      { id: 'k3', name: 'Snack', type: 'snack', foods: [{ name: 'Macadamia Nuts', qty: 30, unit: 'g', calories: 215, protein: 2, carbs: 4, fat: 22 }], completed: false, time: '16:30' },
      { id: 'k4', name: 'Dinner', type: 'dinner', foods: [{ name: 'Salmon', qty: 200, unit: 'g', calories: 416, protein: 40, carbs: 0, fat: 26 }, { name: 'Asparagus', qty: 100, unit: 'g', calories: 20, protein: 2, carbs: 4, fat: 0 }], completed: false, time: '19:30' }
    ]
  }
};
