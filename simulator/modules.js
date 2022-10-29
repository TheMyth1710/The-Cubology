class Cubicle {
    constructor (i) {
      this.object = new THREE.Group();
      this.sides = [];
      this.cubeLayers = [];
      this.cubeLayers2 = [];
      this.pieceType = -1;
      for (let j = 0; j < 6; j++) {
        const cubicleSide = new THREE.Mesh(sideGeometry, new THREE.MeshStandardMaterial({
          side: THREE.DoubleSide,
          color: 0x000000,
        }));
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(sideGeometry), new THREE.LineBasicMaterial({
          color: 0x000000,
          linewidth: 3,
        }));
        cubicleSide.add(edges);
        cubicleSide.index = j;
        cubicleSide.isRubikSide = true;
        this.sides.push(cubicleSide);
        this.object.add(cubicleSide);
      }
      if (idxCount % 2 == 0) {
        this.pieceType = temp + 0;
      } else {
        this.pieceType = temp + 1;
      }
      if (idxCount == 4) {
        this.pieceType = temp + 2;
      }
      this.index = idxCount;
  
      this.object.position.set(0, 0, 0);
    
      if (this.index < 3) {
        this.object.translateZ(-10.1);
        this.cubeLayers.push(4);
        this.cubeLayers2.push(4);
        this.sides[4].index = 4;
      } else if (this.index > 5) {
        this.object.translateZ(10.1);
        this.cubeLayers.push(2);
        this.cubeLayers2.push(2);
        this.sides[2].index = 2;
      }
      
      if (this.index % 3 == 0) {
        this.object.translateX(-10.1);
        this.cubeLayers.push(1);
        this.cubeLayers2.push(1);
        this.sides[1].index = 1;
      } else if (this.index % 3 == 2) {
        this.object.translateX(10.1);
        this.cubeLayers.push(3);
        this.cubeLayers2.push(3);
        this.sides[3].index = 3;
      }
    
      if (i < 9) {
        this.object.translateY(10.1);
        this.cubeLayers.push(0);
        this.cubeLayers2.push(0);
        this.sides[0].index = 0;
      } else if (i > 17) {
        this.object.translateY(-10.1);
        this.cubeLayers.push(5);
        this.cubeLayers2.push(5);
        this.sides[5].index = 5;
      }
    
      this.sides.forEach(side => {
        side.position.set(0, 0, 0);
        switch(side.index) {
          case 0:
            side.rotation.x = THREE.Math.degToRad(-90);
            if (this.cubeLayers.indexOf(0) !== -1) {
              side.material.color.setHex(0xffffff);
            }
            break;
          case 1:
            side.rotation.y = THREE.Math.degToRad(-90);
            if (this.index % 3 == 0) {
                side.material.color.setHex(0xff5800); // Orange
            }
            break;
          case 2:
            if (this.index > 5) {
                side.material.color.setHex(0x009b48); // Green
            }
            break;
          case 3:
            side.rotation.y = THREE.Math.degToRad(90);
            if (this.index % 3 == 2) {
                side.material.color.setHex(0xb71234); // Red
            }
            break;
          case 4:
            side.rotation.y = THREE.Math.degToRad(-180);
            if (this.index < 3) {
                side.material.color.setHex(0x0046ad); // Blue
            }
            break;
          case 5:
            side.rotation.x = THREE.Math.degToRad(90);
            if (this.cubeLayers.indexOf(5) !== -1) {
              side.material.color.setHex(0xffd500); // Yellow
            }
            break;
        }
        side.translateZ(5);
      })
    }
  }
  
  function getElementByPropertyValue(array, property, value) {
    return array[array.map(function(e) {
      return e[property]
    }).indexOf(value)];
  }
  
  function roundVec(vector, decimals) {
    if (vector.constructor.name === 'Vector3') {
      return new THREE.Vector3(Number(vector.x.toFixed(decimals)), Number(vector.y.toFixed(decimals)), Number(vector.z.toFixed(decimals)));
    } else if (vector.constructor.name === 'Euler') {
      return new THREE.Euler(Number(vector.x.toFixed(decimals)), Number(vector.y.toFixed(decimals)), Number(vector.z.toFixed(decimals)), 'XYZ');
    }
  }
  
  
  async function turnFace(face, direction) {
    switch (direction) {
      case 1: case 90: case -1: case -90: case 2: case 180: break;
      default: return;
    }
    if (typeof face !== "string") {
      if (typeof face === "number") {
        pivotSide = face;
        switch (face) {
            case 1:
                face = "topLayer";
                break;
            case 2:
                face = "frontLayer";
                break;
            case 3:
                face = "rightLayer";
                break;
            case 4:
                face = "backLayer";
                break;
            case 5:
                face = "leftLayer";
                break;
            case 6:
                face = "bottomLayer";
                break;
        }
      } else {
        face = face.name;
      }
    }
    if (typeof face === "string") {
      switch (face) {
        case "topLayer": {
          pivotSide = 0;
          break;
        }
        case "leftLayer": {
          pivotSide = 1;
          break;
        }
        case "frontLayer": {
          pivotSide = 2;
          break;
        }
        case "rightLayer": {
          pivotSide = 3;
          break;
        }
        case "backLayer": {
          pivotSide = 4;
          break;
        }
        case "bottomLayer": {
          pivotSide = 5;
          break;
        }
      }
    }
  
    getPivotSide(null, null, true);
  
    switch (direction) {
      case 90: {
        direction = 1;
        break;
      }
      case -90: {
        direction = -1;
        break;
      }
      case 180: {
        direction = 2;
        break;
      }
    }
    
    switch(pivotSide) {
      case 0: {
        await animateFaceTurn(topLayer, -direction, yAxis);
        await snap();
        while (topLayer.children.length > 0) {
          const tempHold = topLayer.children[0];
          topLayer.remove(tempHold);
          tempHold.position.y = 10.1;
          scene.add(tempHold);
        }
        topLayer.rotation.set(0, 0, 0);
        break;
      }
      case 5: {
        await animateFaceTurn(bottomLayer, -direction, yAxis);
        await snap();
        while (bottomLayer.children.length > 0) {
          const tempHold = bottomLayer.children[0];
          bottomLayer.remove(tempHold);
          tempHold.position.y = -10.1;
          scene.add(tempHold);
        }
        bottomLayer.rotation.set(0, 0, 0);
        break;
      }
      case 1: {
        await animateFaceTurn(leftLayer, direction, xAxis);
        await snap();
        while (leftLayer.children.length > 0) {
          const tempHold = leftLayer.children[0];
          leftLayer.remove(tempHold);
          tempHold.position.x = -10.1;
          scene.add(tempHold);
        }
        leftLayer.rotation.set(0, 0, 0);
        break;
      }
      case 3: {
        await animateFaceTurn(rightLayer, -direction, xAxis);
        await snap();
        while (rightLayer.children.length > 0) {
          const tempHold = rightLayer.children[0];
          rightLayer.remove(tempHold);
          tempHold.position.x = 10.1;
          scene.add(tempHold);
        }
        rightLayer.rotation.set(0, 0, 0);
        break;
      }
      case 2: {
        await animateFaceTurn(frontLayer, -direction, zAxis);
        await snap();
        while (frontLayer.children.length > 0) {
          const tempHold = frontLayer.children[0];
          frontLayer.remove(tempHold);
          tempHold.position.z = 10.1;
          scene.add(tempHold);
        }
        frontLayer.rotation.set(0, 0, 0);
        break;
      }
      case 4: {
        await animateFaceTurn(backLayer, direction, zAxis);
        await snap();
        while (backLayer.children.length > 0) {
          const tempHold = backLayer.children[0];
          backLayer.remove(tempHold);
          tempHold.position.z = -10.1;
          scene.add(tempHold);
        }
        backLayer.rotation.set(0, 0, 0);
        break;
      }
    }
  }
  
  async function animateFaceTurn(faceObject, direction, axis) {
    snapping = true;
    let accel = 0;
    for (let i = 0; i < 25; i++) {
      if (i < 13) {
        accel += (Math.PI * direction)/338;
      } else {
        accel -= (Math.PI * direction)/338;
      }
      faceObject.rotateOnWorldAxis(axis, accel);
      await timer(7);
    }
    snapping = false;
  }