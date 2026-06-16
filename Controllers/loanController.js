const {createLoan}=require("../Services/loanService");

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