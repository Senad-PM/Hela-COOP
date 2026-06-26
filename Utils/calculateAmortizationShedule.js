const Loan=require("../Models/loan");

const calculateAmortizationShedule=(principalAmount,interestRate,durationMonths,disbursedDate,monthlyInstallment)=>{
           const monthlyRate=(interestRate/100)/12;
           let remainingBalance=principalAmount;
           const installments=[];
           let dueDate=new Date(disbursedDate);
           dueDate.setMonth(dueDate.getMonth()+1);
           for (let i=1; i<=durationMonths; i++){
               const interest =remainingBalance*monthlyRate;  
               const principalPart=monthlyInstallment-interest;
               remainingBalance=remainingBalance-principalPart;
               remainingBalance=Number(remainingBalance.toFixed(2));
               const interestAmount = Number(interest.toFixed(2));
               const principalAmountPaid =Number(principalPart.toFixed(2));
               if (remainingBalance < 0) {
                      remainingBalance = 0;
                    }
               installments.push({
                       installmentNo:i,
                       dueDate:new Date(dueDate),
                       emi:monthlyInstallment,
                       interestAmount:interestAmount,
                       principalAmount:principalAmountPaid,
                       remainingBalance:remainingBalance
                       
               });
               dueDate.setMonth(dueDate.getMonth()+1);
           }
        return(installments);

};
module.exports=calculateAmortizationShedule;