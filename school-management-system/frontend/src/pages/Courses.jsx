import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', credits: 3 });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch {
      setError('Failed to load courses');
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await api.post('/courses', form);
      setMessage('Course created!');
      setForm({ title: '', description: '', credits: 3 });
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch {
      setError('Failed to delete course');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '24px' }}>Courses</h2>
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {message && <p style={{ color: '#22c55e' }}>{message}</p>}

        {user?.role === 'ADMIN' && (
          <form onSubmit={handleCreate} style={{ background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>Create new course</h3>
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }} />
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }} />
            <input type="number" placeholder="Credits" value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }} />
            <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer' }}>
              Create course
            </button>
          </form>
        )}

        <div style={{ display: 'grid', gap: '16px' }}>
          {courses.map(course => (
            <div key={course.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: '#1e293b', margin: '0 0 4px' }}>{course.title}</h4>
                <p style={{ color: '#64748b', margin: '0 0 4px', fontSize: '14px' }}>{course.description}</p>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{course.credits} credits — {course.enrollments?.length} enrolled</span>
              </div>
              {user?.role === 'ADMIN' && (
                <button onClick={() => handleDelete(course.id)}
                  style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}