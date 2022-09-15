class BigSign extends GameObject{
    constructor(config) {
        super(config);
        
        this.sprite = new Sprite({
            useShadow: false,
            gameObject: this,
            useShadow: false,
            src: config.src || "images/Objects/BigSign.png",
            animations: {
                "Empty" :  [ [0,0] ],
                // "Full" :   [ [1,0] ],
            },
            currentAnimation: "Empty",

        });
        this.storyFlag = config.storyFlag;
        this.useShadow = false;



        

        this.talking = [
            {
                required: [],
                events: [

                    { type: "textMessage", text: "Full Stack Developer" },
                    { type: "addStoryFlag", flag: "HAVEREAD" },
                
                ]   
            },
        ] 
    }

    update() {
        // this.pickUp = window.playerState.players.p1.orders;
        // console.log(this.pickUp)

        this.storyFlags = this.storyFlag
        // this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag = "ORDER_ACCEPTED"]
        //     ? "Full"
        //     : "Empty";
        
       }
}