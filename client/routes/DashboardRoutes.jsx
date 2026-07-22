const express=require("express");
const {AdminDashboard,StaffDashboard}=require("../Controllers/dasheBoardController");
const {protect,authorize}=require("../Middlewares/authMiddleware");

const router=express.Router();
router.get("/admin",protect,authorize("admin"),AdminDashboard);
router.get("/staff",protect,authorize("staff","manager"),StaffDashboard);

module.exports=router;