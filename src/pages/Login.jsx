import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import bcrypt from 'bcryptjs';
import './Login.css';
import { IoClose, IoEyeOutline, IoEyeOffOutline, IoArrowBack } from 'react-icons/io5';
import { useAuth } from '../hooks/useAuth'; // 🔥 AGREGAR ESTO

const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔥 AGREGAR ESTO

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

    try {
      // Buscar usuario por email
      const { data: usuario, error: queryError } = await supabase
        .from('usuarios')
        .select('id_usuario, nombre, email, password_hash, telefono, rol, esta_bloqueado')
        .eq('email', email)
        .single();

      if (queryError || !usuario) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Verificar si el usuario está bloqueado
      if (usuario.esta_bloqueado) {
        throw new Error('Tu cuenta ha sido bloqueada. Contacta al administrador.');
      }

      // Comparar contraseña
      const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
      
      if (!isPasswordValid) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Login exitoso - Guardar usuario
      const userSession = {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono
      };
      
      // 🔥 CAMBIO IMPORTANTE: Usar login() del hook en lugar de localStorage directamente
      console.log('✅ Login exitoso - Usuario:', userSession);
      login(userSession); // 🔥 ESTO ACTUALIZA EL NAVBAR AUTOMÁTICAMENTE
      
      // Cerrar modal
      onClose();
      
      // 🎯 Redirigir según el rol del usuario
      if (usuario.rol === 'admin') {
        navigate('/admin/dashboard');
      } else if (usuario.rol === 'owner') {
        navigate('/owner/dashboard');
      } else if (usuario.rol === 'cliente') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      setError(error.message);
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

                        {/* Campo Contraseña */}
                        <div className="form-group">
                            <label htmlFor="password">CONTRASEÑA</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="••••••••"
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
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        {/* Botón de Submit */}
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Cargando...' : 'Iniciar Sesión'}
                        </button>
                        
                        {/* Link de Contraseña Olvidada */}
                        <div style={{ textAlign: 'center', marginTop: '5px' }}>
                            <button 
                                type="button" 
                                className="forgot-password-link"
                                onClick={() => alert('Funcionalidad de recuperación próximamente')}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                        
                        {/* Divider */}
                        <div style={{ margin: '20px 0', position: 'relative', textAlign: 'center' }}>
                            <div className="divider"></div>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '0 15px', fontSize: '14px', color: '#6b7280' }}>
                                O continúa con
                            </div>
                        </div>

                        {/* Opciones Sociales */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            <button type="button" className="social-button">
                                <FaGoogle className="social-button-icon" style={{ color: '#EA4335' }} />
                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Google</span>
                            </button>
                            <button type="button" className="social-button">
                                <FaFacebook className="social-button-icon" style={{ color: '#1877F2' }} />
                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Facebook</span>
                            </button>
                        </div>

                    </form>
                </div>
                
                {/* FOOTER DE LA TARJETA */}
                <div className="card-footer">
                    <p className="text-sm text-gray-600">
                        ¿No tienes una cuenta?
                        <button 
                            type="button"
                            className="card-footer-link"
                            onClick={onSwitchToRegister}
                        >
                            Regístrate gratis
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;