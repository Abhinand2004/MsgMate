import jwt from "jsonwebtoken"; // For authentication
import ChatBox from "./models/ChatBox.js"; // Import ChatBox model
import userSchema from "./models/User.js"; // Import userSchema model

const handleSocketEvents = (io) => {
    // Middleware for socket authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Validate token
            socket.user = decoded; // Store user info in socket object
            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected with socket ID: ${socket.id}`);

        // Join Room
        socket.on("joinRoom", async (chatId, callback) => {
            try {
                // Validate chatId (e.g., check if the room exists in the database)
                const chatExists = await ChatBox.exists({ _id: chatId });
                if (!chatExists) {
                    return callback({ status: "error", message: "Invalid chat room" });
                }

                socket.join(chatId); // Join the room
                console.log(`User ${socket.user.id} joined room: ${chatId}`);
                callback({ status: "ok", message: `Joined room: ${chatId}` });
            } catch (err) {
                console.error("Error joining room:", err);
                callback({ status: "error", message: "Server error" });
            }
        });

        // Send Message
        socket.on("sendMessage", async (data, callback) => {
            const { chatId, message, receiverId } = data;

            try {
                if (!chatId || !message || !receiverId) {
                    return callback({ status: "error", message: "Invalid data" });
                }

                // Validate receiver exists in userSchema
                const receiverExists = await userSchema.exists({ _id: receiverId });
                if (!receiverExists) {
                    return callback({ status: "error", message: "Receiver does not exist" });
                }

                // Save message to the database
                const newMessage = await ChatBox.create({
                    chatId: chatId,
                    message: message,
                    sender_id: socket.user.id,
                    receiver_id: receiverId,
                    time: new Date(),
                });

                // Broadcast message to the room
                io.to(chatId).emit("newMessage", {
                    chatId,
                    message: newMessage.message,
                    senderId: socket.user.id,
                    time: newMessage.time,
                });

                console.log(`Message sent to room ${chatId}: ${message}`);
                callback({ status: "ok", message: "Message sent successfully" });
            } catch (err) {
                console.error("Error sending message:", err);
                callback({ status: "error", message: "Server error" });
            }
        });

        // Disconnect
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export default handleSocketEvents;
