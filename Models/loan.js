const mongoose=require("mongoose");

const loanSchema=new mongoose.Schema({

    loanNumber:{
        type:String,
        required:true,
        unique:true
    },
  /*  customerNumber:{
        type:String,
        required:true
    },   */
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },
    loanType:{
        type:String,
        enum:[
            "personal",
            "buisness",
            "emergency"
        ],
        required:true
    },
    principalAmount:{
        type:Number,
        min:0,
        required:true
    },
    interestRate:{
        type:Number,
        required:true
    },
    durationMonths:{
        type:Number,
        required:true
    },
    monthlyInstallment:{
        type:Number,
        required:true
    },
    outstandingBalance:{
        type:Number,
        required:true
    },
    remainingInstallments:{
    type:Number
    },
    status:{
        type:String,
        enum:[
            "pending",
            "approved",
            "rejected",
            "active",
            "closed"
        ],
        default:"pending"
    },
     approvedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    approvedDate:{
        type:Date
    },

    disbursedDate:{
        type:Date
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
module.exports=mongoose.model("Loan",loanSchema);