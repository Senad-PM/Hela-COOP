const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const crypto=require("crypto");


const userSchema=new mongoose.Schema({

    userName:{
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
    password: {
        type: String,
        required: true,
        minlength: 8,
        select:false,
        match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must contain uppercase, lowercase, number and special character"
        ]
    },
    role:{
        type:String,
        enum:["admin","manager","staff"],
        default:"staff",
        required:true
    },
    isActive:{
        type:Boolean,
        default:true,
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
   }

},{
    timestamps:true
}
);
userSchema.index({ email: 1 }, { unique: true });
userSchema.pre("save", async function () {
    if (!this.isModified("password")){
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.comparePassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
};
userSchema.methods.isAccountActive=function(){
    return this.isActive;
};
userSchema.methods.genarateResetPasswordToken= function(){
       const resetToken=crypto.randomBytes(20).toString("hex");
       this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
       this.resetPasswordExpire=Date.now()+15*60*1000;
       return resetToken;
};
module.exports=mongoose.model("User",userSchema);