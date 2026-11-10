// Small helper so services/middleware can throw errors with a proper HTTP status.
const httpError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

module.exports = httpError;
