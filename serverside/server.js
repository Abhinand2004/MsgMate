import express from "express";
import connection from "./connection.js";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import passport from "passport";
import "./passport.js"; 
import authRoutes from "./Authentication/Auth.js"; 
import Router from "./router.js"; 

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(passport.initialize()); 

app.use("/api", Router); 

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    io.emit("updatechatlist", msg);
    io.emit("createnotification", msg);
    // console.log(msg);
    

  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

connection()
  .then(() => {
    httpServer.listen(process.env.PORT || 3000, () => {
      console.log(` Server started at http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error(" Database connection failed:", error);
  });
