const express=require("express");
const {signin,resetPasswords, refreshTokenGen,forgotpasswords,logOutUser}=require("../Controllers/authController");
const{
    protect,
    authorize
}=require("../Middlewares/authMiddleware");
const {loginLimiter}=require("../Middlewares/rateLimitter");


const router=express.Router();
router.post("/login",loginLimiter,signin);
router.post("/reset-password/:token",resetPasswords);
router.post("/forgot-password/:token",forgotpasswords);
router.post("/refresh-token",refreshTokenGen);
router.post("/logout",logOutUser);

module.exports=router;  



