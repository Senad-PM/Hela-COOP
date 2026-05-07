exports.errorhandler=async(err,req,res,next,)=>{
      
   let statusCode =err.statusCode || 500;

   let message=err.message || "internal server error";

   //mongoose duplecate key error
   if(err.code===11000){
       statusCode=400;
       message="duplicate field value";
   }

   //mongoose validation error
   if(err.name==="validationError"){
       statusCode=400;
       message=Object.values(err.errors)
       .map((val) =>val.message)
       .join(", ");
   }
   if(err.name="jsonWebTokenError"){
    statusCode=401;
    message="invalid token";
   }
   if(err.name="TokenExpiredError"){
    statusCode=401;
    message="Token expired";
   }
   res.status(statusCode).json({
     success:false,
    message
    });

};
module.exports=errorhandler;