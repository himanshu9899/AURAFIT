import React, { useState } from 'react';
import { User, Activity, Target, Save, Calculator, Droplets, Flame, Scale } from 'lucide-react';

export default function ProfileView({ user, onUpdateProfile }) {
  const [name, setName] = useState(user?.name || 'Alex Johnson');
  const [age, setAge] = useState(user?.age || 28);
  const [gender, setGender] = useState(user?.gender || 'male');
  const [heightCm, setHeightCm] = useState(user?.heightCm || 178);
  const [weightKg, setWeightKg] = useState(user?.weightKg || 75.5);
  const [targetWeightKg, setTargetWeightKg] = useState(user?.targetWeightKg || 72.0);
  const [fitnessGoal, setFitnessGoal] = useState(user?.fitnessGoal || 'Muscle Gain & Calorie Deficit');
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || 'Moderately Active');

  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(user?.dailyCalorieTarget || 2400);
  const [dailyWaterMlTarget, setDailyWaterMlTarget] = useState(user?.dailyWaterMlTarget || 3000);
  const [targetProteinGrams, setTargetProteinGrams] = useState(user?.targetProteinGrams || 160);
  const [targetCarbsGrams, setTargetCarbsGrams] = useState(user?.targetCarbsGrams || 220);
  const [targetFatGrams, setTargetFatGrams] = useState(user?.targetFatGrams || 65);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const heightM = Number(heightCm) / 100;
  const bmi = heightM > 0 ? (Number(weightKg) / (heightM * heightM)).toFixed(1) : 0;

  const getBmiCategory = (val) => {
    if (val < 18.5) return { text: 'Underweight', color: '#06b6d4' };
    if (val < 24.9) return { text: 'Normal Weight', color: '#10b981' };
    if (val < 29.9) return { text: 'Overweight', color: '#f59e0b' };
    return { text: 'Obese', color: '#f43f5e' };
  };
  const bmiCat = getBmiCategory(Number(bmi));

  let bmr = 10 * Number(weightKg) + 6.25 * Number(heightCm) - 5 * Number(age);
  bmr = gender === 'male' ? Math.round(bmr + 5) : Math.round(bmr - 161);

  const activityMultipliers = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725
  };
  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      age: Number(age),
      gender,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      targetWeightKg: Number(targetWeightKg),
      fitnessGoal,
      activityLevel,
      dailyCalorieTarget: Number(dailyCalorieTarget),
      dailyWaterMlTarget: Number(dailyWaterMlTarget),
      targetProteinGrams: Number(targetProteinGrams),
      targetCarbsGrams: Number(targetCarbsGrams),
      targetFatGrams: Number(targetFatGrams)
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>User Profile & Fitness Targets</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Personalize physical metrics, target weight, macro ratio, and calculate live TDEE.</p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', borderRadius: '12px', fontWeight: '700' }}>
          ✓ Profile settings and daily targets updated successfully!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Scale size={16} color="#10b981" /> Body Mass Index (BMI)
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '4px' }}>{bmi}</h3>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: bmiCat.color }}>{bmiCat.text}</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calculator size={16} color="#06b6d4" /> Basal Metabolic Rate (BMR)
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '4px' }}>{bmr} <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>kcal</span></h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Baseline burn at rest</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={16} color="#f59e0b" /> Daily TDEE Expenditure
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f59e0b', marginTop: '4px' }}>{tdee} <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>kcal</span></h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Based on {activityLevel}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f3f4f6', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
            Physical Metrics & Goals
          </h3>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Age</label>
              <input type="number" className="form-input" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Gender</label>
              <select className="form-input" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Height (cm)</label>
              <input type="number" className="form-input" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Weight (kg)</label>
              <input type="number" step="0.1" className="form-input" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target (kg)</label>
              <input type="number" step="0.1" className="form-input" value={targetWeightKg} onChange={(e) => setTargetWeightKg(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Primary Fitness Goal</label>
            <select className="form-input" value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
              <option value="Muscle Gain & Calorie Deficit">Muscle Gain & Calorie Deficit</option>
              <option value="Weight Loss & Fat Burn">Weight Loss & Fat Burn</option>
              <option value="Endurance & Cardiorespiratory">Endurance & Cardiorespiratory</option>
              <option value="Body Recomposition & Maintenance">Body Recomposition & Maintenance</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Activity Level</label>
            <select className="form-input" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
              <option value="Sedentary">Sedentary (Little or no exercise)</option>
              <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
              <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
              <option value="Very Active">Very Active (6-7 days heavy training)</option>
            </select>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f3f4f6', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
            Calorie & Macro Budget Targets
          </h3>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Daily Calorie Goal (kcal)</label>
            <input type="number" className="form-input" value={dailyCalorieTarget} onChange={(e) => setDailyCalorieTarget(e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Daily Water Target (ml)</label>
            <input type="number" className="form-input" value={dailyWaterMlTarget} onChange={(e) => setDailyWaterMlTarget(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Protein (g)</label>
              <input type="number" className="form-input" value={targetProteinGrams} onChange={(e) => setTargetProteinGrams(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Carbs (g)</label>
              <input type="number" className="form-input" value={targetCarbsGrams} onChange={(e) => setTargetCarbsGrams(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Fats (g)</label>
              <input type="number" className="form-input" value={targetFatGrams} onChange={(e) => setTargetFatGrams(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 'auto', padding: '14px', justifyContent: 'center' }}>
            <Save size={18} /> Save & Apply Targets
          </button>
        </div>
      </form>
    </div>
  );
}
