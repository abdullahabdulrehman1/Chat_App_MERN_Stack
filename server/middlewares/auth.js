import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies["chatAppSocket"];
  if (!token) {
    return next(new ErrorHandler("Please login to access this route", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded.id;

  next();
};
export const isAdminAuthenticated = async (req, res, next) => {
  const token = req.cookies["chatAppSocketAdminToken"];
  if (!token) {
    return next(new ErrorHandler("Only Admin to access this route", 401));
  }
  const secretKey = jwt.verify(token, process.env.JWT_SECRET);
  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    return next(new ErrorHandler("Only Admin to access this route", 401));
  }

  next();
};
