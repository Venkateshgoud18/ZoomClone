import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://frontendservices-uvq8.onrender.com",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-call", (path) => {
      console.log(`${socket.id} joined call at path: ${path}`);

      if (!connections[path]) {
        connections[path] = [];
        messages[path] = [];
      }

      // Avoid duplicate socket IDs in the room
      if (!connections[path].includes(socket.id)) {
        connections[path].push(socket.id);
      }

      timeOnline[socket.id] = Date.now();

      // Notify other users in the room about new user
      connections[path].forEach((userSocketId) => {
        if (userSocketId !== socket.id) {
          io.to(userSocketId).emit("user-joined", socket.id, connections[path]);
        }
      });

      // Notify joining user about successful join with current connections
      io.to(socket.id).emit("joined", socket.id, connections[path]);

      // Send chat history to the joining user
      if (messages[path] && messages[path].length > 0) {
        messages[path].forEach((msg) => {
          io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"]);
        });
      }
    });

    socket.on("signal", (toId, message) => {
      // Forward WebRTC signaling message to the specified socket
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      // Find the room of the sender socket
      const [room, found] = Object.entries(connections).find(([_, sockets]) => sockets.includes(socket.id)) || ["", false];

      if (found) {
        if (!messages[room]) {
          messages[room] = [];
        }

        const msgData = {
          data,
          sender,
          "socket-id-sender": socket.id,
        };

        messages[room].push(msgData);

        console.log(`Message in ${room} from ${sender}: ${data}`);

        // Broadcast chat message to all users in the room
        connections[room].forEach((userSocketId) => {
          io.to(userSocketId).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      const disconnectTime = Date.now();
      const onlineTime = timeOnline[socket.id] || disconnectTime;
      const diffTime = Math.abs(onlineTime - disconnectTime);
      console.log(`User disconnected: ${socket.id} after ${diffTime} ms`);

      // Find the room(s) the disconnected user was in and clean up
      for (const [roomKey, roomUsers] of Object.entries(connections)) {
        const userIndex = roomUsers.indexOf(socket.id);

        if (userIndex !== -1) {
          // Notify others in the room the user left
          roomUsers.forEach((userId) => {
            if (userId !== socket.id) {
              io.to(userId).emit("user-left", socket.id);
            }
          });

          // Remove user from the room
          roomUsers.splice(userIndex, 1);

          // If the room is empty, remove it and its messages
          if (roomUsers.length === 0) {
            delete connections[roomKey];
            delete messages[roomKey];
          }

          break; // exit after removing user from their room
        }
      }

      // Clean up online time tracking for disconnected user
      delete timeOnline[socket.id];
    });
  });

  return io;
};

export default connectToSocket;
