const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ¡¡¡AÑADE ESTA LÍNEA AQUÍ!!!
// Esta ruta responderá cuando tu frontend (o el navegador) intente acceder a la raíz del backend (http://localhost:3000/)
app.get('/', (req, res) => {
  res.send('¡El servidor backend de Restaurante1 está funcionando correctamente!');
});

app.use("/auth", require("./routes/auth"));
app.use("/roles", require("./routes/roles"));
app.use("/users", require("./routes/users"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));