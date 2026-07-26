const express = require('express');
const router = express.Router();
const { stores, getIsMongoConnected } = require('../db');
const Goal = require('../models/Goal');
const { authMiddleware } = require('../middleware/auth');

const DEFAULT_GOALS = {
  _id: 'goal_guest_1',
  userId: 'guest_user_1',
  dailyMinutes: 60,
  dailyCalories: 500,
  dailyDistanceKm: 5,
  dailyWorkoutsCount: 1,

  weeklyMinutes: 300,
  weeklyCalories: 2500,
  weeklyDistanceKm: 25,
  weeklyWorkoutsCount: 5,

  monthlyMinutes: 1200,
  monthlyCalories: 10000,
  monthlyDistanceKm: 100,
  monthlyWorkoutsCount: 20
};

stores.goals.seedIfEmpty([DEFAULT_GOALS]);

// GET /api/goals - Fetch user goals
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    if (getIsMongoConnected()) {
      let goal = await Goal.findOne({ userId });
      if (!goal) {
        goal = await Goal.create({ ...DEFAULT_GOALS, _id: undefined, userId });
      }
      return res.json(goal);
    } else {
      let goal = stores.goals.findOne({ userId });
      if (!goal) {
        goal = { ...DEFAULT_GOALS, userId };
      }
      return res.json(goal);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/goals - Update user goals
router.put('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  try {
    if (getIsMongoConnected()) {
      const updated = await Goal.findOneAndUpdate({ userId }, updates, { new: true, upsert: true });
      return res.json(updated);
    } else {
      let goal = stores.goals.findOne({ userId });
      let updated;
      if (goal) {
        updated = stores.goals.updateOne({ userId }, updates);
      } else {
        updated = stores.goals.insertOne({ userId, ...updates });
      }
      return res.json(updated || { userId, ...updates });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
