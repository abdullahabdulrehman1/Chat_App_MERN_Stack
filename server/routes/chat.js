import express from "express";
import { getMyProfile } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMembers,
  LeaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessage,
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import {
  addMembersValidator,
  deleteChatValidator,
  getChatDetailsValidator,
  getMessagesValidator,
  leaveGroupValidator,
  newGroupChatValidator,
  removeMembersValidator,
  renameGroupValidator,
  sendAttachmentsValidator,
  validatorHandler,
} from "../libs/validator.js";
const app = express.Router();

//user must be log in to access this route
app.use(isAuthenticated);
app.post("/new", newGroupChatValidator(), validatorHandler, newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmembers", addMembersValidator(), validatorHandler, addMembers);
app.put(
  "/removemembers",
  removeMembersValidator(),
  validatorHandler,
  removeMembers
);
app.delete("/leave/:id", leaveGroupValidator(), validatorHandler, LeaveGroup);
app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validatorHandler,
  sendAttachments
);
app.get("/message/:id", getMessagesValidator(), validatorHandler, getMessage);
app
  .route("/:id")
  .get(getChatDetailsValidator(), validatorHandler, getChatDetails)
  .put(renameGroupValidator(), validatorHandler, renameGroup)
  .delete(deleteChatValidator(), validatorHandler, deleteChat);
export default app;
