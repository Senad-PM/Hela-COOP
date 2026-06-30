const cron=require("node-cron");
const Loan=require("../Models/loan");
const Savings=require("../Models/savings");
const{repayLoan}=require("../Services/loanService");

cron.schedule("0 0 * * *",async()=>{
        const loanExist=await Loan.find({status:"active"});
        for(const loan of loanExist){
            try{
                 await repayLoan(loan.loanNumber);
            }catch(error){
                console.error(error);
            }
        }
});
module.exports=cron;