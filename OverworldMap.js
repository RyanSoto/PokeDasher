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
      utils.withGrid(0) - cameraPerson.x, 
      utils.withGrid(0) - cameraPerson.y
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
    lowerSrc: "./images/maps/Anywhere1.png",
    upperSrc: "./images/maps/AnywhereUpper.png",
    configObjects: {
      hero: {
        type: "Hero",
        useShadow: true,
        isPlayerControlled: true,
        x: utils.withGrid(12),
        y: utils.withGrid(23),
      },
      npc1: {
        type:"Person",
        useShadow: true,
        x: utils.withGrid(26),
        y: utils.withGrid(21),
        src: "./images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 800 },
          { type: "stand",  direction: "up", time: 800 },
          { type: "stand",  direction: "right", time: 1200 },
          { type: "stand",  direction: "down", time: 300 },
        ],
        talking: [
          {
            events: [
              {type: "textMessage", text: "I sure hope there is a delivery person working today.", faceHero: "npc1"},
              {type: "textMessage", text: "My stomach is grumbling."},
              // {who: "hero", type: "walk", direction: "down"},
            ]
          }
        ]
      },
      npc2: {
        type:"Person",
        useShadow: true,
        x: utils.withGrid(10),
        y: utils.withGrid(21),
        src: "./images/characters/people/npc1.png",
        behaviorLoop: [
          {type: "stand", direction: "up", time: 800},
          {type: "walk", direction: "up"},
          {type: "stand", direction: "up", time: 1600},
          {type: "walk", direction: "down"},
          {type: "stand", direction: "down", time:1200},
        ],
        talking: [
          {
            required: [ "TELL_BIKE_OFF"  ],
            events: [

                { type: "textMessage", text: "Press N to get off your bike." , faceHero: "npc2"},
                { type: "removeStoryFlag", flag: "TELL_BIKE_OFF"  },
            ]   
        },
          {
            required: [ "TELL_BIKE_ON"  ],
            events: [
                { type: "textMessage", text: "Oh you want to go fast? Press B to ride your bike." , faceHero: "npc2"},
                { type: "textMessage", text: "Be careful though." , faceHero: "npc2"},
                { type: "textMessage", text: "If you bump something while you're on your bike" , faceHero: "npc2"},
                { type: "textMessage", text: "You will lose some health." , faceHero: "npc2"},
                { type: "removeStoryFlag", flag: "TELL_BIKE_ON"  },
                { type: "addStoryFlag", flag: "TELL_BIKE_OFF" },
            ]   
        },
          {
            events: [
              {type: "textMessage", text: "Are you trying to make some money?", faceHero: "npc2"},
              {type: "textMessage", text: "You can press Q to pull up your phone and check for offers from GrubHub."},
              { type: "addStoryFlag", flag: "TELL_BIKE_ON" },
            ]
          }
        ]
      },
        BigSign0: ({
        type: "BigSign",
        src: "images/Objects/bigsign1left.png",
        x: utils.withGrid(47), //19
        y: utils.withGrid(22), //35
        // storyFlag: "HAVEREAD",

      }),
      BigSign1: ({
        type: "BigSign",
        src: "images/Objects/bigsign1right.png",
        x: utils.withGrid(48), //19
        y: utils.withGrid(22), //35
        // storyFlag: "HAVEREAD",

      }),
      pickUp0: ({
        type: "Delivery",
        x: utils.withGrid(64), //64
        y: utils.withGrid(19), //19
        storyFlag: "PICKUP_0"
      }),
      Sign0: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(60), 
        y: utils.withGrid(19),
        talking: [
          {
            events: [
              { type: "textMessage", text: "Dairy King", },
            ]
          }
        ]
      }),
      pickUp1: ({
        type: "Delivery",
        x: utils.withGrid(67), //19
        y: utils.withGrid(32), //35
        storyFlag: "PICKUP_1"
      }),
      Sign1: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(63), 
        y: utils.withGrid(32),
        talking: [
          {
            events: [
              { type: "textMessage", text: "WacArnolD's", },
            ]
          }
        ]
      }),
      pickUp2: ({
        type: "Delivery",
        x: utils.withGrid(76), //19
        y: utils.withGrid(19), //35
        storyFlag: "PICKUP_2"
      }),
      Sign2: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(72), 
        y: utils.withGrid(19),
        talking: [
          {
            events: [
              { type: "textMessage", text: "Tropical Curry's", },
            ]
          }
        ]
      }),
      pickUp3: ({
        type: "Delivery",
        x: utils.withGrid(83), //19
        y: utils.withGrid(33), //35
        storyFlag: "PICKUP_3"
      }),
      Sign3: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(79), 
        y: utils.withGrid(33),
        talking: [
          {
            events: [
              { type: "textMessage", text: "Brother's BBQ", },
            ]
          }
        ]
      }),
      pickUp4: ({
        type: "Delivery",
        x: utils.withGrid(85), //19
        y: utils.withGrid(16), //35
        storyFlag: "PICKUP_4"
      }),
      Sign4: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(83), 
        y: utils.withGrid(16),
        talking: [
          {
            events: [
              { type: "textMessage", text: "Xian's Noodle House", },
            ]
          }
        ]
      }),
      dropOff0: ({
        type: "Destination",
        x: utils.withGrid(19), //65
        y: utils.withGrid(35), //19
        storyFlag: "DROPOFF_0"
      }),
      addressSign0: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(21), 
        y: utils.withGrid(35),
        talking: [
          {
            events: [
              { type: "textMessage", text: "101", },
            ]
          }
        ]
      }),
      dropOff1: ({
        type: "Destination",
        x: utils.withGrid(36), //65
        y: utils.withGrid(21), //19
        storyFlag: "DROPOFF_1"
      }),
      addressSign1: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(34), 
        y: utils.withGrid(21),
        talking: [
          {
            events: [
              { type: "textMessage", text: "104", },
            ]
          }
        ]
      }),
      dropOff2: ({
        type: "Destination",
        x: utils.withGrid(27), //65
        y: utils.withGrid(21), //19
        storyFlag: "DROPOFF_2"
      }),
      addressSign2: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(23), 
        y: utils.withGrid(21),
        talking: [
          {
            events: [
              { type: "textMessage", text: "102", },
            ]
          }
        ]
      }),
      dropOff3: ({
        type: "Destination",
        x: utils.withGrid(30), //65
        y: utils.withGrid(35), //19
        storyFlag: "DROPOFF_3"
      }),
      addressSign3: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(28), 
        y: utils.withGrid(35),
        talking: [
          {
            events: [
              { type: "textMessage", text: "103", },
            ]
          }
        ]
      }),

    },

    // grids from tile are off x: +10 y: + 6
    
    walls: 
    collisionCoords = utils.collisionDetection(anywhereCollision)

    // {
      // [utils.asGridCoord(28,20)] : true,
      // [utils.asGridCoord(27,20)] : true,
      // [utils.asGridCoord(26,20)] : true,
      // [utils.asGridCoord(25,20)] : true,
      // [utils.asGridCoord(23,20)] : true,
    // }
    ,

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
              map: "House0",
              x: utils.withGrid(-6),
              y: utils.withGrid(2),
              direction: "up", 
            }
          ]
        }
      ]
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
              {type: "textMessage", text: "Ever since the accident I am unable to work.", faceHero: "npc1"},
              {type: "textMessage", text: "I will continue to teach myself coding...", faceHero: "npc1"},
              {type: "textMessage", text: "But it will be up to you to pay the bills.", faceHero: "npc1"},
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
      //   src: "./images/characters/people/npc1.png"
      // })
    },
  StarvilleRevive: {
    id: "Starville",
    lowerSrc: "./images/maps/Anywhere1.png",
    upperSrc: "./images/maps/AnywhereUpper.png",
    configObjects: {
      hero: {
        type: "Hero",
        useShadow: true,
        isPlayerControlled: true,
        x: utils.withGrid(73),
        y: utils.withGrid(43),
      },
      npc1: {
        type:"Person",
        useShadow: true,
        x: utils.withGrid(26),
        y: utils.withGrid(21),
        src: "./images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 800 },
          { type: "stand",  direction: "up", time: 800 },
          { type: "stand",  direction: "right", time: 1200 },
          { type: "stand",  direction: "down", time: 300 },
        ],
        talking: [
          {
            events: [
              {type: "textMessage", text: "I sure hope there is a delivery person working today.", faceHero: "npc1"},
              {type: "textMessage", text: "My stomach is grumbling."},
              // {who: "hero", type: "walk", direction: "down"},
            ]
          }
        ]
      },
      npc2: {
        type:"Person",
        useShadow: true,
        x: utils.withGrid(10),
        y: utils.withGrid(21),
        src: "./images/characters/people/npc1.png",
        behaviorLoop: [
          {type: "stand", direction: "up", time: 800},
          {type: "walk", direction: "up"},
          {type: "stand", direction: "up", time: 1600},
          {type: "walk", direction: "down"},
          {type: "stand", direction: "down", time:1200},
        ],
        talking: [
          {
            required: [ "TELL_BIKE_OFF"  ],
            events: [

                { type: "textMessage", text: "Press N to get off your bike." , faceHero: "npc2"},
                { type: "removeStoryFlag", flag: "TELL_BIKE_OFF"  },
            ]   
        },
          {
            required: [ "TELL_BIKE_ON"  ],
            events: [
                { type: "textMessage", text: "Oh you want to go fast? Press B to ride your bike." , faceHero: "npc2"},
                { type: "textMessage", text: "Be careful though." , faceHero: "npc2"},
                { type: "textMessage", text: "If you bump something while you're on your bike" , faceHero: "npc2"},
                { type: "textMessage", text: "You will lose some health." , faceHero: "npc2"},
                { type: "removeStoryFlag", flag: "TELL_BIKE_ON"  },
                { type: "addStoryFlag", flag: "TELL_BIKE_OFF" },
            ]   
        },
          {
            events: [
              {type: "textMessage", text: "Are you trying to make some money?", faceHero: "npc2"},
              {type: "textMessage", text: "You can press Q to pull up your phone and check for offers from GrubHub."},
              { type: "addStoryFlag", flag: "TELL_BIKE_ON" },
            ]
          }
        ]
      },
        BigSign0: ({
        type: "BigSign",
        src: "images/Objects/bigsign1left.png",
        x: utils.withGrid(47), //19
        y: utils.withGrid(22), //35
        // storyFlag: "HAVEREAD",

      }),
      BigSign1: ({
        type: "BigSign",
        src: "images/Objects/bigsign1right.png",
        x: utils.withGrid(48), //19
        y: utils.withGrid(22), //35
        // storyFlag: "HAVEREAD",

      }),
      pickUp0: ({
        type: "Delivery",
        x: utils.withGrid(64), //64
        y: utils.withGrid(19), //19
        storyFlag: "PICKUP_0"
      }),
      Sign0: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(60), 
        y: utils.withGrid(19),
        talking: [
          {
            events: [
              { type: "textMessage", text: "Dairy King", },
            ]
          }
        ]
      }),
      pickUp1: ({
        type: "Delivery",
        x: utils.withGrid(67), //19
        y: utils.withGrid(32), //35
        storyFlag: "PICKUP_1"
      }),
      Sign1: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(63), 
        y: utils.withGrid(32),
        talking: [
          {
            events: [
              { type: "textMessage", text: "WacArnolD's", },
            ]
          }
        ]
      }),
      pickUp2: ({
        type: "Delivery",
        x: utils.withGrid(76), //19
        y: utils.withGrid(19), //35
        storyFlag: "PICKUP_2"
      }),
      Sign2: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(72), 
        y: utils.withGrid(19),
        talking: [
          {
            events: [
              { type: "textMessage", text: "Tropical Curry's", },
            ]
          }
        ]
      }),
      pickUp3: ({
        type: "Delivery",
        x: utils.withGrid(83), //19
        y: utils.withGrid(33), //35
        storyFlag: "PICKUP_3"
      }),
      Sign3: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(79), 
        y: utils.withGrid(33),
        talking: [
          {
            events: [
              { type: "textMessage", text: "Brother's BBQ", },
            ]
          }
        ]
      }),
      pickUp4: ({
        type: "Delivery",
        x: utils.withGrid(85), //19
        y: utils.withGrid(16), //35
        storyFlag: "PICKUP_4"
      }),
      Sign4: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(83), 
        y: utils.withGrid(16),
        talking: [
          {
            events: [
              { type: "textMessage", text: "Xian's Noodle House", },
            ]
          }
        ]
      }),
      dropOff0: ({
        type: "Destination",
        x: utils.withGrid(19), //65
        y: utils.withGrid(35), //19
        storyFlag: "DROPOFF_0"
      }),
      addressSign0: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(21), 
        y: utils.withGrid(35),
        talking: [
          {
            events: [
              { type: "textMessage", text: "101", },
            ]
          }
        ]
      }),
      dropOff1: ({
        type: "Destination",
        x: utils.withGrid(36), //65
        y: utils.withGrid(21), //19
        storyFlag: "DROPOFF_1"
      }),
      addressSign1: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(34), 
        y: utils.withGrid(21),
        talking: [
          {
            events: [
              { type: "textMessage", text: "104", },
            ]
          }
        ]
      }),
      dropOff2: ({
        type: "Destination",
        x: utils.withGrid(27), //65
        y: utils.withGrid(21), //19
        storyFlag: "DROPOFF_2"
      }),
      addressSign2: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(23), 
        y: utils.withGrid(21),
        talking: [
          {
            events: [
              { type: "textMessage", text: "102", },
            ]
          }
        ]
      }),
      dropOff3: ({
        type: "Destination",
        x: utils.withGrid(30), //65
        y: utils.withGrid(35), //19
        storyFlag: "DROPOFF_3"
      }),
      addressSign3: ({
        type: "Sign",
        src: "images/Objects/sign.png",
        x: utils.withGrid(28), 
        y: utils.withGrid(35),
        talking: [
          {
            events: [
              { type: "textMessage", text: "103", },
            ]
          }
        ]
      }),

    },

    // grids from tile are off x: +10 y: + 6
    
    walls: 
    collisionCoords = utils.collisionDetection(anywhereCollision)

    // {
      // [utils.asGridCoord(28,20)] : true,
      // [utils.asGridCoord(27,20)] : true,
      // [utils.asGridCoord(26,20)] : true,
      // [utils.asGridCoord(25,20)] : true,
      // [utils.asGridCoord(23,20)] : true,
    // }
    ,

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
              map: "House0",
              x: utils.withGrid(-6),
              y: utils.withGrid(2),
              direction: "up", 
            }
          ]
        }
      ]
    } 
  },
}