exports.errorhandler = (err, req, res, next) => {

   // Plain `new Error("...")` thrown by services are validation-style errors -> 400.
   // Anything else (TypeError, DB failure, ...) is a real server error -> 500.
   let statusCode = err.statusCode || (err.constructor === Error ? 400 : 500);

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

   // bad ObjectId etc.
   if (err.name === "CastError") {
       statusCode = 400;
       message = `invalid value for ${err.path}`;
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

   if (statusCode >= 500) {
       console.error(err);
       if (process.env.NODE_ENV === "production") {
           message = "internal server error";
       }
   }

   res.status(statusCode).json({
       success: false,
       message
   });

};