const validateFields = (requiredFields = []) => {
    return (req, res, next) => {
        const missing = requiredFields.filter((f) => !req.body[f]);
        if (missing.length) {
            return res.status(400).json({ message: 'Faltan campos obligatorios', fields: missing });
        }
        next();
    };
};

module.exports = validateFields;