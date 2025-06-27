const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('usuarios', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    matricula: { type: DataTypes.STRING },
    nombres: { type: DataTypes.TEXT },
    apellidos: { type: DataTypes.TEXT },
    email: { type: DataTypes.STRING, unique: true },
    telefono: { type: DataTypes.STRING },
    programa: { type: DataTypes.STRING },
    cuatrimestre: { type: DataTypes.INTEGER },
    passwordHash: { type: DataTypes.TEXT },
    secret2FA: { type: DataTypes.TEXT }
}, {
    timestamps: false
});

module.exports = User;
