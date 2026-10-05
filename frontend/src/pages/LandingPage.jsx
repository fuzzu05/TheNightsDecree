import React, { useContext, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    document.title = "Home - College Notice Board";
  }, []);

  // If already logged in, no need to see the landing page
  if (user) {
    return <Navigate to="/board" replace />;
  }

  return (
    <div className="landing-container">
      <header className="header landing-header">
        <h1 className="landing-title">College Notice Board</h1>
        <p className="landing-subtitle">
          The Ultimate Platform for Students & Faculty
        </p>
      </header>

      <div className="landing-buttons">
        <Link to="/login" className="btn btn-large">
          Login
        </Link>
        <Link to="/register" className="btn btn-large btn-outline">
          Register
        </Link>
      </div>
    </div>
  );
}
