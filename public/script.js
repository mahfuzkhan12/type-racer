var texts = [
    "I'm so glad you came, I'm so glad you remembered, to see how we're ending our last dance together. Expectant, too punctual, but prettier than ever, I really believe that this time it's forever.",
    "Well I woke in mid-afternoon 'cause that's when it all hurts the most. I dream I never know anyone at the party and I'm always the host. If dreams are like movies, then memories are films about ghosts. You can never escape, you can only move south down the coast.",
    "It was rough around the edges. He'd been to school, but never finished. He'd been to jail, but never prison. And it was his first day off in forever, man. The festival seemed like a pretty good plan: cruise some chicks and get a suntan. And his friend gave him four, but said only take one. But then he got bored and he ended up taking all four, so now my man ain't that bored anyways. The paramedics found him, he was shaking on the side of the stage.",
    "We rendezvous with Rochambeau, consolidate their gifts. We can end this war at Yorktown, cut them off at sea; but for this to succeed, there is someone else we need.",
    "It is not hard to make money in the market. What is hard to avoid is the alluring temptation to throw your money away on short, get-rich-quick speculative binges. It is an obvious lesson, but one frequently ignored.",
    `I always make offers with escape clauses. In real estate, I make an offer with language that details "subject-to" contingencies, such as the approval of a business partner. Never specify who the business partner is. Most people don't know that my partner is my cat.`,
    `Music finds a comfortable parallel with that of human language. Much as language has words, sentences, and stories, music has tones, melodies, and songs.`,
    `And I don't believe in the existence of angels but looking at you I wonder if that's true. But if I did I would summon them together, and ask them to watch over you. To each burn a candle for you, to make bright and clear your path. And to walk, like Christ, in grace and love and guide you into my arms.`,
    `Stab a sorry heart with your favorite finger. Paint the whole world blue and stop your tears from stinging. Hear the cavemen singing. Good news they're bringing. Seven seas, swimming them so well. Glad to see my face among them kissing the tortoise shell.`,
    `They typically had very rosy views about their own futures, which they imagined to include successful careers, happy marriages, and good health. When asked to speculate about their roommates' futures, however, their responses were far more realistic.`
]

var text;
var text_arr = [];
var text_index = false
var completed = false
var remaining = text
var writting;

var written = ""
var index = -1
var currently_writting = ""


var interval;
var total_time = 90
var time_left = 90
var game_started = false
var game_initiated = false
var multiplayer = false

var car_container, car_container_width, car_width;

function startGame() {
    $(".game-timer .title").text("Go!")
    $(".game-view").addClass('started')
    $(".text-input").prop("disabled", false).val("").change().focus()
    $(".game-starter-timer").html("")
    game_started = true

    car_container = $("#"+user_id+" .result-progress")
    car_container_width = car_container.width()
    car_width = $("#"+user_id+" .vehicle-container").width()

    $(".time-display").text(1 + ":" + 30);
    time_left = total_time
    interval = setInterval(() => {
        time_left--;
        var minutes = Math.floor(time_left / 60);
        var seconds = time_left % 60;
        var secondsDisplay = (seconds < 10) ? "0" + seconds : seconds;
        if(time_left == 0){
            endRace()
        }else {
            if(!completed){
                var wpm = 0
                if(game_started){
                    const words_typed = index+1
                    const time_gone_minutes = (total_time - time_left) / 60
                    wpm = Math.ceil(words_typed / time_gone_minutes)
                }
                updateProgress(index + 1, wpm, user_id)
                socket.emit("game_progress", {user_id: user_id, percent: index + 1, wpm: wpm});
            }
        }
        $(".time-display").text(minutes + ":" + secondsDisplay);
    }, 1000);
}

