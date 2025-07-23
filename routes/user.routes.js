const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/users', userCtrl.getAllUsers);
router.get('/user/:id', userCtrl.getUserById);
router.put('/user/:id', userCtrl.updateUser);
router.delete('/user/:id', userCtrl.deleteUser);
router.post('/pregunta', userCtrl.getPregunta);
router.post('/reset-password', userCtrl.resetPassword);
router.post('/validate-token', userCtrl.validateToken); // 👈 Validación externa
 
module.exports = router;
