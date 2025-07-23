const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
// Rutas sugeridas (tú ya las tienes así en esencia)
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.post('/getPregunta', userCtrl.getPregunta);
router.post('/resetPassword', userCtrl.resetPassword);
router.post('/validate-token', userCtrl.validateToken);

// CRUD usuarios (puedes protegerlos con middleware si es necesario)
router.get('/users', userCtrl.getAllUsers);
router.get('/user/:id', userCtrl.getUserById);
router.put('/user/:id', userCtrl.updateUser);
router.delete('/user/:id', userCtrl.deleteUser);
router.post('/refresh-token', userCtrl.refreshToken);

module.exports = router;
