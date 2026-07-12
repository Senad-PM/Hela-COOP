const {createCustomer,getcustomer,getCustomerByCN,update,deactivate,activate,getCustomerBYId}=require("../Services/customerService");

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
exports.getCustomerById=async(req,res,next)=>{
    try{
        const result=await getCustomerBYId(req.params.id);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};
exports.updateCustomer=async(req,res,next)=>{
     try{
        const{customerNumber}=req.params;
        const updateBody=req.body;
        const result=await update(customerNumber,updateBody);
        res.status(200).json(result); 
     }catch(error){
        next(error);
     }
};
exports.deactivateCustomer=async(req,res,next)=>{
    try{
        const{customerNumber}=req.params;
        const result=await deactivate(customerNumber);
        res.status(200).json(result);
    }catch(error){
        next(error)
    }
};
exports.activateCustomer=async(req,res,next)=>{
    try{
       const{customerNumber}=req.params;
       const result=await activate(customerNumber);
       res.status(200).json(result);
    }catch(error){
        next(error);
    }
};

