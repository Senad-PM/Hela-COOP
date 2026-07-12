const express=require("express");
const dotenv=require("dotenv");
const connectDb=require("./Config/DB");
const cors=require("cors");
const morgan=require("morgan");

dotenv.config({path:".env"});
connectDb();

const app=express();
app.use(morgan("dev"));
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || origin.match(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
const {errorhandler}=require("./Middlewares/errorHandler");
require("./Cron/interestCron");
require("./Cron/addIntersetCron");
require("./Cron/fixedMaturatyCron");
//console.log("Loading loanRepayCron...");
require("./Cron/loanRepayCron");
//console.log("loanRepayCron loaded successfully");

const authRoutes=require("./Routes/authRoutes");
const userRoutes=require("./Routes/userRoutes");
const customerRoutes=require("./Routes/customerRoutes");
const savingsRoutes=require("./Routes/savingsRoutes");
const transactionRouter=require("./Routes/transactionRoutes");
const adminRoutes=require("./Routes/dashedboardRoutes");
const loanRoutes=require("./Routes/loanRoutes");
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/customer",customerRoutes);
app.use("/api/savings",savingsRoutes);
app.use("/api/transactions",transactionRouter);
app.use("/api/dashedboard",adminRoutes);
app.use("/api/loan",loanRoutes);

app.use(errorhandler);
const PORT=process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`);
});