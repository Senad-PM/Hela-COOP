const express=require("express");
const dotenv=require("dotenv");
const connectDb=require("./Config/DB");
const cors=require("cors");
const morgan=require("morgan");

dotenv.config({path:".env"});
connectDb();

const app=express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
const {errorhandler}=require("./Middlewares/errorHandler");

const authRoutes=require("./Routes/authRoutes");
const userRoutes=require("./Routes/userRoutes");
const customerRoutes=require("./Routes/customerRoutes");
const savingsRoutes=require("./Routes/savingsRoutes");
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/customer",customerRoutes);
app.use("/api/savings",savingsRoutes);

app.use(errorhandler);
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`);
});