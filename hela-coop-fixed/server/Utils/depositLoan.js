const Savings=require("../Models/savings");
const Transaction=require("../Models/transactions");
const debitLoanMoney=async(accountNumber,principalAmount)=>{
        const savingExist=await Savings.findOne({accountNumber});
        if(!savingExist){
            throw new Error("account not found");
        }
        if(savingExist.isActive===false){
            throw new Error("account is not active");
        }
        const balance=savingExist.balance+principalAmount;
             savingExist.balance = balance;
             await savingExist.save();
             return(balance)
};
module.exports=debitLoanMoney;