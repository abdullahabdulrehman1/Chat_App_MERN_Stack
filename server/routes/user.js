import express from "express";
import {
  getMyProfile,
  login,
  logout,
  searchUser,
  sendRequest,
  newUser,
  acceptRequest,
  getAllNotifications,
  getAllFriends,
} from "./../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  loginValidator,
  registerValidator,
  sendRequestValidator,
  acceptRequestValidator,
  validatorHandler,
} from "../libs/validator.js";
import { get } from "mongoose";
const app = express.Router();
app.post(
  "/newUser",
  singleAvatar,
  registerValidator(),
  validatorHandler,
  newUser
);
app.post("/login", loginValidator(), validatorHandler, login);

//user must be log in to access this route
app.use(isAuthenticated);
app.get("/me", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);
app.put("/sendrequest", sendRequestValidator(), validatorHandler, sendRequest);
app.put("/acceptrequest", acceptRequestValidator(), validatorHandler, acceptRequest);
app.get("/notifications",getAllNotifications);
app.get("/friends",getAllFriends)
export default app;
