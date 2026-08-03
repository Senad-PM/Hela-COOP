const Customer=require ("../Models/customer");
const generateToken=require("../Utils/generateToken");
const generateRefreshToken=require("../Utils/generateRefreshToken");
const sendEmail=require("../Utils/sendEmail");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");

exports.login=async(email,password)=>{
    const customerExist=await Customer.findOne({email}).select("+password");
    if(!customerExist){
        throw new Error("Invalid credentials");
    }
    if(!customerExist.isActive){
        throw new Error("Acount is deactivated");
    }
    const ismatch=await customerExist.comparePassword(password);
    if(!ismatch){
        throw new Error("invalid credentials");
    }
    const accessToken=generateToken(customerExist._id);
    const refreshToken=generateRefreshToken(customerExist._id);

    customerExist.refreshToken=refreshToken;
    await customerExist.save();
    return ({
        customerId:customerExist._id,
        refreshToken,
        accessToken
    });
};
exports.forgotPassword=async(email)=>{
    const findCustomer= await Customer.findOne({email});
    if(!findCustomer){
        throw new Error("user not found");
    }
    const resetToken=findCustomer.genarateResetPasswordToken()
    await findCustomer.save();
    const resetUrl=`http://localhost:5000/api/auth/reset-password/${resetToken}`;
    await sendEmail({
        email:findCustomer.email,
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
           const findCustomer = await Customer.findOne({
                       resetPasswordToken: hashedToken,
                       resetPasswordExpire: { $gt: Date.now() }
                 });
            if(!findCustomer){
                throw new Error("invalid or expired token");
            }
            findCustomer.password=password;
            findCustomer.resetPasswordToken=undefined;
            findCustomer.resetPasswordExpire=undefined;
            await findCustomer.save();
            return{
                message:"password reset successful"
            };
};
exports.refreshTokenGenarate=async(refreshToken)=>{
     if(!refreshToken){
         throw new Error("no refresh token");
    }
    const decoded=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
    const findCustomer=await Customer.findById(decoded.id);
    if(!findCustomer || findCustomer.refreshToken !==refreshToken){
        throw new Error("invalid refresh token");
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
    const findCustomer=await Customer.findOne({refreshToken});
    if(!findCustomer){
        throw new Error("user already logout");
    }
    findCustomer.refreshToken=null;
    await findCustomer.save();
    return("user logOut successfully");
};