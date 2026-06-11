import { Server } from "socket.io";

let io;
const userSocketMap = {};

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit(
      "getOnlineUsers",
      Object.keys(userSocketMap)
    );

    socket.on("disconnect", () => {
      console.log(
        "User Disconnected:",
        socket.id
      );

      delete userSocketMap[userId];

      io.emit(
        "getOnlineUsers",
        Object.keys(userSocketMap)
      );
    });
  });

  return io;
};

export { io };