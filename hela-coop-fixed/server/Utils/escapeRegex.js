// Escapes user input before it is used inside a MongoDB $regex.
// Without this, a search like "(a+)+$" can freeze the server (ReDoS).
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = escapeRegex;
