const express=require("express");
const {protect,authorize} = require("../Middlewares/authMiddleware");
const {apiLimiter} = require("../Middlewares/rateLimitter");
const {getAllActivities,getById} = require("../Controllers/activityController");

console.log(require("../Controllers/activityController"));

console.log("protect:", typeof protect);
console.log("authorize:", typeof authorize);
console.log("getAllActivities:", typeof getAllActivities);
console.log("getById:", typeof getById);

const router =express.Router();

router.use(apiLimiter);
router.get("/",protect,authorize("admin"),getAllActivities);
router.get("/:id",protect,authorize("admin"),getById);

module.exports=router;
