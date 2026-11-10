const dotenv=require("dotenv");

dotenv.config();

const User=require("../Models/user");

// Creates the first admin account ONLY when ADMIN_EMAIL and ADMIN_PASSWORD are set in .env.
// (No default credentials are shipped in the source code.)
const seedAdmin=async()=>{
    try{
        const email=process.env.ADMIN_EMAIL;
        const password=process.env.ADMIN_PASSWORD;
        if(!email || !password){
            console.log("seedAdmin skipped: set ADMIN_EMAIL and ADMIN_PASSWORD in .env to create the first admin");
            return;
        }
        const adminexist=await User.findOne({email:email.toLowerCase()});
        if(adminexist){
            return;
        }
        await User.create({
            userName:process.env.ADMIN_NAME || "admin",
            email,
            password,
            role:"admin"
        });
        console.log("Admin created successfully");
    }catch (error) {
        console.log("seedAdmin failed:",error.message);
    }
};
module.exports={seedAdmin};
