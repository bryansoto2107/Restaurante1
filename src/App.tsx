import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Plantilla from "./components/plantilla/Plantilla";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <Plantilla
            tituloVentana="Nombre de la ventana"
            botones={["Inicio", "boton 2", "boton 1"]}
            usuario="Bryan"
            rol="Gerente"
            nombre="Bryan"
            contenido={<div>Aquí va el contenido dinámico del panel</div>}
          />
        }
      />
    </Routes>
  );
}
