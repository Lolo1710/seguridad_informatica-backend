const express = require('express');
const { registerUser, getDashboardData } = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const validateFields = require('../middlewares/validateFields');
const router = express.Router();

router.post('/register', validateFields(['email', 'password', 'nombres', 'apellidos']), registerUser);
router.get('/dashboard', authenticateToken, getDashboardData);

module.exports = router;