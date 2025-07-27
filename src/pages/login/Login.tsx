import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Asegúrate de que este archivo exista y contenga tus estilos CSS
import comidaImg from "../../assets/comida-panel.png"; // Ruta a tu imagen de comida

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();
  const [errorMensaje, setErrorMensaje] = useState(""); // Estado para mostrar mensajes de error al usuario
  const [successMensaje, setSuccessMensaje] = useState(""); // Estado para mostrar mensajes de éxito al usuario

  // Función para manejar el evento de registro de usuario
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    setErrorMensaje(""); // Limpia mensajes de error previos
    setSuccessMensaje(""); // Limpia mensajes de éxito previos

    try {
      // Envía una solicitud POST al endpoint de registro de tu backend
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indica que el cuerpo de la solicitud es JSON
        },
        // Convierte los datos del usuario y contraseña a JSON y los envía en el cuerpo
        body: JSON.stringify({
          username: usuario,
          password: contraseña,
          role: "user",
        }), // Puedes ajustar el 'role' si lo necesitas
      });

      const data = await response.json(); // Parsea la respuesta del servidor a JSON

      if (response.ok) {
        // Si la respuesta HTTP es 2xx (éxito)
        setSuccessMensaje(data.message || "Usuario registrado exitosamente."); // Muestra mensaje de éxito del backend o uno genérico
        setUsuario(""); // Limpia el campo de usuario del formulario
        setContraseña(""); // Limpia el campo de contraseña del formulario
      } else {
        // Si la respuesta HTTP indica un error (ej. 400, 500)
        setErrorMensaje(
          data.message ||
            "Error al registrar usuario. Por favor, inténtalo de nuevo."
        ); // Muestra mensaje de error del backend o uno genérico
      }
    } catch (error) {
      // Captura cualquier error de red (ej. el backend no está corriendo)
      console.error("Error de conexión al registrar usuario:", error);
      setErrorMensaje(
        "No se pudo conectar con el servidor para registrar. Verifica tu conexión."
      );
    }
  };

  // Función para manejar el evento de inicio de sesión de usuario
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    setErrorMensaje(""); // Limpia mensajes de error previos
    setSuccessMensaje(""); // Limpia mensajes de éxito previos

    try {
      // Envía una solicitud POST al endpoint de login de tu backend
      const response = await fetch("http://localhost:3000/auth/login", {
        // Asegúrate de que esta URL sea la correcta para tu backend
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
            {" "}
            {/* Eliminado onSubmit aquí para manejar los botones individualmente */}
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
            {/* Botón para Iniciar Sesión */}
            {/* El type="button" es importante para evitar que el formulario se envíe automáticamente */}
            <button type="button" onClick={handleLogin}>
              Iniciar Sesión
            </button>
            {/* Botón para Registrarse */
            /*<button type="button" onClick={handleRegister}>
              Registrarse
            </button>*/
            /* Muestra mensajes de error o éxito debajo de los botones */}
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
