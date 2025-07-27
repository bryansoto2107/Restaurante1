import { useState } from "react";
import type { FormEvent } from "react";
import "./Login.css";
import comidaImg from "../../assets/comida-panel.png"; // usa tu imagen aquí

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (usuario === "admin" && contraseña === "1234") {
      alert("¡Acceso concedido!");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-left">
          <h1>INICIO</h1>
          <p>Bienvenido!</p>
          <form onSubmit={handleSubmit} className="login-form">
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
            <button type="submit">inicio</button>
          </form>
        </div>
        <div className="login-right">
          <img src={comidaImg} alt="Decoración comida" />
        </div>
      </div>
    </div>
  );
}
