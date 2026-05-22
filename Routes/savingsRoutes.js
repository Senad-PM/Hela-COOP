const express=require("express");
const {addSavingsAcount}=require("../Controllers/savingsController");
const{protect,authorize}=require("../Middlewares/authMiddleware")

const router=express.Router();
router.post("/create",protect,authorize("staff"),addSavingsAcount);


module.exports=router;