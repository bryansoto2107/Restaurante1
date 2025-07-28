// src/pages/MesasComandasPage.tsx

import { useState } from "react";
import "./MesasComandasPage.css";
import OrderDialog from "../components/OrderDialog/OrderDialog"; // Importa el nuevo diálogo
import type { Comanda, Mesa, Area, ComandaItem } from "../types";
import { RESTAURANT_MENU } from "../types";
// Datos de ejemplo para las áreas (esto normalmente vendría de tu backend)
// Mantenemos la estructura inicial de las áreas, pero ahora Mesa.comandaActual usa la nueva interfaz Comanda
const initialAreas: Area[] = [
  {
    id: "area-mesas",
    nombre: "Salón Principal",
    tipo: "mesa",
    capacidadTotal: 10,
    mesas: [
      { id: "m1", numero: 1, disponible: true },
      { id: "m2", numero: 2, disponible: true },
      {
        id: "m3",
        numero: 3,
        disponible: false,
        comandaActual: {
          id: "c001",
          mesaId: "m3",
          numeroMesa: 3,
          areaNombre: "Salón Principal",
          items: [
            {
              menuItemId: "c001",
              nombre: "Hamburguesa Clásica",
              cantidad: 1,
              precioUnitario: 12.0,
            },
          ],
          estado: "en_proceso",
          timestamp: new Date(),
          total: 12.0,
        },
      },
      { id: "m4", numero: 4, disponible: true },
      { id: "m5", numero: 5, disponible: true },
      {
        id: "m6",
        numero: 6,
        disponible: false,
        comandaActual: {
          id: "c002",
          mesaId: "m6",
          numeroMesa: 6,
          areaNombre: "Salón Principal",
          items: [
            {
              menuItemId: "b001",
              nombre: "Coca-Cola",
              cantidad: 2,
              precioUnitario: 3.0,
            },
          ],
          estado: "pendiente",
          timestamp: new Date(),
          total: 6.0,
        },
      },
      { id: "m7", numero: 7, disponible: true },
      { id: "m8", numero: 8, disponible: true },
      { id: "m9", numero: 9, disponible: true },
      { id: "m10", numero: 10, disponible: true },
    ],
  },
  {
    id: "area-barra",
    nombre: "Barra",
    tipo: "barra",
    capacidadTotal: 5,
    mesas: [
      { id: "b1", numero: 1, disponible: true },
      { id: "b2", numero: 2, disponible: true },
      {
        id: "b3",
        numero: 3,
        disponible: false,
        comandaActual: {
          id: "c003",
          mesaId: "b3",
          numeroMesa: 3,
          areaNombre: "Barra",
          items: [
            {
              menuItemId: "b005",
              nombre: "Café Expreso",
              cantidad: 1,
              precioUnitario: 3.0,
            },
          ],
          estado: "lista",
          timestamp: new Date(),
          total: 3.0,
        },
      },
      { id: "b4", numero: 4, disponible: true },
      { id: "b5", numero: 5, disponible: true },
    ],
  },
  {
    id: "area-terraza",
    nombre: "Terraza Exterior",
    tipo: "terraza",
    capacidadTotal: 5,
    mesas: [
      { id: "t1", numero: 1, disponible: true },
      { id: "t2", numero: 2, disponible: true },
      { id: "t3", numero: 3, disponible: true },
      {
        id: "t4",
        numero: 4,
        disponible: false,
        comandaActual: {
          id: "c004",
          mesaId: "t4",
          numeroMesa: 4,
          areaNombre: "Terraza Exterior",
          items: [
            {
              menuItemId: "p001",
              nombre: "Helado (2 bolas)",
              cantidad: 1,
              precioUnitario: 5.0,
            },
          ],
          estado: "pendiente",
          timestamp: new Date(),
          total: 5.0,
        },
      },
      { id: "t5", numero: 5, disponible: true },
    ],
  },
];

interface MesasComandasPageProps {
  onPlaceOrderToCocina: (comanda: Comanda) => void; // Función para enviar la comanda a App.tsx
}

