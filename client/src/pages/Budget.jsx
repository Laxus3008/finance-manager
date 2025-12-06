import { useState, useEffect } from 'react';
import API from '../utils/api';
import BudgetForm from '../components/Budget/BudgetForm';
import BudgetProgress from '../components/Budget/BudgetProgress';

const Budget = () => {
  const [budget, setBudget] = useState(null);
  const [spending, setSpending] = useState({ total: 0, byCategory: {} });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchBudgetData();
  }, [selectedMonth, selectedYear]);

  const fetchBudgetData = async () => {
    try {
      // Fetch budget
      try {
        const budgetRes = await API.get(`/budgets?month=${selectedMonth}&year=${selectedYear}`);
        setBudget(budgetRes.data.budget);
        setSpending(budgetRes.data.spending);
      } catch (err) {
        // No budget exists yet
        setBudget(null);
        
        // Fetch spending summary
        const summaryRes = await API.get(`/transactions/summary?month=${selectedMonth}&year=${selectedYear}`);
        setSpending({
          total: summaryRes.data.totalSpending || 0,
          byCategory: summaryRes.data.categoryTotals || {},
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching budget data:', error);
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      await API.post('/budgets', formData);
      alert('Budget saved successfully!');
      fetchBudgetData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save budget');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Budget Management</h1>

      {/* Month/Year Selector */}
      <div className="card">
        <h3>Select Period</h3>
        <div style={styles.selectorRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={styles.input}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Year</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      {budget && <BudgetProgress budget={budget} spending={spending} />}

      <BudgetForm onSave={handleSave} existingBudget={budget} />
    </div>
  );
};

const styles = {
  selectorRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '1rem',
    maxWidth: '500px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    color: '#34495e',
    fontWeight: '500',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
};

export default Budget;