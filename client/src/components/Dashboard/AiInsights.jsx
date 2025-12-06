import { useState } from 'react';
import API from '../../utils/api';

const AiInsights = ({ analysis, onGenerate }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await onGenerate();
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>AI Financial Insights</h2>
      
      {!analysis ? (
        <div style={styles.noData}>
          <p>No AI analysis available for this month</p>
          <button onClick={handleGenerate} disabled={loading} style={styles.button}>
            {loading ? 'Generating...' : 'Generate AI Analysis'}
          </button>
        </div>
      ) : (
        <div>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Summary</h3>
            <p>{analysis.summary}</p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Top Spending Categories</h3>
            <ul style={styles.list}>
              {analysis.topCategories?.slice(0, 3).map((cat, index) => (
                <li key={index}>
                  <strong>{cat.category}</strong>: ${cat.amount?.toFixed(2)} ({cat.percentage}%)
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Areas to Improve</h3>
            <ul style={styles.list}>
              {analysis.areasToImprove?.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Saving Tips</h3>
            <ul style={styles.list}>
              {analysis.savingTips?.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          <div style={styles.goalBox}>
            <strong>Suggested Monthly Saving Goal:</strong> ${analysis.suggestedMonthlySavingGoal || 0}
          </div>

          <button onClick={handleGenerate} disabled={loading} style={styles.refreshButton}>
            {loading ? 'Regenerating...' : 'Regenerate Analysis'}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  noData: {
    textAlign: 'center',
    padding: '2rem',
    color: '#7f8c8d',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    color: '#2c3e50',
    fontSize: '1.1rem',
    marginBottom: '0.75rem',
    borderBottom: '2px solid #3498db',
    paddingBottom: '0.5rem',
  },
  list: {
    listStylePosition: 'inside',
    color: '#34495e',
    lineHeight: '1.8',
  },
  goalBox: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '1.1rem',
    marginTop: '1rem',
  },
  button: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
  },
  refreshButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default AiInsights;