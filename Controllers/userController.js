const {createUser,getUsers,getUsersById,update,deactivate,activate}=require("../Services/userService");

exports.registerUser=async(req,res,next)=>{
    try{
    const{userName,email,password,role}=req.body;
    const user=req.user._id
    console.log(req.body);
    const result= await createUser(userName,email,password,role,user);
    res.status(201).json(result);
    }catch(error){
        next(error);
    }
};

exports.getAllUsers=async(req,res,next)=>{
     try{
        const result=await getUsers(req.query);
        res.status(200).json(result);
     }catch(error){
        next(error);
     }
};
exports.getUserById=async(req,res,next)=>{
    try{
        const result=await getUsersById(req.params.id);
        res.status(200).json(result);
    }catch(error){
         next(error);
    }
}
exports.updateUser=async(req,res,next)=>{
    try{
        const user=req.user._id
        const result=await update(req.params.id,req.body,user);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
}
exports.deactivateUser=async(req,res,nex)=>{
    try{
        const user=req.user._id
        const result=await deactivate(req.params.id,user);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
}
exports.activateUser=async(req,res,next)=>{
    try{
        const user=req.user._id
        const result=await activate(req.params.id,user);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
}
