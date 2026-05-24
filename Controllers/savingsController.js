const{createsavings,deposit,withdraw,getByAccountNumber,getAllSavings}=require("../Services/savingsService");


exports.addSavingsAcount=async(req,res,next)=>{
    try{
    const user=req.user._id;
    const savingsData=req.body;
    const result=await createsavings(savingsData,user);
    res.status(200).json(result);
    }catch(error){
      // console.log(error)
        next(error);
    }
};
exports.savingsDeposit=async(req,res,next)=>{
  try{
    const depositData=req.body;
    const user=req.user._id;
    const result=await deposit(depositData,user);
    res.status(200).json(result);
  }catch(error){
    next(error);
  }
};
exports.savingsWithdraw=async(req,res,next)=>{
  try{
    const withdrawData=req.body;
    const user=req.user._id;
    const result=await withdraw(withdrawData,user)
    res.status(200).json(result);
  }catch(error){
    next(error);
  }
};
exports.getSavingsByAccountNumber=async(req,res,next)=>{
   try{
        const {accountNumber}=req.params;
        const result=await getByAccountNumber(accountNumber);
        res.status(200).json(result);
   }catch(error){
      next(error);
   }
};
exports.getSavings=async(req,res,next)=>{
  try{
       const result=await getAllSavings(req.query);
       res.status(200).json(result);
  }catch(error){
    next(error);
  }
}