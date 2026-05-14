const user=require("../Models/user");
const bcrypt=require("bcrypt");
constjwt=require("jsonwebtoken");
const{ login,forgotPassword,resetPassword}=require("../Services/authService");

exports.signin=async(req,res,next)=>{
    try{
        const{email,password}=req.body;
       const result=await login(email,password);
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
}