const moves_list = {
    "U": [1, 1],
    "U'": [1, -1],
    "D": [6, -1],
    "D'": [6, 1],
    "R": [3, 1],
    "R'": [3, -1],
    "L": [5, 1],
    "L'": [5, -1],
    "F": [2, 1],
    "F'": [2, -1],
    "B": [4, 1],
    "B'": [4, -1]
}
const adjacent_moves_list = {
    "U": ["U","U'","D","D'"],
    "R": ["R","R'","L","L'"],
    "F": ["F","F'","B","B'"],
    "aliases": {
        "U'": "U", "D": "U", "D'": "U",
        "R'": "R", "L": "R", "L'": "R",
        "F'": "F", "B": "F", "B'": "F",
    }
}
var correct_move = '';
var global_level = 0;
var done_moves = [];
var level3_list = [];
var level3_input_list = [];
var practice_moves = [];

function onclick_buttons(param='move(this, true)'){
    if (param != ''){
        document.querySelectorAll(".cube-notation").forEach(
            btn => btn.setAttribute("onclick",`${param}`)
        )
    }
}

function level_checker(){
    onclick_buttons();
    let level_record = JSON.parse(localStorage.getItem("data"))["levels"];
    document.querySelectorAll(".cube-level-ribbons .ribbon").forEach(level => {
        if (level_record[level.getAttribute("level")] && Boolean(level.getAttribute("level"))){
            level.classList.add('cleared');
        }
    });
}

function level_identifier(level_DOM){
    let level = level_DOM.getAttribute("level");
    let level_status = JSON.parse(localStorage.getItem("data"))["levels"];
    let move_ahead = true;
    for (let i = 0; i < level; i++){
        if (level_status[level]){
            if (!confirm(`You have already completed this level!\rIf you fail this time, it'll be counted!\rDo it again?`)) move_ahead = false;
        }else if (!level_status[i.toString()]){  // Check if any previous level is incomplete
            move_ahead = false;
            alert(`You can't skip levels! Complete Level ${i} first!`);
            break;
        }
    }
    if (level == 0){
        alert("Practice Mode Enabled!\rUse the buttons to learn the cube notations.\rYou can scroll beneath the simulator below to learn more."); level_simulator(level_DOM);
    }
    else if (move_ahead){
        if (level == 1){
            if (confirm(`Playing Level ${level}!\rThe simulator will display a move and you need to identify it by clicking the buttons below.\rScore 5/5 to complete the level!\rReady?`)) level_simulator(level_DOM);
        }else if (level == 2){
            if (confirm(`Playing Level ${level}!\rThe simulator will display a move and you need to identify the "OPPOSITE" of it by clicking the buttons below.\rScore 5/5 to complete the level!\rReady?`)) level_simulator(level_DOM);
        }else{
            if (confirm(`Playing Level ${level}!\rThe simulator will scramble the cube and you need to solve it within 5 moves.\rScore 5/5 to complete the level!\rReady?`)) level_simulator(level_DOM);
        }
    }
}   

