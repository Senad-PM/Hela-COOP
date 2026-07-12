const calculateFixedInterest=(balance,interestRate,durationMonths)=>{
       if(balance===undefined || interestRate===undefined || durationMonths===undefined){
        throw new Error("all filed must be filled");
    }
    if(balance<0){
        throw new Error("negative balance not accepted");
    }
    const maturaityInterest=(balance*interestRate/100)*(durationMonths/12);
    const interest=Number(maturaityInterest.toFixed(2));
    return (interest);

};
module.exports=calculateFixedInterest;

