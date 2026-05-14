const express=require("express");
const {signin,resetPasswords}=require("../Controllers/authController");
const{
    protect,
    authorize
}=require("../Middlewares/authMiddleware");

const router=express.Router();
router.post("/login",signin);
router.post("/reset-password/:token",resetPasswords);
module.exports=router;  



