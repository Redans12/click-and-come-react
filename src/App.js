import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <Router>
      <div className="App">
        <Navbar onLoginClick={() => setIsLoginOpen(true)} />
        <HeroCarousel />
        <Login 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={handleSwitchToRegister}
        />
        <Register 
          isOpen={isRegisterOpen} 
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </div>
    </Router>
  );
}

export default App;