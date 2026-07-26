const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  dailyMinutes: { type: Number, default: 60 },
  dailyCalories: { type: Number, default: 500 },
  dailyDistanceKm: { type: Number, default: 5 },
  dailyWorkoutsCount: { type: Number, default: 1 },
  
  weeklyMinutes: { type: Number, default: 300 },
  weeklyCalories: { type: Number, default: 2500 },
  weeklyDistanceKm: { type: Number, default: 25 },
  weeklyWorkoutsCount: { type: Number, default: 5 },

  monthlyMinutes: { type: Number, default: 1200 },
  monthlyCalories: { type: Number, default: 10000 },
  monthlyDistanceKm: { type: Number, default: 100 },
  monthlyWorkoutsCount: { type: Number, default: 20 }
}, { timestamps: true });

module.exports = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
