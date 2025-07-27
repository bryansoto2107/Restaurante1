const express = require("express");
const router = express.Router();
const Role = require("../models/Role"); // Asegúrate de que esta ruta sea correcta para tu modelo de Role
const auth = require("../middleware/authMiddleware"); // Asegúrate de que esta ruta sea correcta para tu middleware de auth

// =========================================================
// OBTENER TODOS LOS ROLES
// GET /api/roles (si tu index.js monta las rutas con /api)
// =========================================================
// Nota: La ruta '/' aquí significa la raíz de donde se monte este router.
// Si en index.js tienes app.use('/api/roles', rolesRoutes), entonces la ruta completa es /api/roles.
router.get("/", auth(["admin", "manager"]), async (req, res) => { // Ajusta los roles según tus necesidades (ej. "admin", "manager")
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    console.error("Error al obtener roles:", err.message);
    res.status(500).json({ message: "Error del servidor al obtener roles." });
  }
});

// =========================================================
// CREAR UN NUEVO ROL
// POST /api/roles
// =========================================================
router.post("/", auth(["admin", "manager"]), async (req, res) => { // Solo "admin" o "manager" pueden crear roles
  try {
    // CAMBIO CRUCIAL: Usar 'name' en lugar de 'nombre' para coincidir con el modelo Role.js
    const newRole = new Role({ name: req.body.name, description: req.body.description });
    await newRole.save();
    res.status(201).json({ message: "¡Rol creado exitosamente!", role: newRole }); // Incluye el rol creado en la respuesta
  } catch (err) {
    console.error("Error al crear rol:", err.message);
    // Manejo específico si el rol ya existe (unique: true en el modelo)
    if (err.code === 11000) { // Código de error de duplicado de MongoDB
      return res.status(400).json({ message: "El nombre del rol ya existe." });
    }
    res.status(400).json({ message: "Error al crear rol.", error: err.message });
  }
});

// =========================================================
// ELIMINAR UN ROL POR ID
// DELETE /api/roles/:id
// =========================================================
router.delete("/:id", auth(["admin"]), async (req, res) => { // Solo "admin" puede eliminar roles (más seguro)
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado." });
    }
    res.json({ message: "¡Rol eliminado exitosamente!" });
  } catch (err) {
    console.error("Error al eliminar rol:", err.message);
    res.status(500).json({ message: "Error del servidor al eliminar rol." });
  }
});

module.exports = router;