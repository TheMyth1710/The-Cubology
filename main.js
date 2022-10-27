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

function clickanimation(element, key='background-color', before='inherit', after='orange', time='1'){
    const obj = document.querySelector(element);
    var style = document.createElement("style");
    style.innerHTML = `@keyframes clickanimation{0%{${key}: ${before};}50%{${key}: ${after};}100%{${key}: ${before}; opacity: 1;}}`;
    document.getElementsByTagName('head')[0].appendChild(style);
    obj.style.animation = `clickanimation ${time}s`;
    obj.addEventListener("animationend",()=>{
        obj.style.animation = '';
    })
}

function home_nav(nav, start_page = 'index.html'){
    args = start_page.slice(0,-5);
    if (start_page == 'index.html'){
        args = ['index','','#'];
    }
    if (args.includes(document.URL.split("/").at(-1).slice(0,-5)) || document.URL.split("/").at(-1).slice(0,-5).startsWith("#")){
        window.location = `#${nav}`;
    }else{
        window.location = `${start_page}/#${nav}`;
    }
}

var navbar = document.querySelector('.navbar');
var lastScrollTop = 0;
window.onscroll = function(){
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop && st >1000){
        navbar.style.transition = 'display 1s'
        navbar.style.display = "none";
    } else {
        navbar.style.display = "";
    }
    lastScrollTop = st <= 0 ? 0 : st;
}