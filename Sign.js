class Sign extends GameObject{
    constructor(config) {
        super(config);
        
        this.sprite = new Sprite({
            gameObject: this,
            useShadow: true,
            src: config.src || "images/Objects/sign.png",
            animations: {
                "Empty" :  [ [0,0] ],
                // "Full" :   [ [1,0] ],
            },
            currentAnimation: "Empty",

        });
        this.storyFlag = config.storyFlag;
        this.useShadow = true;


        
    }

    update() {


        this.storyFlags = this.storyFlag

        
       }
}