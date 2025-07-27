// src/components/plantilla/Plantilla.tsx
import type { ReactNode } from "react";

import { FaUserCircle } from "react-icons/fa";
import "./Plantilla.css";

interface PlantillaProps {
  tituloVentana: string;
  botones: string[];
  contenido: ReactNode;
  usuario: string;
  rol: string;
}

export default function Plantilla({
  tituloVentana,
  botones,
  contenido,
  usuario,
  rol,
}: PlantillaProps) {
  return (
    <div className="plantilla-wrapper">
      <div className="sidebar">
        <h2>Restaurant</h2>
        <ul>
          {botones.map((texto, i) => (
            <li key={i} className="sidebar-button">
              {texto}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <div className="topbar">
          <div>
            <h1>{tituloVentana}</h1>
            <p>
              Ejemplo : {rol.toUpperCase()} : {usuario.toUpperCase()}
            </p>
          </div>
          <div className="user-icon">
            <FaUserCircle size={30} color="black" />
          </div>
        </div>
        <div className="canvas-area">{contenido}</div>
      </div>
    </div>
  );
}
