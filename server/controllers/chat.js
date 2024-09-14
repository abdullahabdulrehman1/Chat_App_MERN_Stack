import {
  ALERT,
  NEW_ATTACHEMENT,
  NEW_MESSAGE_ALERT,
  REFETCH,
  REFETCH_CHAT,
} from "../constants/event.js";
import { getOtherMembers } from "../libs/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { Message } from "./../models/message.js";

export const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;
  if (members.length < 2) {
    return next(new ErrorHandler("Please add at least one member", 400));
  }

  const allMembers = [...members, req.user];
  const chat = await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} Group`, chat);
  emitEvent(req, REFETCH, members);
  return res.status(201).json({
    success: true,
    message: "Group created successfully",
    chat,
  });
});
export const getMyChats = TryCatch(async (req, res, next) => {
  const userId = req.user;

  const chats = await Chat.find({ members: userId }).populate(
    "members",
    "name avatar"
  );

  const transformedChats = chats
    .map((chat) => {
      const otherMembers = getOtherMembers(chat.members, req.user);

      if (!otherMembers) {
        console.error("otherMembers is undefined for chat:", chat);
        return null;
      }

      return {
        _id: chat._id,
        name: chat.groupChat ? chat.name : otherMembers.name,
        groupChat: chat.groupChat,
        avatar: chat.groupChat
          ? chat.members.slice(0, 3).map(({ avatar }) => avatar.url)
          : [otherMembers.avatar.url],
        members: chat.members.reduce((acc, member) => {
          acc.push(member._id);
          return acc;
        }, []),
      };
    })
    .filter((chat) => chat !== null); // Filter out any null values

  res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});
export const getMyGroups = TryCatch(async (req, res) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");
  const groups = chats.map(({ members, _id, groupChat, name }) => {
    return {
      _id,
      groupChat,
      name,
      avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    };
  });
  res.status(200).json({
    success: true,
    groups,
  });
});

export const addMembers = TryCatch(async (req, res, next) => {
  const { members, chatId } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 400));
  }
  if (chat.creator.toString() !== req.user) {
    return next(new ErrorHandler("You are not authorized to add members", 401));
  }

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));
  const allNewMembers = await Promise.all(allNewMembersPromise);
  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map(({ _id }) => _id);
  const duplicateMembers = allNewMembers
    .filter((i) => chat.members.includes(i._id.toString()))
    .map(({ _id }) => _id);

  const duplicateNamesPromise = duplicateMembers.map(({ _id }) =>
    User.findById(_id, "username")
  );
  const duplicateNames = await Promise.all(duplicateNamesPromise);

  if (duplicateMembers.length > 0) {
    return next(
      new ErrorHandler(
        `The ${duplicateNames
          .map((i) => i.username)
          .join(",")} users are already members of the chat: ${chatId}`,
        400
      )
    );
  }
  chat.members.push(...uniqueMembers);
  if (chat.members.length > 100) {
    return next(new ErrorHandler("Please add at least one member", 400));
  }
  if (!members || members.length < 1) {
    return next(new ErrorHandler("Please add at least one member", 400));
  }
  await chat.save();
  const allUsersName = allNewMembers.map(({ name }) => name).join(", ");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} has been added to ${chat.name} group`,
    chat
  );
  emitEvent(req, REFETCH, members);
  return res.status(200).json({
    success: true,
    message: "Members added successfully",
  });
});

