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
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
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
                contigo con novedas y texto por mensaje de confirmar y gestionar
                tus reservas.
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

            {/* Botón submit */}
            <button type="submit" className="submit-button">
              Crear cuenta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
