const utils = {
  withGrid(n) {
    return n * 16;
  },
  asGridCoord(x,y) {
    return `${x*16},${y*16}`
  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;
    const size = 16;
    if (direction === "left") { 
      x -= size;
    } else if (direction === "right") {
      x += size;
    } else if (direction === "up") {
      y -= size;
    } else if (direction === "down") {
      y += size;
    }
    return {x,y};
  },
  oppositeDirection(direction) {
    if (direction === "left") { return "right" }
    if (direction === "right") { return "left" }
    if (direction === "up") { return "down" }
    return "up"
  },
  wait(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  },
  emitEvent(name, detail) {
    const event = new CustomEvent(name, {
      detail
    });
    document.dispatchEvent(event);
  },
  collisionDetection(collisionArray) {
    const collisionsMap = [];
    for (let i = 0; i < collisionArray.length; i += 128) {
      collisionsMap.push(collisionArray.slice(i, 128 + i))
    };
    // console.log({collisionsMap})
    let coordinates = [];
    for (let i = 0; i < collisionsMap.length; i++) {
      const row = collisionsMap[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] !== 0) {
          coordinates = { ...coordinates, [utils.asGridCoord(j - 10, i - 6)] : true}
        }
      }
    }
    // console.log({coordinates});
    return coordinates;
  }  
}