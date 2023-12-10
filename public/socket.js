var socket = io.connect("http://localhost:8000/");

var players = [];

socket.on('game', function(response) {
    console.log(response);
})