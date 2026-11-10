const express=require("express");
const dotenv=require("dotenv");
const connectDb=require("./Config/DB");
const cors=require("cors");
const morgan=require("morgan");
const {seedAdmin}=require("./seed/adminSeeder")

dotenv.config({path:".env"});
connectDb();

const app=express();
app.use(morgan("dev"));
// CLIENT_URL may hold one or more comma separated origins, e.g. https://hela-coop.vercel.app
const allowedOrigins=(process.env.CLIENT_URL||"http://localhost:5173").split(",").map((o)=>o.trim().replace(/\/+$/,""));
app.use(cors({origin:allowedOrigins}));
app.use(express.json());
const {errorhandler}=require("./Middlewares/errorHandler");
require("./Cron/interestCron");
require("./Cron/addIntersetCron");
require("./Cron/fixedMaturatyCron");
//console.log("Loading loanRepayCron...");
require("./Cron/loanRepayCron");
//console.log("loanRepayCron loaded successfully");
seedAdmin();


const authRoutes=require("./Routes/authRoutes");
const userRoutes=require("./Routes/userRoutes");
const customerRoutes=require("./Routes/customerRoutes");
const savingsRoutes=require("./Routes/savingsRoutes");
const transactionRouter=require("./Routes/transactionRoutes");
const adminRoutes=require("./Routes/dashedboardRoutes");
const loanRoutes=require("./Routes/loanRoutes");
const customerAuthRoutes=require("./Routes/customerAuthRoutes");
const customerPortalRoutes=require("./Routes/customerPortalRoutes");
const activityRoutes=require("./Routes/activityRoutes");
app.get("/api/health",(req,res)=>res.json({status:"ok"}));
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/customer",customerRoutes);
app.use("/api/savings",savingsRoutes);
app.use("/api/transactions",transactionRouter);
app.use("/api/dashedboard",adminRoutes);
app.use("/api/loan",loanRoutes);
app.use("/api/customerAuth",customerAuthRoutes);
app.use("/api/Portal",customerPortalRoutes);
app.use("/api/activity",activityRoutes);

app.use(errorhandler);
process.on("unhandledRejection",(reason)=>{
    console.error("Unhandled promise rejection:",reason);
});
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`);
});