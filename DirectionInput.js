class DirectionInput {
  constructor() {
    this.heldDirections = [];
    // this.element = config.element;
    // this.canvas = this.element.querySelector(".game-canvas");

    this.map = {
      "ArrowUp": "up",
      "KeyW": "up",
      "ArrowDown": "down",
      "KeyS": "down",
      "ArrowLeft": "left",
      "KeyA": "left",
      "ArrowRight": "right",
      "KeyD": "right",

    }
  }

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener("keydown", e => {
      const dir = this.map[e.code];

      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    });

    document.addEventListener("keyup", e => {
      const dir = this.map[e.code];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    })
    
    document.addEventListener("touchstart", e => {
      // document.addEventListener("touchstart", e => {
        e.preventDefault();
        e.stopImmediatePropagation()
        const touch = e.changedTouches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        const dir = calculateDirection(x, y);
        
        if (dir && this.heldDirections.indexOf(dir) === -1) {
          this.heldDirections.unshift(dir);
        }
         
      });

    document.addEventListener("touchend", e => {
      // const dir = this.map[e.code];
        e.preventDefault();
        e.stopImmediatePropagation()
        const touch = e.changedTouches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        const dir = calculateDirection(x, y);
        const index = this.heldDirections.indexOf(dir);
        if (index > -1) {
          this.heldDirections.splice(index, 1);
        }
        console.log('touchend', x , y)
      });
      
    function calculateDirection(x, y) {
      // Calculate the direction based on the touch coordinates
      // Implement your logic here
      // Return the direction (e.g., "up", "down", "left", "right")
      if (x > 760 && y > 100) {
        return "right";
      }
      
      if (x < 760 && y > 200) {
        return "left";
      }
      
      if (x > 700 && y > 400) {
        return "down";
      }
      
      if (x < 1200 && y < 400) {
        return "up";
      }
      
      // return "right";
      
      
    }
      
      
      // function touchHandler(e) {
        //   if (e.touches) {
          //     let playerX = null
          //     let playerY = null
          //     playerX = e.touches.clientY - 16 / 2;
          //     playerY = e.touches.clientX - 16 / 2;
          //     console.log(`Touch:\nx: ${playerX}, y: ${playerY}`);
          //     e.preventDefault();
          //   }
          // }
          
        }
}