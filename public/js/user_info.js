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
var username = rand_names[Math.floor(Math.random() * 16)]

$(document).ready(function() {
    $(".username").text(username)
    $(".user_vehicle").attr("src", user_vehicle)
    setTimeout(() => {
        $(".page-loader").remove()
    }, 400);
})