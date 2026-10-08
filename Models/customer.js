const mongoose=require("mongoose");
const { validate } = require("./user");
const bcrypt=require("bcrypt");
const crypto=require("crypto");

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
    password:{
        type: String,
        required: true,
        minlength: 8,
        select:false,
        match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must contain uppercase, lowercase, number and special character"
        ]
    },
    refreshToken:{
        type:String,
        default:null
    },
    resetPasswordToken: {
        type: String
    },

   resetPasswordExpire: {
        type: Date
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
        
});
customerSchema.index({ email: 1 }, { unique: true });
customerSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return ;
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    
});
customerSchema.methods.comparePassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
};
customerSchema.methods.isAccountActive=function(){
    return this.isActive;
};
customerSchema.methods.genarateResetPasswordToken= function(){
       const resetToken=crypto.randomBytes(20).toString("hex");
       this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
       this.resetPasswordExpire=Date.now()+15*60*1000;
       return resetToken;
};

module.exports=mongoose.model("Customer",customerSchema);
