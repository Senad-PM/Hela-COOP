const express=require("express");
const {addSavingsAcount,savingsDeposit,savingsWithdraw}=require("../Controllers/savingsController");
const{protect,authorize}=require("../Middlewares/authMiddleware");


const router=express.Router();
router.post("/create",protect,authorize("staff"),addSavingsAcount);
router.put("/deposit",protect,authorize("staff"),savingsDeposit);
router.put("/withdraw",protect,authorize("staff"),savingsWithdraw);


module.exports=router;