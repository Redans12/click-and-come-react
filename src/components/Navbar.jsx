import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { IoChevronDown, IoSearch, IoPeopleOutline, IoMenu, IoClose } from "react-icons/io5";
import { useAuth } from "../hooks/useAuth";
import SearchDropdown from "./SearchDropdown";

const Navbar = ({ onLoginClick, searchTerm = '', onSearchChange, restaurantes = [], onRestauranteSelect }) => {
  const [location] = useState('Morelia, Michoacán');
  const [guests] = useState(2);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleDashboardClick = () => {
    setMobileMenuOpen(false);
    if (user?.rol === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.rol === 'owner') {
      navigate('/owner/dashboard');
    } else if (user?.rol === 'cliente') {
      navigate('/dashboard');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (onSearchChange) {
      onSearchChange(value);
    }
    setShowDropdown(value.trim().length > 0);
  };

  const restaurantesFiltrados = restaurantes.filter(r => {
    if (!searchTerm.trim()) return false;
    const termino = searchTerm.toLowerCase();
    return (
      r.nombre?.toLowerCase().includes(termino) ||
      r.ciudad?.toLowerCase().includes(termino) ||
      r.tipo_comida?.toLowerCase().includes(termino) ||
      r.descripcion?.toLowerCase().includes(termino)
    );
  });

  const handleRestauranteSelect = (restaurante) => {
    if (onRestauranteSelect) {
      onRestauranteSelect(restaurante);
    }
    if (onSearchChange) {
      onSearchChange('');
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cerrar menú mobile al cambiar tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className="navbar">
        {/* 🔥 MOBILE: Menú hamburguesa */}
        <button 
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
        </button>

        <div className="navbar-left">
          {/* Selector de ubicación - Oculto en mobile */}
          <div className="location-selector desktop-only">
            <span>{location}</span>
            <IoChevronDown className="icon-dropdown" />
          </div>
          
          {/* Barra de búsqueda */}
          <div className="search-bar" ref={searchRef}>
            <button className="search-button">
              <IoSearch />
            </button>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchTerm.trim().length > 0) {
                  setShowDropdown(true);
                }
              }}
            />
            
            {showDropdown && (
              <SearchDropdown
                restaurantes={restaurantesFiltrados}
                searchTerm={searchTerm}
                onSelect={handleRestauranteSelect}
                onClose={() => setShowDropdown(false)}
              />
            )}
          </div>
        </div>
        
        {/* 🔥 DESKTOP: Menú normal */}
        <div className="navbar-right desktop-only">
          <div className="nav-item">
            <IoPeopleOutline className="icon" />
            <span>{guests}</span>
          </div>
          <div className="separator"></div>
          
          <button className="nav-item nav-button">hoy</button>
          <div className="separator"></div>
          
          <button className="nav-item nav-button">Todo el día</button>
          <div className="separator"></div>
          
          {user ? (
            <>
              <div className="nav-item">
                <span className="user-name">{user.nombre}</span>
                <span className="user-badge">{user.rol}</span>
              </div>
              <div className="separator"></div>
              <button className="nav-button" onClick={handleDashboardClick}>
                Dashboard
              </button>
              <div className="separator"></div>
              <button className="btn-login" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <button className="btn-login" onClick={onLoginClick}>
              Entrar
            </button>
          )}
        </div>

        {/* 🔥 MOBILE: Botón Login/User (visible siempre) */}
        <div className="mobile-auth-button">
          {user ? (
            <button className="user-avatar" onClick={() => setMobileMenuOpen(true)}>
              {user.nombre.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button className="btn-login-mobile" onClick={onLoginClick}>
              Entrar
            </button>
          )}
        </div>
      </nav>

      {/* 🔥 MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Menú</h3>
              <button onClick={() => setMobileMenuOpen(false)}>
                <IoClose size={24} />
              </button>
            </div>

            <div className="mobile-menu-content">
              {/* Ubicación */}
              <div className="mobile-menu-item">
                <div className="mobile-menu-label">Ubicación</div>
                <div className="mobile-menu-value">{location}</div>
              </div>

              {/* Personas */}
              <div className="mobile-menu-item">
                <div className="mobile-menu-label">Personas</div>
                <div className="mobile-menu-value">
                  <IoPeopleOutline /> {guests}
                </div>
              </div>

              {/* Usuario */}
              {user && (
                <>
                  <div className="mobile-menu-divider"></div>
                  <div className="mobile-menu-item">
                    <div className="mobile-menu-label">Usuario</div>
                    <div className="mobile-menu-value">
                      {user.nombre}
                      <span className="user-badge-mobile">{user.rol}</span>
                    </div>
                  </div>

                  <button 
                    className="mobile-menu-button"
                    onClick={handleDashboardClick}
                  >
                    Mis Reservaciones
                  </button>

                  <button 
                    className="mobile-menu-button logout"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;