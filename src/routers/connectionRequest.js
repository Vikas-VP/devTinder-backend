const express = require("express");
const connectionRequestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

connectionRequestRouter.post(
  "/connectionRequest/send/:connectionStatus/:toUserId",
  userAuth,
  async (req, res) => {
    const { connectionStatus, toUserId } = req.params;
    const fromUserId = req.user._id;
    try {
      const isToUserValid = await User.findById(toUserId);
      if (!isToUserValid) {
        throw new Error(
          "The person you are trying to send the request is invalid"
        );
      }

      const connectionAlreadyPresent = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (connectionAlreadyPresent) {
        throw new Error(
          "There is already an existing connection between this user"
        );
      }

      const newRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        connectionStatus,
      });
      const savedData = await newRequest.save();
      res.status(200).json({
        message: "Request sent successfully",
        response: savedData,
      });
    } catch (err) {
      res.status(400).send("Error:" + err);
    }
  }
);

connectionRequestRouter.post(
  "/connectionRequest/review/:reviewStatus/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { reviewStatus, requestId } = req.params;

      if (!["accepted", "rejected"].includes(reviewStatus)) {
        throw new Error("Invalid review status");
      }

      const isValidConnectionReq = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: req.user._id,
        connectionStatus: "interested",
      });

      if (!isValidConnectionReq) {
        return res.status(404).json({
          message: "Invalid connection request",
        });
      }

      isValidConnectionReq.connectionStatus = reviewStatus;
      const data = await isValidConnectionReq.save();
      res.status(200).json({
        message: reviewStatus + " successfully",
        data,
      });

      //   const isConnectionReviewed = ConnectionRequest.findOne({
      //     $or: [
      //       {
      //         fromUserId: req.user._id,
      //         toUserId: requestId,
      //         connectionStatus: "accepted",
      //       },
      //       {
      //         fromUserId: req.user._id,
      //         toUserId: requestId,
      //         connectionStatus: "rejected",
      //       },
      //     ],
      //   });

      //   if (isConnectionReviewed) {
      //     return req.status(200).json({
      //       message: "This connection request is already reviewed before",
      //     });
      //   }
    } catch (error) {
      res.status(400).send("Error:" + error);
    }
  }
);

module.exports = connectionRequestRouter;
