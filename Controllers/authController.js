const user=require("../Models/user");
const bcrypt=require("bcrypt");
constjwt=require("jsonwebtoken");
const{login}=require("../Services/authService");

exports.signin=async(req,res,next)=>{
    try{
        const{email,password}=req.body;
       const result=await login(email,password);
       res.status(200).json(result);
    }catch(error){
        console.log(error);
        next (console.error);
        
    }
};