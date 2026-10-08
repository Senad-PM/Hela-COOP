const Savings=require("../Models/savings");
const Customer=require("../Models/customer");
const customer = require("../Models/customer");
const Transaction=require("../Models/transactions");
const { default: mongoose } = require("mongoose");
const savings = require("../Models/savings");
const buildPagination=require("../Utils/buildPaginations");
const buildSort=require("../Utils/buildSort");
const calculateInterest=require("../Utils/calculateInterest");
const calculateFixedInterest=require("../Utils/calculateFixedInterest");

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
        let maturityDate=new Date();
        if(accountType==="fixed"){
                const fixedCount=await Savings.countDocuments({accountType:"fixed"});
                const nextAcount=fixedCount+1;
                const fomatNumber=nextAcount.toString().padStart(4,"0");
                accountNumber=`FIX-${fomatNumber}`;      
                const months = Number(durationMonths);

                const startDate = new Date();

                const testDate = new Date(startDate.getTime());

                testDate.setMonth(testDate.getMonth() + months);

                maturityDate = testDate;
        }

        const newAcount= await Savings.create({
                accountNumber,
                customer:customerExist._id,
               // customerNumber:customerExist.customerNumber,
                accountType,
                balance:initialDeposit || 0,
                interestRate,
                durationMonths,
                maturityDate:maturityDate,
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
                 accountType:newAcount.accountType,
                 accountNumber,
                 transactionType:"deposit",
                 amount:initialDeposit,
                 balanceAfter:initialDeposit,
                 performedBy:user._id,
                 description:"acount opening"
        });
        return(newAcount);
};
const MIN_BALANCE = 1000;

const nextTransactionNumber = async () => {
  const count = await Transaction.countDocuments();
  return `TRAN-${(count + 1).toString().padStart(4, "0")}`;
};

exports.deposit = async (depositData, user) => {
  const { accountNumber } = depositData;
  const amount = Number(depositData.amount); // body values can arrive as strings
  if (!accountNumber || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("account number and a valid amount are required");
  }
  const savingsExist = await Savings.findOne({ accountNumber });
  if (!savingsExist) throw new Error("invalid account number");
  if (savingsExist.isActive === false) throw new Error("account is not active, cannot deposit");
  if (savingsExist.accountType !== "regular") throw new Error("only regular savings can deposit money");

  const balance = savingsExist.balance + amount;
  await Transaction.create({
    transactionNumber: await nextTransactionNumber(),
    savingsAccount: savingsExist._id,
    accountType: savingsExist.accountType,
    accountNumber,
    transactionType: "deposit",
    amount,
    balanceAfter: balance,
    performedBy: user._id,
    description: "deposit",
  });
  savingsExist.balance = balance;
  await savingsExist.save();
  return balance;
};

