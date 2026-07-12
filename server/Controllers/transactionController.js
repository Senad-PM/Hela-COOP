const{getTransactionsBySaving,getTransactionByTransaction,getTransactions}=require("../Services/transectionService");


exports.getTransactionsBySavingNumber=async(req,res,next)=>{
    try{
        const {accountNumber}=req.params;
        const result=await getTransactionsBySaving(accountNumber,req.query);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};
exports.getTransactionByTransactionNumber=async(req,res,next)=>{
    try{
        const {transactionNumber}=req.params;
        const result=await getTransactionByTransaction(transactionNumber);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};
exports.getAllTransactions=async(req,res,next)=>{
    try{
        const result=await getTransactions(req.query);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};