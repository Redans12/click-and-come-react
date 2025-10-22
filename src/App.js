import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import Login from './pages/Login';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="App">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <HeroCarousel />
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default App;