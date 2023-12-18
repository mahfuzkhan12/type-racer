
var players = [];
var game_text = [];
var multiplayer_started = false
var socket = {}

function startSocket() {
    socket = io.connect("http://localhost:8000/");

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
    
    socket.on('players_join', function(response) {
        players = response
        playersRender(response)
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


    socket.on('pre_countdown', function(response) {
        console.log(response);
        if(multiplayer){

            $(".time-display").text("0:10")

            const $starter_preloader = $(`<div class="contents">
                <img class="trafficlight" src="/assets/clear.cache.gif" style="width: 165px; height: 65px;">
                <div class="timer-text">
                    <div>Get Ready to Race!</div>
                    <div class="timer">0:10</div>
                </div>
            </div>`)
            const $trafficlight = $starter_preloader.find(".trafficlight")
            const $timer = $starter_preloader.find(".timer")
            $(".game-starter-timer").html($starter_preloader)
        
            if(response <= 5){
                $trafficlight.addClass("yellow-light")
            }
            if(time_left < 3){
                $trafficlight.removeClass("yellow-light").addClass("green-light")
            }
            $timer.text("0:"+response > 9 ? response : "0"+response)
            $(".time-display").text("0:"+response > 9 ? response : "0"+response)
        }
        
    })

}