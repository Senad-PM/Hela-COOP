const {getactivities,getActivityById} =require("../Services/activityService");

exports.getAllActivities=async(req,res,next)=>{
    try{
        const result =await getactivities(req.query);
        res.status(200).json(result);
    }catch(error){
        next(error);
    } 
};
exports.getById=async(req,res,next)=>{
    try{
        const result=await getActivityById(req.params.id);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};