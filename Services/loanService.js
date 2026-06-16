const Loan=require("../Models/loan");
const calculateEmi=require("../Utils/calculateEmi");
const Customer=require("../Models/customer");
const Transaction=require("../Models/transactions");

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
            loanType,
            principalAmount,
            interestRate,
            durationMonths,
            monthlyInstallment:installment,
            outstandingBalance:principalAmount,
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
                 transactionType:"deposit",
                 amount:principalAmount,
                 balanceAfter:principalAmount,
                 performedBy:user._id,
                 description:"loan acount opening"
        });
        return(newLoan);
             
};