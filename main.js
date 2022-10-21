function screenwidth(hover=true){
    let downloadbtn = document.getElementById("downloadbtn");
    let overlay = document.getElementById("downloadoverlay");
    let errormsg = document.getElementById("download-err")
    var displace = '18%';
    if (!window.navigator.userAgent.includes("Windows NT 10.0")){
        overlay.style.cursor = "not-allowed";
        downloadbtn.disabled = true;
        document.getElementById("download-err").style.display = 'block';
        if (hover){
            overlay.addEventListener("mouseover", ()=>{
            errormsg.style.top = displace;
            errormsg.style.transition = 'top 1.5s ease';
            return $("#download-err").fadeOut(7500);
            })
        }else{
            errormsg.style.top = displace;
            errormsg.style.transition = 'top 1.5s ease';
            return $("#download-err").fadeOut(7500);
        }
    }else{
        errormsg.style.display = 'none';
    }
}

function vanisherr(){
    $("#download-err").stop();
    document.getElementById("download-err").style.opacity = '1';
    document.getElementById("download-err").style.display = 'none';
}