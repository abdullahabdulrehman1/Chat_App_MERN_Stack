import express from "express";
import connectDB from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/users", userRoute);
app.use("/chats",chatRoute);

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
  userRoute;
});
