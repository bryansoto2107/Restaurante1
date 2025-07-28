// backend/routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); // Middleware de autenticación (si lo usas)

// Ruta para obtener todos los usuarios (DESPROTEGIDA TEMPORALMENTE para desarrollo)
// Cuando implementes el login, DEBES volver a proteger esta ruta:
// router.get("/", auth(["super_admin", "gerente"]), async (req, res) => {
router.get("/", async (req, res) => { // Temporalmente sin el middleware 'auth'
  try {
    const users = await User.find().select('-password'); // No enviar contraseñas
    res.status(200).json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err.message);
    res.status(500).json({ message: "Error del servidor al obtener usuarios." });
  }
});

// ... (otras rutas para usuarios como DELETE, PUT)

// Ejemplo de ruta DELETE para usuario (sigue protegida, solo super_admin)
router.delete("/:id", auth(["super_admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});


module.exports = router;