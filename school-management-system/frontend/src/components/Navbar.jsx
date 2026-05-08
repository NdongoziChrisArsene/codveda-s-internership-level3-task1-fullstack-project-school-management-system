import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#1e293b', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/dashboard" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none', fontSize: '18px' }}>
        SchoolMS
      </Link>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/courses" style={{ color: '#94a3b8', textDecoration: 'none' }}>Courses</Link>
        <Link to="/enrollments" style={{ color: '#94a3b8', textDecoration: 'none' }}>Enrollments</Link>
        {user?.role === 'ADMIN' && (
          <Link to="/users" style={{ color: '#94a3b8', textDecoration: 'none' }}>Users</Link>
        )}
        <span style={{ color: '#64748b', fontSize: '13px' }}>{user?.firstName} ({user?.role})</span>
        <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}