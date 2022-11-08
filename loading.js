var cubing_facts = ['Cubes were initially called Magic Cube.','CFOP is the most used method.','The cube was a challenge for Ernő Rubik himself.'
,'There are over 17 Official Cubes.','WCA - World Cube Assossciation is the leading non-profit cube organization.',
'Less than 5.8% of the people can solve the cube, can you?','1 in 20 people who own a cube can actually solve it, can you?'
,'The most expensive cube is of $2.5 Million.','The first cubing guide was created by a 13 year kid.'
,'Robots are capable of solving a cube under a second.','Cubes are the best selling toys, history speaks it.'
,'Tony Fisher created the largest cube measuring 2.022m side.'
,"A cube can be solved within 20 moves or less.","A cube has 6 sides, 21 pieces, and 54 outer surfaces."
,"There are over 43 quintillion (that's 43,252,003,274,489,856,000 to be precise) different possible cube combinations."
,'Cubing helps in improving reflexes, science justifies it.','Yusheng Du (China) achieved the fastest 3x3 solve in just 3.47 seconds.'
,'Feliks Zemdegs has over 121 world records, and is on the leaderboard.','Very few and we mean very few people can solve a cube blindfolded.'
,'A speedcuber can solve a cube in just under 7 seconds.','Literally very few people can solve a cube with their foot.',
'An average cuber takes around 2 minutes to solve a 3x3.','You need a 100 IQ to solve a cube.'
];

function random(choices){
    return choices[Math.floor(Math.random() * choices.length)];
}

function loadinganim() {
    document.getElementById("body").style.display = "block";
    if (document.URL.includes('index')){
        document.getElementById("loader").style.display = "block";
        document.getElementById("loader").setAttribute("onclick", `window.open('https://youtu.be/dQw4w9WgXcQ'); update("achievements",true,"?????","completed");achievement_completed('?????'); achievement_checker();`);
        document.getElementById("body").style.display = "none";
        document.querySelector(".know .bodying").innerHTML = random(cubing_facts);
        setTimeout(function(){
            document.getElementById("loader").style.display = "none";
            document.getElementById("body").style.display = "block";
            document.getElementById("body").style.backgroundColor = "var(--cream)";}, 3000);
    }else{
        if (document.readyState === "complete") {
            document.getElementById("loader").style.display = "none";
            document.getElementById("body").style.display = "block";
            if (document.URL.includes("#")){
                let id = document.URL.split("#").at(-1);
                if (document.getElementById(id)){
                    clickanimation(id);
                    document.getElementById(id).style.opacity = '1';
                }
            }
            return true;
        }
    }
};