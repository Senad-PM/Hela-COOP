const express=require("express");
const {AdminDashboard,StaffDashboard,managerDashedboard,customerDashedBoard}=require("../Controllers/dasheBoardController");
const {protect,authorize,protectCustomer,ownCustomerOnly}=require("../Middlewares/authMiddleware");
const {dashedboardLimiter}=require("../Middlewares/rateLimitter");

const router=express.Router();

router.use(dashedboardLimiter);
router.get("/admin",protect,authorize("admin"),AdminDashboard);
router.get("/staff",protect,authorize("staff"),StaffDashboard);
router.get("/manager",protect,authorize("manager"),managerDashedboard);
router.get("/customer/:id",protectCustomer,ownCustomerOnly("id"),customerDashedBoard);

module.exports=router;
