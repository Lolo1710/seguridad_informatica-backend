const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('seguridad', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;