exports.withdraw = async (withdrawData, user) => {
  const { accountNumber } = withdrawData;
  const amount = Number(withdrawData.amount);
  if (!accountNumber || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("account number and a valid amount are required");
  }
  const savingsExist = await Savings.findOne({ accountNumber });
  if (!savingsExist) throw new Error("savings account not found");
  if (savingsExist.isActive === false) throw new Error("account is not active");
  if (savingsExist.accountType !== "regular") throw new Error("only regular savings can withdraw money");
  if (savingsExist.balance - amount < MIN_BALANCE) throw new Error("insufficient balance");

  const balance = savingsExist.balance - amount;
  await Transaction.create({
    transactionNumber: await nextTransactionNumber(),
    savingsAccount: savingsExist._id,
    accountType: savingsExist.accountType,
    accountNumber,
    transactionType: "withdraw",
    amount,
    balanceAfter: balance,
    performedBy: user._id,
    description: "withdraw",
  });
  savingsExist.balance = balance;
  await savingsExist.save();
  return balance;
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
exports.applyDailyInterest=async(accountNumber)=>{
        const saving=await Savings.findOne({accountNumber});
        if(!saving){
                throw new Error("account not found");
        }
        if(saving.isActive===false){
                throw new Error("account is not active");
        }
        const today = new Date();

        if(saving.lastInterestApplied){

        const lastDate =
          saving.lastInterestApplied;

        const sameDate =
           lastDate.toDateString() ===
           today.toDateString();

        if(sameDate){
               return { skipped: true };
         }
      } 
        const interest=calculateInterest(saving.balance,saving.interestRate);
      //  console.log(interest);
        const accuredBalance=saving.accuredInterest+interest;
      //  console.log(accuredBalance);
        saving.accuredInterest=accuredBalance;
        saving.lastInterestApplied=new Date();
        await saving.save();
       return{
        accountNumber,
        interestAdded:interest,
       };
};
exports.applyMonthlyInterest=async(accountNumber)=>{
        const saving=await Savings.findOne({accountNumber});
        if(!saving){
                throw new Error("account is not found");
        }
        if(saving.isActive===false){
                throw new Error("account is deactivated");
        }
        const today = new Date();

        if(saving.lastInterestApplied){

        const lastDate =
          saving.lastInterestApplied;

        const sameDate =
           lastDate.getDate() ===
           today.getDate();
        
        const sameMonth=
            lastDate.getMonth()===
            today.getMonth();
        if(sameDate && sameMonth){
               return { skipped: true };
         }
      } 
        const accountBalance=saving.balance+saving.accuredInterest;
        saving.balance=accountBalance;
        const interestAmount=saving.accuredInterest;
        if(interestAmount<=0){
                return{skipped:true};
        }
        saving.accuredInterest = 0;
        await saving.save();
        let transactionNumber
        const transactionsCount=await Transaction.countDocuments();
        const nextCount=transactionsCount+1;
        const transNumber=nextCount.toString().padStart(4,"0");
        transactionNumber=`TRAN-${transNumber}`;
      const newTransaction=await Transaction.create({
                 transactionNumber,
                 savingsAccount:saving._id,
                 accountType:saving.accountType,
                 accountNumber,
                 transactionType:"interest",
                 amount:interestAmount,
                 balanceAfter:accountBalance,
                 description:"monthly interest"
        });
        return {
          accountNumber,
          interestCredited: interestAmount,
          newBalance: saving.balance
        };

};
exports.fixedAccountMaturety=async(accountNumber)=>{
        const fixedSaving=await Savings.findOne({accountNumber});
        if(!fixedSaving){
                throw new Error("account not found");
        }
        if(fixedSaving.isActive===false){
                throw new Error("account is deactivated");
        }
        if(fixedSaving.isMatured===true){
                throw new Error("account is already matured");
        }
        const today = new Date();
        if(today < fixedSaving.maturityDate){
               throw new Error("fixed deposit has not matured yet");
        }  
        const interest=calculateFixedInterest(fixedSaving.balance,fixedSaving.interestRate,fixedSaving.durationMonths);
        console.log("Balance:", fixedSaving.balance);
        console.log("Rate:", fixedSaving.interestRate);
        console.log("Duration:", fixedSaving.durationMonths);
        console.log("Interest:", interest);
        fixedSaving.balance+=interest;
        fixedSaving.isMatured=true;
        await fixedSaving.save();
         let transactionNumber
        const transactionsCount=await Transaction.countDocuments();
        const nextCount=transactionsCount+1;
        const transNumber=nextCount.toString().padStart(4,"0");
        transactionNumber=`TRAN-${transNumber}`;
        const newTransaction=await Transaction.create({
                 transactionNumber,
                 savingsAccount:fixedSaving._id,
                 accountType:fixedSaving.accountType,
                 accountNumber,
                 transactionType:"interest",
                 amount:interest,
                 balanceAfter:fixedSaving.balance,
                 description:"maturety interested debited"
        });
        return {
          accountNumber,
          interestCredited: interest,
          newBalance: fixedSaving.balance,
          matured:true
        };

}
