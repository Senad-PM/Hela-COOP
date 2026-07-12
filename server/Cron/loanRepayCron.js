const cron=require("node-cron");
const Loan=require("../Models/loan");
const Savings=require("../Models/savings");
const{repayLoan}=require("../Services/loanService");


console.log("Loan repayment cron loaded");
cron.schedule("* * * * *",async()=>{
        const loanExist=await Loan.find({status:"active"});
        for(const loan of loanExist){
            try{ 
                 const today=new Date();
                 const dueDate=loan.nextDueDate;
                 
               if(today.getTime()>=dueDate.getTime()){
                    //console.log("its runnig");
                    console.log("its runnig");
                 await repayLoan(loan.loanNumber);
               }
               console.log(loan.loanNumber);
                
            }catch(error){
                console.error(error);
            }
        }
});
module.exports=cron;