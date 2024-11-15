const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/DatabaseConfig.js')
const app = express();
const dotenv = require("dotenv");
const session = require('express-session');
const path = require('path');
const http = require('http');
var https = require('https');
const nurseRouter = require('./Routers/nurseRouter.js');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

dotenv.config({ path: "./config.env" });

var cors = require('cors');
const extraRouter = require('./Routers/extraRouter.js');
app.use(cors());
app.use(express.json({limit: '5mb', extended: true}));

app.use(session({
  secret
  : 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));


  
const port = process.env.PORT;
app.listen(port , () => console.log('App listening on port ' + port));
  


startRoutes();

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("joinRoom", async ({ userId, nurseId,token }) => {
      const request = await Request.findOne({
          UserId: userId,
          NurseId: nurseId,
          Status: 1 // only accepted requests
      });
      if (request) {
          const roomId = `${userId}-${nurseId}`;
          socket.join(roomId);
          if(token){
            const auth = await authModel.findOne({ SessionID, token });
            if(!auth){
              socket.emit("error", "Session expired or invalid");
            }
          }else
          {
            socket.emit("error", "No token provided");
          }

          socket.emit("roomJoined", { success: true, roomId });
      } else {
          socket.emit("roomJoined", { success: false, message: "No active request found between user and nurse." });
      }
  });

  socket.on("chatMessage", async ({ roomId, senderId, message }) => {
      // Save message to MongoDB if the user is in the room
      if (io.sockets.adapter.rooms.get(roomId)) {
          const newMessage = new Message({ senderId, roomId, message });
          await newMessage.save();

          // Broadcast the message to all users in the room
          io.to(roomId).emit("newMessage", { senderId, message, roomId });
      } else {
          socket.emit("error", "Unable to send message. Room not found.");
      }
  });

  socket.on("disconnect", () => {
      console.log("Client disconnected");
  });
});

function startRoutes(){
  app.use('/user',require('./Routers/userRouter.js'));
  app.use('/nurse',nurseRouter);
  app.use('/extra',extraRouter);
}