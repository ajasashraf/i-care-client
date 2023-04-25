"use strict";

var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _dbConnection = _interopRequireDefault(require("./config/dbConnection.js"));
var _user = _interopRequireDefault(require("./routes/user.js"));
var _admin = _interopRequireDefault(require("./routes/admin.js"));
var _doctor = _interopRequireDefault(require("./routes/doctor.js"));
var _chat = _interopRequireDefault(require("./routes/chat.js"));
var _doctorChat = _interopRequireDefault(require("./routes/doctorChat.js"));
var _cors = _interopRequireDefault(require("cors"));
var _socket = require("socket.io");
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
var app = (0, _express["default"])();
app.use((0, _cookieParser["default"])());
app.use(_bodyParser["default"].urlencoded({
  extended: true,
  limit: "50mb"
}));
app.use(_bodyParser["default"].json({
  limit: "50mb"
}));
app.use(_express["default"].json({
  limit: "50mb"
}));
app.use(_express["default"].urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 50000
}));
app.use((0, _morgan["default"])("dev"));
(0, _dbConnection["default"])();
app.use((0, _cors["default"])({
  origin: ["http://localhost:4000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-type", "Access", "Authorization"]
}));
app.use("/admin", _admin["default"]);
app.use("/", _user["default"]);
app.use("/doctor", _doctor["default"]);
app.use('/chat', _chat["default"]);
app.use('/doctor/chat', _doctorChat["default"]);
var server = app.listen(2000, function () {
  console.log("server connected to port 2000");
});
var io = new _socket.Server(server, {
  cors: {
    origin: "http://localhost:4000",
    credentials: true
  }
});
global.onlineUsers = new Map();
io.on("connection", function (socket) {
  global.chatSocket = socket;
  socket.on("add-user", function (userId) {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", function (data) {
    var sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});