import mongoose from "mongoose";
import jwt from "jsonwebtoken";
export const cookieOption = {
  maxAge: 3600000,
  sameSite: "none",
  secure: true,
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "chatAppSocket" })
    .then((data) => {
      console.log(`Connected to MongoDB: ${data.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};
export const sendToken = (res, code, user, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.status(code).cookie("chatAppSocket", token, cookieOption).json({
    success: true,
    message,
  });
};
export const emitEvent = (req, event, users, data) => {
  const io = req.app.get("Emitting Even");
};
export default connectDB;
