const Settings=require("../Models/settings");

exports.getSettings=async(req,res,next)=>{
    try{
        let settings=await Settings.findOne();
        if(!settings){
            settings=await Settings.create({});
        }
        res.status(200).json(settings);
    }catch(error){
        next(error);
    }
};

exports.updateSettings=async(req,res,next)=>{
    try{
        let settings=await Settings.findOne();
        if(!settings){
            settings=await Settings.create(req.body);
        }else{
            settings=await Settings.findByIdAndUpdate(settings._id,req.body,{new:true,runValidators:true});
        }
        res.status(200).json(settings);
    }catch(error){
        next(error);
    }
};