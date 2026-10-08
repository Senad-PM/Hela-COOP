const rateLimit=require("express-rate-limit");

const loginLimiter=rateLimit({
       windowMs:15*60*1000,
       max:10,
       message:{
        success:false,
        message:"too many login attempts please try again after 15 minutes"}

});

const apiLimiter=rateLimit({
    windowMs:15*60*1000,
    max:200,
    message:{
        success:false,
        message:"too many request please try again after 15 minutes"
    }
});
const dashedboardLimiter=rateLimit({
    windowMs:15*60*1000,
    max:100,
    message:{
        success:false,
        message:"too many request please try again after 15 minutes"
    }
});
module.exports={loginLimiter,apiLimiter,dashedboardLimiter};