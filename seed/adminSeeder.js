const mongoose=require("mongoose");
const dotenv=require("dotenv");

dotenv.config();

const User=require("../Models/user");

const seedAdmin=async()=>{
 try{
  /*  await mongoose.connect(process.env.MONGO_URI);  */
    const adminexist=await User.findOne({email:"admin@gmail.com"});   
    if(adminexist){
        throw new Error("Admin already exist");
    }
    await User.create({
        userName:"admin",
        email:"admin@gmail.com",
        password:"Admin@1234",
        role:"admin"
    });
    console.log("Admin created successfully");
    }catch (error) {

        console.log(error.message);

    } 
   
};
module.exports={seedAdmin};
 //seedAdmin();