// src/pages/RegisterUserPage.tsx
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import RegisterDialog from "../components/RegisterDialog/RegisterDialog";
import "./RegisterUserPage.css";

// Define la interfaz para un usuario (ajústala si tu modelo tiene más campos)
interface User {
  _id: string;
  username: string;
  role: string;
  createdAt: string; // Opcional, si lo tienes en tu modelo
  updatedAt: string; // Opcional, si lo tienes en tu modelo
}

export default function RegisterUserPage() {
  // Estados para gestionar los datos de la página
  const [users, setUsers] = useState<User[]>([]); // Lista de usuarios
  const [isLoadingUsers, setIsLoadingUsers] = useState(true); // Estado de carga de la tabla de usuarios
  const [fetchError, setFetchError] = useState<string | null>(null); // Errores al cargar usuarios

  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controla la visibilidad del diálogo
  const [dialogMessage, setDialogMessage] = useState<string | null>(null); // Mensaje en el diálogo (éxito/error)
  const [isSuccess, setIsSuccess] = useState(false); // Indica si el mensaje del diálogo es de éxito o error

  // URL base de tu backend (asegúrate de que coincida con donde corre tu backend)
  const API_BASE_URL = "http://localhost:3000";

  // Función para obtener la lista de usuarios desde el backend
  const fetchUsers = async () => {
    setIsLoadingUsers(true); // Inicia el estado de carga
    setFetchError(null); // Limpia cualquier error anterior
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: User[] = await response.json();
      setUsers(data); // Actualiza el estado con los usuarios obtenidos
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setFetchError(
        "Error al cargar usuarios. Por favor, asegúrate de que el backend esté funcionando."
      );
    } finally {
      setIsLoadingUsers(false); // Finaliza el estado de carga
    }
  };

  // useEffect para cargar los usuarios cuando el componente se monta por primera vez
  useEffect(() => {
    fetchUsers();
  }, []); // El array vacío [] asegura que se ejecute solo una vez al montar el componente

  // Función para abrir el diálogo de registro
  const openDialog = () => {
    setIsDialogOpen(true);
    setDialogMessage(null); // Limpiar mensajes anteriores al abrir el diálogo
  };

  // Función para cerrar el diálogo
  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogMessage(null);
  };

  // Función para manejar el registro de un nuevo usuario
  const handleRegisterUser = async (formData: {
    username: string;
    password: string;
    role: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsSuccess(false);
        setDialogMessage(
          data.message || "Error desconocido al registrar usuario."
        );
        return;
      }

      // Si el registro fue exitoso
      setIsSuccess(true);
      setDialogMessage(data.message || "Usuario registrado exitosamente.");
      fetchUsers(); // Recargar la lista de usuarios después de un registro exitoso
      // No cerramos el diálogo aquí automáticamente para que el usuario pueda ver el mensaje de éxito
      // y cerrarlo manualmente. Si prefieres que se cierre: closeDialog();
    } catch (error) {
      console.error("Error en el registro del frontend:", error);
      setIsSuccess(false);
      setDialogMessage(
        "No se pudo conectar con el servidor para registrar el usuario."
      );
    }
  };

  // Función para manejar la eliminación de un usuario (futura implementación)
  const handleDeleteUser = async (userId: string) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este usuario?")
    ) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        // Aquí podrías añadir headers con el token de autenticación si tu backend lo requiere
        // headers: {
        //   "Authorization": `Bearer ${yourAuthToken}`,
        // },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setDialogMessage("Usuario eliminado exitosamente.");
      setIsSuccess(true);
      fetchUsers(); // Recargar la lista después de eliminar
      setIsDialogOpen(true); // Mostrar el diálogo con el mensaje de éxito
    } catch (error: any) {
      console.error("Error al eliminar usuario:", error);
      setDialogMessage(`Error al eliminar usuario: ${error.message}`);
      setIsSuccess(false);
      setIsDialogOpen(true); // Mostrar el diálogo con el mensaje de error
    }
  };

  // Función para manejar la edición de un usuario (futura implementación)
  const handleEditUser = (user: User) => {
    // Aquí puedes abrir el diálogo de registro/edición
    // y precargarlo con los datos del usuario para editar
    alert(`Editar usuario: ${user.username} (ID: ${user._id})`);
    // Tendrías que pasar el usuario al diálogo y cambiar su modo a "edición"
  };

  return (
    <div className="register-user-page">
      <h2>Gestión de Usuarios</h2>

      <div className="header-actions">
        <h3>Usuarios Existentes</h3>
        <button className="add-user-btn" onClick={openDialog}>
          <FaPlus />
          Registrar Nuevo Usuario
        </button>
      </div>

      <div className="users-table-container">
        {isLoadingUsers ? (
          <p>Cargando usuarios...</p>
        ) : fetchError ? (
          <p className="error-message">{fetchError}</p>
        ) : users.length === 0 ? (
          <p>No hay usuarios registrados aún.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditUser(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Diálogo de Registro de Usuario */}
      <RegisterDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onRegister={handleRegisterUser} // Aquí se pasa la función handleRegisterUser
        message={dialogMessage}
        isSuccess={isSuccess}
      />
    </div>
  );
}
