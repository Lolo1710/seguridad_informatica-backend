const User = require('./user.model');

const getUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

const getUserById = async (id) => {
    return await User.findByPk(id);
};

module.exports = { getUserByEmail, getUserById };