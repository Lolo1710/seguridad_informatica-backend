const bcrypt = require('bcrypt');
const { encrypt, decrypt } = require('../utils/crypto');
const { getUserById } = require('../models/user.service');
const { isValidPassword } = require('../utils/passwordValidator');
const speakeasy = require('speakeasy');
const User = require('../models/user.model');

const registerUser = async (req, res) => {
    const { matricula, nombres, apellidos, email, telefono, programa, cuatrimestre, password } = req.body;

    const errors = [];
    if (!/^[0-9]{9}$/.test(matricula)) errors.push('La matrícula debe tener exactamente 9 dígitos.');
    if (!nombres || typeof nombres !== 'string') errors.push('Nombres es obligatorio y debe ser texto.');
    if (!apellidos || typeof apellidos !== 'string') errors.push('Apellidos es obligatorio y debe ser texto.');
    if (!/^\d{9}@upqroo\.edu\.mx$/.test(email)) errors.push('Email debe tener el formato correcto: 9 dígitos + @upqroo.edu.mx.');
    if (!/^\d{10}$/.test(telefono)) errors.push('Teléfono debe contener exactamente 10 dígitos sin espacios.');
    if (!['IS', 'F', 'IF', 'IB', 'IBT', 'A', 'IC'].includes(programa.toUpperCase())) errors.push('Programa no válido kaka.');
    if (!Number.isInteger(Number(cuatrimestre)) || cuatrimestre < 1 || cuatrimestre > 10) errors.push('Cuatrimestre debe estar entre 1 y 10.');
    if (!isValidPassword(password)) errors.push('La contraseña no cumple los requisitos mínimos.');

    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(' ') });
    }

    try {
        const passwordHash = bcrypt.hashSync(password, 10);
        const encryptedNombres = encrypt(nombres);
        const encryptedApellidos = encrypt(apellidos);
        const encryptedEmail = encrypt(email);
        const encryptedTelefono = encrypt(telefono);
        const secret2FA = speakeasy.generateSecret().base32;

        const newUser = await User.create({
            matricula,
            nombres: encryptedNombres,
            apellidos: encryptedApellidos,
            email: encryptedEmail,
            telefono: encryptedTelefono,
            programa,
            cuatrimestre,
            passwordHash,
            secret2FA
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente', userId: newUser.id });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ message: 'Error en el servidor', error: err });
    }
};

const getDashboardData = async (req, res) => {
    try {
        const user = await getUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({
            id: user.id,
            matricula: user.matricula,
            nombres: decrypt(user.nombres),
            apellidos: decrypt(user.apellidos),
            email: decrypt(user.email),
            telefono: decrypt(user.telefono),
            programa: user.programa,
            cuatrimestre: user.cuatrimestre
        });
    } catch (err) {
        console.error('Error al obtener dashboard:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = { registerUser, getDashboardData };