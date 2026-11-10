// Base URL of the React app (used inside e-mails). Set CLIENT_URL in .env for production.
const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");

module.exports = clientUrl;
