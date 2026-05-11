const {createUser}=require("../Services/userService");

exports.registerUser=async(req,res,next)=>{
    try{
    const{userName,email,password,role}=req.body;
    console.log(req.body);
    const result= await createUser(userName,email,password,role);
    res.status(201).json(result);
    }catch(error){
        next(error);
    }
}