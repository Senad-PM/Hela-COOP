const mongoose=require("mongoose");

const savingsSchema= new mongoose.Schema({
    accountNumber:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        match: [
           /^(SAV|FIX)-[0-9]{4}$/,
           "Invalid account number format"
        ]
    },
    Customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },
    accountType:{
        type:String,
        enum:["regular","fixed"],
        required:true
    },
    balance:{
        type:Number,
        required:true,
        default:0,
        min:0
    },
    interestRate:{
        type:Number,
        required:true,
        min:0,
        max:100
    },
    isActive:{
          type:Boolean,
          default:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{
    timestamps:true
}
);
module.exports=mongoose.model("Savings",savingsSchema);