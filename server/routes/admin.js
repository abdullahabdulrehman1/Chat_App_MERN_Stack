import express from "express";
import {
  adminLogin,
  adminLogout,
  allChats,
  allMessages,
  allUsers,
  getAdminData,
  getDashboardStats,
} from "../controllers/admin.js";
import { adminLoginValidator, validatorHandler } from "../libs/validator.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const app = express.Router();
app.post("/verify", adminLoginValidator(), validatorHandler, adminLogin);
app.get("/logout", adminLogout);
//only Admin
app.use(isAdminAuthenticated);
app.get("/",getAdminData);
app.get("/admindashboardstats", getDashboardStats);
app.get("/users", allUsers);
app.get("/allchats", allChats);
app.get("/allmessages", allMessages);

export default app;
