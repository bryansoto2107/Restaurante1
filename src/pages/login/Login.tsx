// src/pages/login/Login.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Asegúrate de que este archivo exista
import comidaImg from "../../assets/comida-panel.png"; // Ruta a tu imagen de comida

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();
  const [errorMensaje, setErrorMensaje] = useState(""); // Estado para mostrar mensajes de error
  const [successMensaje, setSuccessMensaje] = useState(""); // Estado para mostrar mensajes de éxito

  // La función handleRegister ha sido eliminada por completo
  // ya que no se utiliza y causaba el error TS6133 en Vercel.

  // Función para manejar el evento de inicio de sesión de usuario
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    setErrorMensaje(""); // Limpia mensajes de error previos
    setSuccessMensaje(""); // Limpia mensajes de éxito previos

    try {
      // Envía una solicitud POST al endpoint de login de tu backend
      const response = await fetch("http://localhost:3000/auth/login", {
        // !! IMPORTANTE: Cambia "http://localhost:3000" por la URL de tu backend en producción cuando despliegues !!
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: usuario, password: contraseña }),
      });

      const data = await response.json(); // Parsea la respuesta del servidor a JSON

      if (response.ok) {
        // Si la respuesta HTTP es 2xx (éxito)
        console.log("Inicio de sesión exitoso:", data);
        // Aquí es donde normalmente guardarías un token de autenticación (JWT) si tu backend lo envía
        // localStorage.setItem('token', data.token);
        navigate("/dashboard"); // Redirige al usuario a la página del dashboard
      } else {
        // Si la respuesta HTTP indica un error
        setErrorMensaje(
          data.message ||
            "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo."
        ); // Muestra mensaje de error del backend o uno genérico
      }
    } catch (error) {
      // Captura cualquier error de red
      console.error("Error de conexión al iniciar sesión:", error);
      setErrorMensaje(
        "No se pudo conectar con el servidor para iniciar sesión. Verifica tu conexión."
      );
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <h1>INICIO</h1>
          <p>Bienvenido!</p>
          <form className="login-form">
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <button type="button" onClick={handleLogin}>
              Iniciar Sesión
            </button>
            {/* El botón de Registrarse ya no está aquí ni en el código */}
            {errorMensaje && <p className="error-message">{errorMensaje}</p>}
            {successMensaje && (
              <p className="success-message">{successMensaje}</p>
            )}
          </form>
        </div>
        <div className="login-right">
          <img src={comidaImg} alt="Decoración comida" />
        </div>
      </div>
    </div>
  );
}
