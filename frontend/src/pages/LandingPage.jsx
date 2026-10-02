import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  // If already logged in, no need to see the landing page
  if (user) {
    return <Navigate to="/board" replace />;
  }

  return (
    <div className="landing-container">
      <header className="header landing-header">
        <h1 className="landing-title">Night's Decree</h1>
        <p className="landing-subtitle">
          The Ultimate Platform for Immortal Academics
        </p>
      </header>

      <div className="landing-buttons">
        <Link to="/login" className="btn btn-large">
          Enter the Crypt (Login)
        </Link>
        <Link to="/register" className="btn btn-large btn-outline">
          Join the Coven (Register)
        </Link>
      </div>
    </div>
  );
}
