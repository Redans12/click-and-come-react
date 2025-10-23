import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import bcrypt from 'bcryptjs';
import './Login.css';
import { IoClose, IoEyeOutline, IoEyeOffOutline, IoArrowBack } from 'react-icons/io5';

const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Buscar usuario por email con JOIN a la tabla roles
      const { data: usuarios, error: queryError } = await supabase
        .from('usuarios')
        .select(`
          *,
          roles (
            id_rol,
            nombre
          )
        `)
        .eq('email', email)
        .single();

      if (queryError) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Verificar si el usuario está bloqueado
      if (usuarios.esta_bloqueado) {
        throw new Error('Tu cuenta ha sido bloqueada. Contacta al administrador.');
      }

      // Comparar contraseña
      const isPasswordValid = await bcrypt.compare(password, usuarios.password_hash);

      if (!isPasswordValid) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Login exitoso - Guardar usuario en localStorage
      const userSession = {
        id_usuario: usuarios.id_usuario,
        nombre: usuarios.nombre,
        email: usuarios.email,
        rol: usuarios.roles.nombre,
        id_rol: usuarios.id_rol
      };
      
      localStorage.setItem('user', JSON.stringify(userSession));

      console.log('Login exitoso:', userSession);
      
      // Cerrar modal y redirigir
      onClose();
      navigate('/dashboard');

    } catch (error) {
      setError(error.message);
      console.error('Error en login:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="back-button" onClick={onClose}>
          <IoArrowBack />
        </button>

        <button className="modal-close" onClick={onClose}>
          <IoClose />
        </button>

        <div className="login-container">
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

            {error && (
              <div className="error-message" style={{ 
                color: '#ff4757', 
                fontSize: '14px', 
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#ffe5e8',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Cargando...' : 'Continuar'}
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