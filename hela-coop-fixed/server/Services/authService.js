const User =require("../Models/user");
const generateToken=require("../Utils/generateToken");
const generateRefreshToken=require("../Utils/generateRefreshToken");
const sendEmail=require("../Utils/sendEmail");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const httpError=require("../Utils/httpError");
const clientUrl=require("../Utils/clientUrl");

exports.login=async(email,password,portal)=>{
    if(typeof email!=="string" || typeof password!=="string" || !email || !password){
        throw httpError("email and password are required",400);
    }
    const userExist=await User.findOne({email:email.trim().toLowerCase()}).select("+password");
    if(!userExist){
        throw httpError("Invalid credentials",401);
    }
    const ismatch=await userExist.comparePassword(password);
    if(!ismatch){
        throw httpError("Invalid credentials",401);
    }
    if(!userExist.isActive){
        throw httpError("Account is deactivated",403);
    }
    // The login screen has Staff / Manager / Admin tabs. The role always comes from the
    // database, but a mismatched tab is rejected so people sign in through the right portal.
    if(portal && portal!==userExist.role){
        throw httpError(`This account cannot sign in through the ${portal} portal`,403);
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
    if(typeof email!=="string" || !email.trim()){
        throw httpError("email is required",400);
    }
    // Same answer whether or not the e-mail exists (no account enumeration).
    // The reset link is ONLY e-mailed - never returned in the API response.
    const genericResponse={message:"If that e-mail is registered, a reset link has been sent"};
    const finduser= await User.findOne({email:email.trim().toLowerCase()});
    if(!finduser || !finduser.isActive){
        return genericResponse;
    }
    const resetToken=finduser.genarateResetPasswordToken()
    await finduser.save();
    const resetUrl=`${clientUrl}/set-password/${resetToken}`;
    await sendEmail({
        email:finduser.email,
        subject:"password Reset",
        message:`reset your password using this link:${resetUrl}`
    });
    return genericResponse;
}
exports.resetPassword=async(token,password)=>{
           if(typeof token!=="string" || typeof password!=="string" || !password){
              throw httpError("password is required",400);
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
            findUser.refreshToken=null;
            findUser.resetPasswordToken=undefined;
            findUser.resetPasswordExpire=undefined;
            await findUser.save();
            return{
                message:"password reset successful"
            };
};
exports.refreshTokenGenarate=async(refreshToken)=>{
     if(!refreshToken){
         throw new Error("no refresh token");
    }
    const decoded=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
    const finduser=await User.findById(decoded.id);
    if(!finduser || finduser.refreshToken !==refreshToken){
        throw httpError("invalid refresh token",401);
    }
    if(!finduser.isActive){
        throw httpError("Account is deactivated",403);
    }
    const newAccessToken=generateToken(finduser._id);
   return ({
        accessToken:newAccessToken
    });
};
exports.logOut=async(refreshToken)=>{
    if(!refreshToken){
        throw new Error("refreshToken is not found");
    }
    const findUser=await User.findOne({refreshToken});
    if(!findUser){
        throw new Error("user already logout");
    }
    findUser.refreshToken=null;
    await findUser.save();
    return("user logOut successfully");
};