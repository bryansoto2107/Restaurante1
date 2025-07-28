// backend/models/Role.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { // <-- ¡DEBE SER 'name' para coincidir con las rutas de roles!
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: { // Descripción opcional del rol
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Role", roleSchema);