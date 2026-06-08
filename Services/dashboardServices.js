const User=require("../Models/user");

exports.adminDashboard=async()=>{
    const totalUsers=await User.countDocuments();
    const activeUsers=await User.countDocuments({isActive:true});
    const inactiveUsers=await User.countDocuments({isActive:false});
    const startOfTheMonth=new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );
    const newUsers=await User.countDocuments({
        createdAt:{
            $gte:startOfTheMonth
        }
    });
    return({
        TOtalUsers:totalUsers,
        ActiveUsers:activeUsers,
        InActiveUsers:inactiveUsers,
        NewUsers:newUsers
  })
};

