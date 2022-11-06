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
    if (confirm(`Whoa!\rYou just unlocked the "${achievement}" achievement!\rGo check it out?`)){
        home_nav('achievements');  
        clickanimation('achievements');
    }achievement_checker();        
}


function achievement_retriever(obj){
    obj.classList.remove("locked");
    obj.style.opacity = '1';
    obj.setAttribute("animation", "fadein 2s forwards");
}

function achievement_checker(){ // Check for Completed Achievements and Update
    var achievements_DOM = document.querySelectorAll(".achievement.locked");
    var ap = parseInt(JSON.parse(localStorage.getItem("data"))["ap"]);
    document.querySelector('.ap-title h1').innerHTML = `Achievements: ${ap}/100 Points`;
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
    $(document).keyup((e) => {
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
    
    $(document).keydown((e) => {        
        console.log(e)
        if((e.key == "F12") || (e.ctrlKey && e.shiftKey && any([e.key=="I", e.key == 'J', e.key == 'C']))){
        update("achievements",true,"The Inspector","completed");
        achievements["The Inspector"]["completed"] = true;
        achievement_completed("The Inspector", ap);
        }  
    });
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
        clickanimation('rewards');
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