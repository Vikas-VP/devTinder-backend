const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const validateProfileEditData = require("../utils/validateProfile");
const User = require("../models/User");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send({
      message: "Profile fetched successfully!!!",
      data: req.user,
    });
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  console.log("patch");
  try {
    if (!validateProfileEditData(req.body)) {
      throw new Error("Invalid data provided for profile edit");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    res.json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(400).send("ERROR:" + err.message);
  }
});

profileRouter.patch("/profile/update-password", userAuth, async (req, res) => {
  const { newPassword } = req.body;
  try {
    if (!newPassword) {
      throw new Error("Please provide a new password to update");
    }

    const isOldNewPasswordSame = await bcrypt.compare(
      newPassword,
      req.user.password
    );
    if (isOldNewPasswordSame) {
      throw new Error("New password should not be same as old password");
    }
    const user = req.user;
    const encryptedPassword = await user.encryptData(newPassword);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { password: encryptedPassword },
      { new: true, runValidators: true }
    );
    res.json({
      message: "Password updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = profileRouter;
