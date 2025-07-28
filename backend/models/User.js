// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { // Asegúrate de que este es el nombre del campo para el nombre de usuario
    type: String,
    required: true,
    unique: true, // Esto asegura que cada usuario tenga un nombre de usuario único
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: [
      'user',
      'mesonero',
      'cocinero',
      'cajero',
      'gerente',
      'super_admin'
    ],
    default: 'user',
  },
}, { timestamps: true });

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);