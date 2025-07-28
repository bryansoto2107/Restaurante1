// src/components/RegisterDialog/RegisterDialog.tsx
import { useState, useEffect } from "react";
import "./RegisterDialog.css"; // ¡Importa el CSS aquí!

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (formData: {
    username: string;
    password: string;
    role: string;
  }) => Promise<void>;
  message: string | null;
  isSuccess: boolean;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({
  isOpen,
  onClose,
  onRegister,
  message,
  isSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mesonero"); // Valor por defecto

  // Limpiar campos y mensajes cuando el diálogo se abre/cierra
  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setPassword("");
      // No reseteamos el rol para que mantenga el valor por defecto si es deseado
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegister({ username, password, role });
  };

  if (!isOpen) return null; // No renderizar si no está abierto

  return (
    <div className="modal-overlay">
      {" "}
      {/* Contenedor principal del modal */}
      <div className="modal-content">
        {" "}
        {/* Contenido del diálogo */}
        <button className="close-button" onClick={onClose}>
          &times; {/* Carácter 'x' para cerrar */}
        </button>
        <h3>Registrar Nuevo Usuario</h3>
        <form className="register-form" onSubmit={handleSubmit}>
          {" "}
          {/* Formulario */}
          <div className="form-group">
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              {/* Opciones de rol - deben coincidir con tu enum del backend */}
              <option value="mesonero">Mesonero</option>
              <option value="cocinero">Cocinero</option>
              <option value="cajero">Cajero</option>
              <option value="gerente">Gerente</option>
              <option value="super_admin">Super Admin</option>
              <option value="user">Usuario (General)</option>
            </select>
          </div>
          {message && ( // Muestra el mensaje si existe
            <p className={`dialog-message ${isSuccess ? "success" : "error"}`}>
              {message}
            </p>
          )}
          <div className="dialog-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterDialog;
