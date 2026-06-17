const express=require("express");
const {loanCreation,approveLoan,rejectLoan}=require("../Controllers/loanController");
const {protect,authorize}=require("../Middlewares/authMiddleware");

const router=express.Router();

router.post("/create",protect,authorize("staff"),loanCreation);
router.patch("/:loanNumber/approve",protect,authorize("manager"),approveLoan);
router.patch("/:loanNumber/reject",protect,authorize("manager"),rejectLoan);

module.exports=router;