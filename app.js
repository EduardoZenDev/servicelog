const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const userRoutes = require('./routes/user.routes');
app.use('/api', userRoutes); // <-- prefijo /api para todas las rutas

// Conexión a MongoDB
const mongoURI = process.env.MONGO_URI;
console.log("🔌 Intentando conectar a:", mongoURI);

mongoose.connect(mongoURI)
  .then(() => {
    console.log("✅ Conexión a MongoDB Atlas exitosa");
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error("❌ Error de conexión:", err);
  });
