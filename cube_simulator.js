"use strict"
let cube = [
    [
        ['W', 'W', 'W'],
        ['W', 'W', 'W'],
        ['W', 'W', 'W']
    ],   
    [
        ['G', 'G', 'G'],
        ['G', 'G', 'G'],
        ['G', 'G', 'G']
    ],
    [
        ['R', 'R', 'R'],
        ['R', 'R', 'R'],
        ['R', 'R', 'R']
    ],
    [
        ['B', 'B', 'B'],
        ['B', 'B', 'B'],
        ['B', 'B', 'B']
    ],
    [
        ['O', 'O', 'O'],
        ['O', 'O', 'O'],
        ['O', 'O', 'O']
    ],
    [
        ['Y', 'Y', 'Y'],
        ['Y', 'Y', 'Y'],
        ['Y', 'Y', 'Y']
    ],
]
/*

Layers:
[Top Top Top]
[Middle Middle Middle]
[Bottom Bottom Bottom]

*/

document.querySelectorAll('.cube-notation').forEach(move => move.addEventListener('click', ()=>{
    cube_notation(move);
}))


function cube_notation(move){
    const notation = move.innerHTML;
    if (['U','U\'','D','D\''].includes(notation)){
        let layer = 0;
        let direction = 1;
        let lateral_cube = structuredClone(cube.slice(1,-1));
        const cube_g = structuredClone(cube[1]);
        if (['D','U\''].includes(notation)) direction = -1;
        if (['D','D\''].includes(notation)) layer = 2;
        for (let i = 0; i < lateral_cube.length; i++){
            if (i+direction == 4) cube[4][layer] = cube_g[layer];
            else cube[i+1][layer] = lateral_cube.at(i+direction)[layer];
        }
    }else if (['R','R\'','L','L\''].includes(notation)){
        let layer = 2;
        let direction = 1;
        let front_cube = structuredClone([cube[1],cube[0],cube[3],cube[5]]);
        let front_cube_clone = structuredClone(front_cube);
        const cube_g = structuredClone(front_cube[0]);
        if (['R','L\''].includes(notation)) direction = -1;
        if (['L','L\''].includes(notation)) layer = 0;
        for (let i = 0; i < front_cube.length; i++){
            for (let j = 0; j < 3; j++){
                if (i+direction == 4) front_cube[i][j][layer] = cube_g[j][layer];
                else front_cube[i][j][layer] = front_cube_clone.at(i+direction)[j][layer];
            }
        }
        console.log(front_cube);
        for (const[i,j] of Object.entries({0:1,1:0,2:3,3:5})){
            cube[j] = front_cube[i];
        }
    }
    console.log(cube);
}
