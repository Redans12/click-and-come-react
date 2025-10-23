import React, { useState } from 'react';
import './Login.css';
import { IoClose, IoEyeOutline, IoEyeOffOutline, IoArrowBack } from 'react-icons/io5';

const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botón volver */}
        <button className="back-button" onClick={onClose}>
          <IoArrowBack />
        </button>

        {/* Botón cerrar */}
        <button className="modal-close" onClick={onClose}>
          <IoClose />
        </button>

        <div className="login-container">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo-placeholder">LOGO</div>
          </div>

          <h2 className="login-title">Inicia sesión:</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">DIRECCIÓN DE EMAIL*</label>
              <input
                type="email"
                id="email"
                placeholder="Dirección de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">CONTRASEÑA*</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Continuar
            </button>

            <button 
              type="button" 
              className="forgot-password-link"
              onClick={() => alert('Funcionalidad de recuperación próximamente')}
            >
              ¿Has Olvidado La Contraseña?
            </button>

            <div className="divider"></div>

            <div className="signup-section">
              <span>¿No tienes una cuenta? </span>
              <button 
                type="button"
                className="signup-link-button"
                onClick={onSwitchToRegister}
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;