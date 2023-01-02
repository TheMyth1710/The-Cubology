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
def cleanSol(lst):
    while True:
        flag = False
        for i, item in enumerate(lst):
            inverse = item.replace("'", "") if "'" in item else item[0] + "'" + item[1:]

            # To remove "U" and "U'"
            if i < len(lst) - 1 and lst[i + 1] == inverse:
                del lst[i : i + 2]
                flag = True
                break

            # To remove "U", "U", "U", "U"
            if len(lst) >= 4 and set(lst[i : i + 4]) == {item}:
                del lst[i : i + 4]
                flag = True
                break

            # The two "U2", "U2", makes "U22" this should Also be removed.
            if "22" in item:
                del lst[i]
                flag = True
                break

            # To remove "U", "U2", "U"
            if i < len(lst) - 2 and item == lst[i + 2] and item == f"{lst[i+1]}2":
                del lst[i : i + 3]
                flag = True
                break

            # To convert "U", "U" to "U2"
            if i < len(lst) - 1 and item == lst[i + 1]:
                lst[i] = f"{item}2"
                del lst[i + 1]
                flag = True
                break

        if not flag:
            break
    return lst
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
    return [YBRtoWGR(str(move)) for move in utils.solve(cube, solType)]