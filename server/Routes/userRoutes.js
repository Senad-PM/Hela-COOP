const express=require("express");
const {registerUser,getAllUsers,getUserById,updateUser,deactivateUser,activateUser}=require("../Controllers/userController");
const{protect,authorize}=require("../Middlewares/authMiddleware");
const {apiLimiter}=require("../Middlewares/rateLimitter");

const router=express.Router();

router.use(apiLimiter);
router.post("/register",protect,authorize("admin"),registerUser);
router.get("/",protect,authorize("admin"),getAllUsers);
router.get("/:id",protect,authorize("admin"),getUserById);
router.put("/update/:id",protect,authorize("admin"),updateUser);
router.patch("/:id/deactivate",protect,authorize("admin"),deactivateUser);
router.patch("/:id/activate",protect,authorize("admin"),activateUser);


module.exports=router;