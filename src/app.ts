import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";
import cors from 'cors'
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",  
    credentials: true,  
  })
)
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);

export default app;