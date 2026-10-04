const ActivityLog=require("../Models/activityLog");

const logActivity=async({performedBy,action,actionType,ref})=>{
    try{
        await ActivityLog.create({performedBy,action,actionType,ref});
    }catch(error){
        console.error("Failed to write activity log:",error.message);
    }
};

module.exports=logActivity;