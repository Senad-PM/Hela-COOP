const cron=require("node-cron");
const Savings=require("../Models/savings");
const{applyMonthlyInterest}=require("../Services/savingsService");

cron.schedule("0 0 1 * *",async () => {
    const savingsExist=await Savings.find({isActive:true,accountType:"regular"});
    for (const account of savingsExist){
        try{
            await applyMonthlyInterest(account.accountNumber);
        //console.log(account.accountNumber);
        }catch(error){
            console.error(error);
        }
    }
    
    
});

module.exports=cron;