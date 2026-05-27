const express=require("express");
const {addSavingsAcount,savingsDeposit,savingsWithdraw,getSavingsByAccountNumber,getSavings,acountDeactivate,accountActivate}=require("../Controllers/savingsController");
const{protect,authorize}=require("../Middlewares/authMiddleware");


const router=express.Router();
router.post("/create",protect,authorize("staff"),addSavingsAcount);
router.put("/deposit",protect,authorize("staff"),savingsDeposit);
router.put("/withdraw",protect,authorize("staff"),savingsWithdraw);
router.get("/:accountNumber",protect,authorize("staff"),getSavingsByAccountNumber);
router.get("/",protect,authorize("staff"),getSavings);
router.patch("/deactivate/:accountNumber",protect,authorize("staff"),acountDeactivate);
router.patch("/activate/:accountNumber",protect,authorize("staff"),accountActivate);


module.exports=router;