const {adminDashboard,staffDashboard,managerDashedboard,customerDashedboard}=require("../Services/dashboardServices");


exports.AdminDashboard=async(req,res,next)=>{
    try{
        const result=await adminDashboard();
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};
exports.StaffDashboard=async(req,res,next)=>{
     try{
           const result=await staffDashboard();
           res.status(200).json(result);
     }catch(error){
        next(error);
     }
};
exports.managerDashedboard=async(req,res,next)=>{
      try{
         const result=await managerDashedboard();
         res.status(200).json(result);
      }catch(error){
        next(error);
      }
};
exports.customerDashedBoard=async(req,res,next)=>{
    try{
       const customer=req.params.id;
       const result=await customerDashedboard(customer);
       res.status(200).json(result);
    }catch(error){
        next(error);
    }
}