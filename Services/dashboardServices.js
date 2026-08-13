const User=require("../Models/user");
const Customer=require("../Models/customer");
const Savings=require("../Models/savings");
const Transaction=require("../Models/transactions");
const Loan=require("../Models/loan");
const{loanStatics}=require("../Services/loanService");
const savings = require("../Models/savings");
const loan = require("../Models/loan");

exports.adminDashboard=async()=>{
    const totalUsers=await User.countDocuments();
    const activeUsers=await User.countDocuments({isActive:true});
    const inactiveUsers=await User.countDocuments({isActive:false});
    const startOfTheMonth=new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );
    const newUsers=await User.countDocuments({
        createdAt:{
            $gte:startOfTheMonth
        }
    });
    return({
        TOtalUsers:totalUsers,
        ActiveUsers:activeUsers,
        InActiveUsers:inactiveUsers,
        NewUsers:newUsers
  })
};
exports.staffDashboard=async()=>{
    //main cards
    const customerCount=await Customer.countDocuments();
    const totalSavings=await Savings.countDocuments();
    const pendingApprovels=await Loan.countDocuments({status:"pending"});
    const overdueLoans=await Loan.countDocuments({isOverdue:true});
    const totalSavingBalance=await Savings.aggregate([{
        $group:{
            _id:null,
            totalbalance:{
                $sum:"$balance"
            }
        }
    }]);
    const totalbalance=totalSavingBalance.length>0 ? totalSavingBalance[0].totalbalance : 0;
    const total=Number(totalbalance.toFixed(2));

    //todays summery
    const today=new Date();
    today.setHours(0,0,0,0);
    const tomorrow=new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1);
    const maturityperiod=new Date(today);
    maturityperiod.setDate(maturityperiod.getDate()+3);
    const sevenDays=new Date(today);
    sevenDays.setDate(sevenDays.getDate()-6);
    
    const newCutomersToday=await Customer.countDocuments({
        createdAt:{
            $gte:today,
            $lt:tomorrow
        }
    });
    const todaysDeposits=await Transaction.countDocuments({
        createdAt:{
            $gte:today,
            $lt:tomorrow
        },
        transactionType:"deposit"
    });
    const todaysWithdrawls=await Transaction.countDocuments({
        createdAt:{
            $gte:today,
            $lt:tomorrow
        },
        transactionType:"withdraw"
    });
    const todaysLoanRepayment=await Transaction.countDocuments({
        createdAt:{
            $gte:today,
            $lt:tomorrow
        },
        transactionType:"loanRepayment"
    });
    const todaysLoanDisbursement=await Transaction.countDocuments({
        createdAt:{
            $gte:today,
            $lt:tomorrow
        },
        transactionType:"loanDistribute"
    });

    //recent
    const recentTransaction=await Transaction.find()
         .sort({ createdAt:-1})
         .limit(20)
         .populate({path:"savingsAccount",select:"accountNumber customer",populate:{path:"customer",select:"customerNumber firstName lastName"}}).populate("performedBy","userName");

    //to do task
    const pendingLoans=await Loan.find({status:"pending"}).sort({createdAt:-1}).limit(5)
          .select("loanNumber principalAmount createdAt customer")
          .populate("customer","firstName lastName");

    const overDueLoans=await Loan.find({isOverdue:true}).sort({createdAt:-1}).limit(5)
          .select("loanNumber principalAmount nextDueDate customer")
          .populate("customer","firstName lastName");
    const maturingFixedDeposits=await Savings.find({accountType:"fixed",maturityDate:{
        $gte:today,
        $lt:maturityperiod
    },isActive:true}).limit(5).select("accountNumber balance maturityDate customer").populate("customer","firstName lastName");
    //daily Transaction volumes

    const dailyTransaction=await Transaction.aggregate([{
        $match:{
            createdAt:{
                 $gte:sevenDays,
                 $lt:today
            }
        }
       },{
        $group:{
           _id:{
            $dateToString: {
                 format: "%Y-%m-%d",
                 date: "$createdAt"
        }
           },
           totalVolume:{
              $sum:"$amount"
           }
        }
    },{
            $sort:{
            _id:1
        }
   }]);
   const fillMissingDays =(dailyTransaction)=>{
    const result=[];
    //date
    const today = new Date();
    const sevenDays = new Date(today);
    sevenDays.setHours(0,0,0,0);

    for (let i=0; i<7; i++){
        const day=new Date(sevenDays);
        day.setDate(day.getDate() + i);
        
       
        const DateData = dailyTransaction.find(
              item => item._id === day
        );
        if(DateData){
           result.push({
             Date:day,
             totalVolume:DateData.totalVolume
           });
        }else{
           result.push({
              DAte:day,
              totalVolume:0
           });
        }
        
    }
    return(result);
    }
    const completeDailyTransactions= fillMissingDays(dailyTransaction);


    return{
        overview:{
        customerCount:customerCount,
        totalsavingsacounts:totalSavings,
        pendingLoansCount:pendingApprovels,
        overDueLoanCount:overdueLoans,
        totalSavingBalance:total,
        },
        todaySummary:{
        newCustomersCount:newCutomersToday,
        todaysDepositCount:todaysDeposits,
        todaysWithdrawlsCount:todaysWithdrawls,
        todaysLoanRepaymentCount:todaysLoanRepayment,
        todaysLoanDisbursementCount:todaysLoanDisbursement
        },
        recentTransaction:{
            recentTransaction
        },
        toDoTasks:{
            pendingLoan:pendingLoans,
            overDueLoan:overDueLoans,
            maturingFdDeposits:maturingFixedDeposits
        },
        dailyTransactionVolume:completeDailyTransactions

    }
};

