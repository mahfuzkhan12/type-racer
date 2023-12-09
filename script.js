const text = "Well I woke in mid-afternoon 'cause that's when it all hurts the most. I dream I never know anyone at the party and I'm always the host. If dreams are like movies, then memories are films about ghosts. You can never escape, you can only move south down the coast."
const text_arr = text.split(" ")
var completed = ""
var remaining = text
var writting = text_arr[0]

var written = ""
var index = -1
var currently_writting = ""


var interval;
var total_time = 90
var time_left = 90
var game_started = false

function startGame() {
    $(".game-timer .title").text("Go!")
    $(".game-view").addClass('started')
    $(".text-input").prop("disabled", false).val("").change().focus()
    $(".game-starter-timer").html("")
    game_started = true

    $(".time-display").text(1 + ":" + 30);
    time_left = total_time
    interval = setInterval(() => {
        time_left--;
        var minutes = Math.floor(time_left / 60);
        var seconds = time_left % 60;
        var secondsDisplay = (seconds < 10) ? "0" + seconds : seconds;
        if(time_left == 0){
            endRace()
        }
        $(".time-display").text(minutes + ":" + secondsDisplay);
    }, 1000);
}

function startRace() {
    game_started = false
    completed = ""
    remaining = text
    writting = text_arr[0]

    written = ""
    index = -1
    currently_writting = ""

    $(".game-timer .title").text("The race is about to start!")
    $(".game-input-panel").show()
    $(".game-timer").show()
    $(".time-display").text("0:05")

    const trafficlight_src = "/assets/trafficlight.png"
    const $starter_preloader = $(`<div class="contents">
        <img class="trafficlight" src="/assets/clear.cache.gif" style="width: 165px; height: 65px; background: url('${trafficlight_src}') -165px 0px no-repeat;">
        <div class="timer-text">
            <div>Get Ready to Race!</div>
            <div class="timer">0:05</div>
        </div>
    </div>`)
    const $trafficlight = $starter_preloader.find(".trafficlight")
    console.log($trafficlight);
    const $timer = $starter_preloader.find(".timer")
    $(".game-starter-timer").html($starter_preloader)


    $(".leave-race-btn").show()
    $(".start-race-btn").hide()

    var time_left = 5
    var total_time = 5
    interval = setInterval(() => {
        time_left--
        if(total_time - time_left <= total_time / 2){
            $trafficlight.css("background", `url('${trafficlight_src}') 0px 0px no-repeat;`)
        }
        if(time_left < 3){
            $trafficlight.css("background", `url('${trafficlight_src}') -495px 0px no-repeat;`)
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

function endRace (){
    game_started = false
    clearInterval(interval)
    $(".game-timer .title").text("The race has ended.")
    $(".game-starter-timer").html("")
    $(".leave-race-btn").hide()
    $(".start-race-btn").show()
    $(".text-input").val("").prop("disabled", true)
    $(".game-input-panel").hide()
    $(".time-display").text("")
    $(".game-view").removeClass('started')
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

        console.log(cur_text, w_wrong_texts);
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
                endRace()
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

    if(game_started){
        const words_typed = index+1
        const time_gone_minutes = (total_time - time_left) / 60
        $(".wpm").text(Math.ceil(words_typed / time_gone_minutes) + " wpm")
    }
    

    const car_container = $(".result-progress")
    car_container.css("padding-left", pad_width * (index + 1))
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

    const $textContainer = $(".text-container")
    $textContainer.html(`<span>${text}</span>`)

    const car_container = $(".result-progress")
    const car_container_width = car_container.width()
    const car_width = $(".vehicle-container").width()
    const pad_width = (car_container_width - car_width) / text_arr.length

    updateText(pad_width)
    $("body").on("input", ".text-input", function() {
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