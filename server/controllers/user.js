import { TryCatch } from "../middlewares/error.js";
import { cookieOption, sendToken } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { User } from "./../models/user.js";
import { compare } from "bcrypt";
export const newUser = async (req, res) => {
  const { name, username, password, bio } = req.body;
  const avatar = {
    public_id: "req.file.public_id",
    url: "jsdlkf",
  };
  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar: avatar,
  });
  sendToken(res, user, 201, "User created successfully");
};
export const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Username ", 400));
  }
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid Password", 400));
  } else {
    sendToken(res, 200, user, "Login successful");
  }
});
export const getMyProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user);
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = TryCatch(async (req, res) => {
  res
    .status(200)
    .cookie("chatAppSocket", "", { ...cookieOption, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const searchUser = TryCatch(async (req, res) => {
  const { name } = req.query;
  // const users = await User.find({
  //   name: { $regex: name, $options: "i" },
  // }).select("name username avatar");
  res.status(200).json({
    success: true,
    message: name,
  });
});
