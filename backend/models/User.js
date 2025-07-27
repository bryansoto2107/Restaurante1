const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Asegúrate de haber instalado 'bcryptjs' con npm install bcryptjs

const userSchema = new mongoose.Schema({
  // Cambiado 'usuario' a 'username' para coincidir con el frontend
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Elimina espacios en blanco al inicio/final
  },
  // Cambiado 'contraseña' a 'password' para coincidir con el frontend
  password: {
    type: String,
    required: true,
  },
  // Cambiado 'rol' a 'role' para consistencia, y añadido enum y default
  role: {
    type: String,
    enum: ['admin', 'user', 'manager'], // Define los roles permitidos
    default: 'user', // Rol por defecto si no se especifica
  },
}, { timestamps: true }); // Opcional: añade campos createdAt y updatedAt automáticamente

// *** Middleware para hashear la contraseña antes de guardar ***
// Se ejecuta antes de que se guarde un documento de usuario
userSchema.pre('save', async function(next) {
  // Solo hashear la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified('password')) {
    return next(); // Si la contraseña no ha cambiado, pasa al siguiente middleware
  }
  // Generar un "salt" para hashear la contraseña
  const salt = await bcrypt.genSalt(10); // 10 es un buen número para la fuerza del salt
  // Hashear la contraseña usando el salt
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Pasa al siguiente middleware (o guarda el documento)
});

// *** Método para comparar contraseñas durante el login ***
// Este método estará disponible en las instancias de usuario (ej. user.matchPassword())
userSchema.methods.matchPassword = async function(enteredPassword) {
  // Compara la contraseña ingresada (sin hashear) con la hasheada almacenada en la DB
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);