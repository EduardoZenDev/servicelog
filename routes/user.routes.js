const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');

router.post('/register', userCtrl.register);
router.post('/getPregunta', userCtrl.getPregunta);
router.post('/login', userCtrl.login);
router.post('/resetPassword', userCtrl.resetPassword);
router.post('/logout', userCtrl.logout);
router.post('/refresh-token', userCtrl.refreshToken);

module.exports = router;
