const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 8000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

var game_players = {};
var game_ids = {}


function randomIDGen(length = 10) {
    const timestampPart = Date.now().toString(36);
    const randomPartLength = length - timestampPart.length;
    const randomPart = Math.random().toString(36).substr(2, randomPartLength);

    let randomString = `${timestampPart}-${randomPart}`;
    return randomString;
}


io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('create_race', (user, callback) => {
        const game_id = randomIDGen()
        const game_name = user.name+"' game"
        game_players[game_id] = {players: {}, info: {}}
        game_players[game_id].info = {game_name: game_name, user_id: user.id}
        game_ids[socket.id] = game_id
        game_players[game_id].players[socket.id] = user;
        callback({socket_id: socket.id, game_id: game_id, game_name: game_name})
    });

    socket.on('join', (user, gameId, callback) => {
        if(game_players[gameId]){
            game_ids[socket.id] = gameId
            game_players[gameId].players[socket.id] = user;
            io.emit('players_join', game_players[gameId].players)
            const game = game_players[gameId]
            callback({game: true, players: game.players, game_info: game.info})
        }else {
            callback({game: false})
        }
    });

    socket.on('disconnect', function () {
        const game_id = game_ids[socket.id]
        if(game_id && game_players[game_id]?.players[socket.id]) {
            delete game_players[game_id]?.players[socket.id];
            io.emit('players_join', game_players)
        }
    });
    socket.on('game', message => {
        console.log('From client: ', message)
        io.emit('game', message)
    })
    socket.on('game_progress', message => {
        io.emit('game_progress', message)
    })
    socket.on('game_started', message => {
        io.emit('game_started', message)
    })
})


app.get('/', function(req, res) {
  res.sendfile("index.html")
});

app.get('/:game_id', function(req, res) {
    res.sendfile("index.html")
});
  

server.listen(port, '0.0.0.0', function () {
    console.log(`Listening on port ${port}`);
});