import express, { json, urlencoded } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import  connection  from "./config/dbConnection.js";
import  userRouter  from "./routes/user.js";
import  adminRouter  from "./routes/admin.js";
import  doctorRouter  from "./routes/doctor.js";
import  chatRouter  from "./routes/chat.js";
import  doctorChatRouter  from "./routes/doctorChat.js";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(json({ limit: "50mb" }));
app.use(
  urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(logger("dev"));
connection();
app.use(
  cors({
    origin: ["http://localhost:4000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-type", "Access", "Authorization"],
  })
);

app.use("/admin", adminRouter);
app.use("/", userRouter);
app.use("/doctor", doctorRouter);
app.use('/chat', chatRouter)
app.use('/doctor/chat',doctorChatRouter)
const server = app.listen(3000, () => {
  console.log("server connected to port 3000");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
