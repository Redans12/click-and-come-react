import React, { useState } from 'react';
import { supabase } from '../config/supabaseClient';
import bcrypt from 'bcryptjs';
import './Register.css';

const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(formData.password, salt);

      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          {
            nombre: formData.nombre,
            email: formData.email,
            password_hash: passwordHash,
            telefono: formData.telefono,
             id_rol: 2 
          }
        ])
        .select();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Este email ya está registrado');
        }
        throw error;
      }

      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      onSwitchToLogin();

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-register" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="register-container">
          <div className="logo-section">
            <div className="logo-placeholder">LOGO</div>
          </div>

          <h2 className="register-title">Crear Cuenta</h2>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="nombre">NOMBRE COMPLETO:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">DIRECCIÓN DE EMAIL:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">TELÉFONO (OPCIONAL):</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                placeholder="443-123-4567"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">CONTRASEÑA:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
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

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>

            <div className="signup-section">
              <span>¿Ya tienes cuenta? </span>
              <button type="button" onClick={onSwitchToLogin} className="signup-link">
                Inicia sesión aquí
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;