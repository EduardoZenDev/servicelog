const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pregunta: { type: String, required: true },
  respuestapregunta: { type: String, required: true },
  refreshToken: { type: String } // NUEVO campo para el refresh token
});

module.exports = mongoose.model('User', userSchema);
