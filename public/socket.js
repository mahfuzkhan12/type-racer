var socket = io.connect("http://localhost:8000/");
socket.on('game', function(response) {
    console.log(response);
})