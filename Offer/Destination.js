class Destination extends GameObject{
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "images/Objects/foodreceptacle.png",
            animations: {
                "Empty" :  [ [0,0] ],
                "Full" :   [ [1,0] ],
                "Door" :   [ [0,0] ],
                "Noone" :   [ [5,0] ],
            },
            currentAnimation: "Full"
        });
        this.storyFlag = config.storyFlag;

        this.talking = [
            {
                required: ["ORDER_TAKEN", this.storyFlag ],
                events: [
                    { type: "textMessage", text: "You leave the delivery in the receptacle" },
                    { type: "removeStoryFlag", flag: this.storyFlag },
                    { type: "removeStoryFlag", flag: "ORDER_TAKEN" },
                    { type: "removeStoryFlag", flag: "CONFIRMED_PICKUP" },
                    { type: "addStoryFlag", flag: "RECENT_DELIVERY"   },
                    { type: "finishDelivery"}
                ]
            },            
            {
                required: ["ORDER_TAKEN", this.storyFlag ],
                events: [
                    { type: "textMessage", text: "You ring the doorbell" },
                    { type: "addStoryFlag", flag: "DOOR_KNOCK"},
                    { type: "textMessage", text: "I didn't order anything."},
                    { type: "finishDelivery"}
                ]
            },
            {
                required: ["CONFIRMED_PICKUP", this.storyFlag] ,
                events: [
                { type: "textMessage", text:  "You don't have their order yet!"},
    
                ]   
            },
            {
                required: ["ORDER_TAKEN",  ] ,
                events: [
                { type: "textMessage", text:  "They are not expecting an order."},

                ]   
            },
            {
                required: ["ORDER_TAKEN",  ] ,
                events: [
                // { type: "textMessage", text:  "You have not picked up an order yet."},
                { type: "textMessage", text: "You ring the doorbell" },
                { type: "addStoryFlag", flag: "DOOR_KNOCK"},
                { type: "textMessage", text: "I didn't order anything."},
                { type: "finishDelivery"}

                ]   
            },
            {
                required: ["RECENT_DELIVERY", config.storyFlag],
                events: [
                { type: "textMessage", text: "No order to deliver." },

                ]   
            },
            {
                // required: [this.storyFlag],
                events: [
                { type: "textMessage", text: "No order to deliver." },

                ]   
            },

        ]

        if (config.src === "./images/characters/people/npc1.png" && config.storyFlag) {
                this.talking = [
                    {
                required: ["ORDER_TAKEN"  ] ,
                events: [
                // { type: "textMessage", text:  "You have not picked up an order yet."},
                { type: "textMessage", text: "You ring the doorbell" },
                { type: "addStoryFlag", flag: "DOOR_KNOCK"},
                { type: "textMessage", text: "I didn't order anything."},
                { type: "finishDelivery"},
                ]
            },
            {
                events: [

                { type: "textMessage", text: "You ring the doorbell" },
                { type: "addStoryFlag", flag: "DOOR_KNOCK"},
                { type: "textMessage", text: "What do you want?"},
                { type: "textMessage", text: "Huh?"},
                { type: "textMessage", text: "No, I didn't order anything"},
                { type: "removeStoryFlag", flag: "DOOR_KNOCK"},
                // { type: "finishDelivery"}, 
                ]
            }
            ]
            }


        // if (config.src === "./images/characters/people/npc1.png") {
        //     console.log(this.sprite.currentAnimation)
        // // this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag = "RECENT_DELIVERY"] ? "Noone" : "Full";
        // this.sprite.currentAnimation =  "Noone";        
        // } 
        // console.log(this.sprite.image.src == 'http://localhost:8000/images/characters/people/npc1.png')

    }

    update() {
        // this.sprite.currentAnimation = "Noone" ;
        if (this.sprite.image.src == 'http://localhost:8000/images/characters/people/npc1.png') {
            // console.log(this.storyFlag )
            // this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag = "RECENT_DELIVERY"] ? "Noone" : "Full";
            this.sprite.currentAnimation = "Noone";  
            
        } else {

        this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag = "ORDER_TAKEN"] ? "Empty" : "Full";}
       }
}