const Savings=require("../Models/savings");
const Customer=require("../Models/customer");
const customer = require("../Models/customer");
const Transaction=require("../Models/transactions");
const { default: mongoose } = require("mongoose");
const savings = require("../Models/savings");
const buildPagination=require("../Utils/buildPaginations");
const buildSort=require("../Utils/buildSort");

exports.createsavings=async(savingsData,user)=>{
        const{customerNumber,accountType,balance,durationMonths,initialDeposit}=savingsData;
        console.log(savingsData);
        if(!customerNumber || !accountType){
               throw new Error("all fields must be valid");
        }
        const customerExist=await Customer.findOne({customerNumber});
        if(!customerExist){
                throw new Error("customeer not found");
        }
        if(customerExist.isActive===false){
                throw new Error("Customeer is not active");
        }
        let interestRate;
        if(accountType==="regular"){
                interestRate=5;
        }if(accountType==="fixed")
                {
        const fixedRates={
                3:7,
                6:8,
                12:10
        }
         interestRate=fixedRates[durationMonths];
                }
       
        if (!initialDeposit || initialDeposit <= 0) {
              throw new Error("Deposit should be made at account creation");
        }
       
        let accountNumber;
        if(accountType==="regular"){
                 const regularExist=await Savings.findOne({customer:customerExist._id,accountType:"regular"});
                 if(regularExist){
                throw new Error("customer already have a acount");
                }
                const regularCount=await Savings.countDocuments({accountType:"regular"});
                const nextAcount=regularCount+1;
                const fomatNumber=nextAcount.toString().padStart(4,"0");
                accountNumber=`REG-${fomatNumber}`;

        }
        if(accountType==="fixed"){
                const fixedCount=await Savings.countDocuments({accountType:"fixed"});
                const nextAcount=fixedCount+1;
                const fomatNumber=nextAcount.toString().padStart(4,"0");
                accountNumber=`FIX-${fomatNumber}`;
        }
        const newAcount= await Savings.create({
                accountNumber,
                customer:customerExist._id,
                customerNumber:customerExist.customerNumber,
                accountType,
                balance:initialDeposit || 0,
                interestRate,
                durationMonths,
                createdBy:user
        });
        let transactionNumber
        const transactionsCount=await Transaction.countDocuments(transactionNumber);
        const nextCount=transactionsCount+1;
        const transNumber=nextCount.toString().padStart(4,0);
        transactionNumber=`TRAN-${transNumber}`;
        const newTransaction=Transaction.create({
                 transactionNumber,
                 savingsAccount:newAcount._id,
                 accountNumber,
                 transactionType:"deposit",
                 amount:initialDeposit,
                 balanceAfter:initialDeposit,
                 performedBy:user._id,
                 description:"acount opening"
        });
        return(newAcount);
};
exports.deposit=async(depositData,user)=>{
      const{accountNumber,amount}=depositData;
      if(!accountNumber || !amount){
        throw new Error("all must be filled");
      }
      const savingsExist=await Savings.findOne({accountNumber});
      if(!savingsExist){
        throw new Error("invalid account number");
      }
      if(savingsExist.isActive===false){
         throw new Error("account is not active cannot deposit");
      }
      if(!savingsExist.accountType==="regular"){
        throw new Error("only regular savings can deposit money");
      }
      const balance=savingsExist.balance+amount;
      let transactionNumber
      const transactionsCount=await Transaction.countDocuments();
      const nextCount=transactionsCount+1;
      const transNumber=nextCount.toString().padStart(4,"0");
      transactionNumber=`TRAN-${transNumber}`;
      //console.log(savingsExist);
      const newTransaction=await Transaction.create({
                 transactionNumber,
                 savingsAccount:savingsExist._id,
                 accountNumber,
                 transactionType:"deposit",
                 amount,
                 balanceAfter:balance,
                 performedBy:user._id,
                 description:"deposit"
        });
        
       savingsExist.balance = balance;
       await savingsExist.save();
        return (balance);
      
};
exports.withdraw=async(withdrawData,user)=>{
   const {accountNumber,amount}=withdrawData;
   if(!accountNumber || !amount){
        throw new Error("all field must be field");
   }
   const savingsExist=await Savings.findOne({accountNumber});
   if(!savingsExist){
        throw new Error("savings account not found ");
   }
   if(savingsExist.isActive===false){
        throw new Error("account is not active")
   }
   if(!savingsExist.accountType==="regular"){
         throw new Error("accountType should be regular");
   }
   if(savingsExist.balance-amount<=1000){
        throw new Error("insufficient balance");
   }
   const balance=savingsExist.balance-amount;
    let transactionNumber
      const transactionsCount=await Transaction.countDocuments();
      const nextCount=transactionsCount+1;
      const transNumber=nextCount.toString().padStart(4,"0");
      transactionNumber=`TRAN-${transNumber}`;
      //console.log(savingsExist);
      const newTransaction=await Transaction.create({
                 transactionNumber,
                 savingsAccount:savingsExist._id,
                 accountNumber,
                 transactionType:"withdraw",
                 amount,
                 balanceAfter:balance,
                 performedBy:user._id,
                 description:"withdraw"
        });
        savingsExist.balance=balance;
        await savingsExist.save();
        return(balance);
};
exports.getByAccountNumber=async(accountNumber)=>{
        if(!accountNumber){
                throw new Error("all filed must be filled");
        }
        const accountExist=await Savings.findOne({accountNumber}).populate("customer","customerNumber firstName lastName");
        if(!accountExist){
                throw new Error("account not found");
        }
        return(accountExist);
};
const buildFilter=(query)=>{
        const filter={};
        if(query.isActive!==undefined){
                filter.isActive=query.isActive==="true";
        }
        if(query.accountType!==undefined){
                filter.accountType=query.accountType;
        }
        if(query.search && query.search.trim() !==""){
                filter.$or=[
                        {
                              accountNumber:{
                                $regex:query.search,
                                $options:"i"
                              }  
                        }
                ];
        }
        return filter;

}
exports.getAllSavings=async(query)=>{
        const filter=buildFilter(query);
            const sortoption=buildSort(query);
              const{limit,skip,page}=buildPagination(query);
              const count=await Savings.countDocuments(filter);
                        if(count > 0 && skip >= count){
                           throw new Error("page not found");
                        }
              const savings=await  Savings.find(filter).populate(
                              "customer",
                              "customerNumber firstName lastName"
                               ).sort(sortoption).skip(skip).limit(limit);
               
              return({
                   "total":count,
                   "page":page,
                   "limit":limit,
                   "data":savings
               });
};
exports.deactivate=async(accountNumber)=>{
        const savingsExist=await Savings.findOne({accountNumber});
        if(!savingsExist){
                throw new Error("account not found");
        }
        if(savingsExist.isActive==="false"){
                throw new Error("account is already deactivated");
        }
        savingsExist.isActive=false;
        await savingsExist.save();
        return("acount is deactivated");
};
exports.activate=async(accountNumber)=>{
        const savingsExist=await Savings.findOne({accountNumber});
        if(!savingsExist){
                throw new Error("account not found");
        }
        if(savingsExist.isActive==="true"){
                throw new Error("account is already activated");
        }
        savingsExist.isActive=true;
        await savingsExist.save();
        return("acount is activated");
};

