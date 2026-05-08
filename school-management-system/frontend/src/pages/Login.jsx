import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', width: '360px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>Sign in</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            Login
          </button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center', color: '#64748b' }}>
          No account? <Link to="/register" style={{ color: '#3b82f6' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}