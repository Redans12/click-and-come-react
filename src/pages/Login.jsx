import React, { useState } from 'react';
import './Login.css';

const Login = ({ isOpen, onClose }) => {
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botón cerrar */}
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Imagen del restaurante a la derecha */}
        <div className="modal-layout">
          <div className="login-section">
            <div className="logo-section">
              <div className="logo-placeholder">LOGO</div>
            </div>

            <h2 className="login-title">Inicia sesión:</h2>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">DIRECCIÓN DE EMAIL:</label>
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
                <label htmlFor="password">CONTRASEÑA:</label>
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
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-button">
                Continuar
              </button>

              <a href="#" className="forgot-password">
                ¿Has Olvidado La Contraseña?
              </a>

              <div className="signup-section">
                <span>¿No tienes una cuenta? </span>
                <a href="#" className="signup-link">Registrarse</a>
              </div>
            </form>
          </div>

          {/* Imagen del restaurante */}
          <div className="image-section">
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600" 
              alt="Restaurante"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;