/*
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
- NOTES
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
var NEAR = 0.05;
var FAR = 500;
var canvas = document.querySelector('.cube-simulator');
var cubicles = [];
const mouse = new THREE.Vector2();
const currentMouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const timer = ms => new Promise(res => setTimeout(res, ms));
const xAxis = new THREE.Vector3(1, 0, 0);
const yAxis = new THREE.Vector3(0, 1, 0);
const zAxis = new THREE.Vector3(0, 0, 1);
let selectedSideIndex = -1;
let selected;
let selectedPieceType = -1;
let cubicle = -1;
let down = false;
let determined = false;
let larger;
let facing;
let transitioning = false;
let keysDown = [];
let pivotSide = -1;
let loops = 0;
let snapping = false;

let linePoints = [];

const ambientLight = new THREE.AmbientLight(0xffffff);
const sideGeometry = new THREE.PlaneGeometry(10, 10);
const circleMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0,
});
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, NEAR, FAR);
const offsetCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, NEAR, FAR);
const controls = new OC.OrbitControls(camera, renderer.domElement);
const circle = new THREE.Mesh(new THREE.CircleGeometry(500, 64), circleMaterial);
let testLines = new THREE.Group();

const allLayers = new THREE.Group();
const allCubes = new THREE.Group();

const topLayer = new THREE.Group();
topLayer.name = "topLayer";
topLayer.position.set(0, 10.1, 0);
const midXLayer = new THREE.Group();
midXLayer.name = "midXLayer";
const bottomLayer = new THREE.Group();
bottomLayer.name = "bottomLayer";
bottomLayer.position.set(0, -10.1, 0);
const frontLayer = new THREE.Group();
frontLayer.name = "frontLayer";
frontLayer.position.set(0, 0, 10.1);
const midZLayer = new THREE.Group();
midZLayer.name = "midZLayer";
const backLayer = new THREE.Group();
backLayer.name = "backLayer";
backLayer.position.set(0, 0, -10.1);
const leftLayer = new THREE.Group();
leftLayer.name = "leftLayer";
leftLayer.position.set(-10.1, 0, 0);
const midYLayer = new THREE.Group();
midYLayer.name = "midYLayer";
const rightLayer = new THREE.Group();
rightLayer.name = "rightLayer";
rightLayer.position.set(10.1, 0, 0);

allLayers.add(topLayer, midXLayer, bottomLayer, frontLayer, midZLayer, backLayer, leftLayer, midYLayer, rightLayer);

offsetCamera.position.set(75, 75, 75);
offsetCamera.lookAt(0, 0, 0);
camera.position.z = 150;
controls.minDistance = 50;
controls.maxDistance = 150;

canvas.appendChild(renderer.domElement);
scene.background = new THREE.Color(0x7dd6fa); // Background Color
renderer.setSize(window.innerWidth, window.innerHeight, false);
let temp = 0;
let idxCount = 0;
for (let i = 0; i < 27; i++) {
  if (idxCount == 9) idxCount = 0;
  if (i == 9) temp = 1;
  if (i == 18) temp = 0;
  const cubicle = new Cubicle(i);
  cubicles.push(cubicle);
  scene.add(cubicle.object);
  idxCount++;
}

scene.add(ambientLight, allLayers, allCubes);

// Finish setup

canvas.addEventListener('pointerdown', function(event) {
  if (snapping) return;
  
  down = true;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  currentMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  currentMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  castRay();
}, false);
canvas.addEventListener('pointermove', function(event){
  currentMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  currentMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  facing = Math.max(Math.abs(camera.position.x), Math.abs(camera.position.y), Math.abs(camera.position.z));
  if (facing == Math.abs(camera.position.x)) {
    if (camera.position.x > 0) { facing = 3 } else { facing = 1 }
  } else if (facing == Math.abs(camera.position.y)) {
    if (camera.position.y > 0) { facing = 0 } else { facing = 5 }
  } else if (facing == Math.abs(camera.position.z)) {
    if (camera.position.z > 0) { facing = 2 } else { facing = 4 }
  }
  
  if (selectedPieceType == 0 && !determined && down) {
    /*
    raycaster.setFromCamera(currentMouse, camera);
    let intersections = raycaster.intersectObjects(testLines.children);
    let i = 0;
    let d1, d2;
    if ((function(){
      for (; i < intersections.length; i++) {
        if (intersections[i].object.type == "Mesh") return true;
      }
      return false;
    })()) {
      const ip = intersections[i].point;
      const line1 = new THREE.Line3(linePoints[0], linePoints[1]);
      const line2 = new THREE.Line3(linePoints[2], linePoints[3]);
      d1 = line1.closestPointToPoint(ip).distanceTo(ip);
      d2 = line2.closestPointToPoint(ip).distanceTo(ip);
    }
    if (Math.abs(d1 - d2) > 0.5) {
      determined = true;
      if (d2 > d1) {
        larger = "X";
      } else {
        larger = "Y";
      }
      castRay();
    }
    */
    let xDiff = Math.abs(currentMouse.x - mouse.x);
    let yDiff = Math.abs(currentMouse.y - mouse.y);
    if (Math.abs(xDiff - yDiff) > 0.005) {
      determined = true;
      if (xDiff > yDiff) {
        larger = "X";
      } else {
        larger = "Y";
      }
      castRay();
    }
  }
}, false);
canvas.addEventListener('pointerup', async function() {
  down = false;
  testLines.children = [];
  linePoints = [];
  if (!controls.enableRotate && selectedPieceType !== 2) {
    await snap();
  }
  determined = false;
  selectedPieceType = -1;
  controls.enableRotate = true;
  scene.remove(circle);
}, false);
canvas.addEventListener('keydown', async function(event){
  if (transitioning) return;
  
  let keyCode = event.keyCode;

  switch (keyCode) {
    case 37: { //left
      if (keysDown.indexOf(keyCode) !== -1) return;
      keysDown.push(keyCode);
      switch (facing) {
        case 0: case 5: {
          if (Math.abs(camera.rotation.z) > Math.PI/4 && Math.abs(camera.rotation.z) < (3 * Math.PI/4)) {
            if (camera.rotation.z > 0) {
              await rotateCube("right", xAxis);
            } else {
              await rotateCube("left", xAxis);
            }
          } else if ((Math.abs(camera.rotation.z) > Math.PI/4 && camera.rotation.x > 0) ||
                     (Math.abs(camera.rotation.z) < Math.PI/4 && camera.rotation.x < 0)) {
            await rotateCube("left", zAxis);
          } else {
            await rotateCube("right", zAxis);
          }
          break;
        }
        case 1: {
          await rotateCube("left", xAxis);
          break;
        }
        case 2: {
          await rotateCube("left", zAxis);
          break;
        }
        case 3: {
          await rotateCube("right", xAxis);
          break;
        }
        case 4: {
          await rotateCube("right", zAxis);
          break;
        }
      }
      break;
    } //left
    case 38: { //up
      switch (facing) {
        case 0: case 5: {
          if (Math.abs(camera.rotation.z) > Math.PI/4 && Math.abs(camera.rotation.z) < (3 * Math.PI/4)) {
            if ((camera.rotation.x > 0 && camera.rotation.z > 0) ||
                (camera.rotation.x < 0 && camera.rotation.z < 0)) {
              await rotateCube("right", zAxis);
            } else {
              await rotateCube("left", zAxis);
            }
          } else if (Math.abs(camera.rotation.z) > Math.PI/4) {
            await rotateCube("right", xAxis);
          } else {
            await rotateCube("left", xAxis);
          }
          break;
        }
        case 1: {
          await rotateCube("right", zAxis);
          break;
        }
        case 2: {
          await rotateCube("left", xAxis);
          break;
        }
        case 3: {
          await rotateCube("left", zAxis);
          break;
        }
        case 4: {
          await rotateCube("right", xAxis)
        }
      }
      break;
    } //up
    case 39: { //right
      switch (facing) {
        case 0: case 5: {
          if (Math.abs(camera.rotation.z) > Math.PI/4 && Math.abs(camera.rotation.z) < (3 * Math.PI/4)) {
            if (camera.rotation.z > 0) {
              await rotateCube("left", xAxis);
            } else {
              await rotateCube("right", xAxis);
            }
          } else if ((Math.abs(camera.rotation.z) > Math.PI/4 && camera.rotation.x > 0) ||
                     (Math.abs(camera.rotation.z) < Math.PI/4 && camera.rotation.x < 0)) {
            await rotateCube("right", zAxis);
          } else {
            await rotateCube("left", zAxis);
          }
          break;
        }
        case 1: {
          await rotateCube("right", xAxis);
          break;
        }
        case 2: {
          await rotateCube("right", zAxis);
          break;
        }
        case 3: {
          await rotateCube("left", xAxis);
          break;
        }
        case 4: {
          await rotateCube("left", zAxis);
          break;
        }
      }
      break;
    } //right
    case 40: { //down
      switch (facing) {
        case 0: case 5: {
          if (Math.abs(camera.rotation.z) > Math.PI/4 && Math.abs(camera.rotation.z) < (3 * Math.PI/4)) {
            if ((camera.rotation.x > 0 && camera.rotation.z > 0) ||
                (camera.rotation.x < 0 && camera.rotation.z < 0)) {
              await rotateCube("left", zAxis);
            } else {
              await rotateCube("right", zAxis);
            }
          } else if (Math.abs(camera.rotation.z) > Math.PI/4) {
            await rotateCube("left", xAxis);
          } else {
            await rotateCube("right", xAxis);
          }
          break;
        }
        case 1: {
          await rotateCube("left", zAxis);
          break;
        }
        case 2: {
          await rotateCube("right", xAxis);
          break;
        }
        case 3: {
          await rotateCube("right", zAxis);
          break;
        }
        case 4: {
          await rotateCube("left", xAxis)
        }
      }
      break;
    } //down
    case 32: {
      if (keysDown.indexOf(keyCode) !== -1) return;
      keysDown.push(keyCode);
      break;
    } //space
  }
}, false);
canvas.addEventListener('keyup', function(event){
  let keyCode = event.keyCode;

  if (keysDown.indexOf(keyCode) !== -1) keysDown = keysDown.filter(e => e !== keyCode);
})
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  offsetCamera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  offsetCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}, false)

