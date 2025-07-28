// src/pages/login/Login.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // ¡Asegúrate de que esta línea esté presente!
import comidaImg from "../../assets/comida-panel.png"; // Verifica que esta ruta sea correcta para tu imagen

import { useAuth } from "../../context/AuthContext";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();
  const [errorMensaje, setErrorMensaje] = useState("");
  const [successMensaje, setSuccessMensaje] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMensaje("");
    setSuccessMensaje("");

    if (!usuario || !contraseña) {
      setErrorMensaje("Por favor, introduce usuario y contraseña.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: usuario, password: contraseña }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Inicio de sesión exitoso:", data);
        const loggedInUserRole = data.user.role;
        const loggedInUserName = data.user.username;

        login(loggedInUserName, loggedInUserRole);

        setSuccessMensaje("Inicio de sesión exitoso. Redirigiendo...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setErrorMensaje(
          data.message ||
            "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo."
        );
      }
    } catch (error) {
      console.error("Error de conexión al iniciar sesión:", error);
      setErrorMensaje(
        "No se pudo conectar con el servidor para iniciar sesión. Verifica tu conexión e inténtalo de nuevo."
      );
    }
  };

  return (
    // login-container: Para el fondo negro y el centrado del panel
    <div className="login-container">
      {/* login-panel: El panel grande centrado que contiene la imagen y el formulario */}
      <div className="login-panel">
        {/* login-form-panel: La mitad izquierda para el formulario (ordenado con CSS) */}
        <div className="login-form-panel">
          <h2>INICIO</h2>
          <p>Bienvenido!</p>
          <p className="subtext">Ingresa tus datos...</p>

          {errorMensaje && <div className="error-message">{errorMensaje}</div>}
          {successMensaje && (
            <div className="success-message">{successMensaje}</div>
          )}
          {/* El formulario como tal */}
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <div className="form-group">
              <label htmlFor="usuario">Usuario</label>
              <input
                type="text"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
                placeholder="Introduce tu usuario"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contraseña">Contraseña</label>
              <input
                type="password"
                id="contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                autoComplete="current-password"
                placeholder="Introduce tu contraseña"
              />
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>
        </div>

        {/* login-image-panel: La mitad derecha para la imagen (ordenada con CSS) */}
        <div className="login-image-panel">
          <img src={comidaImg} alt="Iconos de Comida" />
        </div>
      </div>
    </div>
  );
}
