index = [".animetext", "#downloadbtn", "#storebtn", "#card-1", "#card-2", "#card-3", "#card-4", ".mission"];
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(obj =>{
        if (obj.isIntersecting){
            obj.target.style.animation = obj.target.getAttribute('animation');
            console.log(obj.target.getAttribute("animation"))
        }
    });
})
page = window[document.URL.split("/").at(-1).slice(0,-5)];
if ([undefined, '', '#'].includes(page)){
    page = index;
}
for (key of page){
    observer.observe(document.querySelector(key));
}
