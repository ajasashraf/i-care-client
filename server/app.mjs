const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connection = require("./config/dbConnection.js");
const userRouter = require("./routes/user.js");
const adminRouter = require("./routes/admin.js");
const doctorRouter = require("./routes/doctor.js");
const chatRouter = require("./routes/chat.js");
const doctorChatRouter = require("./routes/doctorChat.js");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
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
const server = app.listen(2000, () => {
  console.log("server connected to port 2000");
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

