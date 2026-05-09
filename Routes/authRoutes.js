const express=require("express");
const {signin}=require("../Controllers/authController");
const{
    protect,
    authorize
}=require("../Middlewares/authMiddleware");

const router=express.Router();
router.post("/login",signin);

module.exports=router;  



