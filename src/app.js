const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database.js");
const User = require("./models/User.js");
const app = express();
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const userRequestsRouter = require("./routers/userRequests");
const connectionRouter = require("./routers/connections.js");
const cookieParser = require("cookie-parser");
const userAuth = require("./middlewares/auth");
const connectionRequestRouter = require("./routers/connectionRequest.js");
const cors = require("cors");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: " http://localhost:5173",
    credentials: true,
  })
);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRequestsRouter);
app.use("/", connectionRequestRouter);
app.use("/", connectionRouter);

// app.use("/", (req, res) => {
//   res.send("Hello World!");
// });

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT, async () => {
      console.log(`Server is running on porttt ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
