import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import HeroCarousel from "./components/HeroCarousel";
import ListaRestaurantes from "./components/ListaRestaurantes";
import Footer from "./components/footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { restauranteService } from "./services/restauranteService";
import SeccionRestaurantes from "./components/SeccionRestaurantes";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CrearRestaurante from "./pages/admin/CrearRestaurante";
import EditarRestaurante from "./pages/admin/EditarRestaurante";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ClienteDashboard from "./pages/ClienteDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import VistaDetalladaRestaurante from "./components/VistaDetalladaRestaurante";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔥 Estado para búsqueda en navbar
  const [searchTerm, setSearchTerm] = useState('');
  
  // 🔥 Estado para mostrar vista detallada desde búsqueda
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState(null);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);

  // Cargar restaurantes desde Supabase
  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        setLoading(true);
        const data = await restauranteService.getRestaurantes();
        setRestaurantes(data);
        setError(null);
      } catch (err) {
        console.error("Error cargando restaurantes:", err);
        setError("No se pudieron cargar los restaurantes");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantes();
  }, []);

  // 🔥 Manejar selección de restaurante desde búsqueda
  const handleRestauranteSelect = (restaurante) => {
    setRestauranteSeleccionado(restaurante);
    setModalDetalleAbierto(true);
  };

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
        {/* 🔥 Navbar con búsqueda dropdown */}
        <Navbar 
          onLoginClick={() => setIsLoginOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          restaurantes={restaurantes}
          onRestauranteSelect={handleRestauranteSelect}
        />

        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["cliente"]}>
                <ClienteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/*"
            element={
              <Routes>
                <Route path="dashboard" element={<OwnerDashboard />} />
              </Routes>
            }
          />

          <Route
            path="/admin/restaurantes/crear"
            element={<CrearRestaurante />}
          />
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/restaurantes/:id/editar"
            element={<EditarRestaurante />}
          />
          <Route
            path="/*"
            element={
              <>
                <main className="flex-grow">
                  <HeroCarousel />

                  {/* Sección de Restaurantes - 🔥 SIN FILTRADO */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                      Restaurantes Disponibles
                    </h2>

                    {loading && (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        <p className="mt-4 text-gray-600">
                          Cargando restaurantes...
                        </p>
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

                    {/* 🔥 MOSTRAR TODOS LOS RESTAURANTES (sin filtrar) */}
                    {!loading && !error && restaurantes.length > 0 && (
                      <ListaRestaurantes restaurantes={restaurantes} />
                    )}
                  </div>

                  {/* Secciones adicionales */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <SeccionRestaurantes
                      titulo="Recomendado para ti"
                      restaurantes={restaurantes.slice(0, 5)}
                      onVerTodo={() => console.log("Ver todos los recomendados")}
                    />
                    <SeccionRestaurantes
                      titulo="Reservar para esta noche"
                      icono="🌙"
                      restaurantes={restaurantes.slice(0, 5)}
                      onVerTodo={() => console.log("Ver todas las reservas nocturnas")}
                    />
                    <SeccionRestaurantes
                      titulo="Nuevo"
                      restaurantes={restaurantes.slice(0, 5)}
                      onVerTodo={() => console.log("Ver todos los nuevos")}
                    />
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

                {/* 🔥 Modal de Vista Detallada desde búsqueda */}
                {restauranteSeleccionado && (
                  <VistaDetalladaRestaurante
                    restaurante={restauranteSeleccionado}
                    isOpen={modalDetalleAbierto}
                    onClose={() => {
                      setModalDetalleAbierto(false);
                      setRestauranteSeleccionado(null);
                    }}
                  />
                )}
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;