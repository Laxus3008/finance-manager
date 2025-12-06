const TransactionList = ({ transactions, onDelete }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <h2>Transactions</h2>
        <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '2rem' }}>
          No transactions found
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Transactions ({transactions.length})</h2>
      <div style={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>
                  <span style={styles.categoryBadge}>{transaction.category}</span>
                </td>
                <td>
                  <span style={transaction.type === 'expense' ? styles.expenseBadge : styles.incomeBadge}>
                    {transaction.type}
                  </span>
                </td>
                <td style={transaction.type === 'expense' ? styles.expenseAmount : styles.incomeAmount}>
                  ${transaction.amount.toFixed(2)}
                </td>
                <td>
                  <button
                    onClick={() => onDelete(transaction._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  tableContainer: {
    overflowX: 'auto',
    marginTop: '1rem',
  },
  categoryBadge: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
  },
  expenseBadge: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    textTransform: 'capitalize',
  },
  incomeBadge: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    textTransform: 'capitalize',
  },
  expenseAmount: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
};

export default TransactionList;