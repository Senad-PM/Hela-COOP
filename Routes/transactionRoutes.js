const express=require("express");
const{getTransactionsBySavingNumber}=require("../Controllers/transactionController");
const{protect,authorize}=require("../Middlewares/authMiddleware");

const router=express.Router();

router.get("/:accountNumber",protect,authorize("staff"),getTransactionsBySavingNumber);

module.exports=router;