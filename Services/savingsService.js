const Savings=require("../Models/savings");
const Customer=require("../Models/customer");
const customer = require("../Models/customer");

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
        const newAcount=Savings.create({
                accountNumber,
                customer:customerExist._id,
                customerNumber:customerExist.customerNumber,
                accountType,
                balance:initialDeposit || 0,
                interestRate,
                durationMonths,
                createdBy:user
        });
        return(newAcount);
}