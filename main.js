function update(key,value,sub_key=null,sub_sub_key=null){
    console.log(key,value,sub_key,sub_sub_key)
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

function arraysEqual(a, b, notations=false) {
    console.log(a,b,notations);
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;  
    for (var i = 0; i < a.length; ++i){
        if (!notations){
            if (a[i] !== b[i]) return false;
        }else{
            if (!adjacent_moves(a[i],b[i]) && a[i] !== b[i]) return false;
        } 
    }
    return true;
}

if (!localStorage.getItem("data")){
    localStorage.setItem("data", JSON.stringify({
        "achievements": {
            "Tab Friend": {"points": 5, "completed": false, "hint_unlocked": false, "hint": "Press <kbd>tab</kbd> 5 times"},
            "I'm safe!": {"points": 5, "completed": false, "hint_unlocked": false, "hint": "Open <kbd>Learn the 3x3</kbd> page"},
            "Rick Astley's Brat": {"points": 15, "completed": false, "hint_unlocked": false, "hint": "Get rickrolled!"}
            
        },
        "rewards": {
            20: {"claimed": false, "reward": "https://youtu.be/dQw4w9WgXcQ"},
            50: {"claimed": false, "reward": ""},
            100: {"claimed": false, "reward": ""}
        },
        "ap": 0,
        "levels": {
            0: true, 
            1: false, 
            2: false, 
            3: false
        }
    }))
}

function device_checker(click=false){
    let downloadbtn = document.getElementById("downloadbtn");
    let overlay = document.getElementById("downloadoverlay");
    if (!window.navigator.userAgent.includes("Windows NT 10.0")){
        overlay.style.cursor = "not-allowed";
        downloadbtn.disabled = true;
        downloadbtn.style.opacity = '0';
        if (click){
            confirm("Oops! We currently only support Windows 10+");
        }
    }
}
$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};
function clickanimation(id, key='background-color', before='inherit', after='orange', time='1'){
    const obj = document.getElementById(id);
    if (['2x-faster-solutions','3+-different-solutions','straightforward-ui','better-graphs'].includes(id)) before = '#252E51';
    var style = document.createElement("style");
    style.innerHTML = `@keyframes clickanimation{0%{${key}: ${before};}50%{${key}: ${after};}100%{${key}: ${before};}}`;
    document.getElementsByTagName('head')[0].appendChild(style);
    obj.style.animation = `clickanimation ${time}s`;
    obj.addEventListener("animationend",()=>{
        obj.style.animation = '';
    })
    if (document.readyState === "complete") obj.scrollIntoView();
}

function home_nav(nav=null, start_page = 'index.html', navigate=true){
    args = start_page.slice(0,-5);
    if (start_page == 'index.html'){
        args = ['index','','#'];
    }
    if (navigate){
        if (!args.includes(document.URL.split("/").at(-1).slice(0,-5)) || !document.URL.split("/").at(-1).startsWith("#")){
            window.location = `${start_page}#${nav}`;
        }
    }else{
        if (args.includes(document.URL.split("/").at(-1).slice(0,-5)) || document.URL.split("/").at(-1).startsWith("#"))return true;
    }
}

var navbar = document.querySelector('.navbar');
var lastScrollTop = 0;
document.onscroll = function(){
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop && st > 50){
        navbar.style.visibility = 'hidden'
        navbar.style.animation = '';
        navbar.style.animation = 'popup-navbar 1s forwards'
    } else {
        navbar.style.animation = 'popdown-navbar 1s forwards'
        navbar.style.visibility = 'visible'
    }
    lastScrollTop = st <= 0 ? 0 : st;
}