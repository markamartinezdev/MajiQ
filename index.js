const express = require("express");
const app = express();
const server = require("http").Server(app);
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
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    const broadcast = socket.to(roomId)
    broadcast.emit("user-connected", userId);
  });
});
server.listen(PORT, () => {
  console.log('connected')
});