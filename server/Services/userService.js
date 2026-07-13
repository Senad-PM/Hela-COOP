const User=require("../Models/user");
const bcrypt=require("bcrypt");
const { search } = require("../Routes/userRoutes");
constjwt=require("jsonwebtoken");
const crypto=require("crypto");
const sendEmail=require("../Utils/sendEmail");
const buildPagination=require("../Utils/buildPaginations");
const buildSort=require("../Utils/buildSort");

exports.createUser=async(userName,email,password,role)=>{
           console.log(userName, email, role);
           if(!userName || !email|| !role){
             throw new Error("all field must be filled ");
           }
           const userExist=await User.findOne({email})
           if(userExist){
            throw new Error("user already exists");
           }
          const temporaryPassword=`Temp@${Math.floor(Math.random() * 100000)}`;
          const newUser=await User.create({
            userName,
            email,
            password:temporaryPassword,
            role
            
          })
          const resetToken=newUser.genarateResetPasswordToken();
          const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
          const resetUrl=`${clientUrl}/set-password/${resetToken}`;
          try {
          await sendEmail({
            email: newUser.email,
            subject: "Set Your Password",
            message:
              `Welcome to Hela COOP.\n\n` +
              `Set your password using this link:\n\n${resetUrl}`
          });
        }catch(error){
          console.log(error);
          throw new Error("email sending failed")
        }
        
          await newUser.save();
           return({
             id:newUser._id,
             userName:newUser.userName,
             email:newUser.email,
             role:newUser.role,
             isActive:newUser.isActive,
             message: "user created and setup email sent"
           });
};

const buildFilter=(query)=>{
     const filter={};
     if(query.role!==undefined){
       filter.role=query.role;
     }
     if(query.isActive!==undefined){
       filter.isActive = query.isActive === "true"; 
     }
     if(query.search && query.search.trim() !== ""){

    filter.$or = [
        {
            userName: {
                $regex: query.search,
                $options: "i"
            }
        },
        {
            email: {
                $regex: query.search,
                $options: "i"
            }
        }
    ];
   }
     return filter;
};

exports.getUsers=async(query)=>{
       const filter=buildFilter(query);
       const sortoption=buildSort(query);
      // console.log(filter);
       const{limit,skip,page}=buildPagination(query);
       const count=await User.countDocuments(filter);
                 if(count > 0 && skip >= count){
                    throw new Error("page not found");
                 }
       const users=await  User.find(filter).sort(sortoption).skip(skip).limit(limit).select("-password -refreshToken");
        
       return({
            "total":count,
            "page":page,
            "limit":limit,
            "data":users
        });
};
exports.getUsersById=async(id)=>{
      //console.log('id');
      const findUser=await User.findById(id).select("-password -refreshToken");
      if(!findUser){
        throw new Error("user not found ");
      }
      return findUser;
};
exports.update=async(id,updatebody)=>{
    const{userName,role,isActive}=updatebody;
    const updateData={};
    if(userName !== undefined){
      updateData.userName=userName;
    }
    if(role !== undefined){
      updateData.role=role;
    }
    if(isActive !== undefined){
      updateData.isActive=isActive;
    }
    const userExist=await User.findByIdAndUpdate(id,updateData,{new:true}).select("-password -refreshToken");
    if(!userExist){
      throw new Error("user not found");
    }
    return userExist;
}
exports.deactivate=async(id)=>{
  const userExist=await User.findById(id).select("-password -refreshToken");
  if(!userExist){
    throw new Error("User not found");
  }
  if(userExist.isActive===false){
    throw new Error("User already deactivated");
  }
  userExist.isActive=false;
  await userExist.save();

  return userExist;
}
exports.activate=async(id)=>{
  const userExist=await User.findById(id).select("-password -refreshToken");
  if(!userExist){
    throw new Error("User not found");
  }
  if(userExist.isActive===true){
    throw new Error("User already activated");
  }
  userExist.isActive=true;
  await userExist.save();
  return userExist;
}