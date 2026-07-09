const User=require("../Models/user");
const Customer=require("../Models/customer");
const Savings=require("../Models/savings");
const Transaction=require("../Models/transactions");
const Loan=require("../Models/loan");

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
         .populate({path:"savingsAccount",populate:{path:"customer",select:"customerNumber firstName lastName"}}).populate("performedBy","userName");



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
        }

    }
};