function level_simulator(level, i=0){
    var lvl = global_level;
    if (i < 5){
        if (level){
            document.querySelectorAll(".cube-level-ribbons .ribbon").forEach(ribbon => ribbon.classList.remove('active'));
            level.classList.add('active');
            var lvl = parseInt(level.getAttribute("level"));
            global_level = lvl;
        }
        switch (lvl){ // For loop 5 times execute
            case 0:  // Default
                document.querySelectorAll('.cube-notation-row .circlebtns').forEach(btn => btn.style.transform = 'scale(0)');
                onclick_buttons();
                break;
            case 1: // Level 1
                reset_cube(practice_moves);
                setTimeout(do_random_move(i),100);
                break;
            case 2: // Level 2
                reset_cube(practice_moves);
                do_random_move(i, true);
                break;
            case 3: // Level 3
                reset_cube(practice_moves);
                document.querySelectorAll('.cube-notation-row .circlebtns').forEach(btn => btn.style.transform = 'scale(1)');
                document.querySelectorAll(".cube-notation").forEach(btn => btn.setAttribute("onclick",`move(this);get_move_inputs(this, ${i});`))
                multiple_random_moves();
                break;
        }
    }else{
        done_moves = [];
        let score = document.querySelectorAll('.circlebtns.correct').length;
        if (score == 5) var msg = `Level ${global_level} Completed!\rYou Scored ${score}/5!`;
        else var msg = `Level ${global_level} Failed!\rYou Scored ${score}/5!\rScore 5/5 to move to complete the level!`;
        update("levels",(score == 5) ? true: false,lvl.toString());
        i = 0;
        level_checker();
        setTimeout(() => {
            alert(msg);
            if (global_level == 3){
                var ap = parseInt(JSON.parse(localStorage.getItem("data"))["ap"]);
                update("achievements",true,"All-Rounder","completed");
                achievement_completed("All-Rounder",ap);
            }
            document.querySelectorAll('.cube-notation-row .circlebtns').forEach(btn => btn.classList = 'circlebtns');
        }, 100); // To Avoid Overriding Code

    }
}

function multiple_random_moves(j=0){
    setTimeout(function(){
        if (j < 5){
            j++;
            var random_move = get_random_move(true);
            var random_move_notation = moves_list[random_move]
            level3_list.push(random_move);
            turnFace(random_move_notation[0],random_move_notation[1],false);
            multiple_random_moves(j);
        }
    }, 100)
}


function get_reverse_move(move){
    if (move.includes("'")) return move.replace("'","");
    else return move+"'";
}

function reset_cube(a=[],b=[],done=false){
    if (!done){
        a = structuredClone(a).reverse();
        b = structuredClone(b).reverse();
    }
    setTimeout(function(){
        if (a.length > 0){
            let move1 = get_reverse_move(a[0]);
            turnFace(moves_list[move1][0],moves_list[move1][1],false);
            a.shift();
            reset_cube(a,b,true);
        }
    }, 1);
    setTimeout(function(){
        setTimeout(function(){
            if (b.length > 0){
                let move2 = get_reverse_move(b[0]);
                turnFace(moves_list[move2][0],moves_list[move2][1], false);
                b.splice(0,1);
                reset_cube(a,b,true);
            }
        },1);
    }, 100);
    practice_moves = [];
}

function adjacent_moves(a,b){
    let i = adjacent_moves_list[a]
    if (!Object.keys(adjacent_moves_list).includes(a)) i = adjacent_moves_list[adjacent_moves_list.aliases[a]]; 
    if ([a,b].every(move => i.includes(move)) && ![b,get_reverse_move(b)].includes(a)) return true;
    return false;
}

function get_move_inputs(btn, i){
    let answers = document.querySelectorAll('.cube-notation-row .circlebtns');
    level3_input_list.push(btn.innerHTML);
    turnFace(moves_list[btn.innerHTML][0],moves_list[btn.innerHTML][1])
    setTimeout(function(){if (level3_input_list.length == 5){
        if (success(level3_input_list)){
            answers[i].classList.add('correct');
            i++;
            level_simulator(NaN,i);
        }
        else{
            answers[i].classList.add('wrong');
            reset_cube(level3_input_list,level3_list);
            i++;
            setTimeout(()=>{level_simulator(NaN,i)},750);            
        }
        level3_input_list = [];
        level3_list = [];
    }},750)
}
function success(move_list){
    let reversed_list = structuredClone(move_list).reverse();
    for (let i = 0; i < reversed_list.length; i++){
        if (reversed_list[i].includes("'")) reversed_list[i] = reversed_list[i].replace("'","");
        else reversed_list[i] += "'";
    }
    return arraysEqual(reversed_list,level3_list, true);    
}

