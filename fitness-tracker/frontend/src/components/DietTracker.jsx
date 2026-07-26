import React, { useState } from 'react';
import { Utensils, Plus, Trash2, PieChart, Check, Sparkles, BookOpen, Calendar, Search } from 'lucide-react';

export default function DietTracker({ foodData, onAddFoodLog, onDeleteFoodLog, dietPlans, user }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [mealType, setMealType] = useState('Breakfast');
  const [foodName, setFoodName] = useState('');
  const [servingSize, setServingSize] = useState('1 serving');
  const [calories, setCalories] = useState(350);
  const [proteinGrams, setProteinGrams] = useState(25);
  const [carbsGrams, setCarbsGrams] = useState(40);
  const [fatGrams, setFatGrams] = useState(10);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlan, setActivePlan] = useState('high-protein');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleOpenAdd = (defaultDate = null) => {
    setDate(defaultDate || selectedDateFilter || todayStr);
    setFoodName('');
    setCalories(350);
    setProteinGrams(25);
    setCarbsGrams(40);
    setFatGrams(10);
    setMealType('Breakfast');
    setShowAddModal(true);
  };

  const handleSaveFood = (e) => {
    e.preventDefault();
    if (!foodName || !calories) return;

    onAddFoodLog({
      date: date || todayStr,
      mealType,
      foodName,
      servingSize,
      calories: Number(calories),
      proteinGrams: Number(proteinGrams || 0),
      carbsGrams: Number(carbsGrams || 0),
      fatGrams: Number(fatGrams || 0)
    });

    setShowAddModal(false);
    setFoodName('');
  };

  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  // Filter logs by date or search
  const allLogs = foodData?.logs || [];
  const filteredLogs = allLogs.filter(l => {
    if (selectedDateFilter && l.date !== selectedDateFilter) return false;
    if (searchQuery && !l.foodName.toLowerCase().includes(searchQuery.toLowerCase()) && !l.mealType.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Group logs DATE-WISE
  const groupedByDate = {};
  filteredLogs.forEach(l => {
    const d = l.date || todayStr;
    if (!groupedByDate[d]) groupedByDate[d] = [];
    groupedByDate[d].push(l);
  });

  // If empty and no logs match, ensure today is present
  if (Object.keys(groupedByDate).length === 0 && !selectedDateFilter && !searchQuery) {
    groupedByDate[todayStr] = [];
  }

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  // Compute overall or filtered totals
  const totals = filteredLogs.reduce((acc, item) => {
    acc.calories += Number(item.calories || 0);
    acc.proteinGrams += Number(item.proteinGrams || 0);
    acc.carbsGrams += Number(item.carbsGrams || 0);
    acc.fatGrams += Number(item.fatGrams || 0);
    return acc;
  }, { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 });

  const targetCal = user?.dailyCalorieTarget || 2400;
  const targetProtein = user?.targetProteinGrams || 160;
  const targetCarbs = user?.targetCarbsGrams || 220;
  const targetFat = user?.targetFatGrams || 65;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Date-Wise Diet & Calorie Counter</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Log meals for any date, track macronutrients, and monitor daily calorie budgets.</p>
        </div>

        <button onClick={() => handleOpenAdd()} className="btn-primary">
          <Plus size={18} /> Log Meal / Food Item
        </button>
      </div>

      {/* Date & Search Bar */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="form-input"
            placeholder="Search meals, food items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        {/* Date Filter Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#10b981" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Filter Date:</span>
          <input
            type="date"
            className="form-input"
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
          />
          {selectedDateFilter && (
            <button onClick={() => setSelectedDateFilter('')} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Macro Totals Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Protein</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>{totals.proteinGrams} / {targetProtein}g</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (totals.proteinGrams / targetProtein) * 100)}%`, height: '100%', background: '#10b981' }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Carbohydrates</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#06b6d4' }}>{totals.carbsGrams} / {targetCarbs}g</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (totals.carbsGrams / targetCarbs) * 100)}%`, height: '100%', background: '#06b6d4' }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Fats</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#8b5cf6' }}>{totals.fatGrams} / {targetFat}g</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (totals.fatGrams / targetFat) * 100)}%`, height: '100%', background: '#8b5cf6' }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Calories</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f59e0b' }}>{totals.calories} / {targetCal} kcal</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (totals.calories / targetCal) * 100)}%`, height: '100%', background: '#f59e0b' }} />
          </div>
        </div>
      </div>

      {/* Date-Wise Food Logs Section */}
      {sortedDates.map(dateKey => {
        const dayLogs = groupedByDate[dateKey] || [];
        const dayCals = dayLogs.reduce((acc, l) => acc + (l.calories || 0), 0);
        const dayProtein = dayLogs.reduce((acc, l) => acc + (l.proteinGrams || 0), 0);
        const dayCarbs = dayLogs.reduce((acc, l) => acc + (l.carbsGrams || 0), 0);
        const dayFat = dayLogs.reduce((acc, l) => acc + (l.fatGrams || 0), 0);

        const dObj = new Date(dateKey + 'T00:00:00');
        const dateLabel = isNaN(dObj.getTime())
          ? dateKey
          : dObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

        const isToday = dateKey === todayStr;

        return (
          <div key={dateKey} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Date Section Header */}
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '12px 18px',
              borderRadius: '12px',
              background: isToday ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.18), rgba(6, 182, 212, 0.1))' : 'rgba(255, 255, 255, 0.03)',
              border: isToday ? '1px solid #10b981' : '1px solid var(--border-glass)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={18} color={isToday ? '#10b981' : '#06b6d4'} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: isToday ? '#34d399' : '#f3f4f6' }}>
                  {dateLabel} {isToday && <span className="badge badge-emerald" style={{ marginLeft: '8px' }}>TODAY</span>}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem' }}>
                <span style={{ color: '#f59e0b', fontWeight: '700' }}>{dayCals} kcal</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>P: {dayProtein}g</span>
                <span style={{ color: '#06b6d4', fontWeight: '600' }}>C: {dayCarbs}g</span>
                <span style={{ color: '#8b5cf6', fontWeight: '600' }}>F: {dayFat}g</span>

                <button
                  onClick={() => handleOpenAdd(dateKey)}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem', marginLeft: '6px' }}
                >
                  + Add to Date
                </button>
              </div>
            </div>

            {/* Meals Grid for this Date */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {meals.map(meal => {
                const mealLogs = dayLogs.filter(l => l.mealType === meal);
                const mealCals = mealLogs.reduce((acc, l) => acc + (l.calories || 0), 0);

                return (
                  <div key={meal} className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f3f4f6' }}>{meal}</h4>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#10b981' }}>{mealCals} kcal</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '60px' }}>
                      {mealLogs.length === 0 ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>No items logged for {meal}.</span>
                      ) : (
                        mealLogs.map(item => (
                          <div key={item._id} style={{
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '8px 10px',
                            borderRadius: '8px'
                          }}>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{item.foodName}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {item.servingSize} • P: {item.proteinGrams}g • C: {item.carbsGrams}g • F: {item.fatGrams}g
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#06b6d4' }}>{item.calories} kcal</span>
                              <button onClick={() => onDeleteFoodLog(item._id)} className="btn-danger" style={{ padding: '3px' }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Integrated Diet Plans Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} color="#10b981" /> Integrated Diet Plans
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {dietPlans.map(plan => {
            const isSelected = activePlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setActivePlan(plan.id)}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid #10b981' : '1px solid var(--border-glass)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: isSelected ? '#34d399' : '#f3f4f6' }}>{plan.name}</h4>
                  {isSelected && <Check size={18} color="#10b981" />}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{plan.description}</p>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
                  <span className="badge badge-emerald">Protein {plan.macrosRatio.protein}%</span>
                  <span className="badge badge-cyan">Carbs {plan.macrosRatio.carbs}%</span>
                  <span className="badge badge-violet">Fat {plan.macrosRatio.fat}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px' }}>Log Food Item</h3>
            <form onSubmit={handleSaveFood} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📅 Meal Date</label>
                <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Meal Type</label>
                <select className="form-input" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                  {meals.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Food / Recipe Name</label>
                <input className="form-input" placeholder="e.g. Grilled Salmon Filet with Quinoa" value={foodName} onChange={(e) => setFoodName(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Serving Portion</label>
                  <input className="form-input" value={servingSize} onChange={(e) => setServingSize(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Total Calories (kcal)</label>
                  <input type="number" className="form-input" value={calories} onChange={(e) => setCalories(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Protein (g)</label>
                  <input type="number" className="form-input" value={proteinGrams} onChange={(e) => setProteinGrams(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Carbs (g)</label>
                  <input type="number" className="form-input" value={carbsGrams} onChange={(e) => setCarbsGrams(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Fats (g)</label>
                  <input type="number" className="form-input" value={fatGrams} onChange={(e) => setFatGrams(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Log Food Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
