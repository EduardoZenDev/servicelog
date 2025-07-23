const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'clave-ultra-secreta';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-clave-ultra-segura';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Registrar usuario
const register = async (req, res) => {
  try {
    const { nombre, user, password, pregunta, respuestapregunta } = req.body;

    const existingUser = await User.findOne({ user });
    if (existingUser) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedRespuesta = await bcrypt.hash(respuestapregunta, 10);

    const newUser = new User({
      nombre,
      user,
      password: hashedPassword,
      pregunta,
      respuestapregunta: hashedRespuesta,
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener pregunta secreta para recuperar contraseña
const getPregunta = async (req, res) => {
  try {
    const { user } = req.body;
    const existingUser = await User.findOne({ user });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ pregunta: existingUser.pregunta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login de usuario
// Login
const login = async (req, res) => {
  try {
    const { user, password } = req.body;
    const existingUser = await User.findOne({ user });
    if (!existingUser) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const payload = { id: existingUser._id, user: existingUser.user };
const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: JWT_EXPIRES_IN,
  issuer: 'LoginAPI',           // 👈 debes agregar esto
  audience: 'LoginAPIUsers'     // 👈 y esto también
});   const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
  expiresIn: JWT_REFRESH_EXPIRES_IN,
  issuer: 'LoginAPI',
  audience: 'LoginAPIUsers'
});
    // Aquí agregamos nombre e id en la respuesta
    res.status(200).json({
      token,
      refreshToken,
      id: existingUser._id,
      nombre: existingUser.nombre
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Resetear contraseña
const resetPassword = async (req, res) => {
  try {
    const { user, respuestapregunta, nuevaPassword } = req.body;

    const existingUser = await User.findOne({ user });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isRespuestaCorrecta = await bcrypt.compare(respuestapregunta, existingUser.respuestapregunta);
    if (!isRespuestaCorrecta) {
      return res.status(401).json({ error: 'Respuesta incorrecta' });
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout (simulado)
const logout = async (req, res) => {
  try {
    // Aquí podrías invalidar el refresh token si tienes almacenamiento
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Refrescar token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token requerido' });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Refresh token inválido' });

      const payload = { id: decoded.id, user: decoded.user };
      const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.status(200).json({ token: newToken });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  getPregunta,
  login,
  resetPassword,
  logout,
  refreshToken,
};
