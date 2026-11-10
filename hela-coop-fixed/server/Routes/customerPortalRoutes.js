const express=require("express");
const{getCustomerSavings,myTransactions}=require("../Controllers/customerPortalController");
const{protectCustomer,ownCustomerOnly}=require("../Middlewares/authMiddleware");
const{apiLimiter}=require("../Middlewares/rateLimitter");

const router=express.Router();

router.use(apiLimiter);
router.get("/savings/:id",protectCustomer,ownCustomerOnly("id"),getCustomerSavings);
router.get("/transactions/:id",protectCustomer,ownCustomerOnly("id"),myTransactions);

module.exports=router;