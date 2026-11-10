const express=require("express");
const{getTransactionsBySavingNumber,getTransactionByTransactionNumber,getAllTransactions}=require("../Controllers/transactionController");
const{protect,authorize}=require("../Middlewares/authMiddleware");
const {apiLimiter}=require("../Middlewares/rateLimitter");

const router=express.Router();

router.use(apiLimiter);
router.get("/account/:accountNumber",protect,authorize("staff"),getTransactionsBySavingNumber);
router.get("/:transactionNumber",protect,authorize("staff"),getTransactionByTransactionNumber);
router.get("/",protect,authorize("staff","manager"),getAllTransactions);

module.exports=router;