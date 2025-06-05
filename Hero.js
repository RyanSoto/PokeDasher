class Hero extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isStanding = false;
    this.isDrinking = false;
    this.intentPosition = null; // [x,y]
    this.speed = 1
    this.isBiking = false;
    this.isPlayerControlled = config.isPlayerControlled || false;
    this.standBehaviorTimeout;
    this.directionUpdate = {
      "up": ["y", -this.speed],
      "down": ["y", this.speed],
      "left": ["x", -this.speed],
      "right": ["x", this.speed],
    }
    this.standDrinkTimeout;

    new KeyPressListener("KeyB", () => {
      if (this.movingProgressRemaining === 0 && playerState.storyFlags["BIKE"]) {
        if (this.isBiking) {
          this.isBiking = false;
          this.speed = 1;
          this.directionUpdate = {
            "up": ["y", -this.speed],
            "down": ["y", this.speed],
            "left": ["x", -this.speed],
            "right": ["x", this.speed],
          };
        } else {
          this.isBiking = true;
          this.speed = 4;
          this.directionUpdate = {
            "up": ["y", -this.speed],
            "down": ["y", this.speed],
            "left": ["x", -this.speed],
            "right": ["x", this.speed],
          };
        }
      }
    });

    new KeyPressListener("KeyY", () => {
      if (this.movingProgressRemaining === 0) {
        if (this.isBiking) {
          this.isBiking = false;
          this.speed = 1;
          this.directionUpdate = {
            "up": ["y", -this.speed],
            "down": ["y", this.speed],
            "left": ["x", -this.speed],
            "right": ["x", this.speed],
          };
        } else {
          this.isBiking = true;
          this.speed = 4;
          this.directionUpdate = {
            "up": ["y", -this.speed],
            "down": ["y", this.speed],
            "left": ["x", -this.speed],
            "right": ["x", this.speed],
          };
        }
      }
    });


  }



  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
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

  // Exhaustion
  exhaustionChecker(state) {
      // if (playerState.players.p1.enr <= 0 && playerState.storyFlags[this.storyFlag = "DEATH"]) {
      // // state.map.isPaused = true

      //   state.map.startCutscene([
      //     { type: "shoutMessage", text:"You're took too much damage!"} , 
      //     { type: "shoutMessage", text:"Time to call it a day."} , 
      //     // { type: "addStoryFlag", flag: "EXHAUSTED" },
      //     { type: "sleep"},
      //     // { type: "removeStoryFlag", flag: "EXHAUSTED" },
      //     { type: "changeMap", map: "Starville", 
      //           x: utils.withGrid(12),
      //           y: utils.withGrid(21),
      //           direction: "down"
      //         },
      //     { type: "textMessage", text:"You slept like a rock!"}, 
      //     ])
      //   }


    if (playerState.players.p1.enr <= 0 && !playerState.storyFlags[this.storyFlag = "DEATH"]) {
    // state.map.isPaused = true

    state.map.startCutscene([
      { type: "shoutMessage", text:"You're exhausted!"} , 
      { type: "shoutMessage", text:"Time to call it a day."} , 
      // { type: "addStoryFlag", flag: "EXHAUSTED" },
      { type: "sleep"},
      // { type: "removeStoryFlag", flag: "EXHAUSTED" },
      { type: "changeMap", map: "Starville", 
            x: utils.withGrid(12),
            y: utils.withGrid(21),
            direction: "down"
          },
      { type: "textMessage", text:"You slept like a rock!"}, 
      ])
    }
    // state.map.isPaused = false
    
  }

  energyDrainer() {
    // Function to drain energy over time
    this.energyDrainer = () => {
      if (playerState.players.p1.enr >= 0) {
        playerState.players.p1.enr -= 0.1; // Drain energy by 0.1 every second
        utils.emitEvent("PlayerStateUpdated");
      }
    };
  }

  startBehavior(state, behavior) {
    this.exhaustionChecker(state)

    if (!this.isMounted) {
      return;
    }

    this.energyDrainer()

    //Set character direction to whatever behavior has
    this.direction = behavior.direction;
   
    if (behavior.type === "walk") {
      // Bump if on bike and space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction) && this.isBiking === true) {

        this.bikeBump(state)
        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior)
        }, 10);
        return;
      }
      //Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
       
          behavior.retry && setTimeout(() => {
            this.startBehavior(state, behavior)
          }, 10);
          return;
        
      }

      //Ready to walk or bike!
  
      if (this.isBiking === true) {
        this.movingProgressRemaining = 4; //speed 2 : 4 speed 4 : 4
      } else {
      this.movingProgressRemaining = 16;}
      
      
      
      //Add next position intent
      const intentPosition = utils.nextPosition(this.x,this.y, this.direction)
      this.intentPosition = [
        intentPosition.x,
        intentPosition.y,
      ]

      this.updateSprite(state);
    }

    if (behavior.type === "bump") {

      //Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        
          behavior.retry && setTimeout(() => {
            this.startBehavior(state, behavior)
          }, 10);
          return;
        
      }

      //Ready to walk or bike!
  
      if (this.isBiking === true) {
        this.movingProgressRemaining = 4; //speed 2 : 4 speed 4 : 4
      } else {
      this.movingProgressRemaining = 8;}
      
      
      // window.playerState.players.p1.enr -= 1;
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
      
      if (this.standBehaviorTimeout) {
        clearTimeout(this.standBehaviorTimeout);
      }
      this.standBehaviorTimeout = setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id
        })
        this.isStanding = false;
      }, behavior.time)
    }

    if (behavior.type === "drink") {
      this.isDrinking = true;
      this.drinkUp();
      if (this.standDrinkTimeout) {
        clearTimeout(this.standDrinkTimeout);
      }
      this.standDrinkTimeout = setTimeout(() => {
        utils.emitEvent("PersonDrinkComplete", {
          whoId: this.id
        })
        this.isDrinking = false;
      }, behavior.time)
      this.updateSprite();
    }

  }

  bikeBump(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      //Case: We're keyboard ready and have an arrow pressed
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow == "right") {
        this.startBehavior(state, {
          type: "bump",
          direction: "left"
        })
      }
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow == "left") {
        this.startBehavior(state, {
          type: "bump",
          direction: "right"
        })
      }
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow == "up") {
        this.startBehavior(state, {
          type: "bump",
          direction: "down"
        })
      }
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow == "down") {
        this.startBehavior(state, {
          type: "bump",
          direction: "up"
        })
      }
      playerState.players.p1.enr -= 10;
      utils.emitEvent("PlayerStateUpdated"); 
      if (playerState.players.p1.enr > 0 && !playerState.storyFlags[this.storyFlag == "DEATH"]) {
      state.map.startCutscene([
        { type: "textMessage", text:"Oof!"} ,
      ])
    }
      if (playerState.players.p1.enr <= 0) {

        state.map.startCutscene([
          { type: "addStoryFlag", flag: "DEATH" },
          { type: "shoutMessage", text:"Too much damage!"} , 
          { type: "shoutMessage", text:"You're done!"} , 
          { type: "textMessage", text:"You will pay $50 for treatment at the hospital."},
          { type: "changeMap", map: "Starville", 
              x: utils.withGrid(73),
              y: utils.withGrid(43),
              direction: "down"
            },
          { type: "removeStoryFlag", flag: "DEATH" },
          { type: "death"},
        ])
      }


      this.updateSprite(state);
    }
  }

  drinkUp() {
    if ((playerState.players.p1.enr + 50) >= playerState.players.p1.maxEnr) {
    playerState.players.p1.enr = playerState.players.p1.maxEnr;
    playerState.players.p1.drinks -= 1;
    utils.emitEvent("PlayerStateUpdated"); 
    return
    }
    if (playerState.players.p1.enr >= 50) {
      playerState.players.p1.enr = 100;
    } else {
      playerState.players.p1.enr += 50;}
    playerState.players.p1.drinks -= 1;
    utils.emitEvent("PlayerStateUpdated"); 
    return
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    // Check current position
    // console.log((this.x / 16), (this.y / 16))

    if (this.movingProgressRemaining === 0) {
      //We finished the walk!
      this.intentPosition = null;
      utils.emitEvent("PersonWalkingComplete", {
        whoId: this.id
      })
    }
  }

  updateSprite() {
    // if we drink
    if (this.isDrinking) {
      this.sprite.setAnimation("drink-"+this.direction);
      return;
    }
    // if we are biking
    if (this.movingProgressRemaining > 0 && this.isBiking) {
    this.sprite.setAnimation("bike-"+this.direction);
    return;
    } else if (this.isBiking) {
       this.sprite.setAnimation("bidle-"+this.direction); 
    }   
   if (this.movingProgressRemaining > 0 && !this.isBiking) {
      this.sprite.setAnimation("walk-"+this.direction);
      return;
    }
    else if (!this.isBiking && !this.isDrinking) {
      this.sprite.setAnimation("idle-"+this.direction);   
      return;
    } 
  }

}