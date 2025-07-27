const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

router.post("/", auth(["gerente", "super admin"]), async (req, res) => {
  const { usuario, contraseña, rol } = req.body;

  const hashed = bcrypt.hashSync(contraseña, 10);
  const newUser = new User({ usuario, contraseña: hashed, rol });

  try {
    await newUser.save();
    res.status(201).json({ mensaje: "Usuario creado" });
  } catch (err) {
    res.status(400).json({ mensaje: "Error al crear usuario", error: err });
  }
});

module.exports = router;
