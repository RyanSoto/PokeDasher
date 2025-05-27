class PhoneNotification {
    constructor({ map,  onComplete }) {

        // this.dispatcher = dispatcher;
        // this.restaurant = restaurant;
        this.map = map;
        // this.offerExist = offerExist;
        this.onComplete = onComplete;

    }
    

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("iPhoneNotification");
        this.element.innerHTML = (`

        <div class="IphoneNotification_btn">
            <img src="images/Objects/iPhone.png" alt="Notification">
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
        // console.log(playerState.storyFlags);
        // console.log(playerState.players.p1.orders);
        container.appendChild(this.element);
        // this.offer = new Offer(this.map )
        // this.offer.init(container);
        utils.wait(200);

        // // Put away the phone
        // this.keyQ = new KeyPressListener("KeyQ", () =>{
        //     console.log("KeyQ close")
        //     this.close();
        // })
        // if (!this.offer.offerMenu) {
        //     this.keyQ = new KeyPressListener("Space", () =>{
        //         console.log("Space close")
        //         console.log(this.offer.offerMenu)
        //         // this.close();
        // })
        // }

        this.element.querySelector(".IphoneNotification_btn").addEventListener("click", () => {
            console.log("Iphone Notification close")
            // this.offerExist = false;
            this.close();
        });
    }
}