// backend/routes/roles.js
const express = require("express");
const router = express.Router();
const Role = require("../models/Role"); // Importa el modelo de Rol
const auth = require("../middleware/auth"); // Tu middleware de autenticación

// =========================================================
// OBTENER TODOS LOS ROLES
// GET /roles/
// =========================================================
router.get("/", auth(["super_admin", "gerente"]), async (req, res) => { // Solo super_admin o gerente pueden ver los roles
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
// POST /roles/
// =========================================================
router.post("/", auth(["super_admin"]), async (req, res) => { // Solo super_admin puede crear roles
  try {
    const { name, description } = req.body; // Espera 'name' y 'description'
    const newRole = new Role({ name, description });
    await newRole.save();
    res.status(201).json({ message: "¡Rol creado exitosamente!", role: newRole });
  } catch (err) {
    console.error("Error al crear rol:", err.message);
    if (err.code === 11000) { // Error de duplicado de MongoDB
      return res.status(400).json({ message: "El nombre del rol ya existe." });
    }
    res.status(400).json({ message: "Error al crear rol.", error: err.message });
  }
});

// =========================================================
// ELIMINAR UN ROL POR ID
// DELETE /roles/:id
// =========================================================
router.delete("/:id", auth(["super_admin"]), async (req, res) => { // Solo super_admin puede eliminar roles
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