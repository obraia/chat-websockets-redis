const express = require('express');
const http = require('http');
const path = require('path');
const socket = require('socket.io');
const dotenv = require('dotenv');
const Redis = require('./src/redis');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socket.listen(server);
const redis = new Redis();

const buildDir = path.join(__dirname, 'build');

app.use(express.static(buildDir));

app.get('/*', (req, res, next) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

io.on('connection', socket => {
  console.log(`Socket conectado ${socket.id}`);

  redis.hGet('messages').then(messages => {
    socket.local.emit('recoveryMessages', messages);
  });

  socket.on('sendMessage', data => {
    socket.broadcast.emit('recivedMessage', data);
    redis.hset('messages', String(data.id), data);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Servidor iniciado na porta ${process.env.PORT}`);
});
