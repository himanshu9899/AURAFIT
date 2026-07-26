const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, default: 28 },
  gender: { type: String, default: 'male' },
  heightCm: { type: Number, default: 178 },
  weightKg: { type: Number, default: 75.5 },
  targetWeightKg: { type: Number, default: 72.0 },
  fitnessGoal: { type: String, default: 'Muscle Gain & Calorie Deficit' },
  activityLevel: { type: String, default: 'Moderately Active' },
  dailyCalorieTarget: { type: Number, default: 2400 },
  dailyWaterMlTarget: { type: Number, default: 3000 },
  targetProteinGrams: { type: Number, default: 160 },
  targetCarbsGrams: { type: Number, default: 220 },
  targetFatGrams: { type: Number, default: 65 }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
