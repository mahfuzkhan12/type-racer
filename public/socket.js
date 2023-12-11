// var socket = io.connect("http://localhost:8000/");
var socket = io.connect("https://fd11-45-125-222-73.ngrok-free.app")

var players = [];
var game_text = [];
var multiplayer_started = false
socket.on('game', function(response) {
    if(response.user_id !== user_id){
        if(response.type === "join"){
            players.push(response.user)
        }
    }
    if(response.type === "join"){
        userJoined(response.user)
    }
    console.log(response);
})


socket.on('game_progress', function(response) {
    if(response.user_id !== user_id && response.percent > 0){
        updateProgress(response.percent, response.wpm, response.user_id)
    }
})

socket.on('game_started', function(response) {
    if(response.user_id !== user_id){
        multiplayer_started = true
        startRace(false, true, true)
    }
})