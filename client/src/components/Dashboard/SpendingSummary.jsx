const SpendingSummary = ({ summary }) => {
  if (!summary) return <div>Loading...</div>;

  return (
    <div className="card">
      <h2>Spending Summary</h2>
      <div style={styles.summaryGrid}>
        <div style={styles.summaryItem}>
          <h3 style={styles.label}>Total Spending</h3>
          <p style={styles.amount}>${summary.totalSpending?.toFixed(2) || '0.00'}</p>
        </div>
        <div style={styles.summaryItem}>
          <h3 style={styles.label}>Total Income</h3>
          <p style={{ ...styles.amount, color: '#2ecc71' }}>
            ${summary.totalIncome?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div style={styles.summaryItem}>
          <h3 style={styles.label}>Transactions</h3>
          <p style={styles.amount}>{summary.transactionCount || 0}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  summaryItem: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
  },
  label: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    marginBottom: '0.5rem',
  },
  amount: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#e74c3c',
  },
};

export default SpendingSummary;