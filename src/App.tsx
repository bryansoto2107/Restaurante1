// src/App.tsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Plantilla from "./components/plantilla/Plantilla";

import RegisterUserPage from "./pages/RegisterUserPage";
import GerenteViewPage from "./pages/GerenteViewPage";
import AdminControlPage from "./pages/AdminControlPage";
import MesasComandasPage from "./pages/MesasComandasPage";
import PedidosCocinaPage from "./pages/PedidosCocinaPage";
import CajaPagosPage from "./pages/CajaPagosPage";

import type { Comanda } from "./types";
import { useAuth } from "./context/AuthContext"; // Importa useAuth

export default function App() {
  // *** YA NO SIMULAMOS EL ROL, LO OBTENEMOS DEL CONTEXTO ***
  const { user } = useAuth(); // Obtiene el objeto user del contexto

  // Si el usuario no ha iniciado sesión, o el contexto no está listo, usa valores por defecto
  const userName = user ? user.username : "";
  const userRole = user ? user.role : "invitado"; // Un rol por defecto si no hay user

  const [comandasCocina, setComandasCocina] = useState<Comanda[]>([]);

  const addComandaToCocina = (newComanda: Comanda) => {
    setComandasCocina((prevComandas) => [...prevComandas, newComanda]);
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Todas las rutas ahora usarán el userRole y userName del contexto */}
      {/* ... (el resto de tus rutas con Plantilla) ... */}
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
      {/* ... y así para todas las demás rutas que usen Plantilla ... */}
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
    </Routes>
  );
}
