const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { stores, getIsMongoConnected } = require('../db');
const User = require('../models/User');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const DEMO_USERS = [
  {
    _id: 'guest_user_1',
    name: 'Alex Johnson',
    email: 'alex.fitness@example.com',
    password: 'password123',
    age: 28,
    gender: 'male',
    heightCm: 178,
    weightKg: 75.5,
    targetWeightKg: 72.0,
    fitnessGoal: 'Muscle Gain & Calorie Deficit',
    activityLevel: 'Moderately Active',
    dailyCalorieTarget: 2400,
    dailyWaterMlTarget: 3000,
    targetProteinGrams: 160,
    targetCarbsGrams: 220,
    targetFatGrams: 65,
    isGuest: true
  },
  {
    _id: 'guest_user_2',
    name: 'Sarah Miller',
    email: 'sarah.marathon@example.com',
    password: 'password123',
    age: 26,
    gender: 'female',
    heightCm: 165,
    weightKg: 58.0,
    targetWeightKg: 56.0,
    fitnessGoal: 'Endurance & Cardiorespiratory',
    activityLevel: 'Very Active',
    dailyCalorieTarget: 2100,
    dailyWaterMlTarget: 3500,
    targetProteinGrams: 120,
    targetCarbsGrams: 260,
    targetFatGrams: 50,
    isGuest: true
  },
  {
    _id: 'guest_user_3',
    name: 'Marcus Vance',
    email: 'marcus.power@example.com',
    password: 'password123',
    age: 31,
    gender: 'male',
    heightCm: 185,
    weightKg: 92.0,
    targetWeightKg: 88.0,
    fitnessGoal: 'Body Recomposition & Maintenance',
    activityLevel: 'Moderately Active',
    dailyCalorieTarget: 2800,
    dailyWaterMlTarget: 4000,
    targetProteinGrams: 200,
    targetCarbsGrams: 250,
    targetFatGrams: 80,
    isGuest: true
  }
];

stores.users.seedIfEmpty(DEMO_USERS);

router.get('/demo-accounts', async (req, res) => {
  try {
    let allUsers = [];
    if (getIsMongoConnected()) {
      const dbUsers = await User.find({}).select('-password');
      allUsers = [...DEMO_USERS, ...dbUsers.filter(u => !DEMO_USERS.some(d => d._id === u._id.toString() || d.email === u.email))];
    } else {
      const dbUsers = stores.users.find({}) || [];
      allUsers = [...DEMO_USERS];
      dbUsers.forEach(u => {
        if (!allUsers.some(d => d._id === u._id || d.email === u.email)) {
          allUsers.push(u);
        }
      });
    }
    return res.json(allUsers);
  } catch (err) {
    return res.json(DEMO_USERS);
  }
});

router.post('/switch-account', async (req, res) => {
  const { userId } = req.body;
  try {
    let targetUser = DEMO_USERS.find(u => u._id === userId);
    if (!targetUser) {
      targetUser = stores.users.findById(userId);
    }
    if (!targetUser) {
      targetUser = DEMO_USERS[0];
    }
    const token = jwt.sign({ id: targetUser._id, email: targetUser.email, name: targetUser.name, isGuest: targetUser.isGuest }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: targetUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password, age, gender, heightCm, weightKg, fitnessGoal } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    if (getIsMongoConnected()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        age: age || 28,
        gender: gender || 'male',
        heightCm: heightCm || 175,
        weightKg: weightKg || 70,
        fitnessGoal: fitnessGoal || 'Weight Loss',
        isGuest: false
      });

      const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.name, isGuest: false }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: newUser });
    } else {
      const existing = stores.users.findOne({ email });
      if (existing) return res.status(400).json({ message: 'User already exists with this email' });

      const newUser = stores.users.insertOne({
        name,
        email,
        password,
        age: age || 28,
        gender: gender || 'male',
        heightCm: heightCm || 175,
        weightKg: weightKg || 70,
        targetWeightKg: 68,
        fitnessGoal: fitnessGoal || 'Weight Loss',
        dailyCalorieTarget: 2200,
        targetProteinGrams: 150,
        targetCarbsGrams: 200,
        targetFatGrams: 60,
        isGuest: false
      });

      const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.name, isGuest: false }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: newUser });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    if (getIsMongoConnected()) {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Account not found. Please create a new account!' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name, isGuest: user.isGuest }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user });
    } else {
      let user = stores.users.findOne({ email });
      if (!user) {
        user = DEMO_USERS.find(u => u.email === email);
      }
      if (!user) return res.status(400).json({ message: 'Account not found. Please create a new account!' });

      if (user.password && user.password !== password) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name, isGuest: user.isGuest }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (getIsMongoConnected()) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.json(DEMO_USERS[0]);
      return res.json(user);
    } else {
      const user = stores.users.findById(req.user.id) || DEMO_USERS.find(u => u._id === req.user.id) || DEMO_USERS[0];
      return res.json(user);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  const updates = req.body;
  try {
    if (getIsMongoConnected()) {
      const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
      return res.json(updatedUser);
    } else {
      const updated = stores.users.updateOne({ _id: req.user.id }, updates) || { ...DEMO_USERS[0], ...updates };
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/auth/users/:id - Delete user account & clean up associated logs
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    if (getIsMongoConnected()) {
      await User.findByIdAndDelete(userId);
      const Workout = require('../models/Workout');
      const FoodLog = require('../models/FoodLog');
      await Workout.deleteMany({ userId });
      await FoodLog.deleteMany({ userId });
    } else {
      stores.users.deleteOne({ _id: userId });
      stores.workouts.deleteMany({ userId });
      stores.foodLogs.deleteMany({ userId });
    }
    return res.json({ message: 'User account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
