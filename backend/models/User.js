const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Asegúrate de haber instalado 'bcryptjs' con npm install bcryptjs

const userSchema = new mongoose.Schema({
  username: { // <-- DEBE SER 'username'
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: { // <-- DEBE SER 'password'
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'manager'], // Ajusta estos roles según los que vayas a usar
    default: 'user',
  },
}, { timestamps: true });

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas durante el login
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);