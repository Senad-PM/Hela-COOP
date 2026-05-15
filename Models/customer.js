const mongoose=require("mongoose");

const customerSchema=new mongoose.Schema({
      
    customerNumber:{
        type:String,
        unique:true,
        required:true
    },
    NIC:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    phoneNumber:{
         type:String,
         required:true,
         trim:true
    },
    occupation:{
        type:String,
        required:true,
        trim:true
    },
    city:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    postal:{
        type:String,
        required:true,
        trim:true
    },
    dateOfBirth:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{
    timestamps:true
        
});

module.exports=mongoose.model("Customer",customerSchema);
