// src/App.tsx
import { useState } from "react";
// ¡IMPORTANTE! Ya NO importamos BrowserRouter aquí. Solo Routes y Route.
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Plantilla from "./components/plantilla/Plantilla";

// Importa los componentes de tus páginas
import RegisterUserPage from "./pages/RegisterUserPage";
import GerenteViewPage from "./pages/GerenteViewPage";
import AdminControlPage from "./pages/AdminControlPage";
import MesasComandasPage from "./pages/MesasComandasPage";
import PedidosCocinaPage from "./pages/PedidosCocinaPage";
import CajaPagosPage from "./pages/CajaPagosPage";

// Importa la interfaz Comanda (usando 'type' como buena práctica)
import type { Comanda } from "./types";

export default function App() {
  // *** SIMULACIÓN DEL ROL DEL USUARIO ***
  // En una aplicación real, 'userRole' y 'userName' vendrían
  // del estado global de autenticación después de que el usuario inicie sesión.
  // Para probar, puedes cambiar el valor de 'userRole' aquí:
  const userRole = "super_admin"; // Cambia estos valores para probar diferentes roles
  const userName = "bryan";

  // Estado global para las comandas que se envían a cocina
  const [comandasCocina, setComandasCocina] = useState<Comanda[]>([]);

  // Función para añadir una comanda a la lista del cocinero
  const addComandaToCocina = (newComanda: Comanda) => {
    setComandasCocina((prevComandas) => [...prevComandas, newComanda]);
  };

  return (
    // ¡IMPORTANTE! Hemos eliminado el componente <Router> aquí.
    // Tu <App /> debe estar envuelto por <BrowserRouter> solo en src/main.tsx
    <Routes>
      {/* Ruta para la página de Login */}
      <Route path="/" element={<Login />} />

      {/*
        Ruta para el Dashboard principal.
        Aquí la Plantilla recibe un contenido genérico de bienvenida.
      */}
      <Route
        path="/dashboard"
        element={
          <Plantilla
            tituloVentana="Dashboard Principal"
            usuario={userName}
            rol={userRole}
            nombre={userName}
            contenido={
              <div>
                Bienvenido al Dashboard. Selecciona una opción del menú lateral.
              </div>
            }
          />
        }
      />

      {/*
        Rutas para cada una de las funcionalidades del sistema.
        Cada una usa la Plantilla y le pasa un componente diferente como 'contenido'.
        Los botones del menú en la Plantilla te llevarán a estas rutas.
      */}
      <Route
        path="/dashboard/register-user"
        element={
          <Plantilla
            tituloVentana="Registro de Usuarios"
            usuario={userName}
            rol={userRole}
            nombre={userName}
            contenido={<RegisterUserPage />}
          />
        }
      />
      <Route
        path="/dashboard/gerente-view"
        element={
          <Plantilla
            tituloVentana="Visualización y Supervisión"
            usuario={userName}
            rol={userRole}
            nombre={userName}
            contenido={<GerenteViewPage />}
          />
        }
      />
      <Route
        path="/dashboard/admin-control"
        element={
          <Plantilla
            tituloVentana="Control General del Sistema"
            usuario={userName}
            rol={userRole}
            nombre={userName}
            contenido={<AdminControlPage />}
          />
        }
      />
      <Route
        path="/dashboard/mesas"
        element={
          <Plantilla
            tituloVentana="Mesas y Comandas"
            usuario={userName}
            rol={userRole}
            nombre={userName}
            // Pasa la función para añadir comandas a la página de mesas
            contenido={
              <MesasComandasPage onPlaceOrderToCocina={addComandaToCocina} />
            }
          />
        }
      />
      <Route
        path="/dashboard/cocina"
        element={
          <Plantilla
            tituloVentana="Pedidos de Cocina"
            usuario={userName}
            rol={userRole}
            nombre={userName}
            // Pasa las comandas y la función para actualizarlas a la página de cocina
            contenido={
              <PedidosCocinaPage
                comandas={comandasCocina}
                setComandas={setComandasCocina}
              />
            }
          />
        }
      />
      <Route
        path="/dashboard/caja"
        element={
          <Plantilla
            tituloVentana="Caja y Pagos"
            usuario={userName}
            rol={userRole}
            nombre={userName}
            contenido={<CajaPagosPage />}
          />
        }
      />
      {/* Puedes añadir más rutas si es necesario */}
    </Routes>
  );
}
