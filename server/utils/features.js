import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../libs/helper.js";
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
    expiresIn: "1d",
  });
  return res.status(code).cookie("chatAppSocket", token, cookieOption).json({
    success: true,
    user,
    message,
  });
};
export const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const userSocket = getSockets(users);
  io.to(userSocket).emit(event, data);
};
export const deleteFilesFromCloudinary = async (public_ids) => {};
export const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resourse_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });
  try {
    const results = await Promise.all(uploadPromises);
    const formatedResults = results.map((result) => {
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    });
    return formatedResults;
  } catch (error) {
    throw new Error("error while uploading file", error);
  }
};
export default connectDB;
