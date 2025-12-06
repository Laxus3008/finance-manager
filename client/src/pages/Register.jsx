import { Link } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';

const Register = () => {
  return (
    <div>
      <RegisterForm />
      <div style={styles.linkContainer}>
        <p style={styles.text}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
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

export default Register;