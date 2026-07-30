import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import DietTracker from './components/DietTracker';
import AnalyticsView from './components/AnalyticsView';
import ProfileView from './components/ProfileView';
import AuthModal from './components/AuthModal';
import RestTimerModal from './components/RestTimerModal';
import AccountSwitcherModal from './components/AccountSwitcherModal';
import LoginPage from './components/LoginPage';
import CelebrationModal from './components/CelebrationModal';

const API_BASE = '/api';

const DEFAULT_DEMO_ACCOUNTS = [
  {
    _id: 'guest_user_1',
    name: 'Alex Johnson',
    email: 'alex.fitness@example.com',
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

export default function App() {
  const [activeTab, setActiveTab] = useState('login');
  const [user, setUser] = useState(DEFAULT_DEMO_ACCOUNTS[0]);
  const [demoAccounts, setDemoAccounts] = useState(DEFAULT_DEMO_ACCOUNTS);

  const [goals, setGoals] = useState({
    dailyMinutes: 60,
    dailyCalories: 500,
    dailyDistanceKm: 5,
    weeklyMinutes: 300,
    weeklyCalories: 2500,
    monthlyMinutes: 1200,
    monthlyCalories: 10000
  });

  const [workouts, setWorkouts] = useState([]);

  const [foodData, setFoodData] = useState({
    totals: { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 },
    logs: []
  });

  const [analytics, setAnalytics] = useState(null);
  const [dietPlans, setDietPlans] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [celebrationData, setCelebrationData] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, [user._id]);

  const fetchInitialData = async () => {
    try {
      const [userRes, workoutsRes, dietRes, analyticsRes, plansRes, accountsRes, goalsRes] = await Promise.all([
        axios.get(`${API_BASE}/auth/profile`),
        axios.get(`${API_BASE}/workouts`),
        axios.get(`${API_BASE}/diet`),
        axios.get(`${API_BASE}/analytics/dashboard`),
        axios.get(`${API_BASE}/diet/plans`),
        axios.get(`${API_BASE}/auth/demo-accounts`),
        axios.get(`${API_BASE}/goals`)
      ]);

      if (userRes.data) setUser(userRes.data);
      if (Array.isArray(workoutsRes.data)) setWorkouts(workoutsRes.data);
      if (dietRes.data) setFoodData(dietRes.data);
      if (analyticsRes.data) setAnalytics(analyticsRes.data);
      if (plansRes.data) setDietPlans(plansRes.data);
      if (accountsRes.data) setDemoAccounts(accountsRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
    } catch (e) {
      console.log('Using local fallback data');
    }
  };

  const handleSelectAccount = async (targetUser) => {
    setUser(targetUser);
    try {
      const res = await axios.post(`${API_BASE}/auth/switch-account`, { userId: targetUser._id });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      }
    } catch (e) {}
  };

  // Workout CRUD handlers
  const checkGoalAchievement = (updatedWorkouts) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayW = updatedWorkouts.filter(w => w.date === todayStr);
    const totalDuration = todayW.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);
    const totalCal = todayW.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

    if (totalDuration >= (goals.dailyMinutes || 60) || totalCal >= (goals.dailyCalories || 500)) {
      setCelebrationData({
        title: '🎉 Daily Workout Goal Achieved!',
        message: `Outstanding performance! You completed ${totalDuration} minutes and burned ${totalCal} calories today.`
      });
    }
  };

  const handleAddWorkout = async (newWorkout) => {
    let updated;
    try {
      const res = await axios.post(`${API_BASE}/workouts`, newWorkout);
      updated = [res.data, ...workouts];
    } catch (e) {
      const mockWorkout = { _id: 'w_' + Date.now(), userId: user._id, ...newWorkout };
      updated = [mockWorkout, ...workouts];
    }
    setWorkouts(updated);
    checkGoalAchievement(updated);
  };

  const handleEditWorkout = async (id, updatedFields) => {
    let updated;
    try {
      const res = await axios.put(`${API_BASE}/workouts/${id}`, updatedFields);
      updated = workouts.map(w => w._id === id ? res.data : w);
    } catch (e) {
      updated = workouts.map(w => w._id === id ? { ...w, ...updatedFields } : w);
    }
    setWorkouts(updated);
    checkGoalAchievement(updated);
  };

  const handleDeleteWorkout = async (id) => {
    try {
      await axios.delete(`${API_BASE}/workouts/${id}`);
    } catch (e) {}
    setWorkouts(workouts.filter(w => w._id !== id));
  };

  // Goals update handler
  const handleUpdateGoals = async (newGoals) => {
    try {
      const res = await axios.put(`${API_BASE}/goals`, newGoals);
      setGoals(res.data);
    } catch (e) {
      setGoals(prev => ({ ...prev, ...newGoals }));
    }
  };

  // Food handlers
  const handleAddFoodLog = async (foodItem) => {
    try {
      const res = await axios.post(`${API_BASE}/diet`, foodItem);
      setFoodData(prev => ({
        ...prev,
        logs: [res.data, ...prev.logs],
        totals: {
          calories: prev.totals.calories + foodItem.calories,
          proteinGrams: prev.totals.proteinGrams + foodItem.proteinGrams,
          carbsGrams: prev.totals.carbsGrams + foodItem.carbsGrams,
          fatGrams: prev.totals.fatGrams + foodItem.fatGrams
        }
      }));
    } catch (e) {
      const mockFood = { _id: 'f_' + Date.now(), userId: user._id, ...foodItem };
      setFoodData(prev => ({
        ...prev,
        logs: [mockFood, ...prev.logs],
        totals: {
          calories: prev.totals.calories + foodItem.calories,
          proteinGrams: prev.totals.proteinGrams + foodItem.proteinGrams,
          carbsGrams: prev.totals.carbsGrams + foodItem.carbsGrams,
          fatGrams: prev.totals.fatGrams + foodItem.fatGrams
        }
      }));
    }
  };

  const handleDeleteFoodLog = async (id) => {
    try {
      await axios.delete(`${API_BASE}/diet/${id}`);
    } catch (e) {}
    setFoodData(prev => ({
      ...prev,
      logs: prev.logs.filter(l => l._id !== id)
    }));
  };

  const handleUpdateProfile = async (updatedMetrics) => {
    try {
      const res = await axios.put(`${API_BASE}/auth/profile`, updatedMetrics);
      setUser(res.data);
    } catch (e) {
      setUser(prev => ({ ...prev, ...updatedMetrics }));
    }
  };

  const handleLogin = async (credentials) => {
    const res = await axios.post(`${API_BASE}/auth/login`, credentials);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      fetchInitialData();
    }
  };

  const handleRegister = async (userData) => {
    const res = await axios.post(`${API_BASE}/auth/register`, userData);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      fetchInitialData();
    }
  };

  if (activeTab === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDemoLogin={fetchInitialData}
        onSelectAccount={handleSelectAccount}
        demoAccounts={demoAccounts}
        onEnterApp={() => setActiveTab('dashboard')}
      />
    );
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setActiveTab('login')} />

      <div className="app-main">
        <Header
          user={user}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenTimer={() => setShowTimerModal(true)}
          onOpenQuickLog={() => setActiveTab('workouts')}
          onOpenAccountSwitcher={() => setShowAccountSwitcher(true)}
          onLogout={() => setActiveTab('login')}
        />

        <main className="content-area">
          {activeTab === 'dashboard' && (
            <Dashboard
              analytics={analytics}
              user={user}
              workouts={workouts}
              foodData={foodData}
              goals={goals}
              onUpdateGoals={handleUpdateGoals}
              onOpenQuickLog={() => setActiveTab('workouts')}
              setActiveTab={setActiveTab}
              onTriggerCelebration={(title, message) => setCelebrationData({ title, message })}
            />
          )}

          {activeTab === 'workouts' && (
            <WorkoutLogger
              workouts={workouts}
              onAddWorkout={handleAddWorkout}
              onEditWorkout={handleEditWorkout}
              onDeleteWorkout={handleDeleteWorkout}
              onOpenTimer={() => setShowTimerModal(true)}
              userWeightKg={user?.weightKg || 75}
            />
          )}

          {activeTab === 'diet' && (
            <DietTracker
              foodData={foodData}
              onAddFoodLog={handleAddFoodLog}
              onDeleteFoodLog={handleDeleteFoodLog}
              dietPlans={dietPlans.length > 0 ? dietPlans : [
                { id: 'high-protein', name: 'High Protein Hypertrophy', description: 'For muscle growth & recovery', macrosRatio: { protein: 40, carbs: 40, fat: 20 } },
                { id: 'keto-shred', name: 'Keto Fat Burn Shred', description: 'Low-carb fat oxidation state', macrosRatio: { protein: 30, carbs: 10, fat: 60 } },
                { id: 'mediterranean-wellness', name: 'Mediterranean Heart & Endurance', description: 'Anti-inflammatory whole food diet', macrosRatio: { protein: 25, carbs: 50, fat: 25 } }
              ]}
              user={user}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView analytics={analytics} user={user} workouts={workouts} foodData={foodData} />
          )}

          {activeTab === 'profile' && (
            <ProfileView user={user} onUpdateProfile={handleUpdateProfile} />
          )}
        </main>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onDemoLogin={fetchInitialData}
        />
      )}

      {showTimerModal && (
        <RestTimerModal onClose={() => setShowTimerModal(false)} />
      )}

      {showAccountSwitcher && (
        <AccountSwitcherModal
          onClose={() => setShowAccountSwitcher(false)}
          currentUser={user}
          demoAccounts={demoAccounts}
          onSelectAccount={handleSelectAccount}
          onOpenAuth={() => setShowAuthModal(true)}
        />
      )}

      {celebrationData && (
        <CelebrationModal
          onClose={() => setCelebrationData(null)}
          title={celebrationData.title}
          message={celebrationData.message}
        />
      )}
    </div>
  );
}
