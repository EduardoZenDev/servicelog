const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// CRUD usuarios
router.post('/users', userController.register);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Autenticación y recuperación
router.post('/login', userController.login);
router.post('/getPregunta', userController.getPregunta);
router.post('/resetPassword', userController.resetPassword);

module.exports = router;
