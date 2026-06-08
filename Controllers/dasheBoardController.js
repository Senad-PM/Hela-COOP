const {adminDashboard}=require("../Services/dashboardServices");


exports.AdminDashboard=async(req,res,next)=>{
    try{
        const result=await adminDashboard();
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};