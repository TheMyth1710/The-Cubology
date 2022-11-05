// const pages = {
//     "index": [".navbar",".animetext", "#downloadbtn", "#storebtn", "#card-1", "#card-2", "#card-3", "#card-4", ".mission", 
// ".about-cube .container img[alt='Ernõ Rubik']", ".about-cube .container h1", ".about-cube .container #p-1", 
// ".about-cube .container #p-2", ".about-cube .container #p-3", ".about-cube .container #p-4", ".new-cube-title", ".new-cube-btn",
// ".wca-title h1", ".wca-content img", ".wca-content p", ".achievements", ".achievement", ".reward"],
//     "features": [".features-title h1"],
//     "learn3x3": [".navbar", ".know-more label span"]
// };
// page = pages[document.URL.split("/").at(-1).slice(0,-5)];
// if ([undefined, '', '#'].includes(page)){
//     page = pages["index"];
// }
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(obj =>{
        if (obj.isIntersecting){
            var animation = obj.target.getAttribute('animation');
            var responsive = obj.target.getAttribute('animate-responsive');
            var typing = obj.target.getAttribute("typing-effect");
            if (typing){
                function animationend(){
                    obj.target.classList.add("animationend");
                    obj.target.style.borderRight = '3px solid transparent';
                    if (obj.target == document.querySelector('.wca-title h1')){
                        obj.target.setAttribute("onclick","window.open('https://www.worldcubeassociation.org');");
                    }
                }
                function type(animate=true){
                    text = obj.target.getAttribute("typing-text");
                    i = obj.target.innerHTML.length - 28;
                    cursor = obj.target;
                    if (animate){
                        if (i < text.length) {
                            obj.target.innerHTML += text.charAt(i);
                            i++;
                            setTimeout(type, 100);
                            if(!cursor.classList.contains("typing")) cursor.classList.add("typing");
                        }else{cursor.classList.remove("typing");}
                    }else{
                        obj.target.innerHTML = text;
                        animationend();
                    }
                }
                if (window.innerWidth > obj.target.getAttribute("typing-responsive")){
                    type();
                }else{type(false);};
                obj.target.addEventListener("animationend", () =>{animationend()})
            }
            if (responsive){
                var [target, conditions] = responsive.split(' > ');
                conditions = conditions.split(',')
                for (i of conditions){
                    if (i.split('-')[0] > window.innerWidth){
                        animation = animation.replace(target,i.split('-')[1])
                    }
                }
            }
            obj.target.style.animation = animation;
        }
    });
})

page = document.querySelectorAll("[animation]");

for (key of page){
    observer.observe(key)
}