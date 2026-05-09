exports.errorhandler = (err, req, res, next) => {

   let statusCode = err.statusCode || 500;

   let message = err.message || "internal server error";

   // mongoose duplicate key error
   if (err.code === 11000) {
       statusCode = 400;
       message = "duplicate field value";
   }

   // mongoose validation error
   if (err.name === "ValidationError") {
       statusCode = 400;
       message = Object.values(err.errors)
           .map((val) => val.message)
           .join(", ");
   }

   // jwt invalid token
   if (err.name === "JsonWebTokenError") {
       statusCode = 401;
       message = "invalid token";
   }

   // jwt expired token
   if (err.name === "TokenExpiredError") {
       statusCode = 401;
       message = "Token expired";
   }

   res.status(statusCode).json({
       success: false,
       message
   });

};