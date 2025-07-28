import { createContext, useState, useContext, type ReactNode } from 'react';

// 1. Define las interfaces para mayor claridad y seguridad de tipos
interface IUser {
  nombre: string;
  rol: string;
  // Agrega cualquier otro dato del usuario que necesites
}

interface IAuthContext {
  user: IUser | null;
  login: (userData: IUser) => void;
  logout: () => void;
}

// 2. Crea el Context con un valor inicial
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// 3. Crea el Proveedor (Provider) del Contexto
// Este componente envolverá tu aplicación y proveerá el estado
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  // Función para "iniciar sesión" a nivel de frontend
  const login = (userData: IUser) => {
    setUser(userData);
    // Opcional: podrías guardar el usuario o un token en localStorage para persistir la sesión
    // localStorage.setItem('user', JSON.stringify(userData));
  };

  // Función para "cerrar sesión"
  const logout = () => {
    setUser(null);
    // Opcional: limpiar localStorage
    // localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Crea un hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};