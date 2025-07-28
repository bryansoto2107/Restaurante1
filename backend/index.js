// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Para permitir peticiones desde tu frontend
require("dotenv").config(); // Para cargar variables de entorno desde .env

const app = express();

// Middlewares
app.use(cors()); // Permite que tu frontend (localhost:5173) se conecte
app.use(express.json()); // Permite que Express lea JSON en el cuerpo de las peticiones

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('¡El servidor backend de Restaurante1 está funcionando correctamente!');
});

// Montar las rutas
// Las rutas se montan en prefijos específicos
app.use("/auth", require("./routes/auth")); // Todas las rutas en auth.js serán /auth/...
app.use("/roles", require("./routes/roles")); // Todas las rutas en roles.js serán /roles/...
app.use("/users", require("./routes/users")); // Todas las rutas en users.js serán /users/...

// Conexión a MongoDB y arranque del servidor
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("Error al conectar a MongoDB:", err));