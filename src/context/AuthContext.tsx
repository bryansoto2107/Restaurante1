// src/context/AuthContext.tsx
import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  user: { username: string; role: string } | null;
  login: (username: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null
  );

  const login = (username: string, role: string) => {
    setUser({ username, role });
    // Opcional: guardar en localStorage para persistencia
    localStorage.setItem("user", JSON.stringify({ username, role }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Cargar usuario del localStorage al iniciar la aplicación (opcional para persistencia)
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
