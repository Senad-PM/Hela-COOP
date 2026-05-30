const cron=require("node-cron");
const Savings=require("../Models/savings");
const{applyInterest}=require("../Services/savingsService");
//const savingsService =
   // require("../Services/savingsService");

//console.log(savingsService);


cron.schedule("0 0 1 * *",async () => {
    const savingsExist=await Savings.find({isActive:"true",accountType:"regular"});
    for (const account of savingsExist){
        try{
            await applyInterest(account.accountNumber);
        //console.log(account.accountNumber);
        }catch(error){
            console.error(error);
        }
    }
    
    
});

module.exports=cron;