function castRay() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  let i = 0;
  if ((function(){
    for (; i < intersects.length; i++) {
      if (intersects[i].object.isRubikSide) return true;
    }
    return false;
  })()) {
    if (intersects[i].object.type == "Mesh") {
      mouseIP = intersects[i].point;
      selectedSideIndex = intersects[i].object.index;
      selected = intersects[i].object;
      cubicle = getElementByPropertyValue(cubicles, "object", intersects[i].object.parent);
      selectedPieceType = cubicle.pieceType;
      if (selectedPieceType == 1 || (selectedPieceType == 0 && determined)) {
        getPivotSide(raycaster, intersects);
      }
      loops = 0;
      controls.enableRotate = false;
    }
  }
}

function getPivotSide(raycaster, intersects, skip) {
  if (skip === undefined) {
    if (selectedPieceType == 1) {
      if (cubicle.cubeLayers[0] == selectedSideIndex) {
        pivotSide = cubicle.cubeLayers[1];
      } else {
        pivotSide = cubicle.cubeLayers[0];
      }
    }
    else if (selectedPieceType == 0) {
      let tempLayers = [];
      for (let i = 0; i < cubicle.cubeLayers.length; i++) tempLayers.push(cubicle.cubeLayers[i]);
      
      tempLayers = tempLayers.filter(e => e !== selectedSideIndex);
      if (larger == "X") {
        switch (facing) {
          case 0: case 5: {
            if (tempLayers.indexOf(0) !== -1) {
              pivotSide = 0;
            } else if (tempLayers.indexOf(5) !== -1) {
              pivotSide = 5
            } else if (Math.abs(camera.rotation.z) > Math.PI/4 && Math.abs(camera.rotation.z) < (3 * Math.PI/4)) {
              tempLayers.indexOf(2) !== -1 ? tempLayers = tempLayers.filter(e => e !== 2) : tempLayers = tempLayers.filter(e => e !== 4);
              pivotSide = tempLayers[0];
            } else {
              tempLayers.indexOf(1) !== -1 ? tempLayers = tempLayers.filter(e => e !== 1) : tempLayers = tempLayers.filter(e => e !== 3);
              pivotSide = tempLayers[0];
            }
            break;
          }
          case 1: case 2: case 3: case 4: {
            if (selectedSideIndex == 0 || selectedSideIndex == 5) {
              if (tempLayers.indexOf(facing) !== -1) {
                pivotSide = facing;
              } else {
                facing == 1 ? pivotSide = 3 : facing == 2 ? pivotSide = 4 : facing == 3 ? pivotSide = 1 : facing == 4 ? pivotSide = 2 : null; 
              }
            } else {
              pivotSide = tempLayers.indexOf(0) !== -1 ? 0 : 5;
            }
            break;
          }
        }
      }
      else if (larger == "Y") {
        switch (facing) {
          case 0: case 5: {
            if (selectedSideIndex > 0 && selectedSideIndex < 5) {
              tempLayers = tempLayers.filter(e => e !== facing);
            } else {
              if (Math.abs(camera.rotation.z) > Math.PI/4 && Math.abs(camera.rotation.z) < (3 * Math.PI/4)) {
                tempLayers.indexOf(1) !== -1 ? tempLayers = tempLayers.filter(e => e !== 1) : tempLayers = tempLayers.filter(e => e !== 3);
              } else {
                tempLayers.indexOf(2) !== -1 ? tempLayers = tempLayers.filter(e => e !== 2) : tempLayers = tempLayers.filter(e => e !== 4);
              }
            }
            pivotSide = tempLayers[0];
            break;
          }
          case 1: case 2: case 3: case 4: {
            if (selectedSideIndex == 0 || selectedSideIndex == 5) {
              if (tempLayers.indexOf(facing) == -1) {
                facing == 1 ? tempLayers = tempLayers.filter(e => e !== 3) : facing == 2 ? tempLayers = tempLayers.filter(e => e !== 4) : facing == 3 ? tempLayers = tempLayers.filter(e => e !== 1) : facing == 4 ? tempLayers = tempLayers.filter(e => e !== 2) : null;
              } else {
                tempLayers.filter(e => e !== facing);
              }
            } else {
              tempLayers.indexOf(0) !== -1 ? tempLayers = tempLayers.filter(e => e !== 0) : tempLayers = tempLayers.filter(e => e !== 5);
            }
            pivotSide = tempLayers[0];
            break;
          }
        }
      }
    }
    
    let circPos = new THREE.Vector3().addVectors(camera.position, raycaster.ray.direction.multiplyScalar(intersects[0].distance));
    circle.position.set(circPos.x, circPos.y, circPos.z);
  }
  
  let layerCubes = [];

  cubicles.forEach(item => {
    if (item.cubeLayers.indexOf(pivotSide) !== -1) {
      scene.remove(item.object);
      switch (pivotSide) {
        case 0: {
          if (item.cubeLayers.indexOf(1) !== -1 && item.cubeLayers.indexOf(4) !== -1) { layerCubes[0] = item } //top left
          else if (item.cubeLayers.indexOf(3) !== -1 && item.cubeLayers.indexOf(4) !== -1) { layerCubes[2] = item } // top right
          else if (item.cubeLayers.indexOf(1) !== -1 && item.cubeLayers.indexOf(2) !== -1) { layerCubes[6] = item } // bottom left
          else if (item.cubeLayers.indexOf(3) !== -1 && item.cubeLayers.indexOf(2) !== -1) { layerCubes[8] = item } // bottom right
          else if (item.cubeLayers.indexOf(4) !== -1 && item.cubeLayers.length == 2) { layerCubes[1] = item } // top mid
          else if (item.cubeLayers.indexOf(1) !== -1 && item.cubeLayers.length == 2) { layerCubes[3] = item } // left mid
          else if (item.cubeLayers.indexOf(3) !== -1 && item.cubeLayers.length == 2) { layerCubes[5] = item } // right mid
          else if (item.cubeLayers.indexOf(2) !== -1 && item.cubeLayers.length == 2) { layerCubes[7] = item } // bottom mid
          else if (item.cubeLayers.indexOf(0) !== -1 && item.cubeLayers.length == 1) {
            layerCubes[4] = item;
          } // mid
          break;
        }
        case 1: {
          if (item.cubeLayers.indexOf(5) !== -1 && item.cubeLayers.indexOf(4) !== -1) { layerCubes[0] = item } //top left
          else if (item.cubeLayers.indexOf(0) !== -1 && item.cubeLayers.indexOf(4) !== -1) { layerCubes[2] = item } // top right
          else if (item.cubeLayers.indexOf(5) !== -1 && item.cubeLayers.indexOf(2) !== -1) { layerCubes[6] = item } // bottom left
          else if (item.cubeLayers.indexOf(0) !== -1 && item.cubeLayers.indexOf(2) !== -1) { layerCubes[8] = item } // bottom right
          else if (item.cubeLayers.indexOf(4) !== -1 && item.cubeLayers.length == 2) { layerCubes[1] = item } // top mid
          else if (item.cubeLayers.indexOf(5) !== -1 && item.cubeLayers.length == 2) { layerCubes[3] = item } // left mid
          else if (item.cubeLayers.indexOf(0) !== -1 && item.cubeLayers.length == 2) { layerCubes[5] = item } // right mid
          else if (item.cubeLayers.indexOf(2) !== -1 && item.cubeLayers.length == 2) { layerCubes[7] = item } // bottom mid
          else if (item.cubeLayers.indexOf(1) !== -1 && item.cubeLayers.length == 1) { // mid
            layerCubes[4] = item;
          }
          break;
        }
        case 2: {
          if (item.cubeLayers.indexOf(0) !== -1 && item.cubeLayers.indexOf(1) !== -1) { layerCubes[0] = item } //top left
          else if (item.cubeLayers.indexOf(0) !== -1 && item.cubeLayers.indexOf(3) !== -1) { layerCubes[2] = item } // top right
          else if (item.cubeLayers.indexOf(5) !== -1 && item.cubeLayers.indexOf(1) !== -1) { layerCubes[6] = item } // bottom left
          else if (item.cubeLayers.indexOf(5) !== -1 && item.cubeLayers.indexOf(3) !== -1) { layerCubes[8] = item } // bottom right
          else if (item.cubeLayers.indexOf(0) !== -1 && item.cubeLayers.length == 2) { layerCubes[1] = item } // top mid
          else if (item.cubeLayers.indexOf(1) !== -1 && item.cubeLayers.length == 2) { layerCubes[3] = item } // left mid
          else if (item.cubeLayers.indexOf(3) !== -1 && item.cubeLayers.length == 2) { layerCubes[5] = item } // right mid
          else if (item.cubeLayers.indexOf(5) !== -1 && item.cubeLayers.length == 2) { layerCubes[7] = item } // bottom mid
          else if (item.cubeLayers.indexOf(2) !== -1 && item.cubeLayers.length == 1) {
            layerCubes[4] = item;
          } // mid
          break;
        }
        case 3: {
          if (item.cubeLayers.indexOf(5) !== -1 && item.cubeLayers.indexOf(4) !== -1) { layerCubes[0] = item } //top left
          else if (item.cubeLayers.indexOf(0) !== -1 && item.cubeLayers.indexOf(4) !== -1) { layerCubes[2] = item } // top right
          else if (item.cubeLayers.indexOf(5) !== -1 && item.cubeLayers.indexOf(2) !== -1) { layerCubes[6] = item } // bottom left
          else if (item.cubeLayers.indexOf(0) !== -1 && item.cubeLayers.indexOf(2) !== -1) { layerCubes[8] = item } // bottom right
          else if (item.cubeLayers.indexOf(4) !== -1 && item.cubeLayers.length == 2) { layerCubes[1] = item } // top mid
          else if (item.cubeLayers.indexOf(5) !== -1 && item.cubeLayers.length == 2) { layerCubes[3] = item } // left mid
          else if (item.cubeLayers.indexOf(0) !== -1 && item.cubeLayers.length == 2) { layerCubes[5] = item } // right mid
          else if (item.cubeLayers.indexOf(2) !== -1 && item.cubeLayers.length == 2) { layerCubes[7] = item } // bottom mid
          else if (item.cubeLayers.indexOf(3) !== -1 && item.cubeLayers.length == 1) { // mid
            layerCubes[4] = item;
          }
          break;
        }
        case 4: {
          if (item.cubeLayers.indexOf(1) !== -1 && item.cubeLayers.indexOf(0) !== -1) { layerCubes[0] = item } //top left
          else if (item.cubeLayers.indexOf(3) !== -1 && item.cubeLayers.indexOf(0) !== -1) { layerCubes[2] = item } // top right
          else if (item.cubeLayers.indexOf(1) !== -1 && item.cubeLayers.indexOf(5) !== -1) { layerCubes[6] = item } // bottom left
          else if (item.cubeLayers.indexOf(3) !== -1 && item.cubeLayers.indexOf(5) !== -1) { layerCubes[8] = item } // bottom right
          else if (item.cubeLayers.indexOf(0) !== -1 && item.cubeLayers.length == 2) { layerCubes[1] = item } // top mid
          else if (item.cubeLayers.indexOf(1) !== -1 && item.cubeLayers.length == 2) { layerCubes[3] = item } // left mid
          else if (item.cubeLayers.indexOf(3) !== -1 && item.cubeLayers.length == 2) { layerCubes[5] = item } // right mid
          else if (item.cubeLayers.indexOf(5) !== -1 && item.cubeLayers.length == 2) { layerCubes[7] = item } // bottom mid
          else if (item.cubeLayers.indexOf(4) !== -1 && item.cubeLayers.length == 1) {
            layerCubes[4] = item;
          } // mid
          break;
        }
        case 5: {
          if (item.cubeLayers.indexOf(1) !== -1 && item.cubeLayers.indexOf(4) !== -1) { layerCubes[0] = item } //top left
          else if (item.cubeLayers.indexOf(3) !== -1 && item.cubeLayers.indexOf(4) !== -1) { layerCubes[2] = item } // top right
          else if (item.cubeLayers.indexOf(1) !== -1 && item.cubeLayers.indexOf(2) !== -1) { layerCubes[6] = item } // bottom left
          else if (item.cubeLayers.indexOf(3) !== -1 && item.cubeLayers.indexOf(2) !== -1) { layerCubes[8] = item } // bottom right
          else if (item.cubeLayers.indexOf(4) !== -1 && item.cubeLayers.length == 2) { layerCubes[1] = item } // top mid
          else if (item.cubeLayers.indexOf(1) !== -1 && item.cubeLayers.length == 2) { layerCubes[3] = item } // left mid
          else if (item.cubeLayers.indexOf(3) !== -1 && item.cubeLayers.length == 2) { layerCubes[5] = item } // right mid
          else if (item.cubeLayers.indexOf(2) !== -1 && item.cubeLayers.length == 2) { layerCubes[7] = item } // bottom mid
          else if (item.cubeLayers.indexOf(5) !== -1 && item.cubeLayers.length == 1) {
            layerCubes[4] = item;
          } // mid
          break;
        }
      }
      circle.lookAt(camera.position.x, camera.position.y, camera.position.z);
    }
  })
  
  switch(pivotSide) {
    case 0:
      for (let i = 0; i < layerCubes.length; i++) {
        topLayer.add(layerCubes[i].object);
        layerCubes[i].object.position.y = 0;
      }
      break;
    case 1:
      for (let i = 0; i < layerCubes.length; i++) {
        leftLayer.add(layerCubes[i].object);
        layerCubes[i].object.position.x = 0;
      }
      break;
    case 2:
      for (let i = 0; i < layerCubes.length; i++) {
        frontLayer.add(layerCubes[i].object);
        layerCubes[i].object.position.z = 0;
      }
      break;
    case 3:
      for (let i = 0; i < layerCubes.length; i++) {
        rightLayer.add(layerCubes[i].object);
        layerCubes[i].object.position.x = 0;
      }
      break;
    case 4:
      for (let i = 0; i < layerCubes.length; i++) {
        backLayer.add(layerCubes[i].object);
        layerCubes[i].object.position.z = 0;
      }
      break;
    case 5:
      for (let i = 0; i < layerCubes.length; i++) {
        bottomLayer.add(layerCubes[i].object);
        layerCubes[i].object.position.y = 0;
      }
      break;
  }
  
  if (skip === undefined) scene.add(circle);
}

