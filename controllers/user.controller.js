import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave-ultra-secreta';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-clave-ultra-segura';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Registrar usuario
export const register = async (req, res) => {
  try {
    const { nombre, user, password, pregunta, respuestapregunta } = req.body;

    const existingUser = await User.findOne({ user });
    if (existingUser) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      user,
      password: hashedPassword,
      pregunta,
      respuestapregunta
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login de usuario
export const login = async (req, res) => {
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
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

    res.status(200).json({ token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resetear contraseña
export const resetPassword = async (req, res) => {
  try {
    const { user, respuestapregunta, nuevaPassword } = req.body;

    const existingUser = await User.findOne({ user });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (existingUser.respuestapregunta !== respuestapregunta) {
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
export const logout = async (req, res) => {
  try {
    // En aplicaciones reales deberías invalidar el refresh token del lado del servidor
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Refrescar token
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    jwt.verify(token, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Token inválido' });

      const payload = { id: decoded.id, user: decoded.user };
      const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.status(200).json({ token: newToken });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
