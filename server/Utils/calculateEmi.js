const calculateEmi=(principalAmount,interestRate,durationMonths)=>{
    if(principalAmount===undefined || interestRate===undefined || durationMonths===undefined){
        throw new Error("all fileds must be filed");
    }
    if(principalAmount<=0){
        throw new Error("principal amount should be greater than 0");
    }
    if(interestRate<=0){
        throw new Error("interestRate amount should be greater than 0");
    }
    if(durationMonths<=0){
        throw new Error("duration of months should be greater than 0");
    }
    const P=principalAmount;
    const R=(interestRate/100)/12;
    const N=durationMonths;

    const power=Math.pow(1+R,N);
    const numerator=P*R*power;
    const denominator=power-1;
    const emi=numerator/denominator;
    const EMI=Number(emi.toFixed(2));
    return(EMI);
};
module.exports=calculateEmi;