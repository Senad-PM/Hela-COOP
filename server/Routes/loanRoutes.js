const express=require("express");
const {loanCreation,approveLoan,rejectLoan,distributionLoan,getAllLoans,getLoansByLoanNumber,getLoanStatics}=require("../Controllers/loanController");
const {protect,authorize}=require("../Middlewares/authMiddleware");

const router=express.Router();

router.post("/create",protect,authorize("staff"),loanCreation);
router.patch("/:loanNumber/approve",protect,authorize("manager"),approveLoan);
router.patch("/:loanNumber/reject",protect,authorize("manager"),rejectLoan);
router.patch("/:loanNumber/disbursed",protect,authorize("staff"),distributionLoan);
router.get("/loans",protect,authorize("staff","manager"),getAllLoans);
router.get("/loans/:loanNumber",protect,authorize("staff","manager"),getLoansByLoanNumber);
router.get("/statics",protect,authorize("staff","manager"),getLoanStatics);


module.exports=router;