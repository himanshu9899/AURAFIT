const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  mealType: { 
    type: String, 
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], 
    required: true 
  },
  foodName: { type: String, required: true },
  servingSize: { type: String, default: '1 serving' },
  calories: { type: Number, required: true },
  proteinGrams: { type: Number, default: 0 },
  carbsGrams: { type: Number, default: 0 },
  fatGrams: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.FoodLog || mongoose.model('FoodLog', foodLogSchema);
