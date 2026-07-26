# ⚡ AuraFit - Next-Gen Health Tech & Fitness Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5-purple.svg)](https://vitejs.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-v4-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Supported-brightgreen.svg)](https://www.mongodb.com/)

**AuraFit** is a full-stack (MERN stack) health tech, workout logging, nutrition budgeting, and visual performance analytics application. It features a modern Dark Glassmorphism design system, date-wise activity tracking, automated MET calorie burn calculations, real-time target gap indicators, interactive Recharts graphs, and goal achievement celebration animations.

---

## 🌟 Key Features

### 🏋️ 1. Date-Wise Workout Logging & History (Full CRUD)
- **Multi-Activity Support**: Track sessions for *Running, Walking, Cycling, Swimming, Yoga, Gym, HIIT, Pilates, Boxing, Rowing, Hiking, and Full Body*.
- **Rich Metric Fields**: Duration (Hours & Minutes), Distance (km), Start Time, End Time, Intensity, Date, and Notes.
- **MET Auto-Calorie Calculator**: Automatic calorie burn estimation using Metabolic Equivalent of Task formulas (`Calories = MET × Weight(kg) × Duration(hrs)`) with optional manual override.
- **Date-Wise Grouping & Filters**: Group workout sessions by exact calendar date with daily total summaries, or filter using search bar and period pills (*Today, Last 7 Days, Last 30 Days, This Month*).
- **Full CRUD**: Add, Edit (✏️), and Delete (🗑️) sessions with instant UI updates without page refreshes.

### 🎯 2. Daily Progress & Target Gap Performance Indicators
- **Target Gap Callouts**: Live dynamic progress callouts showing exact remaining targets:
  - ⏱️ *"20 minutes remaining to complete today's goal."*
  - 🔥 *"150 calories remaining."*
  - 🏃 *"1.5 km distance remaining."*
- **Merged Daily Totals**: Automatically combines multiple workouts performed on the same day (e.g., Morning Run + Evening Gym) into single daily totals for Duration, Calories, and Distance while preserving individual workout logs.
- **Goal Progress Meters**: Animated progress bars for Daily, Weekly, and Monthly target completion.
- **🎉 Goal Completion Celebration Toast**: Non-disruptive celebration toast with animated particle confetti whenever a daily/weekly/monthly target is completed.

### 🥗 3. Date-Wise Diet & Calorie Budget Counter
- **Macro Tracking**: Track Protein (g), Carbohydrates (g), Fats (g), and Total Calories (kcal).
- **Date-Wise Meal Logs**: Log meals for any date across Breakfast, Lunch, Dinner, and Snacks.
- **Integrated Diet Plans**: One-click selection for pre-configured nutrition plans:
  - *High Protein Hypertrophy* (40% Protein / 40% Carbs / 20% Fat)
  - *Keto Fat Burn Shred* (30% Protein / 10% Carbs / 60% Fat)
  - *Mediterranean Heart & Endurance* (25% Protein / 50% Carbs / 25% Fat)

### 📊 4. Interactive Visual Analytics (Recharts)
- **Daily Workout Duration & Target Line Chart**
- **Calories Burned Daily Trend Bar Chart**
- **Muscle Group & Activity Distribution Split**
- **Weight Loss & Goal Trend Analysis**
- **Live BMR & TDEE Metabolic Calculator**: Mifflin-St Jeor formula calculating Basal Metabolic Rate and Total Daily Energy Expenditure based on user age, gender, height, weight, and activity level.

### 🔐 5. Multi-Account Switcher & Authentication
- **1-Click Demo Profiles**: Switch instantly between pre-configured fitness profiles:
  - **Alex Johnson** (Hypertrophy & Calorie Deficit)
  - **Sarah Miller** (Marathon & Cardiorespiratory)
  - **Marcus Vance** (Powerlifting & Recomposition)
- **MERN Auth**: Secure JWT-token authentication with full Registration & Login modals.
- **Startup Entry Flow**: App opens full-screen on the Welcome & Login page, requiring login/profile selection before entering the dashboard.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Vanilla Dark Glassmorphism CSS, Recharts, Lucide React Icons, Axios |
| **Backend** | Node.js, Express.js, CORS, Dotenv, JWT Authentication |
| **Database** | MongoDB (Mongoose Schema) with seamless **JSON File Storage fallback (`SimpleFileStore`)** |

> 💡 **Seamless Database Fallback**: If a local MongoDB daemon is not running, AuraFit automatically fallback-seeds and saves all records into JSON files inside `backend/data/*.json` without crashing or interrupting application execution!

---

## 📁 Directory Structure

