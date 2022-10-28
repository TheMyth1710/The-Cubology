"use strict"
let cube = [
    [
        ['W', 'W', 'W'],
        ['W', 'W', 'W'],
        ['W', 'W', 'W'] // Top
    ],   
    [
        ['G', 'G', 'G'],
        ['G', 'G', 'G'],
        ['G', 'G', 'G'] // Front
    ],
    [
        ['R', 'R', 'R'],
        ['R', 'R', 'R'],
        ['R', 'R', 'R'] // Side
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
        for (let i = 0, n = lateral_cube.length; i < n; i++){
            if (i+direction == 4) cube[4][layer] = cube_g[layer];
            else cube[i+1][layer] = lateral_cube.at(i+direction)[layer];
        }
    }else if (['R','R\'','L','L\''].includes(notation)){
        let layer = 2;
        let direction = -1;
        let front_cube = structuredClone([cube[1],cube[0],cube[3],cube[5]]);
        let front_cube_clone = structuredClone(front_cube);
        if (['R\'','L'].includes(notation)) direction = 1;
        if (['L','L\''].includes(notation)) layer = 0;
        for (let i = 0, n = front_cube.length; i < n; i++){
            for (let j = 0; j < 3; j++){
                if (i == 2) front_cube[i][j][Math.abs(layer-2)] = front_cube_clone.at(i+direction)[j][layer]; // To inverse the B
                else if (i+direction == 4) front_cube[i][j][layer] = front_cube_clone[0][j][layer];
                else if (i == 3 || i == direction) front_cube[i][j][layer] = front_cube_clone.at(i+direction)[j][Math.abs(layer-2)] // To inverse of B on Y
                else front_cube[i][j][layer] = front_cube_clone.at(i+direction)[j][layer];
            }
        }
        console.log(front_cube)
        for (const[i,j] of Object.entries({0:1,1:0,2:3,3:5})){
            cube[j] = front_cube[i];
        }
    }else if (['F','F\'','B','B\''].includes(notation)){
        // let layer = 2
        let sel = 0;
        let direction = -1;
        let dynamic_cube = structuredClone([cube[0],cube[2],cube[5],cube[4]]);
        let dynamic_cube_copy = structuredClone(dynamic_cube);
        if (['F\'','B'].includes(notation)) direction = 1;
        if (notation == 'F\'') sel = 2;
        // if (['B','B\''].includes(notation)) layer = 0;
        for (let j = 0; j < 3; j++){
            dynamic_cube[0][2][j] = dynamic_cube_copy.at(0+direction)[j][Math.abs(sel-2)];
            dynamic_cube[1][j][0] = dynamic_cube_copy[1+direction][Math.abs(sel-2)][j];
            dynamic_cube[2][0][j] = dynamic_cube_copy[2+direction][j][sel];
            if (3 + direction == 4) dynamic_cube[3][j][2] = dynamic_cube_copy[0][sel][j]
            else dynamic_cube[3][j][2] = dynamic_cube_copy[3+direction][sel][j];
        }
        for (const[i,j] of Object.entries({0:0,1:2,2:5,3:4})){
            cube[j] = dynamic_cube[i];
        }
    }
    // W R Y O
    /*
    W   W   W
    W   W   W
    R   R   R

    Y   R   R
    Y   R   R
    Y   R   R

    O   O   O
    Y   Y   Y
    Y   Y   Y

    O   O   W
    O   O   W
    O   O   W

    ---------

    W   W   W
    W   W   W
    O   O   O

    W   R   R
    W   R   R
    W   R   R

    R   R   R
    Y   Y   Y
    Y   Y   Y

    O   O   Y
    O   O   Y
    O   O   Y

    */
    console.log(cube);
}
