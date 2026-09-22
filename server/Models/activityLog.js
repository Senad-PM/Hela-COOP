const mongoose=require("mongoose");

const activityLogSchema=new mongoose.Schema({
    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    action:{
        type:String,
        required:true
    },
    actionType:{
        type:String,
        enum:["user","loan","savings","customer"],
        required:true
    },
    ref:{
        type:String
    }
},{timestamps:true});

module.exports=mongoose.model("ActivityLog",activityLogSchema);