async function snap(skip) {
  let count = 0;
  let turnType = 0;
  if (skip === undefined) {
    for (let item of cubicles) {
      if (item.cubeLayers.indexOf(pivotSide) !== -1) {
        selectedSideIndex = -1;
        let layerDir = new THREE.Vector3();
        switch (pivotSide) {
          case 0: {
            if (count == 0) {
              topLayer.getWorldDirection(layerDir);
              if (Math.abs(layerDir.x) > Math.abs(layerDir.z)) {
                if (layerDir.x < 0) {
                  turnType = -90;
                } else {
                  turnType = 90;
                }
              } else if (layerDir.z < 0) {
                turnType = 180;
              }
              count++;
              await rotateCubicles("top", turnType, topLayer);
            }
            topLayer.remove(item.object);
            item.object.position.y = 10.1;
            break;
          }
          case 1: {
            if (count == 0) {
              leftLayer.getWorldDirection(layerDir);
              if (Math.abs(layerDir.y) > Math.abs(layerDir.z)) {
                if (layerDir.y < 0) {
                  turnType = 90;
                } else {
                  turnType = -90;
                }
              } else if (layerDir.z < 0) {
                turnType = 180;
              }
              leftLayer.rotation.z = 0;
              count++;
              await rotateCubicles("left", turnType, leftLayer);
            }
            leftLayer.remove(item.object);
            item.object.position.x = -10.1;
            break;
          }
          case 2: {
            if (count == 0) {
              count++;
              layerDir = frontLayer.rotation;
              if ((3 * Math.PI)/4 > Math.abs(layerDir.z) && Math.abs(layerDir.z) > Math.PI/4) {
                if (layerDir.z > 0) {
                  turnType = -90;
                } else {
                  turnType = 90;
                }
              } else if (Math.abs(layerDir.z) > (3 * Math.PI)/4) {
                turnType = 180;
              }
              await rotateCubicles("front", turnType, frontLayer);
            }
            frontLayer.remove(item.object);
            item.object.position.z = 10.1;
            break;
          }
          case 3: {
            if (count == 0) {
              rightLayer.getWorldDirection(layerDir);
              if (Math.abs(layerDir.y) > Math.abs(layerDir.z)) {
                if (layerDir.y < 0) {
                  turnType = 90;
                } else {
                  turnType = -90;
                }
              } else if (layerDir.z < 0) {
                turnType = 180;
              }
              rightLayer.rotation.z = 0;
              count++;
              await rotateCubicles("right", turnType, rightLayer);
            }
            rightLayer.remove(item.object);
            item.object.position.x = 10.1;
            break;
          }
          case 4: {
            if (count == 0) {
              count++;
              layerDir = backLayer.rotation;
              if ((3 * Math.PI)/4 > Math.abs(layerDir.z) && Math.abs(layerDir.z) > Math.PI/4) {
                if (layerDir.z > 0) {
                  turnType = 90;
                } else {
                  turnType = -90;
                }
              } else if (Math.abs(layerDir.z) > (3 * Math.PI)/4) {
                turnType = 180;
              }
              await rotateCubicles("back", turnType, backLayer);
            }
            backLayer.remove(item.object);
            item.object.position.z = -10.1;
            break;
          }
          case 5: {
            if (count == 0) {
              bottomLayer.getWorldDirection(layerDir);
              if (Math.abs(layerDir.x) > Math.abs(layerDir.z)) {
                if (layerDir.x < 0) {
                  turnType = -90;
                } else {
                  turnType = 90;
                }
              } else if (layerDir.z < 0) {
                turnType = 180;
              }
              count++;
              await rotateCubicles("bottom", turnType, bottomLayer);
            }
            bottomLayer.remove(item.object);
            item.object.position.y = -10.1;
            break;
          }
        }
        scene.add(item.object);
      }
    }
  }
  
  cubicles.forEach(cubicle => {
    cubicle.cubeLayers = [];
    if (cubicle.object.position.z == -10.1) {
      cubicle.cubeLayers.push(4);
    } else if (cubicle.object.position.z == 10.1) {
      cubicle.cubeLayers.push(2);
    }
    
    if (cubicle.object.position.x == -10.1) {
      cubicle.cubeLayers.push(1);
    } else if (cubicle.object.position.x == 10.1) {
      cubicle.cubeLayers.push(3);
    }
  
    if (cubicle.object.position.y == 10.1) {
      cubicle.cubeLayers.push(0);
    } else if (cubicle.object.position.y == -10.1) {
      cubicle.cubeLayers.push(5);
    }
  })
}

