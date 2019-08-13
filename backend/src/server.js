const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");
const routes = require("./routes");

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const CONNECTED_USERS = {};

io.on("connection", socket => {
  const { user } = socket.handshake.query;
  CONNECTED_USERS[user] = socket.id;
});

mongoose.connect(
  "mongodb+srv://omnistack:omnistack@cluster0-hgvij.mongodb.net/omnistack8?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

app.use((request, _response, next) => {
  request.io = io;
  request.CONNECTED_USERS = CONNECTED_USERS;

  next();
});
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
