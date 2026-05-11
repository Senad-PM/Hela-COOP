const express=require("express");
const {registerUser}=require("../Controllers/userController");
const{protect,authorize}=require("../Middlewares/authMiddleware");

const router=express.Router();
router.post("/register",protect,authorize("admin"),registerUser);

module.exports=router;