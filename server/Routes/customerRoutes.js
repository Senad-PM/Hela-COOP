const express=require("express");
const {addCustomer,getCustomers,getCustomerByCustomerNumber,updateCustomer,deactivateCustomer,activateCustomer,getCustomerById}=require("../Controllers/customerController");
const {protect,authorize}=require("../Middlewares/authMiddleware");
const {apiLimiter}=require("../Middlewares/rateLimitter");

const router=express.Router();

router.use(apiLimiter);
router.post("/add",protect,authorize("staff"),addCustomer);
router.get("/",protect,authorize("staff","manager"),getCustomers);
router.get("/id/:id",protect,authorize("staff"),getCustomerById);
router.get("/:customerNumber",protect,authorize("staff"),getCustomerByCustomerNumber);
router.put("/:customerNumber",protect,authorize("staff"),updateCustomer);
router.patch("/:customerNumber/deactivate",protect,authorize("staff"),deactivateCustomer);
router.patch("/:customerNumber/activate",protect,authorize("staff"),activateCustomer);


module.exports=router;