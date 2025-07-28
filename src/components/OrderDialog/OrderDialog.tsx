// src/components/OrderDialog/OrderDialog.tsx
import React, { useState, useEffect } from "react";
import "./OrderDialog.css";
import type { Mesa, ComandaItem, MenuItem } from "../../types";

interface OrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceOrder: (items: ComandaItem[], mesa: Mesa) => void;
  mesaSeleccionada: Mesa | null;
  menu: MenuItem[]; // El menú fijo que le pasamos
}

const OrderDialog: React.FC<OrderDialogProps> = ({
  isOpen,
  onClose,
  onPlaceOrder,
  mesaSeleccionada,
  menu,
}) => {
  // Estado para los items seleccionados en la comanda
  const [currentOrderItems, setCurrentOrderItems] = useState<ComandaItem[]>([]);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);

  // Limpiar el diálogo cuando se abre o la mesa cambia
  useEffect(() => {
    if (isOpen) {
      setCurrentOrderItems([]); // Resetear items al abrir
      setOrderMessage(null); // Limpiar mensajes
    }
  }, [isOpen, mesaSeleccionada]);

  // Agrupar el menú por categoría para facilitar la visualización
  const menuByCategory = menu.reduce((acc, item) => {
    (acc[item.categoria] = acc[item.categoria] || []).push(item);
    return acc;
  }, {} as Record<MenuItem["categoria"], MenuItem[]>);

  // Manejar adición/modificación de un item al pedido
  const handleAddItemToOrder = (menuItem: MenuItem) => {
    setCurrentOrderItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.menuItemId === menuItem.id
      );
      if (existingItemIndex > -1) {
        // Si el item ya está, incrementa la cantidad
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          cantidad: newItems[existingItemIndex].cantidad + 1,
        };
        return newItems;
      } else {
        // Si el item no está, añádelo
        return [
          ...prevItems,
          {
            menuItemId: menuItem.id,
            nombre: menuItem.nombre,
            cantidad: 1,
            precioUnitario: menuItem.precio,
            notas: "", // Puedes añadir un campo para notas aquí si lo deseas
          },
        ];
      }
    });
  };

  // Manejar el cambio de cantidad de un item ya añadido
  const handleChangeItemQuantity = (menuItemId: string, quantity: number) => {
    setCurrentOrderItems((prevItems) => {
      const newItems = prevItems
        .map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, cantidad: Math.max(0, quantity) } // Asegura cantidad no negativa
            : item
        )
        .filter((item) => item.cantidad > 0); // Elimina items con cantidad 0

      // Si todos los items se eliminan, asegura un estado vacío
      if (newItems.length === 0) {
        setOrderMessage("La comanda está vacía.");
      }
      return newItems;
    });
  };

  // Calcular el total de la comanda actual
  const calculateTotal = (): number => {
    return currentOrderItems.reduce(
      (sum, item) => sum + item.cantidad * item.precioUnitario,
      0
    );
  };

  const handleSubmitOrder = () => {
    if (!mesaSeleccionada) {
      setOrderMessage("Error: No hay mesa seleccionada.");
      return;
    }
    if (currentOrderItems.length === 0) {
      setOrderMessage("Por favor, añade al menos un producto a la comanda.");
      return;
    }

    onPlaceOrder(currentOrderItems, mesaSeleccionada);
    onClose(); // Cerrar el diálogo después de enviar la orden
  };

  if (!isOpen || !mesaSeleccionada) return null;

  return (
    <div className="order-modal-overlay">
      <div className="order-modal-content">
        <button className="order-close-button" onClick={onClose}>
          &times;
        </button>
        <h3>
          Crear Comanda para {mesaSeleccionada.numero} (
          {mesaSeleccionada.id.startsWith("b") ? "Silla" : "Mesa"})
        </h3>

        <div className="menu-selection-area">
          {Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category} className="menu-category">
              <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <div className="menu-items-grid">
                {items.map((item) => (
                  <button
                    key={item.id}
                    className="menu-item-btn"
                    onClick={() => handleAddItemToOrder(item)}
                  >
                    <span className="item-name">{item.nombre}</span>
                    <span className="item-price">
                      ${item.precio.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="current-order-summary">
          <h4>Productos en Comanda:</h4>
          {currentOrderItems.length === 0 ? (
            <p className="no-items-message">
              Aún no hay productos en la comanda.
            </p>
          ) : (
            <ul>
              {currentOrderItems.map((item) => (
                <li key={item.menuItemId}>
                  <div className="order-item-detail">
                    <span className="item-name-qty">
                      {item.nombre} (x{item.cantidad})
                    </span>
                    <span className="item-subtotal">
                      ${(item.cantidad * item.precioUnitario).toFixed(2)}
                    </span>
                  </div>
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        handleChangeItemQuantity(
                          item.menuItemId,
                          item.cantidad - 1
                        )
                      }
                    >
                      -
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      onClick={() =>
                        handleChangeItemQuantity(
                          item.menuItemId,
                          item.cantidad + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="order-total">
            <strong>Total: ${calculateTotal().toFixed(2)}</strong>
          </div>
        </div>

        {orderMessage && <p className="order-message error">{orderMessage}</p>}

        <div className="order-dialog-actions">
          <button className="cancel-order-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="place-order-btn" onClick={handleSubmitOrder}>
            Enviar Comanda
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDialog;
