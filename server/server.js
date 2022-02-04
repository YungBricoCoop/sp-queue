var fs = require("fs");
var app = require("express")();
var https = require("https");


//Create a secured server using ssl certificate files
var server = https.createServer(
  {
    key: fs.readFileSync("privkey.pem"),
    cert: fs.readFileSync("cert.pem"),
    ca: fs.readFileSync("chain.pem"),
    requestCert: false,
    rejectUnauthorized: false,
  },
  app
);

server.listen(3100);

//Allow cross-origin requests for a domain
var io = require("socket.io")(server, {
  cors: {
    origin: "https://your-domain.com",
    methods: ["GET", "POST"],
  },
});



io.sockets.on("connection", (client) => {
  client.on("joinRoom", (room) => {
    console.log(`CLIENT[${client.id}] joined ROOM[${room}]`);
    client.emit("success", "Joined the room");
    client.join(room+"");
  });
  client.on("createRoom", (room) => {
    console.log(`CLIENT[${client.id}] created ROOM[${room}]`);
    client.emit("success", "Created the room");
    client.join(room+"");
  });
  client.on("addSongToQueue", (info) => {
    console.log(io.sockets.adapter.rooms);
    let room = info.split("///")[0]+"";
    let song = info.split("///")[1];
    console.log(`CLIENT[${client.id}] added SONG[${song}] to QUEUE in ROOM[${room}]`);
    io.to(room).emit("addSongToQueue", song);
  });
  client.on("disconnect", () => {});
});

