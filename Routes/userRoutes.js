const express=require("express");
const {registerUser,getAllUsers}=require("../Controllers/userController");
const{protect,authorize}=require("../Middlewares/authMiddleware");

const router=express.Router();
router.post("/register",protect,authorize("admin"),registerUser);
router.get("/",protect,authorize("admin"),getAllUsers);


module.exports=router;