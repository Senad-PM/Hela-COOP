const calculateInterest=(balance,interestRate)=>{
    if(balance===undefined || interestRate===undefined){
        throw new Error("all filed must be filled");
    }
    if(balance<0){
        throw new Error("negative balance not accepted");
    }
    const dailyInterest=(balance*interestRate/100)/365;
    const interest=Number(dailyInterest.toFixed(2));
    return (interest);

};
module.exports=calculateInterest;