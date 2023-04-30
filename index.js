require("dotenv").config()
const express = require("express");
const mgt = require('./src/game/cards.js')
const app = express();
const server = require("http").Server(app);
const routes = require('./src/routes/index.js')
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const PORT = process.env.NODE_PORT ?? 3030
app.use("/peerjs", peerServer);
app.use(express.static("public"));
app.use(routes)
app.get("/", (req, res) => {
  res.redirect(`/room/${uuidv4()}`);
});
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    mgt.addPlayer(userId, userName)
    const broadcast = socket.to(roomId)
    broadcast.emit("user-connected", userId);
  });
});;
server.listen(PORT, () => {
  console.log('connected on port: ' + PORT)
});