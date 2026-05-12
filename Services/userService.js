const User=require("../Models/user");
const bcrypt=require("bcrypt");
constjwt=require("jsonwebtoken");

exports.createUser=async(userName,email,password,role)=>{
           console.log(userName, email, password, role);
           if(!userName || !email || !password || !role){
             throw new Error("all field must be filled ");
           }
           const userExist=await User.findOne({email})
           if(userExist){
            throw new Error("user already exists");
           }
          const newUser=await User.create({
            userName,
            email,
            password,
            role,
            
          })
           return({
             id:newUser._id,
             userName:newUser.userName,
             email:newUser.email,
             role:newUser.role,
             isActive:newUser.isActive   
           });
};
const buildpagination=(query)=>{
                const page= +query.page || 1;
                const limit= +query.limit || 10;
                const skip= (page-1)*limit;
                 return {limit,skip,page};
};
const buildFilter=(query)=>{
     const filter={};
     if(query.role!==undefined){
       filter.role=query.role;
     }
     if(query.isActive!==undefined){
       filter.isActive = query.isActive === "true"; 
     }
     return filter;
}

exports.getUsers=async(query)=>{
       const filter=buildFilter(query);
       console.log(filter);
       const{limit,skip,page}=buildpagination(query);
       const count=await User.countDocuments(filter);
                 if(count > 0 && skip >= count){
                    throw new Error("page not found");
                 }
       const users=await User.find(filter).skip(skip).limit(limit).select("-password -refreshToken");
        
       return({
            "total":count,
            "page":page,
            "limit":limit,
            "data":users
        });
}