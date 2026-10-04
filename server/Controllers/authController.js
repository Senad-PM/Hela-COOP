const user=require("../Models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const{ login,forgotPassword,resetPassword,refreshTokenGenarate,logOut}=require("../Services/authService");

exports.signin=async(req,res,next)=>{
    try{
       const{email,password,portal}=req.body;
       const result=await login(email,password,portal);
       res.status(200).json(result);
    }catch(error){
        console.log(error);
        next (error);        
    }
};
exports.forgotpasswords=async(req,res,next)=>{
    try{
        const{email}=req.body;
        const result= await forgotPassword(email);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};
exports.resetPasswords=async(req,res,next)=>{
     try{
        const{token}=req.params;
        const{password}=req.body;
        const result=await resetPassword(token,password);
        res.status(200).json(result);
     }catch(error){
        next(error);
     }
};
exports.refreshTokenGen=async(req,res,next)=>{
    try{
        const{refreshToken}=req.body;
        const result= await refreshTokenGenarate(refreshToken);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};
exports.logOutUser=async(req,res,next)=>{
    try{
        const{refreshToken}=req.body;
        const result=await logOut(refreshToken);
        res.status(200).json(result);
    }catch(error){
        next(error)
    }
};