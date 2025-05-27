const { mongoose, Schema } = require("mongoose");

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: String,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: String,
      required: true,
      ref: "User",
    },
    connectionStatus: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is invalid connection status`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function async(next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId === connectionRequest.toUserId) {
    throw new Error("You cannot send request to yourself");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
