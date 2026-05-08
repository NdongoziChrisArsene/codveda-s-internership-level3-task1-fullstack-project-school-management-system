import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();

  const permissions = {
    ADMIN: ['Manage all users', 'Create and delete courses', 'Enroll any student', 'Assign grades'],
    TEACHER: ['View all courses', 'View enrollments', 'Assign grades to students'],
    STUDENT: ['View available courses', 'Enroll in courses', 'View your grades'],
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#1e293b' }}>Welcome, {user?.firstName}!</h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Role: <strong>{user?.role}</strong></p>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '16px' }}>Your permissions</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {permissions[user?.role]?.map((p, i) => (
              <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}