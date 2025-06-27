const crypto = require('crypto');
require('dotenv').config();

if (!process.env.AES_KEY || !process.env.AES_IV) {
  console.error("AES_KEY o AES_IV no están definidos");
  process.exit(1);
}

const key = Buffer.from(process.env.AES_KEY, 'hex');
const iv = Buffer.from(process.env.AES_IV, 'hex');

const encrypt = (text) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encrypted) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encrypt, decrypt };