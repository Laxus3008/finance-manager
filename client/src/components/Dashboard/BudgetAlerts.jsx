const BudgetAlerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="card">
        <h2>Budget Alerts</h2>
        <div style={styles.successAlert}>
          <p>✓ All budgets are on track!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Budget Alerts</h2>
      <div style={styles.alertsList}>
        {alerts.map((alert, index) => (
          <div
            key={index}
            style={alert.type === 'danger' ? styles.dangerAlert : styles.warningAlert}
          >
            <strong>{alert.category || 'Budget'}</strong>: {alert.message}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  dangerAlert: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '1rem',
    borderRadius: '4px',
  },
  warningAlert: {
    backgroundColor: '#f39c12',
    color: '#fff',
    padding: '1rem',
    borderRadius: '4px',
  },
  successAlert: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    textAlign: 'center',
  },
};

export default BudgetAlerts;