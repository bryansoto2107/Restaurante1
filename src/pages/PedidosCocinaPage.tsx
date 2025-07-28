// src/pages/PedidosCocinaPage.tsx
import React from "react";
import type { Comanda } from "../types";
import "./PedidosCocinaPage.css"; // Asumo que crearás un CSS para esta página

interface PedidosCocinaPageProps {
  comandas: Comanda[]; // Comandas recibidas del App.tsx
  setComandas: React.Dispatch<React.SetStateAction<Comanda[]>>; // Función para actualizar comandas
}

export default function PedidosCocinaPage({
  comandas,
  setComandas,
}: PedidosCocinaPageProps) {
  // Función para cambiar el estado de una comanda
  const handleUpdateComandaStatus = (
    comandaId: string,
    newStatus: Comanda["estado"]
  ) => {
    setComandas((prevComandas) =>
      prevComandas.map((comanda) =>
        comanda.id === comandaId ? { ...comanda, estado: newStatus } : comanda
      )
    );
  };

  // Filtra las comandas por estado para mostrarlas en diferentes secciones
  const pendientes = comandas.filter((c) => c.estado === "pendiente");
  const enProceso = comandas.filter((c) => c.estado === "en_proceso");
  const listas = comandas.filter((c) => c.estado === "lista");
  const entregadas = comandas.filter((c) => c.estado === "entregada");
  const canceladas = comandas.filter((c) => c.estado === "cancelada");

  return (
    <div className="pedidos-cocina-page">
      <h2>Página de Pedidos de Cocina</h2>
      <p>
        Aquí el cocinero recibirá las comandas y podrá actualizar su estado.
      </p>

      <div className="comanda-columns">
        <div className="comanda-column">
          <h3>Pendientes ({pendientes.length})</h3>
          {pendientes.length === 0 ? (
            <p>No hay pedidos pendientes.</p>
          ) : (
            pendientes.map((comanda) => (
              <div key={comanda.id} className="comanda-card pendiente">
                <h4>
                  {comanda.areaNombre} - Mesa/Silla {comanda.numeroMesa} (ID:{" "}
                  {comanda.id.substring(0, 8)}...)
                </h4>
                <p>Total: ${comanda.total.toFixed(2)}</p>
                <h5>Items:</h5>
                <ul>
                  {comanda.items.map((item, idx) => (
                    <li key={idx}>
                      {item.cantidad}x {item.nombre}
                    </li>
                  ))}
                </ul>
                <div className="comanda-actions">
                  <button
                    onClick={() =>
                      handleUpdateComandaStatus(comanda.id, "en_proceso")
                    }
                    className="btn-process"
                  >
                    En Proceso
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateComandaStatus(comanda.id, "cancelada")
                    }
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="comanda-column">
          <h3>En Proceso ({enProceso.length})</h3>
          {enProceso.length === 0 ? (
            <p>No hay pedidos en proceso.</p>
          ) : (
            enProceso.map((comanda) => (
              <div key={comanda.id} className="comanda-card en-proceso">
                <h4>
                  {comanda.areaNombre} - Mesa/Silla {comanda.numeroMesa} (ID:{" "}
                  {comanda.id.substring(0, 8)}...)
                </h4>
                <p>Total: ${comanda.total.toFixed(2)}</p>
                <h5>Items:</h5>
                <ul>
                  {comanda.items.map((item, idx) => (
                    <li key={idx}>
                      {item.cantidad}x {item.nombre}
                    </li>
                  ))}
                </ul>
                <div className="comanda-actions">
                  <button
                    onClick={() =>
                      handleUpdateComandaStatus(comanda.id, "lista")
                    }
                    className="btn-ready"
                  >
                    Listo
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateComandaStatus(comanda.id, "cancelada")
                    }
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="comanda-column">
          <h3>Listos para Entregar ({listas.length})</h3>
          {listas.length === 0 ? (
            <p>No hay pedidos listos.</p>
          ) : (
            listas.map((comanda) => (
              <div key={comanda.id} className="comanda-card lista">
                <h4>
                  {comanda.areaNombre} - Mesa/Silla {comanda.numeroMesa} (ID:{" "}
                  {comanda.id.substring(0, 8)}...)
                </h4>
                <p>Total: ${comanda.total.toFixed(2)}</p>
                <h5>Items:</h5>
                <ul>
                  {comanda.items.map((item, idx) => (
                    <li key={idx}>
                      {item.cantidad}x {item.nombre}
                    </li>
                  ))}
                </ul>
                <div className="comanda-actions">
                  <button
                    onClick={() =>
                      handleUpdateComandaStatus(comanda.id, "entregada")
                    }
                    className="btn-deliver"
                  >
                    Entregado
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="completed-canceled-orders">
        <h3>
          Pedidos Entregados ({entregadas.length}) / Cancelados (
          {canceladas.length})
        </h3>
        <div className="comanda-grid-delivered-canceled">
          {entregadas.map((comanda) => (
            <div key={comanda.id} className="comanda-card entregada">
              <h4>
                {comanda.areaNombre} - Mesa/Silla {comanda.numeroMesa} (ID:{" "}
                {comanda.id.substring(0, 8)}...)
              </h4>
              <p>Total: ${comanda.total.toFixed(2)}</p>
              <p className="status-label">Estado: Entregado</p>
            </div>
          ))}
          {canceladas.map((comanda) => (
            <div key={comanda.id} className="comanda-card cancelada">
              <h4>
                {comanda.areaNombre} - Mesa/Silla {comanda.numeroMesa} (ID:{" "}
                {comanda.id.substring(0, 8)}...)
              </h4>
              <p>Total: ${comanda.total.toFixed(2)}</p>
              <p className="status-label">Estado: Cancelado</p>
            </div>
          ))}
          {entregadas.length === 0 && canceladas.length === 0 && (
            <p className="no-items-message">
              No hay pedidos entregados o cancelados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
