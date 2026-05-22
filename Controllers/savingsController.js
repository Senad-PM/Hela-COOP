const{createsavings}=require("../Services/savingsService");


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
