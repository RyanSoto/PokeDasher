class Overworld {
 constructor(config) {
   this.element = config.element;
   this.canvas = this.element.querySelector(".game-canvas");
   this.ctx = this.canvas.getContext("2d");
   this.map = null;
   this.hero = null;
 }

 gameLoopStepWork(delta){
      //Check for 0 health condition
      if (window.playerState.players.p1.enr <= 0 && playerState.storyFlags[this.storyFlag = "DEATH"]) {

        this.startMap(window.OverworldMaps.StarvilleRevive);

        this.map.startCutscene([
          { type: "death"},
          { type: "removeStoryFlag", flag: "DEATH" },
          { type: "textMessage", text:"You have been discharged been from the hospital. Paid $50 for treatment."} , 
          // { type: "textMessage", text:"$50 was removed from your bank."} , 
        ])
      }

      //Check for end game condition
      if (window.playerState.players.p1.money >= 50 && !playerState.storyFlags[this.storyFlag = "END_GAME"]) {

        this.map.startCutscene([
          { type: "shoutMessage", text:"Congrats on nothing!"} , 
          { type: "shoutMessage", text:"The End?"} , 
          { type: "addStoryFlag", flag: "END_GAME" },
        ])


        window.playerState.players.p1.money -= 10
        utils.emitEvent("PlayerStateUpdated"); 

      }

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
    const step = 1/120;

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
 })
 new KeyPressListener("KeyF", () => {
  //Is there a person here to talk to?
  this.map.checkForActionCutscene()
})
  new KeyPressListener("KeyQ", () => {
    //Pull up/Put away phone
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { type: "phone"}
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


  this.map.startCutscene([

    //{type: "battle" }

    // {type: "offer"}

    {type: "shoutMessage", text: "Welcome to my demo!"},
    { type: "textMessage", text:"Press F or Enter to interact with things."},
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