async function rotateCube(direction, axis) {
  if (transitioning) return;
  
  transitioning = true;
  
  allCubes.rotation.set(0, 0, 0);
  cubicles.forEach(cubicle => {
    allCubes.add(cubicle.object);
  })
  if ((axis.x == 1 || (axis.x == 1 && facing == 0) || (axis.x == 1 && facing == 5)) && direction == "left") {
    let accel = 0; 
    while (Math.abs(allCubes.getWorldQuaternion(new THREE.Euler()).x) < Math.PI/2) {
      if (Math.abs(allCubes.getWorldQuaternion(new THREE.Euler()).x) < Math.PI/4) { accel -= THREE.Math.degToRad(0.21) } else { accel += THREE.Math.degToRad(0.2) }
      allCubes.rotateOnWorldAxis(axis, accel);
      await timer(10);
    }
    allCubes.rotation.set(-Math.PI/2, 0, 0);
  } else if ((axis.z == 1 || (axis.z == 1 && facing == 0) || (axis.z == 1 && facing == 5)) && direction == "right") {
    let accel = 0; 
    while (Math.abs(allCubes.getWorldQuaternion(new THREE.Euler()).z) < Math.PI/2) {
      if (Math.abs(allCubes.getWorldQuaternion(new THREE.Euler()).z) < Math.PI/4) { accel -= THREE.Math.degToRad(0.21) } else { accel += THREE.Math.degToRad(0.2) }
      allCubes.rotateOnWorldAxis(axis, accel);
      await timer(10);
    }
    allCubes.rotation.set(0, 0, -Math.PI/2);
  } else if ((axis.x == 1 || (axis.x == 1 && facing == 0) || (axis.x == 1 && facing == 5)) && direction == "right") {
    let accel = 0; 
    while (Math.abs(allCubes.getWorldQuaternion(new THREE.Euler()).x) < Math.PI/2) {
      if (Math.abs(allCubes.getWorldQuaternion(new THREE.Euler()).x) < Math.PI/4) { accel += THREE.Math.degToRad(0.21) } else { accel -= THREE.Math.degToRad(0.2) }
      allCubes.rotateOnWorldAxis(axis, accel);
      await timer(10);
    }
    allCubes.rotation.set(Math.PI/2, 0, 0);
  } else if ((axis.z == 1 || (axis.z == 1 && facing == 0) || (axis.z == 1 && facing == 5)) && direction == "left") {
    let accel = 0; 
    while (Math.abs(allCubes.getWorldQuaternion(new THREE.Euler()).z) < Math.PI/2) {
      if (Math.abs(allCubes.getWorldQuaternion(new THREE.Euler()).z) < Math.PI/4) { accel += THREE.Math.degToRad(0.21) } else { accel -= THREE.Math.degToRad(0.2) }
      allCubes.rotateOnWorldAxis(axis, accel);
      await timer(10);
    }
    allCubes.rotation.set(0, 0, Math.PI/2);
  }

  // Optimize this part below with the indexing function calls, line amount could be reduced by half probably. Only the first two paragraphs, though. The bottom one is for top and bottom side which need to be that way to work. I think.
  
  if (facing == 2 || facing == 4) {
    if (direction == "left" && axis.z == 1) {
      zAntiClockwiseIndexing(allCubes);
    } else if (axis.z == 1) {
      zClockwiseIndexing(allCubes);
    } else if (direction == "left" && axis.x == 1) {
      xAntiClockwiseIndexing(allCubes);
    } else if (axis.x == 1) {
      xClockwiseIndexing(allCubes);
    }
  } else if (facing == 1 || facing == 3) {
    if (direction == "left" && axis.x == 1) {
      xAntiClockwiseIndexing(allCubes);
    } else if (axis.x == 1) {
      xClockwiseIndexing(allCubes);
    } else if (direction == "left" && axis.z == 1) {
      zAntiClockwiseIndexing(allCubes);
    } else if (axis.z == 1) {
      zClockwiseIndexing(allCubes);
    }
  } else if (facing == 0 ||facing == 5) {
    if (axis.x == 1) {
      if (direction == "left") {
        xAntiClockwiseIndexing(allCubes);
      } else if (direction == "right") {
        xClockwiseIndexing(allCubes);
      }
    } else if (axis.z == 1) {
      if (direction == "left") {
        zAntiClockwiseIndexing(allCubes);
      } else if (direction == "right") {
        zClockwiseIndexing(allCubes);
      }
    }
  }
  while (allCubes.children.length > 0) {
    let cubicle = allCubes.children[0];
    let position = new THREE.Vector3();
    let rotation = new THREE.Euler();
    cubicle.getWorldPosition(position);
    cubicle.getWorldQuaternion(rotation);
    position = roundVec(position, 1);
    
    allCubes.remove(cubicle);
    scene.add(cubicle);
    
    cubicle.position.copy(position);
    cubicle.rotation.copy(rotation);
  }
  
  await snap(true);
  transitioning = false;
}

