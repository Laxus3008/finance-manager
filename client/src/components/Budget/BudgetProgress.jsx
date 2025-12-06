const BudgetProgress = ({ budget, spending }) => {
  if (!budget) return null;

  const totalPercentage = (spending.total / budget.totalBudget) * 100;

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#e74c3c';
    if (percentage >= budget.alertThreshold) return '#f39c12';
    return '#2ecc71';
  };

  const categories = Object.keys(budget.categoryBudgets).filter(
    (cat) => budget.categoryBudgets[cat] > 0
  );

  return (
    <div className="card">
      <h2>Budget Progress</h2>
      
      {/* Total Budget Progress */}
      <div style={styles.progressSection}>
        <div style={styles.progressHeader}>
          <h3 style={styles.categoryName}>Total Budget</h3>
          <span style={styles.amounts}>
            ${spending.total.toFixed(2)} / ${budget.totalBudget.toFixed(2)}
          </span>
        </div>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${Math.min(totalPercentage, 100)}%`,
              backgroundColor: getProgressColor(totalPercentage),
            }}
          >
            <span style={styles.progressText}>{totalPercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Category Budgets Progress */}
      {categories.length > 0 && (
        <>
          <h3 style={styles.subtitle}>Category Budgets</h3>
          {categories.map((category) => {
            const categorySpent = spending.byCategory[category] || 0;
            const categoryBudget = budget.categoryBudgets[category];
            const categoryPercentage = (categorySpent / categoryBudget) * 100;

            return (
              <div key={category} style={styles.progressSection}>
                <div style={styles.progressHeader}>
                  <span style={styles.categoryName}>{category}</span>
                  <span style={styles.amounts}>
                    ${categorySpent.toFixed(2)} / ${categoryBudget.toFixed(2)}
                  </span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${Math.min(categoryPercentage, 100)}%`,
                      backgroundColor: getProgressColor(categoryPercentage),
                    }}
                  >
                    <span style={styles.progressText}>
                      {categoryPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

const styles = {
  progressSection: {
    marginBottom: '1.5rem',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  categoryName: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  amounts: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  progressBar: {
    width: '100%',
    height: '30px',
    backgroundColor: '#ecf0f1',
    borderRadius: '15px',
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.3s ease',
    minWidth: '50px',
  },
  progressText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
  subtitle: {
    color: '#2c3e50',
    marginTop: '1.5rem',
    marginBottom: '1rem',
    borderBottom: '2px solid #3498db',
    paddingBottom: '0.5rem',
  },
};

export default BudgetProgress;