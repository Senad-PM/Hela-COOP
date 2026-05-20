const express=require("express");
const {addCustomer,getCustomers,getCustomerByCustomerNumber,updateCustomer,deactivateCustomer,activateCustomer,getCustomerById}=require("../Controllers/customerController");
const {protect,authorize}=require("../Middlewares/authMiddleware");

const router=express.Router();

router.post("/add",protect,authorize("staff"),addCustomer);
router.get("/",protect,authorize("staff"),getCustomers);
router.get("/:customerNumber",protect,authorize("staff"),getCustomerByCustomerNumber);
router.get("/:id",protect,authorize("staff"),getCustomerById);
router.put("/:customerNumber",protect,authorize("staff"),updateCustomer);
router.patch("/:customerNumber/deactivate",protect,authorize("staff"),deactivateCustomer);
router.patch("/:customerNumber/activate",protect,authorize("staff"),activateCustomer);


module.exports=router;