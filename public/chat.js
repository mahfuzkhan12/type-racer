
var users = [];
var socket = {}
var user = {}


function randomIDGen(length = 10) {
    const timestampPart = Date.now().toString(36);
    const randomPartLength = length - timestampPart.length;
    const randomPart = Math.random().toString(36).substr(2, randomPartLength);

    let randomString = `${timestampPart}-${randomPart}`;
    return randomString;
}

var messageWrapper = document.querySelector(".msger-chat");

document.addEventListener("DOMContentLoaded", () => {

    user = localStorage.getItem("current_user")
    if(user){
        user = JSON.parse(user)
        startSocket()
        document.querySelector(".join").classList.add("hide")
        document.querySelector(".msger").classList.remove("hide")
    }else {
        
        const userInfo = {name: "", avatar: "user1.png"}

        var avatars = ["user1.png", "user2.jpeg", "user3.png"]
        const avatarsWrapper = document.querySelector(".avatars")
        var activeAvatarEL = false;
        avatars.map((av, key) => {
            const item = document.createElement("div")
            item.classList.add("item")
            if(key === 0){
                item.classList.add("selected")
                activeAvatarEL = item
            }
            item.innerHTML = `<img src="avatars/${av}" />`
            avatarsWrapper.appendChild(item)
            item.addEventListener("click", () => {
                item.classList.add("selected")
                if(activeAvatarEL){
                    activeAvatarEL.classList.remove("selected");
                    activeAvatarEL = item
                    userInfo.avatar = av
                }
            })
        })
        document.querySelector("#username").addEventListener("keyup", function(e) {
            userInfo.name = e.target.value
            console.log(userInfo)
        })


        document.querySelector("#join_chat").addEventListener("click", () => {
            if(!userInfo.name){
                alert("Please insert your name")
                return;
            }else if(!userInfo.avatar){
                userInfo.avatar = "user1.png"
            }

            user = {id: randomIDGen(), ...userInfo}
            localStorage.setItem("current_user", JSON.stringify(user))
            document.querySelector(".join").classList.add("hide")
            document.querySelector(".msger").classList.remove("hide")
            startSocket()
        })
    }

    messageWrapper = document.querySelector(".msger-chat")


    const chat_input = document.querySelector(".msger-input")

    const send = () => {
        if(chat_input.value){
            const new_message = {message: chat_input.value, id: randomIDGen(), time: new Date(), user: user}
            socket.emit("send", new_message)
            appendMessage(new_message, true)
            chat_input.value = ""
        }
    }
    
    chat_input.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.keyCode === 13) {
            if (!e.shiftKey) {
                e.preventDefault();
                send()
            }
        }
    });
    
    
    document.querySelector(".msger-send-btn").addEventListener("click", () => {
        if(chat_input.value){
            send()
        }
    }) 

})


const appendMessage = (message, this_user) => {

    if(!this_user && message?.user?.id == user?.id){
        return;
    }
    
    const el = document.createElement("div")
    el.classList.add(`msg`)
    el.classList.add(`${this_user ? "right" : "left"}-msg`)

    const date = new Date(message?.time)
    const hours = date.getHours()
    const minutes = date.getMinutes()

    el.innerHTML = `<div class="msg-img">
        <img src="avatars/${message?.user?.avatar}" />
    </div>

    <div class="msg-bubble">
        <div class="msg-info">
            <div class="msg-info-name">${message?.user?.name}</div>
            <div class="msg-info-time">${hours}:${minutes}</div>
        </div>
        <div class="msg-text">${message?.message}</div>
    </div>`

    messageWrapper.appendChild(el)
    messageWrapper.scrollTop = messageWrapper.scrollHeight;
}


function startSocket() {
    socket = io.connect("http://192.168.0.132:8010/");

    socket.on('join', function(response) {
        console.log(response);
    })
    
    socket.on('message', function(response) {
        console.log(response);
        appendMessage(response)
    })

    socket.on('left', function(response) {
        console.log(response)
    })



    // join chat
    socket.emit('join', user, (data) => {
        data?.map((item) => {
            appendMessage(item, item?.user?.id === user?.id)
        })
        console.log(data);
    });
}

