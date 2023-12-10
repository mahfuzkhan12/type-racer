const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 8000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on('game', message => {
        console.log('From client: ', message)
        io.emit('game', message)
    })
})


app.get('/', function(req, res) {
  res.sendfile("index.html")
});

server.listen(port, '0.0.0.0', function () {
    console.log(`Listening on port ${port}`);
});