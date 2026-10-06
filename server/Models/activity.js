const mongoose=require("mongoose");

const activitySchema = new mongoose.Schema({
    activityNumber:{
        type:String,
        unique:true,
        required:true
    },
    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    action: {
        type: String,
        required: true
    },

    entityType: {
        type: String,
        required: true
  },

    entityId: {
        type: mongoose.Schema.Types.ObjectId
  },

    targetLabel: {
        type: String
  },

    description: {
        type: String
  }
},
{
  timestamps: true
});

module.exports=mongoose.model("activity",activitySchema);