import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { Link, Navigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Login - The Night's Decree";
  }, []);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/board" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div className="container auth-container">
      <div className="form-container">
        <h2 className="auth-title">Enter the Crypt(Login)</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
        </form>
        <p className="auth-footer">
          Not a member? <Link to="/register" className="auth-link">Join here</Link>
        </p>
      </div>
    </div>
  );
}
