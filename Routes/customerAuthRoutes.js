const express=require("express");
const {signin,resetPasswords, refreshTokenGen,forgotpasswords,logOutUser}=require("../Controllers/customerAuthenticationController");
const {loginLimiter}=require("../Middlewares/rateLimitter");


const router=express.Router();
router.post("/login",loginLimiter,signin);
router.post("/reset-password/:token",resetPasswords);
router.post("/forgot-password",forgotpasswords);
router.post("/refresh-token",refreshTokenGen);
router.post("/logout",logOutUser);

module.exports=router;  



