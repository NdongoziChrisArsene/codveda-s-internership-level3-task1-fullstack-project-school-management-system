import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Enrollments() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [e, c] = await Promise.all([api.get('/enrollments'), api.get('/courses')]);
      setEnrollments(e.data);
      setCourses(c.data);
    } catch { setError('Failed to load data'); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await api.post('/enrollments', { courseId: Number(courseId) });
      setMessage('Enrolled successfully!');
      setCourseId('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to enroll');
    }
  };

  const handleGrade = async (id, grade) => {
    try {
      await api.patch(`/enrollments/${id}/grade`, { grade });
      fetchData();
    } catch { setError('Failed to assign grade'); }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '24px' }}>Enrollments</h2>
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {message && <p style={{ color: '#22c55e' }}>{message}</p>}

        {['ADMIN', 'STUDENT'].includes(user?.role) && (
          <form onSubmit={handleEnroll} style={{ background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>Enroll in a course</h3>
            <select value={courseId} onChange={e => setCourseId(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }}>
              <option value="">Select a course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>
              Enroll
            </button>
          </form>
        )}

        <div style={{ display: 'grid', gap: '16px' }}>
          {enrollments.map(en => (
            <div key={en.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: '#1e293b', margin: '0 0 4px' }}>{en.course?.title}</h4>
                <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>{en.user?.firstName} {en.user?.lastName}</p>
                <span style={{ fontSize: '13px', background: en.grade ? '#dcfce7' : '#f1f5f9', color: en.grade ? '#16a34a' : '#94a3b8', padding: '2px 10px', borderRadius: '20px' }}>
                  {en.grade ? `Grade: ${en.grade}` : 'No grade yet'}
                </span>
              </div>
              {['ADMIN', 'TEACHER'].includes(user?.role) && (
                <select onChange={e => handleGrade(en.id, e.target.value)} defaultValue=""
                  style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <option value="" disabled>Assign grade</option>
                  {['A', 'B', 'C', 'D', 'F'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}