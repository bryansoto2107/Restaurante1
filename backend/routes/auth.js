// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Asegúrate de que esta ruta sea correcta a tu middleware auth.js

// Ruta de Registro
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body; // ¡IMPORTANTE: Usar 'username' aquí!

  // Validación básica
  if (!username || !password) {
    return res.status(400).json({ message: 'Por favor, introduce todos los campos requeridos (usuario y contraseña).' });
  }

  try {
    // Verificar si el usuario ya existe
    const user = await User.findOne({ username }); // Busca por el campo 'username'
    if (user) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
    }

    // Crear nuevo usuario
    const newUser = new User({
      username, // Asigna el username
      password,
      role: role || 'user', // Asigna el rol si se proporciona, sino 'user'
    });

    // Guardar usuario (el middleware pre-save en User.js hasheará la contraseña)
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });

  } catch (error) {
    console.error('Error al registrar usuario en el backend:', error.message);
    // Para errores de validación de Mongoose (como el enum de role), puedes ser más específico
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    // Para el error E11000 duplicate key, si el username está null o ya existe
    if (error.code === 11000) {
        // Este mensaje será más específico para el frontend
        return res.status(400).json({ message: 'El nombre de usuario ya existe. Por favor, elige otro.' });
    }
    res.status(500).json({ message: 'Error del servidor al registrar usuario.' });
  }
});

// Ruta de Login (si la tienes, la pongo como ejemplo)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // Generar JWT (asegúrate de tener una SECRET_KEY en tu .env)
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Usa una variable de entorno para tu clave secreta
      { expiresIn: '1h' }, // El token expira en 1 hora
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;