export default function MesasComandasPage({
  onPlaceOrderToCocina,
}: MesasComandasPageProps) {
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [selectedMesaForOrder, setSelectedMesaForOrder] = useState<Mesa | null>(
    null
  ); // Mesa para el diálogo de orden
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false); // Estado del diálogo de orden
  const [statusMessage, setStatusMessage] = useState<string | null>(null); // Mensajes de éxito/error en la página

  // Función para calcular mesas disponibles en un área
  const getMesasDisponibles = (area: Area): number => {
    return area.mesas.filter((mesa) => mesa.disponible).length;
  };

  // Manejar la selección de una mesa (para abrir el diálogo de comanda)
  const handleSelectMesa = (mesa: Mesa, areaName: string) => {
    if (mesa.disponible) {
      setSelectedMesaForOrder(mesa);
      setIsOrderDialogOpen(true); // Abrir el diálogo de comanda
      setStatusMessage(null); // Limpiar mensajes
    } else {
      setStatusMessage(
        `La ${areaName} ${
          mesa.numero
        } está ocupada. Comanda actual: ${mesa.comandaActual?.items
          .map((item) => `${item.cantidad} ${item.nombre}`)
          .join(", ")}`
      );
      setSelectedMesaForOrder(null);
    }
  };

  // Manejar cuando se coloca una orden desde el diálogo
  const handlePlaceOrder = (items: ComandaItem[], mesa: Mesa) => {
    const totalComanda = items.reduce(
      (sum, item) => sum + item.cantidad * item.precioUnitario,
      0
    );

    const areaOfMesa = areas.find((area) =>
      area.mesas.some((m) => m.id === mesa.id)
    );

    const newComanda: Comanda = {
      id: `c${Date.now()}-${mesa.id}`, // ID único para la comanda
      mesaId: mesa.id,
      numeroMesa: mesa.numero,
      areaNombre: areaOfMesa ? areaOfMesa.nombre : "Desconocida",
      items: items,
      estado: "pendiente", // Estado inicial
      timestamp: new Date(),
      total: totalComanda,
    };

    // 1. Actualizar el estado de la mesa a no disponible y asignarle la comanda
    setAreas((prevAreas) =>
      prevAreas.map((area) => ({
        ...area,
        mesas: area.mesas.map((m) =>
          m.id === mesa.id
            ? { ...m, disponible: false, comandaActual: newComanda }
            : m
        ),
      }))
    );

    // 2. Enviar la comanda a la página del cocinero a través de la prop
    onPlaceOrderToCocina(newComanda);

    setStatusMessage(
      `Comanda para ${areaOfMesa?.nombre} ${
        mesa.numero
      } creada y enviada a cocina. Total: $${totalComanda.toFixed(2)}`
    );
  };

  const closeOrderDialog = () => {
    setIsOrderDialogOpen(false);
    setSelectedMesaForOrder(null);
  };

  return (
    <div className="mesas-comandas-page">
      <h2>Página de Mesas y Comandas (Mesonero)</h2>
      <p>
        Aquí el mesonero podrá ver el estado de las mesas, crear comandas y
        enviarlas a cocina.
      </p>

      <div className="areas-container">
        {areas.map((area) => (
          <div key={area.id} className="area-card">
            <h3>
              {area.nombre} ({area.tipo === "barra" ? "Sillas" : "Mesas"})
            </h3>
            <p>Total: {area.capacidadTotal}</p>
            <p>
              Disponibles:{" "}
              <span className="disponibles">{getMesasDisponibles(area)}</span>
            </p>
            <div className="mesas-grid">
              {area.mesas.map((mesa) => (
                <button
                  key={mesa.id}
                  className={`mesa-item ${
                    mesa.disponible ? "disponible" : "ocupada"
                  } ${selectedMesaForOrder?.id === mesa.id ? "selected" : ""}`}
                  onClick={() => handleSelectMesa(mesa, area.nombre)}
                  title={
                    mesa.disponible
                      ? `Mesa ${mesa.numero} disponible`
                      : `Mesa ${
                          mesa.numero
                        } ocupada: ${mesa.comandaActual?.items
                          .map((item) => `${item.cantidad} ${item.nombre}`)
                          .join(", ")}`
                  }
                >
                  {mesa.numero}
                  {!mesa.disponible && (
                    <span className="estado-ocupada">Ocupada</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {statusMessage && (
        <p
          className={`status-message ${
            statusMessage.includes("creada y enviada") ? "success" : "error"
          }`}
        >
          {statusMessage}
        </p>
      )}

      {/* Diálogo de Creación de Comanda */}
      <OrderDialog
        isOpen={isOrderDialogOpen}
        onClose={closeOrderDialog}
        onPlaceOrder={handlePlaceOrder}
        mesaSeleccionada={selectedMesaForOrder}
        menu={RESTAURANT_MENU} // Pasa el menú fijo al diálogo
      />
    </div>
  );
}
