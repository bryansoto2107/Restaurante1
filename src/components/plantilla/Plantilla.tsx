// src/components/plantilla/Plantilla.tsx
import type { ReactNode } from "react";
import { FaUserCircle } from "react-icons/fa"; // Importa FaUserCircle para el icono de usuario
import "./Plantilla.css";
import { Link } from "react-router-dom"; // Necesario para la navegación interna

// Definimos las opciones de navegación disponibles para cada rol
// Cada objeto tiene un 'name' para el texto del botón y un 'path' para la ruta URL
const roleOptions = {
  super_admin: [
    { name: "Registrar Usuarios", path: "/dashboard/register-user" },
    { name: "Visualizar y Supervisar", path: "/dashboard/gerente-view" },
    { name: "Control General", path: "/dashboard/admin-control" },
    { name: "Mesas y Comandas", path: "/dashboard/mesas" },
    { name: "Pedidos Cocina", path: "/dashboard/cocina" },
    { name: "Caja y Pagos", path: "/dashboard/caja" },
  ],
  gerente: [
    { name: "Visualizar y Supervisar", path: "/dashboard/gerente-view" },
    { name: "Registrar Usuarios", path: "/dashboard/register-user" }, // El gerente también puede registrar usuarios
  ],
  mesonero: [{ name: "Mesas y Comandas", path: "/dashboard/mesas" }],
  cocinero: [{ name: "Pedidos Cocina", path: "/dashboard/cocina" }],
  cajero: [{ name: "Caja y Pagos", path: "/dashboard/caja" }],
  default: [
    // Para roles no reconocidos o usuarios sin un rol específico
    { name: "Inicio", path: "/dashboard" },
  ],
};

// Interfaz para las propiedades (props) que el componente Plantilla acepta
interface PlantillaProps {
  tituloVentana: string;
  contenido: ReactNode; // Un nodo de React puede ser cualquier cosa renderizable (JSX, string, number)
  usuario: string;
  rol: string; // El rol del usuario, por ejemplo: "Gerente", "Mesonero", "Super_Admin"
  nombre: string; // Aunque parece redundante con 'usuario', lo mantengo si lo necesitas
}

export default function Plantilla({
  tituloVentana,
  contenido,
  usuario,
  rol,
}: // No desestructuramos 'nombre' si no se usa dentro de este componente
// pero lo mantenemos en PlantillaProps por si se añade su uso más tarde.
PlantillaProps) {
  // Normalizamos el rol a minúsculas para que coincida con las claves de 'roleOptions'
  const normalizedRol = rol.toLowerCase();

  // Obtenemos las opciones de menú para el rol actual.
  // Si el rol no se encuentra en 'roleOptions', usamos las opciones 'default'.
  const currentRoleOptions =
    roleOptions[normalizedRol as keyof typeof roleOptions] ||
    roleOptions["default"];

  return (
    <div className="plantilla-wrapper">
      {/* Sidebar - Menú de navegación */}
      <div className="sidebar">
        <h2>Restaurant</h2>
        <ul>
          {/* Mapeamos sobre las opciones del rol actual para crear los botones */}
          {currentRoleOptions.map((item, i) => (
            <li key={i} className="sidebar-button">
              {/* Usamos Link para navegar sin recargar la página */}
              <Link to={item.path}>
                {item.name} {/* Texto del botón */}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido principal de la plantilla */}
      <div className="main-content">
        {/* Barra superior */}
        <div className="topbar">
          <div>
            <h3>{tituloVentana}</h3> {/* Título de la ventana actual */}
            <p>
              {rol.toUpperCase()} : {usuario.toUpperCase()}{" "}
              {/* Información del usuario */}
            </p>
          </div>
          <div className="user-icon">
            <FaUserCircle size={30} color="black" /> {/* Icono de usuario */}
          </div>
        </div>
        {/* Área donde se renderizará el contenido dinámico de cada página */}
        <div className="canvas-area">{contenido}</div>
      </div>
    </div>
  );
}
