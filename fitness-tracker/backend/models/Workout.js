const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  setNumber: { type: Number, default: 1 },
  reps: { type: Number, default: 10 },
  weightKg: { type: Number, default: 0 },
  completed: { type: Boolean, default: true }
});

const workoutSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  workoutType: { 
    type: String, 
    enum: ['Running', 'Walking', 'Cycling', 'Swimming', 'Yoga', 'Gym', 'HIIT', 'Pilates', 'Boxing', 'Rowing', 'Hiking', 'Full Body'], 
    default: 'Gym' 
  },
  category: { type: String, default: 'General' },
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, default: '08:00' }, // HH:MM
  endTime: { type: String, default: '08:45' },   // HH:MM
  durationHours: { type: Number, default: 0 },
  durationMinutes: { type: Number, default: 45 },
  distanceKm: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 320 },
  intensity: { type: String, enum: ['Light', 'Moderate', 'High', 'Extreme'], default: 'Moderate' },
  exercises: [{
    name: String,
    category: String,
    sets: [setSchema],
    notes: String
  }],
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);
