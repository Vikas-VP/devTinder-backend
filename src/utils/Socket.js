const socket = require("socket.io");
const Chat = require("../models/Chat");
const User = require("../models/User");

const initializeServer = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    const connectedUsers = new Map();
    socket.on("userOnline", async (userId) => {
      console.log(userId, "userOnline");
      connectedUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, {
        status: "online",
      });
      // // Optionally notify others
      io.emit("userStatusUpdate", { userId, status: "online" });
    });
    socket.on("joinChat", async ({ userName, fromUserId, targetUserId }) => {
      const roomId = [fromUserId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ userName, fromUserId, targetUserId, message }) => {
        const roomId = [fromUserId, targetUserId].sort().join("_");
        try {
          let findChat = await Chat.findOne({
            participants: { $all: [fromUserId, targetUserId] },
          });
          if (!findChat) {
            findChat = new Chat({
              participants: [fromUserId, targetUserId],
              messages: [],
            });
          }

          findChat.messages.push({
            senderId: fromUserId,
            text: message,
          });
          await findChat.save();
          io.to(roomId).emit("messageRecived", {
            userName,
            fromUserId,
            targetUserId,
            message,
          });
          console.log(userName, message);
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", async () => {
      for (const [userId, sId] of connectedUsers.entries()) {
        if (sId === socket.id) {
          connectedUsers.delete(userId);
          await User.findByIdAndUpdate(userId, {
            status: "offline",
            lastSeen: new Date(),
          });

          // io.emit("userStatusUpdate", { userId, status: "offline" });
          break;
        }
      }
    });
  });
};

module.exports = initializeServer;
