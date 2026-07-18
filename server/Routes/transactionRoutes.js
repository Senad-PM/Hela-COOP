const express=require("express");
const{getTransactionsBySavingNumber,getTransactionByTransactionNumber,getAllTransactions}=require("../Controllers/transactionController");
const{protect,authorize}=require("../Middlewares/authMiddleware");

const router=express.Router();

router.get("/account/:accountNumber",protect,authorize("staff"),getTransactionsBySavingNumber);
router.get("/:transactionNumber",protect,authorize("staff"),getTransactionByTransactionNumber);
router.get("/",protect,authorize("staff","manager"),getAllTransactions);

module.exports=router;