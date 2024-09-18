const express = require('express');
const http = require('http');
const path = require("path");
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 8010;

// Serve static files from the 'public' directory
app.use(express.static('public'));

let users = {};
let chats = [];

function randomIDGen(length = 10) {
    const timestampPart = Date.now().toString(36);
    const randomPartLength = length - timestampPart.length;
    const randomPart = Math.random().toString(36).substr(2, randomPartLength);
    return `${timestampPart}-${randomPart}`;
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (user, callback) => {
        if (!users[socket.id]) {
            users[socket.id] = user;  // Store user by socket.id
        }
        callback(chats);
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            io.emit('left', users[socket.id]);  // Emit user who left
            delete users[socket.id];  // Clean up user on disconnect
        }
    });

    socket.on('send', (message) => {
        console.log('From client:', message);
        chats.push(message)
        io.emit('message', message);  // Correct the event name
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, "chat.html"));
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
