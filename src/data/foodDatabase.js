const foodData = [
  { id: 'f1', name: 'Oats', category: 'grain', caloriesPer100g: 389, proteinPer100g: 16.9, carbsPer100g: 66.3, fatPer100g: 6.9, fiberPer100g: 10.6, defaultQty: 50, defaultUnit: 'g', servingSize: '1/2 cup' },
  { id: 'f2', name: 'White Rice', category: 'grain', caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3, fiberPer100g: 0.4, defaultQty: 100, defaultUnit: 'g', servingSize: '1 cup cooked' },
  { id: 'f3', name: 'Brown Rice', category: 'grain', caloriesPer100g: 111, proteinPer100g: 2.6, carbsPer100g: 23, fatPer100g: 0.9, fiberPer100g: 1.8, defaultQty: 100, defaultUnit: 'g', servingSize: '1 cup cooked' },
  { id: 'f4', name: 'Roti / Chapati', category: 'grain', caloriesPer100g: 297, proteinPer100g: 9, carbsPer100g: 46, fatPer100g: 7, fiberPer100g: 9, defaultQty: 1, defaultUnit: 'piece', servingSize: '1 piece' },
  { id: 'f5', name: 'Brown Bread', category: 'grain', caloriesPer100g: 250, proteinPer100g: 10, carbsPer100g: 42, fatPer100g: 3, fiberPer100g: 7, defaultQty: 2, defaultUnit: 'piece', servingSize: '2 slices' },
  { id: 'f6', name: 'Pasta', category: 'grain', caloriesPer100g: 131, proteinPer100g: 5, carbsPer100g: 25, fatPer100g: 1, fiberPer100g: 1.2, defaultQty: 100, defaultUnit: 'g', servingSize: '1 cup cooked' },
  { id: 'f7', name: 'Quinoa', category: 'grain', caloriesPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21, fatPer100g: 1.9, fiberPer100g: 2.8, defaultQty: 100, defaultUnit: 'g', servingSize: '1 cup cooked' },
  { id: 'f8', name: 'Poha', category: 'grain', caloriesPer100g: 350, proteinPer100g: 7, carbsPer100g: 77, fatPer100g: 1, fiberPer100g: 3, defaultQty: 100, defaultUnit: 'g', servingSize: '1 bowl' },
  { id: 'f9', name: 'Upma', category: 'grain', caloriesPer100g: 250, proteinPer100g: 8, carbsPer100g: 42, fatPer100g: 5, fiberPer100g: 4, defaultQty: 150, defaultUnit: 'g', servingSize: '1 bowl' },
  { id: 'f10', name: 'Idli', category: 'grain', caloriesPer100g: 58, proteinPer100g: 1.6, carbsPer100g: 12.2, fatPer100g: 0.1, fiberPer100g: 1, defaultQty: 2, defaultUnit: 'piece', servingSize: '2 pieces' },
  { id: 'f11', name: 'Dosa', category: 'grain', caloriesPer100g: 133, proteinPer100g: 3, carbsPer100g: 20, fatPer100g: 4.5, fiberPer100g: 1, defaultQty: 1, defaultUnit: 'piece', servingSize: '1 dosa' },
  { id: 'f12', name: 'Corn Flakes', category: 'grain', caloriesPer100g: 357, proteinPer100g: 8, carbsPer100g: 84, fatPer100g: 0.4, fiberPer100g: 3, defaultQty: 30, defaultUnit: 'g', servingSize: '1 bowl' },
  { id: 'f13', name: 'Paratha', category: 'grain', caloriesPer100g: 300, proteinPer100g: 7, carbsPer100g: 45, fatPer100g: 10, fiberPer100g: 4, defaultQty: 1, defaultUnit: 'piece', servingSize: '1 paratha' },
  { id: 'f14', name: 'Biryani Rice', category: 'grain', caloriesPer100g: 150, proteinPer100g: 4, carbsPer100g: 25, fatPer100g: 4, fiberPer100g: 1, defaultQty: 200, defaultUnit: 'g', servingSize: '1 plate' },
  { id: 'f15', name: 'Naan', category: 'grain', caloriesPer100g: 310, proteinPer100g: 9, carbsPer100g: 50, fatPer100g: 8, fiberPer100g: 2, defaultQty: 1, defaultUnit: 'piece', servingSize: '1 naan' },
  
  { id: 'p1', name: 'Chicken Breast', category: 'protein', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, fiberPer100g: 0, defaultQty: 150, defaultUnit: 'g', servingSize: '1 piece' },
  { id: 'p2', name: 'Eggs (Whole)', category: 'protein', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11, fiberPer100g: 0, defaultQty: 2, defaultUnit: 'piece', servingSize: '2 eggs' },
  { id: 'p3', name: 'Egg Whites', category: 'protein', caloriesPer100g: 52, proteinPer100g: 11, carbsPer100g: 0.7, fatPer100g: 0.2, fiberPer100g: 0, defaultQty: 4, defaultUnit: 'piece', servingSize: '4 whites' },
  { id: 'p4', name: 'Paneer', category: 'protein', caloriesPer100g: 296, proteinPer100g: 18, carbsPer100g: 3.4, fatPer100g: 22, fiberPer100g: 0, defaultQty: 100, defaultUnit: 'g', servingSize: '100g' },
  { id: 'p5', name: 'Tofu', category: 'protein', caloriesPer100g: 144, proteinPer100g: 15.8, carbsPer100g: 2.8, fatPer100g: 8.7, fiberPer100g: 2.3, defaultQty: 100, defaultUnit: 'g', servingSize: '100g' },
  { id: 'p6', name: 'Salmon', category: 'protein', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, fiberPer100g: 0, defaultQty: 150, defaultUnit: 'g', servingSize: '1 fillet' },
  { id: 'p7', name: 'Tuna', category: 'protein', caloriesPer100g: 132, proteinPer100g: 28, carbsPer100g: 0, fatPer100g: 1.3, fiberPer100g: 0, defaultQty: 100, defaultUnit: 'g', servingSize: '1 can' },
  { id: 'p8', name: 'Fish (White)', category: 'protein', caloriesPer100g: 105, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 2, fiberPer100g: 0, defaultQty: 150, defaultUnit: 'g', servingSize: '1 fillet' },
  { id: 'p9', name: 'Mutton', category: 'protein', caloriesPer100g: 294, proteinPer100g: 25, carbsPer100g: 0, fatPer100g: 21, fiberPer100g: 0, defaultQty: 150, defaultUnit: 'g', servingSize: '150g' },
  { id: 'p10', name: 'Soya Chunks', category: 'protein', caloriesPer100g: 345, proteinPer100g: 52, carbsPer100g: 33, fatPer100g: 0.5, fiberPer100g: 13, defaultQty: 50, defaultUnit: 'g', servingSize: '50g' },
  
  { id: 'l1', name: 'Dal / Lentils', category: 'legume', caloriesPer100g: 116, proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 0.4, fiberPer100g: 8, defaultQty: 150, defaultUnit: 'g', servingSize: '1 bowl cooked' },
  { id: 'l2', name: 'Chickpeas / Chole', category: 'legume', caloriesPer100g: 164, proteinPer100g: 8.9, carbsPer100g: 27.4, fatPer100g: 2.6, fiberPer100g: 7.6, defaultQty: 100, defaultUnit: 'g', servingSize: '1 bowl cooked' },
  { id: 'l3', name: 'Rajma / Kidney Beans', category: 'legume', caloriesPer100g: 127, proteinPer100g: 8.7, carbsPer100g: 22.8, fatPer100g: 0.5, fiberPer100g: 6.4, defaultQty: 100, defaultUnit: 'g', servingSize: '1 bowl cooked' },
  { id: 'l4', name: 'Moong Dal', category: 'legume', caloriesPer100g: 347, proteinPer100g: 24, carbsPer100g: 63, fatPer100g: 1.2, fiberPer100g: 16, defaultQty: 50, defaultUnit: 'g', servingSize: '50g raw' },
  { id: 'l5', name: 'Masoor Dal', category: 'legume', caloriesPer100g: 352, proteinPer100g: 25, carbsPer100g: 60, fatPer100g: 1, fiberPer100g: 11, defaultQty: 50, defaultUnit: 'g', servingSize: '50g raw' },
  { id: 'l6', name: 'Toor Dal', category: 'legume', caloriesPer100g: 343, proteinPer100g: 22, carbsPer100g: 63, fatPer100g: 1.5, fiberPer100g: 15, defaultQty: 50, defaultUnit: 'g', servingSize: '50g raw' },
  { id: 'l7', name: 'Sprouts', category: 'legume', caloriesPer100g: 30, proteinPer100g: 3.8, carbsPer100g: 6, fatPer100g: 0.2, fiberPer100g: 1.8, defaultQty: 100, defaultUnit: 'g', servingSize: '1 cup' },

  { id: 'd1', name: 'Milk (Whole)', category: 'dairy', caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3, fiberPer100g: 0, defaultQty: 250, defaultUnit: 'ml', servingSize: '1 glass' },
  { id: 'd2', name: 'Yogurt / Curd', category: 'dairy', caloriesPer100g: 98, proteinPer100g: 3.3, carbsPer100g: 3.4, fatPer100g: 3.3, fiberPer100g: 0, defaultQty: 150, defaultUnit: 'g', servingSize: '1 bowl' },
  { id: 'd3', name: 'Cottage Cheese', category: 'dairy', caloriesPer100g: 98, proteinPer100g: 11, carbsPer100g: 3.4, fatPer100g: 4.3, fiberPer100g: 0, defaultQty: 100, defaultUnit: 'g', servingSize: '1/2 cup' },
  { id: 'd4', name: 'Cheese', category: 'dairy', caloriesPer100g: 402, proteinPer100g: 25, carbsPer100g: 1.3, fatPer100g: 33, fiberPer100g: 0, defaultQty: 30, defaultUnit: 'g', servingSize: '1 slice' },
  { id: 'd5', name: 'Butter', category: 'dairy', caloriesPer100g: 717, proteinPer100g: 0.9, carbsPer100g: 0.1, fatPer100g: 81, fiberPer100g: 0, defaultQty: 10, defaultUnit: 'g', servingSize: '1 tbsp' },
  { id: 'd6', name: 'Buttermilk', category: 'dairy', caloriesPer100g: 40, proteinPer100g: 3.3, carbsPer100g: 4.8, fatPer100g: 0.9, fiberPer100g: 0, defaultQty: 200, defaultUnit: 'ml', servingSize: '1 glass' },
  { id: 'd7', name: 'Lassi', category: 'dairy', caloriesPer100g: 75, proteinPer100g: 3, carbsPer100g: 11, fatPer100g: 2, fiberPer100g: 0, defaultQty: 250, defaultUnit: 'ml', servingSize: '1 glass' },

  { id: 's1', name: 'Whey Protein', category: 'supplement', caloriesPer100g: 379, proteinPer100g: 76, carbsPer100g: 9, fatPer100g: 4.5, fiberPer100g: 0, defaultQty: 30, defaultUnit: 'g', servingSize: '1 scoop' },
  { id: 's2', name: 'Protein Bar', category: 'snack', caloriesPer100g: 350, proteinPer100g: 33, carbsPer100g: 40, fatPer100g: 10, fiberPer100g: 5, defaultQty: 60, defaultUnit: 'g', servingSize: '1 bar' },
  
  { id: 'f16', name: 'Banana', category: 'fruit', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 22.8, fatPer100g: 0.3, fiberPer100g: 2.6, defaultQty: 1, defaultUnit: 'piece', servingSize: '1 medium' },
  { id: 'f17', name: 'Apple', category: 'fruit', caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 13.8, fatPer100g: 0.2, fiberPer100g: 2.4, defaultQty: 1, defaultUnit: 'piece', servingSize: '1 medium' },
  { id: 'f18', name: 'Mango', category: 'fruit', caloriesPer100g: 60, proteinPer100g: 0.8, carbsPer100g: 15, fatPer100g: 0.4, fiberPer100g: 1.6, defaultQty: 150, defaultUnit: 'g', servingSize: '1 cup' },
  { id: 'f19', name: 'Orange', category: 'fruit', caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatPer100g: 0.1, fiberPer100g: 2.4, defaultQty: 1, defaultUnit: 'piece', servingSize: '1 medium' },
  { id: 'f20', name: 'Watermelon', category: 'fruit', caloriesPer100g: 30, proteinPer100g: 0.6, carbsPer100g: 7.6, fatPer100g: 0.2, fiberPer100g: 0.4, defaultQty: 200, defaultUnit: 'g', servingSize: '1 cup' },
  { id: 'f21', name: 'Avocado', category: 'fruit', caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 8.5, fatPer100g: 14.7, fiberPer100g: 6.7, defaultQty: 100, defaultUnit: 'g', servingSize: '1/2 medium' },
  
  { id: 'v1', name: 'Sweet Potato', category: 'vegetable', caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20.1, fatPer100g: 0.1, fiberPer100g: 3, defaultQty: 150, defaultUnit: 'g', servingSize: '1 medium' },
  { id: 'v2', name: 'Broccoli', category: 'vegetable', caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 6.6, fatPer100g: 0.4, fiberPer100g: 2.6, defaultQty: 100, defaultUnit: 'g', servingSize: '1 cup' },
  { id: 'v3', name: 'Spinach / Palak', category: 'vegetable', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, fiberPer100g: 2.2, defaultQty: 100, defaultUnit: 'g', servingSize: '1 cup' },
  { id: 'v4', name: 'Mixed Vegetables', category: 'vegetable', caloriesPer100g: 50, proteinPer100g: 3, carbsPer100g: 10, fatPer100g: 0, fiberPer100g: 3, defaultQty: 150, defaultUnit: 'g', servingSize: '1 cup' },
  { id: 'v5', name: 'Mushroom', category: 'vegetable', caloriesPer100g: 22, proteinPer100g: 3.1, carbsPer100g: 3.3, fatPer100g: 0.3, fiberPer100g: 1, defaultQty: 100, defaultUnit: 'g', servingSize: '1 cup' },
  { id: 'v6', name: 'Capsicum / Bell Pepper', category: 'vegetable', caloriesPer100g: 20, proteinPer100g: 0.9, carbsPer100g: 4.6, fatPer100g: 0.2, fiberPer100g: 1.7, defaultQty: 100, defaultUnit: 'g', servingSize: '1 cup' },
  { id: 'v7', name: 'Tomato', category: 'vegetable', caloriesPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2, fiberPer100g: 1.2, defaultQty: 1, defaultUnit: 'piece', servingSize: '1 medium' },
  { id: 'v8', name: 'Cucumber', category: 'vegetable', caloriesPer100g: 15, proteinPer100g: 0.7, carbsPer100g: 3.6, fatPer100g: 0.1, fiberPer100g: 0.5, defaultQty: 100, defaultUnit: 'g', servingSize: '1/2 medium' },
  { id: 'v9', name: 'Carrot', category: 'vegetable', caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 9.6, fatPer100g: 0.2, fiberPer100g: 2.8, defaultQty: 100, defaultUnit: 'g', servingSize: '1 medium' },
  { id: 'v10', name: 'Beetroot', category: 'vegetable', caloriesPer100g: 43, proteinPer100g: 1.6, carbsPer100g: 9.6, fatPer100g: 0.2, fiberPer100g: 2.8, defaultQty: 100, defaultUnit: 'g', servingSize: '1 medium' },
  { id: 'v11', name: 'Peas', category: 'vegetable', caloriesPer100g: 81, proteinPer100g: 5.4, carbsPer100g: 14.5, fatPer100g: 0.4, fiberPer100g: 5.1, defaultQty: 100, defaultUnit: 'g', servingSize: '1 cup' },
  { id: 'v12', name: 'Corn', category: 'vegetable', caloriesPer100g: 86, proteinPer100g: 3.2, carbsPer100g: 19, fatPer100g: 1.2, fiberPer100g: 2.7, defaultQty: 100, defaultUnit: 'g', servingSize: '1/2 cup' },
  { id: 'v13', name: 'Potato', category: 'vegetable', caloriesPer100g: 77, proteinPer100g: 2, carbsPer100g: 17, fatPer100g: 0.1, fiberPer100g: 2.2, defaultQty: 150, defaultUnit: 'g', servingSize: '1 medium' },
  { id: 'v14', name: 'Onion', category: 'vegetable', caloriesPer100g: 40, proteinPer100g: 1.1, carbsPer100g: 9.3, fatPer100g: 0.1, fiberPer100g: 1.7, defaultQty: 50, defaultUnit: 'g', servingSize: '1/2 medium' },
  { id: 'v15', name: 'Garlic', category: 'vegetable', caloriesPer100g: 149, proteinPer100g: 6.4, carbsPer100g: 33, fatPer100g: 0.5, fiberPer100g: 2.1, defaultQty: 10, defaultUnit: 'g', servingSize: '3 cloves' },
  { id: 'v16', name: 'Ginger', category: 'vegetable', caloriesPer100g: 80, proteinPer100g: 1.8, carbsPer100g: 18, fatPer100g: 0.8, fiberPer100g: 2, defaultQty: 10, defaultUnit: 'g', servingSize: '1 inch' },

  { id: 'n1', name: 'Almonds', category: 'nut', caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50, fiberPer100g: 12.5, defaultQty: 30, defaultUnit: 'g', servingSize: 'handful' },
  { id: 'n2', name: 'Peanut Butter', category: 'nut', caloriesPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50, fiberPer100g: 6, defaultQty: 16, defaultUnit: 'g', servingSize: '1 tbsp' },
  { id: 'n3', name: 'Granola', category: 'snack', caloriesPer100g: 471, proteinPer100g: 10, carbsPer100g: 64, fatPer100g: 20, fiberPer100g: 5, defaultQty: 45, defaultUnit: 'g', servingSize: '1/2 cup' },
  { id: 'n4', name: 'Dark Chocolate', category: 'snack', caloriesPer100g: 598, proteinPer100g: 7.8, carbsPer100g: 46, fatPer100g: 43, fiberPer100g: 11, defaultQty: 20, defaultUnit: 'g', servingSize: '1 square' },

  { id: 'o1', name: 'Olive Oil', category: 'oil', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, fiberPer100g: 0, defaultQty: 10, defaultUnit: 'g', servingSize: '1 tbsp' },
  { id: 'o2', name: 'Ghee', category: 'oil', caloriesPer100g: 900, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, fiberPer100g: 0, defaultQty: 10, defaultUnit: 'g', servingSize: '1 tbsp' },

  { id: 'b1', name: 'Green Tea', category: 'beverage', caloriesPer100g: 1, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0, defaultQty: 1, defaultUnit: 'cup', servingSize: '1 cup' },
  { id: 'b2', name: 'Coffee', category: 'beverage', caloriesPer100g: 1, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0, fiberPer100g: 0, defaultQty: 1, defaultUnit: 'cup', servingSize: '1 cup' },
  { id: 'b3', name: 'Coconut Water', category: 'beverage', caloriesPer100g: 19, proteinPer100g: 0.7, carbsPer100g: 3.7, fatPer100g: 0.2, fiberPer100g: 1.1, defaultQty: 250, defaultUnit: 'ml', servingSize: '1 glass' },
  { id: 'b4', name: 'Lemon Juice', category: 'beverage', caloriesPer100g: 22, proteinPer100g: 0.4, carbsPer100g: 6.9, fatPer100g: 0.2, fiberPer100g: 0.3, defaultQty: 15, defaultUnit: 'ml', servingSize: '1 tbsp' },
  { id: 'b5', name: 'Smoothie Base', category: 'beverage', caloriesPer100g: 50, proteinPer100g: 1, carbsPer100g: 12, fatPer100g: 0, fiberPer100g: 2, defaultQty: 250, defaultUnit: 'ml', servingSize: '1 glass' },

  { id: 'm1', name: 'Honey', category: 'snack', caloriesPer100g: 304, proteinPer100g: 0.3, carbsPer100g: 82, fatPer100g: 0, fiberPer100g: 0.2, defaultQty: 10, defaultUnit: 'g', servingSize: '1 tbsp' },
  { id: 'm2', name: 'Jaggery', category: 'snack', caloriesPer100g: 383, proteinPer100g: 0.4, carbsPer100g: 98, fatPer100g: 0.1, fiberPer100g: 0, defaultQty: 10, defaultUnit: 'g', servingSize: '1 tbsp' },
  { id: 'm3', name: 'Dates', category: 'snack', caloriesPer100g: 277, proteinPer100g: 1.8, carbsPer100g: 75, fatPer100g: 0.2, fiberPer100g: 6.7, defaultQty: 30, defaultUnit: 'g', servingSize: '2 dates' },
];

export default foodData;
export const foodDatabase = foodData;

export const searchFoods = (query) => {
  if (!query) return foodData;
  const lowerQuery = query.toLowerCase();
  return foodData.filter((food) => food.name.toLowerCase().includes(lowerQuery));
};

export const calculateNutrition = (foodId, quantity) => {
  const food = foodData.find((f) => f.id === foodId);
  if (!food) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  const factor = quantity / 100;
  return {
    calories: Math.round(food.caloriesPer100g * factor),
    protein: Math.round(food.proteinPer100g * factor * 10) / 10,
    carbs: Math.round(food.carbsPer100g * factor * 10) / 10,
    fat: Math.round(food.fatPer100g * factor * 10) / 10,
  };
};
