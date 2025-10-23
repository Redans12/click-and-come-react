<<<<<<< HEAD
import React, { useState } from "react";
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
=======
import React, { useState } from 'react';
import './Register.css';
import { IoClose, IoEyeOutline, IoEyeOffOutline, IoArrowBack } from 'react-icons/io5';

const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    countryCode: '+52',
    phone: '',
    email: '',
    password: ''
>>>>>>> main
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
<<<<<<< HEAD
      [e.target.name]: e.target.value,
=======
      [e.target.name]: e.target.value
>>>>>>> main
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
<<<<<<< HEAD
      alert(
        "Debes aceptar la Política de privacidad y las condiciones del servicio"
      );
      return;
    }
    if (!captchaChecked) {
      alert("Por favor completa el captcha");
      return;
    }
    console.log("Registro:", formData);
    // Aquí irá la lógica de registro con Supabase
=======
      alert('Debes aceptar la Política de privacidad y las condiciones del servicio');
      return;
    }
    if (!captchaChecked) {
      alert('Por favor completa el captcha');
      return;
    }
    console.log('Registro:', formData);
>>>>>>> main
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
<<<<<<< HEAD
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
=======
      <div className="register-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <IoClose />
        </button>
        <button className="back-button" onClick={onClose}>
          <IoArrowBack />
>>>>>>> main
        </button>

        <div className="register-container">
          <h2 className="register-title">Crea una cuenta para continuar.</h2>
          <p className="register-subtitle">
<<<<<<< HEAD
            Vamos a recopilar un poco de información básica para que los
            restaurantes sepan quién eres.
=======
            Vamos a recopilar un poco de información básica para que los restaurantes sepan quién eres.
>>>>>>> main
          </p>
          <p className="register-note">
            Los campos obligatorios se indican con un asterisco (*).
          </p>

          <form onSubmit={handleSubmit} className="register-form">
<<<<<<< HEAD
            {/* Nombre */}
=======
>>>>>>> main
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

<<<<<<< HEAD
            {/* Apellidos */}
=======
>>>>>>> main
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

<<<<<<< HEAD
            {/* Número de teléfono móvil */}
=======
>>>>>>> main
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
<<<<<<< HEAD
                  <option value="+44">+44</option>
=======
>>>>>>> main
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
<<<<<<< HEAD
                Añadiremos tu número de teléfono para que podamos contactar
                contigo con novedas y texto por mensaje de confirmar y gestionar
                tus reservas.
              </small>
            </div>

            {/* Email */}
=======
                Añadiremos tu número de teléfono para contactarte con novedades y confirmar tus reservas.
              </small>
            </div>

>>>>>>> main
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

<<<<<<< HEAD
            {/* Contraseña */}
=======
>>>>>>> main
            <div className="form-group">
              <label htmlFor="password">Contraseña*</label>
              <div className="password-input-wrapper">
                <input
<<<<<<< HEAD
                  type={showPassword ? "text" : "password"}
=======
                  type={showPassword ? 'text' : 'password'}
>>>>>>> main
                  id="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
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

<<<<<<< HEAD
            {/* Checkbox términos */}
=======
>>>>>>> main
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span>
<<<<<<< HEAD
                  He leído y acepto la{" "}
                  <button
                    type="button"
                    className="terms-link"
                    onClick={() => alert("Ver términos y condiciones")}
=======
                  He leído y acepto la{' '}
                  <button 
                    type="button" 
                    className="terms-link"
                    onClick={() => alert('Ver términos')}
>>>>>>> main
                  >
                    Política de privacidad y las condiciones del servicio
                  </button>
                </span>
              </label>
            </div>

<<<<<<< HEAD
            {/* reCAPTCHA simulado */}
=======
>>>>>>> main
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
<<<<<<< HEAD
                <img
                  src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
=======
                <img 
                  src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
>>>>>>> main
                  alt="reCAPTCHA"
                  width="32"
                />
                <div className="recaptcha-text">
                  <small>reCAPTCHA</small>
                  <small>Privacidad - Términos</small>
                </div>
              </div>
            </div>

<<<<<<< HEAD
            {/* Botón submit */}
=======
>>>>>>> main
            <button type="submit" className="submit-button">
              Crear cuenta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Register;
=======
export default Register;
>>>>>>> main
