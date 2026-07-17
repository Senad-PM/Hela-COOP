const {adminDashboard,staffDashboard,managerDashedboard}=require("../Services/dashboardServices");


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