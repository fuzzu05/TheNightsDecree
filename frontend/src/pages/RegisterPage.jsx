import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Link, Navigate } from 'react-router-dom';

export default function RegisterPage() {
  const { register, user } = useContext(AuthContext);
  const [colleges, setColleges] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    college_id: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Join the Damned - The Night's Decree";
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/colleges`)
      .then(res => res.json())
      .then(data => {
        setColleges(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, college_id: data[0].id }));
      });
  }, []);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/board" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(formData);
    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div className="container auth-container-wide">
      <div className="form-container">
        <h2 className="auth-title">Join the Coven</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher / Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>College / Academy</label>
            <select 
              value={formData.college_id} 
              onChange={e => setFormData({...formData, college_id: e.target.value})}
            >
              {colleges.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
        </form>
        <p className="auth-footer">
          Already immortal? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
}
