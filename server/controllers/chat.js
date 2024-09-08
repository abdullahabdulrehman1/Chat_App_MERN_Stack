import { ALERT, REFETCH } from "../constants/event.js";
import { getOtherMembers } from "../libs/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { emitEvent } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

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
export const getMyChats = TryCatch(async (req, res) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );
  const transformedChats = chats.map((chat) => {
    const otherMembers = getOtherMembers(chat.members, req.user);
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
  });
  res.status(200).json({
    success: true,
    transformedChats,
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
