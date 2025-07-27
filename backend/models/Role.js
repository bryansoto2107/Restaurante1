const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { // <-- DEBE SER 'name'
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: { // <-- Opcional, pero buena práctica
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Role", roleSchema);