const{getSavings,transactions}=require("../Services/customerPortalService");

exports.getCustomerSavings=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const query=req.query;
        const result=await getSavings(id,query);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};
exports.myTransactions=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const query=req.query;
        const result=await transactions(id,query);
        res.status(200).json(result);
    }catch(error){
        next(error)
    }
};