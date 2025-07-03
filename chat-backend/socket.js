const { Server } = require("socket.io");

module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Join a room for conversation
    socket.on("user-join-room", ({ roomId }) => {
      socket.join(roomId);
      console.log(`📥 User joined room: ${roomId}`);
    });

    // When a user sends a message
    socket.on("send-message", ({ newMessage, conversation }) => {
      io.to(conversation._id).emit("receive-message", {
        newMessage,
        conversation,
      });
    });

    // When a user deletes a message
    socket.on("delete-message", ({ cid, messageId }) => {
      io.to(cid).emit("message-deleted", { cid, messageId });
    });

    // Typing indicator
    socket.on("typing", ({ cid, uid, isTyping, name }) => {
      io.to(cid).emit("user-typing", { cid, uid, isTyping, name });
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};
