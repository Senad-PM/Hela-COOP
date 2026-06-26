const Loan=require("../Models/loan");
const calculateEmi=require("../Utils/calculateEmi");
const Customer=require("../Models/customer");
const Transaction=require("../Models/transactions");
const Savings=require("../Models/savings");
const debitLoanMoney=require("../Utils/depositLoan");
const savings = require("../Models/savings");
const  calculateAmortizationShedule=require("../Utils/calculateAmortizationShedule");

exports.createLoan=async(loanData,user)=>{

    const {customerNumber,loanType,principalAmount,durationMonths}=loanData;
    if(customerNumber===undefined || loanType===undefined || principalAmount===undefined || durationMonths===undefined){
        throw new Error("all fileds must be filled");
    }
    if(principalAmount<=0){
        throw new Error("principal amount should be more than 0");
    }
    const customerExist=await Customer.findOne({customerNumber});
    if(!customerExist){
        throw new Error("customer not found");
    }
    if(customerExist.isActive===false){
        throw new Error("customer is not active");
    }
    let interestRate;
    if(loanType==="personal"){
        interestRate=14;
    }
    if(loanType==="buisness"){
        interestRate=10;
    }
    if(loanType==="emergency"){
        interestRate=15;
    }
    const savingExist=await Savings.findOne({customer:customerExist._id,accountType:"regular"});
    if(!savingExist){
        throw new Error("savings account not found");
    }
    if(savingExist.isActive===false){
        throw new Error("savings account is not active");
    }
    //console.log(savingExist.accountNumber);
    let loanNumber;
    if(loanType==="personal"){
    const loanCount=await Loan.countDocuments({loanType:"personal"});
    const nextloan=loanCount+1;
    const fomatNumber=nextloan.toString().padStart(4,"0");
    loanNumber=`PLOAN-${fomatNumber}`;      
    }
    if(loanType==="buisness"){
    const loanCount=await Loan.countDocuments({loanType:"buisness"});
    const nextloan=loanCount+1;
    const fomatNumber=nextloan.toString().padStart(4,"0");
    loanNumber=`BLOAN-${fomatNumber}`;      
    }
    if(loanType==="emergency"){
    const loanCount=await Loan.countDocuments({loanType:"emergency"});
    const nextloan=loanCount+1;
    const fomatNumber=nextloan.toString().padStart(4,"0");
    loanNumber=`ELOAN-${fomatNumber}`;      
    }
    const installment=calculateEmi(principalAmount,interestRate,durationMonths);
    const newLoan=await Loan.create({
            loanNumber,
            customer:customerExist._id,
            savingAccount:savingExist._id,
            loanType,
            principalAmount,
            interestRate,
            durationMonths,
            monthlyInstallment:installment,
            outstandingBalance:principalAmount,
            remainingInstallments:durationMonths,
            createdBy:user,          
    });
    let transactionNumber
        const transactionsCount=await Transaction.countDocuments(transactionNumber);
        const nextCount=transactionsCount+1;
        const transNumber=nextCount.toString().padStart(4,0);
        transactionNumber=`TRAN-${transNumber}`;
        const newTransaction=Transaction.create({
                  transactionNumber,
                  loanAccount:newLoan._id,
                 accountType:newLoan.loanType,
                 accountNumber:loanNumber,
                 transactionType:"loanAccountOpening",
                 amount:principalAmount,
                 balanceAfter:principalAmount,
                 performedBy:user._id,
                 description:"loan acount opening"
        });
        return({ 
            loanNumber,
            customer:customerExist.customerNumber,
            savingAccount:savingExist.accountNumber,
            loanType,
            principalAmount,
            interestRate,
            durationMonths,
            monthlyInstallment:installment,
            outstandingBalance:principalAmount,
            createdBy:user,});
             
};
exports.loanApproved=async(loanNumber,user)=>{
      const loanExist=await Loan.findOne({loanNumber});
      if(!loanExist){
        throw new Error("loan is not found");
      }
      if(loanExist.status!=="pending"){
        throw new Error("only pending loans can be approved");
      }
      loanExist.status="approved";
      loanExist.approvedBy=user._id;
      loanExist.approvedDate=new Date();
      await loanExist.save();
      return(loanExist);
};
exports.loanReject=async(loanNumber,user)=>{
      const loanExist=await Loan.findOne({loanNumber});
      if(!loanExist){
        throw new Error("loan is not found");
      }
      if(loanExist.status!=="pending"){
        throw new Error("Only pending loans can be rejected");
      }
      loanExist.status="rejected";
      loanExist.rejectedBy=user._id;
      loanExist.rejectedDate=new Date();
      await loanExist.save();
      return(loanExist);
};

exports.loanDistribution=async(loanNumber,user)=>{
       if(loanNumber===undefined || user===undefined){
          throw new Error("all field must filled");
       }
       const loanExist=await Loan.findOne({loanNumber});
       if(!loanExist){
          throw new Error("loan not found ");
       }
       if(loanExist.status!=="approved"){
          throw new Error("only approved loans can be distribute");
       }
       const savingExist=await Savings.findById(loanExist.savingAccount);
       const balance=await debitLoanMoney(savingExist.accountNumber,loanExist.principalAmount);
       let transactionNumber
             const transactionsCount=await Transaction.countDocuments();
             const nextCount=transactionsCount+1;
             const transNumber=nextCount.toString().padStart(4,"0");
             transactionNumber=`TRAN-${transNumber}`;
             //console.log(savingsExist);
             const newTransaction=await Transaction.create({
                        transactionNumber,
                        savingsAccount:savingExist._id,
                        accountType:savingExist.accountType,
                        accountNumber:savingExist.accountNumber,
                        transactionType:"loanDistribute",
                        amount:loanExist.principalAmount,
                        balanceAfter:balance,
                        performedBy:user._id,
                        description:"deposit"
               });
               loanExist.disbursedBy = user._id;
               loanExist.disbursedDate = new Date(); 
               loanExist.status="active";
               const shedule=calculateAmortizationShedule(loanExist.principalAmount,loanExist.interestRate,loanExist.durationMonths,loanExist.disbursedDate,loanExist.monthlyInstallment);
               console.log(shedule); 
               console.log(Array.isArray(shedule));
               console.log(shedule.length);
               loanExist.installments=shedule;
               console.log(loanExist.installments.length);
               await loanExist.save();
             const checkLoan = await Loan.findOne({
      loanNumber: loanExist.loanNumber
      });      
               console.log(checkLoan.toObject());
               console.log(checkLoan);
               console.log(checkLoan.installments); 
               return(loanExist);

};
exports.repayLoan=async(loanNumber)=>{
    const loanExist=await Loan.findOne({loanNumber});
    if(loanExist.status!=="active"){
        throw new Error("loan acount is not a active account");
    }
    const savingExist=await savings.findById(loanExist.savingAccount);
    if(!savingExist){
        throw new Error("saving account not found");
    }
    if(savingExist.isActive=false){
        throw new Error("account is not a active account");
    }
    const balance=savingExist.balance;
    if(balanc<=loanExist.monthlyInstallment){
        loanExist.isOverdue=true;
        loanExist.overdueCount += 1;
        await loanExist.save();
        return {
             skippped:true,
             reason:"insufficient balance"
        };
    }
    

}