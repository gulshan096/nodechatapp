import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import { createServer } from "http";

import userRoute from "./routes/userRoute.js";
import path from "path";

import logger from "./logger.js";
import { Server } from "socket.io";
import User from "./models/userModel.js";
import Chat from "./models/chatModel.js";

dotenv.config();
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "Pace2025#",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.resolve("./public")));
app.set("view engine", "ejs");
app.set("views", "./views");

const PORT = process.env.PORT || 4000;
const URL =
  "mongodb+srv://firstcrudapp:firstcrudapp@firstcrudapp.hqircqq.mongodb.net/";

const server = createServer(app);
const io = new Server(server);

const mcon = io.of("/my-connection");

mcon.on("connection", async (socket) => {
  logger.info("user connected");

  const userId = socket.handshake.auth.userId;
  logger.info(`User authenticated with TOKEN: ${userId}`);
  await User.findByIdAndUpdate(userId, { $set: { is_online: "1" } });

  // online status
  socket.broadcast.emit("getOnlineUser", { user_id: userId });

  socket.on("disconnect", async () => {
    logger.info("user disconnected");

    await User.findByIdAndUpdate(userId, { $set: { is_online: "0" } });
    logger.info(`User status updated to offline for userId: ${userId}`);

    // offline status
    socket.broadcast.emit("getOfflineUser", { user_id: userId });
  });

  // chat implement

  socket.on("newChat", (data) => {
    socket.broadcast.emit("loadNewChat", data);
  });

  // load Old Chats

  socket.on("existChat", async (data) => {
    var chats = await Chat.find({
      $or: [
        { sender_id: data.sender_id, receiver_id: data.receiver_id },
        { sender_id: data.receiver_id, receiver_id: data.sender_id },
      ],
    });

    socket.emit("loadOldChats", { chats: chats });
  });
});

mongoose
  .connect(URL, { dbName: "chat-app" })
  .then(() => {
    logger.info("DB connected successfully");
    server.listen(PORT, () => {
      logger.info(`server is runn  ing on port : ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // console.log("Request Method:", req.method);
  // console.log("Request URL:", req.url);
  // console.log("Request Headers:", req.headers);
  // console.log("Request:", req.body);
  next();
});

app.use("/", userRoute);
