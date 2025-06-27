const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "jimenezcasanova77@gmail.com",
        pass: "ztiv jnno udtm kvgq",
    }
});

const sendMail = async (to, subject, text) => {
    return transporter.sendMail({
        from: `"Sistema de Seguridad" <${"jimenezcasanova77@gmail.com"}>`,
        to,
        subject,
        text,
    });
};

module.exports = { sendMail };