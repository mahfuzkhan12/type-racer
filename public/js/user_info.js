function randomIDGen(length = 10) {
    const timestampPart = Date.now().toString(36);
    const randomPartLength = length - timestampPart.length;
    const randomPart = Math.random().toString(36).substr(2, randomPartLength);

    let randomString = `${timestampPart}-${randomPart}`;
    return randomString;
}

var rand_names = [
    "SpeedyTyper123",
    "WordWhiz22",
    "KeyMasterPro",
    "TypingChamp45",
    "SwiftWordsmith",
    "TextTorpedo",
    "RapidKeyboarder",
    "QuickTypeWizard",
    "TurboTyperX",
    "VelocityWords",
    "BlitzTypist77",
    "FlashFingers99",
    "TypoSprinter",
    "WarpWordsRunner",
    "SonicKeyboardist",
]



var user_id = randomIDGen()
var user_vehicle = "veh_avatars/cars/desing-car-blue.svg"
var username = rand_names[Math.floor(Math.random() * 15)]
var user = {name: username, user_id: user_id, avatar: user_vehicle}
var gameId = false
$(document).ready(function() {
    $(".username").text(username)
    $(".user_vehicle").attr("src", user_vehicle)
    setTimeout(() => {
        $(".page-loader").remove()
    }, 400);


    gameId = window.location.pathname.split('/')[1];
    if(gameId){
        startSocket()
        socket.emit('join', user, gameId, (data) => {
            if(data?.game){
                if(data?.game_info?.game_name){
                    document.title = data?.game_info?.game_name
                    $(".game-title").show().text(data?.game_info?.game_name)
                }else {
                    $(".game-title").show().text("")
                }
                gameJoinDom()
            }
            console.log(data);
        });
        console.log(gameId);
    }

})