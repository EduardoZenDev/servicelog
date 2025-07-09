const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Crear usuario (Register)
exports.register = async (req, res) => {
  const { nombre, user, password, pregunta, respuestapregunta } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedRespuesta = await bcrypt.hash(respuestapregunta, 10);

    const newUser = new User({
      id: uuidv4(),
      nombre,
      user,
      password: hashedPassword,
      pregunta,
      respuestapregunta: hashedRespuesta
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -respuestapregunta');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }, '-password -respuestapregunta');
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { nombre, user, pregunta, respuestapregunta, password } = req.body;
    const foundUser = await User.findOne({ id: req.params.id });
    if (!foundUser) return res.status(404).json({ error: "Usuario no encontrado" });

    if (nombre) foundUser.nombre = nombre;
    if (user) foundUser.user = user;
    if (pregunta) foundUser.pregunta = pregunta;
    if (respuestapregunta) {
      foundUser.respuestapregunta = await bcrypt.hash(respuestapregunta, 10);
    }
    if (password) {
      foundUser.password = await bcrypt.hash(password, 10);
    }

    await foundUser.save();
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { user, password } = req.body;
  try {
    const foundUser = await User.findOne({ user });
    if (!foundUser) return res.status(404).json({ error: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, foundUser.password);
    if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

res.json({ message: "Inicio de sesión exitoso", id: foundUser.id, nombre: foundUser.nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener pregunta secreta
exports.getPregunta = async (req, res) => {
  const { user } = req.body;
  try {
    const foundUser = await User.findOne({ user });
    if (!foundUser) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ pregunta: foundUser.pregunta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resetear contraseña
exports.resetPassword = async (req, res) => {
  const { user, respuestapregunta, nuevaPassword } = req.body;
  try {
    const foundUser = await User.findOne({ user });
    if (!foundUser) return res.status(404).json({ error: "Usuario no encontrado" });

    const match = await bcrypt.compare(respuestapregunta, foundUser.respuestapregunta);
    if (!match) return res.status(403).json({ error: "Respuesta incorrecta" });

    const newHashedPassword = await bcrypt.hash(nuevaPassword, 10);
    foundUser.password = newHashedPassword;
    await foundUser.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
