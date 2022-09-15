class Delivery extends GameObject{
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: "images/Objects/foodreceptacle.png",
            animations: {
                "Empty" :  [ [0,0] ],
                "Full" :   [ [1,0] ],
            },
            currentAnimation: "Empty"
        });
        this.storyFlag = config.storyFlag;

        
        

        

        this.talking = [
            {
                required: [ "ORDER_ACCEPTED"  , this.storyFlag, "CONFIRMED_PICKUP"  ],
                events: [

                    { type: "textMessage", text: "You grab the order" },
                    { type: "removeStoryFlag", flag: "ORDER_ACCEPTED"  },
                    { type: "removeStoryFlag", flag: this.storyFlag },
                    { type: "addStoryFlag", flag: "ORDER_TAKEN" },
                    


                ]   
            },
            {
                required: ["ORDER_ACCEPTED" , this.storyFlag],
                events: [
                    { type: "textMessage", text: "Is this the right order?" },
                    { type: "textMessage", text: "Yep, This is it." },
                    { type: "addStoryFlag", flag: "CONFIRMED_PICKUP"   },
                    // { type: "addStoryFlag", flag: "JUST_TOOK"   },
                 
                ]
            },
            {
                required: ["ORDER_ACCEPTED"],
                events: [
                    { type: "textMessage", text: "Is this the right order?"},
                    { type: "textMessage", text: "Nah, This ain't it chief."},
                    // { type: "addStoryFlag", flag: this.storyFlag   },
                 
                ]
            },
            // {
            //     required: ["ORDER_TAKEN" , "CONFIRMED_PICKUP", "JUST_TOOK" ],
            //     events: [
            //         {type: "textMessage", text: "You just picked up an order from here."}
            //     ]
            // },
            {
                events: [
                    { type: "textMessage", text: "There is no order at this pick up." },
                ]
                
                
            },

        ]
        

    }

    update() {
        
        this.sprite.currentAnimation = playerState.storyFlags["ORDER_ACCEPTED"]
            ? "Full"
            : "Empty";
        
       }
}