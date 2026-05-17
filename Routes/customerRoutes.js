const express=require("express");
const {addCustomer,getCustomers,getCustomerByCustomerNumber}=require("../Controllers/customerController");
const {protect,authorize}=require("../Middlewares/authMiddleware");

const router=express.Router();

router.post("/add",protect,authorize("staff"),addCustomer);
router.get("/",protect,authorize("staff"),getCustomers);
router.get("/:customerNumber",protect,authorize("staff"),getCustomerByCustomerNumber);

module.exports=router;