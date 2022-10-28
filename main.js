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

function clickanimation(id, key='background-color', before='inherit', after='orange', time='1'){
    const obj = document.getElementById(id);
    if (['2x-faster-solutions','3+-different-solutions','straightforward-ui','better-graphs'].includes(id)) before = '#252E51';
    var style = document.createElement("style");
    style.innerHTML = `@keyframes clickanimation{0%{${key}: ${before};}50%{${key}: ${after};}100%{${key}: ${before}; opacity: 1;}}`;
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
        navbar.style.opacity = "0";
        navbar.style.animation = '';
        navbar.style.animation = 'popup-navbar 1s'
    } else {
        navbar.style.animation = 'popdown-navbar 1s'
        navbar.style.opacity = "1";
    }
    lastScrollTop = st <= 0 ? 0 : st;
}