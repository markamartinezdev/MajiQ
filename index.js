require("dotenv").config()
const express = require("express");
const app = express();
const server = require("http").Server(app);
const routes = require('./src/routes/index.js')
const { v4: uuidv4 } = require("uuid");
const { connectToCluster, createSchema } = require('./src/db/connection.js')
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const PORT = process.env.NODE_PORT ?? 3030

app.set("view engine", "ejs");

connectToCluster()

app.use("/peerjs", peerServer);
app.use(express.static("public"));
app.use(routes)
app.get("/", (req, res) => {
  res.redirect(`/room/${uuidv4()}`);
});
io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, userId, playerId }) => {
    socket.join(roomId);
    const broadcast = socket.to(roomId)
    broadcast.emit("user-connected", { userId, playerId });
  });
});
server.listen(PORT, () => {
  console.log('connected on port: ' + PORT)
});