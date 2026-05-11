const User=require("../Models/user");
const bcrypt=require("bcrypt");
constjwt=require("jsonwebtoken");

exports.createUser=async(userName,email,password,role)=>{
           console.log(userName, email, password, role);
           if(!userName || !email || !password || !role){
             throw new Error("all field must be filled ");
           }
           const userExist=await User.findOne({email})
           if(userExist){
            throw new Error("user already exists");
           }
          const newUser=await User.create({
            userName,
            email,
            password,
            role,
            
          })
           return({
             id:newUser._id,
             userName:newUser.userName,
             email:newUser.email,
             role:newUser.role,
             isActive:newUser.isActive   
           });
};