import express from "express";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import connectDb from "./config/database.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDb();
app.use("/api/product", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/order",orderRoutes)

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Port started successfully at http://localhost:${PORT}`);
});
