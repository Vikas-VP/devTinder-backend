const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_CLUSTER_URI);
};

module.exports = connectDB;
