import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { cookieOption } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";

export const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;

  const isMatched = secretKey === process.env.ADMIN_SECRET_KEY;

  if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401));

  const token = jwt.sign(secretKey, process.env.JWT_SECRET);

  return res
    .status(200)
    .cookie("chatAppSocketAdminToken", token, {
      ...cookieOption,
      maxAge: 1000 * 60 * 15,
    })
    .json({
      success: true,
      message: "Authenticated Successfully, Welcome BOSS",
    });
});

export const adminLogout = TryCatch(async (req, res, next) => {
  res
    .status(200)
    .clearCookie("chatAppSocketAdminToken")
    .cookie("chatAppSocketAdminToken", "", { ...cookieOption, maxAge: 0 })
    .json({
      success: true,
      message: "Admin Successfully logged out",
    });
});
export const allUsers = TryCatch(async (req, res, next) => {
  const users = await User.find();
  const transformUsers = await Promise.all(
    users.map(async ({ name, username, avatar, _id }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: _id }),
        Chat.countDocuments({ groupChat: false, members: _id }),
      ]);
      return { name, username, avatar: avatar.url, _id, groups, friends };
    })
  );
  res.status(200).json({
    success: true,
    message: "All users",
    users: transformUsers,
  });
});

export const allChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find()
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformChats = await Promise.all(
    chats.map(async ({ members, _id, groupChat, name, creator }) => {
      try {
        const totalMessages = await Message.countDocuments({ chat: _id });
        return {
          _id,
          groupChat,
          name,
          avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
          members: members.map(({ name, avatar, _id }) => {
            return { name, avatar: avatar.url, _id };
          }),
          creator: {
            name: creator ? creator?.name : "None",
            avatar: creator ? creator?.avatar.url : "None",
          },
          totalMembers: members.length,
          totalMessages,
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    })
  );
  res.status(200).json({
    success: true,
    message: "All chats",
    transformChats: transformChats,
  });
});

export const allMessages = TryCatch(async (req, res, next) => {
  const messages = await Message.find()
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");
  const transformMessages = messages.map(
    ({ chat, sender, _id, content, attachments, createdAt }) => {
      return {
        _id,
        attachments,
        chat: chat._id,
        groupChat: chat.groupChat,
        sender: {
          _id: sender._id,
          name: sender.name,
          avatar: sender.avatar.url,
        },
        content,
        createdAt,
      };
    }
  );
  res.status(200).json({
    success: true,
    message: "All messages",
    messages: transformMessages,
  });
});

export const getDashboardStats = TryCatch(async (req, res, next) => {
  const [totalUsers, totalChats, totalMessages, groupCount] = await Promise.all(
    [
      User.countDocuments(),
      Chat.countDocuments({ groupChat: false }),
      Message.countDocuments(),
      Chat.countDocuments({ groupChat: true }),
    ]
  );
  const today = new Date();
  const last7Days = new Date(today - 7 * 24 * 60 * 60 * 1000);
  const last7DaysMessages = await Message.find({
    createdAt: { $gte: last7Days, $lte: today },
  }).select("createdAt");
  const messages = new Array(7).fill(0);
  last7DaysMessages.forEach((element) => {
    const indexApprox =
      ((today.getDate() - element.createdAt.getDate()) / 24) * 60 * 60 * 1000;
    const index = Math.floor(indexApprox);
    messages[6 - index]++;
  });
  res.status(200).json({
    success: true,
    message: "Dashboard stats",
    stats: { totalUsers, totalChats, totalMessages, groupCount, messages },
  });
});
export const getAdminData = TryCatch(async (req, res, next) => {
  return res.status(200).json({
    success: true,

    isAdmin: true,
  });
});
