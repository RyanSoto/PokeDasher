class Hero extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isStanding = false;
    this.intentPosition = null; // [x,y]
    this.speed = 1
    this.isBiking = config.isBiking || null;
    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      "up": ["y", -this.speed],
      "down": ["y", this.speed],
      "left": ["x", -this.speed],
      "right": ["x", this.speed],
    }

  }

  toggleBike() {

    this.isBiking === true;
    console.log("toggle Biking")
    this.updateSprite(this.isBiking == true)
    }



  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {

      //More cases for starting to walk will come here
      //
      //

      //Case: We're keyboard ready and have an arrow pressed
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow
        })
      }
      this.updateSprite(state);
    }
  }

  startBehavior(state, behavior) {

    if (!this.isMounted) {
      return;
    }

    //Set character direction to whatever behavior has
    this.direction = behavior.direction;
    
    if (behavior.type === "walk") {
      //Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {

        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior)
        }, 10);

        return;
      }

      //Ready to walk!
      this.movingProgressRemaining = 16;

      //Add next position intent
      const intentPosition = utils.nextPosition(this.x,this.y, this.direction)
      this.intentPosition = [
        intentPosition.x,
        intentPosition.y,
      ]
      this.updateSprite(state);
    }

    if (behavior.type === "stand") {
      this.isStanding = true;
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id
        })
        this.isStanding = false;
      }, behavior.time)
    }

  }

  updatePosition() {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;

      if (this.movingProgressRemaining === 0) {
        //We finished the walk!
        this.intentPosition = null;
        utils.emitEvent("PersonWalkingComplete", {
          whoId: this.id
        })

      }
  }

  // this.keyB = new KeyPressListener("KeyB", () =>{
  //   this.isBiking = false;
  //   console.log("not biking")
  //   this.keyB?.unbind();
  // })

  updateSprite() {
    new KeyPressListener("KeyB", () => {
      this.isBiking = true;
      console.log("bike on")
    })
    new KeyPressListener("KeyN", () => {
      this.isBiking = false;
      console.log("bike off")
    })
    if (this.movingProgressRemaining > 0 && this.isBiking == true) {
      this.speed = 2
      this.directionUpdate = {
        "up": ["y", -this.speed],
        "down": ["y", this.speed],
        "left": ["x", -this.speed],
        "right": ["x", this.speed],
      }
    this.sprite.setAnimation("bike-"+this.direction);
    return;
    } else if (this.isBiking == true) {
       this.sprite.setAnimation("bidle-"+this.direction); 
    }   
    else if (this.movingProgressRemaining > 0 && (this.isBiking == false || this.isBiking == null)) {
      this.speed = 1
      this.directionUpdate = {
        "up": ["y", -this.speed],
        "down": ["y", this.speed],
        "left": ["x", -this.speed],
        "right": ["x", this.speed],
      }
      this.sprite.setAnimation("walk-"+this.direction);
      return;
    }
    else if (this.isBiking == false || this.isBiking == null) {
      this.sprite.setAnimation("idle-"+this.direction);   
      return;
    } 
  }
}