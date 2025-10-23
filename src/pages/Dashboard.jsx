import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('Dashboard - Loading:', loading);
  console.log('Dashboard - User:', user);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Cargando...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        No hay usuario. Redirigiendo...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Dashboard</h1>
        
        <div className="user-info">
          <h2>Bienvenido, {user.nombre}!</h2>
          
          <div className="info-row">
            <strong>Email:</strong> {user.email}
          </div>
          
          <div className="info-row">
            <strong>Rol:</strong> 
            <span className={`badge ${user.rol === 'admin' ? 'badge-admin' : 'badge-cliente'}`}>
              {user.rol === 'admin' ? 'ADMINISTRADOR' : 'CLIENTE'}
            </span>
          </div>
          
          <div className="info-row">
            <strong>ID Usuario:</strong> {user.id_usuario}
          </div>

          <div className="info-row">
            <strong>ID Rol:</strong> {user.id_rol}
          </div>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;