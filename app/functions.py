from copy import deepcopy
from rubik_solver import utils

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

def YBRtoWGR(move:str):
    flexible_replacement = {"U": "D", "R": "F", "L": "B", "X": "Z"}
    fixed_replacement = {"Y": "Y'", "M": "S'", "M'": "S"}
    for k, v in flexible_replacement.items():
        if k in move: return move.replace(k,v)
        elif v in move: return move.replace(v,k)
    for k1, v1 in fixed_replacement.items():
        if k1 == move: return move.replace(k1, v1)
        elif v1 == move: return move.replace(v1, k1)
    return move

def cleanSol(sol):
    res = '-'.join(sol)
    moveList = ['U', "U'", 'U2', 'D', "D'", 'D2', 'R', "R'", 'R2', 'L', "L'", 'L2', 'F', "F'", 'F2', 'B', "B'", 'B2', 'Y', "Y'", 'X', "X'", 'Z', "Z'", 'M', "M'", 'M2', 'E', "E'", 'E2', 'S', "S'", 'S2']
    for move in moveList:
        if move in res:
            if (literal:= (f"{move}-"*4)[:-1]) and literal in res:
                res = res.replace(literal,"")
            if (literal:= f"{move}-{move}'") and literal in res:
                res = res.replace(literal,"")
            if (literal:= f"{move}'-{move}") and literal in res:
                res = res.replace(literal,"")
            if (literal:= f"{move}-{move}") and literal in res:
                res = res.replace(literal,move+"2")
    return [r for r in res.split('-') if r] # remove emptry strings

def solveCube(scramble, solType:str, cube_state=None):
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
        def scrambleToCube(move, cube_state, count=1):
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
                cube = scrambleToCube(move, cube, 2)
            return cube
        cube = scrambleToCube(move, cube, 1)
    cube = ''.join(listToString(cube))
    return cleanSol([YBRtoWGR(str(move)) for move in utils.solve(cube, solType)])

# add support to replace U, U to U2 and U, U, U, U to nothing for CFOP and beginner