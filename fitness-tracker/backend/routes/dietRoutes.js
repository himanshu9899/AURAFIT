const express = require('express');
const router = express.Router();
const { stores, getIsMongoConnected } = require('../db');
const FoodLog = require('../models/FoodLog');
const { authMiddleware } = require('../middleware/auth');

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

const SAMPLE_FOOD_LOGS = [
  {
    userId: 'guest_user_1',
    date: today,
    mealType: 'Breakfast',
    foodName: 'Oatmeal with Blueberries & Whey Protein',
    servingSize: '1 bowl (80g oats)',
    calories: 420,
    proteinGrams: 32,
    carbsGrams: 55,
    fatGrams: 8
  },
  {
    userId: 'guest_user_1',
    date: today,
    mealType: 'Lunch',
    foodName: 'Grilled Chicken Breast with Brown Rice & Broccoli',
    servingSize: '200g chicken, 150g rice',
    calories: 580,
    proteinGrams: 48,
    carbsGrams: 62,
    fatGrams: 10
  }
];

stores.foodLogs.seedIfEmpty(SAMPLE_FOOD_LOGS);

const DIET_PLANS = [
  {
    id: 'high-protein',
    name: 'High Protein Hypertrophy',
    description: 'Designed for lean muscle growth, maximum recovery, and strength gains.',
    targetCalories: 2600,
    macrosRatio: { protein: 40, carbs: 40, fat: 20 },
    recommendedFoods: ['Chicken Breast', 'Egg Whites', 'Salmon', 'Greek Yogurt', 'Brown Rice', 'Quinoa']
  },
  {
    id: 'keto-shred',
    name: 'Keto Fat Burn Shred',
    description: 'Low-carbohydrate, high-fat nutrition strategy for rapid fat loss and sustained ketosis energy.',
    targetCalories: 2000,
    macrosRatio: { protein: 30, carbs: 10, fat: 60 },
    recommendedFoods: ['Avocados', 'Ribeye Steak', 'Olive Oil', 'Eggs', 'Macadamia Nuts', 'Spinach']
  },
  {
    id: 'mediterranean-wellness',
    name: 'Mediterranean Heart & Endurance',
    description: 'Rich in whole grains, healthy fats, anti-inflammatory antioxidants, and lean proteins.',
    targetCalories: 2200,
    macrosRatio: { protein: 25, carbs: 50, fat: 25 },
    recommendedFoods: ['Extra Virgin Olive Oil', 'Whole Grain Oats', 'Mixed Berries', 'Wild Caught Fish', 'Walnuts']
  }
];

router.get('/plans', (req, res) => {
  res.json(DIET_PLANS);
});

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const targetDate = req.query.date;

  try {
    let logs = [];
    if (getIsMongoConnected()) {
      const query = targetDate ? { userId, date: targetDate } : { userId };
      logs = await FoodLog.find(query).sort({ date: -1, createdAt: -1 });
    } else {
      if (targetDate) {
        logs = stores.foodLogs.find({ userId, date: targetDate });
      } else {
        logs = stores.foodLogs.find({ userId });
        if (logs.length === 0 && (userId === 'guest_user_1' || req.user.isGuest)) {
          logs = stores.foodLogs.find({});
        }
      }
    }

    const totals = logs.reduce((acc, item) => {
      acc.calories += Number(item.calories || 0);
      acc.proteinGrams += Number(item.proteinGrams || 0);
      acc.carbsGrams += Number(item.carbsGrams || 0);
      acc.fatGrams += Number(item.fatGrams || 0);
      return acc;
    }, { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 });

    res.json({ date: targetDate || today, logs, totals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { date, mealType, foodName, servingSize, calories, proteinGrams, carbsGrams, fatGrams } = req.body;

  if (!foodName || !calories || !mealType) {
    return res.status(400).json({ message: 'Meal type, food name, and calories are required' });
  }

  const logData = {
    userId,
    date: date || today,
    mealType,
    foodName,
    servingSize: servingSize || '1 serving',
    calories: Number(calories),
    proteinGrams: Number(proteinGrams || 0),
    carbsGrams: Number(carbsGrams || 0),
    fatGrams: Number(fatGrams || 0)
  };

  try {
    if (getIsMongoConnected()) {
      const newLog = await FoodLog.create(logData);
      return res.status(201).json(newLog);
    } else {
      const newLog = stores.foodLogs.insertOne(logData);
      return res.status(201).json(newLog);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    if (getIsMongoConnected()) {
      await FoodLog.findByIdAndDelete(id);
    } else {
      stores.foodLogs.deleteOne({ _id: id });
    }
    return res.json({ message: 'Food log deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
