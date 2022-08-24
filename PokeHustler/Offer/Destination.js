class Destination extends GameObject{
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: "images/Objects/foodreceptacle.png",
            animations: {
                "Empty" :  [ [0,0] ],
                "Full" :   [ [1,0] ],
            },
            currentAnimation: "Full"
        });
        this.storyFlag = config.storyFlag;

        this.talking = [
            {
                required: [this.storyFlag = "ORDER_TAKEN"],
                events: [
                    { type: "textMessage", text: "You leave the delivery in the receptacle" },
                    { type: "removeStoryFlag", flag: this.storyFlag },
                    { type: "finishDelivery"}
                ]
            },
            {
                // required: [this.storyFlag],
                events: [
                { type: "textMessage", text: "They are not expecting an order." },

                ]   
            },

        ]

    }

    update() {
        this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag = "ORDER_TAKEN"]
            ? "Empty"
            : "Full";
       }
}