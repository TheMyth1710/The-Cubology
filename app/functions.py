import matplotlib.pyplot as plt
import numpy as np


def explode(data):
    size = np.array(data.shape)*2
    data_e = np.zeros(size - 1, dtype=data.dtype)
    data_e[::2, ::2, ::2] = data
    return data_e

n_voxels = np.zeros((3, 3, 3), dtype=bool)
facecolors = "#7A88CCC0"

def color_cube(slicer, color):
    global facecolors
    n_voxels[slicer] = True
    facecolors = np.where(n_voxels, color, facecolors)
    n_voxels[slicer] = False
# build up the numpy logo
# n_voxels[0, :, :] = True
color_cube(slice(0, 2, 2), "#E87000")
color_cube(slice(2, 3, 3), "#DC422F")
print(facecolors)
# facecolors = np.where(n_voxels, '#E87000', '#7A88CCC0')
# n_voxels[0, :, :] = False
# n_voxels[2, :, :] = True
# color_cube("#DC422F")
# facecolors = np.where(n_voxels, '#DC422F', facecolors)
# edgecolors = np.where(n_voxels, '#000000', '#000000')
filled = np.ones(n_voxels.shape)

# upscale the above voxel image, leaving gaps
filled_2 = explode(filled)
fcolors_2 = explode(facecolors)
ecolors_2 = "#000000"

# Shrink the gaps
x, y, z = np.indices(np.array(filled_2.shape) + 1).astype(float) // 2
x[0::2, :, :] += 0
y[:, 0::2, :] += 0
z[:, :, 0::2] += 0
x[1::2, :, :] += 1
y[:, 1::2, :] += 1
z[:, :, 1::2] += 1

ax = plt.figure().add_subplot(projection='3d')
ax.voxels(x, y, z, filled_2, facecolors=fcolors_2, edgecolors=ecolors_2)
# ax.set_aspect('equal')

plt.show()