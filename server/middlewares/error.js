export const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message } = err;

  // If status code is not a number, default to 500
  if (typeof statusCode !== "number") {
    statusCode = 500;
  }

  res.status(statusCode).json({
    success: false,
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