function animate() {
  if (!controls.enableRotate && !snapping) {
    const currentMouse3DRaycast = new THREE.Raycaster();
    currentMouse3DRaycast.setFromCamera(currentMouse, camera);
    const ip = currentMouse3DRaycast.intersectObject(circle);
    
    let lineEnd = new THREE.Vector3();
    try {
      lineEnd.add(ip[0].point);
    } catch(e) {
      requestAnimationFrame(animate);
      return;
    }
    
    let dir = new THREE.Vector3();

    if (loops > 0) {
      let startVec = new THREE.Vector2(0, 0);
      let zRot;
      switch(pivotSide) {
        case 0: {
          topLayer.lookAt(lineEnd.x, topLayer.position.y, lineEnd.z);
          topLayer.getWorldDirection(dir);

          if (selectedSideIndex == 1) {
            topLayer.lookAt(dir.x * Math.cos(-(Math.PI/2)) - dir.z * Math.sin(-(Math.PI/2)), topLayer.position.y, dir.x * Math.sin(-(Math.PI/2)) + dir.z * Math.cos(-(Math.PI/2)));
          } else if (selectedSideIndex == 3) {
            topLayer.lookAt(dir.x * Math.cos(Math.PI/2) - dir.z * Math.sin(Math.PI/2), topLayer.position.y, dir.x * Math.sin(Math.PI/2) + dir.z * Math.cos(Math.PI/2));
          } else if (selectedSideIndex == 4) {
            topLayer.lookAt(dir.x * Math.cos(Math.PI) - dir.z * Math.sin(Math.PI), topLayer.position.y, dir.x * Math.sin(Math.PI) + dir.z * Math.cos(Math.PI));
          }
          if (selectedPieceType == 0) {
            if ((selectedSideIndex == 1 && cubicle.object.position.z > 0) ||
                (selectedSideIndex == 3 && cubicle.object.position.z < 0)) {
              topLayer.rotation.y += Math.atan(cubicle.object.position.x / cubicle.object.position.z) + 0.5 * Math.abs(topLayer.rotation.x);
            }
            if ((selectedSideIndex == 1 && cubicle.object.position.z < 0) ||
                (selectedSideIndex == 3 && cubicle.object.position.z > 0)) {
              topLayer.rotation.y += Math.atan(cubicle.object.position.x / cubicle.object.position.z) + 1.5 * Math.abs(topLayer.rotation.x);
            }
            if ((selectedSideIndex == 2 && cubicle.object.position.x > 0) ||
                (selectedSideIndex == 4 && cubicle.object.position.x < 0)) {
              topLayer.rotation.y += Math.atan(cubicle.object.position.z / cubicle.object.position.x) - Math.PI/2 + (1.5 * -Math.abs(topLayer.rotation.x));
            }
            if ((selectedSideIndex == 2 && cubicle.object.position.x < 0) ||
                (selectedSideIndex == 4 && cubicle.object.position.x > 0)) {
              topLayer.rotation.y += Math.atan(cubicle.object.position.z / cubicle.object.position.x) + Math.PI/2 + (0.5 * -Math.abs(topLayer.rotation.x));
            }
          }
          break;
        }
        case 1: {
          leftLayer.lookAt(leftLayer.position.x, lineEnd.y, lineEnd.z);
          leftLayer.getWorldDirection(dir);
          
          if (selectedSideIndex == 5) {
            leftLayer.lookAt(leftLayer.position.x, dir.y * Math.cos(-(Math.PI/2)) - dir.z * Math.sin(-(Math.PI/2)), dir.y * Math.sin(-(Math.PI/2)) + dir.z * Math.cos(-(Math.PI/2)));
          } else if (selectedSideIndex == 0) {
            leftLayer.lookAt(leftLayer.position.x, dir.y * Math.cos(Math.PI/2) - dir.z * Math.sin(Math.PI/2), dir.y * Math.sin(Math.PI/2) + dir.z * Math.cos(Math.PI/2));
          } else if (selectedSideIndex == 4) {
            leftLayer.lookAt(leftLayer.position.x, dir.y * Math.cos(Math.PI) - dir.z * Math.sin(Math.PI), dir.y * Math.sin(Math.PI) + dir.z * Math.cos(Math.PI));
          }
          if (selectedPieceType == 0) {
            if ((selectedSideIndex == 0 && cubicle.object.position.z > 0) ||
                (selectedSideIndex == 5 && cubicle.object.position.z < 0)) {
              leftLayer.rotation.x += Math.atan(cubicle.object.position.y / cubicle.object.position.z) - Math.PI/2 + 0.5 * Math.abs(leftLayer.rotation.y);
            }
            if ((selectedSideIndex == 0 && cubicle.object.position.z < 0) ||
                (selectedSideIndex == 5 && cubicle.object.position.z > 0)) {
              leftLayer.rotation.x += Math.atan(cubicle.object.position.y / cubicle.object.position.z) + Math.PI/2 + 1.5 * Math.abs(leftLayer.rotation.y);
            }
            if ((selectedSideIndex == 2 && cubicle.object.position.y > 0) ||
                (selectedSideIndex == 4 && cubicle.object.position.y < 0)) {
              leftLayer.rotation.x += Math.atan(cubicle.object.position.z / cubicle.object.position.y) + (1.5 * -Math.abs(leftLayer.rotation.y));
            }
            if ((selectedSideIndex == 2 && cubicle.object.position.y < 0) ||
                (selectedSideIndex == 4 && cubicle.object.position.y > 0)) {
              leftLayer.rotation.x += Math.atan(cubicle.object.position.z / cubicle.object.position.y) + (0.5 * -Math.abs(leftLayer.rotation.y));
            }
          }
          leftLayer.rotation.z = 0;
          break;
        }
        case 2: {
          startVec.y = 1;
          startVec.x = 0;
          if (selectedSideIndex == 1) {
            startVec.x = -Math.PI/2
            startVec.y = 0;
          } else if (selectedSideIndex == 3) {
            startVec.x = Math.PI/2
            startVec.y = 0;
          } else if (selectedSideIndex == 5) {
            startVec.x = 0;
            startVec.y = -1;
          }
          zRot = Math.acos((startVec.x * lineEnd.x + startVec.y * lineEnd.y) / (Math.sqrt(startVec.x * startVec.x + startVec.y * startVec.y) * Math.sqrt(lineEnd.x * lineEnd.x + lineEnd.y * lineEnd.y)));
          if (((lineEnd.x < 0 && selectedSideIndex == 5) || (lineEnd.x > 0 && selectedSideIndex == 0)) ||
              ((lineEnd.y < 0 && selectedSideIndex == 3) || (lineEnd.y > 0 && selectedSideIndex == 1))) {
            zRot = -1 * zRot;
          }
          
          if (cubicle.object.position.x > 0) {
            zRot -= Math.atan(cubicle.object.position.y / cubicle.object.position.x) - Math.PI/2;
            if (selectedSideIndex == 5) zRot -= Math.PI;
          } else if (cubicle.object.position.x < 0) {
            zRot -= Math.atan(cubicle.object.position.y / cubicle.object.position.x) + Math.PI/2;
            if (selectedSideIndex == 5) zRot += Math.PI;
          }
          if (selectedSideIndex == 3) {
            zRot -= Math.PI/2;
          }
          if (selectedSideIndex == 1) {
            zRot += Math.PI/2;
          }
          
          frontLayer.rotation.set(0, 0, zRot);
          break;
        }
        case 3: {
          rightLayer.lookAt(rightLayer.position.x, lineEnd.y, lineEnd.z);
          rightLayer.getWorldDirection(dir);
          
          if (selectedSideIndex == 5) {
            rightLayer.lookAt(rightLayer.position.x, dir.y * Math.cos(-(Math.PI/2)) - dir.z * Math.sin(-(Math.PI/2)), dir.y * Math.sin(-(Math.PI/2)) + dir.z * Math.cos(-(Math.PI/2)));
          } else if (selectedSideIndex == 0) {
            rightLayer.lookAt(rightLayer.position.x, dir.y * Math.cos(Math.PI/2) - dir.z * Math.sin(Math.PI/2), dir.y * Math.sin(Math.PI/2) + dir.z * Math.cos(Math.PI/2));
          } else if (selectedSideIndex == 4) {
            rightLayer.lookAt(rightLayer.position.x, dir.y * Math.cos(Math.PI) - dir.z * Math.sin(Math.PI), dir.y * Math.sin(Math.PI) + dir.z * Math.cos(Math.PI));
          }
          if (selectedPieceType == 0) {
            if ((selectedSideIndex == 0 && cubicle.object.position.z > 0) ||
                (selectedSideIndex == 5 && cubicle.object.position.z < 0)) {
              rightLayer.rotation.x += Math.atan(cubicle.object.position.y / cubicle.object.position.z) - Math.PI/2 + 0.5 * Math.abs(rightLayer.rotation.y);
            }
            if ((selectedSideIndex == 0 && cubicle.object.position.z < 0) ||
                (selectedSideIndex == 5 && cubicle.object.position.z > 0)) {
              rightLayer.rotation.x += Math.atan(cubicle.object.position.y / cubicle.object.position.z) + Math.PI/2 + 1.5 * Math.abs(rightLayer.rotation.y);
            }
            if ((selectedSideIndex == 2 && cubicle.object.position.y > 0) ||
                (selectedSideIndex == 4 && cubicle.object.position.y < 0)) {
              rightLayer.rotation.x += Math.atan(cubicle.object.position.z / cubicle.object.position.y) + (1.5 * -Math.abs(rightLayer.rotation.y));
            }
            if ((selectedSideIndex == 2 && cubicle.object.position.y < 0) ||
                (selectedSideIndex == 4 && cubicle.object.position.y > 0)) {
              rightLayer.rotation.x += Math.atan(cubicle.object.position.z / cubicle.object.position.y) + (0.5 * -Math.abs(rightLayer.rotation.y));
            }
          }
          rightLayer.rotation.z = 0;
          break;
        }
        case 4: {
          startVec.y = 1;
          startVec.x = 0;
          if (selectedSideIndex == 1) {
            startVec.x = -Math.PI/2
            startVec.y = 0;
          } else if (selectedSideIndex == 3) {
            startVec.x = Math.PI/2
            startVec.y = 0;
          } else if (selectedSideIndex == 5) {
            startVec.x = 0;
            startVec.y = -1;
          }
          zRot = Math.acos((startVec.x * lineEnd.x + startVec.y * lineEnd.y) / (Math.sqrt(startVec.x * startVec.x + startVec.y * startVec.y) * Math.sqrt(lineEnd.x * lineEnd.x + lineEnd.y * lineEnd.y)));
          if (((lineEnd.x < 0 && selectedSideIndex == 5) || (lineEnd.x > 0 && selectedSideIndex == 0)) ||
              ((lineEnd.y < 0 && selectedSideIndex == 3) || (lineEnd.y > 0 && selectedSideIndex == 1))) {
            zRot = -1 * zRot;
          }

          if (cubicle.object.position.x > 0) {
            zRot -= Math.atan(cubicle.object.position.y / cubicle.object.position.x) - Math.PI/2;
            if (selectedSideIndex == 5) zRot -= Math.PI;
          } else if (cubicle.object.position.x < 0) {
            zRot -= Math.atan(cubicle.object.position.y / cubicle.object.position.x) + Math.PI/2;
            if (selectedSideIndex == 5) zRot += Math.PI;
          }
          if (selectedSideIndex == 3) {
            zRot -= Math.PI/2;
          }
          if (selectedSideIndex == 1) {
            zRot += Math.PI/2;
          }
          
          backLayer.rotation.set(0, 0, zRot);
          break;
        }
        case 5: {
          bottomLayer.lookAt(lineEnd.x, bottomLayer.position.y, lineEnd.z);
          bottomLayer.getWorldDirection(dir);
        
          if (selectedSideIndex == 1) {
            bottomLayer.lookAt(dir.x * Math.cos(-(Math.PI/2)) - dir.z * Math.sin(-(Math.PI/2)), bottomLayer.position.y, dir.x * Math.sin(-(Math.PI/2)) + dir.z * Math.cos(-(Math.PI/2)));
          } else if (selectedSideIndex == 3) {
            bottomLayer.lookAt(dir.x * Math.cos(Math.PI/2) - dir.z * Math.sin(Math.PI/2), bottomLayer.position.y, dir.x * Math.sin(Math.PI/2) + dir.z * Math.cos(Math.PI/2));
          } else if (selectedSideIndex == 4) {
            bottomLayer.lookAt(dir.x * Math.cos(Math.PI) - dir.z * Math.sin(Math.PI), bottomLayer.position.y, dir.x * Math.sin(Math.PI) + dir.z * Math.cos(Math.PI));
          }
          if (selectedPieceType == 0) {
            if ((selectedSideIndex == 1 && cubicle.object.position.z > 0) ||
                (selectedSideIndex == 3 && cubicle.object.position.z < 0)) {
              bottomLayer.rotation.y += Math.atan(cubicle.object.position.x / cubicle.object.position.z) + 0.5 * Math.abs(bottomLayer.rotation.x);
            }
            if ((selectedSideIndex == 1 && cubicle.object.position.z < 0) ||
                (selectedSideIndex == 3 && cubicle.object.position.z > 0)) {
              bottomLayer.rotation.y += Math.atan(cubicle.object.position.x / cubicle.object.position.z) + 1.5 * Math.abs(bottomLayer.rotation.x);
            }
            if ((selectedSideIndex == 2 && cubicle.object.position.x > 0) ||
                (selectedSideIndex == 4 && cubicle.object.position.x < 0)) {
              bottomLayer.rotation.y += Math.atan(cubicle.object.position.z / cubicle.object.position.x) - Math.PI/2 + (1.5 * -Math.abs(bottomLayer.rotation.x));
            }
            if ((selectedSideIndex == 2 && cubicle.object.position.x < 0) ||
                (selectedSideIndex == 4 && cubicle.object.position.x > 0)) {
              bottomLayer.rotation.y += Math.atan(cubicle.object.position.z / cubicle.object.position.x) + Math.PI/2 + (0.5 * -Math.abs(bottomLayer.rotation.x));
            }
          }
          break;
        }
      }
    }
    loops++;
  }
  
  render();
  requestAnimationFrame(animate);
}

