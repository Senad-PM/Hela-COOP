const mongoose=require("mongoose");

const savingsSchema= new mongoose.Schema({
    accountNumber:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        match: [
           /^(REG|FIX)-[0-9]{4}$/,
           "Invalid account number format"
        ]
    },
    customerNumber:{
        type:String,
        required:true
    },
    customer:{
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
    durationMonths:{
         type:Number,
         required:function(){
            return this.accountType==="fixed";
         },
         enum:[3,6,12],
         min:1
    },
    maturityDate:{
        type:Date,
    },
    isMatured:{
        type:Boolean,
        default:false
    },
    isActive:{
          type:Boolean,
          default:true
    },
    lastInterestApplied:{
        type:Date
    },
    accuredInterest:{
        type:Number,
        default:0,
        min:0
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