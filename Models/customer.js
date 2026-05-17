const mongoose=require("mongoose");
const { validate } = require("./user");

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
        trim:true,
        match:[/^([0-9]{9}[vVxX]|[0-9]{12})$/,"please use a valid NIC"]
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
     email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },
    phoneNumber:{
         type:String,
         required:true,
         trim:true,
         match:[/^07[0-9]{8}$/,"please use a valid phonenumber "]
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
    postalCode:{
        type:String,
        required:true,
        trim:true
    },
    dateOfBirth:{
        type:Date,
        required:true,
        validate:{
            validator:function(dateOfBirth){
                const today=new Date();

                let age=today.getFullYear()-dateOfBirth.getFullYear();
                const monthDifference=today.getMonth()-dateOfBirth.getMonth();
                if(monthDifference<0 || (
                    monthDifference === 0 && today.getDate() <dateOfBirth.getDate()
                )){
                    age--;
                }
                return age>= 18;
            },
            message:"Customer must be at least 18 years old"
        }
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
