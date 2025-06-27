const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const jwt = require('jsonwebtoken');
const { encrypt, decrypt } = require('../utils/crypto');
const { getUserByEmail, getUserById } = require('../models/user.service');
const { sendMail } = require('../utils/email');


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const encryptedEmail = encrypt(email);
    const user = await getUserByEmail(encryptedEmail);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const decryptedEmail = decrypt(user.email);

    const token = speakeasy.totp({
      secret: user.secret2FA,
      encoding: 'base32',
      step: 300,
    });

    await sendMail(
      decryptedEmail,
      'Código de Verificación 2FA',
      `Tu código de verificación es: ${token}`
    );

    res.status(200).json({ userId: user.id, message: 'Código de verificación 2FA enviado a tu correo electrónico' });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

const verify2FA = async (req, res) => {
  const { userId, token } = req.body;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isVerified = speakeasy.totp.verify({
      secret: user.secret2FA,
      encoding: 'base32',
      token,
      step: 300,
      window: 1
    });

    if (!isVerified) {
      return res.status(403).json({ message: 'Token 2FA inválido' });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token: accessToken });
  } catch (err) {
    console.error('Error en verificación 2FA:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login, verify2FA };