function startRace(is_practice = false, init = false, game_start = false) {

    if(!init){
        const rand_num = Math.floor(Math.random() * 10)
        text = texts[rand_num]
        text_arr = text.split(" ")
    }

    completed = false
    game_started = false
    remaining = text
    writting = text_arr[0]

    written = ""
    index = -1
    currently_writting = ""

    $(".game-timer .title").text(init ? "Waiting for others to join" : "The race is about to start!")
    $(".game-input-panel").show()
    $(".game-view .leave-race-btn").show()
    $(".game-view .start-race-btn").hide()
    if(init && !game_start){
        return;
    }

    $(".game-timer").show()
    $(".time-display").text(is_practice ? "0:05" : "0:10")

    const $starter_preloader = $(`<div class="contents">
        <img class="trafficlight" src="/assets/clear.cache.gif" style="width: 165px; height: 65px;">
        <div class="timer-text">
            <div>Get Ready to Race!</div>
            <div class="timer">0:${is_practice ? "05" : "10"}</div>
        </div>
    </div>`)
    const $trafficlight = $starter_preloader.find(".trafficlight")
    const $timer = $starter_preloader.find(".timer")
    $(".game-starter-timer").html($starter_preloader)

    $(".join-game").hide()
    $(".game-view").show()

    if(multiplayer && !multiplayer_started){
        multiplayer_started = true
        socket.emit("game_started", {type: "game_started"});
    }

    var time_left = is_practice ? 5 : 10
    var yel_time = is_practice ? 3 : 5
    var gel_time = is_practice ? 2 : 3
    interval = setInterval(() => {
        time_left--
        if(time_left <= yel_time){
            $trafficlight.addClass("yellow-light")
        }
        if(time_left < gel_time){
            $trafficlight.removeClass("yellow-light").addClass("green-light")
        }
        
        if(time_left === 0){
            clearInterval(interval)
            startGame()
        }
        $timer.text("0:0"+time_left)
        $(".time-display").text("0:0"+time_left)
    }, 1000);
    updateText()
}

function startPractice(){
    startRace(true)
}

function userJoined(user) {
    console.log($(".user_id#"+user?.user_id), user);
    if($(".user_id#"+user?.user_id).length < 1){
        $(".game-result").append(`
            <div class="user_id" id="${user?.user_id}">
                <div class="result-contents">
                    <div class="result-progress">
                        <div class="vehicle-container">
                            <div class="name-container">
                                <div class="name" style="white-space: nowrap;">${user?.name}</div>
                                <span class="username"></span>
                            </div>
                            <div class="avatar-container" style="background-image: url(${user?.avatar})"></div>
                        </div>
                    </div>
                    <div>
                        <div class="place"></div>
                        <div class="wpm">0 wpm</div>
                    </div>
                </div>
            </div>
        `)
    }
    if(players.length === 0){
        $(".start-race-btn").prop("disabled", true)
    }else {
        $(".start-race-btn").prop("disabled", false).show()
        $(".game-timer .title").html("Click <b style='color:#3cc1a3'>Join Race</b> button to start the game")
    }
}

function joinGame() {
    console.log(text_arr, players);
    $(".join-game").hide()
    $(".game-view").show()
    $(".game-input-panel").show()
    $(".game-timer").show()
    $(".game-timer .title").text("Waiting for others to join")
    var rand_num = Math.floor(Math.random() * 10)
    if(players.length === 0){
        game_initiated = true
        $(".start-race-btn").prop("disabled", true)
    }else {
        rand_num = players[0]?.text_idx
        game_initiated = true
        $(".start-race-btn").prop("disabled", false).show()
    }        
    console.log(text_index);
    text = texts[rand_num]
    text_arr = text.split(" ")
    startRace(false, true)
    updateText()
    multiplayer = true
    socket.emit("game", { user_id: user_id, game_text: rand_num, user: {name: username, user_id: user_id, avatar: user_vehicle, text_idx: rand_num}, name: username, type: "join", avatar: user_vehicle });
}

function endRace (){
    game_started = false
    clearInterval(interval)
    $(".game-timer .title").text("The race has ended.")
    $(".game-starter-timer").html("")
    $(".game-view .start-race-btn").show()
    $(".text-input").val("").prop("disabled", true)
    $(".game-input-panel").hide()
    $(".time-display").text("")
    $(".game-view").removeClass('started')
}
function leaveGame(){
    endRace()
    $(".join-game").show()
    $(".game-view").hide()
}

