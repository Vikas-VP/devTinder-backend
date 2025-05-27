const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/User");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, age, gender, email, password, skills } =
    req.body;

  try {
    if (!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    }
    const encryptedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUND)
    );
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      gender,
      age,
    });
    const cookie = await newUser.getJWT();
    res.cookie("token", cookie);
    const savedData = await newUser.save();

    res.send({
      message: "User created successfully",
      data: savedData,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error creating user",
      error: err.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    const cookie = await user.getJWT();
    res.cookie("token", cookie);
    res.send({
      message: "Login successfull",
      data: user,
    });
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      status: "OK",
      message: "Logged out successfully",
    });
});

module.exports = authRouter;
