const{getTransactionsBySaving}=require("../Services/transectionService");


exports.getTransactionsBySavingNumber=async(req,res,next)=>{
    try{
    const {accountNumber}=req.params;
    const result=await getTransactionsBySaving(accountNumber,req.query);
    res.status(200).json(result);
    }catch(error){
        next(error);
    }
};