const express = require('express');
const { login, verify2FA } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', login);
router.post('/verify-2fa', verify2FA);

module.exports = router;