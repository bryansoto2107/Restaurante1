import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Plantilla from "./components/plantilla/Plantilla";
import { useAuth } from "./Context/AuthContext"; // 1. Importa el hook de autenticación
import ProtectedRoute from "../src/components/ProtectedRoute";

// 3. Define las opciones del menú por rol en un objeto. Es más limpio y fácil de mantener.
const menuOptionsByRole = {
  Gerente: ["Inicio", "Reportes", "Gestión de Personal", "Inventario"],
  Mesero: ["Inicio", "Tomar Pedido", "Ver Mesas"],
  Cocinero: ["Inicio", "Ver Comandas"],
  // Agrega un rol por defecto para manejar casos inesperados
  default: ["Inicio"],
};

export default function App() {
  // 4. Obtén el estado del usuario del contexto
  const { user } = useAuth();

  // 5. Función para determinar los botones a mostrar según el rol del usuario
  const getButtonsForRole = (rol: string | undefined) => {
    // Si no hay rol o el rol no existe en nuestro objeto, devuelve los botones por defecto
    if (!rol || !(rol in menuOptionsByRole)) {
      return menuOptionsByRole.default;
    }
    // Si el rol existe, devuelve los botones correspondientes
    return menuOptionsByRole[rol as keyof typeof menuOptionsByRole];
  };

  // Obtenemos los botones que se deben mostrar para el usuario actual
  const botonesVisibles = getButtonsForRole(user?.rol);

  return (
    <Routes>
      {/* La ruta de Login es pública y siempre accesible */}
      <Route path="/" element={<Login />} />

      {/* 6. La ruta del Dashboard ahora está protegida */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {/* Solo si la ruta está protegida y el usuario existe, renderizamos la Plantilla */}
            {user && ( // Esta comprobación (user && ...) es una buena práctica para evitar errores si 'user' es null
              <Plantilla
                tituloVentana="Panel Principal"
                // 7. Pasa las props dinámicas desde el contexto
                botones={botonesVisibles}
                usuario={user.nombre}
                rol={user.rol}
                // El contenido puede seguir siendo un placeholder o puedes empezar a enrutarlo también
                contenido={<div>Aquí va el contenido dinámico del panel</div>} nombre={""}              />
            )}
          </ProtectedRoute>
        }
      />
      {/* Aquí podrías añadir más rutas que también necesiten estar protegidas */}
      {/* <Route path="/inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} /> */}
    </Routes>
  );
}