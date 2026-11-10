const cron=require("node-cron");
const Savings=require("../Models/savings");
const{applyDailyInterest}=require("../Services/savingsService");
//const savingsService =
   // require("../Services/savingsService");

//console.log(savingsService);


cron.schedule("0 0 * * *",async () => {
    const savingsExist=await Savings.find({isActive:"true",accountType:"regular"});
    for (const account of savingsExist){
        try{
            await applyDailyInterest(account.accountNumber);
        //console.log(account.accountNumber);
        }catch(error){
            console.error(error);
        }
    }
    
    
});

module.exports=cron;