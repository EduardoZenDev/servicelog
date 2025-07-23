
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');


router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.post('/getPregunta', userCtrl.getPregunta);  // recuerda implementar esta función
router.post('/resetPassword', userCtrl.resetPassword);
router.post('/validate-token', userCtrl.validateToken); // implementar o eliminar si no tienes

router.get('/users', userCtrl.getAllUsers);          // implementar o eliminar si no tienes
router.get('/user/:id', userCtrl.getUserById);       // implementar o eliminar si no tienes
router.put('/user/:id', userCtrl.updateUser);        // implementar o eliminar si no tienes
router.delete('/user/:id', userCtrl.deleteUser);     // implementar o eliminar si no tienes
router.post('/refresh-token', userCtrl.refreshToken);

module.exports = router;
