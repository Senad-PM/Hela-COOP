const User =require("../Models/user");
const generateToken=require("../Utils/generateToken");
const generateRefreshToken=require("../Utils/generateRefreshToken");

const login=async(email,password)=>{
    const userExist=await User.findOne({email}).select("+password");
    if(!userExist){
        throw new Error("Invalid credentials");
    }
    if(!userExist.isActive){
        throw new Error("Acount is deactivated");
    }
    const ismatch=await userExist.comparePassword(password);
    if(!ismatch){
        throw new Error("invalid credentials");
    }
    const accessToken=generateToken(userExist._id);
    const refreshToken=generateRefreshToken(userExist._id);

    userExist.refreshToken=refreshToken;
    await userExist.save();
    return ({
        userId:userExist._id,
        role:userExist.role,
        refreshToken,
        accessToken
    });
};