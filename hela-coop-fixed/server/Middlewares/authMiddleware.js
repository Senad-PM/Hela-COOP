const User=require("../Models/user");
const Customer=require("../Models/customer");
const jwt=require("jsonwebtoken");
const httpError=require("../Utils/httpError");

const getBearerToken=(req)=>{
    const header=req.headers.authorization;
    if(header && header.startsWith("Bearer ")){
        return header.split(" ")[1];
    }
    return null;
};

const protect=async(req,res,next)=>{
    try{
        const token=getBearerToken(req);
        if(!token){
            throw httpError("Not authorized, no token",401);
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.id).select("-password");
        if(!user){
            throw httpError("user not found",401);
        }
        if(!user.isActive){
            throw httpError("Account is deactivated",403);
        }
        req.user=user;
        next();
    }catch(error){
        next(error);
    }
};
const authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return next(httpError("user is not authorized",403));
        }
        next();
    };
};
const protectCustomer=async(req,res,next)=>{
    try{
        const token=getBearerToken(req);
        if(!token){
            throw httpError("Not authorized, no token",401);
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const customer=await Customer.findById(decoded.id).select("-password");
        if(!customer){
            throw httpError("customer not found",401);
        }
        if(!customer.isActive){
            throw httpError("Account is deactivated",403);
        }
        req.customer=customer;
        next();
    }catch(error){
        next(error);
    }
};
// A customer may only read their own data.
const ownCustomerOnly=(paramName)=>{
    return (req,res,next)=>{
        if(!req.customer || String(req.customer._id)!==String(req.params[paramName])){
            return next(httpError("you can only access your own data",403));
        }
        next();
    };
};
module.exports={protect,authorize,protectCustomer,ownCustomerOnly};
