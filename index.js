const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const redis = require('redis');
const { Server } = require('socket.io');
const io = new Server(server);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.io = io;
  next();
});


const { Emitter } = require("@socket.io/redis-emitter");
const { createClient } = require("redis");

const redisClient = createClient();
// const io = new Emitter(redisClient);


app.post('/notifications', (req, res) => {
  console.log(req.body.message);
  notification = req.body.message;
  io.sockets.emit('chat message', notification);
  res.send('ok');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  });
  
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});