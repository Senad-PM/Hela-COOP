const User =require("../Models/user");
const generateToken=require("../Utils/generateToken");
const generateRefreshToken=require("../Utils/generateRefreshToken");
const sendEmail=require("../Utils/sendEmail");
const crypto=require("crypto");
const user = require("../Models/user");

exports.login=async(email,password)=>{
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
exports.forgotPassword=async(email)=>{
    const finduser= await User.findOne({email});
    if(!finduser){
        throw new Error("user not found");
    }
    const resetToken=finduser.generateResetPasswordToken()
    await User.save();
    const resetUrl=`http://localhost:5000/api/auth/reset-password/${resetToken}`;
    await sendEmail({
        email:finduser.email,
        subject:"password Reset",
        message:`reset your password using this link:${resetUrl}`
    });
    return {
        message: "reset email generated",
        resetUrl
        };
}
exports.resetPassword=async(token,password)=>{
           if(!password){
              throw new Error("password is required");
           }
           const hashedToken=crypto.createHash("sha256").update(token).digest("hex");
           const findUser = await User.findOne({
                       resetPasswordToken: hashedToken,
                       resetPasswordExpire: { $gt: Date.now() }
                 });
            if(!findUser){
                throw new Error("invalid or expired token");
            }
            findUser.password=password;
            findUser.resetPasswordToken=undefined;
            findUser.resetPasswordExpire=undefined;
            await findUser.save();
            return{
                message:"password reset successful"
            };
};