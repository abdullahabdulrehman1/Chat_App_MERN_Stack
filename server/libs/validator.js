import { body, check, param, query, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";
export const validatorHandler = (req, res, next) => {
  const errors = validationResult(req);
  const errorMessage = errors.errors.map((err) => err.msg).join(", ");
  console.log(errorMessage);
  if (errors.isEmpty()) {
    return next();
  } else {
    return next(new ErrorHandler(errorMessage, 400));
  }
};
export const registerValidator = () => [
  body("name").notEmpty().withMessage("Name is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body("bio").notEmpty().withMessage("Bio is required"),
];
export const loginValidator = () => [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
export const newGroupChatValidator = () => [
  body("name").notEmpty().withMessage("Name is required"),
  body("members")
    .notEmpty()
    .withMessage("Members are required")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members must be at least 2"),
];
export const addMembersValidator = () => [
  body("members")
    .notEmpty()
    .withMessage("Members are required")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be at least 1"),
  body("chatId").notEmpty().withMessage("ChatId is required"),
];
export const removeMembersValidator = () => [
  body("members")
    .notEmpty()
    .withMessage("Members are required")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be at least 1"),
  body("chatId").notEmpty().withMessage("ChatId is required"),
];
export const leaveGroupValidator = () => [
  param("id").notEmpty().withMessage("ChatId is required"),
];

export const sendAttachmentsValidator = () => [
  body("chatId").notEmpty().withMessage("ChatId is required"),
];
export const getMessagesValidator = () => [
  param("id").notEmpty().withMessage("ChatId is required"),
];
export const renameGroupValidator = () => [
  param("id").notEmpty().withMessage("ChatId is required"),
  body("name").notEmpty().withMessage("Name is required"),
];
export const deleteChatValidator = () => [
  param("id").notEmpty().withMessage("ChatId is required"),
];

export const getChatDetailsValidator = () => [
  param("id").notEmpty().withMessage("ChatId is required"),
];
export const searchUserValidator = () => [
  query("name").notEmpty().withMessage("name is required"),
];
export const sendRequestValidator = () => [
  body("userId").notEmpty().withMessage("userId is required"),
];
export const acceptRequestValidator = () => [
  body("requestId").notEmpty().withMessage("Request ID is required"),
  body("accept")
    .notEmpty()
    .withMessage("Please Add Accept")
    .isBoolean()
    .withMessage("Accept must be boolean"),
];
export const adminLoginValidator = () => [
  body("secretKey").notEmpty().withMessage("Secret key is required"),
];
