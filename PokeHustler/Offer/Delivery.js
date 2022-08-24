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
                required: [this.storyFlag = "ORDER_ACCEPTED"],
                events: [

                    { type: "textMessage", text: "You grab the order" },
                    { type: "removeStoryFlag", flag: "ORDER_ACCEPTED"  },
                    { type: "addStoryFlag", flag: "ORDER_TAKEN" },

                ]   
            },
            {
                required: [this.storyFlag = "ORDER_TAKEN"],
                events: [
                    {type: "textMessage", text: "You just picked up an order from here."}
                ]
            },
            {
                events: [
                    { type: "textMessage", text: "There is no order at this pick up." },
                    
                ]
            },

        ]
        

    }

    update() {
        this.storyFlags = this.storyFlag
        this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag = "ORDER_ACCEPTED"]
            ? "Full"
            : "Empty";
        
       }
}