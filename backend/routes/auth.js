const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de que esta ruta sea correcta para tu modelo de usuario
const bcrypt = require('bcryptjs'); // Importa bcryptjs para comparar contraseñas (aunque el método en el modelo es mejor)

// =========================================================
// RUTA DE REGISTRO DE USUARIO (PARA CREAR NUEVOS USUARIOS)
// POST /auth/register
// =========================================================
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body; // Recibe el usuario, contraseña y opcionalmente el rol del frontend

  try {
    // 1. Verificar si el usuario ya existe en la base de datos
    let user = await User.findOne({ username });
    if (user) {
      // Si el usuario ya existe, devuelve un error 400
      return res.status(400).json({ message: 'El nombre de usuario ya existe. Por favor, elige otro.' });
    }

    // 2. Crear una nueva instancia del modelo de usuario
    // La contraseña se hasheará automáticamente gracias al middleware 'pre-save' en tu modelo User.js
    user = new User({
      username,
      password,
      role: role || 'user', // Asigna el rol recibido o 'user' por defecto si no se proporciona
    });

    // 3. Guardar el nuevo usuario en la base de datos
    await user.save();

    // 4. Respuesta exitosa de registro
    res.status(201).json({
      message: '¡Usuario registrado exitosamente!',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    // Manejo de errores del servidor
    console.error('Error al registrar usuario en el backend:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
  }
});

// =========================================================
// RUTA DE INICIO DE SESIÓN DE USUARIO (LOGIN)
// POST /auth/login
// =========================================================
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // Recibe el usuario y contraseña del frontend

  try {
    // 1. Buscar el usuario en la base de datos por el nombre de usuario
    const user = await User.findOne({ username });
    if (!user) {
      // Si el usuario no se encuentra, devuelve un error 400 (credenciales inválidas)
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    // 2. Comparar la contraseña ingresada (sin hashear) con la contraseña hasheada almacenada
    // Usamos el método 'matchPassword' que definimos en el modelo User.js
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Si las contraseñas no coinciden, devuelve un error 400
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    // 3. Si las credenciales son correctas
    // Aquí es donde normalmente generarías un token de autenticación (JWT)
    // (Para eso necesitarías la librería 'jsonwebtoken' y un secreto en tu .env)
    // const jwt = require('jsonwebtoken');
    // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respuesta exitosa de inicio de sesión
    res.status(200).json({
      message: '¡Inicio de sesión exitoso!',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      // token: token // Si generas un token, envíalo aquí
    });

  } catch (error) {
    // Manejo de errores del servidor
    console.error('Error al iniciar sesión en el backend:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
  }
});

module.exports = router;