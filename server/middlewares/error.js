export const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message } = err;

  // If status code is not a number, default to 500
  if (typeof statusCode !== "number") {
    statusCode = 500;
  }
  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    statusCode = 400;
    message = `Duplicate field value entered for ${error}`;
  }
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found. Invalid Format: ${err.path}`;
  }
  res.status(statusCode).json({
    success: false,
    messsage: process.env.NODE_ENV.trim() === "DEVELOPMENT" ? err : err.message,
    error: message || "Server Error",
  });
};
export const TryCatch = (passedFunction) => async (req, res, next) => {
  try {
    await passedFunction(req, res, next);
  } catch (error) {
    next(error);
  }
};
