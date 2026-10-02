import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import VampireScene from './VampireScene'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BoardPage from './pages/BoardPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <VampireScene />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/board" element={<BoardPage />} />
        </Routes>
        <div className="global-footer">
          Made with ❤️ by <a href="https://www.linkedin.com/in/fuzail-a-khan/" target="_blank" rel="noopener noreferrer" className="creator-link">Fuzail Aqdas Khan</a>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
