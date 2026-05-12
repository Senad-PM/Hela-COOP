const User=require("../Models/user");
const bcrypt=require("bcrypt");
const { search } = require("../Routes/userRoutes");
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
}
const buildsort=(query)=>{
         let sortOption = { createdAt: -1 };
                if(query.sort && query.sort.trim()!== ""){
                    const[field,order]=query.sort.split("_");
                      sortOption = {
                     [field]: order === "desc" ? -1 : 1
                     };
                }
        return sortOption;
};

exports.getUsers=async(query)=>{
       const filter=buildFilter(query);
       const sortoption=buildsort(query);
       console.log(filter);
       const{limit,skip,page}=buildpagination(query);
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
}