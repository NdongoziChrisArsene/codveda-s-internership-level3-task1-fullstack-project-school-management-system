import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'STUDENT' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', width: '380px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>Create account</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {['firstName', 'lastName', 'email', 'password'].map(field => (
            <input key={field} type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }} />
          ))}
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }}>
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            Register
          </button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center', color: '#64748b' }}>
          Have account? <Link to="/login" style={{ color: '#3b82f6' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}