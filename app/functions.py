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
            repeat = False
            if "2" in move: repeat = True; move = move.replace("2","")
            if move in ["R", "L'"]:
                l = 2; d = 2; r = 1;
                if move == "L'": l = 0; d = 4; r = -1
                for j in range(3):
                    cube[0][l][j] = cube_state[1][abs(j-2)][l]
                    cube[1][j][l] = cube_state[5][abs(l-2)][j]
                    cube[5][abs(l-2)][j] = cube_state[3][abs(j-2)][abs(l-2)]
                    cube[3][j][abs(l-2)] = cube_state[0][l][j]
                # print(cube,'\n')
                cube[d] = rotateMatrix(cube[d], r)
            elif move in ["R'", "L"]:
                l = 2; d = 2; r = -1
                if move == "L": l = 0; d = 4; r = 1
                for j in range(3):
                    cube[0][l][j] = cube_state[3][j][abs(l-2)]
                    cube[1][j][l] = cube_state[0][l][abs(j-2)]
                    cube[5][abs(l-2)][j] = cube_state[1][j][l]
                    cube[3][j][abs(l-2)] = cube_state[5][abs(l-2)][abs(j-2)]
                cube[d] = rotateMatrix(cube[d], r)
            elif move in ["U", "D'"]:
                l = 2; d = 5; r = 1
                if move == "D'": l = 0; d = 0; r = -1
                for j in range(3):
                    cube[1][l][j] = cube_state[4][l][j]
                    cube[4][l][j] = cube_state[3][l][j]
                    cube[3][l][j] = cube_state[2][l][j]
                    cube[2][l][j] = cube_state[1][l][j]
                cube[d] = rotateMatrix(cube[d], r)
            elif move in ["U'", "D"]:
                l = 2; d = 5; r = -1
                if move == "D": l = 0; d = 0; r = 1
                for j in range(3):
                    cube[1][l][j] = cube_state[2][l][j]
                    cube[2][l][j] = cube_state[3][l][j]
                    cube[3][l][j] = cube_state[4][l][j]
                    cube[4][l][j] = cube_state[1][l][j]
                cube[d] = rotateMatrix(cube[d], r)
            elif move in ["F", "B'"]:
                l = 2; d = 3; r = 1
                if move == "B'": l = 0; d = 1; r = -1
                for j in range(3):
                    cube[0][j][l] = cube_state[2][j][l]
                    cube[2][j][l] = cube_state[5][j][l]
                    cube[5][j][l] = cube_state[4][abs(j-2)][abs(l-2)]
                    cube[4][j][abs(l-2)] = cube_state[0][abs(j-2)][l]
                cube[d] = rotateMatrix(cube[d], r)
            elif move in ["F'", "B"]:
                l = 2; d = 3; r = -1
                if move == "B": l = 0; d = 1; r = 1
                for j in range(3):
                    cube[0][j][l] = cube_state[4][abs(j-2)][abs(l-2)]
                    cube[4][j][abs(l-2)] = cube_state[5][abs(j-2)][l]
                    cube[5][j][l] = cube_state[2][j][l]
                    cube[2][j][l] = cube_state[0][j][l]
                cube[d] = rotateMatrix(cube[d], r)
            if repeat and count == 1:
                cube = recursive(move, cube, 2)
            return cube
        cube = recursive(move, cube, 1)
    # return cube
    return ''.join(listToString(cube))
print(scrambleToCube(["R2", "F2", "U2", "D2", "L2", "B2"]))

from rubik_solver import utils
cube = 'wyyyyywyybgggbbbggroorroroobbgggbbbgorroororrywwwwwyww' # scrmable
# print(utils.solve(cube, 'Beginner'))
# print(utils.solve(cube, 'CFOP'))
print(utils.solve(cube, 'Kociemba')) # replace kociemba alg with wgr alg

# add support to replace U, U to U2 and U, U, U, U to nothing for CFOP and beginner