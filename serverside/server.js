import express from "express";
import connection from "./connection.js";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import passport from "passport";
import "./passport.js"; // Ensure Passport strategy is loaded
import authRoutes from "./Authentication/Auth.js"; // Google auth routes
import Router from "./router.js"; // API routes

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Update with frontend URL in production
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// 🔹 Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(passport.initialize()); // Initialize Passport

// 🔹 Routes
app.use("/auth", authRoutes); // Google OAuth & JWT authentication routes
app.use("/api", Router); // API routes

// 🔹 Socket.IO Setup
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    io.emit("updatechatlist", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// 🔹 Start Server
connection()
  .then(() => {
    httpServer.listen(process.env.PORT || 3000, () => {
      console.log(`✅ Server started at http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });
