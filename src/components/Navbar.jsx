import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { IoChevronDown, IoSearch, IoPeopleOutline } from "react-icons/io5";
import { useAuth } from "../hooks/useAuth";

const Navbar = ({ onLoginClick }) => {
  const [location] = useState('Morelia, Michoacán');
  const [searchTerm, setSearchTerm] = useState('');
  const [guests] = useState(2);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardClick = () => {
    if (user?.rol === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.rol === 'owner') {
      navigate('/owner/dashboard');
    } else if (user?.rol === 'cliente') {
      navigate('/dashboard');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Selector de ubicación */}
        <div className="location-selector">
          <span>{location}</span>
          <IoChevronDown className="icon-dropdown" />
        </div>
        {/* Barra de búsqueda */}
        <div className="search-bar">
          <button className="search-button">
            <IoSearch />
          </button>
          <input
            type="text"
            placeholder="Buscar restaurante"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="navbar-right">
        {/* Número de personas */}
        <div className="nav-item">
          <IoPeopleOutline className="icon" />
          <span>{guests}</span>
        </div>
        <div className="separator"></div>
        {/* Botón Hoy */}
        <button className="nav-item nav-button">hoy</button>
        <div className="separator"></div>
        {/* Botón Todo el día */}
        <button className="nav-item nav-button">Todo el día</button>
        <div className="separator"></div>
        
        {/* Botón dinámico según autenticación */}
        {user ? (
          <>
            {/* Usuario autenticado - Mostrar nombre y opciones */}
            <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: '600', color: '#333' }}>{user.nombre}</span>
              <span style={{ 
                fontSize: '10px', 
                padding: '2px 8px', 
                backgroundColor: '#fee', 
                color: '#c00', 
                borderRadius: '12px',
                fontWeight: 'bold'
              }}>
                {user.rol}
              </span>
            </div>
            <div className="separator"></div>
            <button className="nav-button" onClick={handleDashboardClick}>
              Mis reservaciones
            </button>
            <div className="separator"></div>
            <button className="btn-login" onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          /* Usuario NO autenticado - Botón Entrar */
          <button className="btn-login" onClick={onLoginClick}>
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;