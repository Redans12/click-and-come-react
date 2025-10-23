import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import bcrypt from "bcryptjs";
import "./Login.css";

const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Buscar usuario por email e incluir el rol con JOIN
      const { data: usuarios, error: queryError } = await supabase
        .from("usuarios")
        .select(
          `
          *,
          roles (
            id_rol,
            nombre
          )
        `
        )
        .eq("email", email)
        .single();

      if (queryError) {
        throw new Error("Email o contraseña incorrectos");
      }

      if (usuarios.esta_bloqueado) {
        throw new Error(
          "Tu cuenta ha sido bloqueada. Contacta al administrador."
        );
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        usuarios.password_hash
      );

      if (!isPasswordValid) {
        throw new Error("Email o contraseña incorrectos");
      }

      const userSession = {
        id_usuario: usuarios.id_usuario,
        nombre: usuarios.nombre,
        email: usuarios.email,
        rol: usuarios.roles.nombre, // Obtener el nombre del rol desde la tabla roles
        id_rol: usuarios.id_rol,
        telefono: usuarios.telefono,
      };

      localStorage.setItem("user", JSON.stringify(userSession));

      console.log("Login exitoso:", userSession);

      onClose();
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

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
                    type={showPassword ? "text" : "password"}
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
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  style={{ color: "red", fontSize: "14px", marginTop: "10px" }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Continuar"}
              </button>

              <button
                type="button"
                className="forgot-password"
                onClick={() => alert("Funcionalidad próximamente")}
              >
                ¿Has Olvidado La Contraseña?
              </button>

              <div className="signup-section">
                <span>¿No tienes una cuenta? </span>
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="signup-link"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Registrarse
                </button>
              </div>
            </form>
          </div>

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
