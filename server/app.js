import express from "express";
import userRoute from "./routes/user.js";
const app = express();
// console.log(userRoute)
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/users", userRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  userRoute;
});
