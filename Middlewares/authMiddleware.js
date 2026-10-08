const User=require("../Models/user");
const Customer=require("../Models/customer");
const jwt=require("jsonwebtoken");

const protect=async(req,res,next)=>{
    try{
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ){
          const token= req.headers.authorization.split(" ")[1];
          const decoded=jwt.verify(token,process.env.JWT_SECRET);
         const user = await User.findById(decoded.id).select("-password");
         if(!user){
            throw new Error("user not found"); 
         }
         req.user=user;
         next();

       }else{
          throw new Error("Not authorized, no token");
       }
    }catch(error){
        next(error)
    }
};
const authorize=(...roles)=>{
    return (req,res,next)=>{
           if(!roles.includes(req.user.role)){
            throw new Error("user is not authorized");
           }
           next();
    };
};
const protectCustomer=async(req,res,next)=>{
     try{
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ){
          const token= req.headers.authorization.split(" ")[1];
          const decoded=jwt.verify(token,process.env.JWT_SECRET);
         const customer = await Customer.findById(decoded.id).select("-password");
         if(!customer){
            throw new Error("customer not found"); 
         }
         req.customer=customer;
         next();

       }else{
          throw new Error("Not authorized, no token");
       }
    }catch(error){
        next(error)
    }
}
module.exports={protect,authorize,protectCustomer};