const express = require("express");
const userAuth = require("../middlewares/auth");

const userRequestsRouter = express.Router();
const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectionRequest");

userRequestsRouter.get("/getAllUser", userAuth, async (req, res) => {
  try {
    const usersData = await User.find({ isDeleted: false });
    res.send(usersData);
  } catch (err) {
    res.status(400).send("Error fetching users data", err);
  }
});

userRequestsRouter.get("/getUserData/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await User.findById(id);
    //returns null if user not found
    // id should be of length 24length characters
    //happens when the string passed as id is not a valid 24-character hexadecimal ObjectId. It will directly go to the catch block
    if (!userData) {
      return res.status(404).send("User not found");
    }
    res.send(userData);
  } catch (err) {
    console.log(err);
    res.status(400).send("Error fetching user data", err);
  }
});

userRequestsRouter.post("/deleteUser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true } // return the updated document
    );
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(400).send("Error deleting the user", err);
  }
});

userRequestsRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    console.log(skip, limit);
    const connectionAlreadyPresent = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUsedId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");
    const idsToExclude = new Set();
    connectionAlreadyPresent.forEach((req) => {
      idsToExclude.add(req.fromUserId.toString());
      idsToExclude.add(req.toUserId.toString());
    });

    const feeds = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(idsToExclude) },
        },
        { _id: { $ne: loggedInUser._id } }, // if there are no connection recived or sent for this user u will get uniqueIds as empty so add this seperatly to remove the users card for themself
      ],
    })
      .select("firstName lastName age gender")
      .skip(skip)
      .limit(limit);

    const totalCount = await User.countDocuments({
      $and: [
        {
          _id: { $nin: Array.from(idsToExclude) },
        },
        { _id: { $ne: loggedInUser._id } }, // if there are no connection recived or sent for this user u will get uniqueIds as empty so add this seperatly to remove the users card for themself
      ],
    });

    res.status(200).json({
      message: "Fetched successfully",
      data: feeds,
      paginationInfo: {
        page,
        perPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

module.exports = userRequestsRouter;
