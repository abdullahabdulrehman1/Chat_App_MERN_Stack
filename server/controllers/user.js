import { compare } from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { NEW_REQUEST, REFETCH_CHAT } from "../constants/event.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import {
  cookieOption,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { User } from "./../models/user.js";
export const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;
  const file = req.file;

  if (!file) return next(new ErrorHandler("Please upload an image", 400));
  const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) reject(new ErrorHandler("Image upload failed", 500));
          resolve(result);
        }
      );
      stream.end(fileBuffer);
    });
  };

  const result = await uploadToCloudinary(file.buffer);
  const avatar = {
    public_id: result.public_id,
    url: result.secure_url,
  };
  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar: avatar,
  });
  sendToken(res, 201, user, "User created successfully");
});
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
export const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = TryCatch(async (req, res, next) => {
  res
    .status(200)
    .cookie("chatAppSocket", "", { ...cookieOption, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const searchUser = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    groupChat: false,
    members: req.user,
  });
  const allUser = chats
    .flatMap((chat) => chat.members)
    .filter((member) => member != req.user);
  const name = req.query.name || "";
  // console.log(req.query.name)
  const allUsersExceptMeAndFriends = await User.find({
    // _id: { $nin: [., req.user] }, // to see which users are not your friend
    name: { $regex: name, $options: "i" },
  });
  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  res.status(200).json({
    success: true,
    users: users,
  });
});

export const sendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const newRequest = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });
  if (newRequest) return next(new ErrorHandler("Request already sent", 400));
  if (userId === req.user)
    return next(new ErrorHandler("You can't send request to yourself", 400));
  await Request.create({
    sender: req.user,
    receiver: userId,
  });
  emitEvent(req, NEW_REQUEST, [userId]);
  res.status(200).json({
    success: true,
    message: "Friend Request Sent",
  });
});
export const acceptRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;
  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");
  console.log(request);
  if (!request) return next(new ErrorHandler("Request not found", 404));
  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized receiver of this request", 401)
    );
  if (!accept) {
    await request.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }
  const members = [request.sender._id, request.receiver._id];
  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}, ${request.receiver.name}`,
    }),
    await request.deleteOne(),
  ]);
  emitEvent(req, REFETCH_CHAT, members);

  res.status(200).json({
    success: true,
    message: "Request Accepted",
    senderId: request.sender._id,
  });
});

export const getAllNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests
    .map(({ _id, sender }) => {
      if (sender) {
        return {
          _id: _id,
          sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url,
          },
        };
      }
    })
    .filter((request) => request);

  res.status(200).json({
    success: true,
    allRequest: allRequests,
  });
});
export const getAllFriends = TryCatch(async (req, res) => {
  const { chatId } = req.query; // Fixed destructuring to get chatId properly

  // Find all chats that involve the current user and are not group chats
  const chats = await Chat.find({
    members: req.user, // Ensure user._id is passed to match ObjectId
    groupChat: false,
  }).populate("members", "name avatar");

  // Map over chats to get all friends (excluding the current user from each chat)
  const allFriends = chats
    .map(({ members }) => {
      const otherUser = members.find(
        (member) =>
          member && member._id && member._id.toString() !== req.user.toString()
      );
      if (otherUser) {
        return {
          _id: otherUser._id,
          name: otherUser.name,
          avatar: otherUser.avatar?.url || null, // Handle if avatar is missing
        };
      }
    })
    .filter(Boolean); // This will remove undefined values from allFriends
  // console.log(allFriends)

  // If chatId is provided, filter out friends who are already in the given chat
  if (chatId) {
    const chat = await Chat.findById(chatId).populate("members", "_id");

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    const availableFriends = allFriends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends: allFriends,
    });
  }
});
