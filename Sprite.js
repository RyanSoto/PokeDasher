class Sprite {
  constructor(config) {

    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    //Shadow
    this.shadow = new Image();
    this.useShadow = config.useShadow || false
    if (this.useShadow) {
      this.shadow.src = "./images/characters/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    //Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down"  : [ [0,0] ],
      "idle-right" : [ [0,1] ],
      "idle-up"    : [ [0,2] ],
      "idle-left"  : [ [0,3] ],
      "walk-down"  : [ [1,0],[0,0],[3,0],[0,0], ],
      "walk-right" : [ [1,1],[0,1],[3,1],[0,1], ],
      "walk-up"    : [ [1,2],[0,2],[3,2],[0,2], ],
      "walk-left"  : [ [1,3],[0,3],[3,3],[0,3], ],
      "bike-down"  : [ [1,5],[0,5],[3,5],[0,5], ],
      "bike-right" : [ [1,6],[0,6],[3,6],[0,6], ],
      "bike-up"    : [ [1,7],[0,7],[3,7],[0,7], ],
      "bike-left"  : [ [1,8],[0,8],[3,8],[0,8], ],
      "bidle-down" : [ [0,5] ],
      "bidle-right": [ [0,6] ],
      "bidle-up"   : [ [0,7] ],
      "bidle-left" : [ [0,8] ],
      "drink-down" : [ [1,4],[1,4],[2,4],[2,4],[3,4],[3,4],[0,0],[0,0] ],

    }
    this.currentAnimation = config.currentAnimation || "idle-down"; // config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 12;
    this.animationFrameProgress = this.animationFrameLimit;
    

    //Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0
    }


  }
  

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x - 8 + utils.withGrid(10) - cameraPerson.x;
    const y = this.gameObject.y - 10 + utils.withGrid(5.5) - cameraPerson.y;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);


    const [frameX, frameY] = this.frame;

    this.isLoaded && ctx.drawImage(this.image,
      frameX * 32, frameY * 32,
      32,32,
      x,y,
      32,32
    )

    this.updateAnimationProgress();
  }

}