function getRightWrong(typed, original){
    var right_text = ""
    var wrong_text = ""
    for(let i = 0; i < original.length; i++){
        if(original[i] === typed[i]){
            right_text += original[i]
        }else {
            wrong_text = original.substring(i, typed.length)
            break
        }
    }
    return [right_text, wrong_text]
}

function updateText(pad_width, with_errors = false) {

    var green_text = []
    var wrtting_text = []
    var rem_start_index = index+2

    var total_wrong_l = with_errors.length
    if(with_errors){
        const left_text = text_arr.slice(rem_start_index - 1).join(" ")
        var incresed_index = 0
        for(let i = 0; i < left_text.length; i++){
            if(left_text[i] === " " && i !== with_errors.length - 1){
                incresed_index++
                total_wrong_l--
            }
            if(i == with_errors.length - 1){
                break
            }
        }
        rem_start_index += incresed_index
    }

    green_text = text_arr.slice(0, index + 1);
    var has_cursor = false
    const remaining = text_arr.slice(rem_start_index).join(" ");
    var wrong_texts = ""

    var has_cursor = false

    if(with_errors){

        const left_wrong_texts = text_arr.slice(index+1, rem_start_index-1).join(" ");
        var w_right_texts = ""
        var w_wrong_texts = ""
        for(let i = 0; i < left_wrong_texts.length; i++){
            if(left_wrong_texts[i] === with_errors[i]){
                w_right_texts += left_wrong_texts[i]
            }else {
                w_wrong_texts = left_wrong_texts.substring(i, left_wrong_texts.length)
                break
            }
        }
        wrong_texts = ` <span class="green-text">${w_right_texts}</span>`
        wrong_texts += `<span class="red-text">${w_wrong_texts}</span> `
        

        const cur_text = text_arr[rem_start_index-1] || "";
        const curr_ty_len = total_wrong_l

        if(cur_text.substring(curr_ty_len, curr_ty_len+1).length > 0){
    
            has_cursor = true
            if(cur_text.substring(0, curr_ty_len).length > 0){

                if(w_wrong_texts === ""){

                    const right_wrong_texts = getRightWrong(with_errors, cur_text)
                    var w_right_texts_cur = right_wrong_texts[0]
                    var w_wrong_texts_cur = right_wrong_texts[1]
                    wrtting_text.push(`<span class="typing green-text">${w_right_texts_cur}</span>`)
                    wrtting_text.push(`<span class="typing red-text">${w_wrong_texts_cur}</span>`)

                }else {
                    wrtting_text.push(`<span class="typing red-text">${cur_text.substring(0, curr_ty_len)}</span>`)
                }
                
            }
            wrtting_text.push(`<span class="typing typing-cursor">${cur_text.substring(curr_ty_len, curr_ty_len+1)}</span>`) // typing cursor
        
            if(cur_text.substring(curr_ty_len+1, writting.length).length > 0){
                wrtting_text.push(`<span class="typing">${cur_text.substring(curr_ty_len+1, writting.length)}</span>`)
            }
        }else {
            const right_wrong_texts = getRightWrong(with_errors, cur_text)
            var w_right_texts_cur = right_wrong_texts[0]
            var w_wrong_texts_cur = right_wrong_texts[1]
            wrtting_text.push(`<span class="typing green-text">${w_right_texts_cur}</span>`)
            wrtting_text.push(`<span class="typing red-text">${w_wrong_texts_cur}</span>`)
        }

    }else {

        const cur_text = text_arr[index + 1] || "";
        const curr_ty_len = currently_writting.length
        if(cur_text.substring(curr_ty_len, curr_ty_len+1).length > 0){
    
            has_cursor = true
            if(cur_text.substring(0, curr_ty_len).length > 0){
                wrtting_text.push(`<span class="typing green-text">${cur_text.substring(0, curr_ty_len)}</span>`)
            }
            wrtting_text.push(`<span class="typing typing-cursor">${cur_text.substring(curr_ty_len, curr_ty_len+1)}</span>`) // typing cursor
        
            if(cur_text.substring(curr_ty_len+1, writting.length).length > 0){
                wrtting_text.push(`<span class="typing">${cur_text.substring(curr_ty_len+1, writting.length)}</span>`)
            }
        }else {
            green_text.push(cur_text)
            if(!text_arr[index+2]){
                completed = true
                if(!multiplayer){
                    endRace()
                }
            }
        }
    }

    const $updated_text = $("<span></span>")
        .append(`<span class="green-text">${green_text.join(" ")}</span>`)
        .append(wrong_texts)
        .append(" "+wrtting_text.join("")+ (has_cursor ? " " : `<span class="typing typing-cursor"> </span>`))
        .append(`<span>${remaining}</span>`);


    const $textContainer = $(".text-container")
    $textContainer.html($updated_text.html())

    var percent = pad_width * (index + 1)
    var wpm = 0
    if(game_started){
        const words_typed = index+1
        const time_gone_minutes = (total_time - time_left) / 60
        percent = pad_width * (index + 1)
        wpm = Math.ceil(words_typed / time_gone_minutes)
        console.log(percent, pad_width);
        // updateProgressPract(percent, wpm, user_id)
    }else {
        updateProgressPract(0, 0, user_id)
    }
    // socket.emit("game_progress", {user_id: user_id, percent: percent, wpm: wpm});
}
function updateProgressPract(percent, wpm, user_id){
    const car_container = $(".result-progress")
    $("#"+user_id+" .wpm").text(wpm + " wpm")
    car_container.css("padding-left", percent)
}

