const jwt=require("jsonwebtoken");

const generateRefreshToken=(id)=>{
    return jwt.sign(
        {id},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:"7d"}
    );
};
module.exports=generateRefreshToken;