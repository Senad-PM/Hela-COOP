const express=require("express");
const {AdminDashboard}=require("../Controllers/dasheBoardController");
const {protect,authorize}=require("../Middlewares/authMiddleware");

const router=express.Router();
router.get("/admin",protect,authorize("admin"),AdminDashboard);

module.exports=router;
