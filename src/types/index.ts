// src/types/index.ts

export interface MenuItem {
  id: string;
  nombre: string;
  precio: number;
  categoria: 'bebida' | 'comida' | 'postre';
}

export interface ComandaItem {
  menuItemId: string; // ID del item del menú
  nombre: string;     // Nombre del item (ej. "Hamburguesa")
  cantidad: number;
  precioUnitario: number; // Precio al momento de la comanda
  notas?: string;
}

export interface Comanda {
  id: string;
  mesaId: string;
  numeroMesa: number; // Número de la mesa
  areaNombre: string; // Nombre del área (ej. "Salón Principal")
  items: ComandaItem[];
  estado: 'pendiente' | 'en_proceso' | 'lista' | 'entregada' | 'cancelada';
  timestamp: Date;
  total: number;
}

export interface Mesa {
  id: string;
  numero: number;
  disponible: boolean;
  comandaActual?: Comanda; // Opcional: la comanda asociada si la mesa está ocupada
}

export interface Area {
  id: string;
  nombre: string;
  tipo: 'mesa' | 'barra' | 'terraza';
  capacidadTotal: number;
  mesas: Mesa[];
}

// Menú fijo del restaurante (precios según tu gusto)
export const RESTAURANT_MENU: MenuItem[] = [
  // Bebidas
  { id: 'b001', nombre: 'Coca-Cola', precio: 3.00, categoria: 'bebida' },
  { id: 'b002', nombre: 'Agua Mineral', precio: 2.50, categoria: 'bebida' },
  { id: 'b003', nombre: 'Nesty Té Durazno', precio: 4.00, categoria: 'bebida' },
  { id: 'b004', nombre: 'Malta Maltín', precio: 3.50, categoria: 'bebida' },
  { id: 'b005', nombre: 'Café Expreso', precio: 3.00, categoria: 'bebida' },

  // Comidas
  { id: 'c001', nombre: 'Hamburguesa Clásica', precio: 12.00, categoria: 'comida' },
  { id: 'c002', nombre: 'Pasticho de Carne', precio: 14.50, categoria: 'comida' },
  { id: 'c003', nombre: 'Sandwich Mixto', precio: 8.00, categoria: 'comida' },
  { id: 'c004', nombre: 'Tequeños (6u)', precio: 7.50, categoria: 'comida' },
  { id: 'c005', nombre: 'Pasta Alfredo', precio: 13.00, categoria: 'comida' },
  { id: 'c006', nombre: 'Arepa Reina Pepiada', precio: 9.00, categoria: 'comida' },
  { id: 'c007', nombre: 'Pizza Margarita Personal', precio: 10.00, categoria: 'comida' },
  { id: 'c008', nombre: 'Patacones Rellenos', precio: 11.00, categoria: 'comida' },

  // Postres
  { id: 'p001', nombre: 'Helado (2 bolas)', precio: 5.00, categoria: 'postre' },
  { id: 'p002', nombre: 'Torta de Chocolate', precio: 6.50, categoria: 'postre' },
  { id: 'p003', nombre: 'Barquilla de Fresa', precio: 4.00, categoria: 'postre' },
  { id: 'p004', nombre: 'Quesillo Casero', precio: 5.50, categoria: 'postre' },
];