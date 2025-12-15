import React, { useState } from "react";
import { supabase } from '../config/supabaseClient';
import bcrypt from 'bcryptjs';
import "./Register.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa"; 

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
            // ... (Lógica de autenticación con Supabase y bcrypt) ...
            if (formData.password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(formData.password, salt);

            const nombreCompleto = `${formData.firstName} ${formData.lastName}`.trim();
            const telefonoCompleto = `${formData.countryCode} ${formData.phone}`.trim();

            const { data, error: insertError } = await supabase
                .from('usuarios')
                .insert([
                    {
                        nombre: nombreCompleto,
                        email: formData.email,
                        password_hash: passwordHash,
                        telefono: telefonoCompleto,
                        rol: 'cliente' 
                    }
                ])
                .select();

            if (insertError) {
                if (insertError.code === '23505') {
                    throw new Error('Este email ya está registrado');
                }
                throw insertError;
            }

            console.log('Registro exitoso:', data);
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            
            // Limpiar formulario
            setFormData({ firstName: "", lastName: "", countryCode: "+52", phone: "", email: "", password: "" });
            setAcceptedTerms(false);
            setCaptchaChecked(false);
            
            onSwitchToLogin();

        } catch (error) {
            setError(error.message || 'Error al registrar la cuenta');
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
                
                {/* HEADER CON GRADIENTE */}
                <div className="card-header-gradient">
                    <div className="header-icon-wrapper">
                        <FaUserPlus className="header-icon" /> 
                    </div>
                    <h2 className="header-title">
                        Crear Cuenta
                    </h2>
                    <p className="header-subtitle">
                        Únete y descubre los mejores restaurantes
                    </p>
                </div>
                
                {/* BLOQUE DE INFORMACIÓN (Simulando el gradiente azul) */}
                <div className="info-block-gradient">
                    <p className="text-sm text-gray-700 mb-2">
                        Vamos a recopilar un poco de información básica para que los restaurantes sepan quién eres.
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                        </svg>
                        Los campos obligatorios se indican con un asterisco (*)
                    </p>
                </div>

                {/* CONTENEDOR PRINCIPAL / FORMULARIO */}
                <div className="register-container">

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
                                Añadiremos tu número de teléfono para contactar contigo.
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
                                        onClick={() => alert("Ver política de privacidad y condiciones del servicio")}
                                    >
                                        Política de privacidad y las condiciones del servicio
                                    </button>
                                </span>
                            </label>
                        </div>

                        {/* reCAPTCHA simulado */}
                        <div className="captcha-box">
                            <label className="checkbox-label" style={{ marginBottom: 0 }}>
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
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {/* Botón submit */}
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                    </form>
                </div>
                
                {/* FOOTER DE LA TARJETA */}
                <div className="card-footer">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta?
                        <button 
                            type="button"
                            className="card-footer-link"
                            onClick={onSwitchToLogin}
                        >
                            Inicia sesión
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;