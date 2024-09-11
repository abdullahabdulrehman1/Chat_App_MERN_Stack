import express from "express";
import { allUsers } from "../controllers/admin.js";

const app = express.Router();
app.get("/users", allUsers);
export default app;
