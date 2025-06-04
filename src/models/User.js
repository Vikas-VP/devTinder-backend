const { mongoose, Schema } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function arrayLimit(val) {
  return val.length <= 5;
}

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 32,
    },
    lastName: String,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    skills: {
      type: Array,
      default: [],
      validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
    },
    age: Number,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Generates a JSON Web Token (JWT) for the user instance.
 * The token contains the user's ID and is signed with the secret key.
 * The token expires in 1 day.
 * @returns {Promise<string>} - A promise that resolves to the JWT string.
 */

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

/**
 * Compares the given userEnteredPassword with the encrypted password stored in the document.
 * @param {string} userEnteredPassword - The password entered by the user.
 * @returns {Promise<boolean>} - true if the passwords match, false otherwise.
 */
userSchema.methods.validatePassword = async function (userEnteredPassword) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    userEnteredPassword,
    user.password
  );
  return isPasswordValid;
};

userSchema.methods.encryptData = async function (data) {
  const encryptedData = await bcrypt.hash(data, Number(process.env.SALT_ROUND));
  return encryptedData;
};

module.exports = mongoose.model("User", userSchema);
