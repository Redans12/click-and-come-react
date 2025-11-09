import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import ListaRestaurantes from './components/ListaRestaurantes';
import Footer from './components/footer';
import Login from './pages/Login';
import Register from './pages/Register';
import { restauranteService } from './services/restauranteService';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar restaurantes desde Supabase
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
      <div className="App flex flex-col min-h-screen">
        <Navbar onLoginClick={() => setIsLoginOpen(true)} />
        
        <main className="flex-grow">
          <HeroCarousel />
          
          {/* Sección de Restaurantes */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Restaurantes Disponibles
            </h2>
            
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Cargando restaurantes...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && restaurantes.length === 0 && (
              <div className="text-center py-12 text-gray-600">
                No hay restaurantes disponibles en este momento.
              </div>
            )}

            {!loading && !error && restaurantes.length > 0 && (
              <ListaRestaurantes restaurantes={restaurantes} />
            )}
          </div>
        </main>

        <Footer />

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