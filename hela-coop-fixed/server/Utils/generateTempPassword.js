const crypto = require("crypto");

// Random temporary password that satisfies the User/Customer password rules
// (upper + lower + digit + special, 8+ chars). Cryptographically random.
const generateTempPassword = () => `Aa1@${crypto.randomBytes(9).toString("base64url")}`;

module.exports = generateTempPassword;