function updateProgress(percent, wpm, user_id){
    const car_container = $("#"+user_id+" .result-progress")
    // const car_container_width = car_container.width()
    // const car_width = $(".vehicle-container").width()
    pad_width = (car_container_width - car_width) / text_arr.length

    console.log(((percent+1) * pad_width));
    $("#"+user_id+" .wpm").text(wpm + " wpm")
    car_container.css("padding-left", ((percent+1) * pad_width))
}


function checkErrors(values) {
    const typed_text = values.split(" ");
    const original_text = text_arr.slice(index+1);
    if(typed_text[0].length == 0){
        return true
    }

    var is_small = false
    for (let i = 0; i < typed_text.length; i++) {
        const org_text_len = original_text[i].length
        const typ_text_len = typed_text[i].length
        if (typ_text_len == org_text_len && typed_text[i] !== original_text[i]) {
            return true
        }else {
            if(typed_text[i] === "" && is_small){
                return true
            }else if(typed_text[i] === "") {
                return false
            }
            if(typ_text_len !== org_text_len){
                is_small = true
            }
            const text = original_text[i].substring(0, typ_text_len)
            if(text !== typed_text[i]){
                return true
            }
        }
    }
    return false;
}


// text.substring(3, 6); to get indexed texts
$(document).ready(function() {

    if($(".user_id#"+user_id).length < 1){
        $(".game-result").append(`
            <div class="user_id" id="${user_id}">
                <div class="result-contents">
                    <div class="result-progress">
                        <div class="vehicle-container">
                            <div class="name-container">
                                <div class="name" style="white-space: nowrap;">${username}</div>
                                <span class="username">(you)</span>
                            </div>
                            <div class="avatar-container" style="background-image: url(${user_vehicle})"></div>
                        </div>
                    </div>
                    <div class="res_place_wpm">
                        <div class="place">1st Place!</div>
                        <div class="wpm">0 wpm</div>
                    </div>
                </div>
            </div>
        `)
    }

    const $textContainer = $(".text-container")
    $textContainer.html(`<span>${text}</span>`)

    var pad_width = 0

    updateText(pad_width)
    $("body").on("input", ".text-input", function() {

        pad_width = (car_container_width - car_width) / text_arr.length

        if(!game_started){
            $(this).val("")
            return;
        }
        const val = $(this).val()
        const last_char = val.substring(val.length - 1, val.length)
        written = val
        
        const err_count = checkErrors(val)

        if(err_count && val !== "") {
            $(this).addClass("text-warning")
            updateText(pad_width, val)
        }else {
            $(this).removeClass("text-warning")
            if(last_char == " "){
                $(this).val("")
                currently_writting = ""
                index++
                writting = text_arr[index+1]
            }else {
                currently_writting = val
            }
            updateText(pad_width)
        }
    })

})