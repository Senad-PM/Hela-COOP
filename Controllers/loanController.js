const {createLoan,loanApproved,loanReject,loanDistribution,getloans}=require("../Services/loanService");

exports.loanCreation=async(req,res,next)=>{
     try{
        const user=req.user._id;
        const loanData=req.body;
        const result=await createLoan(loanData,user);
        res.status(200).json(result);
     }catch(error){
           next(error);
     }
};
exports.approveLoan=async(req,res,next)=>{
      try{
         const {loanNumber}=req.params;
         const user=req.user._id;
         const result=await loanApproved(loanNumber,user);
         res.status(200).json(result);
      }catch(error){
            next(error);
      }
};
exports.rejectLoan=async(req,res,next)=>{
      try{
         const {loanNumber}=req.params;
         const user=req.user._id;
         const result=await loanReject(loanNumber,user);
         res.status(200).json(result);
      }catch(error){
          next(error);
      }
};
exports.distributionLoan=async(req,res,next)=>{
      try{
         const{loanNumber}=req.params;
         const user=req.user._id;
         const result=await loanDistribution(loanNumber,user);
         res.status(200).json(result);
      }catch(error){
            next(error);
      }
};
exports.getAllLoans=async(req,res,next)=>{
      try{
            const result=await getloans(req.query);
            res.status(200).json(result);
      }catch(error){
            next(error);
      }
};