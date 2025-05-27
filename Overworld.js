class Overworld {
 constructor(config) {
   this.element = config.element;
   this.canvas = this.element.querySelector(".game-canvas");
   this.ctx = this.canvas.getContext("2d");
   this.map = null;
   this.hero = null;
   this.position = []

 }

 gameLoopStepWork(delta){
      //Check for 0 health condition
      if (playerState.players.p1.enr <= 0 && playerState.storyFlags[this.storyFlag = "DEATH"]) {

        this.map.startCutscene([
          { type: "changeMap", map: "Starville", 
              x: utils.withGrid(73),
              y: utils.withGrid(43),
              direction: "down"
            },
          { type: "death"},
          { type: "removeStoryFlag", flag: "DEATH" },
          { type: "textMessage", text:"You have been discharged from the hospital. Paid $50 for treatment."} , 
          // { type: "textMessage", text:"$50 was removed from your bank."} , 
        ])
      }

      //Check for end game condition
      if (playerState.players.p1.money >= 1000 && !playerState.storyFlags[this.storyFlag = "END_GAME"]) {

        this.map.startCutscene([
          { type: "shoutMessage", text:"Congrats on nothing!"} , 
          { type: "shoutMessage", text:"The End?"} , 
          { type: "addStoryFlag", flag: "END_GAME" },
        ])
        // playerState.players.p1.money -= 10
        utils.emitEvent("PlayerStateUpdated"); 
      }

      // Function to trigger a random message if isActive is true
      this.isActive = this.isActive ?? true; // initialize if undefined
      this.offerExist = this.offerExist ?? false; // initialize if undefined

      this.triggerRandomMessage = () => {
        
        if (!this._randomMessageStarted) return;
        if (this.offerExist) return; 
        if (!this.isActive) return;
        const randomDelay = Math.floor(Math.random() * 5000) + 0; // 10 + 5 seconds
        console.log("Random message will trigger in", randomDelay, "ms");
        setTimeout(() => {
          if (!this.isActive) return;
          this.isActive = false; // Prevent further triggers during cutscene
          this.offerExist = true; // Set offerExist to true to prevent further triggers
            const phoneNotification = new PhoneNotification({
              map: this.map,
              // offerExist: this.offerExist,
              onComplete: () => {
                this.offerExist = false;
              }
            })
          
            phoneNotification.init(document.querySelector(".game-container")).then(() => {
        this.isActive = true; // Reactivate after cutscene ends
        this._randomMessageStarted = false
        this.triggerRandomMessage(); // Schedule next message
          });
        }, randomDelay);
      };

      // Start the random message loop if active
      if (this.isActive && !this.offerExist && !this._randomMessageStarted) {
        this._randomMessageStarted = true;
        this.triggerRandomMessage();
      }

      
      // console.log(this.isActive, this.offerExist, this._randomMessageStarted)
      // this.canvas.width = window.innerWidth
      // this.canvas.height = window.innerHeight
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Establish the camera person
      const cameraPerson = this.map.gameObjects.hero;

      //Update all objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          delta,
          arrow: this.directionInput.direction,
          map: this.map,
        })
      })

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      //Draw Game Objects
      Object.values(this.map.gameObjects).sort((a,b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson);
      })

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);
 }
 
  startGameLoop() {

    let previousMs;
    const step = 1/60;

    const stepFN = (timestampMs) => {
      
      if (this.map.isPaused) {
        return;
      }
      if (previousMs === undefined) {
        previousMs = timestampMs;
      }
      let delta = (timestampMs - previousMs) / 1000;
      while (delta >= step) {
        //Do work
        this.gameLoopStepWork(delta);
        delta -= step;
      }
      previousMs = timestampMs - delta * 1000;

        requestAnimationFrame(stepFN)
    }
    requestAnimationFrame(stepFN);

    
 }

 bindActionInput() {
  new KeyPressListener("Enter", () => {
    //Is there a person here to talk to?
    this.map.checkForActionCutscene()
    this.position.push([this.map.gameObjects.hero.x / 16, this.map.gameObjects.hero.y / 16])
    console.log("Hero Position: ", this.position)
 })

 new KeyPressListener("KeyF", () => {
  //Is there a person here to talk to?
  this.map.checkForActionCutscene()
})

  new KeyPressListener("Space", () => {
  //Is there a person here to talk to?
  this.map.checkForActionCutscene()
})

  new KeyPressListener("KeyQ", () => {
    //Pull up phone
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { type: "phone"}
      ])
    }
  })

  new KeyPressListener("KeyP", () => { 
    if (!this.map.isCutscenePlaying && playerState.players.p1.drinks > 0) {
      this.map.startCutscene([
        {who:"hero", type: "drink", direction: "down", time: 1500}
      ])
    }
  })
  

  }

 bindHeroPositionCheck() {
   document.addEventListener("PersonWalkingComplete", e => {
     if (e.detail.whoId === "hero") {
      this.map.checkForFootstepCutscene()
    }
  })
 }

 startMap(mapConfig, heroInitialState=null) {
  this.map = new OverworldMap(mapConfig);
  this.map.overworld = this;
  this.map.mountObjects();

  if (heroInitialState) {
    const {hero} = this.map.gameObjects;

    this.map.gameObjects.hero.x = heroInitialState.x;
    this.map.gameObjects.hero.y = heroInitialState.y;
    this.map.gameObjects.hero.direction = heroInitialState.direction;

  }
 }

 endGame() {
  console.log("Game Over")
  this.map.isPaused = true

  this.map.startCutscene([
    { type: "shoutMessage", text:"Congrats on nothing!"} , 
    { type: "shoutMessage", text:"The End?"} , 
  ])

  }

 init() {
  this.hud = new Hud();
  this.hud.init(document.querySelector(".game-container"))

  this.startMap(window.OverworldMaps.Starville);

  this.bindActionInput();
  this.bindHeroPositionCheck(); 

  this.directionInput = new DirectionInput();
  this.directionInput.init();

  this.startGameLoop();
  // after a random amount of time a TextMessage will be displayed


  this.map.startCutscene([

    // Welcome to my demo!
    // {type: "shoutMessage", text: "Welcome to my demo!"},
    // { type: "textMessage", text: "Press F or Enter to interact."},
    // { type: "textMessage", text: "Press Q to pick up or put down your phone."},
    // { type: "textMessage", text: "Press B to get on or off your bike."},


    // { type: "textMessage", text:"Welcome to Ryan Soto's interactive resume! Click next or hit enter to proceed."},


    // // Intro 1.0

    // { who: "npc2", type: "walk",  direction: "down" },
    // { who: "npc2", type: "walk",  direction: "down" },
    // { who: "npc2", type: "walk",  direction: "right" },
    // { who: "hero", type: "stand",  direction: "left" },
    // { type: "textMessage", text:"Welcome to Ryan Soto's interactive resume! Click next or hit enter to proceed."},
    // { who: "npc2", type: "walk",  direction: "left" },
    // { who: "npc2", type: "walk",  direction: "up" },
    // { who: "npc2", type: "walk",  direction: "up" },
    // { who: "npc2", type: "walk",  direction: "up" },
    // { who: "hero", type: "stand",  direction: "down", time: 200},
    // { who: "hero", type: "stand",  direction: "right", time: 500},

    //To the middle

    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" },
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" },
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" },
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "walk",  direction: "right" }, 
    // { who: "hero", type: "stand",  direction: "down", time: 150},
    // { who: "hero", type: "walk",  direction: "down" }, 
    // { who: "hero", type: "walk",  direction: "down" }, 
    // { who: "hero", type: "walk",  direction: "down" },
    // { who: "hero", type: "stand",  direction: "right", time: 200}, 
    // { who: "hero", type: "walk",  direction: "right" },
    // { who: "hero", type: "walk",  direction: "right" },
    // { who: "hero", type: "walk",  direction: "right" },
    // { who: "hero", type: "walk",  direction: "right" },
    // { who: "hero", type: "walk",  direction: "right" },
    // { who: "hero", type: "walk",  direction: "right" },
    // { who: "hero", type: "stand",  direction: "up", time: 150}, 
    // { who: "hero", type: "walk",  direction: "up" },
    // { who: "hero", type: "walk",  direction: "up" },
    // { who: "hero", type: "walk",  direction: "up" },

    //Main Body of Resume

    // { who: "hero", type: "stand",  direction: "up", time: 300},  
    // { type: "shoutMessage", text:"Full Stack Developer."} ,
    // { type: "textMessage", text:"Most of my experience is in front-end but I also have some practice in back-end."},
    // { type: "shoutMessage", text:"Javascript"},
    // { type: "textMessage", text:"JavaScript was used to make this game!"},
    // { type: "textMessage", text:"It is currently the language I am most proficient with. I spend the majority of my free time honing and practicing my JS skills."},


    // { type: "shoutMessage", text:"HTML and CSS"},
    // { type: "textMessage", text:"Anytime I spend with JavaScript, HTML and CSS is nearby. This has provided me with the tools to bring my scripts to the screen."},


    // { type: "shoutMessage", text:"Python"},
    // { type: "textMessage", text:"I spent the first part of my independent study learning python and manipulating back-end data."},

    // { type: "shoutMessage", text:"C++"},
    // { type: "textMessage", text:"My formal education was mostly in C++"},


    // { who: "hero", type: "stand",  direction: "down", time: 200},
    // { who: "npc1", type: "walk",  direction: "left" }, 
    // { who: "hero", type: "walk",  direction: "right" },
    // { who: "hero", type: "walk",  direction: "right" },
    // { who: "npc1", type: "walk",  direction: "left" },
    // { who: "npc1", type: "walk",  direction: "right" },
    // { who: "npc1", type: "walk",  direction: "right" },
    // { who: "npc1", type: "stand",  direction: "up", time: 800 },
  ])

 }
}