import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import HeroCarousel from './components/HeroCarousel';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SeccionRestaurantes from './components/SeccionRestaurantes';
import { restauranteService } from './services/restauranteService';

function HomePage() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        setLoading(true);
        const data = await restauranteService.getRestaurantes();
        setRestaurantes(data);
        setError(null);
      } catch (err) {
        console.error('Error cargando restaurantes:', err);
        setError('No se pudieron cargar los restaurantes');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroCarousel />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SeccionRestaurantes
          titulo="Recomendado para ti"
          restaurantes={restaurantes.slice(0, 5)}
          onVerTodo={() => console.log('Ver todos los recomendados')}
        />

        <SeccionRestaurantes
          titulo="Reservar para esta noche"
          icono="🌙"
          restaurantes={restaurantes.slice(5, 10)}
          onVerTodo={() => console.log('Ver todas las reservas nocturnas')}
        />

        <SeccionRestaurantes
          titulo="Nuevo"
          restaurantes={restaurantes.slice(10, 15)}
          onVerTodo={() => console.log('Ver todos los nuevos')}
        />
      </div>
    </>
  );
}

function AppContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <div className="App flex flex-col min-h-screen">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />

      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={switchToRegister}
      />

      <Register 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;