exports.managerDashedboard=async()=>{
    //Days
    const today=new Date();
    today.setHours(0,0,0,0);
    const maturityperiod=new Date(today);
    maturityperiod.setDate(maturityperiod.getDate()+3);
//KPI CARDS FOR MANGER DASHEDBOARD
    const customerCount=await Customer.countDocuments();
    const totalSavings=await Savings.countDocuments();
    const pendingApprovels=await Loan.countDocuments({status:"pending"});
    const overdueLoans=await Loan.countDocuments({isOverdue:true});
    const totalSavingBalance=await Savings.aggregate([{
        $group:{
            _id:null,
            totalbalance:{
                $sum:"$balance"
            }
        }
    }]);
    const totalbalance=totalSavingBalance.length>0 ? totalSavingBalance[0].totalbalance : 0;
    const total=Number(totalbalance.toFixed(2));
     const totalLoanBalance=await Loan.aggregate([{
        $match:{
            status:"active"
        }},{
        $group:{
            _id:null,
            totalAmount:{
                $sum:"$principalAmount"
            }
        }
    }]);
    const totalLbalance=totalLoanBalance.length>0 ? totalLoanBalance[0].totalAmount : 0;
    const totalLoanAmount=Number(totalLbalance.toFixed(2));
    
    //monthly charts of manager dashedboard
    let monthlytransaction
    monthlytransaction=await getmonthlytransactionsummery("deposit");
    const completeMonthlyDeposit= fillMissingMonths(monthlytransaction);
    monthlytransaction=await getmonthlytransactionsummery("withdraw");
    const completeMonthlyWithdraw= fillMissingMonths(monthlytransaction);
    monthlytransaction=await getmonthlytransactionsummery("loanRepayment");
    const completeMonthlyLoanRepayment=fillMissingMonths(monthlytransaction);
    monthlytransaction=await getmonthlytransactionsummery("loanDistribute");
    const completeMonthlyDisbursement=fillMissingMonths(monthlytransaction);
    //loan Statistics
    const completeLoanStatistics=await loanStatics();
    //pending loan que
    const pendingLoans=await Loan.find({status:"pending"}).select("loanNumber principalAmount createdAt")
    .populate("customer","firstName lastName")
    .limit(5)
    .sort({createdAt:-1});
   const overDueLoansQue=await Loan.find({isOverdue:true}).sort({createdAt:-1}).limit(5)
          .select("loanNumber principalAmount nextDueDate customer")
          .populate("customer","firstName lastName");
    const maturingFixedDepositsQue=await Savings.find({accountType:"fixed",maturityDate:{
        $gte:today,
        $lt:maturityperiod
    },isActive:true}).limit(5).select("accountNumber balance maturityDate customer").populate("customer","firstName lastName");   
    //high value transactions
    const highValueTransactions=await Transaction.find({
        amount:{
          $gte:100000
       }
     })
    .select("transactionNumber accountNumber transactionType amount").
    populate("performedBy","userName").limit(5)
    .sort({createdAt:-1});
    return{
     overview:{
         customerCount:customerCount,
         totalsavingsacounts:totalSavings,
         pendingLoansCount:pendingApprovels,
         overDueLoanCount:overdueLoans,
         totalSavingBalance:total,
         totalLoanPortfolio:totalLoanAmount
        },
     monthlyChart:{
        monthlyDepositVolume:completeMonthlyDeposit,
        monthlyWithdrawVolume:completeMonthlyWithdraw
     },
     loanStatics:{
        completeLoanStatistics
     },
     Ques:{
       pendingLoanQue:pendingLoans,
       overDueLoansQues:overDueLoansQue,
       maturingFDQUe:maturingFixedDepositsQue
    },
    highValueTransaction:{
        highValueTransactions
    }
   };
};
const getmonthlytransactionsummery=async(transactionType)=>{
 //Days
         const today=new Date();
         const lastTwelveMonths=new Date(today);
         lastTwelveMonths.setMonth(lastTwelveMonths.getMonth()-11);
         lastTwelveMonths.setDate(1);
         lastTwelveMonths.setHours(0, 0, 0, 0);    
     const monthlytransaction=await Transaction.aggregate([{
        $match:{
            createdAt:{
                 $gte:lastTwelveMonths,
                 $lt:today
            },
            transactionType:transactionType
        }
       },{
        $group:{
           _id:{
            $dateToString: {
                 format: "%Y-%m",
                 date: "$createdAt"
        }
           },
           totalVolume:{
              $sum:"$amount"
           }
        }
    },{
            $sort:{
            _id:1
        }
   }]);
   return(monthlytransaction);
};
const fillMissingMonths =(monthlytransaction)=>{
    const result=[];
    //date
    const today = new Date();
    const lastTwelveMonths = new Date(today);
    lastTwelveMonths.setMonth(lastTwelveMonths.getMonth() - 11);
    lastTwelveMonths.setDate(1);
    lastTwelveMonths.setHours(0,0,0,0);

    for (let i=0; i<12; i++){
        const month=new Date(lastTwelveMonths);
        month.setMonth(month.getMonth() + i);
        const year=month.getFullYear();
        const formattedMonth = `${year}-${String(month.getMonth() + 1).padStart(2, "0")}`;
       
        const monthData = monthlytransaction.find(
              item => item._id === formattedMonth
        );
        if(monthData){
           result.push({
             month:formattedMonth,
             totalVolume:monthData.totalVolume
           });
        }else{
           result.push({
              month:formattedMonth,
              totalVolume:0
           });
        }
        
    }
    return(result);
}
exports.customerDashedboard=async(customer)=>{
       const customerSavingBalance=await savings.aggregate([
          {
            $match:
            {
                Customer:customer,
                isActive:true
            }
          },
          {
            $group:{
                _id:null,
                totalLbalance:{
                    $sum:"$balance"
                }
            }
          }
       ]);
       const customerregularsavingsbalnce=await savings.findOne
       ({Customer:customer,accountType:"regular"})
       .select("balance");

       const customerFixedSavingBalance=await savings.findOne({Customer:customer,accountType:"fixed"}).select("balance");
       const customerActiveLoancount= await loan.countDocuments({Customer:customer,status:"active"});

       return({
        topcards:{
            customerTotalSavings:customerSavingBalance,
            regularSavingBalance:customerregularsavingsbalnce,
            fixedSavingsBalance:customerFixedSavingBalance,
            ActiveLoanCount:customerActiveLoancount
        }
       });
}