function render() {
  if (keysDown.indexOf(32) == -1) {
    renderer.render(scene, camera);
  } else {
    renderer.render(scene, offsetCamera);
  }
}

async function rotateCubicles(face, turnType, pivotLayer) {
  switch(face) {
    case "top": {
      if (turnType == -90) {
        await yClockwise();
      }
      else if (turnType == 90) {
        await yAntiClockwise();
      }
      else if (turnType == 180) {
        await yDoubleTurn();
      }
      else if (turnType == 0) {
        await yNoTurn();
      }
      break;
    }
    case "left": {
      if (turnType == -90) {
        await xAntiClockwise();
      }
      else if (turnType == 90) {
        await xClockwise();
      }
      else if (turnType == 180) {
        await xDoubleTurn();
      }
      else if (turnType == 0) {
        await xNoTurn();
      }
      break;
    }
    case "front": {
      if (turnType == -90) {
        await zAntiClockwise();
      }
      else if (turnType == 90) {
        await zClockwise();
      }
      else if (turnType == 180) {
        await zDoubleTurn();
      }
      else if (turnType == 0) {
        await zNoTurn();
      }
      break;
    }
    case "right": {
      if (turnType == -90) {
        await xAntiClockwise();
      }
      else if (turnType == 90) {
        await xClockwise();
      }
      else if (turnType == 180) {
        await xDoubleTurn();
      }
      else if (turnType == 0) {
        await xNoTurn();
      }
      break;
    }
    case "back": {
      if (turnType == -90) {
        await zClockwise();
      }
      else if (turnType == 90) {
        await zAntiClockwise();
      }
      else if (turnType == 180) {
        await zDoubleTurn();
      }
      else if (turnType == 0) {
        await zNoTurn();
      }
      break;
    }
    case "bottom": {
      if (turnType == -90) {
        await yClockwise();
      }
      else if (turnType == 90) {
        await yAntiClockwise();
      }
      else if (turnType == 180) {
        await yDoubleTurn();
      }
      else if (turnType == 0) {
        await yNoTurn();
      }
      break;
    }
  }

  async function yClockwise() {
    snapping = true;
    while (true) {
      let accel = (Math.PI/2 - Math.abs(pivotLayer.getWorldQuaternion(new THREE.Euler()).y)) * 0.15 * Math.sign(pivotLayer.getWorldQuaternion(new THREE.Euler()).y);
      if (pivotLayer.getWorldQuaternion(new THREE.Euler()).x < -1) accel = Math.abs(accel);
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(yAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;

    pivotLayer.children[0].position.x += 20.2;
    pivotLayer.children[0].rotateOnWorldAxis(yAxis, -(Math.PI/2));
    pivotLayer.children[1].position.x += 10.1;
    pivotLayer.children[1].position.z += 10.1;
    pivotLayer.children[1].rotateOnWorldAxis(yAxis, -(Math.PI/2));
    pivotLayer.children[2].position.z += 20.2;
    pivotLayer.children[2].rotateOnWorldAxis(yAxis, -(Math.PI/2));
    pivotLayer.children[3].position.x += 10.1;
    pivotLayer.children[3].position.z += -10.1;
    pivotLayer.children[3].rotateOnWorldAxis(yAxis, -(Math.PI/2));
    pivotLayer.children[4].rotateOnWorldAxis(yAxis, -(Math.PI/2));
    pivotLayer.children[5].position.x += -10.1;
    pivotLayer.children[5].position.z += 10.1;
    pivotLayer.children[5].rotateOnWorldAxis(yAxis, -(Math.PI/2));
    pivotLayer.children[6].position.z += -20.2;
    pivotLayer.children[6].rotateOnWorldAxis(yAxis, -(Math.PI/2));
    pivotLayer.children[7].position.x += -10.1;
    pivotLayer.children[7].position.z += -10.1;
    pivotLayer.children[7].rotateOnWorldAxis(yAxis, -(Math.PI/2));
    pivotLayer.children[8].position.x += -20.2;
    pivotLayer.children[8].rotateOnWorldAxis(yAxis, -(Math.PI/2));
    
    yClockwiseIndexing(pivotLayer);
  }
  async function yAntiClockwise() {
    snapping = true;
    while (true) {
      let accel = (Math.PI/2 - Math.abs(pivotLayer.getWorldQuaternion(new THREE.Euler()).y)) * 0.15 * Math.sign(pivotLayer.getWorldQuaternion(new THREE.Euler()).y);
      if (pivotLayer.getWorldQuaternion(new THREE.Euler()).x < -1) accel = -Math.abs(accel);
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(yAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;
    
    pivotLayer.children[0].position.z += 20.2;
    pivotLayer.children[0].rotateOnWorldAxis(yAxis, Math.PI/2);
    pivotLayer.children[1].position.x += -10.1;
    pivotLayer.children[1].position.z += 10.1;
    pivotLayer.children[1].rotateOnWorldAxis(yAxis, Math.PI/2);
    pivotLayer.children[2].position.x += -20.2;
    pivotLayer.children[2].rotateOnWorldAxis(yAxis, Math.PI/2);
    pivotLayer.children[3].position.x += 10.1;
    pivotLayer.children[3].position.z += 10.1;
    pivotLayer.children[3].rotateOnWorldAxis(yAxis, Math.PI/2);
    pivotLayer.children[4].rotateOnWorldAxis(yAxis, Math.PI/2);
    pivotLayer.children[5].position.x += -10.1;
    pivotLayer.children[5].position.z += -10.1;
    pivotLayer.children[5].rotateOnWorldAxis(yAxis, Math.PI/2);
    pivotLayer.children[6].position.x += 20.2;
    pivotLayer.children[6].rotateOnWorldAxis(yAxis, Math.PI/2);
    pivotLayer.children[7].position.x += 10.1;
    pivotLayer.children[7].position.z += -10.1;
    pivotLayer.children[7].rotateOnWorldAxis(yAxis, Math.PI/2);
    pivotLayer.children[8].position.z += -20.2;
    pivotLayer.children[8].rotateOnWorldAxis(yAxis, Math.PI/2);

    yAntiClockwiseIndexing(pivotLayer);
  }
  async function yDoubleTurn() {
    snapping = true;
    while (true) {
      let accel = pivotLayer.getWorldQuaternion(new THREE.Euler()).y * 0.15;
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(yAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;
    
    pivotLayer.children[0].position.z += 20.2;
    pivotLayer.children[0].position.x += 20.2;
    pivotLayer.children[0].rotateOnWorldAxis(yAxis, Math.PI);
    pivotLayer.children[1].position.z += 20.2;
    pivotLayer.children[1].rotateOnWorldAxis(yAxis, Math.PI);
    pivotLayer.children[2].position.x += -20.2;
    pivotLayer.children[2].position.z += 20.2;
    pivotLayer.children[2].rotateOnWorldAxis(yAxis, Math.PI);
    pivotLayer.children[3].position.x += 20.2;
    pivotLayer.children[3].rotateOnWorldAxis(yAxis, Math.PI);
    pivotLayer.children[4].rotateOnWorldAxis(yAxis, Math.PI);
    pivotLayer.children[5].position.x += -20.2;
    pivotLayer.children[5].rotateOnWorldAxis(yAxis, Math.PI);
    pivotLayer.children[6].position.x += 20.2;
    pivotLayer.children[6].position.z += -20.2;
    pivotLayer.children[6].rotateOnWorldAxis(yAxis, Math.PI);
    pivotLayer.children[7].position.z += -20.2;
    pivotLayer.children[7].rotateOnWorldAxis(yAxis, Math.PI);
    pivotLayer.children[8].position.z += -20.2;
    pivotLayer.children[8].position.x += -20.2;
    pivotLayer.children[8].rotateOnWorldAxis(yAxis, Math.PI);

    yDoubleTurnIndexing(pivotLayer);
  }
  async function yNoTurn() {
    snapping = true;
    let oldSign = Math.sign(pivotLayer.getWorldQuaternion(new THREE.Euler()).y);
    while (Math.sign(pivotLayer.getWorldQuaternion(new THREE.Euler()).y) == oldSign) {
      let accel = 0 - pivotLayer.getWorldQuaternion(new THREE.Euler()).y * 0.15;
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(yAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;
  }

  async function xClockwise() {
    snapping = true;
    while (pivotLayer.getWorldQuaternion(new THREE.Euler()).z !== -Math.PI) {
      let accel = (Math.PI/2 - Math.abs(pivotLayer.getWorldQuaternion(new THREE.Euler()).x)) * 0.15 * Math.sign(pivotLayer.getWorldQuaternion(new THREE.Euler()).x);
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(xAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;
    
    pivotLayer.children[0].position.y += 20.2;
    pivotLayer.children[0].rotateOnWorldAxis(xAxis, Math.PI/2);
    pivotLayer.children[1].position.y += 10.1;
    pivotLayer.children[1].position.z += 10.1;
    pivotLayer.children[1].rotateOnWorldAxis(xAxis, Math.PI/2);
    pivotLayer.children[2].position.z += 20.2;
    pivotLayer.children[2].rotateOnWorldAxis(xAxis, Math.PI/2);
    pivotLayer.children[3].position.y += 10.1;
    pivotLayer.children[3].position.z += -10.1;
    pivotLayer.children[3].rotateOnWorldAxis(xAxis, Math.PI/2);
    pivotLayer.children[4].rotateOnWorldAxis(xAxis, Math.PI/2);
    pivotLayer.children[5].position.y += -10.1;
    pivotLayer.children[5].position.z += 10.1;
    pivotLayer.children[5].rotateOnWorldAxis(xAxis, Math.PI/2);
    pivotLayer.children[6].position.z += -20.2;
    pivotLayer.children[6].rotateOnWorldAxis(xAxis, Math.PI/2);
    pivotLayer.children[7].position.y += -10.1;
    pivotLayer.children[7].position.z += -10.1;
    pivotLayer.children[7].rotateOnWorldAxis(xAxis, Math.PI/2);
    pivotLayer.children[8].position.y += -20.2;
    pivotLayer.children[8].rotateOnWorldAxis(xAxis, Math.PI/2);

    xClockwiseIndexing(pivotLayer);
  }
  async function xAntiClockwise() {
    snapping = true;
    while (pivotLayer.getWorldQuaternion(new THREE.Euler()).z !== -Math.PI) {
      let accel = (Math.PI/2 - Math.abs(pivotLayer.getWorldQuaternion(new THREE.Euler()).x)) * 0.15 * Math.sign(pivotLayer.getWorldQuaternion(new THREE.Euler()).x);
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(xAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;
    
    pivotLayer.children[0].position.z += 20.2;
    pivotLayer.children[0].rotateOnWorldAxis(xAxis, -(Math.PI/2));
    pivotLayer.children[1].position.y += -10.1;
    pivotLayer.children[1].position.z += 10.1;
    pivotLayer.children[1].rotateOnWorldAxis(xAxis, -(Math.PI/2));
    pivotLayer.children[2].position.y += -20.2;
    pivotLayer.children[2].rotateOnWorldAxis(xAxis, -(Math.PI/2));
    pivotLayer.children[3].position.y += 10.1;
    pivotLayer.children[3].position.z += 10.1;
    pivotLayer.children[3].rotateOnWorldAxis(xAxis, -(Math.PI/2));
    pivotLayer.children[4].rotateOnWorldAxis(xAxis, -(Math.PI/2));
    pivotLayer.children[5].position.y += -10.1;
    pivotLayer.children[5].position.z += -10.1;
    pivotLayer.children[5].rotateOnWorldAxis(xAxis, -(Math.PI/2));
    pivotLayer.children[6].position.y += 20.2;
    pivotLayer.children[6].rotateOnWorldAxis(xAxis, -(Math.PI/2));
    pivotLayer.children[7].position.y += 10.1;
    pivotLayer.children[7].position.z += -10.1;
    pivotLayer.children[7].rotateOnWorldAxis(xAxis, -(Math.PI/2));
    pivotLayer.children[8].position.z += -20.2;
    pivotLayer.children[8].rotateOnWorldAxis(xAxis, -(Math.PI/2));

    xAntiClockwiseIndexing(pivotLayer);
  }
  async function xDoubleTurn() {
    snapping = true;
    let oldSign = Math.sign(pivotLayer.getWorldQuaternion(new THREE.Euler()).x);
    while (true) {
      let accel = (Math.PI - Math.abs(pivotLayer.getWorldQuaternion(new THREE.Euler()).x)) * 0.15 * oldSign;
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(xAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;
    
    pivotLayer.children[0].position.z += 20.2;
    pivotLayer.children[0].position.y += 20.2;
    pivotLayer.children[0].rotateOnWorldAxis(xAxis, Math.PI);
    pivotLayer.children[1].position.z += 20.2;
    pivotLayer.children[1].rotateOnWorldAxis(xAxis, Math.PI);
    pivotLayer.children[2].position.y += -20.2;
    pivotLayer.children[2].position.z += 20.2;
    pivotLayer.children[2].rotateOnWorldAxis(xAxis, Math.PI);
    pivotLayer.children[3].position.y += 20.2;
    pivotLayer.children[3].rotateOnWorldAxis(xAxis, Math.PI);
    pivotLayer.children[4].rotateOnWorldAxis(xAxis, Math.PI);
    pivotLayer.children[5].position.y += -20.2;
    pivotLayer.children[5].rotateOnWorldAxis(xAxis, Math.PI);
    pivotLayer.children[6].position.y += 20.2;
    pivotLayer.children[6].position.z += -20.2;
    pivotLayer.children[6].rotateOnWorldAxis(xAxis, Math.PI);
    pivotLayer.children[7].position.z += -20.2;
    pivotLayer.children[7].rotateOnWorldAxis(xAxis, Math.PI);
    pivotLayer.children[8].position.z += -20.2;
    pivotLayer.children[8].position.y += -20.2;
    pivotLayer.children[8].rotateOnWorldAxis(xAxis, Math.PI);

    xDoubleTurnIndexing(pivotLayer);
  }
  async function xNoTurn() {
    snapping = true;
    while (true) {
      let accel = 0 - pivotLayer.getWorldQuaternion(new THREE.Euler()).x * 0.15;
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(xAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;
  }
  
  async function zClockwise() {
    snapping = true;
    while (true) {
      let accel = (Math.PI/2 - Math.abs(pivotLayer.getWorldQuaternion(new THREE.Euler()).z)) * 0.15 * Math.sign(pivotLayer.getWorldQuaternion(new THREE.Euler()).z);
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(zAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;
    
    pivotLayer.children[0].position.x += 20.2;
    pivotLayer.children[0].rotateOnWorldAxis(zAxis, -(Math.PI/2));
    pivotLayer.children[1].position.y += -10.1;
    pivotLayer.children[1].position.x += 10.1;
    pivotLayer.children[1].rotateOnWorldAxis(zAxis, -(Math.PI/2));
    pivotLayer.children[2].position.y += -20.2;
    pivotLayer.children[2].rotateOnWorldAxis(zAxis, -(Math.PI/2));
    pivotLayer.children[3].position.y += 10.1;
    pivotLayer.children[3].position.x += 10.1;
    pivotLayer.children[3].rotateOnWorldAxis(zAxis, -(Math.PI/2));
    pivotLayer.children[4].rotateOnWorldAxis(zAxis, -(Math.PI/2));
    pivotLayer.children[5].position.y += -10.1;
    pivotLayer.children[5].position.x += -10.1;
    pivotLayer.children[5].rotateOnWorldAxis(zAxis, -(Math.PI/2));
    pivotLayer.children[6].position.y += 20.2;
    pivotLayer.children[6].rotateOnWorldAxis(zAxis, -(Math.PI/2));
    pivotLayer.children[7].position.y += 10.1;
    pivotLayer.children[7].position.x += -10.1;
    pivotLayer.children[7].rotateOnWorldAxis(zAxis, -(Math.PI/2));
    pivotLayer.children[8].position.x += -20.2;
    pivotLayer.children[8].rotateOnWorldAxis(zAxis, -(Math.PI/2));

    zClockwiseIndexing(pivotLayer);
  }
  async function zAntiClockwise() {
    snapping = true;
    while (true) {
      let accel = (Math.PI/2 - Math.abs(pivotLayer.getWorldQuaternion(new THREE.Euler()).z)) * 0.15 * Math.sign(pivotLayer.getWorldQuaternion(new THREE.Euler()).z);
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(zAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;
    
    pivotLayer.children[0].position.y += -20.2;
    pivotLayer.children[0].rotateOnWorldAxis(zAxis, Math.PI/2);
    pivotLayer.children[1].position.y += -10.1;
    pivotLayer.children[1].position.x += -10.1;
    pivotLayer.children[1].rotateOnWorldAxis(zAxis, Math.PI/2);
    pivotLayer.children[2].position.x += -20.2;
    pivotLayer.children[2].rotateOnWorldAxis(zAxis, Math.PI/2);
    pivotLayer.children[3].position.y += -10.1;
    pivotLayer.children[3].position.x += 10.1;
    pivotLayer.children[3].rotateOnWorldAxis(zAxis, Math.PI/2);
    pivotLayer.children[4].rotateOnWorldAxis(zAxis, Math.PI/2);
    pivotLayer.children[5].position.y += 10.1;
    pivotLayer.children[5].position.x += -10.1;
    pivotLayer.children[5].rotateOnWorldAxis(zAxis, Math.PI/2);
    pivotLayer.children[6].position.x += 20.2;
    pivotLayer.children[6].rotateOnWorldAxis(zAxis, Math.PI/2);
    pivotLayer.children[7].position.y += 10.1;
    pivotLayer.children[7].position.x += 10.1;
    pivotLayer.children[7].rotateOnWorldAxis(zAxis, Math.PI/2);
    pivotLayer.children[8].position.y += 20.2;
    pivotLayer.children[8].rotateOnWorldAxis(zAxis, Math.PI/2);

    zAntiClockwiseIndexing(pivotLayer);
  }
  async function zDoubleTurn() {
    snapping = true;
    let oldSign = Math.sign(pivotLayer.getWorldQuaternion(new THREE.Euler()).z);
    while (true) {
      let accel = (Math.PI - Math.abs(pivotLayer.getWorldQuaternion(new THREE.Euler()).z)) * 0.15 * oldSign;
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(zAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;
    
    pivotLayer.children[0].position.x += 20.2;
    pivotLayer.children[0].position.y += -20.2;
    pivotLayer.children[0].rotateOnWorldAxis(zAxis, Math.PI);
    pivotLayer.children[1].position.y += -20.2;
    pivotLayer.children[1].rotateOnWorldAxis(zAxis, Math.PI);
    pivotLayer.children[2].position.y += -20.2;
    pivotLayer.children[2].position.x += -20.2;
    pivotLayer.children[2].rotateOnWorldAxis(zAxis, Math.PI);
    pivotLayer.children[3].position.x += 20.2;
    pivotLayer.children[3].rotateOnWorldAxis(zAxis, Math.PI);
    pivotLayer.children[4].rotateOnWorldAxis(zAxis, Math.PI);
    pivotLayer.children[5].position.x += -20.2;
    pivotLayer.children[5].rotateOnWorldAxis(zAxis, Math.PI);
    pivotLayer.children[6].position.y += 20.2;
    pivotLayer.children[6].position.x += 20.2;
    pivotLayer.children[6].rotateOnWorldAxis(zAxis, Math.PI);
    pivotLayer.children[7].position.y += 20.2;
    pivotLayer.children[7].rotateOnWorldAxis(zAxis, Math.PI);
    pivotLayer.children[8].position.x += -20.2;
    pivotLayer.children[8].position.y += 20.2;
    pivotLayer.children[8].rotateOnWorldAxis(zAxis, Math.PI);

    zDoubleTurnIndexing(pivotLayer);
  }
  async function zNoTurn() {
    snapping = true;
    while (true) {
      let accel = 0 - pivotLayer.getWorldQuaternion(new THREE.Euler()).z * 0.15;
      if (Math.abs(accel) < 0.005) break;
      pivotLayer.rotateOnWorldAxis(zAxis, accel);
      await timer(10);
    }
    pivotLayer.rotation.set(0, 0, 0);
    snapping = false;
  }
}

function yClockwiseIndexing(pivotLayer) {
  pivotLayer.children.forEach(child => {
    child = getElementByPropertyValue(cubicles, "object", child);
    let sideOrder = [];
    for (let i = 0; i < 6; i++) sideOrder.push(child.sides.findIndex(side => side.index === i));
    
    let tempIdx = child.sides[sideOrder[4]].index;
    child.sides[sideOrder[4]].index = child.sides[sideOrder[3]].index;
    child.sides[sideOrder[3]].index = child.sides[sideOrder[2]].index;
    child.sides[sideOrder[2]].index = child.sides[sideOrder[1]].index;
    child.sides[sideOrder[1]].index = tempIdx;
  })
}
function yAntiClockwiseIndexing(pivotLayer) {
  pivotLayer.children.forEach(child => {
    child = getElementByPropertyValue(cubicles, "object", child);
    let sideOrder = [];
    for (let i = 0; i < 6; i++) sideOrder.push(child.sides.findIndex(side => side.index === i));
    
    let tempIdx = child.sides[sideOrder[4]].index;
    child.sides[sideOrder[4]].index = child.sides[sideOrder[1]].index;
    child.sides[sideOrder[1]].index = child.sides[sideOrder[2]].index;
    child.sides[sideOrder[2]].index = child.sides[sideOrder[3]].index;
    child.sides[sideOrder[3]].index = tempIdx;
  })
}
function yDoubleTurnIndexing(pivotLayer) {
  pivotLayer.children.forEach(child => {
    child = getElementByPropertyValue(cubicles, "object", child);
    let sideOrder = [];
    for (let i = 0; i < 6; i++) sideOrder.push(child.sides.findIndex(side => side.index === i));
    
    let tempIdx = child.sides[sideOrder[1]].index;
    child.sides[sideOrder[1]].index = child.sides[sideOrder[3]].index;
    child.sides[sideOrder[3]].index = tempIdx;
    tempIdx = child.sides[sideOrder[2]].index;
    child.sides[sideOrder[2]].index = child.sides[sideOrder[4]].index;
    child.sides[sideOrder[4]].index = tempIdx;
  })
}

function xClockwiseIndexing(pivotLayer) {
  pivotLayer.children.forEach(child => {
    child = getElementByPropertyValue(cubicles, "object", child);
    let sideOrder = [];
    for (let i = 0; i < 6; i++) sideOrder.push(child.sides.findIndex(side => side.index === i));
      
    let tempIdx = child.sides[sideOrder[0]].index;
    child.sides[sideOrder[0]].index = child.sides[sideOrder[2]].index;
    child.sides[sideOrder[2]].index = child.sides[sideOrder[5]].index;
    child.sides[sideOrder[5]].index = child.sides[sideOrder[4]].index;
    child.sides[sideOrder[4]].index = tempIdx;
  })
}
function xAntiClockwiseIndexing(pivotLayer) {
  pivotLayer.children.forEach(child => {
    child = getElementByPropertyValue(cubicles, "object", child);
    let sideOrder = [];
    for (let i = 0; i < 6; i++) sideOrder.push(child.sides.findIndex(side => side.index === i));
    
    let tempIdx = child.sides[sideOrder[0]].index;
    child.sides[sideOrder[0]].index = child.sides[sideOrder[4]].index;
    child.sides[sideOrder[4]].index = child.sides[sideOrder[5]].index;
    child.sides[sideOrder[5]].index = child.sides[sideOrder[2]].index;
    child.sides[sideOrder[2]].index = tempIdx;
  })
}
function xDoubleTurnIndexing(pivotLayer) {
  pivotLayer.children.forEach(child => {
    child = getElementByPropertyValue(cubicles, "object", child);
    let sideOrder = [];
    for (let i = 0; i < 6; i++) sideOrder.push(child.sides.findIndex(side => side.index === i));
    
    let tempIdx = child.sides[sideOrder[0]].index;
    child.sides[sideOrder[0]].index = child.sides[sideOrder[5]].index;
    child.sides[sideOrder[5]].index = tempIdx;
    tempIdx = child.sides[sideOrder[2]].index;
    child.sides[sideOrder[2]].index = child.sides[sideOrder[4]].index;
    child.sides[sideOrder[4]].index = tempIdx;
  })
}

function zClockwiseIndexing(pivotLayer) {
  pivotLayer.children.forEach(child => {
    child = getElementByPropertyValue(cubicles, "object", child);
    let sideOrder = [];
    for (let i = 0; i < 6; i++) sideOrder.push(child.sides.findIndex(side => side.index === i));
      
    let tempIdx = child.sides[sideOrder[0]].index;
    child.sides[sideOrder[0]].index = child.sides[sideOrder[3]].index;
    child.sides[sideOrder[3]].index = child.sides[sideOrder[5]].index;
    child.sides[sideOrder[5]].index = child.sides[sideOrder[1]].index;
    child.sides[sideOrder[1]].index = tempIdx;
  })
}
function zAntiClockwiseIndexing(pivotLayer) {
  pivotLayer.children.forEach(child => {
    child = getElementByPropertyValue(cubicles, "object", child);
    let sideOrder = [];
    for (let i = 0; i < 6; i++) sideOrder.push(child.sides.findIndex(side => side.index === i));
      
    let tempIdx = child.sides[sideOrder[0]].index;
    child.sides[sideOrder[0]].index = child.sides[sideOrder[1]].index;
    child.sides[sideOrder[1]].index = child.sides[sideOrder[5]].index;
    child.sides[sideOrder[5]].index = child.sides[sideOrder[3]].index;
    child.sides[sideOrder[3]].index = tempIdx;
  })
}
function zDoubleTurnIndexing(pivotLayer) {
  pivotLayer.children.forEach(child => {
    child = getElementByPropertyValue(cubicles, "object", child);
    let sideOrder = [];
    for (let i = 0; i < 6; i++) sideOrder.push(child.sides.findIndex(side => side.index === i));
    
    let tempIdx = child.sides[sideOrder[0]].index;
    child.sides[sideOrder[0]].index = child.sides[sideOrder[5]].index;
    child.sides[sideOrder[5]].index = tempIdx;
    tempIdx = child.sides[sideOrder[1]].index;
    child.sides[sideOrder[1]].index = child.sides[sideOrder[3]].index;
    child.sides[sideOrder[3]].index = tempIdx;
  })
}

animate();