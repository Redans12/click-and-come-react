import React, { useState } from "react";
import { supabase } from '../config/supabaseClient';
import bcrypt from 'bcryptjs';
import "./Register.css";
import { IoClose, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+52",
    phone: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      alert("Debes aceptar la Política de privacidad y las condiciones del servicio");
      return;
    }
    if (!captchaChecked) {
      alert("Por favor completa el captcha");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Validar que la contraseña tenga al menos 6 caracteres
      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Hashear la contraseña
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(formData.password, salt);

      // Combinar nombre completo
      const nombreCompleto = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Combinar teléfono con código de país
      const telefonoCompleto = `${formData.countryCode} ${formData.phone}`.trim();

      // Insertar usuario en la base de datos
      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          {
            nombre: nombreCompleto,
            email: formData.email,
            password_hash: passwordHash,
            telefono: telefonoCompleto,
            id_rol: 2 // 2 = cliente
          }
        ])
        .select();

      if (error) {
        // Manejar error de email duplicado
        if (error.code === '23505') {
          throw new Error('Este email ya está registrado');
        }
        throw error;
      }

      console.log('Registro exitoso:', data);
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      
      // Limpiar formulario
      setFormData({
        firstName: "",
        lastName: "",
        countryCode: "+52",
        phone: "",
        email: "",
        password: "",
      });
      setAcceptedTerms(false);
      setCaptchaChecked(false);
      
      // Cambiar a login
      onSwitchToLogin();

    } catch (error) {
      setError(error.message);
      console.error('Error en registro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="register-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button className="modal-close" onClick={onClose}>
          <IoClose />
        </button>

        {/* Botón volver */}
        <button className="back-button" onClick={onClose}>
          ←
        </button>

        <div className="register-container">
          <h2 className="register-title">Crea una cuenta para continuar.</h2>
          <p className="register-subtitle">
            Vamos a recopilar un poco de información básica para que los
            restaurantes sepan quién eres.
          </p>
          <p className="register-note">
            Los campos obligatorios se indican con un asterisco (*).
          </p>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="firstName">Nombre*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Apellidos */}
            <div className="form-group">
              <label htmlFor="lastName">Apellidos*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Apellidos"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Número de teléfono móvil */}
            <div className="form-group">
              <label htmlFor="phone">Número de teléfono Móvil*</label>
              <div className="phone-input-group">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="country-code"
                >
                  <option value="+52">+52</option>
                  <option value="+1">+1</option>
                  <option value="+34">+34</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Número de teléfono móvil"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <small className="help-text">
                Añadiremos tu número de teléfono para que podamos contactar
                contigo con novedades y confirmar y gestionar tus reservas.
              </small>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Dirección de email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label htmlFor="password">Contraseña*</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Contraseña (mínimo 6 caracteres)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
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

            {/* Checkbox términos */}
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span>
                  He leído y acepto la{" "}
                  <button
                    type="button"
                    className="terms-link"
                    onClick={() => alert("Ver términos y condiciones")}
                  >
                    Política de privacidad y las condiciones del servicio
                  </button>
                </span>
              </label>
            </div>

            {/* reCAPTCHA simulado */}
            <div className="captcha-box">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={captchaChecked}
                  onChange={(e) => setCaptchaChecked(e.target.checked)}
                />
                <span>No soy un robot</span>
              </label>
              <div className="recaptcha-logo">
                <img
                  src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                  alt="reCAPTCHA"
                  width="32"
                />
                <div className="recaptcha-text">
                  <small>reCAPTCHA</small>
                  <small>Privacidad - Términos</small>
                </div>
              </div>
            </div>

            {/* Mensaje de error */}
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

            {/* Botón submit */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;