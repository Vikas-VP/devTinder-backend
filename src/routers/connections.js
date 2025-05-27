const express = require("express");
const connectionRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");

connectionRouter.get("/connection/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionReq = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      connectionStatus: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    res.status(200).json({
      message: "Data fetched successfully",
      data: connectionReq,
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

connectionRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionReq = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          connectionStatus: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          connectionStatus: "accepted",
        },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const userConnectionReqInfo = connectionReq?.map((request) => {
      if (request.fromUserId._id.equals(loggedInUser._id)) {
        return request.toUserId;
      }
      return request.fromUserId;
    });

    res.status(200).json({
      message: "Data fetched successfully",
      data: userConnectionReqInfo,
      loggedInUser: loggedInUser._id,
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

module.exports = connectionRouter;
