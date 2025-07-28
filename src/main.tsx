import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "../src/Context/AuthContext";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Primero el Router para que todo lo de adentro pueda usar hooks de enrutamiento */}
    <BrowserRouter>
      {/* Luego el Provider para que App y sus hijos puedan usar el contexto */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);