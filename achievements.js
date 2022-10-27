function update(key,value,sub_key=null,sub_sub_key=null){
    data = JSON.parse(localStorage.getItem("data"));
    if (sub_sub_key){
        data[key][sub_key][sub_sub_key] = value;
    }else if (sub_key){
        data[key][sub_key] = value;
    }else{
        data[key] = value;
    }
    localStorage.setItem("data",JSON.stringify(data));
} // Updates the localStorage with specific value

if (!localStorage.getItem("data")){
    localStorage.setItem("data", JSON.stringify({
        "achievements": {
            "Tab Friend": {"points": "5", "completed": false, "hint_unlocked": false, "hint": "Press <kbd>tab</kbd> 5 times"},
            "I'm safe!": {"points": "5", "completed": false, "hint_unlocked": false, "hint": "Open <kbd>Learn the 3x3</kbd> page"},
            "Rick Astley's Brat": {"points": "15", "completed": false, "hint_unlocked": false, "hint": "Get rickrolled!"}
            
        },
        "rewards": {
            "20": {"claimed": false, "reward": "https://youtu.be/dQw4w9WgXcQ"},
            "50": {"claimed": false, "reward": ""},
            "100": {"claimed": false, "reward": ""}
        },
        "ap": "0"
    }))
}

var achievements = JSON.parse(localStorage.getItem("data"))["achievements"];
var ap = parseInt(JSON.parse(localStorage.getItem("data"))["ap"]);
var achievements_DOM = document.querySelectorAll(".achievement.locked");


function achievement_completed(achievement, points){
    var achievements = JSON.parse(localStorage.getItem("data"))["achievements"];
    var ap = points+parseInt(achievements[achievement]["points"]);
    var achievements_DOM = document.querySelectorAll(".achievement.locked");
    update("ap", ap);
    if (home_nav(null,undefined,navigate=false)){
        document.querySelector('.ap-title h1').innerHTML = `Achievements: ${ap}/100 Points`;
        achievements_DOM.forEach(obj => {
            if (obj.querySelector("h4").innerHTML == achievement){
                achievement_retriever(obj);
            }
        }
    )}
    if (confirm(`Whoa!\rYou just unlocked the ${achievement} achievement! Go check it out in the home page!`)){
        home_nav('achievements');  
        clickanimation('#achievements');      
    }
}

function achievement_retriever(obj){
    obj.classList.remove("locked");
    obj.style.opacity = '1';
    obj.setAttribute("animation", "fadein 2s forwards");
}

function achievement_checker(){ // Check for Completed Achievements and Update
    var achievements_DOM = document.querySelectorAll(".achievement.locked");
    achievements_DOM.forEach(obj => {
        for (const [achievement, value] of Object.entries(achievements)){
            if (obj.querySelector("h4").innerHTML == achievement){
                if (value["completed"]){
                    achievement_retriever(obj);
                    obj.setAttribute('title', `${value["points"]} Points | Completed: ${value["completed"]}`);
                }
                if (value["hint_unlocked"]){
                    obj.querySelector('p').innerHTML = value["hint"];
                    obj.setAttribute('title', `${value["points"]} Points | Completed: ${value["completed"]}`);
                }else if (!value["completed"] && !value["hint_unlocked"]){
                    obj.setAttribute("title",`Click to get hint | ${value["points"]} Points | Completed: ${value["completed"]}`);
                }
            }
        }
    })
}
function achievement_main(){
    var achievements = JSON.parse(localStorage.getItem("data"))["achievements"];
    var ap = parseInt(JSON.parse(localStorage.getItem("data"))["ap"]);
    if (['index', '', '#'].includes(document.URL.split("/").at(-1).slice(0,-5)) || document.URL.split("/").at(-1).slice(0,-5).startsWith('#')) document.querySelector('.ap-title h1').innerHTML = `Achievements: ${ap}/100 Points`;
    // Achievement Records
    tab_presses = 0
    $(window).on('keyup', function(e) {
        if (e.key == "Tab"){ // Tab Friend
            tab_presses += 1;
        }else{
            tab_presses = 0;
        }
        if (tab_presses >=5 && !achievements["Tab Friend"]["completed"]){
            update("achievements",true,"Tab Friend","completed");
            achievements["Tab Friend"]["completed"] = true;
            achievement_completed("Tab Friend", ap);
        }
    })
    if (document.URL.includes('learn3x3.html') && !achievements["I'm safe!"]["completed"]){
        update("achievements",true,"I'm safe!","completed");
        achievements["I'm safe!"]["completed"] = true;
        achievement_completed("I'm safe!",ap);
    }
}

function unlock_hint(elm){
    var achievements = JSON.parse(localStorage.getItem("data"))["achievements"];
    achievement = elm.querySelector('h4').innerHTML;
    if (elm.classList.contains('locked')){
        if (!achievements[achievement]["hint_unlocked"]){
            let points = parseInt(achievements[achievement]["points"])
            if (confirm(`Are you sure you want to unlock the hint?\rUnlocking the hint will lose 40% (${0.4*points}) points, making the achievement worth ${0.6*points} points!`)){
                update("achievements",0.6*points,achievement,"points");
                update("achievements",true,achievement,"hint_unlocked");
                elm.querySelector('p').innerHTML = achievements[achievement]["hint"];
            }
        }else{
            alert("You have already unlocked the hint for this achievement!");
        }
    }else if (confirm(`You have already unlocked this achievement for ${achievements[achievement]["points"]} points! Go check out the rewards?`)){
        home_nav('rewards');
        clickanimation('#rewards');
    }
}
function reward_checker(){
    var rewards_DOM = document.querySelectorAll(".reward-claim");
    var ap = JSON.parse(localStorage.getItem("data"))["ap"];
    var rewards = JSON.parse(localStorage.getItem("data"))["rewards"];
    rewards_DOM.forEach(reward => {
        if (rewards[reward.getAttribute("points")]["claimed"]){
            reward.classList.add("unlocked");
            reward.innerHTML = "Reward Claimed!";
            elm.setAttribute("onclick",`window.open('${rewards[points.toString()]["reward"]}')`);
            reward.parentElement.setAttribute("custom-title","Reward Unlocked!");
        }else if (ap >= parseInt(reward.getAttribute("points"))){
            reward.classList.add("claim");
            reward.innerHTML = "Claim Reward!";
        }
    })
}
function unlock_reward(elm){
    var ap = JSON.parse(localStorage.getItem("data"))["ap"];
    var points = parseInt(elm.getAttribute("points"));
    rewards = JSON.parse(localStorage.getItem("data"))["rewards"];
    if (ap >= points){
        elm.classList = "btn reward-claim unlocked";
        elm.innerHTML = "Reward Claimed!";
        update("rewards",true,points.toString(),"claimed");
        elm.setAttribute("onclick",`window.open('${rewards[points.toString()]["reward"]}')`);
        alert("Reward Claimed!\rYou can now click on the button anytime to access your reward!");
    }else{
        alert(`You don't have enough points!\rPoints: ${ap}\rRequired: ${points}`)
    }
}