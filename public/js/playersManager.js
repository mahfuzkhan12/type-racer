function playersRender(players){

    console.log(players);
    // if($(".user_id#"+user?.user_id).length < 1){
    //     $(".game-result").append(`
    //         <div class="user_id" id="${user?.user_id}">
    //             <div class="result-contents">
    //                 <div class="result-progress">
    //                     <div class="vehicle-container">
    //                         <div class="name-container">
    //                             <div class="name" style="white-space: nowrap;">${user?.name}</div>
    //                             <span class="username"></span>
    //                         </div>
    //                         <div class="avatar-container" style="background-image: url(${user?.avatar})"></div>
    //                     </div>
    //                 </div>
    //                 <div>
    //                     <div class="place"></div>
    //                     <div class="wpm">0 wpm</div>
    //                 </div>
    //             </div>
    //         </div>
    //     `)
    // }
    if(players.length === 1){
        $(".start-race-btn").prop("disabled", true)
    }else {
        $(".start-race-btn").prop("disabled", false).show()
        $(".game-timer .title").html("Click <b style='color:#3cc1a3'>Join Race</b> button to start the game")
    }

}