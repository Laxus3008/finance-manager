import { useState } from 'react';

const CSVUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    await onUpload(file);
    setFile(null);
    setLoading(false);
    e.target.reset();
  };

  return (
    <div className="card">
      <h2>Upload CSV</h2>
      <p style={styles.info}>
        Upload a CSV file with columns: date, description, amount
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.fileInput}
        />
        <button type="submit" disabled={!file || loading} style={styles.button}>
          {loading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  info: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  fileInput: {
    flex: 1,
    padding: '0.5rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};

export default CSVUpload;