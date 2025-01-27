import express from "express";
import Router from "./router.js";
import connection from "./connection.js";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use('/api', Router);

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
        io.emit("updatechatlist",msg)
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

connection().then(() => {
    httpServer.listen(process.env.PORT, () => {
        console.log(`server started at http://localhost:${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
});
