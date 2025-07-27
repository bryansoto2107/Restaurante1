const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Role", roleSchema);
