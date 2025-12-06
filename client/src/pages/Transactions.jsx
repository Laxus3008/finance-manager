import { useState, useEffect } from 'react';
import API from '../utils/api';
import TransactionForm from '../components/Transactions/TransactionForm';
import TransactionList from '../components/Transactions/TransactionList';
import CSVUpload from '../components/Transactions/CSVUpload';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.category) params.append('category', filters.category);

      const { data } = await API.get(`/transactions?${params.toString()}`);
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      await API.post('/transactions', formData);
      fetchTransactions();
      alert('Transaction added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add transaction');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
      alert('Transaction deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const handleCSVUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await API.post('/transactions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      fetchTransactions();
      alert(data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload CSV');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchTransactions();
  };

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '', category: '' });
    setTimeout(() => fetchTransactions(), 100);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  const categories = ['Food', 'Rent', 'Transport', 'Shopping', 'Subscriptions', 'Entertainment', 'Healthcare', 'Utilities', 'Others'];

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Transactions</h1>

      <div className="grid grid-2">
        <TransactionForm onAdd={handleAdd} />
        <CSVUpload onUpload={handleCSVUpload} />
      </div>

      {/* Filters */}
      <div className="card">
        <h3>Filter Transactions</h3>
        <div style={styles.filterGrid}>
          <div>
            <label style={styles.label}>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              style={styles.input}
            />
          </div>
          <div>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              style={styles.input}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={styles.buttonGroup}>
          <button onClick={applyFilters} style={styles.applyBtn}>
            Apply Filters
          </button>
          <button onClick={clearFilters} style={styles.clearBtn}>
            Clear Filters
          </button>
        </div>
      </div>

      <TransactionList transactions={transactions} onDelete={handleDelete} />
    </div>
  );
};

const styles = {
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#34495e',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  applyBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  clearBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default Transactions;