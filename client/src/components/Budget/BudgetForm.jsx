import { useState, useEffect } from 'react';

const BudgetForm = ({ onSave, existingBudget }) => {
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalBudget: '',
    alertThreshold: 80,
    categoryBudgets: {
      Food: '',
      Rent: '',
      Transport: '',
      Shopping: '',
      Subscriptions: '',
      Entertainment: '',
      Healthcare: '',
      Utilities: '',
      Others: '',
    },
  });

  useEffect(() => {
    if (existingBudget) {
      setFormData({
        month: existingBudget.month,
        year: existingBudget.year,
        totalBudget: existingBudget.totalBudget,
        alertThreshold: existingBudget.alertThreshold,
        categoryBudgets: existingBudget.categoryBudgets,
      });
    }
  }, [existingBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  const handleCategoryChange = (category, value) => {
    setFormData({
      ...formData,
      categoryBudgets: {
        ...formData.categoryBudgets,
        [category]: value,
      },
    });
  };

  const categories = ['Food', 'Rent', 'Transport', 'Shopping', 'Subscriptions', 'Entertainment', 'Healthcare', 'Utilities', 'Others'];

  return (
    <div className="card">
      <h2>{existingBudget ? 'Update Budget' : 'Set Budget'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Month</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
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
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Total Monthly Budget ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.totalBudget}
              onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
              required
              style={styles.input}
              placeholder="0.00"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Alert Threshold (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.alertThreshold}
              onChange={(e) => setFormData({ ...formData, alertThreshold: parseInt(e.target.value) })}
              style={styles.input}
            />
          </div>
        </div>

        <h3 style={styles.subtitle}>Category Budgets (Optional)</h3>
        <div style={styles.categoryGrid}>
          {categories.map((category) => (
            <div key={category} style={styles.formGroup}>
              <label style={styles.label}>{category}</label>
              <input
                type="number"
                step="0.01"
                value={formData.categoryBudgets[category]}
                onChange={(e) => handleCategoryChange(category, e.target.value)}
                style={styles.input}
                placeholder="0.00"
              />
            </div>
          ))}
        </div>

        <button type="submit" style={styles.button}>
          {existingBudget ? 'Update Budget' : 'Save Budget'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
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
  subtitle: {
    color: '#2c3e50',
    marginTop: '1.5rem',
    marginBottom: '1rem',
    borderBottom: '2px solid #3498db',
    paddingBottom: '0.5rem',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '1rem',
  },
};

export default BudgetForm;