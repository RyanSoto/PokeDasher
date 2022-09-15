class Overworld {
 constructor(config) {
   this.element = config.element;
   this.canvas = this.element.querySelector(".game-canvas");
   this.ctx = this.canvas.getContext("2d");
   this.map = null;
   this.hero = null;
 }

  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Establish the camera person
      const cameraPerson = this.map.gameObjects.hero;

      //Update all objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
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
      
      if (!this.map.isPaused)
        requestAnimationFrame(() => {
          step();   
      })
    }
    step();
 }

 bindActionInput() {
  new KeyPressListener("Enter", () => {
     //Is there a person here to talk to?
     this.map.checkForActionCutscene()
     console.log("enter")
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