```
fitness-tracker/
├── backend/
│   ├── data/                 # Auto-generated JSON database fallback files
│   ├── middleware/
│   │   └── auth.js           # JWT Authorization Middleware
│   ├── models/
│   │   ├── User.js           # User Profile & Macro Targets Schema
│   │   ├── Workout.js        # Date-Wise Workout Sessions Schema
│   │   ├── FoodLog.js        # Date-Wise Diet & Meals Schema
│   │   └── Goal.js           # Daily/Weekly/Monthly Goals Target Schema
│   ├── routes/
│   │   ├── authRoutes.js     # Auth, Register, Login, Demo Account Routes
│   │   ├── workoutRoutes.js  # Workout CRUD & Aggregated Summary Routes
│   │   ├── dietRoutes.js     # Diet & Food Log Routes
│   │   ├── goalRoutes.js     # Goal Target Management Routes
│   │   └── analyticsRoutes.js# Visual Analytics Summary Routes
│   ├── db.js                 # Mongo + File Database Dual Connection
│   ├── server.js             # Express Server Entry Point (Port 5000)
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx               # Left Navigation Sidebar
    │   │   ├── Header.jsx                # Top Action & Account Bar
    │   │   ├── Dashboard.jsx             # Main Overview Dashboard & Widgets
    │   │   ├── WorkoutLogger.jsx         # Date-Wise Workout Logging & Filters
    │   │   ├── GoalTracker.jsx           # Daily/Weekly/Monthly Goal Progress
    │   │   ├── DietTracker.jsx           # Date-Wise Calorie & Macro Counter
    │   │   ├── AnalyticsView.jsx         # Recharts Visual Performance Graphs
    │   │   ├── ProfileView.jsx           # BMR/TDEE Metabolic Calculator
    │   │   ├── LoginPage.jsx             # Full-Screen Welcome & Entry Page
    │   │   ├── AuthModal.jsx             # Register & Login Modal
    │   │   ├── AccountSwitcherModal.jsx  # Demo Profile Account Switcher
    │   │   ├── CelebrationModal.jsx      # Confetti Particle Toast Notification
    │   │   └── RestTimerModal.jsx        # Interval Rest Timer
    │   ├── App.jsx                       # Core React State & Router Logic
    │   ├── index.css                     # Design Tokens & Glassmorphism Theme
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js                    # Vite Dev Server Config (Proxy to :5000)
    └── package.json
```

---

## 🚀 Getting Started Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- `npm` (v9.0.0 or higher)
- Optional: MongoDB installed locally or MongoDB Atlas connection string.

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/fitness-tracker.git
cd fitness-tracker
```

---

### Step 2: Set Up & Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start Express backend API server
node server.js
```
The backend API server will run on:
👉 **`http://localhost:5000`**

---

### Step 3: Set Up & Start the Frontend Web App

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server on Port 3000
npx vite --host --port 3000
```
The frontend web application will run on:
👉 **`http://localhost:3000`**

---

## 💻 Running via VS Code

To run both Backend and Frontend easily in VS Code:

1. Open VS Code in the root folder (`fitness-tracker`).
2. Open **Terminal 1**:
   ```bash
   cd backend
   node server.js
   ```
3. Open **Terminal 2**:
   ```bash
   cd frontend
   npx vite --host --port 3000
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---

## 📡 API Endpoint Reference

### 🔐 Auth & Users (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/auth/profile` | Get logged-in user profile & metrics |
| `PUT` | `/api/auth/profile` | Update physical metrics (height, weight, goals) |
| `GET` | `/api/auth/demo-accounts` | List pre-populated demo user profiles |
| `POST` | `/api/auth/switch-account` | Switch active user profile |

---

### 🏋️ Workouts (`/api/workouts`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/workouts` | Fetch date-wise workout history |
| `POST` | `/api/workouts` | Log a new workout session |
| `PUT` | `/api/workouts/:id` | Edit workout session details |
| `DELETE` | `/api/workouts/:id` | Remove a workout record |

---

### 🥗 Diet & Nutrition (`/api/diet`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/diet` | Fetch food logs & total macros (optional `?date=YYYY-MM-DD`) |
| `POST` | `/api/diet` | Log a new food item |
| `DELETE` | `/api/diet/:id` | Delete a food log entry |
| `GET` | `/api/diet/plans` | Fetch integrated diet plans |

---

### 🎯 Goals & Targets (`/api/goals`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/goals` | Fetch user's daily, weekly, and monthly goal targets |
| `PUT` | `/api/goals` | Update daily, weekly, and monthly workout targets |

---

## 🎨 Design System

AuraFit uses a high-end Dark Glassmorphism design system built with custom CSS tokens:

```css
--bg-dark: #050a14;
--bg-card: rgba(17, 24, 39, 0.7);
--border-glass: rgba(255, 255, 255, 0.08);
--accent-emerald: #10b981;
--accent-cyan: #06b6d4;
--accent-violet: #8b5cf6;
--accent-amber: #f59e0b;
```

---

## 📄 License
This project is licensed under the **MIT License**.

Developed with ❤️ for health tech and fitness performance tracking.
