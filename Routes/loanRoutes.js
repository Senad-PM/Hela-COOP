const express=require("express");
const {loanCreation}=require("../Controllers/loanController");
const {protect,authorize}=require("../Middlewares/authMiddleware");

const router=express.Router();

router.post("/create",protect,authorize("staff"),loanCreation);

module.exports=router;