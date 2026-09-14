const express=require("express");
const{getCustomerSavings,myTransactions}=require("../Controllers/customerPortalController");
const{protectCustomer}=require("../Middlewares/authMiddleware");
const{apiLimiter}=require("../Middlewares/rateLimitter");

const router=express.Router();

router.use(apiLimiter);
router.get("/savings/:id",protectCustomer,getCustomerSavings);
router.get("/transactions/:id",protectCustomer,myTransactions);

module.exports=router;