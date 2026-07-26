const express = require('express');
const router = express.Router();
const { stores, getIsMongoConnected } = require('../db');
const Workout = require('../models/Workout');
const { authMiddleware } = require('../middleware/auth');

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const day3Ago = new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0];
const day5Ago = new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0];

const SAMPLE_WORKOUTS = [
  {
    userId: 'guest_user_1',
    title: 'Morning Outdoor Tempo Run',
    workoutType: 'Running',
    category: 'Cardio',
    date: today,
    startTime: '06:30',
    endTime: '07:15',
    durationHours: 0,
    durationMinutes: 45,
    distanceKm: 7.2,
    caloriesBurned: 520,
    intensity: 'High',
    notes: 'Maintained 6:15 min/km pace across park trails.',
    exercises: [
      { name: 'Outdoor Running Sprints', category: 'Cardio', sets: [{ setNumber: 1, reps: 1, weightKg: 0 }] }
    ]
  },
  {
    userId: 'guest_user_1',
    title: 'Hypertrophy Bench Press & Triceps',
    workoutType: 'Gym',
    category: 'Chest',
    date: today,
    startTime: '17:30',
    endTime: '18:25',
    durationHours: 0,
    durationMinutes: 55,
    distanceKm: 0,
    caloriesBurned: 420,
    intensity: 'High',
    notes: 'Hit a new PR on Incline Bench Press! 85kg for 6 reps.',
    exercises: [
      {
        name: 'Incline Barbell Bench Press',
        category: 'Chest',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 70, completed: true },
          { setNumber: 2, reps: 8, weightKg: 80, completed: true },
          { setNumber: 3, reps: 6, weightKg: 85, completed: true }
        ]
      }
    ]
  },
  {
    userId: 'guest_user_1',
    title: 'Coastal Highway Endurance Ride',
    workoutType: 'Cycling',
    category: 'Cardio',
    date: yesterday,
    startTime: '07:00',
    endTime: '08:15',
    durationHours: 1,
    durationMinutes: 15,
    distanceKm: 28.5,
    caloriesBurned: 680,
    intensity: 'High',
    notes: 'Smooth gear transitions, strong cadence.',
    exercises: [
      { name: 'Outdoor Road Cycling', category: 'Cardio', sets: [{ setNumber: 1, reps: 1, weightKg: 0 }] }
    ]
  },
  {
    userId: 'guest_user_1',
    title: 'Legs & Core Heavy Squats',
    workoutType: 'Gym',
    category: 'Legs',
    date: day3Ago,
    startTime: '18:00',
    endTime: '19:00',
    durationHours: 1,
    durationMinutes: 0,
    distanceKm: 0,
    caloriesBurned: 510,
    intensity: 'Extreme',
    notes: 'Quads were completely exhausted by final set.',
    exercises: [
      {
        name: 'Barbell Back Squats',
        category: 'Legs',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 90, completed: true },
          { setNumber: 2, reps: 8, weightKg: 105, completed: true },
          { setNumber: 3, reps: 6, weightKg: 115, completed: true }
        ]
      }
    ]
  }
];

stores.workouts.seedIfEmpty(SAMPLE_WORKOUTS);

// GET /api/workouts - Fetch all workouts for user
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    if (getIsMongoConnected()) {
      const workouts = await Workout.find({ userId }).sort({ date: -1, createdAt: -1 });
      return res.json(workouts);
    } else {
      let workouts = stores.workouts.find({ userId });
      if (workouts.length === 0 && (userId === 'guest_user_1' || req.user.isGuest)) {
        workouts = stores.workouts.find({});
      }
      return res.json(workouts.sort((a, b) => b.date.localeCompare(a.date)));
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/workouts - Add workout
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const {
    title, workoutType, category, date, startTime, endTime,
    durationHours, durationMinutes, distanceKm, caloriesBurned,
    intensity, exercises, notes
  } = req.body;

  if (!title || !date) {
    return res.status(400).json({ message: 'Title and date are required' });
  }

  const totalMinutes = (Number(durationHours) || 0) * 60 + (Number(durationMinutes) || 0);

  const workoutPayload = {
    userId,
    title,
    workoutType: workoutType || 'Gym',
    category: category || workoutType || 'Full Body',
    date,
    startTime: startTime || '08:00',
    endTime: endTime || '08:45',
    durationHours: Number(durationHours) || 0,
    durationMinutes: totalMinutes || 45,
    distanceKm: Number(distanceKm) || 0,
    caloriesBurned: Number(caloriesBurned) || 300,
    intensity: intensity || 'Moderate',
    exercises: exercises || [],
    notes: notes || ''
  };

  try {
    if (getIsMongoConnected()) {
      const newWorkout = await Workout.create(workoutPayload);
      return res.status(201).json(newWorkout);
    } else {
      const newWorkout = stores.workouts.insertOne(workoutPayload);
      return res.status(201).json(newWorkout);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/workouts/:id - Edit workout
router.put('/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  if (updates.durationHours !== undefined || updates.durationMinutes !== undefined) {
    updates.durationMinutes = (Number(updates.durationHours) || 0) * 60 + (Number(updates.durationMinutes) || 0);
  }

  try {
    if (getIsMongoConnected()) {
      const updated = await Workout.findByIdAndUpdate(id, updates, { new: true });
      return res.json(updated);
    } else {
      const updated = stores.workouts.updateOne({ _id: id }, updates);
      return res.json(updated || { _id: id, ...updates });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/workouts/:id - Delete workout
router.delete('/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    if (getIsMongoConnected()) {
      await Workout.findByIdAndDelete(id);
    } else {
      stores.workouts.deleteOne({ _id: id });
    }
    return res.json({ message: 'Workout deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
