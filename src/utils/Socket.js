const socket = require("socket.io");

const initializeServer = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userName, fromUserId, targetUserId }) => {
      const roomId = [fromUserId, targetUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      ({ userName, fromUserId, targetUserId, message }) => {
        const roomId = [fromUserId, targetUserId].sort().join("_");
        io.to(roomId).emit("messageRecived", {
          userName,
          fromUserId,
          targetUserId,
          message,
        });
        console.log(userName, message);
      }
    );
  });
};

module.exports = initializeServer;
