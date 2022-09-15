class Phone {
    constructor({dispatcher, restaurant, onComplete}) {

        // this.dispatcher = dispatcher;
        // this.restaurant = restaurant;
        this.onComplete = onComplete;

    }
    

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("iPhone");
        this.element.innerHTML = (`

        <div class="iphone_outer">
        <div class="iphone_inner">
            <div class="top_camera"></div>
            <div class="camera"></div>
            <div class="speaker"></div>
            <div class="iphone_screen">
            </div>

            <div class="home_btn"></div>
            <div class="shine"></div>


        </div>
        </div>
        `)


    }
    
    close() {
        this.keyQ?.unbind();
        // this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }

    async init(container) {
        this.createElement();


        // this.keyboardMenu = new KeyboardMenu({
        //     descriptionContainer: container
        // })
        // this.keyboardMenu.init(this.element);
        // this.keyboardMenu.setOptions(this.getOptions("root"));
        console.log(playerState.storyFlags);
        console.log(playerState.players.p1.orders);
        container.appendChild(this.element);
        
            this.offer = new Offer({});
            this.offer.init(container);
        
        utils.wait(200);
        this.keyQ = new KeyPressListener("KeyQ", () =>{
            this.close();
        })
    }
}