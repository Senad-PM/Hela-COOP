const express=require("express");
const {AdminDashboard,StaffDashboard,managerDashedboard}=require("../Controllers/dasheBoardController");
const {getActivityLogs,clearActivityLogs}=require("../Controllers/activityLogController");
const {getSettings,updateSettings}=require("../Controllers/settingsController");
const {protect,authorize}=require("../Middlewares/authMiddleware");
const {dashedboardLimiter}=require("../Middlewares/rateLimitter");

const router=express.Router();

router.use(dashedboardLimiter);
router.get("/admin",protect,authorize("admin"),AdminDashboard);
router.get("/staff",protect,authorize("staff"),StaffDashboard);
router.get("/manager",protect,authorize("manager"),managerDashedboard);

router.get("/activity-log",protect,authorize("admin"),getActivityLogs);
router.delete("/activity-log",protect,authorize("admin"),clearActivityLogs);

router.get("/settings",protect,authorize("admin"),getSettings);
router.put("/settings",protect,authorize("admin"),updateSettings);

module.exports=router;
