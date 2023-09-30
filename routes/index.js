const express = require('express');
const router = express.Router();
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');

router.get('/', viewController.home);
router.get('/login', viewController.login);
router.get('/register', viewController.register);
router.get('/cart', viewController.cart);
router.get('/logout', authController.logout);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
