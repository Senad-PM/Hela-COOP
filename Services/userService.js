const User=require("../Models/user");
const bcrypt=require("bcrypt");
const { search } = require("../Routes/userRoutes");
constjwt=require("jsonwebtoken");
const crypto=require("crypto");
const sendEmail=require("../Utils/sendEmail");
const buildPagination=require("../Utils/buildPaginations");
const buildSort=require("../Utils/buildSort");
const activity=require("../Models/activity");

exports.createUser=async(userName,email,password,role,user)=>{
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
          const resetUrl=`http://localhost:5000/api/auth/reset-password/${resetToken}`;
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
          const activityCount= await activity.countDocuments();
          const nextActivity=activityCount+1;
          const format=nextActivity.toString().padStart(4,"0");
          const activityNumber=`ACT-${format}`;
          const newActivity=await activity.create({
                  activityNumber,
                  performedBy:user,
                  action:"create user",
                  entityType:"user",
                  entityId:newUser.id,
                  targetLabel:newUser.userName,
                  description:`user ${userName} created `
              });
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
exports.update=async(id,updatebody,user)=>{
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
          const activityCount= await activity.countDocuments();
          const nextActivity=activityCount+1;
          const format=nextActivity.toString().padStart(4,"0");
          const activityNumber=`ACT-${format}`;
          const newActivity=await activity.create({
                  activityNumber,
                  performedBy:User,
                  action:"update user",
                  entityType:"user",
                  entityId:userExist.id,
                  targetLabel:userExist.userName,
                  description:`user ${userName} created `
              });
    return userExist;
}
exports.deactivate=async(id,user)=>{
  const userExist=await User.findById(id).select("-password -refreshToken");
  if(!userExist){
    throw new Error("User not found");
  }
  if(userExist.isActive===false){
    throw new Error("User already deactivated");
  }
  userExist.isActive=false;
  const activityCount= await activity.countDocuments();
          const nextActivity=activityCount+1;
          const format=nextActivity.toString().padStart(4,"0");
          const activityNumber=`ACT-${format}`;
          const newActivity=await activity.create({
                  activityNumber,
                  performedBy:User,
                  action:"deactivate user",
                  entityType:"user",
                  entityId:userExist.id,
                  targetLabel:userExist.userName,
                  description:`user ${userName} deactivated `
              });
  await userExist.save();
  
  return userExist;
}
exports.activate=async(id,user)=>{
  const userExist=await User.findById(id).select("-password -refreshToken");
  if(!userExist){
    throw new Error("User not found");
  }
  if(userExist.isActive===true){
    throw new Error("User already activated");
  }
  userExist.isActive=true;
  const activityCount= await activity.countDocuments();
          const nextActivity=activityCount+1;
          const format=nextActivity.toString().padStart(4,"0");
          const activityNumber=`ACT-${format}`;
          const newActivity=await activity.create({
                  activityNumber,
                  performedBy:User,
                  action:"activate user",
                  entityType:"user",
                  entityId:userExist.id,
                  targetLabel:userExist.userName,
                  description:`user ${userName} activated `
              });
  await userExist.save();
  return userExist;
}