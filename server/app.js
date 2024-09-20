import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { createServer, get } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE,
  STARTTYPING,
  STOPTYPING,
} from "./constants/event.js";
import { getSockets } from "./libs/helper.js";
import { errorMiddleware } from "./middlewares/error.js";
import adminRoute from "./routes/admin.js";
import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";
import connectDB from "./utils/features.js";
import { Message } from "./models/message.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import { socketAuthenticator } from "./middlewares/auth.js";
dotenv.config();
export const userSocketIds = new Map();
const onlineUsers = new Set();
const app = express();
const server = createServer(app);
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://chatappsocketclient.vercel.app",

    process.env.CLIENT_URL,
  ],
  credentials: true,
};
const io = new Server(server, { cors: corsOptions });
app.set("io", io);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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
io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  );
});
io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIds.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async (data) => {
    const { chatId, members, message } = data;
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
    // console.log("new Message", messageForRealTime);
    const messageForDB = {
      content: message,
      chat: chatId,
      sender: user._id,
    };
    // console.log("Emitting Real Message:", messageForRealTime);
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

  socket.on(STARTTYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STARTTYPING, { chatId });
  });
  socket.on(STOPTYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOPTYPING, { chatId });
  });
  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString());

    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(ONLINE, Array.from(onlineUsers));
  });
  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());
    const membersSockets = getSockets(members);
    io.to(membersSockets).emit(ONLINE, Array.from(onlineUsers));
  });
  socket.on("disconnect", () => {
    userSocketIds.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
  });
});
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV}`);
  userRoute;
});
export default app;
