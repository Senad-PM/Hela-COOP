const cron=require("node-cron");
const Savings=require("../Models/savings");
const{fixedAccountMaturety}=require("../Services/savingsService");

cron.schedule("0 0 * * *",async () => {
    const savingsExist=await Savings.find({isActive:true,accountType:"fixed"});
    for (const account of savingsExist){
        try{
            await fixedAccountMaturety(account.accountNumber);
        //console.log(account.accountNumber);
        }catch(error){
            console.error(error);
        }
    }
    
    
});

module.exports=cron;