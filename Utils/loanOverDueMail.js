const { text } = require("express");
const nodemailer=require("nodemailer");


const overDueEmail=async(email,customerName,loanNumber,emi,dueDate)=>{
const transporter=nodemailer.createTransport({
    service:process.env.EMAIL_SERVICE,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});
  const mailOptions={
    from:process.env.EMAIL_USER,
    to:email,
    subject:"loan payment overdue",
    text:`
      Dear ${customerName},

      Your loan payment was not successful.

      Loan Number: ${loanNumber}
      EMI: Rs. ${emi}
      Due Date: ${dueDate}
    `
  };

  await transporter.sendMail(mailOptions);
};
module.exports=overDueEmail;