 const conObjs = {
    "Starville" : {
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
        src: "./images/characters/people/npc2.png",
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
        src: "./images/characters/people/npc3.png",
        behaviorLoop: [
          // {type: "drink", direction: "down", time: 1500},
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

                { type: "textMessage", text: "Press B to get off your bike." , faceHero: "npc2"},
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
        // src: "./images/characters/people/npc0.png",
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
      dropOff4: ({
        type: "Destination",
        x: utils.withGrid(16), //65
        y: utils.withGrid(50), //19
        src: "./images/characters/people/npc0.png",
        storyFlag: "DROPOFF_4"
      }),      
      dropOff5: ({
        type: "Destination",
        x: utils.withGrid(24), //65
        y: utils.withGrid(50), //19
        src: "./images/characters/people/npc0.png",
        storyFlag: "DROPOFF_5"
      }),      
      dropOff6: ({
        type: "Destination",
        x: utils.withGrid(32), //65
        y: utils.withGrid(50), //19
        src: "./images/characters/people/npc0.png",
        storyFlag: "DROPOFF_6"
      }),      
      dropOff7: ({
        type: "Destination",
        x: utils.withGrid(31), //65
        y: utils.withGrid(59), //19
        src: "./images/characters/people/npc0.png",
        storyFlag: "DROPOFF_7"
      }),      
      dropOff8: ({
        type: "Destination",
        x: utils.withGrid(24), //65
        y: utils.withGrid(60), //19
        src: "./images/characters/people/npc0.png",
        storyFlag: "DROPOFF_8"
      }),      
      dropOff9: ({
        type: "Destination",
        x: utils.withGrid(15), //65
        y: utils.withGrid(59), //19
        src: "./images/characters/people/npc0.png",
        storyFlag: "DROPOFF_9"
      }),      
      dropOff10: ({
        type: "Destination",
        x: utils.withGrid(65), //65
        y: utils.withGrid(76), //19
        src: "./images/characters/people/npc0.png",
        storyFlag: "DROPOFF_10"
      }),      
      dropOff11: ({
        type: "Destination",
        x: utils.withGrid(79), //65
        y: utils.withGrid(76), //19
        src: "./images/characters/people/npc0.png",
        storyFlag: "DROPOFF_11"
      }),      
      dropOff12: ({
        type: "Destination",
        x: utils.withGrid(83), //65
        y: utils.withGrid(86), //19
        src: "./images/characters/people/npc0.png",
        storyFlag: "DROPOFF_12"
      }),      
      dropOff13: ({
        type: "Destination",
        x: utils.withGrid(72), //65
        y: utils.withGrid(86), //19
        src: "./images/characters/people/npc0.png",
        storyFlag: "DROPOFF_13"
      }),      
      dropOff14: ({
        type: "Destination",
        x: utils.withGrid(61), //65
        y: utils.withGrid(86), //19
        src: "./images/characters/people/npc0.png",
        storyFlag: "DROPOFF_14"
      }),

    }
}