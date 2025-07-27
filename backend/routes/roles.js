const express = require("express");
const router = express.Router();
const Role = require("../models/Role");
const auth = require("../middleware/authMiddleware");

router.get("/", auth(), async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
});

router.post("/", auth(["gerente", "super admin"]), async (req, res) => {
  try {
    const newRole = new Role({ nombre: req.body.nombre });
    await newRole.save();
    res.status(201).json({ mensaje: "Rol creado" });
  } catch (err) {
    res.status(400).json({ mensaje: "Error", error: err });
  }
});

router.delete("/:id", auth(["gerente", "super admin"]), async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Rol eliminado" });
  } catch {
    res.status(404).json({ mensaje: "Rol no encontrado" });
  }
});

module.exports = router;
