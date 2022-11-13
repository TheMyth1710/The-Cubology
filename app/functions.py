def reverse_move(scramble):
    return [move+"'" if all(m not in ["2","'"] for m in move) else move.replace("'","")  for move in scramble]

def scrambleToCube(scramble, cube_state=None):
    if cube_state: # convert cubestring to 3-indexed-array
        pass

from rubik_solver import utils
cube = 'yyyyyyyyybbbbbbbbbrrrrrrrrrgggggggggooooooooowwwwwwwww' # og
cube = 'obgoywoyybbgybbywrwrbyrrwrgrgobgwwgoywwrooyyrbgrowoggb' # scrmable
print(utils.solve(cube, 'Beginner'))
print(utils.solve(cube, 'CFOP'))
print(utils.solve(cube, 'Kociemba'))

# add support for scramble to cubestring
# add support to replace U, U to U2 and U, U, U, U to nothing for CFOP and beginner