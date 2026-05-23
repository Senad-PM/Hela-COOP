const mongoose=require("mongoose");
const savings = require("./savings");

const transactionSchema=new mongoose.Schema({
        transactionNumber:{
            type:String,
            unique:true,
            required:true,
            trim:true,
        },
        savingsAccount:{
            type:mongoose.Schema.Types.ObjectId,
            reference:"Savings",
            required:true
        },
        accountNumber:{
            type:String,
            required:true
        },
        transactionType:{
             type:String,
             required:true,
             enum:["deposit","withdraw"]
        },
        amount:{
            type:Number,
            required:true,
            min:1
        },
        balanceAfter:{
            type:Number,
            required:true
        },
        performedBy:{
            type:mongoose.Schema.Types.ObjectId,
            reference:"User",
            required:true
        },
        description:{
            type:String,
            trim:true
        },
        transactionDate:{
           type:Date,
           default:Date.now
        }
        
},{
    timestamps:true
}
);
module.exports=mongoose.model("Transaction",transactionSchema);