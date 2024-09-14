import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/event.js";
import { getSockets } from "./libs/helper.js";
import { errorMiddleware } from "./middlewares/error.js";
import adminRoute from "./routes/admin.js";
import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";
import connectDB from "./utils/features.js";
import { Message } from "./models/message.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
dotenv.config();
export const userSocketIds = new Map();
const app = express();
const server = createServer(app);
const io = new Server(server, {});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1/users", userRoute);
app.use("/api/v1/chats", chatRoute);
app.use("/api/v1/admin", adminRoute);
io.use((socket, next) => {});
io.on("connection", (socket) => {
  const user = {
    _id: "abdull",
    name: "abdullah",
  };
  userSocketIds.set(user._id.toString(), socket.id);
  console.log("userSocketIds:", userSocketIds);
  console.log("a user connected", socket.id);

  socket.on(NEW_MESSAGE, async (data) => {
    const parsedData = JSON.parse(data);
    const { chatId, members, message } = parsedData;
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      chat: chatId,
      sender: {
        _id: user._id,
        name: user.name,
      },
      createdAt: new Date().toISOString(),
    };
    console.log("new Message", messageForRealTime);
    const messageForDB = {
      content: message,
      chat: chatId,
      sender: user._id,
    };
    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(membersSockets).emit(NEW_MESSAGE_ALERT, { chatId });
    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    userSocketIds.delete(user._id.toString());
    console.log("user disconnected");
  });
});
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV}`);
  userRoute;
});
