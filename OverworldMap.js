class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = {}; // live objects are in here
    this.configObjects = config.configObjects; // configuration content
    
    
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};
    
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;
    
    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
    
    this.isCutscenePlaying = false;
    this.isPaused = false;
    
  }

  
  
  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(0) - cameraPerson.x , 
      utils.withGrid(0) - cameraPerson.y     
      // 600, 
      // 0
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(0) - cameraPerson.x, 
      utils.withGrid(0) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    if (this.walls[`${x},${y}`]) {
      return true;
    }
    //Check for game objects at this position
    return Object.values(this.gameObjects).find(obj => {
      if (obj.x === x && obj.y === y) { return true; }
      if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition && obj.intentPosition[1] === y) {
        return true;
      }
      return false;
    })
  }

  mountObjects() {
    Object.keys(this.configObjects).forEach(key => {

      let object = this.configObjects[key];
      object.id = key;

      let instance;
      if (object.type == "Hero") {
        instance = new Hero(object);
      }
      if (object.type == "Person") {
        instance = new Person(object);
      }
      if (object.type === "Delivery") {
        instance = new Delivery(object);
      }
      if (object.type === "Destination") {
        instance = new Destination(object);
      }
      if (object.type === "BigSign") {
        instance = new BigSign(object);
      }
      if (object.type === "Sign") {
        instance = new Sign(object);
      }

      

      this.gameObjects[key] = instance; 
      this.gameObjects[key].id = key;
      instance.mount(this);

      //TODO: determine if this object should actually mount
      //object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        map: this,
        event: events[i],
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //reset npcs to do their idle behavior
    //Object.values(this.configObjects).forEach(object => object.doBehaviorEvent(this))


  }


  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {

      const relevantScenario = match.talking.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

}

window.OverworldMaps = {
  Starville: {
    id: "Starville",
    lowerSrc: "./images/maps/StarvilleLower.png",
    upperSrc: "./images/maps/StarvilleUpper.png",
    configObjects: conObjs.Starville,

    // grids from tile are off x: +10 y: + 6
    walls: collisionCoords = utils.collisionDetection(anywhereCollision),

    cutsceneSpaces: {
      [utils.asGridCoord(24,20)]: [
        {
          events: [

            { who: "npc1", type: "walk", direction: "left" },
            { who: "npc1", type: "walk", direction: "left" },
            { who: "npc1", type: "stand", direction: "up", time: 200 },
            { type: "textMessage", text: "Hey this is a private residence, man." },
            { who: "npc1", type: "walk", direction: "right" },
            { who: "npc1", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "down" },

          ]
        }
      ],
      [utils.asGridCoord(12,20)]: [
        {
          events: [

            { type: "changeMap", 
              // map: "House0",
              map: "House0",
              x: utils.withGrid(-6),
              y: utils.withGrid(2),              
              direction: "up", 
            }
          ]
        }
      ],
      [utils.asGridCoord(63,58)]: [
        {
          events: [

            { type: "changeMap", 
              map: "Shop0",
              x: utils.withGrid(6),
              y: utils.withGrid(8),
              direction: "up", 
            }
          ]
        }
      ],
            [utils.asGridCoord(35,20)]: [
        {
          events: [

            { type: "changeMap", 
              map: "Shop0",
              x: utils.withGrid(6),
              y: utils.withGrid(8),
              direction: "up", 
            }
          ]
        }
      ],

    } 
  },
  House0: {
    id: "House0",
    lowerSrc: "./images/maps/House0.png",
    upperSrc: "",
    configObjects: {
      hero: {
        type: "Hero",
        isPlayerControlled: true,
        x: utils.withGrid(-1),
        y: utils.withGrid(2),

      },
      npc1: {
        type: "Person",
        x: utils.withGrid(-2),
        y: utils.withGrid(1),
        src: "./images/characters/people/npc1.png",
        talking: [
          {
            required: [ "GIT", "RENT_WARNING"  ],
            events: [

                { type: "textMessage", text: "Are ya winning son?" , faceHero: "npc1"},
                { type: "removeStoryFlag", flag: "GIT"  },
            ]   
        },          {
          required: [ "RENT_WARNING"  ],
          events: [

              { type: "textMessage", text: "You can do it. I believe in you!" , faceHero: "npc1"},
              { type: "addStoryFlag", flag: "GIT"  },
          ]   
        },
          {
            events: [
              {type: "textMessage", text: "I have some bad news buddy.", faceHero: "npc1"},
              {type: "textMessage", text: "Ever since the accident I am unable go to my construction job.", faceHero: "npc1"},
              {type: "textMessage", text: "I will look for online work", faceHero: "npc1"},
              {type: "textMessage", text: "But it will be up to you to pay the bills in the meantime.", faceHero: "npc1"},
              {who: "npc1", type: "stand", direction: "down"},
              { type: "addStoryFlag", flag: "RENT_WARNING"  },
            ]
          }
        ],
        behaviorLoop: [
          {type: "stand", direction: "down", time: 1500},
          {type: "stand", direction: "right", time: 4500},
          {type: "stand", direction: "down", time:3000},
          {type: "stand", direction: "right", time:1200},
        ]
      },
    },

    walls: 
    collisionCoords = utils.collisionDetection(house0Collision),
    
    cutsceneSpaces: {

      [utils.asGridCoord(-6,3)]: [
        {
          events: [

            { type: "changeMap", 
            map: "Starville",
            x: utils.withGrid(12),
            y: utils.withGrid(21),
            direction: "down",              
             }

          ]
        }
      ]
    }
      // npc2: new GameObject({
      //   x: 10,
      //   y: 8,
      //   src: "./images/characters/people/npc2.png"
      // })
    },

  Shop0: {
    id: "Shop0",
    lowerSrc: "./images/maps/Shop0_Lower.png",
    upperSrc: "./images/maps/Shop0_Upper.png",
    configObjects: {
      hero: {
        type: "Hero",
        isPlayerControlled: true,
      },
      npc1: {
        type: "Person",
        x: utils.withGrid(6),
        y: utils.withGrid(2),
        src: "./images/characters/people/npc1.png",
        talking: [
          {
            required: [ "GIT", "RENT_WARNING"  ],
            events: [

                { type: "removeStoryFlag", flag: "GIT"  },
            ]   
        },          {
          required: [ "GREETING_DONE"  ],
          events: [

              { type: "textMessage", text: "Got everything you need?" , faceHero: "npc1"},
              { type: "choiceMessage", faceHero: "npc1"},

          ]   
        },
          {
            events: [
              {type: "textMessage", text: "Please have a look around and let me know if you need anything.", faceHero: "npc1"},
              {who: "npc1", type: "stand", direction: "left"},
              { type: "addStoryFlag", flag: "GREETING_DONE"  },
            ]
          }
        ],
        behaviorLoop: [
          {type: "stand", direction: "down", time: 1500},
          {type: "stand", direction: "right", time: 4500},
          {type: "stand", direction: "down", time:3000},
          {type: "stand", direction: "right", time:1200},
        ]
      },
      npc10: {
        type: "Person",
        x: utils.withGrid(8),
        y: utils.withGrid(2),
        src: "./images/characters/people/npc0.png",
        talking: [
          {
            required: [ "GIT", "RENT_WARNING"  ],
            events: [

                { type: "removeStoryFlag", flag: "GIT"  },
            ]   
        },          {
          required: [ "GREETING_DONE"  ],
          events: [

              { type: "textMessage", text: "Got everything you need?" , faceHero: "npc1"},
              { type: "choiceMessage", faceHero: "npc1"},

          ]   
        },
          {
            events: [
              {type: "textMessage", text: "Please have a look around and let me know if you need anything.", faceHero: "npc1"},
              {who: "npc1", type: "stand", direction: "left"},
              { type: "addStoryFlag", flag: "GREETING_DONE"  },
            ]
          }
        ],
        behaviorLoop: [
          {type: "stand", direction: "down", time: 1500},
          {type: "stand", direction: "right", time: 4500},
          {type: "stand", direction: "down", time:3000},
          {type: "stand", direction: "right", time:1200},
        ]
      },
      npc11: {
        type: "Person",
        x: utils.withGrid(6),
        y: utils.withGrid(3),
        src: "./images/characters/people/npc0.png",
        talking: [
          {
            required: [ "GIT", "RENT_WARNING"  ],
            events: [

                { type: "removeStoryFlag", flag: "GIT"  },
            ]   
        },          {
          required: [ "GREETING_DONE"  ],
          events: [

              { type: "textMessage", text: "Got everything you need?" , faceHero: "npc1"},
              { type: "choiceMessage", faceHero: "npc1"},

          ]   
        },
          {
            events: [
              {type: "textMessage", text: "Please have a look around and let me know if you need anything.", faceHero: "npc1"},
              {who: "npc1", type: "stand", direction: "left"},
              { type: "addStoryFlag", flag: "GREETING_DONE"  },
            ]
          }
        ],
        behaviorLoop: [
          {type: "stand", direction: "down", time: 1500},
          {type: "stand", direction: "right", time: 4500},
          {type: "stand", direction: "down", time:3000},
          {type: "stand", direction: "right", time:1200},
        ]
      },      
    },

    walls: 
    collisionCoords = utils.collisionDetection(Shop0Collision),
    
    cutsceneSpaces: {

      [utils.asGridCoord(6,9)]: [
        {
          events: [

            { type: "changeMap", 
            map: "Starville",
            x: utils.withGrid(63),
            y: utils.withGrid(59),
            direction: "down",              
             }

          ]
        }
      ]
    }
      // npc2: new GameObject({
      //   x: 10,
      //   y: 8,
      //   src: "./images/characters/people/npc2.png"
      // })
    },
}