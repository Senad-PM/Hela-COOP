const {createCustomer,getcustomer,getCustomerByCN}=require("../Services/customerService");



exports.addCustomer=async(req,res,next)=>{
    try{
        const customerData=req.body;
        const user=req.user._id;
        const result=await createCustomer(customerData,user);
        res.status(200).json(result);
    }catch(error){
        next(error)
    }
};
exports.getCustomers=async(req,res,next)=>{
    try{
         const result=await getcustomer(req.query);
         res.status(200).json(result);
    }catch(error){
         next(error);
    }
};
exports.getCustomerByCustomerNumber=async(req,res,next)=>{
    try{
        const {customerNumber}=req.params;
        const result=await getCustomerByCN(customerNumber);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};