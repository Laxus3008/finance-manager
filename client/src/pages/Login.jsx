import { Link } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';

const Login = () => {
  return (
    <div>
      <LoginForm />
      <div style={styles.linkContainer}>
        <p style={styles.text}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  linkContainer: {
    textAlign: 'center',
    marginTop: '1rem',
  },
  text: {
    color: '#7f8c8d',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default Login;