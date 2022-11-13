from copy import deepcopy
def reverse_move(scramble):
    return [move+"'" if all(m not in ["2","'"] for m in move) else move.replace("'","")  for move in scramble]

def  rotateMatrix(matrix, dir):
    if dir > 0: return [list(i) for i in list(zip(*matrix[::-1]))]
    return [list(i) for i in list(zip(*matrix))[::-1]]
def listToString(data_structure, temp=[]):
    for item in data_structure:
        if type(item) == list: temp = listToString(item, temp)
        else: temp.append(item)
    return temp
def scrambleToCube(scramble, cube_state=None):
    cube = [
        [
            ['y', 'y', 'y'],
            ['y', 'y', 'y'],
            ['y', 'y', 'y']
        ],
        [
            ['b', 'b', 'b'],
            ['b', 'b', 'b'],
            ['b', 'b', 'b']
        ],
        [
            ['r', 'r', 'r'],
            ['r', 'r', 'r'],
            ['r', 'r', 'r']
        ],
        [
            ['g', 'g', 'g'],
            ['g', 'g', 'g'],
            ['g', 'g', 'g']
        ],
        [
            ['o', 'o', 'o'],
            ['o', 'o', 'o'],
            ['o', 'o', 'o']
        ],
        [
            ['w', 'w', 'w'],
            ['w', 'w', 'w'],
            ['w', 'w', 'w']
        ]
    ]
    for move in scramble:
        def recursive(move, cube_state, count=1):
            cube = deepcopy(cube_state)
            if any(move == n for n in ["R", "L'"]):
                l = 2; d = 2; r = 1;
                if move == "L'": l = 0; d = 4; r = -1
                for j in range(3):
                    cube[0][l][j] = cube_state[1][j][l]
                    cube[1][j][l] = cube_state[5][abs(l-2)][abs(j-2)]
                    cube[5][abs(l-2)][j] = cube_state[3][j][abs(l-2)]
                    cube[3][j][abs(l-2)] = cube_state[0][l][abs(j-2)]
                cube[d] = rotateMatrix(cube[d], r)
            elif any(move == n for n in ["R'", "L"]):
                l = 2; d = 2; r = -1
                if move == "L": l = 0; d = 4; r = 1
                for j in range(3):
                    cube[0][l][j] = cube_state[3][j][abs(l-2)]
                    cube[1][j][l] = cube_state[0][l][abs(j-2)]
                    cube[5][abs(l-2)][j] = cube_state[1][j][l]
                    cube[3][j][abs(l-2)] = cube_state[5][abs(l-2)][abs(j-2)]
                cube[d] = rotateMatrix(cube[d], r)
            elif any(move == n for n in ["U", "D'"]):
                l = 2; d = 5; r = 1
                if move == "D'": l = 0; d = 0; r = -1
                for j in range(3):
                    cube[1][l][j] = cube_state[4][l][j]
                    cube[2][l][j] = cube_state[1][l][j]
                    cube[3][l][j] = cube_state[2][l][j]
                    cube[4][l][j] = cube_state[3][l][j]
                cube[d] = rotateMatrix(cube[d], r)
            elif any(move == n for n in ["U'", "D"]):
                l = 2; d = 5; r = -1
                if move == "D": l = 0; d = 0; r = 1
                for j in range(3):
                    cube[1][l][j] = cube_state[2][l][j]
                    cube[2][l][j] = cube_state[3][l][j]
                    cube[3][l][j] = cube_state[4][l][j]
                    cube[4][l][j] = cube_state[1][l][j]
                cube[d] = rotateMatrix(cube[d], r)
            if "2" in move and count == 1:
                cube = recursive(move, cube, 2)
            return cube
        cube = recursive(move, cube)
    return cube
        # return ''.join(listToString(cube))
print(scrambleToCube(["R", "U", "R'", "U'"]))


from rubik_solver import utils
cube = 'yyyyyyyyybbbbbbbbbrrrrrrrrrgggggggggooooooooowwwwwwwww' # og
cube = 'obgoywoyybbgybbywrwrbyrrwrgrgobgwwgoywwrooyyrbgrowoggb' # scrmable
# print(utils.solve(cube, 'Beginner'))
# print(utils.solve(cube, 'CFOP'))
# print(utils.solve(cube, 'Kociemba'))

# add support for scramble to cubestring
# add support to replace U, U to U2 and U, U, U, U to nothing for CFOP and beginner