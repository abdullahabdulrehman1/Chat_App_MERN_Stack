import express from "express";
import { getMyProfile, login, logout,searchUser, newUser } from "./../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
const app = express.Router();
app.post("/newUser", singleAvatar, newUser);
app.post("/login", login);



//user must be log in to access this route
app.use(isAuthenticated);
app.get("/me",getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);
export default app;
