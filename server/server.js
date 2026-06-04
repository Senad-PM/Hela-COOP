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
    origin: ['http://localhost:5174', 'http://127.0.0.1:5174', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
const {errorhandler}=require("./Middlewares/errorHandler");

const authRoutes=require("./Routes/authRoutes");
const userRoutes=require("./Routes/userRoutes");
const customerRoutes=require("./Routes/customerRoutes");
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/customer",customerRoutes);
app.use(errorhandler);
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`);
});