export const removeMembers = TryCatch(async (req, res, next) => {
  const { members, chatId } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 400));
  }
  if (chat.creator.toString() !== req.user) {
    return next(
      new ErrorHandler("You are not authorized to remove members", 401)
    );
  }
  const allMembers = chat.members.map((i) => i.toString());
  const membersToRemove = members.filter((i) => allMembers.includes(i));
  if (membersToRemove.length < 1) {
    return next(
      new ErrorHandler("Please select at least one member to remove", 400)
    );
  }
  const membersToKeep = allMembers.filter((i) => !membersToRemove.includes(i));
  if (membersToKeep.length < 2) {
    return next(
      new ErrorHandler("Group chat must have at least two members", 400)
    );
  }
  chat.members = membersToKeep;

  await chat.save();
  const allUsers = await User.find({ _id: { $in: membersToRemove } }, "name");
  const allUsersName = allUsers.map(({ name }) => name).join(", ");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} has been removed from ${chat.name} group`,
    chat
  );
  emitEvent(req, REFETCH, membersToRemove);
  return res.status(200).json({
    success: true,
    message: "Members removed successfully",
  });
});

export const LeaveGroup = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const chat = await Chat.findById(id);
  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 400));
  }
  const allMembers = chat.members.map((i) => i.toString());

  if (!allMembers.includes(req.user)) {
    return next(new ErrorHandler("You are not a member of this group", 400));
  }
  const membersToKeep = allMembers.filter((i) => i !== req.user);

  if (membersToKeep.length < 2) {
    return next(
      new ErrorHandler("Group chat must have at least two members", 400)
    );
  }
  chat.members = membersToKeep;
  if (chat.creator.toString() === req.user) {
    chat.creator = membersToKeep[0];
  }

  await chat.save();
  const user = await User.findById(req.user, "name");
  emitEvent(req, ALERT, chat.members, `${user.name} has left the group`, chat);
  emitEvent(req, REFETCH, [req.user]);
  return res.status(200).json({
    success: true,
    message: "You have left the group",
  });
});

export const sendAttachments = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const files = req.files || [];
  if (files.length < 1) {
    return next(new ErrorHandler("Please select at least one file", 400));
  }
  if (files.length > 5) {
    return next(
      new ErrorHandler("You can only select a maximum of 5 files", 400)
    );
  }

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);
  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }
  if (!chat.members.includes(req.user)) {
    return next(new ErrorHandler("You are not a member of this chat", 400));
  }
  if (files.length < 1) {
    return next(new ErrorHandler("Please select at least one file", 400));
  }
  const attachments = [];
  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };
  const messageForRealtime = {
    ...messageForDB,

    sender: { _id: me._id, name: me.name },
  };

  const message = await Message.create(messageForRealtime);
  emitEvent(
    req,
    NEW_ATTACHEMENT,
    chat.members,
    { message: messageForRealtime, chatId },
    chat
  );
  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId, sender: me._id });
  return res.status(200).json({
    success: true,
    message,
  });
});
export const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();
    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }
    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));
    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }
    return res.status(200).json({
      success: true,
      chat,
    });
  }
});
export const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;
  const chat = await Chat.findById(chatId);
  console.log(req.user.toString());
  if (!chat) return next(new ErrorHandler("Chat Not Found", 404));
  if (!chat.groupChat) return next(new ErrorHandler("Invalid Group Chat", 404));
  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Invalid Group Chat", 404));
  chat.name = name;
  await chat.save();
  emitEvent(req, REFETCH_CHAT, chat.members);
  return res.status(200).json({
    success: true,
    message: "Group Name Changed Successfully!",
  });
});
export const deleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.pararms.id;
  const chat = await chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat Not Found", 404));
  const members = chat.members;
  if (chat.groupChat && chat.creator.toString() !== req.user)
    return next(new ErrorHandler("You are not Allowed", 404));
  if (!chat.groupChat && !chat.members.includes(req.user.toString()))
    return next(new ErrorHandler("You are not a member of this Group", 404));
  //
  //delete all messegas as well as attachemnts or files on cloudinar
  const messagesWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });
  const public_ids = [];
  messagesWithAttachments.forEach(({ attachments }) => {
    attachments.forEach(({ public_id }) => {
      public_ids.push(public_id);
    });
  });
  await Promise.all([
    //dleetefiles from cloudinary

    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);
  emitEvent(req, REFETCH_CHAT, members);
  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});
export const getMessage = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;
  const limit = 20;
  const skip = (page - 1) * limit;
  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);
  const totalPages = Math.ceil(totalMessagesCount / limit || 0);
  return res.status(200).json({
    success: true,
    message: messages.reverse(),
    totalPages,
  });
});