function get_random_move(level3=false){
    var random_move = Object.keys(moves_list)[Math.floor(Math.random()*Object.keys(moves_list).length)];
    if (level3){
        while (level3_list.includes(random_move) || level3_list.includes(get_reverse_move(random_move))){
            var random_move = Object.keys(moves_list)[Math.floor(Math.random()*Object.keys(moves_list).length)];
        }
    }else{
        while (done_moves.includes(random_move)){
            var random_move = Object.keys(moves_list)[Math.floor(Math.random()*Object.keys(moves_list).length)];
        }
    }
    return (random_move);
}

function do_random_move(i, reverse=false, animate=true){
    document.querySelectorAll('.cube-notation-row .circlebtns').forEach(btn => btn.style.transform = 'scale(1)');
    var random_move = get_random_move();
    var random_move_notation = moves_list[random_move];
    setTimeout(function(){
        turnFace(random_move_notation[0], random_move_notation[1], animate);
        document.querySelectorAll(".cube-notation").forEach(btn => btn.setAttribute("onclick",`move(this);check_for_move(this, ${i}, ${reverse})`));
        correct_move = random_move;
        done_moves.push(random_move);
    }, 500);
}

function check_for_move(btn, i, reverse=false, level3=false){ // Checks for Correct Move and Updates!
    let answers = document.querySelectorAll('.cube-notation-row .circlebtns');
    if (!reverse){
        if (btn.innerHTML == correct_move) answers[i].classList.add('correct');
        else answers[i].classList.add('wrong');
    }else{
        if (get_reverse_move(btn.innerHTML) == correct_move) answers[i].classList.add('correct');
        else answers[i].classList.add('wrong');
    }
    reset_cube([correct_move]);
    i++;
    level_simulator(NaN, i);
}

function move(btn, complete=false){ // Avoid over spamming
    document.querySelectorAll('.cube-notation').forEach(
        btn => btn.disabled = true
    );
    setTimeout(() => {document.querySelectorAll('.cube-notation').forEach(
        btn => btn.disabled = false
    )}, 500);
    if (complete){ // Called on Practice Stage
        let notation = btn.innerHTML;
        turnFace(moves_list[notation][0], moves_list[notation][1]);
        practice_moves.push(notation);
    }
}

// Rest of the Code for learn3x3.html | NOT RELATED TO CUBE SIMULATOR |

document.querySelectorAll(".know-more label input[type='checkbox']").forEach(input => input.addEventListener("change", function(){
    var additional_info = this.parentElement.parentElement.querySelector(".additional-info");
    var opened = JSON.parse(localStorage.getItem("data"))["3x3"];
    var keys = Object.keys(opened);
    var check_out = true;
    if (this.checked){
        for (let i = 1; i < keys.length; i++){
            if (!opened[keys[i.toString()]] && $(this.parentElement).text().trim() == keys[i.toString()] && !opened[keys[(i-1).toString()]]){
                if (!confirm(`You didn't check out "${keys[(i-1).toString()]}"!\rDo you still want to move ahead?`)) check_out = false;
                break;
            }
        }
        if (check_out){
            update("3x3",true,$(this.parentElement).text().trim())
            document.querySelectorAll(".know-more label input").forEach(elem => {if (elem != this) elem.checked = false});
            document.querySelectorAll(".know-more label").forEach(elem => {if (elem != this.parentElement) elem.style.borderRadius = "10px"});
            document.querySelectorAll(".additional-info").forEach(elem => {
                if (elem.style.opacity == 1){
                    Object.assign(elem.style, {"opacity": "0", "visibility": "hidden", "animation": "height 0.3s reverse linear"})
                }
            });
            this.parentElement.style.borderRadius = "0px";
            additional_info.style.opacity = "1";
            additional_info.style.visibility = "visible";
            additional_info.style.animation = "height 0.3s forwards linear";
        }else this.checked = false;
    }else{
        this.parentElement.style.borderRadius = "10px";
        additional_info.style.opacity = "0";
        additional_info.style.visibility = "hidden";
        additional_info.style.animation = "height 0.3s reverse linear";
    }
}));