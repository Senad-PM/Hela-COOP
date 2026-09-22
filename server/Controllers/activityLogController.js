const ActivityLog=require("../Models/activityLog");

exports.getActivityLogs=async(req,res,next)=>{
    try{
        const {user,action,search,since,page=1,limit=20}=req.query;
        const filter={};

        if(user) filter["performedBy"]=user;
        if(action) filter["action"]=action;
        if(since) filter["createdAt"]={$gte:new Date(since)};
        if(search){
            filter["$or"]=[
                {action:{$regex:search,$options:"i"}},
                {ref:{$regex:search,$options:"i"}}
            ];
        }

        const skip=(Number(page)-1)*Number(limit);

        const [logs,total]=await Promise.all([
            ActivityLog.find(filter)
                .populate("performedBy","userName role")
                .sort({createdAt:-1})
                .skip(skip)
                .limit(Number(limit)),
            ActivityLog.countDocuments(filter)
        ]);

        res.status(200).json({data:logs,total,page:Number(page),limit:Number(limit)});
    }catch(error){
        next(error);
    }
};

exports.clearActivityLogs=async(req,res,next)=>{
    try{
        await ActivityLog.deleteMany({});
        res.status(200).json({message:"All activity logs cleared"});
    }catch(error){
        next(error);
    }
};