class Phone {
    constructor({ map, onComplete }) {

        // this.dispatcher = dispatcher;
        // this.restaurant = restaurant;
        this.map = map;
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
        console.log("Phone closed")
        this.keyQ?.unbind();
        // this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }

    async init(container) {
        this.createElement();
        console.log(playerState.storyFlags);
        console.log(playerState.players.p1.orders);
        container.appendChild(this.element);
        if (playerState.storyFlags[this.storyFlag = "ORDER_ACCEPTED"] || playerState.storyFlags[this.storyFlag = "ORDER_TAKEN"]) {
            this.offer = new Offer(this.map)
            this.offer.init(container);
            utils.wait(200);
        }

        // Put away the phone
        this.keyQ = new KeyPressListener("KeyQ", () =>{
            console.log("KeyQ close")
            this.close();
        })
        // if (!this.offer.offerMenu) {
        //     this.keyQ = new KeyPressListener("Space", () =>{
        //         console.log("Space close")
        //         console.log(this.offer.offerMenu)
        //         // this.close();
        // })
        // }

        this.element.querySelector(".home_btn").addEventListener("click", () => {
            console.log("Home button close")
            this.close();
        });
    }
}