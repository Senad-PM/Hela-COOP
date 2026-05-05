const mongoose=require("mongoose");

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDb connected");
        console.log('MONGO_URI:', process.env.MONGO_URI);
    }catch(error){
           console.error("mongoDb connection failed",error.message);
           process.exit(1);
    }
};
module.exports=connectDb;